import { colors, Icon, ImageUpload } from '@comma/design-system';
import type { ChangeEvent, RefObject } from 'react';
import { EMPTY_PHOTO_TILES } from './RestActivity.constants';
import * as styles from './RestActivity.css';

export type GalleryPhotoItem = {
  id: string;
  src: string;
};

type RestActivityPhotoPickerProps = {
  fileInputRef: RefObject<HTMLInputElement | null>;
  photos: GalleryPhotoItem[];
  onClose: () => void;
  onImageChange: (event: ChangeEvent<HTMLInputElement>) => void;
  onPhotoSelect: (src: string) => void;
};

export function RestActivityPhotoPicker({
  fileInputRef,
  photos,
  onClose,
  onImageChange,
  onPhotoSelect
}: RestActivityPhotoPickerProps) {
  const tileCount = photos.length + 1;
  const emptyTileCount = (3 - (tileCount % 3)) % 3;

  return (
    <main className={styles.page}>
      <div className={styles.photoPickerScreen}>
        <div aria-hidden="true" className={styles.topGradient} />
        <div aria-hidden="true" className={styles.bottomGradient} />

        <header className={styles.photoPickerHeader}>
          <button
            aria-label="사진 선택 닫기"
            className={styles.iconButton}
            onClick={onClose}
            type="button"
          >
            <Icon color={colors.iconPrimary} name="backArrow" />
          </button>
        </header>

        <section className={styles.photoPickerContent} aria-label="사진 선택">
          <ImageUpload
            className={styles.upload}
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
          onChange={onImageChange}
          type="file"
        />
      </div>
    </main>
  );
}
