// Score the shots frames.cjs wrote against the reference set.
//
//   node diff.cjs            -> MAE vs tools/ref/*.png   (the 2.52 % baseline)
//   node diff.cjs --figma    -> MAE vs docs/mockup/red/ref/*.jpg  (the raw
//                               Figma crops; they carry JPEG luminance noise,
//                               so these numbers sit ~0.1 pt higher and are
//                               only good for spot-checks)
//
// tools/ref/02-05 are the lossless Figma targets behind
// 2.52 / 3.25 / 2.14 / 2.88 %. tools/ref/01-shop.png was deliberately
// re-baselined to the edge-bleeding landing/shop hero, so a clean default run
// prints 0.0000 / 2.5178 / 3.2505 / 2.1390 / 2.8836 %. Use --figma to see the
// intentional Shop divergence against the original raw JPEG crop.
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
