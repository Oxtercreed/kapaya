#!/usr/bin/env node
/**
 * Builds docs/mockup/index.html — a 1:1 replica of the RED frames in the
 * "Untitled" Figma file (zoygvtfjWN92VUiWAsSMOL):
 *
 *   8:2   01 · Shop · Red            8:240  04 · Checkout · Red
 *   8:92  02 · Product details · Red 8:342  05 · Order confirmed · Red
 *   8:161 03 · Shopping bag · Red
 *
 * Positions, sizes, colours and copy were measured off a 1:1 render of those
 * frames (see NOTES-red.md). Frames are laid out with absolute coordinates so
 * the output lands on the same pixels as the Figma frames. Nothing is invented.
 * Output is a single self-contained HTML file: Inter is inlined as base64 woff2
 * and the product photography is inlined as base64 JPEG, so it opens anywhere
 * with no build step, no network and no missing assets.
 */

const fs = require('fs');
const path = require('path');

const ROOT = __dirname;
const IMG = path.join(ROOT, 'red', 'img');
const FONTS = path.join(ROOT, '.fonts');

const b64 = (p, mime) => `data:${mime};base64,${fs.readFileSync(p).toString('base64')}`;
const img = (n) => b64(path.join(IMG, n), 'image/jpeg');
const font = (w, f) => {
  const p = path.join(FONTS, f);
  return fs.existsSync(p)
    ? `@font-face{font-family:Inter;font-style:normal;font-weight:${w};font-display:block;src:url(${b64(p, 'font/woff2')}) format('woff2')}`
    : '';
};

/* ── palette (sampled from the frames) ─────────────────────────────────── */
const C = {
  field: '#FAF9F9',
  white: '#FFFFFF',
  ink: '#14171E',
  body: '#656976',
  hair: '#E8E6E7',
  accent: '#C92332',
  accentInk: '#96151F',
  tint: '#FCE6E9',
  tintSoft: '#FDECEE',
  tintRow: '#FAEDEF',
  search: '#F5F3F3',
  tile: '#F3F3F3',
  green: '#D8F2E7',
  border: '#DCDCDD',
};

const PW = 1440, PH = 1200, M = 64, CW = 1312;

/* absolute placement shorthand */
const at = (x, y, w, h, extra = '') =>
  `position:absolute;left:${x}px;top:${y}px;` +
  (w === null ? '' : `width:${w}px;`) +
  (h === null ? '' : `height:${h}px;`) +
  extra;

/* a positioned text run; `style` carries font + colour */
const T = (x, y, style, content, extra = '') =>
  `<div style="${at(x, y, 'auto', null, extra ? extra.replace(/;?$/, ';') : '')}${style}">${content}</div>`;

/* font shorthands, all measured */
const F = {
  band: 'font:500 12px/14px Inter;color:' + C.accentInk,
  mark: 'font:700 28px/28px Inter;color:' + C.ink,
  nav: 'font:400 15px/15px Inter;color:' + C.ink,
  navOn: 'font:600 15px/15px Inter;color:' + C.accent,
  search: 'font:400 14px/14px Inter;color:' + C.body,
  orders: 'font:500 14px/14px Inter;color:' + C.ink,
  bagpill: 'font:600 14px/14px Inter;color:#fff',
  eyebrow: 'font:600 12px/15px Inter;letter-spacing:.1px;color:' + C.accentInk,
  heroH: 'font:600 48px/58px Inter;color:' + C.ink,
  heroP: 'font:400 16px/19px Inter;color:#6B5F62',
  heroMH: 'font:500 26px/31px Inter;color:' + C.ink,
  heroPrice: 'font:600 22px/27px Inter;color:' + C.ink,
  heroNote: 'font:400 13px/16px Inter;color:#6B5F62',
  btnDark: 'font:600 14px/14px Inter;color:#fff',
  secH: 'font:600 28px/34px Inter;color:' + C.ink,
  secP: 'font:400 14px/17px Inter;color:' + C.body,
  chip: 'font:500 14px/14px Inter;color:' + C.ink,
  chipOn: 'font:500 14px/14px Inter;color:#fff',
  count: 'font:400 14px/14px Inter;color:#7A7E88',
  sort: 'font:500 14px/14px Inter;color:' + C.ink,
  cardName: 'font:600 16px/20px Inter;color:' + C.ink,
  cardKind: 'font:400 13px/16px Inter;color:' + C.body,
  cardRate: 'font:400 12.5px/15px Inter;color:#3E4148',
  cardPrice: 'font:600 15px/18px Inter;color:' + C.ink,
  cardLink: 'font:400 12.5px/15px Inter;color:' + C.ink,
  svc: 'font:400 14px/14px Inter;color:#3C3F48',
  ftrMark: 'font:700 22px/22px Inter;color:' + C.ink,
  ftrTag: 'font:400 14px/14px Inter;color:' + C.body,
  ftrL: 'font:400 14px/14px Inter;color:' + C.ink,
  ftrCopy: 'font:400 12px/12px Inter;color:' + C.body,
  crumb: 'font:400 13px/16px Inter;color:#7A7E88',
  pageH: 'font:600 40px/48px Inter;color:' + C.ink,
  pageP: 'font:400 14px/17px Inter;color:' + C.body,
};

