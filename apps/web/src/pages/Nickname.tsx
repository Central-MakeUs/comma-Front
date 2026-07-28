import { CtaButton, TextInput } from '@comma/design-system';
import { useMutation, useQuery } from '@tanstack/react-query';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getRandomNickname, updateNickname } from '../apis/user';
import { useEditableNickname } from '../hooks/useEditableNickname';
import { setOnboardingCompleted, setStoredNickname } from '../utils/tokenStorage';
import * as styles from './Nickname.css';

function Nickname() {
  const navigate = useNavigate();
  const [isAccepted, setIsAccepted] = useState(false);
  const randomNicknameQuery = useQuery({
    queryKey: ['user', 'nickname', 'random'],
    queryFn: getRandomNickname
  });
  const updateNicknameMutation = useMutation({
    mutationFn: updateNickname
  });
  const { value: nickname, handleChange } = useEditableNickname({
    suggestedValue: randomNicknameQuery.data?.data?.nickname
  });

  useEffect(() => {
    if (nickname.length > 0) setIsAccepted(true);
    else setIsAccepted(false);
  }, [nickname]);

  const handleSubmit = async () => {
    if (!isAccepted || updateNicknameMutation.isPending) return;

    try {
      const res = await updateNicknameMutation.mutateAsync({ nickname });

      if (res.success && res.data?.nickname) {
        setOnboardingCompleted(true);
        setStoredNickname(res.data.nickname);
        navigate('/loading', { state: { userName: res.data.nickname } });
        return;
      }

      alert(res.message ?? '닉네임 저장 중 에러가 발생했습니다.');
    } catch (err) {
      console.log(err);
      alert(err instanceof Error ? err.message : '닉네임 저장 중 에러가 발생했습니다.');
    }
  };

  return (
    <div className={styles.container}>
      <img
        alt=""
        aria-hidden="true"
        className={styles.backgroundImage}
        decoding="async"
        fetchPriority="high"
        loading="eager"
        src="/images/onboardingBackground_blur.png"
      />
      <div
        style={{
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          paddingTop: 20
        }}
      >
        <img
          src="/images/logo_glass.svg"
          alt="콤마 로고"
          width={110}
          height={24}
          style={{ marginBottom: 68 }}
        />
        <div style={{ display: 'flex', flexDirection: 'column', width: '100%' }}>
          <span className={styles.title}>반가워요,</span>
          <span className={styles.title}>닉네임을 알려주세요</span>
          <p className={styles.desc} style={{ marginBottom: 48 }}>
            콤마에서 사용할 이름으로
            <br />
            언제든지 변경할 수 있어요.
          </p>
          <TextInput
            variant="fieldNoTitle"
            placeholder="예) 낙엽"
            className={styles.inputStyle}
            value={nickname}
            onChange={handleChange}
            maxLength={10}
            disabled={randomNicknameQuery.isLoading || updateNicknameMutation.isPending}
          />
          {nickname.length > 0 ? (
            <div
              style={{
                width: '100%',
                display: 'flex',
                flexDirection: 'row',
                justifyContent: 'space-between',
                marginTop: 8
              }}
            >
              <span className={styles.noticeText}>최대 10자까지 입력할 수 있어요</span>
              <div>
                <span className={styles.noticeAccent}>{nickname.length}</span>
                <span className={styles.noticeText}> / 10</span>
              </div>
            </div>
          ) : null}
        </div>
      </div>
      <div
        style={{
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          marginBottom: 40
        }}
      >
        <p className={styles.agreementNotice}>
          계속 진행하면 <span className={styles.agreementAccent}>서비스 이용약관</span> 및<br />
          <span className={styles.agreementAccent}>개인정보처리방침</span>에 동의하는 것으로
          간주합니다
        </p>
        <CtaButton
          state={isAccepted && !updateNicknameMutation.isPending ? 'default' : 'disabled'}
          className={isAccepted ? styles.ctaButtonStyle.default : styles.ctaButtonStyle.disabled}
          onClick={handleSubmit}
        />
      </div>
    </div>
  );
}

export default Nickname;
