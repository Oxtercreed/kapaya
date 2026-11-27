#!/usr/bin/env node
/**
 * Regenerates the Kapaya brand assets:
 *   assets/kapaya-logo.svg       standalone vector lockup with embedded Inter 700
 *   assets/kapaya-mark.svg       square monogram/favicon source
 *   assets/kapaya-logo-4k.png    transparent 3840×2160 master
 *   assets/kapaya-logo-4k-cream.png  presentation export on the brand cream
 *
 * The storefront itself embeds the geometry from brand.cjs as inline SVG, so it
 * never requests these files at runtime. Run this only when the brand geometry
 * changes: node docs/mockup/build-logo.cjs
 */
const fs = require('fs');
const path = require('path');
const { execFileSync } = require('child_process');
const { brandSvg, markSvg, BRAND_CREAM } = require('./brand.cjs');
const { launch } = require('../../tools/lib.cjs');

const ROOT = __dirname;
const ASSETS = path.join(ROOT, 'assets');
const fontPath = path.join(ROOT, '.fonts', 'inter-latin-700-normal.woff2');
const fontB64 = fs.readFileSync(fontPath).toString('base64');
const fontCss = `@font-face{font-family:Inter;font-style:normal;font-weight:700;font-display:block;src:url(data:font/woff2;base64,${fontB64}) format('woff2')}`;

fs.mkdirSync(ASSETS, { recursive: true });
fs.writeFileSync(path.join(ASSETS, 'kapaya-logo.svg'), brandSvg(fontCss));
fs.writeFileSync(path.join(ASSETS, 'kapaya-mark.svg'), markSvg());

(async () => {
  const browser = await launch({
    defaultViewport: { width: 3840, height: 2160, deviceScaleFactor: 1 },
  });
  const page = await browser.newPage();
  const svg = brandSvg(fontCss).replace('width="340" height="100"', 'width="2200" height="647"');
  const html = `<!doctype html><html><head><meta charset="utf-8"><style>
    html,body{margin:0;width:3840px;height:2160px;background:transparent;overflow:hidden}
    body{display:flex;align-items:center;justify-content:center}
    svg{display:block}
  </style></head><body>${svg}</body></html>`;
  await page.setContent(html, { waitUntil: 'networkidle0' });
  await page.evaluate(() => document.fonts.ready);
  const png = path.join(ASSETS, 'kapaya-logo-4k.png');
  await page.screenshot({ path: png, omitBackground: true });
  await browser.close();

  // Keep the master genuinely transparent even if a renderer paints a flat backdrop.
  execFileSync('convert', [png, '-fuzz', '0%', '-transparent', '#FFFFFF', png]);
  const cream = path.join(ASSETS, 'kapaya-logo-4k-cream.png');
  execFileSync('convert', ['-size', '3840x2160', `xc:${BRAND_CREAM}`, png, '-composite', '-strip', cream]);
  console.log('Kapaya brand assets: logo.svg, mark.svg, logo-4k.png + cream export (3840×2160)');
})().catch((e) => {
  console.error(e);
  process.exitCode = 1;
});
