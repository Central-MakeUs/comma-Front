import { ImageUpload } from '@comma/design-system';
import * as styles from './RestResultCard.css';

function Card({
  imageSrc,
  path,
  width,
  height,
  x
}: {
  imageSrc?: string;
  path: string;
  width: number;
  height: number;
  x: number;
}) {
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
        state="exist"
        imageSrc={imageSrc}
        className={styles.imageUploadStyle}
        style={{ width, height, borderRadius: 0, clipPath: `path("${path}")` }}
      />
    </div>
  );
}

export default Card;
