import type { PreparedGalleryPhoto } from '@comma/bridge';
import { colors, Icon, ImageUpload } from '@comma/design-system';
import { type ChangeEvent, useEffect, useRef, useState } from 'react';
import { appBridge } from '../../bridge';
import { EMPTY_PHOTO_TILES, PHOTO_PICKER_IMAGES } from './RestActivity.constants';
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

const GALLERY_PHOTO_LIMIT = 30;
const GALLERY_BRIDGE_RETRY_COUNT = 8;
const GALLERY_BRIDGE_RETRY_DELAY_MS = 150;

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

async function getNativeGalleryPhotos() {
  let lastError: unknown;

  for (let attempt = 0; attempt <= GALLERY_BRIDGE_RETRY_COUNT; attempt += 1) {
    try {
      return await appBridge.getGalleryPhotos(GALLERY_PHOTO_LIMIT);
    } catch (error) {
      lastError = error;

      if (!isReactNativeWebView() || attempt === GALLERY_BRIDGE_RETRY_COUNT) {
        break;
      }

      await wait(GALLERY_BRIDGE_RETRY_DELAY_MS);
    }
  }

  throw lastError;
}

export function RestActivityPhotoPicker({ onClose, onPhotoSelect }: RestActivityPhotoPickerProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const isActiveRef = useRef(true);
  const [galleryPhotos, setGalleryPhotos] = useState<GalleryPhotoItem[]>([]);
  const [preparingAssetId, setPreparingAssetId] = useState<string>();
  const isNativeGallery = isReactNativeWebView();
  const photos =
    galleryPhotos.length > 0 ? galleryPhotos : isNativeGallery ? [] : PHOTO_PICKER_IMAGES;
  const tileCount = photos.length + 1;
  const emptyTileCount = isNativeGallery && photos.length === 0 ? 5 : (3 - (tileCount % 3)) % 3;

  useEffect(() => {
    let isActive = true;

    getNativeGalleryPhotos()
      .then((nativePhotos) => {
        if (!isActive) return;

        setGalleryPhotos(
          nativePhotos.map((photo) => ({
            id: photo.id,
            src: photo.uri
          }))
        );
      })
      .catch((error) => {
        console.warn('Failed to load gallery photos.', error);
        if (isActive) {
          setGalleryPhotos([]);
        }
      });

    return () => {
      isActive = false;
    };
  }, []);

  useEffect(() => {
    isActiveRef.current = true;

    return () => {
      isActiveRef.current = false;
    };
  }, []);

  const handleImageChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.currentTarget.files?.[0];

    if (!file) return;

    onPhotoSelect({
      kind: 'file',
      previewSrc: URL.createObjectURL(file),
      file
    });
    event.currentTarget.value = '';
  };

  const handleNativePhotoSelect = async (photo: GalleryPhotoItem) => {
    if (preparingAssetId) return;

    setPreparingAssetId(photo.id);

    try {
      const preparedPhoto = await appBridge.prepareGalleryPhoto(photo.id);

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
      alert(error instanceof Error ? error.message : '사진을 불러오지 못했어요.');
      setPreparingAssetId(undefined);
    }
  };

  return (
    <main className={sharedStyles.page}>
      <div className={styles.screen}>
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
            onClick={() => fileInputRef.current?.click()}
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
