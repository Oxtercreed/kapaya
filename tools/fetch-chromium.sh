#!/usr/bin/env bash
# The probes need a Chrome/Chromium binary. tools/.chromium/ is git-ignored
# (it is a 150 MB blob), so a fresh clone fetches it once with this script.
# Any Chromium build works: set CHROMIUM_PATH to skip the download.
set -euo pipefail
cd "$(dirname "$0")"
STAMP="chromium-1098572"
DIR=".chromium"
mkdir -p "$DIR"
if [ -x "$DIR/chromium" ]; then
  echo "already present: $DIR/chromium"
  exit 0
fi
echo "no Chromium found."
echo "Download a Chrome for Testing build for linux64, e.g.:"
echo "  https://storage.googleapis.com/chrome-for-testing-public/\$(curl -s https://googlechromelabs.github.io/chrome-for-testing/last-known-good-versions.json | python3 -c 'import json,sys;print(json.load(sys.stdin)[\"channels\"][\"Stable\"][\"version\"])')/linux64/chrome-linux64.zip"
echo "then:  unzip -j chrome-linux64.zip chrome-linux64/chrome -d $DIR && mv $DIR/chrome $DIR/chromium && chmod +x $DIR/chromium"
echo "or point CHROMIUM_PATH at any existing Chromium binary."
exit 1
