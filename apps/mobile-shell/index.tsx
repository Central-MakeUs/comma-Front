import * as Sentry from '@sentry/react-native';
import { registerRootComponent } from 'expo';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import App from './App';
import {
  sanitizeSentryBreadcrumb,
  sanitizeSentryBreadcrumbs,
  stripUrlDetails
} from './src/sentryPrivacy';

const sentryEnvironment =
  process.env.EXPO_PUBLIC_SENTRY_ENVIRONMENT ?? (__DEV__ ? 'development' : 'production');

Sentry.init({
  beforeBreadcrumb: sanitizeSentryBreadcrumb,
  beforeSend(event) {
    event.user = undefined;
    if (event.request) {
      event.request.cookies = undefined;
      event.request.data = undefined;
      event.request.headers = undefined;
      event.request.query_string = undefined;
      if (event.request.url) event.request.url = stripUrlDetails(event.request.url);
    }
    event.breadcrumbs = sanitizeSentryBreadcrumbs(event.breadcrumbs);
    return event;
  },
  dsn: 'https://19b720dfff21c93d58ce6ecc410e8790@o4511961421774848.ingest.us.sentry.io/4511961430032384',
  enabled: sentryEnvironment !== 'development',
  environment: sentryEnvironment,
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
