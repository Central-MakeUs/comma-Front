#!/bin/sh
set -eu

DEVICE_WEB_URL=''

if command -v adb >/dev/null 2>&1; then
  if adb get-state >/dev/null 2>&1; then
    if adb reverse tcp:8081 tcp:8081 && adb reverse tcp:5173 tcp:5173; then
      DEVICE_WEB_URL='http://localhost:5173'
      echo 'Android device connected through adb reverse (5173, 8081).'
    else
      echo 'Failed to configure adb reverse for the connected Android device.' >&2
      exit 1
    fi
  else
    echo 'Android adb reverse skipped: connect one authorized device or set ANDROID_SERIAL.' >&2
    adb devices >&2 || true
  fi
else
  echo 'Android adb reverse skipped: adb is not installed.' >&2
fi

cleanup() {
  if [ -n "${WEB_PID:-}" ]; then
    kill "$WEB_PID" 2>/dev/null || true
  fi

  if [ -n "${MOBILE_PID:-}" ]; then
    kill "$MOBILE_PID" 2>/dev/null || true
  fi
}

trap cleanup INT TERM EXIT

pnpm --filter @comma/web dev:device &
WEB_PID=$!

if [ -n "$DEVICE_WEB_URL" ]; then
  EXPO_PUBLIC_WEB_URL="$DEVICE_WEB_URL" pnpm --filter @comma/mobile-shell dev:device &
else
  pnpm --filter @comma/mobile-shell dev:device &
fi
MOBILE_PID=$!

wait "$WEB_PID" "$MOBILE_PID"
