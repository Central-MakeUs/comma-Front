import * as styles from './Nickname.css';
import { TextInput, CtaButton } from '@comma/design-system';
import { useEffect, useState } from 'react';
import { login } from '../utils/auth';

function Nickname() {
  const [nickname, setNickname] = useState('');

  useEffect(() => {
    login();
  }, []);
  
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
          <p className={styles.desc}>
            콤마에서 사용할 이름으로
            <br />
            언제든지 변경할 수 있어요.
          </p>
          <TextInput variant='fieldNoTitle' placeholder='예) 낙엽' className={styles.inputStyle}/>
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
        <CtaButton children="시작하기" state='disabled' className={styles.ctaButtonStyle['disabled']}/>
      </div>
    </div>
  );
}

export default Nickname;
