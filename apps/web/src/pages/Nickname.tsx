import { CtaButton, TextInput } from '@comma/design-system';
import { useEffect, useState } from 'react';
import * as styles from './Nickname.css';

function Nickname() {
  const [nickname, setNickname] = useState('');
  const [isAccepted, setIsAccepted] = useState(false);
  const onChange = (val: string) => {
    setNickname(val);
  };
  useEffect(() => {
    if (nickname.length > 0) setIsAccepted(true);
    else setIsAccepted(false);
  }, [nickname]);

  return (
    <div className={styles.container}>
      <div
        style={{
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          marginTop: 68
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
            onChange={(s) => onChange(s)}
            maxLength={10}
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
          state={isAccepted ? 'default' : 'disabled'}
          className={isAccepted ? styles.ctaButtonStyle.default : styles.ctaButtonStyle.disabled}
        />
      </div>
    </div>
  );
}

export default Nickname;
