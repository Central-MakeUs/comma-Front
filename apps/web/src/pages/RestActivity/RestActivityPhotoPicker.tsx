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

type RestActivityPhotoPickerProps = {
  onClose: () => void;
  onPhotoSelect: (src: string) => void;
};

export function RestActivityPhotoPicker({ onClose, onPhotoSelect }: RestActivityPhotoPickerProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [galleryPhotos, setGalleryPhotos] = useState<GalleryPhotoItem[]>([]);
  const photos = galleryPhotos.length > 0 ? galleryPhotos : PHOTO_PICKER_IMAGES;
  const tileCount = photos.length + 1;
  const emptyTileCount = (3 - (tileCount % 3)) % 3;

  useEffect(() => {
    let isActive = true;

    appBridge
      .getGalleryPhotos(30)
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

  const handleImageChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.currentTarget.files?.[0];

    if (!file) return;

    onPhotoSelect(URL.createObjectURL(file));
    event.currentTarget.value = '';
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
              key={photo.id}
              onClick={() => onPhotoSelect(photo.src)}
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
