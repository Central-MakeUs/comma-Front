import { NATIVE_BACK_EVENT, NATIVE_BACK_RESPONSE_TYPE } from '@comma/bridge';
import {
  createContext,
  type ReactNode,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef
} from 'react';
import {
  isNativeBackBlockedPath,
  type NativeBackHandler,
  runNativeBackHandlers
} from '../../lib/nativeBack';

interface NativeBackContextValue {
  register: (handler: NativeBackHandler) => () => void;
}

interface NativeBackEventDetail {
  requestId: string;
}

const NativeBackContext = createContext<NativeBackContextValue | null>(null);

function isEditableElement(element: Element | null): element is HTMLElement {
  return (
    element instanceof HTMLElement &&
    (element.matches('input, textarea, select') || element.isContentEditable)
  );
}

function dismissOpenLayer() {
  const layer = document.querySelector('[role="dialog"], [role="menu"]');
  if (!layer) return false;

  document.dispatchEvent(
    new KeyboardEvent('keydown', {
      bubbles: true,
      cancelable: true,
      key: 'Escape'
    })
  );
  return true;
}

function respondToNative(requestId: string, handled: boolean) {
  window.ReactNativeWebView?.postMessage(
    JSON.stringify({
      type: NATIVE_BACK_RESPONSE_TYPE,
      requestId,
      handled
    })
  );
}

export function NativeBackProvider({ children }: { children: ReactNode }) {
  const handlersRef = useRef<NativeBackHandler[]>([]);
  const register = useCallback((handler: NativeBackHandler) => {
    handlersRef.current.push(handler);

    return () => {
      handlersRef.current = handlersRef.current.filter((candidate) => candidate !== handler);
    };
  }, []);
  const contextValue = useMemo(() => ({ register }), [register]);

  useEffect(() => {
    const handleNativeBack = (event: Event) => {
      const detail = (event as CustomEvent<NativeBackEventDetail>).detail;
      if (!detail || typeof detail.requestId !== 'string') return;

      if (isEditableElement(document.activeElement)) {
        document.activeElement.blur();
        respondToNative(detail.requestId, true);
        return;
      }

      try {
        if (runNativeBackHandlers(handlersRef.current)) {
          respondToNative(detail.requestId, true);
          return;
        }
      } catch (error) {
        console.error('Failed to handle native back navigation.', error);
        respondToNative(detail.requestId, true);
        return;
      }

      if (dismissOpenLayer() || isNativeBackBlockedPath(window.location.pathname)) {
        respondToNative(detail.requestId, true);
        return;
      }

      respondToNative(detail.requestId, false);
    };

    window.addEventListener(NATIVE_BACK_EVENT, handleNativeBack);
    return () => window.removeEventListener(NATIVE_BACK_EVENT, handleNativeBack);
  }, []);

  return <NativeBackContext.Provider value={contextValue}>{children}</NativeBackContext.Provider>;
}

export function useNativeBackHandler(handler: NativeBackHandler, enabled = true) {
  const context = useContext(NativeBackContext);
  const handlerRef = useRef(handler);
  handlerRef.current = handler;

  useEffect(() => {
    if (!enabled || !context) return;

    return context.register(() => handlerRef.current());
  }, [context, enabled]);
}