/* ── chrome ────────────────────────────────────────────────────────────── */
const NAV = [['Shop', 239], ['Audio', 311], ['Wearables', 391], ['Accessories', 504]];
const FOOT = [['Help center', 780], ['Shipping & returns', 899], ['Privacy', 1088], ['Terms', 1185]];

const chrome = ({ bag = 0, current = 'Shop' } = {}) => `
  <div style="${at(0, 0, PW, 28, `background:${C.tintSoft}`)}"></div>
  ${T(501, 7, F.band, 'Good tech. Better everyday.')}
  ${T(677, 7, F.band, 'Free shipping on orders $100+')}
  <div style="${at(0, 28, PW, 93, `background:${C.white}`)}"></div>
  <div style="${at(0, 120, PW, 1, `background:${C.hair}`)}"></div>
  ${T(M, 60, F.mark, 'VOLTA')}
  ${NAV.map(([l, x]) => T(x, 67, l === current ? F.navOn : F.nav, l)).join('')}
  <div style="${at(784, 50, 310, 48, `background:${C.search};border-radius:24px`)}"></div>
  ${T(808, 66, F.search, 'Search products…')}
  ${T(1131, 67, F.orders, 'My orders')}
  <div style="${at(1250, 50, 126, 46, `background:${C.ink};border-radius:23px`)}"></div>
  ${T(1250, 65, F.bagpill, `Bag (${bag})`, 'width:126px;text-align:center')}`;

const footer = () => `
  <div style="${at(0, 1092, PW, 108, `background:${C.white};border-top:1px solid ${C.hair}`)}"></div>
  ${T(M, 1126, F.ftrMark, 'VOLTA')}
  ${T(181, 1131, F.ftrTag, 'Thoughtful tech for everyday life.')}
  ${FOOT.map(([l, x]) => T(x, 1131, F.ftrL, l)).join('')}
  ${T(1275, 1131, F.ftrCopy, '© 2026 VOLTA')}`;

const HEART = (s) =>
  `<svg width="${s}" height="${s}" viewBox="0 0 24 24" fill="none" stroke="#14171E" stroke-width="1.8"><path d="M12 20s-7.4-4.6-7.4-9.9A4.4 4.4 0 0 1 12 7.2a4.4 4.4 0 0 1 7.4 2.9c0 5.3-7.4 9.9-7.4 9.9Z"/></svg>`;

const SPARK = `<span style="color:${C.accent};font-size:12px">★</span>`;

/* ══ 01 · Shop ══════════════════════════════════════════════════════════ */
const CARDS = [
  { i: 'card1.jpg', b: 'Bestseller', n: 'Aurora Buds Pro', k: 'Wireless earbuds', r: '4.9 · 128 reviews', p: '$189.00', h: false },
  { i: 'card2.jpg', b: 'Premium sound', n: 'Vertex H9 Headphones', k: 'Over-ear headphones', r: '4.8 · 96 reviews', p: '$249.00', h: false },
  { i: 'card3.jpg', b: 'New arrival', n: 'Pulse Watch S2', k: 'Everyday smartwatch', r: '4.8 · 182 reviews', p: '$198.00', h: true },
  { i: 'card4.jpg', b: 'Work better', n: 'Glide Pro Mouse', k: 'Wireless precision mouse', r: '4.9 · 120 reviews', p: '$66.00', h: true },
];

const card = (c, x) => `
  <div style="${at(x, 658, 304, 326, `background:${C.white};border-radius:18px`)}"></div>
  <img src="${img(c.i)}" alt="${c.n}" style="${at(x + 12, 671, 280, 180, 'border-radius:12px;object-fit:cover')}">
  <!-- the badge label is already part of the product plate; nothing to redraw -->
  ${c.h ? T(x + 342, 683, '', HEART(15), `width:30px;height:30px;border-radius:15px;background:${C.white};display:flex;align-items:center;justify-content:center`) : ''}
  ${T(x + 21, 878, F.cardName, c.n)}
  ${T(x + 21, 904, F.cardKind, c.k)}
  ${T(x + 21, 928, F.cardRate, `${SPARK} ${c.r}`)}
  ${T(x + 21, 956, F.cardPrice, c.p)}
  ${T(x + 190, 957, F.cardLink, 'View product <span class="arw">→</span>')}`;

