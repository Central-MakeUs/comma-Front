import { CtaButton, colors, Icon } from '@comma/design-system';
import { useNavigate } from 'react-router-dom';
import * as styles from './RestResultModal.css';

function Modal({ onClose }: { onClose: () => void }) {
  const navigate = useNavigate();

  return (
    <div
      className={styles.modalContainer}
      role="dialog"
      aria-modal="true"
      aria-labelledby="rest-select-modal-title"
    >
      <div style={{ width: '100%', display: 'flex', flexDirection: 'column', marginBottom: 32 }}>
        <div style={{ width: '100%', display: 'flex', justifyContent: 'flex-end' }}>
          <Icon name="x" color={colors.iconPrimary} onClick={onClose} />
        </div>
        <span className={styles.modalTitle} id="rest-select-modal-title">
          휴식 재선택
        </span>
        <span className={styles.modalDesc}>휴식을 다시 선택할까요?</span>
      </div>
      <div style={{ width: '100%' }}>
        <CtaButton className={styles.cancleBtn} onClick={onClose}>
          취소
        </CtaButton>
        <CtaButton className={styles.confirmBtn} onClick={() => navigate('/rest/checklist')}>
          확인
        </CtaButton>
      </div>
    </div>
  );
}

export default Modal;
