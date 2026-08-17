import type {
  FeedCreateRequest,
  FeedResponse,
  GalleryPhotoQuery,
  NativeFilePhoto,
  PreparedGalleryPhoto
} from '@comma/bridge';
import { NATIVE_FEED_UPLOAD_UNAUTHORIZED_ERROR } from '@comma/bridge';
import * as Crypto from 'expo-crypto';
import * as FileSystem from 'expo-file-system/legacy';
import * as ImageManipulator from 'expo-image-manipulator';
import * as ImagePicker from 'expo-image-picker';
import * as MediaLibrary from 'expo-media-library';
import { Platform } from 'react-native';
import { getTrustedApiBaseUrl, readAuthTokens, refreshNativeAuthSession } from './nativeAuth';

const MAX_GALLERY_PHOTOS = 30;
const DEFAULT_IMAGE_MIME_TYPE = 'image/jpeg';
const FEED_UPLOAD_TIMEOUT_MS = 18_000;
const UPLOAD_FRAME_WIDTH = 345;
const UPLOAD_FRAME_HEIGHT = 438;
const UPLOAD_FRAME_RATIO = UPLOAD_FRAME_WIDTH / UPLOAD_FRAME_HEIGHT;
const PREPARED_UPLOAD_WIDTH = 1080;
const GALLERY_THUMBNAIL_WIDTH = 240;
const PREPARED_PREVIEW_WIDTH = 690;
const GALLERY_THUMBNAIL_CONCURRENCY = 3;
const GALLERY_THUMBNAIL_TIMEOUT_MS = 1_500;
const PREPARED_PHOTO_TTL_MS = 5 * 60 * 1000;
const MAX_IMPORTED_FILE_BYTES = 15 * 1024 * 1024;
const MAX_IMPORTED_BASE64_LENGTH = Math.ceil((MAX_IMPORTED_FILE_BYTES * 4) / 3) + 4;

interface NativePreparedPhoto {
  uri: string;
  filename: string;
  mimeType: string;
  width: number;
  height: number;
  cleanupTimer?: ReturnType<typeof setTimeout>;
}

interface UploadableImage {
  uri: string;
  name: string;
  type: string;
  width: number;
  height: number;
}

const androidGalleryAssets = new Map<string, MediaLibrary.Asset>();
const preparedPhotos = new Map<string, NativePreparedPhoto>();
const photoPreparationPromises = new Map<string, Promise<PreparedGalleryPhoto>>();

export async function deletePreparedPhoto(handle: string) {
  const photo = preparedPhotos.get(handle);
  if (!photo) return;

  preparedPhotos.delete(handle);
  if (photo.cleanupTimer) clearTimeout(photo.cleanupTimer);
  await FileSystem.deleteAsync(photo.uri, { idempotent: true });
}

export function retainPreparedPhoto(handle: string) {
  const photo = preparedPhotos.get(handle);
  if (!photo?.cleanupTimer) return;

  clearTimeout(photo.cleanupTimer);
  photo.cleanupTimer = undefined;
}

const mapWithConcurrency = async <T, R>(
  values: readonly T[],
  concurrency: number,
  mapper: (value: T) => Promise<R>
): Promise<PromiseSettledResult<R>[]> => {
  const results = new Array<PromiseSettledResult<R>>(values.length);
  let nextIndex = 0;

  const worker = async () => {
    while (nextIndex < values.length) {
      const index = nextIndex;
      nextIndex += 1;

      try {
        results[index] = { status: 'fulfilled', value: await mapper(values[index]) };
      } catch (reason) {
        results[index] = { status: 'rejected', reason };
      }
    }
  };

  await Promise.all(Array.from({ length: Math.min(concurrency, values.length) }, () => worker()));
  return results;
};

const clampGalleryLimit = (limit: number) => {
  if (!Number.isFinite(limit)) return MAX_GALLERY_PHOTOS;
  return Math.min(Math.max(Math.trunc(limit), 1), MAX_GALLERY_PHOTOS);
};

const getFilenameFromUri = (uri: string, fallback: string) => {
  const filename = uri.split('/').pop()?.split('?')[0];
  return filename?.includes('.') ? filename : fallback;
};

