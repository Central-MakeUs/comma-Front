import { NATIVE_BACK_RESPONSE_TYPE } from '@comma/bridge';
import * as WebBrowser from 'expo-web-browser';
import { useCallback } from 'react';
import type { WebViewMessageEvent } from 'react-native-webview/lib/WebViewTypes';
import { isExternalBrowserUrl, isTrustedWebViewMessageUrl } from './webViewSecurity';

interface UseWebViewMessageHandlerOptions {
  onNativeBackResponse?: (requestId: string, handled: boolean) => void;
  webOrigin?: string;
}

export function useWebViewMessageHandler({
  onNativeBackResponse,
  webOrigin
}: UseWebViewMessageHandlerOptions) {
  const handleMessage = useCallback(
    async (event: WebViewMessageEvent) => {
      if (!webOrigin || !isTrustedWebViewMessageUrl(event.nativeEvent.url, webOrigin)) {
        console.warn('Blocked a WebView message from an untrusted origin.', event.nativeEvent.url);
        return;
      }

      let message:
        | {
            type?: string;
            url?: string;
            handled?: unknown;
            requestId?: unknown;
          }
        | undefined;
      try {
        message = JSON.parse(event.nativeEvent.data);
      } catch (error) {
        console.log(error);
        return;
      }

      switch (message?.type) {
        case NATIVE_BACK_RESPONSE_TYPE: {
          if (typeof message.requestId === 'string' && typeof message.handled === 'boolean') {
            onNativeBackResponse?.(message.requestId, message.handled);
          }
          break;
        }
        case 'OPEN_EXTERNAL': {
          if (message.url && isExternalBrowserUrl(message.url)) {
            await WebBrowser.openBrowserAsync(message.url);
          } else {
            console.warn('Blocked an unsupported external URL.', message.url);
          }
          break;
        }
      }
    },
    [onNativeBackResponse, webOrigin]
  );

  return { handleMessage };
}
