import { CtaButton, colors, Icon } from '@comma/design-system';
import { assignInlineVars } from '@vanilla-extract/dynamic';
import {
  ACTIVITY_PROGRESS_COUNT,
  ACTIVITY_PROGRESS_TITLE,
  REST_DESCRIPTION
} from './RestActivity.constants';
import * as styles from './RestActivity.css';
import { RestActivityReselectModal } from './RestActivityReselectModal';

type RestActivityProgressProps = {
  showReselectModal: boolean;
  onOpenReselectModal: () => void;
  onCancelReselect: () => void;
  onConfirmReselect: () => void;
  onComplete: () => void;
};

export function RestActivityProgress({
  showReselectModal,
  onOpenReselectModal,
  onCancelReselect,
  onConfirmReselect,
  onComplete
}: RestActivityProgressProps) {
  return (
    <main className={styles.page}>
      <div
        className={styles.screen}
        style={assignInlineVars({
          [styles.backgroundImageVar]: 'url(/images/rest_activity_progress.jpg)'
        })}
      >
        <div
          aria-hidden="true"
          className={[styles.dimOverlay, styles.dimOverlayVisible].join(' ')}
        />
        <div aria-hidden="true" className={styles.topGradient} />
        <div aria-hidden="true" className={styles.bottomGradient} />

        <header className={styles.progressHeader}>
          <button
            aria-label="휴식 재선택"
            className={styles.iconButton}
            onClick={onOpenReselectModal}
            type="button"
          >
            <Icon color={colors.iconPrimary} name="x" />
          </button>
        </header>

        <section className={styles.progressContent} aria-labelledby="rest-activity-progress-title">
          <div className={styles.progressHeroText}>
            <h1 className={styles.title} id="rest-activity-progress-title">
              {ACTIVITY_PROGRESS_TITLE}
            </h1>
            <p className={styles.description}>{REST_DESCRIPTION}</p>
          </div>

          <div className={styles.participantRow}>
            <span className={styles.participantCount}>{ACTIVITY_PROGRESS_COUNT}</span>
            <span className={styles.participantLabel}>명이 함께하는 중</span>
          </div>
        </section>

        <footer className={styles.progressFooter}>
          <CtaButton className={styles.doneButton} onClick={onComplete}>
            휴식 완료
          </CtaButton>
        </footer>

        {showReselectModal ? (
          <RestActivityReselectModal onCancel={onCancelReselect} onConfirm={onConfirmReselect} />
        ) : null}
      </div>
    </main>
  );
}
