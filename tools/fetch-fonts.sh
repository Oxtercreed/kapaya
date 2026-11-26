#!/usr/bin/env bash
# build.cjs inlines Inter from docs/mockup/.fonts/*.woff2, which is git-ignored
# (font binaries). This restores them from the npm registry, which is a host the
# sandbox / CI can actually reach. Inter is OFL 1.1.
set -euo pipefail
cd "$(dirname "$0")/.."
D=docs/mockup/.fonts
mkdir -p "$D"
if [ -s "$D/inter-latin-400-normal.woff2" ]; then echo "already present in $D"; exit 0; fi
V=5.0.16
TMP=$(mktemp -d)
echo "fetching @fontsource/inter@$V"
curl -fsSL "https://registry.npmjs.org/@fontsource/inter/-/inter-$V.tgz" -o "$TMP/inter.tgz"
for w in 400 500 600 700; do
  tar xzf "$TMP/inter.tgz" -C "$TMP" "package/files/inter-latin-$w-normal.woff2"
  cp "$TMP/package/files/inter-latin-$w-normal.woff2" "$D/"
done
rm -rf "$TMP"
ls -la "$D"
