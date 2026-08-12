import { CtaButton, colors, Icon, Modal } from '@comma/design-system';
import { useNavigate } from 'react-router-dom';
import * as styles from './RestResultScreen.css';

export function RestResultReselectModal({ onClose }: { onClose: () => void }) {
  const navigate = useNavigate();

  return (
    <Modal
      aria-describedby="rest-select-modal-description"
      aria-labelledby="rest-select-modal-title"
      backdropTone="soft"
      className={styles.modalContainer}
      onClose={onClose}
    >
      <div style={{ width: '100%', display: 'flex', flexDirection: 'column', marginBottom: 32 }}>
        <div style={{ width: '100%', display: 'flex', justifyContent: 'flex-end' }}>
          <Icon color={colors.iconPrimary} name="x" onClick={onClose} />
        </div>
        <span className={styles.modalTitle} id="rest-select-modal-title">
          휴식 재선택
        </span>
        <span className={styles.modalDesc} id="rest-select-modal-description">
          휴식을 다시 선택할까요?
        </span>
      </div>
      <div style={{ width: '100%' }}>
        <CtaButton className={styles.cancleBtn} onClick={onClose}>
          취소
        </CtaButton>
        <CtaButton className={styles.confirmBtn} onClick={() => navigate('/rest/checklist')}>
          확인
        </CtaButton>
      </div>
    </Modal>
  );
}
