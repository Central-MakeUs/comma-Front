import { ImageUpload } from '@comma/design-system';
import * as styles from './RestResultScreen.css';

interface RestResultCardProps {
  height: number;
  imageSrc?: string;
  path: string;
  width: number;
  x: number;
  isNative: boolean;
}

export function RestResultCard({ height, imageSrc, path, width, x, isNative }: RestResultCardProps) {
  return (
    <div
      style={{
        position: 'absolute',
        top: '50%',
        left: 0,
        transform: `translate(${x}px, -50%)`,
        width,
        height
      }}
    >
      <ImageUpload
        className={styles.imageUploadStyle}
        imageSrc={imageSrc}
        state="exist"
        style={{ width, height, borderRadius: 0, clipPath: `path("${path}")` }}
        isNative={isNative}
      />
    </div>
  );
}