const shop = () => `
<section class="frame">
  ${chrome({ bag: 0 })}

  <div style="${at(M, 154, 1312, 318, `background:${C.tint};border-radius:28px`)}"></div>
  ${T(100, 183, F.eyebrow, 'LESS NOISE. MORE YOU.')}
  ${T(100, 216, F.heroH, 'Your everyday,<br>upgraded.')}
  ${T(102, 345, F.heroP, 'Discover audio that makes room for what matters.')}
  <div style="${at(100, 396, 168, 44, `background:${C.ink};border-radius:22px`)}"></div>
  ${T(100, 412, F.btnDark, 'Shop audio <span class="arw">→</span>', 'width:168px;text-align:center')}

  ${T(635, 191, F.eyebrow, 'AURORA BUDS PRO')}
  ${T(635, 222, F.heroMH, 'Small size.<br>Immersive sound.')}
  ${T(635, 288, F.heroPrice, '$189.00')}
  ${T(635, 346, F.heroNote, 'Noise cancelling · 30-hour battery')}
  <img src="${img('herotile.jpg')}" alt="Aurora Buds Pro" style="${at(1004, 172, 270, 240, 'border-radius:18px;object-fit:cover')}">

  ${T(M, 510, F.secH, 'Find your next everyday essential')}
  ${T(M, 554, F.secP, 'Thoughtful design. Tech you’ll actually love.')}

  <div style="${at(M, 589, 133, 45, `background:${C.accent};border-radius:12px`)}"></div>
  ${T(M, 604, F.chipOn, 'All products', 'width:133px;text-align:center')}
  <div style="${at(212, 589, 85, 45, `background:${C.white};border-radius:12px`)}"></div>
  ${T(212, 604, F.chip, 'Audio', 'width:85px;text-align:center')}
  <div style="${at(312, 589, 118, 45, `background:${C.white};border-radius:12px`)}"></div>
  ${T(312, 604, F.chip, 'Wearables', 'width:118px;text-align:center')}
  <div style="${at(445, 589, 134, 45, `background:${C.white};border-radius:12px`)}"></div>
  ${T(445, 604, F.chip, 'Accessories', 'width:134px;text-align:center')}
  ${T(1100, 605, F.count, '4 products')}
  <div style="${at(1205, 589, 170, 45, `background:${C.white};border-radius:12px`)}"></div>
  ${T(1205, 605, F.sort, 'Sort: Featured', 'width:170px;text-align:center')}

  ${CARDS.map((c, i) => card(c, M + i * 336)).join('')}

  <div style="${at(M, 1012, 1312, 52, `background:${C.tintRow};border-radius:16px`)}"></div>
  ${T(95, 1032, F.svc, 'Free shipping over $100')}
  ${T(500, 1032, F.svc, '30-day easy returns')}
  ${T(958, 1032, F.svc, 'Secure checkout, always')}
  ${footer()}
</section>`;

/* ══ 02 · Product details ═══════════════════════════════════════════════ */
const BEN = [
  { n: '01', h: 'Tune out the noise', b: 'Active noise cancellation helps you<br>focus on the sound you love.' },
  { n: '02', h: 'More listening. Less charging.', b: 'Up to 30 hours of listening with<br>the included charging case.' },
  { n: '03', h: 'Comfort that goes with you', b: 'A lightweight fit and intuitive touch<br>controls for your everyday routine.' },
];

const product = () => `
<section class="frame">
  ${chrome({ bag: 0 })}
  <div style="position:absolute;left:${M}px;top:152px;font:400 13px/16px Inter;color:#6B6F79">Shop<span style="color:#C3C5CB;padding:0 9px">/</span>Audio<span style="color:#C3C5CB;padding:0 9px">/</span><span style="color:${C.ink}">Aurora Buds Pro</span></div>

  <div style="${at(M, 194, 624, 562, `background:${C.white};border-radius:22px`)}"></div>
  <img src="${img('hero.jpg')}" alt="Aurora Buds Pro" style="${at(107, 226, 553, 417, 'border-radius:14px;object-fit:cover')}">
  ${T(105, 684, 'font:400 13px/16px Inter;color:#4E5159', 'A closer look at your next favorite sound.')}
  <div style="${at(568, 671, 106, 38, `background:${C.tintSoft};border-radius:19px`)}"></div>
  ${T(568, 681, 'font:500 13px/16px Inter;color:' + C.accentInk, 'Silver finish', 'width:106px;text-align:center')}

  ${T(752, 192, 'font:500 12px/15px Inter;letter-spacing:.4px;color:' + C.accent, 'AUDIO / WIRELESS EARBUDS')}
  ${T(752, 225, F.pageH, 'Aurora Buds Pro')}
  ${T(752, 288, 'font:400 13px/16px Inter;color:#3E4148', `${SPARK} <b style="font-weight:600">4.9</b> <span style="color:${C.body}">128 verified reviews</span>`)}
  ${T(752, 316, 'font:600 38px/45px Inter;color:' + C.ink, '$189.00')}
  ${T(752, 370, 'font:400 13px/16px Inter;color:#4E5159', 'Tax included. Free standard shipping.')}
  ${T(752, 412, 'font:500 21px/26px Inter;color:' + C.ink, 'Big sound. A little more quiet.')}
  ${T(752, 444, 'font:400 14px/20px Inter;color:' + C.body, 'Get lost in your music, not the noise. A comfortable fit,<br>immersive audio, and all-day power for wherever life goes.')}

  ${T(752, 508, 'font:500 13px/16px Inter;color:#3E4148', 'Color: Silver')}
  <div style="${at(752, 536, 184, 50, `background:${C.tintSoft};border-radius:25px`)}"></div>
  ${T(752, 553, 'font:500 14px/16px Inter;color:' + C.accentInk, 'Silver · selected', 'width:184px;text-align:center')}
  <div style="${at(948, 536, 126, 50, `background:#F3F1F2;border-radius:25px`)}"></div>
  ${T(948, 553, 'font:500 14px/16px Inter;color:' + C.ink, 'Graphite', 'width:126px;text-align:center')}

  ${T(752, 610, 'font:500 13px/16px Inter;color:#3E4148', 'Quantity')}
  <div style="${at(752, 641, 130, 50, `background:${C.white};border:1px solid #E2E2E3;border-radius:25px`)}"></div>
  ${T(775, 657, 'font:400 16px/16px Inter;color:#4E5159', '−')}
  ${T(816, 657, 'font:500 15px/16px Inter;color:' + C.ink, '1')}
  ${T(852, 657, 'font:400 16px/16px Inter;color:#4E5159', '+')}
  <div style="${at(898, 641, 478, 50, `background:${C.accent};border-radius:25px`)}"></div>
  ${T(898, 657, 'font:600 15px/16px Inter;color:#fff', 'Add to bag · $189.00', 'width:478px;text-align:center')}

  ${T(752, 715, 'font:400 13px/16px Inter;color:#3C3F48',
    `In stock <span style="color:#B4B7BD;padding:0 7px">·</span> Arrives Dec 1–3 <span style="color:#B4B7BD;padding:0 7px">·</span> 30-day returns`)}

  ${T(M, 804, F.secH, 'Made for the way you listen')}
  ${BEN.map((d, i) => {
    const x = M + i * 445;
    return `
    <div style="${at(x, 862, 422, 154, `background:${C.white};border-radius:22px`)}"></div>
    ${T(x + 21, 884, 'font:500 12px/14px Inter;color:' + C.accent, d.n)}
    ${T(x + 21, 912, 'font:600 18px/22px Inter;color:' + C.ink, d.h)}
    ${T(x + 21, 947, 'font:400 13.5px/19px Inter;color:' + C.body, d.b)}`;
  }).join('')}

  ${T(M, 1050, 'font:600 13px/16px Inter;color:' + C.accent, 'Overview')}
  ${T(184, 1050, 'font:400 13px/16px Inter;color:#4E5159', 'Specifications')}
  ${T(331, 1050, 'font:400 13px/16px Inter;color:#4E5159', 'Reviews (128)')}
  ${T(1057, 1050, 'font:400 13px/16px Inter;color:' + C.ink, 'Need a hand? Talk to our support team <span class="arw">→</span>')}
  ${footer()}
