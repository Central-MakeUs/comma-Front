import { CtaButton, colors, Icon, SmallButton, TextInput } from '@comma/design-system';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { logout } from '../apis/auth';
import {
  getPlan,
  type PlanCard,
  type PremiumAlertContactType,
  requestPremiumAlert,
  withdrawUser
} from '../apis/user';
import { PRIVACY_POLICY, TERMS_OF_SERVICE } from '../data/service_url';
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
    <div className={styles.modalOverlay}>
      <button
        aria-label={`${title} 닫기`}
        className={styles.backdropButton}
        onClick={onCancelClick}
        type="button"
      />
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

function PremiumAlertSheet({
  contact,
  contactType,
  isPending,
  onClose,
  onContactChange,
  onContactTypeChange,
  onSubmit
}: {
  contact: string;
  contactType: PremiumAlertContactType;
  isPending: boolean;
  onClose: () => void;
  onContactChange: (value: string) => void;
  onContactTypeChange: (value: PremiumAlertContactType) => void;
  onSubmit: () => void;
}) {
  const [isInputFocused, setIsInputFocused] = useState(false);
  const isSubmitDisabled = isPending || contact.trim().length === 0;

  return (
    <div className={styles.modalOverlay}>
      <button
        aria-label="출시 알림 신청 닫기"
        className={styles.backdropButton}
        onClick={onClose}
        type="button"
      />
      <section
        aria-labelledby="premium-alert-title"
        aria-modal="true"
        className={styles.premiumAlertSheet}
        role="dialog"
      >
        <div className={styles.sheetHandle} />
        <div className={styles.premiumAlertHeader}>
          <h2 className={styles.premiumAlertTitle} id="premium-alert-title">
            프리미엄 정식 출시 알림받기
          </h2>
          <p className={styles.premiumAlertDescription}>출시 알림을 받을 수단을 입력해주세요.</p>
        </div>
        <div className={styles.premiumAlertForm}>
          <fieldset
            aria-label="연락 수단"
            className={styles.contactTypeToggle}
            disabled={isPending}
          >
            <button
              aria-pressed={contactType === 'EMAIL'}
              className={
                contactType === 'EMAIL' ? styles.contactTypeSelected : styles.contactTypeButton
              }
              onClick={() => onContactTypeChange('EMAIL')}
              type="button"
            >
              이메일
            </button>
            <button
              aria-pressed={contactType === 'PHONE'}
              className={
                contactType === 'PHONE' ? styles.contactTypeSelected : styles.contactTypeButton
              }
              onClick={() => onContactTypeChange('PHONE')}
              type="button"
            >
              연락처
            </button>
          </fieldset>
          <TextInput
            className={styles.premiumAlertInput}
            disabled={isPending}
            onBlur={() => setIsInputFocused(false)}
            onChange={onContactChange}
            onFocus={() => setIsInputFocused(true)}
            placeholder={
              contactType === 'EMAIL' ? '이메일을 입력해주세요.' : '연락처를 입력해주세요.'
            }
            state={isInputFocused ? 'focus' : contact ? 'filled' : 'default'}
            value={contact}
            variant="bar"
          />
          <CtaButton
            className={styles.premiumAlertSubmit}
            disabled={isSubmitDisabled}
            label={isPending ? '제출 중' : '제출하기'}
            onClick={onSubmit}
          />
        </div>
      </section>
    </div>
  );
}

