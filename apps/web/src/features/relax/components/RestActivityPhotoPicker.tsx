import type { PreparedGalleryPhoto } from '@comma/bridge';
import { colors, Icon, ImageUpload } from '@comma/design-system';
import { type ChangeEvent, type UIEvent, useCallback, useEffect, useRef, useState } from 'react';
import { appBridge } from '../../../shared/bridge/bridge';
import { useAppToast } from '../../../shared/components/AppToast';
import { EMPTY_PHOTO_TILES, PHOTO_PICKER_IMAGES } from '../model/restActivity.constants';
import * as sharedStyles from './RestActivity.shared.css';
import * as styles from './RestActivityPhotoPicker.css';

type GalleryPhotoItem = {
  id: string;
  src: string;
};

export type SelectedActivityPhoto =
  | {
      kind: 'file';
      previewSrc: string;
      file: File;
    }
  | {
      kind: 'native';
      previewSrc: string;
      photo: PreparedGalleryPhoto;
    }
  | {
      kind: 'preview';
      previewSrc: string;
    };

const GALLERY_PHOTO_LIMIT = 12;
const GALLERY_BRIDGE_RETRY_COUNT = 8;
const GALLERY_BRIDGE_RETRY_DELAY_MS = 150;
const GALLERY_LOAD_MORE_THRESHOLD_PX = 320;
const INITIAL_GALLERY_SKELETON_COUNT = 11;
const LOAD_MORE_GALLERY_SKELETON_COUNT = 6;
const MAX_NATIVE_FILE_SIZE = 15 * 1024 * 1024;

type RestActivityPhotoPickerProps = {
  onClose: () => void;
  onPhotoSelect: (photo: SelectedActivityPhoto) => void;
};

function isReactNativeWebView() {
  return typeof window !== 'undefined' && Boolean(window.ReactNativeWebView);
}

function wait(ms: number) {
  return new Promise((resolve) => window.setTimeout(resolve, ms));
}

async function waitForNativeGalleryBridge() {
  for (let attempt = 0; attempt <= GALLERY_BRIDGE_RETRY_COUNT; attempt += 1) {
    const appInfo = await appBridge.getAppInfo();

    if (appInfo.platform !== 'web') {
      return;
    }

    if (!isReactNativeWebView() || attempt === GALLERY_BRIDGE_RETRY_COUNT) break;
    await wait(GALLERY_BRIDGE_RETRY_DELAY_MS);
  }

  throw new Error('Native gallery bridge is not ready yet.');
}

async function getNativeGalleryPhotos(after?: string) {
  await waitForNativeGalleryBridge();
  return appBridge.getGalleryPhotos({ first: GALLERY_PHOTO_LIMIT, after });
}

async function takeNativePhoto() {
  await waitForNativeGalleryBridge();
  return appBridge.takeGalleryPhoto();
}

function readFileAsBase64(file: File) {
  return new Promise<string>((resolve, reject) => {
    const reader = new FileReader();

    reader.onerror = () => reject(new Error('선택한 사진 데이터를 읽지 못했어요.'));
    reader.onload = () => {
      if (typeof reader.result !== 'string') {
        reject(new Error('선택한 사진 데이터를 읽지 못했어요.'));
        return;
      }

      const separatorIndex = reader.result.indexOf(',');
      if (separatorIndex < 0) {
        reject(new Error('선택한 사진 데이터를 읽지 못했어요.'));
        return;
      }
      resolve(reader.result.slice(separatorIndex + 1));
    };
    reader.readAsDataURL(file);
  });
}

