import { Icon } from '@comma/design-system';
import { Link } from 'react-router-dom';
import * as styles from './FeedToast.css';

type FeedToastProps = {
  isVisible: boolean;
};

function FeedToast({ isVisible }: FeedToastProps) {
  return (
    <div
      aria-hidden={!isVisible}
      className={[
        styles.headerContainer,
        isVisible ? styles.headerContainerVisible : styles.headerContainerHidden
      ].join(' ')}
    >
      <span className={styles.headerText}>
        오늘 아직 쉬지 못했어요.
        <br />
        잠깐 쉼표 찍으러 갈까요?
      </span>
      <Link
        aria-hidden={!isVisible}
        className={styles.headerLink}
        tabIndex={isVisible ? undefined : -1}
        to="/rest/checklist"
      >
        휴식하기 <Icon name="rightArrow" />
      </Link>
    </div>
  );
}

export default FeedToast;
