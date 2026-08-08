import * as styles from './QueryFeedback.css';

interface QueryFeedbackProps {
  message: string;
  onRetry?: () => void;
  state: 'loading' | 'error';
}

export function QueryFeedback({ message, onRetry, state }: QueryFeedbackProps) {
  return (
    <div
      aria-live={state === 'error' ? 'assertive' : 'polite'}
      className={styles.container}
      role={state === 'error' ? 'alert' : 'status'}
    >
      <span className={styles.message}>{message}</span>
      {state === 'error' && onRetry ? (
        <button className={styles.retryButton} onClick={onRetry} type="button">
          다시 시도
        </button>
      ) : null}
    </div>
  );
}
