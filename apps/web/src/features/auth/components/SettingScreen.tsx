import {
  BottomSheet,
  CtaButton,
  colors,
  Icon,
  SelectButton,
  SmallButton,
  TextInput
} from '@comma/design-system';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { trackEvent } from '../../../shared/analytics/events';
import { useAppToast } from '../../../shared/components/AppToast';
import { AppScreen } from '../../../shared/components/layout';
import { useNativeBackHandler } from '../../../shared/components/NativeBack';
import { QueryFeedback } from '../../../shared/components/QueryFeedback';
import { clearTokens } from '../../../shared/lib/tokenStorage';
import { logout } from '../api/auth.api';
import {
  type PlanCard,
  type PremiumAlertContactType,
  requestPremiumAlert,
  withdrawUser
} from '../api/user.api';
import { userPlanQueryOptions } from '../api/user.queries';
import { PRIVACY_POLICY, TERMS_OF_SERVICE } from '../model/auth.constants';
import * as styles from './SettingScreen.css';

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

type ActiveModal = 'logout' | 'withdraw' | 'withdrawConfirm' | 'premiumAlert' | null;

function ConfirmBottomSheet({
  dialogId,
  title,
  desc,
  btnText,
  onCancelClick,
  onConfirmClick
}: {
  dialogId: string;
  title: string;
  desc: string;
  btnText: string;
  onCancelClick?: () => void;
  onConfirmClick?: () => void;
}) {
  return (
    <BottomSheet
      aria-describedby={`${dialogId}-description`}
      aria-labelledby={`${dialogId}-title`}
      className={styles.confirmModal}
      onClose={() => onCancelClick?.()}
    >
      <div
        style={{
          margin: '0 auto',
          width: 36,
          height: 4,
          backgroundColor: colors.iconSecondary,
          borderRadius: 100
        }}
      />
      <div className={styles.confirmTitle} id={`${dialogId}-title`}>
        {title}
      </div>
      <div className={styles.confirmDesc} id={`${dialogId}-description`}>
        {desc}
      </div>
      <CtaButton label="취소" className={styles.cancelBtn} onClick={onCancelClick} />
      <CtaButton
        label={btnText}
        state="default"
        className={styles.confirmBtn}
        onClick={onConfirmClick}
      />
      <div style={{ height: 36 }} />
    </BottomSheet>
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
    <BottomSheet
      aria-describedby="premium-alert-description"
      aria-labelledby="premium-alert-title"
      className={styles.premiumAlertSheet}
      closeOnBackdrop={!isPending}
      onClose={onClose}
    >
      <div className={styles.sheetHandle} />
      <div className={styles.premiumAlertHeader}>
        <h2 className={styles.premiumAlertTitle} id="premium-alert-title">
          프리미엄 정식 출시 알림받기
        </h2>
        <p className={styles.premiumAlertDescription} id="premium-alert-description">
          출시 알림을 받을 수단을 입력해주세요.
        </p>
      </div>
      <div className={styles.premiumAlertForm}>
        <fieldset aria-label="연락 수단" className={styles.contactTypeToggle} disabled={isPending}>
          <SelectButton
            aria-label="이메일로 알림받기"
            className={
              contactType === 'EMAIL' ? styles.contactTypeSelected : styles.contactTypeButton
            }
            disabled={isPending}
            onClick={() => onContactTypeChange('EMAIL')}
            selected={contactType === 'EMAIL'}
          >
            이메일
          </SelectButton>
          <SelectButton
            aria-label="연락처로 알림받기"
            className={
              contactType === 'PHONE' ? styles.contactTypeSelected : styles.contactTypeButton
            }
            disabled={isPending}
            onClick={() => onContactTypeChange('PHONE')}
            selected={contactType === 'PHONE'}
          >
            연락처
          </SelectButton>
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
    </BottomSheet>
  );
}