const getMimeType = (filename?: string) => {
  const extension = filename?.split('.').pop()?.toLowerCase();
  if (extension === 'png') return 'image/png';
  if (extension === 'webp') return 'image/webp';
  if (extension === 'heic') return 'image/heic';
  if (extension === 'heif') return 'image/heif';
  return DEFAULT_IMAGE_MIME_TYPE;
};

const createImageDataUri = async (uri: string, width: number) => {
  const thumbnail = await ImageManipulator.manipulateAsync(uri, [{ resize: { width } }], {
    compress: 0.7,
    format: ImageManipulator.SaveFormat.JPEG
  });

  try {
    const base64 = await FileSystem.readAsStringAsync(thumbnail.uri, {
      encoding: FileSystem.EncodingType.Base64
    });
    return `data:${DEFAULT_IMAGE_MIME_TYPE};base64,${base64}`;
  } finally {
    await FileSystem.deleteAsync(thumbnail.uri, { idempotent: true }).catch(() => {});
  }
};

const withTimeout = async <T>(
  promise: Promise<T>,
  timeoutMs: number,
  message: string
): Promise<T> => {
  let timeoutId: ReturnType<typeof setTimeout> | undefined;
  const timeout = new Promise<never>((_, reject) => {
    timeoutId = setTimeout(() => reject(new Error(message)), timeoutMs);
  });

  try {
    return await Promise.race([promise, timeout]);
  } finally {
    if (timeoutId) clearTimeout(timeoutId);
  }
};

const createGalleryThumbnailDataUri = (uri: string) =>
  withTimeout(
    createImageDataUri(uri, GALLERY_THUMBNAIL_WIDTH),
    GALLERY_THUMBNAIL_TIMEOUT_MS,
    '사진 썸네일 생성 시간이 초과되었어요.'
  );

const getLocalAssetUri = (assetInfo: MediaLibrary.AssetInfo) => {
  const localUri = assetInfo.localUri ?? assetInfo.uri;
  return localUri?.startsWith('ph://') ? undefined : localUri;
};

const getUploadableAsset = async (assetId: string): Promise<UploadableImage> => {
  if (Platform.OS === 'android') {
    const asset = androidGalleryAssets.get(assetId);
    if (!asset?.uri) {
      throw new Error('선택한 사진 정보를 불러오지 못했어요. 사진을 다시 선택해 주세요.');
    }

    return {
      uri: asset.uri,
      name: asset.filename ?? getFilenameFromUri(asset.uri, `${asset.id}.jpg`),
      type: getMimeType(asset.filename),
      width: asset.width,
      height: asset.height
    };
  }

  const assetInfo = await MediaLibrary.getAssetInfoAsync(assetId, {
    shouldDownloadFromNetwork: true
  });
  const uri = assetInfo.localUri ?? assetInfo.uri;
  if (!uri || uri.startsWith('ph://')) {
    throw new Error('선택한 사진을 업로드 가능한 파일로 불러오지 못했어요.');
  }

  const name = assetInfo.filename ?? getFilenameFromUri(uri, `${assetInfo.id}.jpg`);
  return {
    uri,
    name,
    type: getMimeType(name),
    width: assetInfo.width,
    height: assetInfo.height
  };
};

const getUploadableCameraAsset = (asset: ImagePicker.ImagePickerAsset): UploadableImage => {
  const name = asset.fileName ?? getFilenameFromUri(asset.uri, `camera-${Date.now()}.jpg`);
  return {
    uri: asset.uri,
    name,
    type: asset.mimeType ?? getMimeType(name),
    width: asset.width,
    height: asset.height
  };
};

const getCenteredCrop = (width: number, height: number) => {
  const sourceRatio = width / height;
  if (sourceRatio > UPLOAD_FRAME_RATIO) {
    const cropWidth = Math.round(height * UPLOAD_FRAME_RATIO);
    return {
      originX: Math.round((width - cropWidth) / 2),
      originY: 0,
      width: cropWidth,
      height
    };
  }

  const cropHeight = Math.round(width / UPLOAD_FRAME_RATIO);
  return {
    originX: 0,
    originY: Math.round((height - cropHeight) / 2),
    width,
    height: cropHeight
  };
};

