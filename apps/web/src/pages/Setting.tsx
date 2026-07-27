import { CtaButton, colors, Icon, SmallButton } from '@comma/design-system';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  changePlan,
  getPlan,
  type PlanCard,
  requestPremiumAlert,
  type UserPlan,
  withdrawUser
} from '../apis/user';
import { clearTokens } from '../utils/tokenStorage';
import * as styles from './Setting.css';

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
  const queryClient = useQueryClient();
  const planQuery = useQuery({
    queryKey: ['user', 'plan'],
    queryFn: getPlan
  });
  const changePlanMutation = useMutation({
    mutationFn: changePlan,
    onSuccess: (res) => {
      if (!res.success) {
        alert(res.message ?? '플랜 변경에 실패했습니다.');
        return;
      }

      void queryClient.invalidateQueries({ queryKey: ['user', 'plan'] });
      alert('플랜이 변경되었습니다.');
    },
    onError: (err) => {
      alert(err instanceof Error ? err.message : '플랜 변경에 실패했습니다.');
    }
  });
  const premiumAlertMutation = useMutation({
    mutationFn: requestPremiumAlert,
    onSuccess: (res) => {
      if (!res.success) {
        alert(res.message ?? '프리미엄 알림 신청에 실패했습니다.');
        return;
      }

      alert('프리미엄 알림을 신청했습니다.');
    },
    onError: (err) => {
      alert(err instanceof Error ? err.message : '프리미엄 알림 신청에 실패했습니다.');
    }
  });
  const withdrawMutation = useMutation({
    mutationFn: withdrawUser,
    onSuccess: (res) => {
      if (!res.success) {
        alert(res.message ?? '회원 탈퇴에 실패했습니다.');
        return;
      }

      clearTokens();
      navigate('/', { replace: true });
    },
    onError: (err) => {
      alert(err instanceof Error ? err.message : '회원 탈퇴에 실패했습니다.');
    }
  });

  const planData = planQuery.data?.data;
  const currentPlan = planData?.currentPlan ?? 'FREE';
  const freePlan = planData?.plans.find((plan) => plan.plan === 'FREE');
  const premiumPlan = planData?.plans.find((plan) => plan.plan === 'PREMIUM');

  const getPlanLabel = (plan: PlanCard | undefined, fallback: string) => plan?.label ?? fallback;
  const getPlanDescription = (plan: PlanCard | undefined, fallback: string) =>
    plan?.description ?? fallback;

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

  const handlePlanChange = (plan: UserPlan) => {
    if (changePlanMutation.isPending || currentPlan === plan) return;

    changePlanMutation.mutate({ plan });
  };

  const handlePremiumAlertClick = () => {
    if (premiumAlertMutation.isPending) return;

    const contact = window.prompt(
      '프리미엄 출시 알림을 받을 이메일 또는 전화번호를 입력해 주세요.'
    );
    const trimmedContact = contact?.trim();

    if (!trimmedContact) return;

    premiumAlertMutation.mutate({
      contactType: trimmedContact.includes('@') ? 'EMAIL' : 'PHONE',
      contact: trimmedContact
    });
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <Icon name="rightArrow" className={styles.leftArrow} onClick={() => navigate(-1)} />
        <span>설정</span>
      </div>
      <div style={{ width: '100%', marginTop: 24 }}>
        <div className={styles.rateContainer} style={{ border: `1px solid ${colors.linePrimary}` }}>
          <div className={styles.rateType}>현재 플랜</div>
          <div className={styles.ratePrice}>
            {planQuery.isLoading
              ? '불러오는 중'
              : getPlanLabel(currentPlan === 'PREMIUM' ? premiumPlan : freePlan, '무료 플랜')}
          </div>
          <div className={styles.rateDesc}>
            {getPlanDescription(
              currentPlan === 'PREMIUM' ? premiumPlan : freePlan,
              '기본 활동 추천 27가지'
            )}
          </div>
          <div style={{ width: '100%', display: 'flex', justifyContent: 'flex-end' }}>
            <SmallButton
              label={
                currentPlan === 'FREE'
                  ? '사용 중'
                  : changePlanMutation.isPending
                    ? '변경 중'
                    : '무료로 변경'
              }
              className={styles.planActionBtn}
              disabled={currentPlan === 'FREE' || changePlanMutation.isPending}
              onClick={() => handlePlanChange('FREE')}
            />
          </div>
        </div>
        <div className={styles.rateContainer} style={{ marginTop: 8 }}>
          <div
            className={styles.rateType}
            style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}
          >
            {getPlanLabel(premiumPlan, '프리미엄')}{' '}
            <Icon name="crown" className={styles.crownIcon} />
          </div>
          <div className={styles.ratePrice}>월 2,900원</div>
          <div className={styles.rateDesc}>
            {getPlanDescription(premiumPlan, '80개+ 심화 활동, 개인화 리포트')}
          </div>
          <div style={{ width: '100%', display: 'flex', justifyContent: 'flex-end', gap: 8 }}>
            <SmallButton
              label={premiumAlertMutation.isPending ? '신청 중' : '알림받기'}
              className={styles.planActionBtn}
              disabled={premiumAlertMutation.isPending}
              onClick={handlePremiumAlertClick}
            />
            <SmallButton
              label={
                currentPlan === 'PREMIUM'
                  ? '사용 중'
                  : changePlanMutation.isPending
                    ? '변경 중'
                    : '시작하기'
              }
              className={styles.startBtn}
              disabled={currentPlan === 'PREMIUM' || changePlanMutation.isPending}
              onClick={() => handlePlanChange('PREMIUM')}
            />
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
          btnText={withdrawMutation.isPending ? '탈퇴 중' : confirmWithdraw.btnText}
          onCancelClick={() => setConfirmOpen(false)}
          onConfirmClick={() => {
            if (!withdrawMutation.isPending) withdrawMutation.mutate();
          }}
        />
      ) : null}
    </div>
  );
}

export default Setting;
