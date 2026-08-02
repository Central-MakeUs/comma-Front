import type { ReactNode } from 'react';
import { Icon } from '../Icon';
import {
  closeButton,
  closeIcon,
  closeSlot,
  message,
  messageMuted,
  toast,
  toastTone
} from './Toast.css';

export type ToastVariant = 'login' | 'open' | 'lock' | 'edit' | 'report' | 'block';

export type ToastProps = {
  variant?: ToastVariant;
  className?: string;
  message?: ReactNode;
  onClose?: () => void;
};

const toastMessages = {
  login: '로그인 에러입니다. 다시 시도해주세요.',
  edit: '닉네임을 수정했어요.'
} as const;

export function Toast({
  variant = 'login',
  className,
  message: customMessage,
  onClose
}: ToastProps) {
  const rootClassName = [toast, toastTone[variant === 'login' ? 'default' : variant], className]
    .filter(Boolean)
    .join(' ');
  const hasCustomMessage = customMessage !== undefined;

  return (
    <div className={rootClassName} role={variant === 'login' ? 'alert' : 'status'}>
      <p className={message}>
        {hasCustomMessage ? customMessage : null}
        {!hasCustomMessage && variant === 'open' ? (
          <>
            <span className={messageMuted}>공개 · </span>
            <span>피드에 활동 사진을 올렸어요.</span>
          </>
        ) : null}
        {!hasCustomMessage && variant === 'lock' ? (
          <>
            <span className={messageMuted}>비공개 · </span>
            <span>내 쉼표에 활동 사진을 올렸어요.</span>
          </>
        ) : null}
        {!hasCustomMessage && (variant === 'login' || variant === 'edit')
          ? toastMessages[variant]
          : null}
        {!hasCustomMessage && variant === 'report' ? (
          <span>신고가 정상적으로 접수되었어요.</span>
        ) : null}
        {!hasCustomMessage && variant === 'block' ? <span>해당 피드를 차단했어요.</span> : null}
      </p>
      <span className={closeSlot}>
        <button aria-label="토스트 닫기" className={closeButton} onClick={onClose} type="button">
          <Icon aria-hidden color="currentColor" className={closeIcon} name="x" />
        </button>
      </span>
    </div>
  );
}