function Setting() {
  const [logOutOpen, setLogOutOpen] = useState(false);
  const [withdrawOpen, setWithdrawOpen] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [premiumAlertOpen, setPremiumAlertOpen] = useState(false);
  const [premiumAlertContactType, setPremiumAlertContactType] =
    useState<PremiumAlertContactType>('EMAIL');
  const [premiumAlertContact, setPremiumAlertContact] = useState('');
  const isWebView = !!window.ReactNativeWebView;
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const planQuery = useQuery({
    queryKey: ['user', 'plan'],
    queryFn: async () => {
      const response = await getPlan();

      if (!response.success || !response.data) {
        throw new Error(response.message ?? '플랜 정보를 불러오지 못했습니다.');
      }

      return response.data;
    }
  });
  const premiumAlertMutation = useMutation({
    mutationFn: requestPremiumAlert,
    onSuccess: (res) => {
      if (!res.success) {
        alert(res.message ?? '프리미엄 알림 신청에 실패했습니다.');
        return;
      }

      setPremiumAlertOpen(false);
      setPremiumAlertContact('');
      setPremiumAlertContactType('EMAIL');
      alert('프리미엄 알림을 신청했습니다.');
    },
    onError: (err) => {
      alert(err instanceof Error ? err.message : '프리미엄 알림 신청에 실패했습니다.');
    }
  });
  const withdrawMutation = useMutation({
    mutationFn: withdrawUser,
    onSuccess: async (res) => {
      if (!res.success) {
        alert(res.message ?? '회원 탈퇴에 실패했습니다.');
        return;
      }

      await clearTokens();
      navigate('/', { replace: true });
    },
    onError: (err) => {
      alert(err instanceof Error ? err.message : '회원 탈퇴에 실패했습니다.');
    }
  });
  const logoutMutation = useMutation({
    mutationFn: logout,
    onSettled: async () => {
      await clearTokens();
      queryClient.clear();
      navigate('/', { replace: true });
    }
  });

  const planData = planQuery.data;
  const currentPlan = planData?.currentPlan;
  const freePlan = planData?.plans.find((plan) => plan.plan === 'FREE');
  const premiumPlan = planData?.plans.find((plan) => plan.plan === 'PREMIUM');
  const currentPlanCard =
    currentPlan === 'PREMIUM' ? premiumPlan : currentPlan === 'FREE' ? freePlan : undefined;
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

  const onUrlClick = (url: string) => {
    if (isWebView) {
      window.ReactNativeWebView?.postMessage(
        JSON.stringify({
          type: 'OPEN_EXTERNAL',
          url
        })
      );
    } else {
      window.open(url);
    }
  };

  const _onConfirmClick = () => {
    setConfirmOpen(true);
    setLogOutOpen(false);
    setWithdrawOpen(false);
  };

  const handlePremiumAlertClick = () => {
    setPremiumAlertOpen(true);
    setLogOutOpen(false);
    setWithdrawOpen(false);
    setConfirmOpen(false);
  };

  const handlePremiumAlertSubmit = () => {
    const trimmedContact = premiumAlertContact.trim();

    if (!trimmedContact || premiumAlertMutation.isPending) return;

    premiumAlertMutation.mutate({
      contactType: premiumAlertContactType,
      contact: trimmedContact
    });
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <button
          aria-label="뒤로 가기"
          className={styles.backButton}
          onClick={() => navigate(-1)}
          type="button"
        >
          <Icon name="rightArrow" className={styles.leftArrow} />
        </button>
        <span>설정</span>
      </div>
      <main className={styles.content}>
        <div className={styles.rateContainer} style={{ border: `1px solid ${colors.linePrimary}` }}>
          <div className={styles.rateType}>현재 플랜</div>
          <div className={styles.ratePrice}>
            {planQuery.isLoading
              ? '불러오는 중'
              : planQuery.isError
                ? '불러오기 실패'
                : getPlanLabel(currentPlanCard, '플랜 정보 없음')}
          </div>
          <div className={styles.rateDesc}>
            {planQuery.isError
              ? '잠시 후 다시 시도해주세요.'
              : getPlanDescription(currentPlanCard, '기본 활동 추천 27가지')}
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
              label="출시 알림받기"
              className={styles.planActionBtn}
              onClick={handlePremiumAlertClick}
            />
          </div>
        </div>
        <div className={styles.settingsList}>
          {settings.map((s) => (
            <SettingList
              text={s}
              key={s}
              onClick={
                s === '로그아웃'
                  ? onLogOutClick
                  : s === '회원 탈퇴'
                    ? onWithdrawClick
                    : s === '서비스 이용약관'
                      ? () => onUrlClick(TERMS_OF_SERVICE)
                      : () => onUrlClick(PRIVACY_POLICY)
              }
            />
          ))}
        </div>
      </main>
      <footer className={styles.footer}>버전 1.0.0 | 문의하기: jamkkan2026@gmail.com</footer>
      {logOutOpen ? (
        <Modal
          title={logOutSetting.title}
          desc={logOutSetting.desc}
          btnText={logoutMutation.isPending ? '로그아웃 중' : logOutSetting.btnText}
          onCancelClick={() => setLogOutOpen(false)}
          onConfirmClick={() => {
            if (!logoutMutation.isPending) logoutMutation.mutate();
          }}
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
      ) : premiumAlertOpen ? (
        <PremiumAlertSheet
          contact={premiumAlertContact}
          contactType={premiumAlertContactType}
          isPending={premiumAlertMutation.isPending}
          onClose={() => {
            if (!premiumAlertMutation.isPending) setPremiumAlertOpen(false);
          }}
          onContactChange={setPremiumAlertContact}
          onContactTypeChange={(contactType) => {
            setPremiumAlertContactType(contactType);
            setPremiumAlertContact('');
          }}
          onSubmit={handlePremiumAlertSubmit}
        />
      ) : null}
    </div>
  );
}

export default Setting;
