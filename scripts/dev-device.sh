#!/bin/sh
set -eu

if [ -f .env ]; then
  set -a
  # shellcheck disable=SC1091
  . ./.env
  set +a
fi

LAN_IP="$(
  ipconfig getifaddr en0 2>/dev/null ||
    ipconfig getifaddr en1 2>/dev/null ||
    route get default 2>/dev/null | awk '/interface: / { print $2; exit }' | xargs ipconfig getifaddr 2>/dev/null
)"

if [ -z "$LAN_IP" ]; then
  echo "Unable to detect a LAN IP address. Set EXPO_PUBLIC_WEB_URL manually." >&2
  exit 1
fi

export EXPO_PUBLIC_WEB_URL="http://$LAN_IP:5173"
echo "Using EXPO_PUBLIC_WEB_URL=$EXPO_PUBLIC_WEB_URL"

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
