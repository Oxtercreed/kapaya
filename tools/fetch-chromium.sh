#!/usr/bin/env bash
# The probes need the Chrome build that produced the checked-in fidelity
# baseline. The binary itself is git-ignored, so a fresh clone fetches the
# npm-hosted Chromium 109 package (registry.npmjs.org is on the sandbox
# allowlist) and unpacks its browser, nss libraries and SwiftShader runtime.
set -euo pipefail
cd "$(dirname "$0")"

PKG="@sparticuz/chromium@109.0.6"
DIR=".chromium"
BROWSER="$DIR/chromium"
NSS_LIB="$DIR/lib/libnss3.so"
SWIFTSHADER=(libEGL.so libGLESv2.so libvk_swiftshader.so libvulkan.so.1 vk_swiftshader_icd.json)

sync_runtime_libs() {
  # This build resolves its graphics runtime from /tmp. Keep those files in
  # sync even when .chromium/ already exists from an earlier run.
  for name in "${SWIFTSHADER[@]}"; do
    if [ -f "$DIR/$name" ] && [ ! -f "/tmp/$name" ]; then
      cp "$DIR/$name" "/tmp/$name"
    fi
  done
}

if [ -x "$BROWSER" ] && [ -f "$NSS_LIB" ]; then
  sync_runtime_libs
  echo "already present: $BROWSER"
  exit 0
fi

echo "fetching $PKG from the npm registry..."
TMP="$(mktemp -d)"
trap 'rm -rf "$TMP"' EXIT
TARBALL="$(npm pack "$PKG" --pack-destination "$TMP" --silent | tail -n 1)"
tar -xzf "$TMP/$TARBALL" -C "$TMP"
mkdir -p "$DIR/lib"

node - "$TMP" "$DIR" <<'NODE'
const fs = require('fs');
const path = require('path');
const zlib = require('zlib');
const [tmp, dir] = process.argv.slice(2);
const unpack = (name, output) => {
  fs.writeFileSync(output, zlib.brotliDecompressSync(
    fs.readFileSync(path.join(tmp, 'package', 'bin', name))
  ));
};
unpack('chromium.br', path.join(dir, 'chromium'));
fs.chmodSync(path.join(dir, 'chromium'), 0o755);
unpack('aws.tar.br', path.join(tmp, 'aws.tar'));
unpack('swiftshader.tar.br', path.join(tmp, 'swiftshader.tar'));
NODE

tar -xf "$TMP/aws.tar" -C "$DIR"
tar -xf "$TMP/swiftshader.tar" -C "$DIR"
sync_runtime_libs
echo "installed: $BROWSER ($(du -h "$BROWSER" | cut -f1))"