</section>`;

/* ══ 03 · Shopping bag ══════════════════════════════════════════════════ */
const ALSO = [
  { i: 'rec1.jpg', n: 'Vertex H9 Headphones', p: '$249.00', h: false },
  { i: 'rec2.jpg', n: 'Pulse Watch S2', p: '$198.00', h: true },
  { i: 'rec3.jpg', n: 'Glide Pro Mouse', p: '$66.00', h: true },
];

const bag = () => `
<section class="frame">
  ${chrome({ bag: 1 })}
  <div style="position:absolute;left:${M}px;top:152px;font:400 13px/16px Inter;color:#6B6F79">Shop<span style="color:#C3C5CB;padding:0 9px">/</span><span style="color:${C.ink}">Shopping bag</span></div>

  ${T(M, 196, F.pageH, 'Your bag')}
  ${T(M, 250, F.pageP, '1 item, one great upgrade.')}
  ${T(1199, 216, 'font:500 14px/16px Inter;color:' + C.accent, 'Continue shopping <span class="arw">→</span>')}

  <div style="${at(M, 307, 824, 293, `background:${C.white};border-radius:22px`)}"></div>
  ${T(89, 330, 'font:500 11px/13px Inter;letter-spacing:.4px;color:' + C.body, 'PRODUCT')}
  ${T(583, 330, 'font:500 11px/13px Inter;letter-spacing:.4px;color:' + C.body, 'QUANTITY', 'width:110px;text-align:center')}
  ${T(796, 330, 'font:500 11px/13px Inter;letter-spacing:.4px;color:' + C.body, 'TOTAL', 'width:56px;text-align:right')}
  <div style="${at(92, 361, 768, 1, `background:${C.hair}`)}"></div>

  <img src="${img('bagthumb.jpg')}" alt="Aurora Buds Pro" style="${at(92, 397, 145, 145, 'border-radius:14px;object-fit:cover')}">
  ${T(269, 400, 'font:600 20px/24px Inter;color:' + C.ink, 'Aurora Buds Pro')}
  ${T(269, 433, 'font:400 13px/19px Inter;color:#7A7E88', 'Color: Silver')}
  ${T(269, 452, 'font:400 13px/19px Inter;color:#7A7E88', '$189.00 each')}
  ${T(269, 466, 'font:400 12.5px/15px Inter;color:#3F8A66', 'In stock')}
  ${T(269, 547, 'font:500 12.5px/15px Inter;color:' + C.accent, 'Save for later')}

  <div style="${at(570, 413, 124, 44, `background:#F3F1F2;border-radius:22px`)}"></div>
  ${T(590, 427, 'font:400 15px/16px Inter;color:#4E5159', '−')}
  ${T(634, 428, 'font:500 14px/16px Inter;color:' + C.ink, '1')}
  ${T(668, 427, 'font:400 15px/16px Inter;color:#4E5159', '+')}
  ${T(596, 481, 'font:400 13px/16px Inter;color:#4E5159', 'Remove', 'width:72px;text-align:center')}

  ${T(769, 421, 'font:600 19px/23px Inter;color:' + C.ink, '$189.00')}

  <div style="${at(M, 624, 824, 102, `background:${C.tintRow};border-radius:20px`)}"></div>
  ${T(89, 644, 'font:600 19px/24px Inter;color:' + C.accentInk, 'You’ve unlocked free shipping')}
  ${T(89, 678, 'font:400 13.5px/18px Inter;color:#6B5B5E', 'Your everyday essentials, delivered at no extra cost.')}

  <div style="${at(920, 307, 456, 419, `background:${C.white};border-radius:22px`)}"></div>
  ${T(949, 331, 'font:600 24px/31px Inter;color:' + C.ink, 'Order summary')}
  ${T(949, 394, 'font:400 14px/17px Inter;color:' + C.body, 'Subtotal (1 item)')}
  ${T(1200, 394, 'font:400 14px/17px Inter;color:' + C.ink, '$189.00', 'width:149px;text-align:right')}
  ${T(949, 432, 'font:400 14px/17px Inter;color:' + C.body, 'Standard shipping')}
  ${T(1200, 433, 'font:400 14px/17px Inter;color:#2F7A52', '$', 'width:148px;text-align:right;display:none')}
  ${T(1245, 432, 'font:400 14px/17px Inter;color:#2F7A52', 'Free', 'width:104px;text-align:right')}
  <div style="${at(948, 472, 400, 1, `background:${C.hair}`)}"></div>
  ${T(949, 492, 'font:600 20px/24px Inter;color:' + C.ink, 'Total')}
  ${T(1246, 492, 'font:600 28px/32px Inter;color:' + C.ink, '$189.00', 'width:102px;text-align:right')}
  ${T(949, 541, 'font:400 13px/16px Inter;color:' + C.body, 'Tax included. No surprises at checkout.')}
  <div style="${at(948, 573, 400, 56, `background:${C.accent};border-radius:28px`)}"></div>
  ${T(948, 592, 'font:600 15px/16px Inter;color:#fff', 'Continue to checkout <span class="arw">→</span>', 'width:400px;text-align:center')}
  ${T(948, 657, 'font:400 12.5px/15px Inter;color:' + C.body, 'Secure payment · Card or VOLTA wallet', 'width:400px;text-align:center')}
  ${T(948, 684, 'font:500 12.5px/15px Inter;color:' + C.accentInk, 'Have a promo code? Add it at checkout.', 'width:400px;text-align:center')}

  ${T(M, 784, F.secH, 'A little more to love')}
  ${T(M, 826, F.secP, 'Good company for your everyday setup.')}
  ${ALSO.map((a, i) => {
    const x = M + i * 445;
    return `
    <div style="${at(x, 874, 422, 158, `background:${C.white};border-radius:22px`)}"></div>
    <img src="${img(a.i)}" alt="${a.n}" style="${at(x + 14, 884, 129, 128, 'border-radius:14px;object-fit:cover')}">
    ${a.h ? T(x + 112, 886, '', HEART(14), `width:26px;height:26px;border-radius:13px;background:${C.white};display:flex;align-items:center;justify-content:center`) : ''}
    ${T(x + 168, 900, 'font:600 16px/21px Inter;color:' + C.ink, a.n)}
    ${T(x + 168, 933, 'font:400 14px/17px Inter;color:' + C.ink, a.p)}
    ${T(x + 168, 972, 'font:500 12.5px/15px Inter;color:' + C.accent, 'Explore product <span class="arw">→</span>')}`;
  }).join('')}
  ${footer()}