function SettingScreen() {
  const { showToast } = useAppToast();
  const [activeModal, setActiveModal] = useState<ActiveModal>(null);
  const [premiumAlertContactType, setPremiumAlertContactType] =
    useState<PremiumAlertContactType>('EMAIL');
  const [premiumAlertContact, setPremiumAlertContact] = useState('');
  const isWebView = !!window.ReactNativeWebView;
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const planQuery = useQuery(userPlanQueryOptions);
  const premiumAlertMutation = useMutation({
    mutationFn: requestPremiumAlert,
    onSuccess: (res) => {
      if (!res.success) {
        trackEvent('premium_alert_failed', {
          contact_method: premiumAlertContactType.toLowerCase()
        });
        showToast(res.message ?? '프리미엄 알림 신청에 실패했습니다.');
        return;
      }

      trackEvent('premium_alert_submitted', {
        contact_method: premiumAlertContactType.toLowerCase()
      });
      setActiveModal(null);
      setPremiumAlertContact('');
      setPremiumAlertContactType('EMAIL');
      showToast('프리미엄 알림을 신청했습니다.', { tone: 'success' });
    },
    onError: (err) => {
      trackEvent('premium_alert_failed', { contact_method: premiumAlertContactType.toLowerCase() });
      showToast(err instanceof Error ? err.message : '프리미엄 알림 신청에 실패했습니다.');
    }
  });
  const withdrawMutation = useMutation({
    mutationFn: withdrawUser,
    onSuccess: async (res) => {
      if (!res.success) {
        trackEvent('account_deletion_failed');
        showToast(res.message ?? '회원 탈퇴에 실패했습니다.');
        return;
      }

      trackEvent('account_deletion_completed');
      try {
        await clearTokens();
      } catch (error) {
        console.error('Failed to clear tokens after withdrawal.', error);
      } finally {
        navigate('/', { replace: true });
      }
    },
    onError: (err) => {
      trackEvent('account_deletion_failed');
      showToast(err instanceof Error ? err.message : '회원 탈퇴에 실패했습니다.');
    }
  });
  const logoutMutation = useMutation({
    mutationFn: logout,
    onSuccess: () => trackEvent('logout_completed'),
    onError: () => trackEvent('logout_failed'),
    onSettled: async () => {
      try {
        await clearTokens();
      } catch (error) {
        console.error('Failed to clear tokens during logout.', error);
      } finally {
        queryClient.clear();
        navigate('/', { replace: true });
      }
    }
  });

  useNativeBackHandler(() => {
    if (logoutMutation.isPending) {
      showToast('로그아웃 중이에요.');
      return true;
    }
    if (withdrawMutation.isPending) {
      showToast('회원 탈퇴 중이에요.');
      return true;
    }
    if (premiumAlertMutation.isPending) {
      showToast('알림을 신청하고 있어요.');
      return true;
    }
    if (activeModal) {
      setActiveModal(null);
      return true;
    }

    navigate('/mypage', { replace: true });
    return true;
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
    setActiveModal('logout');
  };

  const onWithdrawClick = () => {
    setActiveModal('withdraw');
  };

  const onUrlClick = (url: string, documentType: 'privacy_policy' | 'terms_of_service') => {
    trackEvent('legal_document_opened', { document_type: documentType });
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

  const handlePremiumAlertClick = () => {
    trackEvent('premium_alert_opened');
    setActiveModal('premiumAlert');
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
    <AppScreen className={styles.container} scrollable>
      <div className={styles.header}>
        <button
          aria-label="뒤로 가기"
          className={styles.backButton}
          onClick={() => navigate('/mypage', { replace: true })}
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
        {planQuery.isError ? (
          <QueryFeedback
            message="플랜 정보를 불러오지 못했어요."
            onRetry={() => void planQuery.refetch()}
            state="error"
          />
        ) : null}
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
                      ? () => onUrlClick(TERMS_OF_SERVICE, 'terms_of_service')
                      : () => onUrlClick(PRIVACY_POLICY, 'privacy_policy')
              }
            />
          ))}
        </div>
      </main>
      <footer className={styles.footer}>버전 1.0.0 | 문의하기: jamkkan2026@gmail.com</footer>
      {activeModal === 'logout' ? (
        <ConfirmBottomSheet
          dialogId="logout-confirm"
          title={logOutSetting.title}
          desc={logOutSetting.desc}
          btnText={logoutMutation.isPending ? '로그아웃 중' : logOutSetting.btnText}
          onCancelClick={() => setActiveModal(null)}
          onConfirmClick={() => {
            if (!logoutMutation.isPending) {
              trackEvent('logout_requested');
              logoutMutation.mutate();
            }
          }}
        />
      ) : activeModal === 'withdraw' ? (
        <ConfirmBottomSheet
          dialogId="withdraw-confirm"
          title={withdrawSetting.title}
          desc={withdrawSetting.desc}
          btnText={withdrawSetting.btnText}
          onCancelClick={() => setActiveModal(null)}
          onConfirmClick={() => setActiveModal('withdrawConfirm')}
        />
      ) : activeModal === 'withdrawConfirm' ? (
        <ConfirmBottomSheet
          dialogId="withdraw-final-confirm"
          title={confirmWithdraw.title}
          desc={confirmWithdraw.desc}
          btnText={withdrawMutation.isPending ? '탈퇴 중' : confirmWithdraw.btnText}
          onCancelClick={() => setActiveModal(null)}
          onConfirmClick={() => {
            if (!withdrawMutation.isPending) {
              trackEvent('account_deletion_requested');
              withdrawMutation.mutate();
            }
          }}
        />
      ) : activeModal === 'premiumAlert' ? (
        <PremiumAlertSheet
          contact={premiumAlertContact}
          contactType={premiumAlertContactType}
          isPending={premiumAlertMutation.isPending}
          onClose={() => {
            if (!premiumAlertMutation.isPending) setActiveModal(null);
          }}
          onContactChange={setPremiumAlertContact}
          onContactTypeChange={(contactType) => {
            setPremiumAlertContactType(contactType);
            setPremiumAlertContact('');
          }}
          onSubmit={handlePremiumAlertSubmit}
        />
      ) : null}
    </AppScreen>
  );
}

export default SettingScreen;
