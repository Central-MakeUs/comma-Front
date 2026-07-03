import { CtaButton, colors, Icon } from '@comma/design-system';
import * as sharedStyles from './RestActivity.shared.css';
import * as styles from './RestActivityReselectModal.css';

type RestActivityReselectModalProps = {
  onCancel: () => void;
  onConfirm: () => void;
};

export function RestActivityReselectModal({ onCancel, onConfirm }: RestActivityReselectModalProps) {
  return (
    <div className={styles.overlay}>
      <section
        aria-labelledby="rest-activity-modal-title"
        aria-modal="true"
        className={styles.modal}
        role="dialog"
      >
        <div className={styles.header}>
          <button
            aria-label="닫기"
            className={sharedStyles.iconButton}
            onClick={onCancel}
            type="button"
          >
            <Icon color={colors.iconPrimary} name="x" />
          </button>
        </div>
        <div className={styles.text}>
          <h2 className={styles.title} id="rest-activity-modal-title">
            휴식 재선택
          </h2>
          <p className={styles.description}>휴식을 다시 선택할까요?</p>
        </div>
        <div className={styles.actions}>
          <CtaButton className={styles.cancelButton} onClick={onCancel}>
            취소
          </CtaButton>
          <CtaButton className={styles.confirmButton} onClick={onConfirm}>
            확인
          </CtaButton>
        </div>
      </section>
    </div>
  );
}
