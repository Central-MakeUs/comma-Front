import { CtaButton, colors, Icon } from '@comma/design-system';
import { assignInlineVars } from '@vanilla-extract/dynamic';
import { ACTIVITY_PROGRESS_TITLE, REST_DESCRIPTION } from './RestActivity.constants';
import * as sharedStyles from './RestActivity.shared.css';
import * as styles from './RestActivityProgress.css';
import { RestActivityReselectModal } from './RestActivityReselectModal';

type RestActivityProgressProps = {
  participantCount: number | string;
  showReselectModal: boolean;
  onOpenReselectModal: () => void;
  onCancelReselect: () => void;
  onConfirmReselect: () => void;
  onComplete: () => void;
};

export function RestActivityProgress({
  participantCount,
  showReselectModal,
  onOpenReselectModal,
  onCancelReselect,
  onConfirmReselect,
  onComplete
}: RestActivityProgressProps) {
  return (
    <main className={sharedStyles.page}>
      <div
        className={sharedStyles.screen}
        style={assignInlineVars({
          [sharedStyles.backgroundImageVar]: 'url(/images/rest_activity_progress.jpg)'
        })}
      >
        <div
          aria-hidden="true"
          className={[sharedStyles.dimOverlay, sharedStyles.dimOverlayVisible].join(' ')}
        />
        <div aria-hidden="true" className={sharedStyles.topGradient} />
        <div aria-hidden="true" className={sharedStyles.bottomGradient} />

        <header className={styles.header}>
          <button
            aria-label="휴식 재선택"
            className={sharedStyles.iconButton}
            onClick={onOpenReselectModal}
            type="button"
          >
            <Icon color={colors.iconPrimary} name="x" />
          </button>
        </header>

        <section className={styles.content} aria-labelledby="rest-activity-progress-title">
          <div className={styles.heroText}>
            <h1 className={sharedStyles.title} id="rest-activity-progress-title">
              {ACTIVITY_PROGRESS_TITLE}
            </h1>
            <p className={sharedStyles.description}>{REST_DESCRIPTION}</p>
          </div>

          <div className={styles.participantRow}>
            <span className={styles.participantCount}>{participantCount}</span>
            <span className={styles.participantLabel}>명이 함께하는 중</span>
          </div>
        </section>

        <footer className={styles.footer}>
          <CtaButton className={sharedStyles.doneButton} onClick={onComplete}>
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
