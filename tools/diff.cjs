// Score the shots frames.cjs wrote against the reference set.
//
//   node diff.cjs            -> MAE vs tools/ref/*.png   (the 2.52 % baseline)
//   node diff.cjs --figma    -> MAE vs docs/mockup/red/ref/*.jpg  (the raw
//                               Figma crops; they carry JPEG luminance noise,
//                               so these numbers sit ~0.1 pt higher and are
//                               only good for spot-checks)
//
// All five tools/ref/*.png files were deliberately re-baselined to the
// landing/hero + iPhone-only design, so a clean default run prints 0.0000 %
// on every screen. Use --figma to measure the intentional divergence against
// the original raw Figma JPEG crops (6.2864 / 5.7210 / 3.4435 / 2.2825 /
// 3.0409 %).
const { execSync } = require('child_process');
const path = require('path');
const { OUT } = require('./lib.cjs');

const figma = process.argv.includes('--figma');
const REF = figma
  ? path.join(__dirname, '..', 'docs', 'mockup', 'red', 'ref')
  : path.join(__dirname, 'ref');
const ext = figma ? 'jpg' : 'png';
const names = ['01-shop', '02-product', '03-bag', '04-checkout', '05-confirmed'];
let total = 0;
names.forEach((name, i) => {
  const a = path.join(OUT, `fr-${name}.png`);
  const b = path.join(REF, `${name}.${ext}`);
  const out = execSync(`compare -metric MAE "${a}" "${b}" null: 2>&1 || true`).toString();
  const m = out.match(/\(([\d.]+)\)/);
  const pct = m ? parseFloat(m[1]) * 100 : NaN;
  total += pct;
  console.log(`f${i + 1} ${pct.toFixed(4)} %   ${name}`);
});
console.log(`mean ${(total / names.length).toFixed(4)} %`);
