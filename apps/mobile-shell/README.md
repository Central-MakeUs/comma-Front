# Mobile shell

The mobile shell renders the web UI in a WebView, but social authentication runs only through
native SDKs. Expo Go is not supported; use a development build.

## Native login configuration

Copy `.env.example` to `.env.local` and provide these public identifiers:

- `KAKAO_NATIVE_APP_KEY`: Kakao native app key.
- `EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID`: Google OAuth Web client ID used as the ID-token audience.
- `EXPO_PUBLIC_GOOGLE_IOS_CLIENT_ID`: Google OAuth iOS client ID used by the iOS SDK.
- `GOOGLE_IOS_URL_SCHEME`: reversed client ID from the Google iOS OAuth client.

Provider consoles must also contain the following registrations:

- Kakao: Android package `app.comma.mobile`, iOS bundle ID `com.comma.app`, and the debug, EAS,
  and Play signing key hashes.
- Google: Android OAuth clients for `app.comma.mobile` and each SHA-1 certificate, an iOS OAuth
  client for `com.comma.app`, and the Web client ID accepted by the backend.
- Apple: Sign in with Apple enabled for `com.comma.app`; the backend must accept this bundle ID as
  an identity-token audience.

Configure the same variables in the EAS `development`, `preview`, and `production` environments
before building. Then create and run a development client:

```sh
eas build --platform android --profile development
pnpm dev:device
```
