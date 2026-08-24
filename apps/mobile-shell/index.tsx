import * as Sentry from '@sentry/react-native';
import { registerRootComponent } from 'expo';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import App from './App';

Sentry.init({
  beforeSend(event) {
    event.user = undefined;
    if (event.request) {
      event.request.cookies = undefined;
      event.request.data = undefined;
      event.request.headers = undefined;
      event.request.query_string = undefined;
      if (event.request.url) event.request.url = event.request.url.split(/[?#]/, 1)[0];
    }
    event.breadcrumbs = event.breadcrumbs?.map((breadcrumb) => ({
      ...breadcrumb,
      data:
        typeof breadcrumb.data?.url === 'string'
          ? { ...breadcrumb.data, url: breadcrumb.data.url.split(/[?#]/, 1)[0] }
          : breadcrumb.data
    }));
    return event;
  },
  dsn: 'https://19b720dfff21c93d58ce6ecc410e8790@o4511961421774848.ingest.us.sentry.io/4511961430032384',
  enabled: !__DEV__,
  environment: __DEV__ ? 'development' : 'production',
  sendDefaultPii: false,
  tracesSampleRate: 0
});

function Root() {
  return (
    <SafeAreaProvider>
      <App />
    </SafeAreaProvider>
  );
}

registerRootComponent(Sentry.wrap(Root));