const createPreparedPhotoFromImage = async (
  image: UploadableImage
): Promise<PreparedGalleryPhoto> => {
  const crop = getCenteredCrop(image.width, image.height);
  const actions: ImageManipulator.Action[] = [{ crop }];
  if (crop.width > PREPARED_UPLOAD_WIDTH)
    actions.push({ resize: { width: PREPARED_UPLOAD_WIDTH } });

  const result = await ImageManipulator.manipulateAsync(image.uri, actions, {
    compress: 0.88,
    format: ImageManipulator.SaveFormat.JPEG
  });

  try {
    const previewUri = await createImageDataUri(result.uri, PREPARED_PREVIEW_WIDTH);
    const handle = Crypto.randomUUID();
    const cleanupTimer = setTimeout(() => {
      void deletePreparedPhoto(handle).catch(() => {});
    }, PREPARED_PHOTO_TTL_MS);

    preparedPhotos.set(handle, {
      uri: result.uri,
      filename: `comma-photo-${Date.now()}.jpg`,
      mimeType: DEFAULT_IMAGE_MIME_TYPE,
      width: result.width,
      height: result.height,
      cleanupTimer
    });

    return { uri: handle, previewUri, width: result.width, height: result.height };
  } catch (error) {
    await FileSystem.deleteAsync(result.uri, { idempotent: true }).catch(() => {});
    throw error;
  }
};

export function prepareGalleryPhoto(assetId: string): Promise<PreparedGalleryPhoto> {
  const pendingPreparation = photoPreparationPromises.get(assetId);
  if (pendingPreparation) return pendingPreparation;

  const preparation = getUploadableAsset(assetId)
    .then(createPreparedPhotoFromImage)
    .finally(() => {
      if (photoPreparationPromises.get(assetId) === preparation) {
        photoPreparationPromises.delete(assetId);
      }
    });

  photoPreparationPromises.set(assetId, preparation);
  return preparation;
}

export async function prepareFilePhoto(file: NativeFilePhoto): Promise<PreparedGalleryPhoto> {
  if (!FileSystem.cacheDirectory) throw new Error('임시 파일 저장소를 사용할 수 없어요.');

  const base64 = file.base64.replace(/\s/g, '');
  if (!base64 || base64.length > MAX_IMPORTED_BASE64_LENGTH) {
    throw new Error('15MB 이하의 사진을 선택해 주세요.');
  }
  if (!/^[A-Za-z0-9+/]+={0,2}$/.test(base64)) {
    throw new Error('선택한 사진 데이터를 읽지 못했어요.');
  }

  const importUri = `${FileSystem.cacheDirectory}file-photo-${Crypto.randomUUID()}`;
  let normalizedUri: string | undefined;

  try {
    await FileSystem.writeAsStringAsync(importUri, base64, {
      encoding: FileSystem.EncodingType.Base64
    });
    const normalized = await ImageManipulator.manipulateAsync(importUri, [], {
      compress: 1,
      format: ImageManipulator.SaveFormat.JPEG
    });
    normalizedUri = normalized.uri;

    return await createPreparedPhotoFromImage({
      uri: normalized.uri,
      name: file.filename ?? `selected-photo-${Date.now()}.jpg`,
      type: file.mimeType ?? DEFAULT_IMAGE_MIME_TYPE,
      width: normalized.width,
      height: normalized.height
    });
  } catch (error) {
    if (error instanceof Error && error.message.includes('15MB')) throw error;
    throw new Error('선택한 사진을 불러오지 못했어요. 다른 사진을 선택해 주세요.');
  } finally {
    await FileSystem.deleteAsync(importUri, { idempotent: true }).catch(() => {});
    if (normalizedUri) {
      await FileSystem.deleteAsync(normalizedUri, { idempotent: true }).catch(() => {});
    }
  }
}

