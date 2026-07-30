import { CtaButton, TextInput } from '@comma/design-system';
import { useMutation } from '@tanstack/react-query';
import type { FormEvent } from 'react';
import { updateNickname } from '../../apis/user';
import { useEditableNickname } from '../../hooks/useEditableNickname';
import { getStoredNickname } from '../../utils/tokenStorage';
import * as styles from './MyPageNicknameModal.css';

interface MyPageNicknameModalProps {
  onCancelClick: () => void;
  onSave: (nickname: string) => void;
}

function MyPageNicknameModal({ onCancelClick, onSave }: MyPageNicknameModalProps) {
  const updateNicknameMutation = useMutation({
    mutationFn: updateNickname
  });
  const { value, handleChange } = useEditableNickname({
    suggestedValue: getStoredNickname() ?? undefined
  });

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (value.length === 0 || updateNicknameMutation.isPending) return;

    try {
      const res = await updateNicknameMutation.mutateAsync({ nickname: value });

      if (res.success && res.data?.nickname) {
        onSave(res.data.nickname);
        return;
      }

      alert(res.message ?? '닉네임 저장 중 에러가 발생했습니다.');
    } catch (err) {
      console.log(err);
      alert(err instanceof Error ? err.message : '닉네임 저장 중 에러가 발생했습니다.');
    }
  };

  return (
    <div className={styles.overlay}>
      <button
        aria-label="닉네임 수정 닫기"
        className={styles.backdropButton}
        onClick={onCancelClick}
        type="button"
      />
      <div className={styles.container}>
        <div className={styles.icon} />
        <form
          onSubmit={handleSubmit}
          style={{
            width: '100%',
            flex: 1,
            paddingBottom: 'max(40px, var(--safe-area-bottom))',
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
            value={value}
            onChange={handleChange}
            disabled={updateNicknameMutation.isPending}
          />
          <div
            style={{
              width: '100%',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center'
            }}
          >
            <CtaButton label="취소" className={styles.cancelBtn} onClick={onCancelClick} />
            <CtaButton
              label="저장하기"
              state={value.length > 0 && !updateNicknameMutation.isPending ? 'default' : 'disabled'}
              type="submit"
            />
          </div>
        </form>
      </div>
    </div>
  );
}

export default MyPageNicknameModal;
