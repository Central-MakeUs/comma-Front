#!/bin/sh
set -eu

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
