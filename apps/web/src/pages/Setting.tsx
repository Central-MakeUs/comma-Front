import { CtaButton, colors, Icon, SmallButton } from '@comma/design-system';
import { useState } from 'react';
import * as styles from './Setting.css';
import { useNavigate } from 'react-router-dom';

const settings = ['서비스 이용약관', '개인정보 처리방침', '로그아웃', '회원 탈퇴'];

const logOutSetting = {
  title: '로그아웃',
  desc: '로그아웃하면 다시 로그인해야\n서비스를 이용할 수 있어요.',
  btnText: '로그아웃'
};

const withdrawSetting = {
  title: '회원 탈퇴',
  desc: '탈퇴하면 모든 기록과 아카이브가 영구 삭제되며\n복구할 수 없어요. 그래도 탈퇴하시겠어요?',
  btnText: '확인'
};

const confirmWithdraw = {
  title: '회원 탈퇴 확인',
  desc: '정말 탈퇴 하시겠습니까?',
  btnText: '탈퇴하기'
};

function Modal({
  title,
  desc,
  btnText,
  onCancelClick,
  onConfirmClick
}: {
  title: string;
  desc: string;
  btnText: string;
  onCancelClick?: () => void;
  onConfirmClick?: () => void;
}) {
  return (
    <div className={styles.confirmModal}>
      <div
        style={{
          margin: '0 auto',
          width: 36,
          height: 4,
          backgroundColor: colors.iconSecondary,
          borderRadius: 100
        }}
      />
      <div className={styles.confirmTitle}>{title}</div>
      <div className={styles.confirmDesc}>{desc}</div>
      <CtaButton label="취소" className={styles.cancelBtn} onClick={onCancelClick} />
      <CtaButton
        label={btnText}
        state="default"
        className={styles.confirmBtn}
        onClick={onConfirmClick}
      />
      <div style={{ height: 36 }} />
    </div>
  );
}

function SettingList({ text, onClick }: { text: string; onClick?: () => void }) {
  return (
    <button type="button" className={styles.settingContainer} onClick={onClick}>
      <span>{text}</span>
      <Icon name="rightArrow" color={colors.iconSecondary} />
    </button>
  );
}

function Setting() {
  const [logOutOpen, setLogOutOpen] = useState(false);
  const [withdrawOpen, setWithdrawOpen] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const navigate = useNavigate();

  const onLogOutClick = () => {
    setLogOutOpen(true);
    setWithdrawOpen(false);
    setConfirmOpen(false);
  };

  const onWithdrawClick = () => {
    setWithdrawOpen(true);
    setLogOutOpen(false);
    setConfirmOpen(false);
  };

  const _onConfirmClick = () => {
    setConfirmOpen(true);
    setLogOutOpen(false);
    setWithdrawOpen(false);
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <Icon name="rightArrow" className={styles.leftArrow} onClick={() => navigate(-1)}/>
        <span>설정</span>
      </div>
      <div style={{ width: '100%', marginTop: 24 }}>
        <div className={styles.rateContainer} style={{ border: `1px solid ${colors.linePrimary}` }}>
          <div className={styles.rateType}>현재 플랜</div>
          <div className={styles.ratePrice}>무료 플랜</div>
          <div className={styles.rateDesc}>기본 활동 추천 27가지</div>
        </div>
        <div className={styles.rateContainer} style={{ marginTop: 8 }}>
          <div
            className={styles.rateType}
            style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}
          >
            프리미엄 <Icon name="crown" className={styles.crownIcon} />
          </div>
          <div className={styles.ratePrice}>월 2,900원</div>
          <div className={styles.rateDesc}>80개+ 심화 활동, 개인화 리포트</div>
          <div style={{ width: '100%', display: 'flex', justifyContent: 'flex-end' }}>
            <SmallButton label="시작하기" className={styles.startBtn} />
          </div>
        </div>
        <div style={{ width: '100%', marginTop: 32 }}>
          {settings.map((s) => (
            <SettingList
              text={s}
              key={s}
              onClick={
                s === '로그아웃' ? onLogOutClick : s === '회원 탈퇴' ? onWithdrawClick : undefined
              }
            />
          ))}
        </div>
      </div>
      {logOutOpen ? (
        <Modal
          title={logOutSetting.title}
          desc={logOutSetting.desc}
          btnText={logOutSetting.btnText}
          onCancelClick={() => setLogOutOpen(false)}
        />
      ) : withdrawOpen ? (
        <Modal
          title={withdrawSetting.title}
          desc={withdrawSetting.desc}
          btnText={withdrawSetting.btnText}
          onCancelClick={() => setWithdrawOpen(false)}
          onConfirmClick={() => {
            setWithdrawOpen(false);
            setConfirmOpen(true);
          }}
        />
      ) : confirmOpen ? (
        <Modal
          title={confirmWithdraw.title}
          desc={confirmWithdraw.desc}
          btnText={confirmWithdraw.btnText}
          onCancelClick={() => setConfirmOpen(false)}
        />
      ) : null}
    </div>
  );
}

export default Setting;
