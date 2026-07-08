import { CtaButton, TextInput } from '@comma/design-system';
import * as styles from './MyPageNicknameModal.css';

function MyPageNicknameModal({ onCancelClick }: { onCancelClick: () => void }) {
  return (
    <div className={styles.container}>
      <div className={styles.icon} />
      <form
        style={{
          width: '100%',
          flex: 1,
          paddingBottom: 40,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexDirection: 'column'
        }}
      >
        <TextInput
          variant="field"
          title="닉네임 수정"
          maxLength={10}
          helperText="최대 10자까지 입력할 수 있어요"
          showFooter={true}
        />
        <div
          style={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}
        >
          <CtaButton label="취소" className={styles.cancelBtn} onClick={onCancelClick} />
          <CtaButton label="저장하기" />
        </div>
      </form>
    </div>
  );
}

export default MyPageNicknameModal;
