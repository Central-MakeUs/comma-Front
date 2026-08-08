import { Toast } from '@comma/design-system';
import {
  createContext,
  type ReactNode,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState
} from 'react';
import * as styles from './AppToastProvider.css';

const DEFAULT_TOAST_DURATION_MS = 4000;

type ToastTone = 'error' | 'success';

interface ShowToastOptions {
  duration?: number;
  tone?: ToastTone;
}

interface AppToastState {
  duration: number;
  id: number;
  message: string;
  tone: ToastTone;
}

interface AppToastContextValue {
  showToast: (message: string, options?: ShowToastOptions) => void;
}

const AppToastContext = createContext<AppToastContextValue | null>(null);

export function AppToastProvider({ children }: { children: ReactNode }) {
  const nextToastIdRef = useRef(0);
  const [toast, setToast] = useState<AppToastState | null>(null);

  const showToast = useCallback((message: string, options: ShowToastOptions = {}) => {
    nextToastIdRef.current += 1;
    setToast({
      duration: options.duration ?? DEFAULT_TOAST_DURATION_MS,
      id: nextToastIdRef.current,
      message,
      tone: options.tone ?? 'error'
    });
  }, []);

  useEffect(() => {
    if (!toast) return;

    const timeoutId = window.setTimeout(() => setToast(null), toast.duration);
    return () => window.clearTimeout(timeoutId);
  }, [toast]);

  return (
    <AppToastContext.Provider value={{ showToast }}>
      {children}
      {toast ? (
        <div className={styles.toastLayer} data-overlay="true" key={toast.id}>
          <Toast
            className={styles.toast}
            message={toast.message}
            onClose={() => setToast(null)}
            variant={toast.tone === 'error' ? 'login' : 'edit'}
          />
        </div>
      ) : null}
    </AppToastContext.Provider>
  );
}

export function useAppToast() {
  const context = useContext(AppToastContext);
  if (!context) throw new Error('useAppToast must be used within AppToastProvider.');
  return context;
}
