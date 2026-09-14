#!/usr/bin/env bash
# Render a post HTML (1080×1350) to PNG with headless Chrome.
# Usage: post/templates/render.sh path/to/post.html [out.png]
set -uo pipefail
IN="$(cd "$(dirname "$1")" && pwd)/$(basename "$1")"
OUT="${2:-${IN%.html}.png}"
CHROME="/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"
PROF="$(mktemp -d)"
rm -f "$OUT"
"$CHROME" --headless=new --disable-gpu --hide-scrollbars --user-data-dir="$PROF" \
  --window-size=1080,1350 --virtual-time-budget=8000 --screenshot="$OUT" "file://$IN" >/dev/null 2>&1 &
PID=$!
for i in $(seq 1 40); do [ -s "$OUT" ] && break; sleep 0.5; done
sleep 1; kill $PID 2>/dev/null; rm -rf "$PROF"
[ -s "$OUT" ] && echo "$OUT" || { echo "render failed: $IN" >&2; exit 1; }
