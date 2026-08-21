import { CtaButton, TextInput } from '@comma/design-system';
import { useMutation, useQuery } from '@tanstack/react-query';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { trackEvent } from '../../../shared/analytics/events';
import { AppScreen, BackgroundImage } from '../../../shared/components/layout';
import { QueryFeedback } from '../../../shared/components/QueryFeedback';
import { setOnboardingCompleted, setStoredNickname } from '../../../shared/lib/tokenStorage';
import { updateNickname } from '../api/user.api';
import { randomNicknameQueryOptions } from '../api/user.queries';
import { useEditableNickname } from '../hooks/useEditableNickname';
import * as styles from './NicknameScreen.css';

function NicknameScreen() {
  const navigate = useNavigate();
  const [isAccepted, setIsAccepted] = useState(false);
  const [isChecked, setIsChecked] = useState(false);

  const randomNicknameQuery = useQuery(randomNicknameQueryOptions);
  const updateNicknameMutation = useMutation({
    mutationFn: updateNickname
  });
  const { value: nickname, handleChange } = useEditableNickname({
    suggestedValue: randomNicknameQuery.data?.nickname
  });

  useEffect(() => {
    if (nickname.length > 0) setIsAccepted(true);
    else setIsAccepted(false);
  }, [nickname]);

  const isSubmitDisabled = !isAccepted || !isChecked || updateNicknameMutation.isPending;

  const handleSubmit = async () => {
    if (isSubmitDisabled) return;

    try {
      const data = await updateNicknameMutation.mutateAsync({ nickname });

      if (data.nickname) {
        setOnboardingCompleted(true);
        setStoredNickname(data.nickname);
        trackEvent('onboarding_completed');
        navigate('/loading', { state: { userName: data.nickname } });
        return;
      }
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <AppScreen className={styles.container}>
      <BackgroundImage
        className={styles.backgroundImage}
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
          {randomNicknameQuery.isPending ? (
            <QueryFeedback message="추천 닉네임을 만들고 있어요..." state="loading" />
          ) : randomNicknameQuery.isError ? (
            <QueryFeedback
              message="추천 닉네임을 불러오지 못했어요."
              onRetry={() => void randomNicknameQuery.refetch()}
              state="error"
            />
          ) : null}
          <TextInput
            variant="fieldNoTitle"
            placeholder="예) 낙엽"
            className={styles.inputStyle}
            value={nickname}
            onChange={handleChange}
            maxLength={10}
            disabled={randomNicknameQuery.isLoading || updateNicknameMutation.isPending}
          />
          {updateNicknameMutation.isError ? (
            <QueryFeedback message={updateNicknameMutation.error.message} state="error" />
          ) : null}
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
        <label style={{ marginBottom: 16 }}>
          <input
            type="checkbox"
            id="age-confirm"
            className={styles.checkboxInput}
            checked={isChecked}
            onChange={(e) => setIsChecked(e.target.checked)}
          />
          <span className={styles.checkbox}>만 14세 이상입니다</span>
        </label>
        <p className={styles.agreementNotice}>
          계속 진행하면 <span className={styles.agreementAccent}>서비스 이용약관</span> 및<br />
          <span className={styles.agreementAccent}>개인정보처리방침</span>에 동의하는 것으로
          간주합니다
        </p>
        <CtaButton
          label={updateNicknameMutation.isPending ? '저장 중' : undefined}
          state={isSubmitDisabled ? 'disabled' : 'default'}
          className={
            isSubmitDisabled ? styles.ctaButtonStyle.disabled : styles.ctaButtonStyle.default
          }
          onClick={handleSubmit}
        />
      </div>
    </AppScreen>
  );
}

export default NicknameScreen;
