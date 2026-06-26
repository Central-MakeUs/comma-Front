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
pnpm dev:device
pnpm dev:web
pnpm dev:storybook
pnpm dev:mobile
pnpm typecheck
pnpm lint
pnpm format
```

웹 개발 서버는 기본적으로 `http://127.0.0.1:5173`에서 실행됩니다.

실기기에서 Expo Go로 테스트할 때는 아래 명령을 사용합니다. 실행 시점의 Mac LAN IP를 자동으로 감지해 WebView URL에 주입합니다.

```bash
pnpm dev:device
```

## Useful Commands

```bash
pnpm dev          # web + mobile-shell 전체 dev task
pnpm dev:web      # React web만 실행, local/simulator
pnpm dev:device   # 실기기 테스트용, web + Expo Go 서버 실행
pnpm dev:storybook # 디자인 시스템 Storybook 실행
pnpm dev:mobile   # Expo shell만 실행
pnpm typecheck    # 전체 타입체크
pnpm lint         # Biome 검사
pnpm format       # Biome 포맷
pnpm check        # Biome 자동 수정 가능한 항목 반영
pnpm build        # 전체 빌드
pnpm build:storybook # Storybook 정적 빌드
```

## Storybook

Storybook은 GitHub Pages로 배포합니다.

```txt
https://central-makeus.github.io/comma-Front/
```

GitHub Pages source는 repository Settings에서 `GitHub Actions`로 설정되어 있어야 합니다.

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
