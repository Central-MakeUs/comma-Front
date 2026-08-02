#!/bin/sh
set -eu

if command -v adb >/dev/null 2>&1; then
  adb reverse tcp:8081 tcp:8081 >/dev/null 2>&1 || true
  adb reverse tcp:5173 tcp:5173 >/dev/null 2>&1 || true
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

pnpm --filter @comma/mobile-shell dev:device &
MOBILE_PID=$!

wait "$WEB_PID" "$MOBILE_PID"