</section>`;

/* ══ 04 · Checkout ══════════════════════════════════════════════════════ */
const FLD = (x, y, w, label, value) => `
  ${T(x, y, 'font:400 11.5px/14px Inter;color:#3C3F48', label)}
  <div style="${at(x, y + 21, w, 50, `background:${C.white};border:1px solid ${C.border};border-radius:10px`)}"></div>
  ${T(x + 14, y + 37, 'font:400 14px/16px Inter;color:' + C.ink, value)}`;

const checkout = () => `
<section class="frame">
  ${chrome({ bag: 1 })}
  ${T(M + 2, 152, 'font:400 13px/16px Inter;color:' + C.accent, '← Back to bag')}
  ${T(M, 194, F.pageH, 'Checkout')}
  ${T(M + 1, 246, F.pageP, 'Guest checkout')}
  ${T(921, 216, 'font:400 14px/17px Inter;color:#6B6F79',
    `Bag<span style="color:#C3C5CB;padding:0 10px">/</span>Checkout<span style="color:#C3C5CB;padding:0 10px">/</span><span style="color:#4E5159">Confirmation</span>`, 'width:350px;text-align:right')}

  <div style="${at(M, 290, 824, 764, `background:${C.white};border-radius:22px`)}"></div>

  ${T(93, 313, 'font:600 21px/27px Inter;color:' + C.ink, '1. Contact details')}
  ${T(1085, 324, 'font:400 13px/16px Inter;color:#3C3F48', `Already a member? <span style="color:${C.accent}">Sign in</span>`)}
  ${FLD(93, 355, 760, 'Email address', 'alex.morgan@example.com')}
  ${T(93, 430, 'font:400 12.5px/15px Inter;color:#7A7E88', 'Order updates and your receipt will be sent here.')}
  <div style="${at(93, 462, 760, 1, `background:${C.hair}`)}"></div>

  ${T(93, 483, 'font:600 21px/27px Inter;color:' + C.ink, '2. Shipping address')}
  ${FLD(93, 527, 362, 'First name', 'Alex')}
  ${FLD(491, 527, 362, 'Last name', 'Morgan')}
  ${FLD(93, 609, 760, 'Street address', 'Kepler Street 14')}
  ${FLD(93, 691, 214, 'City', 'Rotterdam')}
  ${FLD(337, 691, 214, 'Postal code', '3011 AA')}
  ${FLD(581, 691, 272, 'Country', 'Netherlands')}

  <div style="${at(93, 783, 760, 64, `background:${C.tintSoft};border-radius:12px`)}"></div>
  <div style="${at(113, 815, 11, 11, `background:${C.accent};border-radius:6px`)}"></div>
  ${T(135, 793, 'font:500 14px/18px Inter;color:#3C1D22', 'Standard delivery')}
  ${T(135, 811, 'font:400 12px/16px Inter;color:#7C6065', 'Arrives Dec 1–3')}
  ${T(1264, 810, 'font:500 14px/16px Inter;color:#2F7A52', 'Free', 'width:72px;text-align:right')}

  ${T(93, 870, 'font:600 21px/27px Inter;color:' + C.ink, '3. Payment')}
  <div style="${at(93, 905, 260, 56, `background:${C.tintSoft};border-radius:28px`)}"></div>
  ${T(139, 927, '', `<span style="display:inline-block;width:12px;height:12px;border-radius:6px;background:${C.accent}"></span>`)}
  ${T(160, 926, 'font:500 14px/16px Inter;color:' + C.accentInk, 'Credit or debit card')}
  <div style="${at(367, 905, 168, 56, `background:#F3F1F2;border-radius:28px`)}"></div>
  ${T(391, 927, '', `<span style="display:inline-block;width:12px;height:12px;border-radius:6px;border:1.6px solid #6E7178"></span>`)}
  ${T(412, 926, 'font:500 14px/16px Inter;color:' + C.ink, 'VOLTA wallet')}
  ${FLD(93, 968, 408, 'Card number', '•••• •••• •••• 4242')}
  ${FLD(501, 968, 200, 'Expiry date', '08 / 29')}
  ${FLD(739, 968, 116, 'Security code', '•••')}

  <div style="${at(920, 290, 456, 555, `background:${C.white};border-radius:22px`)}"></div>
  ${T(948, 318, 'font:600 24px/31px Inter;color:' + C.ink, 'Your order')}
  <img src="${img('bagthumb.jpg')}" alt="Aurora Buds Pro" style="${at(948, 370, 88, 86, 'border-radius:12px;object-fit:cover')}">
  ${T(1055, 378, 'font:600 15px/19px Inter;color:' + C.ink, 'Aurora Buds Pro')}
  ${T(1055, 408, 'font:400 13px/17px Inter;color:#7A7E88', 'Silver · Qty 1')}
  ${T(1055, 432, 'font:600 15px/18px Inter;color:' + C.ink, '$189.00')}
  <div style="${at(949, 500, 399, 1, `background:${C.hair}`)}"></div>
  ${T(949, 500, 'font:400 13px/16px Inter;color:#4E5159', 'Promo code')}
  <div style="${at(949, 526, 281, 50, `background:${C.white};border:1px solid ${C.border};border-radius:10px`)}"></div>
  ${T(963, 542, 'font:400 14px/16px Inter;color:#3C3F48', 'Enter code')}
  <div style="${at(1252, 526, 96, 50, `background:#F1EFF0;border-radius:25px`)}"></div>
  ${T(1252, 542, 'font:500 14px/16px Inter;color:' + C.ink, 'Apply', 'width:96px;text-align:center')}
  ${T(949, 601, 'font:400 14px/17px Inter;color:' + C.body, 'Subtotal')}
  ${T(1230, 601, 'font:400 14px/17px Inter;color:' + C.ink, '$189.00', 'width:97px;text-align:right')}
  ${T(949, 637, 'font:400 14px/17px Inter;color:' + C.body, 'Shipping')}
  ${T(1281, 637, 'font:400 14px/17px Inter;color:#2F7A52', 'Free', 'width:46px;text-align:right')}
  <div style="${at(949, 673, 399, 1, `background:${C.hair}`)}"></div>
  ${T(949, 690, 'font:600 21px/26px Inter;color:' + C.ink, 'Total')}
  ${T(1199, 688, 'font:600 30px/34px Inter;color:' + C.ink, '$189.00', 'width:150px;text-align:right')}
  ${T(949, 734, 'font:400 12.5px/15px Inter;color:' + C.body, 'Tax included')}
  <div style="${at(948, 769, 400, 48, `background:${C.accent};border-radius:24px`)}"></div>
  ${T(948, 785, 'font:600 15px/16px Inter;color:#fff', 'Pay $189.00 securely', 'width:400px;text-align:center')}
  ${T(950, 866, 'font:400 13.5px/20px Inter;color:' + C.body, 'By placing your order, you agree to our Terms<br>and acknowledge our Privacy Policy.')}

  <div style="${at(920, 935, 456, 119, `background:${C.tintRow};border-radius:20px`)}"></div>
  ${T(945, 958, 'font:600 17px/21px Inter;color:' + C.accentInk, 'Your details stay protected')}
  ${T(945, 990, 'font:400 13px/19px Inter;color:#6B5B5E', 'Encrypted payments. No hidden fees.<br>Need help? support@volta.example')}
  ${footer()}