export async function getGalleryPhotos(query: GalleryPhotoQuery = {}) {
  const safeLimit = clampGalleryLimit(query.first ?? MAX_GALLERY_PHOTOS);
  const permission = await MediaLibrary.requestPermissionsAsync(false, ['photo']);
  if (!permission.granted) {
    return { photos: [], endCursor: null, hasNextPage: false };
  }

  const assets = await MediaLibrary.getAssetsAsync({
    first: safeLimit,
    after: query.after,
    mediaType: MediaLibrary.MediaType.photo,
    sortBy: [[MediaLibrary.SortBy.creationTime, false]]
  });

  if (Platform.OS === 'android') {
    if (!query.after) androidGalleryAssets.clear();
    const results = await mapWithConcurrency(
      assets.assets,
      GALLERY_THUMBNAIL_CONCURRENCY,
      async (asset) => {
        androidGalleryAssets.set(asset.id, asset);
        return {
          id: asset.id,
          uri: await createGalleryThumbnailDataUri(asset.uri),
          filename: asset.filename,
          width: asset.width,
          height: asset.height
        };
      }
    );
    return {
      photos: results.flatMap((result) => (result.status === 'fulfilled' ? [result.value] : [])),
      endCursor: assets.endCursor || null,
      hasNextPage: assets.hasNextPage
    };
  }

  const results = await mapWithConcurrency(
    assets.assets,
    GALLERY_THUMBNAIL_CONCURRENCY,
    async (asset) => {
      const assetInfo = await MediaLibrary.getAssetInfoAsync(asset, {
        shouldDownloadFromNetwork: false
      });
      const localUri = getLocalAssetUri(assetInfo);
      if (!localUri) throw new Error('사진의 로컬 파일을 불러오지 못했어요.');

      return {
        id: asset.id,
        uri: await createGalleryThumbnailDataUri(localUri),
        filename: asset.filename,
        width: asset.width,
        height: asset.height
      };
    }
  );

  return {
    photos: results.flatMap((result) => {
      if (result.status === 'fulfilled') return [result.value];
      console.warn('Failed to load a gallery photo.', result.reason);
      return [];
    }),
    endCursor: assets.endCursor || null,
    hasNextPage: assets.hasNextPage
  };
}

export async function takeGalleryPhoto() {
  const permission = await ImagePicker.requestCameraPermissionsAsync();
  if (!permission.granted) {
    throw new Error('카메라 권한이 필요해요. 설정에서 카메라 접근을 허용해 주세요.');
  }

  const result = await ImagePicker.launchCameraAsync({ mediaTypes: ['images'], quality: 1 });
  if (result.canceled) return null;

  const asset = result.assets[0];
  if (!asset?.uri || !asset.width || !asset.height) {
    throw new Error('촬영한 사진을 불러오지 못했어요. 다시 촬영해 주세요.');
  }
  return createPreparedPhotoFromImage(getUploadableCameraAsset(asset));
}

export async function createFeedWithMultipart(
  photoHandle: string,
  request: FeedCreateRequest,
  allowRefresh = true
) {
  const image = preparedPhotos.get(photoHandle);
  if (!image) throw new Error('준비된 사진이 만료되었어요. 사진을 다시 선택해 주세요.');
  if (!FileSystem.cacheDirectory) throw new Error('임시 파일 저장소를 사용할 수 없어요.');

  const formData = new FormData();
  const requestFileUri = `${FileSystem.cacheDirectory}feed-request-${Date.now()}.json`;
  await FileSystem.writeAsStringAsync(requestFileUri, JSON.stringify(request));

  formData.append('image', {
    uri: image.uri,
    name: image.filename,
    type: image.mimeType
  } as unknown as Blob);
  formData.append('request', {
    uri: requestFileUri,
    name: 'request.json',
    type: 'application/json'
  } as unknown as Blob);

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), FEED_UPLOAD_TIMEOUT_MS);

  try {
    const tokens = await readAuthTokens();
    if (!tokens) throw new Error(NATIVE_FEED_UPLOAD_UNAUTHORIZED_ERROR);

    const response = await fetch(`${getTrustedApiBaseUrl()}/api/feeds`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${tokens.accessToken}` },
      body: formData,
      signal: controller.signal
    });
    const payload = (await response.json().catch(() => ({}))) as {
      success?: boolean;
      message?: string;
      data?: FeedResponse;
    };

    if (response.status === 401) {
      if (allowRefresh) {
        await refreshNativeAuthSession();
        return createFeedWithMultipart(photoHandle, request, false);
      }
      throw new Error(NATIVE_FEED_UPLOAD_UNAUTHORIZED_ERROR);
    }
    if (!response.ok || !payload.success || !payload.data) {
      throw new Error(payload.message ?? '피드 업로드에 실패했어요.');
    }
    return payload.data;
  } finally {
    clearTimeout(timeoutId);
    await FileSystem.deleteAsync(requestFileUri, { idempotent: true }).catch(() => {});
  }
}
