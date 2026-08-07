import { colors, typography } from '@comma/design-system';
import * as styles from './MyPageCard.css';

function MyPageCard({
  backgroundUrl,
  num,
  count,
  title,
  path,
  width,
  height,
  x
}: {
  backgroundUrl?: string;
  num: number;
  count: number;
  title: string;
  path: string;
  width: number;
  height: number;
  x: number;
}) {
  const resolvedBackgroundUrl = backgroundUrl ? backgroundUrl : '/images/feed-image.svg';

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
      <div
        className={styles.cardStyle}
        style={{
          width,
          height,
          clipPath: `path("${path}")`
        }}
      >
        <img
          alt=""
          aria-hidden="true"
          className={styles.cardBackgroundImage}
          decoding="async"
          draggable={false}
          loading="eager"
          src={resolvedBackgroundUrl}
        />
        <div aria-hidden="true" className={styles.cardGradient} />
        <div
          className={styles.cardContent}
          style={{ ...typography.engNum, fontSize: 64, color: '#FCFCFC66', textAlign: 'right' }}
        >
          #{num}
        </div>
        <div className={styles.cardContent} style={{ display: 'flex', flexDirection: 'column' }}>
          <div>
            <span style={{ ...typography.engNum, fontSize: 48, color: colors.textPrimary }}>
              {count}
            </span>
            <span style={{ ...typography.headingR, color: colors.textSecondary }}> 회</span>
          </div>
          <span style={{ ...typography.headingB, color: colors.textSecondary }}>{title}</span>
        </div>
      </div>
    </div>
  );
}

export default MyPageCard;
