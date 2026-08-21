import type { PreparedGalleryPhoto } from '@comma/bridge';
import { colors, Icon, ImageUpload } from '@comma/design-system';
import {
  type ChangeEvent,
  type CSSProperties,
  type UIEvent,
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState
} from 'react';
import { appBridge } from '../../../shared/bridge/bridge';
import { useAppToast } from '../../../shared/components/AppToast';
import { MAX_UPLOAD_FILE_SIZE, readFileAsBase64 } from '../lib/photoFile';
import { EMPTY_PHOTO_TILES, PHOTO_PICKER_IMAGES } from '../model/restActivity.constants';
import * as sharedStyles from './RestActivity.shared.css';
import * as styles from './RestActivityPhotoPicker.css';

type GalleryPhotoItem = {
  id: string;
  src: string;
};

type NativeGalleryPageResult = Awaited<ReturnType<typeof getNativeGalleryPhotos>>;

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
const PHOTO_GRID_COLUMN_COUNT = 3;
const PHOTO_GRID_GAP = 3;
const PHOTO_GRID_ROW_OVERSCAN = 4;

type RestActivityPhotoPickerProps = {
  onClose: () => void;
  onPhotoSelect: (photo: SelectedActivityPhoto) => void;
};

type VirtualPhotoTile =
  | {
      kind: 'camera';
      key: string;
    }
  | {
      kind: 'photo';
      key: string;
      photo: GalleryPhotoItem;
    }
  | {
      kind: 'empty';
      key: string;
    }
  | {
      kind: 'skeleton';
      key: string;
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

function normalizeNativeGalleryPage(page: NativeGalleryPageResult | null | undefined) {
  return {
    photos: Array.isArray(page?.photos) ? page.photos : [],
    endCursor: typeof page?.endCursor === 'string' ? page.endCursor : null,
    hasNextPage: typeof page?.hasNextPage === 'boolean' ? page.hasNextPage : false
  };
}

export function RestActivityPhotoPicker({ onClose, onPhotoSelect }: RestActivityPhotoPickerProps) {
  const { showToast } = useAppToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const screenRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLElement>(null);
  const photoGridRef = useRef<HTMLDivElement>(null);
  const isActiveRef = useRef(true);
  const isGalleryLoadingRef = useRef(false);
  const galleryScrollFrameRef = useRef<number | null>(null);
  const galleryScrollMetricsRef = useRef({ scrollTop: 0, viewportHeight: 0 });
  const galleryEndCursorRef = useRef<string | undefined>(undefined);
  const galleryHasNextPageRef = useRef(true);
  const [galleryPhotos, setGalleryPhotos] = useState<GalleryPhotoItem[]>([]);
  const [useNativeGallery, setUseNativeGallery] = useState(isReactNativeWebView());
  const [isGalleryLoadingInitial, setIsGalleryLoadingInitial] = useState(isReactNativeWebView());
  const [isGalleryLoadingMore, setIsGalleryLoadingMore] = useState(false);
  const [galleryHasNextPage, setGalleryHasNextPage] = useState(true);
  const [preparingAssetId, setPreparingAssetId] = useState<string>();
  const [virtualMetrics, setVirtualMetrics] = useState({
    gridOffsetTop: 0,
    gridWidth: 0,
    scrollTop: 0,
    viewportHeight: 0
  });
  const isNativeGallery = useNativeGallery;
  const isGalleryLoading = isGalleryLoadingInitial || isGalleryLoadingMore;
  const photos =
    galleryPhotos.length > 0 ? galleryPhotos : isNativeGallery ? [] : PHOTO_PICKER_IMAGES;
  const tileCount = photos.length + 1;
  const emptyTileCount = isGalleryLoading
    ? 0
    : isNativeGallery && photos.length === 0
      ? 5
      : (3 - (tileCount % 3)) % 3;
  const virtualPhotoTiles = useMemo<VirtualPhotoTile[]>(
    () => [
      { kind: 'camera', key: 'camera' },
      ...photos.map((photo) => ({ kind: 'photo' as const, key: photo.id, photo })),
      ...EMPTY_PHOTO_TILES.slice(0, emptyTileCount).map((tile) => ({
        kind: 'empty' as const,
        key: `empty-${tile}`
      })),
      ...Array.from(
        { length: isGalleryLoadingInitial ? INITIAL_GALLERY_SKELETON_COUNT : 0 },
        (_, index) => ({
          kind: 'skeleton' as const,
          key: `initial-gallery-skeleton-${index}`
        })
      ),
      ...Array.from(
        { length: isGalleryLoadingMore ? LOAD_MORE_GALLERY_SKELETON_COUNT : 0 },
        (_, index) => ({
          kind: 'skeleton' as const,
          key: `more-gallery-skeleton-${index}`
        })
      )
    ],
    [emptyTileCount, isGalleryLoadingInitial, isGalleryLoadingMore, photos]
  );
  const photoTileWidth = Math.max(
    (virtualMetrics.gridWidth - PHOTO_GRID_GAP * (PHOTO_GRID_COLUMN_COUNT - 1)) /
      PHOTO_GRID_COLUMN_COUNT,
    1
  );
  const photoTileHeight = Math.max((virtualMetrics.gridWidth - 54) / PHOTO_GRID_COLUMN_COUNT, 1);
  const photoColumnStride = photoTileWidth + PHOTO_GRID_GAP;
  const photoRowStride = photoTileHeight + PHOTO_GRID_GAP;
  const photoRowCount = Math.ceil(virtualPhotoTiles.length / PHOTO_GRID_COLUMN_COUNT);
  const photoGridHeight =
    photoRowCount > 0 ? photoRowCount * photoTileHeight + (photoRowCount - 1) * PHOTO_GRID_GAP : 0;
  const visiblePhotoTop = Math.max(virtualMetrics.scrollTop - virtualMetrics.gridOffsetTop, 0);
  const visiblePhotoBottom = Math.max(visiblePhotoTop + virtualMetrics.viewportHeight, 0);
  const firstVisiblePhotoRow = Math.max(
    Math.floor(visiblePhotoTop / photoRowStride) - PHOTO_GRID_ROW_OVERSCAN,
    0
  );
  const lastVisiblePhotoRow = Math.min(
    Math.ceil(visiblePhotoBottom / photoRowStride) + PHOTO_GRID_ROW_OVERSCAN,
    Math.max(photoRowCount - 1, 0)
  );
  const firstVisiblePhotoIndex = firstVisiblePhotoRow * PHOTO_GRID_COLUMN_COUNT;
  const lastVisiblePhotoIndex = Math.min(
    (lastVisiblePhotoRow + 1) * PHOTO_GRID_COLUMN_COUNT,
    virtualPhotoTiles.length
  );
  const visiblePhotoTiles = virtualPhotoTiles
    .slice(firstVisiblePhotoIndex, lastVisiblePhotoIndex)
    .map((tile, visibleIndex) => ({
      tile,
      index: firstVisiblePhotoIndex + visibleIndex
    }));

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
        const nativePage = normalizeNativeGalleryPage(await getNativeGalleryPhotos(after));
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
          setUseNativeGallery(false);
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
      if (galleryScrollFrameRef.current !== null) {
        window.cancelAnimationFrame(galleryScrollFrameRef.current);
        galleryScrollFrameRef.current = null;
      }
    };
  }, []);

  useLayoutEffect(() => {
    const updateVirtualMetrics = () => {
      const screen = screenRef.current;
      const photoGrid = photoGridRef.current;
      if (!screen || !photoGrid) return;

      const nextMetrics = {
        gridOffsetTop: photoGrid.offsetTop,
        gridWidth: photoGrid.clientWidth,
        scrollTop: screen.scrollTop,
        viewportHeight: screen.clientHeight
      };

      setVirtualMetrics((currentMetrics) =>
        currentMetrics.gridOffsetTop === nextMetrics.gridOffsetTop &&
        currentMetrics.gridWidth === nextMetrics.gridWidth &&
        currentMetrics.scrollTop === nextMetrics.scrollTop &&
        currentMetrics.viewportHeight === nextMetrics.viewportHeight
          ? currentMetrics
          : nextMetrics
      );
    };

    updateVirtualMetrics();
    window.addEventListener('resize', updateVirtualMetrics);
    const resizeObserver =
      typeof ResizeObserver !== 'undefined' ? new ResizeObserver(updateVirtualMetrics) : undefined;
    if (screenRef.current) resizeObserver?.observe(screenRef.current);
    if (contentRef.current) resizeObserver?.observe(contentRef.current);
    if (photoGridRef.current) resizeObserver?.observe(photoGridRef.current);

    return () => {
      window.removeEventListener('resize', updateVirtualMetrics);
      resizeObserver?.disconnect();
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
    if (file.size > MAX_UPLOAD_FILE_SIZE) {
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
      setUseNativeGallery(false);
      onPhotoSelect({
        kind: 'file',
        previewSrc: URL.createObjectURL(file),
        file
      });
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
    const { clientHeight, scrollHeight, scrollTop } = event.currentTarget;
    galleryScrollMetricsRef.current = {
      scrollTop,
      viewportHeight: clientHeight
    };

    if (galleryScrollFrameRef.current === null) {
      galleryScrollFrameRef.current = window.requestAnimationFrame(() => {
        galleryScrollFrameRef.current = null;
        const { scrollTop: nextScrollTop, viewportHeight: nextViewportHeight } =
          galleryScrollMetricsRef.current;

        setVirtualMetrics((currentMetrics) =>
          currentMetrics.scrollTop === nextScrollTop &&
          currentMetrics.viewportHeight === nextViewportHeight
            ? currentMetrics
            : {
                ...currentMetrics,
                scrollTop: nextScrollTop,
                viewportHeight: nextViewportHeight
              }
        );
      });
    }

    if (!isNativeGallery || !galleryHasNextPage) return;

    const distanceToBottom = scrollHeight - scrollTop - clientHeight;
    if (distanceToBottom <= GALLERY_LOAD_MORE_THRESHOLD_PX) {
      void loadNativeGalleryPage();
    }
  };

  return (
    <main className={sharedStyles.page}>
      <div className={styles.screen} onScroll={handleGalleryScroll} ref={screenRef}>
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

        <section className={styles.content} aria-label="사진 선택" ref={contentRef}>
          <ImageUpload
            className={sharedStyles.upload}
            onClick={() => fileInputRef.current?.click()}
            state="select"
          />
        </section>

        <div
          className={styles.photoGrid}
          ref={photoGridRef}
          style={{ height: photoGridHeight } as CSSProperties}
        >
          {visiblePhotoTiles.map(({ tile, index }) => {
            const row = Math.floor(index / PHOTO_GRID_COLUMN_COUNT);
            const column = index % PHOTO_GRID_COLUMN_COUNT;
            const tileStyle = {
              width: photoTileWidth,
              height: photoTileHeight,
              transform: `translate3d(${column * photoColumnStride}px, ${row * photoRowStride}px, 0)`
            } as CSSProperties;

            if (tile.kind === 'camera') {
              return (
                <button
                  aria-label="카메라로 사진 선택"
                  className={`${styles.cameraTile} ${styles.virtualPhotoTile}`}
                  disabled={Boolean(preparingAssetId)}
                  key={tile.key}
                  onClick={() => {
                    void handleCameraClick();
                  }}
                  style={tileStyle}
                  type="button"
                >
                  <Icon color={colors.iconPrimary} height={40} name="camera" width={40} />
                </button>
              );
            }

            if (tile.kind === 'photo') {
              return (
                <button
                  aria-label="사진 선택"
                  className={`${styles.photoTile} ${styles.virtualPhotoTile}`}
                  disabled={Boolean(preparingAssetId)}
                  key={tile.key}
                  onClick={() => {
                    if (galleryPhotos.length > 0) {
                      void handleNativePhotoSelect(tile.photo);
                      return;
                    }

                    onPhotoSelect({
                      kind: 'preview',
                      previewSrc: tile.photo.src
                    });
                  }}
                  style={tileStyle}
                  type="button"
                >
                  <img
                    alt=""
                    className={styles.photoTileImage}
                    decoding="async"
                    src={tile.photo.src}
                  />
                </button>
              );
            }

            if (tile.kind === 'empty') {
              return (
                <div
                  className={`${styles.emptyPhotoTile} ${styles.virtualPhotoTile}`}
                  key={tile.key}
                  style={tileStyle}
                />
              );
            }

            return (
              <div
                aria-hidden="true"
                className={`${styles.photoSkeletonTile} ${styles.virtualPhotoTile}`}
                key={tile.key}
                style={tileStyle}
              />
            );
          })}
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
