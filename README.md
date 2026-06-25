# Comma Front

React web app을 Expo React Native shell의 WebView 안에서 실행하는 Turborepo입니다.

## Structure

```txt
apps/
  web/             # Vite React web app
  mobile-shell/    # Expo shell + WebView
packages/
  bridge/          # typed native method bridge contracts
  design-system/   # design tokens and brand constants
```

## Bridge

WebView 통신은 `@webview-bridge/web`, `@webview-bridge/react-native`, `zod` 기반으로 구성되어 있습니다.

```txt
packages/bridge/src/index.ts      # AppBridge, AppPostMessageSchema
apps/mobile-shell/src/bridge.ts   # native method implementations
apps/web/src/bridge.ts            # typed web client
```

## Commands

```bash
nvm use
pnpm install
pnpm dev:web
pnpm dev:web:lan
pnpm dev:mobile
pnpm dev:mobile-client
pnpm typecheck
pnpm lint
pnpm format
```

웹 개발 서버는 기본적으로 `http://127.0.0.1:5173`에서 실행됩니다.

실기기에서 Expo Go로 테스트할 때는 Mac의 LAN IP를 `.env`에 넣어야 합니다.

```bash
cp .env.example .env
```

```env
EXPO_PUBLIC_WEB_URL=http://YOUR_MAC_LAN_IP:5173
```

그 경우 웹 서버는 LAN용 명령으로 실행합니다.

```bash
pnpm dev:web:lan
```

## Useful Commands

```bash
pnpm dev          # web + mobile-shell 전체 dev task
pnpm dev:web      # React web만 실행, local/simulator
pnpm dev:web:lan  # React web을 LAN 접근 가능하게 실행, 실기기용
pnpm dev:mobile   # Expo shell만 실행
pnpm dev:mobile-client # installed dev-client 앱에 연결
pnpm ios:dev-client    # iOS dev-client 빌드/실행
pnpm android:dev-client # Android dev-client 빌드/실행
pnpm typecheck    # 전체 타입체크
pnpm lint         # Biome 검사
pnpm format       # Biome 포맷
pnpm check        # Biome 자동 수정 가능한 항목 반영
pnpm build        # 전체 빌드
```

## Commit Convention

커밋 메시지는 Conventional Commits 형식을 사용합니다. Husky `commit-msg` hook이 커밋 시 자동으로 검사합니다.

```txt
type: subject
```

한글 subject를 사용할 수 있습니다.

```bash
feat: 초기 세팅 추가
fix: 웹뷰 브릿지 오류 수정
docs: README 실행 방법 추가
chore: 의존성 정리
refactor: 디자인 시스템 구조 개선
```

주로 사용하는 type:

```txt
feat
fix
docs
style
refactor
test
chore
build
ci
perf
revert
```

아래처럼 type 없이 작성하면 실패합니다.

```txt
초기 세팅 추가
버그 수정
```

## Expo Dev Client

Expo Go로 충분한 동안은 `pnpm dev:mobile`을 쓰면 됩니다. 네이티브 SDK나 config plugin이 필요해지면 dev-client 앱을 한 번 빌드한 뒤 사용합니다.

```bash
pnpm ios:dev-client
# or
pnpm android:dev-client
```

이후에는 아래 명령으로 Metro를 dev-client 모드로 실행합니다.

```bash
pnpm dev:mobile-client
```