</section>`;

/* ══ 05 · Order confirmed ═══════════════════════════════════════════════ */
const TRACK = [['01', 'Confirmed', true], ['02', 'Preparing'], ['03', 'Shipped'], ['04', 'Delivered']];

const confirmed = () => `
<section class="frame">
  ${chrome({ bag: 0 })}

  <div style="${at(M, 154, 1312, 268, `background:${C.tintSoft};border-radius:28px`)}"></div>
  <div style="${at(88, 190, 44, 44, `background:${C.green};border-radius:22px`)}"></div>
  ${T(88, 203, '', `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#1B6B4A" stroke-width="2.8" stroke-linecap="round" stroke-linejoin="round"><path d="M4.5 12.5 9.5 17.5 19.5 6.5"/></svg>`, 'width:44px;height:20px;display:flex;align-items:center;justify-content:center')}
  ${T(171, 190, 'font:500 12px/15px Inter;letter-spacing:.3px;color:' + C.accentInk, 'ORDER VX-88217 · NOV 26, 2026')}
  ${T(171, 217, 'font:600 36px/44px Inter;color:#1A1417', 'Thanks, Alex. You’re all set.')}
  ${T(171, 275, 'font:400 14px/22px Inter;color:#5E4E52', 'Your payment of $189.00 was successful. A receipt is on its way to<br>alex.morgan@example.com')}
  <div style="${at(170, 349, 201, 48, `background:${C.accent};border-radius:25px`)}"></div>
  ${T(170, 365, 'font:600 14px/16px Inter;color:#fff', 'View order details', 'width:201px;text-align:center')}
  <div style="${at(387, 349, 190, 48, `background:${C.white};border-radius:25px`)}"></div>
  ${T(387, 365, 'font:600 14px/16px Inter;color:' + C.ink, 'Continue shopping', 'width:190px;text-align:center')}

  ${T(1068, 225, 'font:400 13px/16px Inter;color:#7C6065', 'Estimated delivery')}
  ${T(1068, 246, 'font:600 34px/40px Inter;color:' + C.accentInk, 'Dec 1–3')}
  ${T(1068, 303, 'font:400 13px/16px Inter;color:#7C6065', 'Free standard shipping')}

  <div style="${at(M, 446, 824, 226, `background:${C.white};border-radius:22px`)}"></div>
  ${T(92, 471, 'font:600 23px/28px Inter;color:' + C.ink, 'Your order is getting ready')}
  ${T(93, 512, 'font:400 13.5px/17px Inter;color:' + C.body, 'We’ll email you tracking details as soon as it ships.')}
  <div style="${at(120, 577, 712, 1, `background:#E8E8E8`)}"></div>
  ${TRACK.map(([n, l, done], i) => {
    const x = 92 + i * 199;
    return `
    <div style="${at(x, 562, 31, 31, `background:${done ? C.accent : '#EFEFEF'};border-radius:16px`)}"></div>
    ${done
      ? T(x, 570, '', `<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12.5 10 17.5 19 7"/></svg>`, 'width:31px;height:13px;display:flex;align-items:center;justify-content:center')
      : T(x, 570, 'font:500 12px/16px Inter;color:#7A7E88', n, 'width:31px;text-align:center')}
    ${T(x + 19, 615, done ? 'font:600 13px/16px Inter;color:' + C.accent : 'font:400 13px/16px Inter;color:#4E5159', l)}`;
  }).join('')}

  <div style="${at(M, 696, 824, 213, `background:${C.white};border-radius:22px`)}"></div>
  ${T(92, 722, 'font:600 17px/21px Inter;color:' + C.ink, 'Delivering to')}
  ${T(93, 764, 'font:500 13.5px/17px Inter;color:' + C.ink, 'Alex Morgan')}
  ${T(93, 794, 'font:400 13px/19px Inter;color:' + C.body, 'Kepler Street 14<br>3011 AA Rotterdam<br>Netherlands')}
  <div style="${at(472, 726, 1, 152, `background:${C.hair}`)}"></div>
  ${T(504, 722, 'font:600 17px/21px Inter;color:' + C.ink, 'Payment details')}
  ${T(505, 764, 'font:500 13.5px/17px Inter;color:' + C.ink, 'Visa ending in 4242')}
  ${T(505, 794, 'font:400 13px/19px Inter;color:' + C.body, '$189.00 paid · Tax included')}
  ${T(505, 850, 'font:600 13px/16px Inter;color:' + C.accent, 'Download receipt <span class="arw">→</span>')}

  <div style="${at(920, 446, 456, 463, `background:${C.white};border-radius:22px`)}"></div>
  ${T(948, 473, 'font:600 23px/28px Inter;color:' + C.ink, 'What’s coming your way')}
  <img src="${img('bagthumb.jpg')}" alt="Aurora Buds Pro" style="${at(950, 515, 98, 98, 'border-radius:12px;object-fit:cover')}">
  ${T(1055, 542, 'font:600 15px/19px Inter;color:' + C.ink, 'Aurora Buds Pro')}
  ${T(1055, 574, 'font:400 13px/16px Inter;color:#7A7E88', 'Silver · Qty 1')}
  ${T(1055, 598, 'font:600 14px/17px Inter;color:' + C.ink, '$189.00')}
  <div style="${at(948, 645, 400, 1, `background:${C.hair}`)}"></div>
  ${T(948, 690, 'font:400 14px/17px Inter;color:' + C.body, 'Subtotal')}
  ${T(1230, 690, 'font:400 14px/17px Inter;color:' + C.ink, '$189.00', 'width:118px;text-align:right')}
  ${T(948, 729, 'font:400 14px/17px Inter;color:' + C.body, 'Shipping')}
  ${T(1276, 729, 'font:400 14px/17px Inter;color:#2F7A52', 'Free', 'width:72px;text-align:right')}
  <div style="${at(948, 764, 400, 1, `background:${C.hair}`)}"></div>
  ${T(948, 787, 'font:600 20px/24px Inter;color:' + C.ink, 'Total paid')}
  ${T(1204, 784, 'font:600 28px/32px Inter;color:' + C.ink, '$189.00', 'width:144px;text-align:right')}
  ${T(948, 851, 'font:400 12.5px/16px Inter;color:' + C.body, '30-day returns from the day it arrives.')}

  <div style="${at(M, 941, 1312, 108, `background:${C.tintRow};border-radius:22px`)}"></div>
  ${T(93, 964, 'font:600 19px/24px Inter;color:' + C.accentInk, 'Good support comes with every order.')}
  ${T(93, 998, 'font:400 13.5px/17px Inter;color:#6B5B5E', 'Questions about delivery or returns? I’m here to help.')}
  <div style="${at(1125, 967, 224, 44, `background:${C.white};border-radius:22px`)}"></div>
  ${T(1125, 981, 'font:600 13.5px/16px Inter;color:' + C.ink, 'Visit help center <span class="arw">→</span>', 'width:224px;text-align:center')}
  ${footer()}
</section>`;

/* ── document ──────────────────────────────────────────────────────────── */
const CSS = `
*{box-sizing:border-box;margin:0;padding:0}
html{-webkit-text-size-adjust:100%}
body{background:#1E1E1E;font-family:Inter,system-ui,-apple-system,"Segoe UI",Roboto,sans-serif;
  -webkit-font-smoothing:antialiased;-moz-osx-font-smoothing:grayscale;color:${C.ink};padding:64px 0 120px}
.canvas{width:${PW}px;margin:0 auto;transform-origin:top left}
.slot{width:${PW}px;margin:0 auto 88px}
.slot:last-child{margin-bottom:0}
.label{font:400 11px/1 Inter;color:#868686;letter-spacing:.04em;margin:0 0 12px 2px}
.frame{position:relative;width:${PW}px;height:${PH}px;background:${C.field};overflow:hidden}
.arw{font-family:Inter,sans-serif;font-size:.92em}
.slot:target .frame{outline:2px solid #C92332;outline-offset:6px}
@media (prefers-reduced-motion:no-preference){html{scroll-behavior:smooth}}
`;

const FRAMES = [
  ['01 · Shop · Red', shop()],
  ['02 · Product details · Red', product()],
  ['03 · Shopping bag · Red', bag()],
  ['04 · Checkout · Red', checkout()],
  ['05 · Order confirmed · Red', confirmed()],
];

const SCRIPT = `<script>
(function () {
  var W = ${PW};
  function fit() {
    var c = document.querySelector('.canvas');
    if (!c) return;
    var avail = document.documentElement.clientWidth - 96;
    var s = Math.min(1, avail / W);
    c.style.transform = s < 1 ? 'scale(' + s + ')' : 'none';
    c.style.height = s < 1 ? (c.scrollHeight * s + 8) + 'px' : 'auto';
  }
  window.addEventListener('resize', fit);
  document.addEventListener('DOMContentLoaded', fit);
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(fit);
  fit();
}());
</script>`;

const html = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>VOLTA — Red screens · 1:1 from Figma</title>
<style>
${font(400, 'inter-latin-400-normal.woff2')}
${font(500, 'inter-latin-500-normal.woff2')}
${font(600, 'inter-latin-600-normal.woff2')}
${font(700, 'inter-latin-700-normal.woff2')}
${CSS}
</style>
</head>
<body>
<div class="canvas">
${FRAMES.map(([n, m], i) => `<div class="slot" id="f${i + 1}"><p class="label">${n}</p>${m}</div>`).join('\n')}
</div>
${SCRIPT}
</body>
</html>`;

fs.writeFileSync(path.join(ROOT, 'index.html'), html);
console.log(`index.html — ${(fs.statSync(path.join(ROOT, 'index.html')).size / 1024).toFixed(0)} KB, ${FRAMES.length} frames`);
