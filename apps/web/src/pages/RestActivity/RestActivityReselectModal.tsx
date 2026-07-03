import { CtaButton, colors, Icon } from '@comma/design-system';
import * as styles from './RestActivity.css';

type RestActivityReselectModalProps = {
  onCancel: () => void;
  onConfirm: () => void;
};

export function RestActivityReselectModal({ onCancel, onConfirm }: RestActivityReselectModalProps) {
  return (
    <div className={styles.modalOverlay}>
      <section
        aria-labelledby="rest-activity-modal-title"
        aria-modal="true"
        className={styles.modal}
        role="dialog"
      >
        <div className={styles.modalHeader}>
          <button aria-label="닫기" className={styles.iconButton} onClick={onCancel} type="button">
            <Icon color={colors.iconPrimary} name="x" />
          </button>
        </div>
        <div className={styles.modalText}>
          <h2 className={styles.modalTitle} id="rest-activity-modal-title">
            휴식 재선택
          </h2>
          <p className={styles.modalDescription}>휴식을 다시 선택할까요?</p>
        </div>
        <div className={styles.modalActions}>
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