export function RestActivityPhotoPicker({ onClose, onPhotoSelect }: RestActivityPhotoPickerProps) {
  const { showToast } = useAppToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const isActiveRef = useRef(true);
  const isGalleryLoadingRef = useRef(false);
  const galleryEndCursorRef = useRef<string | undefined>(undefined);
  const galleryHasNextPageRef = useRef(true);
  const [galleryPhotos, setGalleryPhotos] = useState<GalleryPhotoItem[]>([]);
  const [isGalleryLoadingInitial, setIsGalleryLoadingInitial] = useState(isReactNativeWebView());
  const [isGalleryLoadingMore, setIsGalleryLoadingMore] = useState(false);
  const [galleryHasNextPage, setGalleryHasNextPage] = useState(true);
  const [preparingAssetId, setPreparingAssetId] = useState<string>();
  const isNativeGallery = isReactNativeWebView();
  const isGalleryLoading = isGalleryLoadingInitial || isGalleryLoadingMore;
  const photos =
    galleryPhotos.length > 0 ? galleryPhotos : isNativeGallery ? [] : PHOTO_PICKER_IMAGES;
  const tileCount = photos.length + 1;
  const emptyTileCount = isGalleryLoading
    ? 0
    : isNativeGallery && photos.length === 0
      ? 5
      : (3 - (tileCount % 3)) % 3;

  const loadNativeGalleryPage = useCallback(
    async (options?: { reset?: boolean }) => {
      if (!isNativeGallery || isGalleryLoadingRef.current) return;
      if (!options?.reset && !galleryHasNextPageRef.current) return;

      const after = options?.reset ? undefined : galleryEndCursorRef.current;
      isGalleryLoadingRef.current = true;
      if (options?.reset) {
        setIsGalleryLoadingInitial(true);
      } else {
        setIsGalleryLoadingMore(true);
      }

      try {
        const nativePage = await getNativeGalleryPhotos(after);
        if (!isActiveRef.current) return;

        galleryEndCursorRef.current = nativePage.endCursor ?? undefined;
        galleryHasNextPageRef.current = nativePage.hasNextPage;
        setGalleryHasNextPage(nativePage.hasNextPage);
        setGalleryPhotos((currentPhotos) => {
          const nextPhotos = nativePage.photos.map((photo) => ({
            id: photo.id,
            src: photo.uri
          }));

          if (options?.reset) return nextPhotos;

          const seenPhotoIds = new Set(currentPhotos.map((photo) => photo.id));
          return [
            ...currentPhotos,
            ...nextPhotos.filter((photo) => {
              if (seenPhotoIds.has(photo.id)) return false;
              seenPhotoIds.add(photo.id);
              return true;
            })
          ];
        });
      } catch (error) {
        console.warn('Failed to load gallery photos.', error);
        if (isActiveRef.current && options?.reset) {
          setGalleryPhotos([]);
          setGalleryHasNextPage(false);
          galleryHasNextPageRef.current = false;
        }
      } finally {
        if (isActiveRef.current) {
          setIsGalleryLoadingInitial(false);
          setIsGalleryLoadingMore(false);
        }
        isGalleryLoadingRef.current = false;
      }
    },
    [isNativeGallery]
  );

  useEffect(() => {
    if (!isNativeGallery) return undefined;

    void loadNativeGalleryPage({ reset: true });

    return () => {
      galleryEndCursorRef.current = undefined;
      galleryHasNextPageRef.current = true;
    };
  }, [isNativeGallery, loadNativeGalleryPage]);

  useEffect(() => {
    isActiveRef.current = true;

    return () => {
      isActiveRef.current = false;
    };
  }, []);

  const handleImageChange = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.currentTarget.files?.[0];
    event.currentTarget.value = '';

    if (!file) return;

    if (!isNativeGallery) {
      onPhotoSelect({
        kind: 'file',
        previewSrc: URL.createObjectURL(file),
        file
      });
      return;
    }

    if (preparingAssetId) return;
    if (file.size > MAX_NATIVE_FILE_SIZE) {
      showToast('15MB 이하의 사진을 선택해 주세요.');
      return;
    }

    setPreparingAssetId('file');

    try {
      await waitForNativeGalleryBridge();
      const preparedPhoto = await appBridge.prepareFilePhoto({
        base64: await readFileAsBase64(file),
        filename: file.name,
        mimeType: file.type || undefined
      });
      await appBridge.retainPreparedGalleryPhoto(preparedPhoto.uri);

      if (!isActiveRef.current) {
        await appBridge.deletePreparedGalleryPhoto(preparedPhoto.uri).catch(() => {});
        return;
      }

      onPhotoSelect({
        kind: 'native',
        previewSrc: preparedPhoto.previewUri,
        photo: preparedPhoto
      });
    } catch (error) {
      if (!isActiveRef.current) return;

      console.error('Failed to prepare a file photo.', error);
      showToast(error instanceof Error ? error.message : '사진을 불러오지 못했어요.');
      setPreparingAssetId(undefined);
    }
  };

  const handleNativePhotoSelect = async (photo: GalleryPhotoItem) => {
    if (preparingAssetId) return;

    setPreparingAssetId(photo.id);

    try {
      const preparedPhoto = await appBridge.prepareGalleryPhoto(photo.id);
      await appBridge.retainPreparedGalleryPhoto(preparedPhoto.uri);

      if (!isActiveRef.current) {
        await appBridge.deletePreparedGalleryPhoto(preparedPhoto.uri).catch(() => {});
        return;
      }

      onPhotoSelect({
        kind: 'native',
        previewSrc: preparedPhoto.previewUri,
        photo: preparedPhoto
      });
    } catch (error) {
      if (!isActiveRef.current) return;

      console.error('Failed to prepare gallery photo.', error);
      showToast(error instanceof Error ? error.message : '사진을 불러오지 못했어요.');
      setPreparingAssetId(undefined);
    }
  };

  const handleCameraClick = async () => {
    if (!isNativeGallery) {
      fileInputRef.current?.click();
      return;
    }

    if (preparingAssetId) return;

    setPreparingAssetId('camera');

    try {
      const preparedPhoto = await takeNativePhoto();

      if (!preparedPhoto) {
        setPreparingAssetId(undefined);
        return;
      }

      await appBridge.retainPreparedGalleryPhoto(preparedPhoto.uri);

      if (!isActiveRef.current) {
        await appBridge.deletePreparedGalleryPhoto(preparedPhoto.uri).catch(() => {});
        return;
      }

      onPhotoSelect({
        kind: 'native',
        previewSrc: preparedPhoto.previewUri,
        photo: preparedPhoto
      });
    } catch (error) {
      if (!isActiveRef.current) return;

      console.error('Failed to take photo.', error);
      showToast(error instanceof Error ? error.message : '사진을 촬영하지 못했어요.');
      setPreparingAssetId(undefined);
    }
  };

  const handleGalleryScroll = (event: UIEvent<HTMLDivElement>) => {
    if (!isNativeGallery || !galleryHasNextPage) return;

    const { clientHeight, scrollHeight, scrollTop } = event.currentTarget;
    const distanceToBottom = scrollHeight - scrollTop - clientHeight;
    if (distanceToBottom <= GALLERY_LOAD_MORE_THRESHOLD_PX) {
      void loadNativeGalleryPage();
    }
  };

  const skeletonCount = isGalleryLoadingInitial
    ? INITIAL_GALLERY_SKELETON_COUNT
    : isGalleryLoadingMore
      ? LOAD_MORE_GALLERY_SKELETON_COUNT
      : 0;

  return (
    <main className={sharedStyles.page}>
      <div className={styles.screen} onScroll={handleGalleryScroll}>
        <div aria-hidden="true" className={sharedStyles.topGradient} />
        <div aria-hidden="true" className={sharedStyles.bottomGradient} />

        <header className={styles.header}>
          <button
            aria-label="사진 선택 닫기"
            className={sharedStyles.iconButton}
            onClick={onClose}
            type="button"
          >
            <Icon color={colors.iconPrimary} name="backArrow" />
          </button>
        </header>

        <section className={styles.content} aria-label="사진 선택">
          <ImageUpload
            className={sharedStyles.upload}
            onClick={() => fileInputRef.current?.click()}
            state="select"
          />
        </section>

        <div className={styles.photoGrid}>
          <button
            aria-label="카메라로 사진 선택"
            className={styles.cameraTile}
            disabled={Boolean(preparingAssetId)}
            onClick={() => {
              void handleCameraClick();
            }}
            type="button"
          >
            <Icon color={colors.iconPrimary} height={40} name="camera" width={40} />
          </button>
          {photos.map((photo) => (
            <button
              aria-label="사진 선택"
              className={styles.photoTile}
              disabled={Boolean(preparingAssetId)}
              key={photo.id}
              onClick={() => {
                if (galleryPhotos.length > 0) {
                  void handleNativePhotoSelect(photo);
                  return;
                }

                onPhotoSelect({
                  kind: 'preview',
                  previewSrc: photo.src
                });
              }}
              type="button"
            >
              <img alt="" className={styles.photoTileImage} src={photo.src} />
            </button>
          ))}
          {EMPTY_PHOTO_TILES.slice(0, emptyTileCount).map((tile) => (
            <div className={styles.emptyPhotoTile} key={tile} />
          ))}
          {Array.from({ length: skeletonCount }, (_, index) => (
            <div
              aria-hidden="true"
              className={styles.photoSkeletonTile}
              key={`gallery-skeleton-${index}`}
            />
          ))}
        </div>

        <input
          ref={fileInputRef}
          accept="image/*"
          className={styles.hiddenInput}
          onChange={handleImageChange}
          type="file"
        />
      </div>
    </main>
  );
}
