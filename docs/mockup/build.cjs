#!/usr/bin/env node
/**
 * Builds docs/mockup/index.html — an interactive mockup of the VOLTA store.
 *
 * One screen at a time, real navigation between them, cart/quantity/filter/
 * search state that actually works. The store screens come from the RED frame
 * set in the Figma file (zoygvtfjWN92VUiWAsSMOL — 8:2, 8:92, 8:161, 8:240,
 * 8:342), reproduced from measurements of a 1:1 render: same palette, same
 * type scale, same 64/1312 grid, same 824+32+456 split. The landing page and
 * edge-bleeding hero are a deliberate divergence. See NOTES-red.md.
 *
 * Screens in the file:  Home (landing), Shop, Product, Bag, Checkout, Confirmed.
 * Screens added to make it navigable (same system, no new visual language):
 *  Account (My orders), Order detail, Help, and the search/filter empty state.
 *
 * Output is one self-contained HTML file: Inter inlined as base64 woff2, the
 * product photography inlined as base64 WebP/JPEG. No build step, no network.
 */

const fs = require('fs');
const path = require('path');

const ROOT = __dirname;
const IMG = path.join(ROOT, 'red', 'img');
const ASSETS = path.join(ROOT, 'assets');
const FONTS = path.join(ROOT, '.fonts');

const b64 = (p, mime) => `data:${mime};base64,${fs.readFileSync(p).toString('base64')}`;
const MIME = { '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.png': 'image/png', '.webp': 'image/webp' };
const img = (n) => {
  const ext = path.extname(n).toLowerCase();
  const dir = ext === '.jpg' || ext === '.jpeg' ? IMG : ASSETS;
  return b64(path.join(dir, n), MIME[ext] || 'application/octet-stream');
};
const font = (w, f) => {
  const p = path.join(FONTS, f);
  return fs.existsSync(p)
    ? `@font-face{font-family:Inter;font-style:normal;font-weight:${w};font-display:block;src:url(${b64(p, 'font/woff2')}) format('woff2')}`
    : '';
};

/* ── catalogue ─────────────────────────────────────────────────────────── */
const PRODUCTS = [
  {
    id: 'iphone-16-pro', name: 'iPhone 16 Pro', short: 'iPhone 16 Pro',
    kind: 'Titanium flagship', cat: 'Pro', price: 1099,
    rate: '4.9', reviews: 128, tag: 'Latest generation',
    plate: 'iphone-16-pro-front.webp', hero: 'iphone-16-pro-front.webp',
    tile: 'iphone-16-pro-front.webp', thumb: 'iphone-16-pro-front.webp',
    gallery: 'iphone-16-pro-front.webp',
    blurb: 'The newest era, in titanium.',
    body: 'A bright edge-to-edge display, a precise titanium frame and the most considered Pro camera system yet. The newest iPhone, without the noise around it.',
    hook: 'Every generation,<br>considered.', note: 'A18 Pro · Pro camera · Titanium',
    meta: 'A18 Pro · Titanium',
    colors: ['Natural Titanium', 'Black Titanium'],
    foot: 'A closer look at the newest iPhone.',
    secHead: 'Made for the newest everyday',
    bens: [
      ['01', 'Titanium, quietly lighter', 'A strong, brushed frame that feels balanced in the hand without asking for attention.'],
      ['02', 'A display with more room', 'Slim borders, outdoor brightness and true-to-life colour for everything from messages to film.'],
      ['03', 'A Pro camera, simplified', 'A 48MP main camera and 5× telephoto make the shot you wanted feel effortless.'],
    ],
    revs: [
      ['Maya R.', '5', 'The titanium finish is beautiful in person, and the screen is superb outdoors.'],
      ['Tomas K.', '5', 'Camera upgrades are obvious without making the phone feel complicated.'],
      ['Priya S.', '4', 'A clean, fast upgrade. I would like a slightly lighter case, but the phone is excellent.'],
    ],
    specs: [
      ['Category', 'Pro · Titanium flagship'],
      ['Display', '6.3-inch Super Retina XDR'],
      ['Chip', 'A18 Pro'],
      ['Camera', '48MP Fusion · 5× telephoto'],
      ['Finish', 'Natural Titanium or Black Titanium'],
      ['Warranty', '2 years, VOLTA direct'],
    ],
  },
  {
    id: 'iphone-15', name: 'iPhone 15', short: 'iPhone 15',
    kind: 'Everyday standard', cat: 'Standard', price: 799,
    rate: '4.8', reviews: 96, tag: 'Clean blue finish',
    plate: 'iphone-15-blue-back.webp', hero: 'iphone-15-blue-back.webp',
    tile: 'iphone-15-blue-back.webp', thumb: 'iphone-15-blue-back.webp',
    gallery: 'iphone-15-blue-back.webp',
    blurb: 'The everyday iPhone, refined.',
    body: 'Dynamic Island, a soft blue glass back and USB-C make this the calm centre of the collection. Familiar in the best way, with the details quietly updated.',
    hook: 'Blue glass.<br>Everyday ease.', note: 'Dynamic Island · USB-C · 48MP main',
    meta: 'A16 Bionic · USB-C',
    colors: ['Blue', 'Black'],
    foot: 'A closer look at the blue finish.',
    secHead: 'Made for the everyday',
    bens: [
      ['01', 'Familiar, then better', 'Dynamic Island turns the everyday alerts and timers into something you barely have to think about.'],
      ['02', 'One cable, everywhere', 'USB-C charges the phone, the bag and the desk without a drawer of adapters.'],
      ['03', 'A finish with softness', 'Colour-infused blue glass keeps reflections gentle and fingerprints quiet.'],
    ],
    revs: [
      ['Maya R.', '5', 'The blue is subtle and the move to USB-C has made travel much simpler.'],
      ['Tomas K.', '5', 'Exactly the everyday phone I wanted: quick, clean and uncomplicated.'],
      ['Priya S.', '4', 'Lovely finish and reliable battery. The camera is a real step up from my old phone.'],
    ],
    specs: [
      ['Category', 'Standard · Everyday iPhone'],
      ['Display', '6.1-inch Super Retina XDR'],
      ['Chip', 'A16 Bionic'],
      ['Camera', '48MP main · 2× telephoto'],
      ['Finish', 'Blue or Black aluminium'],
      ['Warranty', '2 years, VOLTA direct'],
    ],
  },
  {
    id: 'iphone-14-pro', name: 'iPhone 14 Pro', short: 'iPhone 14 Pro',
    kind: 'Pro classic', cat: 'Pro', price: 899,
    rate: '4.8', reviews: 182, tag: 'Pro camera',
    plate: 'iphone-14-pro-purple.webp', hero: 'iphone-14-pro-purple.webp',
    tile: 'iphone-14-pro-purple.webp', thumb: 'iphone-14-pro-purple.webp',
    gallery: 'iphone-14-pro-purple.webp',
    blurb: 'A Pro chapter worth keeping.',
    body: 'Deep Purple glass, the first 48MP main camera and an Always-On display. A generation that still reads as unmistakably Pro, presented exactly as it is.',
    hook: 'Deep Purple.<br>Still Pro.', note: '48MP main · Always-On display',
    meta: 'A16 Bionic · 48MP main',
    colors: ['Deep Purple', 'Graphite'],
    foot: 'A closer look at the Deep Purple finish.',
    secHead: 'Made for the considered upgrade',
    bens: [
      ['01', 'The 48MP turning point', 'Detail-rich photos with a flexible 2× crop that keeps the frame natural.'],
      ['02', 'Information at a glance', 'An Always-On display keeps time, widgets and notifications quietly visible.'],
      ['03', 'Deep Purple, properly deep', 'A matte glass finish that shifts from graphite to plum with the light.'],
    ],
    revs: [
      ['Maya R.', '5', 'Deep Purple still looks special, and the 48MP camera remains excellent.'],
      ['Tomas K.', '5', 'Always-On display is more useful than I expected. Battery has stayed strong.'],
      ['Priya S.', '4', 'A lovely Pro phone. I prefer this size to the newer models.'],
    ],
    specs: [
      ['Category', 'Pro · Pro classic'],
      ['Display', '6.1-inch Super Retina XDR, Always-On'],
      ['Chip', 'A16 Bionic'],
      ['Camera', '48MP main · 3× telephoto'],
      ['Finish', 'Deep Purple or Graphite'],
      ['Warranty', '2 years, VOLTA direct'],
    ],
  },
  {
    id: 'iphone-13', name: 'iPhone 13', short: 'iPhone 13',
    kind: 'Earlier generation', cat: 'Classic', price: 599,
    rate: '4.9', reviews: 120, tag: 'Best value',
    plate: 'iphone-13-midnight.webp', hero: 'iphone-13-midnight.webp',
    tile: 'iphone-13-midnight.webp', thumb: 'iphone-13-midnight.webp',
    gallery: 'iphone-13-midnight.webp',
    blurb: 'Still the one that just works.',
    body: 'Midnight graphite, the diagonal dual-camera layout and a dependable all-day battery. A clean earlier generation for the person who wants the iPhone, simply.',
    hook: 'The essential<br>iPhone.', note: 'Dual camera · All-day battery',
    meta: 'A15 Bionic · Dual camera',
    colors: ['Midnight', 'Starlight'],
    foot: 'A closer look at the Midnight finish.',
    secHead: 'Made for the simple choice',
    bens: [
      ['01', 'Nothing extra', 'The core iPhone experience, with no spec-sheet detours and no learning curve.'],
      ['02', 'A camera you trust', 'Two diagonal lenses and clean computational photography make everyday shots easy.'],
      ['03', 'A darker classic', 'Midnight graphite keeps the design crisp, understated and easy to live with.'],
    ],
    revs: [
      ['Maya R.', '5', 'Bought this as a simpler option and it still does everything I need beautifully.'],
      ['Tomas K.', '5', 'Battery is dependable and the Midnight finish hides daily wear very well.'],
      ['Priya S.', '4', 'Excellent value. Not the newest camera, but photos are consistently good.'],
    ],
    specs: [
      ['Category', 'Classic · Earlier generation'],
      ['Display', '6.1-inch Super Retina XDR'],
      ['Chip', 'A15 Bionic'],
      ['Camera', '12MP dual camera'],
      ['Finish', 'Midnight or Starlight aluminium'],
      ['Warranty', '2 years, VOLTA direct'],
    ],
  },
];


const byId = Object.fromEntries(PRODUCTS.map((p) => [p.id, p]));
const money = (n) => `$${n.toFixed(2)}`;

/* ── shared chrome (measured from the frames) ──────────────────────────── */
const NAV = [
  ['Shop', 'shop', 'store'],
  ['Pro', 'shop', 'pro'],
  ['Standard', 'shop', 'standard'],
  ['Classic', 'shop', 'classic'],
];

const chrome = () => `
<div class="band">
  <span>Good tech. Better everyday.</span>
  <span>Free shipping on orders $100+</span>
</div>
<header class="hdr">
  <a class="mark" data-go="home">VOLTA</a>
  <span class="hdr-tools">
    <button class="hdr-ico" data-go="account" aria-label="My orders">
      <svg width="21" height="21" viewBox="0 0 24 24" fill="none" stroke="#14171E" stroke-width="1.7" stroke-linecap="round"><circle cx="12" cy="8.2" r="3.6"/><path d="M5 20c.7-3.7 3.6-5.6 7-5.6s6.3 1.9 7 5.6"/></svg>
    </button>
    <button class="hdr-ico" data-go="bag" aria-label="Shopping bag">
      <svg width="21" height="21" viewBox="0 0 24 24" fill="none" stroke="#14171E" stroke-width="1.7" stroke-linecap="round"><path d="M6 8.5h12l-1 12H7z"/><path d="M9 8.5V7a3 3 0 0 1 6 0v1.5"/></svg>
      <b class="hdr-n" data-bagcount>0</b>
    </button>
  </span>
  <div class="hdr-row">
    <nav class="nav">
      ${NAV.map(([label, route, arg]) => `<a class="nav-i" data-nav="${label}" data-go="${route}" data-arg="${arg}">${label}</a>`).join('')}
    </nav>
    <div class="hdr-right">
      <form class="search" data-search>
        <svg class="sicon" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#8A8E99" stroke-width="2"><circle cx="11" cy="11" r="7"/><path d="m16.5 16.5 4 4"/></svg>
        <input type="search" placeholder="Search iPhones…" aria-label="Search iPhones">
      </form>
      <a class="orders" data-go="account">My orders</a>
      <a class="bag-pill" data-go="bag"><span data-bagcount>Bag (0)</span></a>
    </div>
  </div>
</header>`;

const footer = () => `
<footer class="ftr">
  <div class="ftr-in">
    <div class="ftr-left">
      <span class="ftr-mark">VOLTA</span>
      <span class="ftr-tag">Thoughtful tech for everyday life.</span>
    </div>
    <div class="ftr-right">
      <a class="ftr-l" data-go="help">Help center</a>
      <a class="ftr-l" data-go="help">Shipping &amp; returns</a>
      <a class="ftr-l" data-go="help">Privacy</a>
      <a class="ftr-l" data-go="help">Terms</a>
      <span class="ftr-copy">© 2026 VOLTA</span>
    </div>
  </div>
</footer>`;

/* product plate art for the items with no photograph (the three accessories).
   Drawn at a 200x170 ratio so it sits calmly inside the 304x180 plate. */
const art = (kind) => {
  const g = '#C6C9D0', f = '#E9EAED';
  const box = 'viewBox="0 0 200 170" fill="none" stroke-linecap="round" stroke-linejoin="round"';
  if (kind === 'lamp')
    return `<svg class="art" ${box}><path d="M62 138h76" stroke="${g}" stroke-width="2.6"/><path d="M100 138V74" stroke="${g}" stroke-width="2.6"/><path d="M100 74c0-16 9-26 24-26" stroke="${g}" stroke-width="2.6"/><path d="M124 48h30" stroke="${g}" stroke-width="2.6"/><path d="M154 48l-9 17h-21l-9-17" fill="${f}" stroke="${g}" stroke-width="2.6"/><ellipse cx="100" cy="140" rx="22" ry="5" fill="${f}"/></svg>`;
  if (kind === 'buds')
    return `<svg class="art" ${box}><rect x="68" y="62" width="64" height="46" rx="16" fill="${f}" stroke="${g}" stroke-width="2.6"/><path d="M68 82h64" stroke="${g}" stroke-width="2.6"/><circle cx="86" cy="47" r="11" fill="#fff" stroke="${g}" stroke-width="2.6"/><circle cx="114" cy="47" r="11" fill="#fff" stroke="${g}" stroke-width="2.6"/><path d="M82 47v10" stroke="${g}" stroke-width="2.6"/><path d="M118 47v10" stroke="${g}" stroke-width="2.6"/></svg>`;
  if (kind === 'stand')
    return `<svg class="art" ${box}><path d="M52 124h96l-14-30H66z" fill="${f}" stroke="${g}" stroke-width="2.6"/><path d="M80 94l10-48h24l10 48" fill="#fff" stroke="${g}" stroke-width="2.6"/><path d="M92 70h30" stroke="${g}" stroke-width="2.6"/><path d="M78 132h44" stroke="${g}" stroke-width="2.6"/></svg>`;
  return `<svg class="art" ${box}><rect x="64" y="56" width="46" height="62" rx="14" fill="${f}" stroke="${g}" stroke-width="2.6"/><circle cx="87" cy="86" r="8" stroke="${g}" stroke-width="2.6"/><path d="M110 66c26 4 38 20 38 42" stroke="${g}" stroke-width="2.6" stroke-dasharray="5 6"/><path d="M140 122a10 10 0 1 0-14-14" stroke="${g}" stroke-width="2.6"/></svg>`;
};

const plate = (p, cls = '') =>
  p.plate
    ? `<img class="${cls}" src="${img(p.plate)}" alt="${p.name}">`
    : `<div class="plate-art ${cls}">${art(p.art)}</div>`;

/* ══ screens ═════════════════════════════════════════════════════════════ */

/* The hero artwork is a transparent cut-out living on the panel itself. No
   image plate, no radius, no second background: it overhangs the clipped edge. */
const heroBand = (variant) => {
  const isHome = variant === 'home';
  const from = money(Math.min.apply(null, PRODUCTS.map((p) => p.price)));
  return `
<section class="hero${isHome ? ' hero-home' : ''}">
  <div class="hero-l">
    <p class="eyebrow">ONE ICON. EVERY GENERATION.</p>
    <h1 class="hero-h">Only iPhone.<br>Every era.</h1>
    <p class="hero-p">Four generations, one clean edit. Find the one that fits your everyday.</p>
    <a class="btn-dark" data-go="shop">${isHome ? 'Enter the shop' : 'Shop the collection'} <span class="arw">→</span></a>
  </div>
  <div class="hero-m">
    <p class="eyebrow">THE COLLECTION</p>
    <h2 class="hero-mh">Every generation,<br>considered.</h2>
    <p class="hero-price">From ${from}</p>
    <p class="hero-note">Curated iPhones · Nothing else</p>
  </div>
  <a class="hero-art" data-go="shop" aria-label="Shop the iPhone collection">
    <img class="hero-phone hero-phone-back" src="${img('iphone-15-blue-back.webp')}" alt="">
    <img class="hero-phone hero-phone-front" src="${img('iphone-16-pro-front.webp')}" alt="">
  </a>
</section>`;
};

/* Landing page — editorial, route-first, and deliberately footerless. */
const home = () => `
<main class="home">
  ${heroBand('home')}

  <section class="home-intro">
    <div>
      <p class="eyebrow">A SINGLE OBSESSION</p>
      <h2 class="home-intro-h">Good tech, distilled<br>to one icon.</h2>
      <p class="home-intro-p">VOLTA now does one thing: the iPhone. From the newest Pro to the generation that still feels just right, every device is presented without noise.</p>
    </div>
    <span class="home-intro-index">01 — 04</span>
  </section>

  <section class="home-moment home-moment-dark full">
    <div class="home-moment-art home-art-left">
      <img src="${img('iphone-16-pro-front.webp')}" alt="">
    </div>
    <div class="home-moment-copy home-copy-right">
      <p class="home-kicker">01 / THE DISPLAY</p>
      <h2 class="home-moment-h">A screen that<br>gets out of the way.</h2>
      <p class="home-moment-p">Edge-to-edge glass, true-to-life colour and the quiet confidence of a display that simply disappears into whatever you are doing.</p>
      <a class="home-link" data-go="shop">Explore the collection <span class="arw">→</span></a>
    </div>
  </section>

  <section class="home-moment home-moment-blush full">
    <div class="home-moment-copy">
      <p class="home-kicker">02 / THE FINISH</p>
      <h2 class="home-moment-h">Colour, material,<br>generation.</h2>
      <p class="home-moment-p">Titanium, aluminium, blue glass, deep purple and midnight graphite. Four distinct chapters of the same unmistakable design language.</p>
      <a class="home-link" data-go="shop">Find your finish <span class="arw">→</span></a>
    </div>
    <div class="home-moment-art home-art-right">
      <img src="${img('iphone-15-blue-back.webp')}" alt="">
    </div>
  </section>

  <section class="home-moment home-moment-pair full">
    <div class="home-moment-art home-art-pair">
      <img class="pair-back" src="${img('iphone-14-pro-purple.webp')}" alt="">
      <img class="pair-front" src="${img('iphone-13-midnight.webp')}" alt="">
    </div>
    <div class="home-moment-copy home-copy-right">
      <p class="home-kicker">03 / THE CHOICE</p>
      <h2 class="home-moment-h">One family.<br>Your era.</h2>
      <p class="home-moment-p">Choose the camera, finish and generation that match your everyday. No accessory aisles, no spec-sheet maze — just the phone.</p>
      <a class="home-link" data-go="shop">Compare the edit <span class="arw">→</span></a>
    </div>
  </section>

  <section class="home-values" aria-label="Why VOLTA">
    <article class="home-value"><span class="home-value-n">01</span><h3>Only iPhones</h3><p>Four generations, edited with intent.</p></article>
    <article class="home-value"><span class="home-value-n">02</span><h3>Clean presentation</h3><p>Every phone shown without the visual noise.</p></article>
    <article class="home-value"><span class="home-value-n">03</span><h3>Free over $100</h3><p>Standard delivery, always included.</p></article>
    <article class="home-value"><span class="home-value-n">04</span><h3>30-day returns</h3><p>Time to live with your choice.</p></article>
  </section>

  <section class="home-close">
    <div>
      <p class="eyebrow">READY WHEN YOU ARE</p>
      <h2>Find the iPhone<br>that feels like yours.</h2>
      <p>Four generations. One considered edit. The shop is just beyond this door.</p>
    </div>
    <a class="home-close-cta" data-go="shop">Enter the shop <span class="arw">→</span></a>
  </section>
</main>`;

/* Shop — hero, filters, grid, service strip  (frame 8:2) */
const shop = (state) => {
  const items = state.results;
  return `
<main class="page">
  ${state.query ? '' : heroBand('shop')}

  <h2 class="sec-h">Find your next iPhone</h2>
  <p class="sec-p">Four generations. One clean edit.</p>

  <div class="filter-row">
    <div class="chips">
      ${['all', 'Pro', 'Standard', 'Classic'].map((c) => {
        const on = c === 'all' ? state.cat === 'all' : state.cat.toLowerCase() === c.toLowerCase();
        return `<button class="chip${on ? ' is-on' : ''}" data-filter="${c}">${c === 'all' ? 'All iPhones' : c}</button>`;
      }).join('')}
    </div>
    <span class="count">${items.length} iPhone${items.length === 1 ? '' : 's'}</span>
    <div class="sortwrap">
      <button class="sort" data-sort>Sort: ${state.sortLabel} <svg width="10" height="6" viewBox="0 0 10 6" fill="none" stroke="#14171E" stroke-width="1.5"><path d="m1 1 4 4 4-4"/></svg></button>
      <div class="sortmenu" data-sortmenu hidden>
        ${[['featured', 'Featured'], ['low', 'Price: low to high'], ['high', 'Price: high to low'], ['rating', 'Top rated']]
          .map(([k, l]) => `<button data-sortby="${k}" class="${state.sort === k ? 'is-on' : ''}">${l}</button>`).join('')}
      </div>
    </div>
  </div>

  ${state.query ? `<p class="result-note">Results for <b>“${state.query}”</b> · <a data-clear>clear</a></p>` : ''}

  ${items.length ? `<div class="cards">${items.map(card).join('')}</div>`
    : `<div class="empty">
        <p class="empty-h">Nothing matched that.</p>
        <p class="empty-p">Try a generation, or browse all four iPhones.</p>
        <button class="btn-dark sm" data-clear>Show all products</button>
      </div>`}

  <div class="service-strip">
    <span>Free shipping over $100</span>
    <span>30-day easy returns</span>
    <span>Secure checkout, always</span>
  </div>
</main>`;
};

const heartSvg = (s = 15) =>
  `<svg width="${s}" height="${s}" viewBox="0 0 24 24" fill="none" stroke="#14171E" stroke-width="1.8"><path d="M12 20s-7.4-4.6-7.4-9.9A4.4 4.4 0 0 1 12 7.2a4.4 4.4 0 0 1 7.4 2.9c0 5.3-7.4 9.9-7.4 9.9Z"/></svg>`;

const card = (p) => `
<article class="card">
  <a class="card-plate" data-go="product" data-arg="${p.id}">
    ${p.plate
      ? `<span class="plate-bg${p.crop ? ' is-crop' : ''}"><img class="card-img" src="${img(p.plate)}" alt="${p.name}"></span>`
      : plate(p, 'card-img')}
    ${p.crop ? '' : `<span class="badge">${p.tag}</span>`}
    <button class="heart${p.crop ? ' on-crop' : ''}" data-fav="${p.id}" aria-label="Save ${p.name}">
      <span class="heart-ico" data-fav-ico="${p.id}">${heartSvg()}</span>
    </button>
  </a>
  <h3 class="card-name"><a data-go="product" data-arg="${p.id}">${p.short}</a></h3>
  <p class="card-kind">${p.kind}</p>
  <p class="card-rate"><span class="star">★</span> ${p.rate} · ${p.reviews} reviews</p>
  <div class="card-foot">
    <span class="card-price">${money(p.price)}</span>
    <a class="card-link" data-go="product" data-arg="${p.id}">View product <span class="arw">→</span></a>
  </div>
</article>`;

/* Product — gallery, buy box, benefits, tabs  (frame 8:92) */
const product = (state) => {
  const p = state.product;
  return `
<main class="page">
  <p class="crumb"><a data-go="shop">Shop</a><span>/</span><a data-go="shop" data-arg="${p.cat.toLowerCase()}">${p.cat}</a><span>/</span><span class="cur">${p.name}</span></p>

  <div class="pdp">
    <div class="gallery">
      <div class="gallery-plate">${p.gallery ? `<img src="${img(p.gallery)}" alt="${p.name}">` : art(p.art)}</div>
      <div class="gallery-foot">
        <span class="gallery-note">${p.foot || 'A closer look at your next iPhone.'}</span>
        <span class="gallery-tag">${state.color} finish</span>
      </div>
    </div>

    <div class="buy">
      <p class="buy-eyebrow">${p.cat.toUpperCase()} / ${p.kind.toUpperCase()}</p>
      <h1 class="buy-h">${p.name}</h1>
      <div class="rating-row"><span class="star">★</span><b>${p.rate}</b><span class="rating-c">${p.reviews} verified reviews</span></div>
      <p class="buy-price">${money(p.price)}</p>
      <p class="buy-tax">Tax included. Free standard shipping.</p>
      <h2 class="buy-h2">${p.blurb}</h2>
      <p class="buy-p">${p.body}</p>

      <p class="opt-label">Color: ${state.color}</p>
      <div class="swatches">
        ${p.colors.map((c) => `<button class="swatch${c === state.color ? ' is-on' : ''}" data-color="${c}">${c}${c === state.color ? ' · selected' : ''}</button>`).join('')}
      </div>

      <p class="opt-label qty-label">Quantity</p>
      <div class="qty-row">
        <div class="stepper">
          <button class="step" data-qty="-1" aria-label="Fewer">−</button>
          <span class="step-n">${state.qty}</span>
          <button class="step" data-qty="1" aria-label="More">+</button>
        </div>
        <button class="btn-red btn-add" data-add="${p.id}">Add to bag · ${money(p.price * state.qty)}</button>
      </div>
      <p class="buy-meta">In stock <span class="dot">·</span> Arrives Dec 1–3 <span class="dot">·</span> 30-day returns</p>
    </div>
  </div>

  <h2 class="sec-h">${p.secHead || 'Made for your everyday'}</h2>
  <div class="benefits">
    ${(p.bens || [
      ['01', 'Familiar from the first tap', 'The essentials are exactly where you expect them, with nothing extra in the way.'],
      ['02', 'A camera you trust', 'Clean, dependable photos in the light you actually have.'],
      ['03', 'Made to be kept', 'A considered finish and a battery that suits a full day, not a spec sheet.'],
    ]).map(([n, h, b]) => `<article class="benefit"><p class="b-n">${n}</p><h3 class="b-h">${h}</h3><p class="b-p">${b}</p></article>`).join('')}
  </div>

  <div class="tabs">
    <div class="tabs-l">
      <button class="tab is-on" data-tab="overview">Overview</button>
      <button class="tab" data-tab="specs">Specifications</button>
      <button class="tab" data-tab="reviews">Reviews (${p.reviews})</button>
    </div>
    <a class="tabs-help" data-go="help">Need a hand? Talk to our support team <span class="arw">→</span></a>
  </div>
  <div class="tabpanel">
    ${state.tab === 'specs'
      ? `<dl class="specs">
           ${(p.specs || [
             ['Category', `${p.cat} · ${p.kind}`],
             ['Finish', p.colors.join(', ')],
             ['In the box', 'Device, USB-C cable, quick start guide'],
             ['Warranty', '2 years, VOLTA direct'],
             [p.meta.split(' · ')[0], 'Included'],
           ]).map(([k, v]) => `<div><dt>${k}</dt><dd>${v}</dd></div>`).join('')}
         </dl>`
      : state.tab === 'reviews'
      ? `<div class="reviews">
           <div class="rev-score"><p class="rev-big">${p.rate}</p><p class="rev-sub">${p.reviews} verified reviews</p></div>
           <div class="rev-list">
             ${(p.revs || [['Maya R.', '5', 'Exactly the iPhone I wanted. Clean, quick and easy to live with.'],
                ['Tomas K.', '5', 'The finish looks even better in person and the battery gets through a full day.'],
                ['Priya S.', '4', 'Lovely build. I would like a slightly smaller case, but no real complaints.']])
               .map(([n, s, t]) => `<div class="rev"><p class="rev-head"><b>${n}</b><span class="star">${'★'.repeat(+s)}</span></p><p class="rev-body">${t}</p></div>`).join('')}
           </div>
         </div>`
      : `<p class="tab-p">${p.body} Every VOLTA product ships with free returns for 30 days, so you can live with it before you commit.</p>`}
  </div>
</main>`;
};

/* Bag  (frame 8:161) */
const bag = (state) => {
  const lines = state.cart;
  const count = lines.reduce((n, l) => n + l.qty, 0);
  const subtotal = lines.reduce((n, l) => n + byId(l.id).price * l.qty, 0);
  const ship = subtotal >= 100 || subtotal === 0 ? 0 : 9;
  const total = subtotal + ship;

  const inBag = lines.map((l) => l.id);
  const also = PRODUCTS.filter((p) => !inBag.includes(p.id)).slice(0, 3);

  return `
<main class="page">
  <p class="crumb"><a data-go="shop">Shop</a><span>/</span><span class="cur">Shopping bag</span></p>

  <div class="bag-head">
    <div>
      <h1 class="page-h">Your bag</h1>
      <p class="page-p">${count === 0 ? 'Nothing here yet.' : `${count} item${count === 1 ? '' : 's'}, one great upgrade.`}</p>
    </div>
    <a class="continue" data-go="shop">Continue shopping <span class="arw">→</span></a>
  </div>

  ${count === 0
    ? `<div class="empty big">
         <p class="empty-h">Your bag is empty.</p>
         <p class="empty-p">Four iPhone generations are waiting — pick the era that feels like yours.</p>
         <button class="btn-dark sm" data-go="shop">Shop all iPhones <span class="arw">→</span></button>
       </div>`
    : `<div class="bag-grid">
    <div class="bag-main">
      ${lines.map((l) => {
        const p = byId(l.id);
        return `<div class="bag-card">
          <div class="bag-cols"><span>PRODUCT</span><span class="c-q">QUANTITY</span><span class="c-t">TOTAL</span></div>
          <div class="bag-row">
            <div class="bag-prod">
              <div class="bag-thumb">${p.thumb ? `<img src="${img(p.thumb)}" alt="${p.name}">` : art(p.art)}</div>
              <div class="bag-info">
                <h3 class="bag-name"><a data-go="product" data-arg="${p.id}">${p.name}</a></h3>
                ${l.qty > 1 ? `<p class="bag-inline-total">${money(p.price * l.qty)} total</p>` : ''}
                <p class="bag-meta">Color: ${l.color}</p>
                <p class="bag-meta">${money(p.price)} each</p>
                <p class="bag-stock">In stock</p>
                <button class="bag-save" data-save="${l.id}">Save for later</button>
              </div>
            </div>
            <div class="bag-qty">
              <div class="stepper sm">
                <button class="step" data-line-qty="${l.id}" data-d="-1">−</button>
                <span class="step-n">${l.qty}</span>
                <button class="step" data-line-qty="${l.id}" data-d="1">+</button>
              </div>
              <button class="bag-remove" data-remove="${l.id}">Remove</button>
            </div>
            <div class="bag-total">${money(p.price * l.qty)}</div>
          </div>
        </div>`;
      }).join('')}

      ${subtotal >= 100
        ? `<div class="ship-note">
             <p class="ship-h">You’ve unlocked free shipping</p>
             <p class="ship-p">Your next iPhone, delivered at no extra cost.</p>
           </div>`
        : `<div class="ship-note">
             <p class="ship-h">${money(100 - subtotal)} from free shipping</p>
             <p class="ship-p">Add a little more and standard delivery is on us.</p>
           </div>`}
    </div>

    <aside class="summary">
      <h2 class="sum-h">Order summary</h2>
      <div class="sum-line"><span>Subtotal (${count} item${count === 1 ? '' : 's'})</span><span>${money(subtotal)}</span></div>
      <div class="sum-line"><span>Standard shipping</span><span class="${ship === 0 ? 'green' : ''}">${ship === 0 ? 'Free' : money(ship)}</span></div>
      <div class="sum-rule"></div>
      <div class="sum-total"><span>Total</span><span>${money(total)}</span></div>
      <p class="sum-tax">Tax included. No surprises at checkout.</p>
      <button class="btn-red btn-checkout" data-go="checkout">Continue to checkout <span class="arw">→</span></button>
      <p class="sum-secure">Secure payment · Card or VOLTA wallet</p>
      <p class="sum-promo">Have a promo code? Add it at checkout.</p>
    </aside>
  </div>

  <h2 class="sec-h narrow">A little more to love</h2>
  <p class="sec-p">Three other generations to consider.</p>
  <div class="also">
    ${also.map((p) => `<article class="also-card">
      <a class="also-plate" data-go="product" data-arg="${p.id}">
        ${p.thumb ? `<img src="${img(p.thumb)}" alt="${p.name}">` : art(p.art)}
      </a>
      <div class="also-body">
        <h3 class="also-name"><a data-go="product" data-arg="${p.id}">${p.name}</a></h3>
        <p class="also-price">${money(p.price)}</p>
        <a class="also-link" data-go="product" data-arg="${p.id}">Explore product <span class="arw">→</span></a>
      </div>
    </article>`).join('')}
  </div>`}
</main>`;
};

/* Checkout  (frame 8:240) */
const fld = (label, name, value, opts = {}) => `
<label class="fld${opts.cls ? ' ' + opts.cls : ''}">
  <span class="fld-l">${label}</span>
  <input class="fld-i" name="${name}" value="${value}" ${opts.type ? `type="${opts.type}"` : ''} ${opts.inputmode ? `inputmode="${opts.inputmode}"` : ''} ${opts.maxlength ? `maxlength="${opts.maxlength}"` : ''} autocomplete="off">
</label>`;

const checkout = (state) => {
  const subtotal = state.cart.reduce((n, l) => n + byId(l.id).price * l.qty, 0);
  const ship = subtotal >= 100 ? 0 : 9;
  const total = subtotal + ship;
  const f = state.form;

  return `
<main class="page">
  <a class="back" data-go="bag">← Back to bag</a>

  <div class="co-head">
    <div>
      <h1 class="page-h">Checkout</h1>
      <p class="page-p">Guest checkout</p>
    </div>
    <p class="steps">Bag<span class="sep">/</span>Checkout<span class="sep">/</span><span class="steps-cur">Confirmation</span></p>
  </div>

  <form class="co-grid" data-checkout novalidate>
    <div class="co-main">
      <div class="co-card">
        <div class="co-row-h">
          <h2 class="co-h">1. Contact details</h2>
          <p class="co-signin">Already a member? <a class="link-red" data-go="account">Sign in</a></p>
        </div>
        ${fld('Email address', 'email', f.email, { type: 'email' })}
        <p class="co-help">Order updates and your receipt will be sent here.</p>
        <div class="co-rule"></div>

        <h2 class="co-h mt">2. Shipping address</h2>
        <div class="two">
          ${fld('First name', 'first', f.first)}
          ${fld('Last name', 'last', f.last)}
        </div>
        ${fld('Street address', 'street', f.street)}
        <div class="three">
          ${fld('City', 'city', f.city)}
          ${fld('Postal code', 'postal', f.postal)}
          ${fld('Country', 'country', f.country)}
        </div>

        <div class="deliv">
          <span class="deliv-dot"></span>
          <div class="deliv-body">
            <p class="deliv-h">Standard delivery</p>
            <p class="deliv-p">Arrives Dec 1–3</p>
          </div>
          <span class="deliv-free">${ship === 0 ? 'Free' : money(ship)}</span>
        </div>

        <h2 class="co-h mt">3. Payment</h2>
        <div class="pay-tabs">
          <button type="button" class="pay-tab is-on"><span class="radio on"></span>Credit or debit card</button>
          <button type="button" class="pay-tab"><span class="radio"></span>VOLTA wallet</button>
        </div>
        <div class="pay-fields">
          ${fld('Card number', 'card', f.card, { cls: 'w-card', inputmode: 'numeric' })}
          ${fld('Expiry date', 'exp', f.exp, { cls: 'w-exp' })}
          ${fld('Security code', 'cvc', f.cvc, { cls: 'w-cvc', inputmode: 'numeric', type: 'password' })}
        </div>
        <p class="form-err" data-err hidden></p>
      </div>
    </div>

    <aside class="co-side">
      <div class="order-card">
        <h2 class="sum-h">Your order</h2>
        ${state.cart.map((l) => {
          const p = byId(l.id);
          return `<div class="ord-prod">
            <div class="ord-thumb">${p.plate ? `<img src="${img(p.thumb || p.plate)}" alt="${p.name}">` : art(p.art)}</div>
            <div>
              <h3 class="ord-name">${p.name}</h3>
              <p class="ord-meta">${l.color} · Qty ${l.qty}</p>
              <p class="ord-price">${money(p.price * l.qty)}</p>
            </div>
          </div>`;
        }).join('')}
        <div class="co-rule"></div>
        <p class="ord-l">Promo code</p>
        <div class="promo-row">
          <input class="promo-input" data-promo placeholder="Enter code" value="${state.promo}">
          <button type="button" class="promo-btn" data-apply>Apply</button>
        </div>
        ${state.promoMsg ? `<p class="promo-msg">${state.promoMsg}</p>` : ''}
        <div class="sum-line"><span>Subtotal</span><span>${money(subtotal - state.discount)}</span></div>
        <div class="sum-line"><span>Shipping</span><span class="${ship === 0 ? 'green' : ''}">${ship === 0 ? 'Free' : money(ship)}</span></div>
        ${state.discount ? `<div class="sum-line"><span>VOLTA10</span><span class="green">−${money(state.discount)}</span></div>` : ''}
        <div class="sum-rule"></div>
        <div class="sum-total"><span>Total</span><span>${money(total - state.discount)}</span></div>
        <p class="sum-tax">Tax included</p>
        <button class="btn-red btn-pay" type="submit">Pay ${money(total - state.discount)} securely</button>
        <p class="legal">By placing your order, you agree to our Terms and<br>acknowledge our Privacy Policy.</p>
      </div>

      <div class="protect">
        <p class="protect-h">Your details stay protected</p>
        <p class="protect-p">Encrypted payments. No hidden fees.<br>Need help? support@volta.example</p>
      </div>
    </aside>
  </form>
</main>`;
};

/* Confirmed  (frame 8:342) */
const confirmed = (state) => {
  const o = state.order;
  const total = o.total;
  return `
<main class="page">
  <section class="done-hero">
    <span class="done-tick"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#1B6B4A" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"><path d="M4.5 12.5 9.5 17.5 19.5 6.5"/></svg></span>
    <div class="done-l">
      <p class="done-eyebrow">ORDER ${o.id} · ${o.date}</p>
      <h1 class="done-h">Thanks, ${o.first}. You’re all set.</h1>
      <p class="done-p">Your payment of ${money(total)} was successful. A receipt is on its way to<br>${o.email}</p>
      <div class="done-actions">
        <button class="btn-red btn-details" data-go="order">View order details</button>
        <button class="btn-plain" data-go="shop">Continue shopping</button>
      </div>
    </div>
    <div class="done-r">
      <p class="done-est">Estimated delivery</p>
      <p class="done-date">Dec 1–3</p>
      <p class="done-ship">Free standard shipping</p>
    </div>
  </section>

  <div class="done-grid">
    <div class="done-col">
      <div class="track-card">
        <h2 class="card-h">Your order is getting ready</h2>
        <p class="track-p">We’ll email you tracking details as soon as it ships.</p>
        <div class="track">
          ${[['01', 'Confirmed', true], ['02', 'Preparing'], ['03', 'Shipped'], ['04', 'Delivered']]
            .map(([n, l, done]) => `<div class="track-i${done ? ' is-done' : ''}">
              <span class="track-n">${done ? '<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12.5 10 17.5 19 7"/></svg>' : n}</span>
              <span class="track-l">${l}</span>
            </div>`).join('')}
        </div>
      </div>

      <div class="info-card">
        <div class="info-col">
          <h3 class="info-h">Delivering to</h3>
          <p class="info-b">${o.first} ${o.last}</p>
          <p class="info-p">${o.street}<br>${o.postal} ${o.city}<br>${o.country}</p>
        </div>
        <div class="info-sep"></div>
        <div class="info-col">
          <h3 class="info-h">Payment details</h3>
          <p class="info-b">Visa ending in ${o.last4}</p>
          <p class="info-p">${money(total)} paid · Tax included</p>
          <a class="info-link" data-receipt>Download receipt <span class="arw">→</span></a>
        </div>
      </div>
    </div>

    <aside class="done-side">
      <div class="way-card">
        <h2 class="card-h">What’s coming your way</h2>
        ${o.lines.map((l) => {
          const p = byId(l.id);
          return `<div class="ord-prod">
            <div class="ord-thumb">${p.plate ? `<img src="${img(p.thumb || p.plate)}" alt="${p.name}">` : art(p.art)}</div>
            <div>
              <h3 class="ord-name">${p.name}</h3>
              <p class="ord-meta">${l.color} · Qty ${l.qty}</p>
              <p class="ord-price">${money(p.price * l.qty)}</p>
            </div>
          </div>`;
        }).join('')}
        <div class="co-rule"></div>
        <div class="sum-line"><span>Subtotal</span><span>${money(o.subtotal)}</span></div>
        <div class="sum-line"><span>Shipping</span><span class="green">Free</span></div>
        ${o.discount ? `<div class="sum-line"><span>VOLTA10</span><span class="green">−${money(o.discount)}</span></div>` : ''}
        ${o.discount ? `<div class="sum-line"><span>VOLTA10</span><span class="green">−${money(o.discount)}</span></div>` : ''}
        <div class="sum-rule"></div>
        <div class="sum-total"><span>Total paid</span><span>${money(total)}</span></div>
        <p class="sum-tax">30-day returns from the day it arrives.</p>
      </div>
    </aside>
  </div>

  <div class="support">
    <div>
      <p class="support-h">Good support comes with every order.</p>
      <p class="support-p">Questions about delivery or returns? I’m here to help.</p>
    </div>
    <a class="btn-plain sm" data-go="help">Visit help center <span class="arw">→</span></a>
  </div>
</main>`;
};

/* Account / My orders — same system, new screen */
const account = (state) => `
<main class="page">
  <p class="crumb"><span class="cur">My orders</span></p>
  <div class="bag-head">
    <div>
      <h1 class="page-h">My orders</h1>
      <p class="page-p">Signed in as alex.morgan@example.com</p>
    </div>
    <a class="continue" data-go="shop">Continue shopping <span class="arw">→</span></a>
  </div>

  <div class="co-grid acct">
    <div class="co-main">
      ${state.orders.length === 0
        ? `<div class="empty"><p class="empty-h">No orders yet.</p><p class="empty-p">When you place one it will show up here.</p><button class="btn-dark sm" data-go="shop">Start shopping</button></div>`
        : state.orders.map((o) => `<div class="order-row">
            <div class="order-row-top">
              <div>
                <p class="order-id">${o.id}</p>
                <p class="order-date">${o.date} · ${o.lines.reduce((n, l) => n + l.qty, 0)} item${o.lines.reduce((n, l) => n + l.qty, 0) === 1 ? '' : 's'}</p>
              </div>
              <span class="pill ${o.status === 'Confirmed' ? 'pill-red' : 'pill-grey'}">${o.status}</span>
              <span class="order-total">${money(o.total)}</span>
            </div>
            <div class="order-row-body">
              ${o.lines.map((l) => {
                const p = byId(l.id);
                return `<div class="order-line">
                  <div class="order-thumb">${p.plate ? `<img src="${img(p.thumb || p.plate)}" alt="${p.name}">` : art(p.art)}</div>
                  <div><p class="order-name">${p.name}</p><p class="order-meta">${l.color} · Qty ${l.qty}</p></div>
                </div>`;
              }).join('')}
              <a class="order-link" data-view="${o.id}">View order <span class="arw">→</span></a>
            </div>
          </div>`).join('')}
    </div>

    <aside class="co-side">
      <div class="order-card">
        <h2 class="sum-h">Your details</h2>
        <div class="det"><span>Name</span><span>Alex Morgan</span></div>
        <div class="det"><span>Email</span><span>alex.morgan@example.com</span></div>
        <div class="co-rule"></div>
        <p class="ord-l">Addresses</p>
        <div class="addr">
          <p class="addr-h">Home <span class="pill pill-grey">Default</span></p>
          <p class="addr-p">Kepler Street 14<br>3011 AA Rotterdam<br>Netherlands</p>
        </div>
        <div class="co-rule"></div>
        <a class="info-link" data-go="help">Need help with an order <span class="arw">→</span></a>
      </div>
      <div class="protect">
        <p class="protect-h">Your details stay protected</p>
        <p class="protect-p">Encrypted payments. No hidden fees.<br>Need help? support@volta.example</p>
      </div>
    </aside>
  </div>
</main>`;

/* Order detail — the confirmed frame re-read for a past order */
const orderDetail = (state) => {
  const o = state.order;
  return `
<main class="page">
  <p class="crumb"><a data-go="account">My orders</a><span>/</span><span class="cur">${o.id}</span></p>
  <div class="bag-head">
    <div>
      <h1 class="page-h">${o.id}</h1>
      <p class="page-p">Placed ${o.date} · ${o.status}</p>
    </div>
    <a class="continue" data-go="account">← All orders</a>
  </div>

  <div class="done-grid">
    <div class="done-col">
      <div class="track-card">
        <h2 class="card-h">Where it is</h2>
        <div class="track">
          ${[['01', 'Confirmed', true], ['02', 'Preparing', o.status !== 'Confirmed'], ['03', 'Shipped', false], ['04', 'Delivered', false]]
            .map(([n, l, done]) => `<div class="track-i${done ? ' is-done' : ''}">
              <span class="track-n">${done ? '<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12.5 10 17.5 19 7"/></svg>' : n}</span>
              <span class="track-l">${l}</span>
            </div>`).join('')}
        </div>
      </div>
      <div class="info-card">
        <div class="info-col">
          <h3 class="info-h">Delivering to</h3>
          <p class="info-b">${o.first} ${o.last}</p>
          <p class="info-p">${o.street}<br>${o.postal} ${o.city}<br>${o.country}</p>
        </div>
        <div class="info-sep"></div>
        <div class="info-col">
          <h3 class="info-h">Payment details</h3>
          <p class="info-b">Visa ending in ${o.last4}</p>
          <p class="info-p">${money(o.total)} paid · Tax included</p>
          <a class="info-link" data-receipt>Download receipt <span class="arw">→</span></a>
        </div>
      </div>
    </div>
    <aside class="done-side">
      <div class="way-card">
        <h2 class="card-h">In this order</h2>
        ${o.lines.map((l) => {
          const p = byId(l.id);
          return `<div class="ord-prod">
            <div class="ord-thumb">${p.plate ? `<img src="${img(p.thumb || p.plate)}" alt="${p.name}">` : art(p.art)}</div>
            <div>
              <h3 class="ord-name">${p.name}</h3>
              <p class="ord-meta">${l.color} · Qty ${l.qty}</p>
              <p class="ord-price">${money(p.price * l.qty)}</p>
            </div>
          </div>`;
        }).join('')}
        <div class="co-rule"></div>
        <div class="sum-line"><span>Subtotal</span><span>${money(o.subtotal)}</span></div>
        <div class="sum-line"><span>Shipping</span><span class="green">Free</span></div>
        ${o.discount ? `<div class="sum-line"><span>VOLTA10</span><span class="green">−${money(o.discount)}</span></div>` : ''}
        <div class="sum-rule"></div>
        <div class="sum-total"><span>Total paid</span><span>${money(o.total)}</span></div>
      </div>
    </aside>
  </div>
</main>`;
};

/* Help */
const help = () => `
<main class="page">
  <p class="crumb"><span class="cur">Help center</span></p>
  <h1 class="page-h">How can we help?</h1>
  <p class="page-p">Real people, usually within a day.</p>

  <div class="help-grid">
    ${[
      ['Shipping & returns', 'Free over $100, 30 days to change your mind.', 'Orders leave Rotterdam within a day. Standard delivery lands in 2–3 working days, and anything unopened can come back within 30 days for a full refund.'],
      ['Warranty', 'Two years on every device, no receipt needed.', 'We keep order history against your email, so a claim is a conversation rather than paperwork.'],
      ['Payments', 'Card, VOLTA wallet, and one promo code per order.', 'You are charged when the order ships. Nothing is stored on our side.'],
      ['Talk to us', 'support@volta.example · Mon–Fri, 9–18 CET', 'Include your order number if you have one and we can move faster.'],
    ].map(([h, p, b]) => `<article class="help-card"><h3 class="help-h">${h}</h3><p class="help-p">${p}</p><p class="help-b">${b}</p></article>`).join('')}
  </div>

  <div class="support">
    <div>
      <p class="support-h">Still stuck?</p>
      <p class="support-p">Questions about delivery or returns? I’m here to help.</p>
    </div>
    <a class="btn-plain sm" data-go="shop">Back to shopping <span class="arw">→</span></a>
  </div>
</main>`;

/* ── styles ────────────────────────────────────────────────────────────── */
const CSS = String.raw`
*{box-sizing:border-box;margin:0;padding:0}
html{-webkit-text-size-adjust:100%;scroll-behavior:smooth}
body{
  font-family:Inter,system-ui,-apple-system,"Segoe UI",Roboto,sans-serif;
  background:#FAF9F9;color:#14171E;
  -webkit-font-smoothing:antialiased;-moz-osx-font-smoothing:grayscale;
  min-height:100vh;display:flex;flex-direction:column;
}
a,button{cursor:pointer;font-family:inherit}
a{color:inherit;text-decoration:none}
button{background:none;border:0;color:inherit}
:focus-visible{outline:2px solid #C92332;outline-offset:3px;border-radius:6px}
img{display:block;max-width:100%}
.arw{font-size:.92em}

/* ── chrome ────────────────────────────────────────────────────────────── */
.band{
  height:28px;flex:0 0 28px;background:#FDECEE;color:#96151F;
  display:flex;align-items:center;justify-content:center;gap:21px;
  font:500 12px/1 Inter,sans-serif;
}
.hdr{
  height:93px;flex:0 0 93px;background:#fff;border-bottom:1px solid #E8E6E7;
  display:flex;align-items:center;gap:0;padding:0 64px;position:sticky;top:0;z-index:30;
}
.hdr-row{display:flex;align-items:center;flex:1 1 auto;min-width:0}
.hdr-tools{display:none;margin-left:auto;align-items:center;gap:6px}
.hdr-ico{position:relative;width:40px;height:40px;border-radius:20px;display:flex;align-items:center;justify-content:center}
.hdr-ico:hover{background:#F5F3F3}
.hdr-n{
  position:absolute;top:-2px;right:-2px;min-width:17px;height:17px;padding:0 4px;border-radius:9px;
  background:#C92332;color:#fff;font:600 10.5px/17px Inter,sans-serif;text-align:center;
}
.mark{font:700 28px/1 Inter,sans-serif;letter-spacing:-.01em;flex:0 0 auto}
.nav{display:flex;gap:30px;margin-left:29px}
.nav-i{font:400 15px/1 Inter,sans-serif;padding:6px 0;position:relative}
.nav-i:hover{color:#C92332}
.nav-i.is-current{font-weight:600;color:#C92332}
.hdr-right{margin-left:auto;display:flex;align-items:center;gap:36px}
.search{
  width:310px;height:48px;border-radius:24px;background:#F5F3F3;
  display:flex;align-items:center;gap:12px;padding:0 20px;
}
.search input{
  border:0;background:none;outline:none;width:100%;
  font:400 14px/1 Inter,sans-serif;color:#14171E;
}
.search input::placeholder{color:#656976}
.search input::-webkit-search-cancel-button{cursor:pointer}
.orders{font:500 14px/1 Inter,sans-serif;white-space:nowrap}
.orders:hover{color:#C92332}
.bag-pill{
  height:46px;min-width:126px;padding:0 26px;border-radius:23px;background:#14171E;color:#fff;
  font:600 14px/1 Inter,sans-serif;display:flex;align-items:center;justify-content:center;
  transition:transform .12s ease,background .12s ease;
}
.bag-pill:hover{background:#22262F}
.bag-pill.pop{animation:pop .32s ease}
@keyframes pop{0%{transform:scale(1)}40%{transform:scale(1.07)}100%{transform:scale(1)}}

/* ── page frame ────────────────────────────────────────────────────────── */
.page{flex:1 0 auto;width:100%;max-width:1440px;margin:0 auto;padding:33px 64px 88px}
@media (max-width:1440px){.hdr{padding:0 64px}}

/* hero — cut-outs sit directly on the panel and bleed past its clipped edge */
.hero{
  height:318px;border-radius:28px;background:#FCE6E9;
  display:flex;align-items:center;position:relative;overflow:hidden;
}
.hero-l{padding-left:36px;width:540px;padding-top:4px;position:relative;z-index:2}
.eyebrow{font:600 12px/1.2 Inter,sans-serif;color:#96151F}
.hero-h{font:600 48px/58px Inter,sans-serif;letter-spacing:-.022em;margin-top:14px}
.hero-p{font:400 16px/19px Inter,sans-serif;color:#6B5F62;margin-top:28px}
.btn-dark{
  display:inline-flex;align-items:center;gap:10px;height:44px;padding:0 26px;border-radius:22px;
  background:#14171E;color:#fff;font:600 14px/1 Inter,sans-serif;margin-top:15px;
  transition:background .12s ease;
}
.btn-dark:hover{background:#22262F}
.btn-dark.sm{height:44px;padding:0 24px}
.hero-m{
  position:absolute;left:571px;top:0;width:318px;height:100%;
  display:flex;flex-direction:column;justify-content:center;z-index:2;
}
.hero-mh{font:500 26px/30px Inter,sans-serif;letter-spacing:-.015em;margin-top:12px}
.hero-price{font:600 22px/27px Inter,sans-serif;margin-top:22px}
.hero-note{font:400 13px/16px Inter,sans-serif;color:#6B5F62;margin-top:24px}
.hero-art{
  position:absolute;right:-44px;top:-22px;width:430px;height:362px;
  display:block;z-index:1;background:none;border-radius:0;
}
.hero-phone{
  position:absolute;display:block;width:auto;max-width:none;height:100%;
  object-fit:contain;border-radius:0;background:none;
  filter:drop-shadow(0 24px 26px rgba(90,55,62,.18));
  transition:transform .35s ease;
}
.hero-phone-back{height:312px;left:22px;top:30px;transform:rotate(-10deg)}
.hero-phone-front{height:352px;right:2px;top:-8px;transform:rotate(7deg)}
.hero-art:hover .hero-phone-back{transform:translateY(-8px) rotate(-12deg)}
.hero-art:hover .hero-phone-front{transform:translateY(-10px) rotate(9deg)}

/* section heads */
.sec-h{font:600 28px/32px Inter,sans-serif;letter-spacing:-.006em;margin-top:39px}
.sec-p{font:400 15px/18px Inter,sans-serif;color:#656976;margin-top:13px}

/* filters */
.filter-row{display:flex;align-items:center;gap:17px;margin-top:16px}
.chips{display:flex;gap:17px}
.chip{
  height:45px;padding:0 24px;border-radius:12px;background:#fff;
  font:500 14px/1 Inter,sans-serif;transition:background .12s ease,color .12s ease;
}
.chip:hover{background:#F1EFF0}
.chip.is-on{background:#C92332;color:#fff}
.count{font:400 14px/1 Inter,sans-serif;color:#7A7E88;margin-left:auto}
.sortwrap{position:relative}
.sort{
  height:45px;padding:0 24px;border-radius:12px;background:#fff;
  font:500 14px/1 Inter,sans-serif;display:inline-flex;align-items:center;gap:10px;
}
.sort:hover{background:#F1EFF0}
.sortmenu{
  position:absolute;right:0;top:52px;background:#fff;border-radius:16px;
  box-shadow:0 16px 40px rgba(20,23,30,.14);padding:8px;min-width:216px;z-index:20;
}
.sortmenu button{
  display:block;width:100%;text-align:left;padding:12px 14px;border-radius:10px;
  font:400 14px/1 Inter,sans-serif;
}
.sortmenu button:hover{background:#F5F3F3}
.sortmenu button.is-on{font-weight:600;color:#C92332}

.result-note{font:400 14px/17px Inter,sans-serif;color:#656976;margin-top:18px}
.result-note a{color:#C92332;font-weight:500;text-decoration:underline;text-underline-offset:3px}

/* cards */
.cards{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:32px;margin-top:24px}
.card{background:#fff;border-radius:18px;padding:12px 12px 18px;display:flex;flex-direction:column}
.card-plate{
  position:relative;width:100%;aspect-ratio:280/180;border-radius:12px;overflow:hidden;
  background:#F3F3F3;display:block;
}
.card-img{width:100%;height:100%;object-fit:contain;transition:transform .4s ease}
.card-plate:hover .card-img{transform:scale(1.04)}
.plate-art{width:100%;height:100%;display:flex;align-items:center;justify-content:center}
.plate-art svg{width:72%;height:72%;max-height:140px}
.badge{
  position:absolute;left:11px;top:11px;height:25px;padding:0 11px;border-radius:13px;
  background:#fff;color:#C92332;font:500 12px/1 Inter,sans-serif;
  display:inline-flex;align-items:center;
}
.heart{
  position:absolute;right:20px;top:20px;width:36px;height:36px;border-radius:18px;
  background:#fff;display:flex;align-items:center;justify-content:center;z-index:3;
}
.heart svg{width:18px;height:18px}
/* the frame's own crops already contain a heart button in that corner: veil it
   with a feathered disc of the plate's field colour, then draw our own control */
.plate-bg.is-crop::after{
  content:'';position:absolute;right:-16px;top:-16px;width:118px;height:118px;
  background:radial-gradient(closest-side,#F3F3F3 58%,rgba(243,243,243,.85) 74%,rgba(243,243,243,0) 100%);
}
.heart.is-on svg{fill:#C92332;stroke:#C92332}
/* the card plates are crops of the frame, so the frame's own heart button is
   already in the JPEG. Crop it away, then lay our own control on top. */
.plate-bg{position:absolute;inset:0;overflow:hidden;border-radius:12px;background:#F3F3F3}
.plate-bg img{width:100%;height:100%;object-fit:contain;padding:8px 20px}
/* paint out the plate's baked-in heart button with the plate's own field colour */

.heart-ico{display:flex}
.heart.is-on .heart-ico svg{fill:#C92332;stroke:#C92332}
.card-name{font:600 17px/21px Inter,sans-serif;letter-spacing:-.004em;margin-top:8px}
.card-name a:hover{color:#C92332}
.card-kind{font:400 13px/16px Inter,sans-serif;color:#656976;margin-top:10px}
.card-rate{font:400 13px/15px Inter,sans-serif;color:#3E4148;margin-top:12px}
.star{color:#C92332;font-size:12px}
.card-foot{display:flex;align-items:center;justify-content:space-between;margin-top:auto;padding-top:11px}
.card-price{font:600 15px/18px Inter,sans-serif;letter-spacing:-.005em}
.card-link{font:400 13px/15px Inter,sans-serif}
.card-link:hover{color:#C92332}

.empty{
  background:#fff;border-radius:18px;padding:56px 32px;text-align:center;margin-top:24px;
}
.empty.big{padding:88px 32px}
.empty-h{font:600 22px/28px Inter,sans-serif}
.empty-p{font:400 14px/17px Inter,sans-serif;color:#656976;margin-top:10px}
.empty .btn-dark{margin-top:22px}

.service-strip{
  height:52px;border-radius:16px;background:#FAEDEF;display:flex;align-items:center;
  justify-content:space-around;margin-top:26px;
}
.service-strip span{font:400 14px/1 Inter,sans-serif;color:#3C3F48}

/* footer */
.ftr{flex:0 0 108px;height:108px;background:#fff;border-top:1px solid #E8E6E7;margin-top:auto}
body.is-home .ftr{display:none}
.ftr-in{
  max-width:1440px;margin:0 auto;height:100%;padding:0 64px;
  display:flex;align-items:center;
}
.ftr-left{display:flex;align-items:center;gap:29px}
.ftr-mark{font:700 22px/1 Inter,sans-serif;letter-spacing:-.01em}
.ftr-tag{font:400 14px/1 Inter,sans-serif;color:#656976}
.ftr-right{margin-left:auto;display:flex;align-items:center;gap:47px}
.ftr-l{font:400 14px/1 Inter,sans-serif}
.ftr-l:hover{color:#C92332}
.ftr-copy{font:400 12px/1 Inter,sans-serif;color:#656976}

/* ── landing ───────────────────────────────────────────────────────────── */
.home{
  flex:1 0 auto;width:100%;max-width:1440px;margin:0 auto;
  padding:28px 64px 0;overflow:hidden;
}
.hero-home{
  height:520px;border-radius:32px;align-items:flex-start;
  background:#FCE6E9;
}
.hero-home:after{
  content:'VOLTA';position:absolute;right:42px;top:42px;
  font:700 190px/1 Inter,sans-serif;letter-spacing:-.06em;
  color:rgba(150,21,31,.07);z-index:0;pointer-events:none;
}
.hero-home .hero-l{width:690px;padding-left:64px;padding-top:34px}
.hero-home .hero-h{font:600 72px/78px Inter,sans-serif;letter-spacing:-.04em;margin-top:22px}
.hero-home .hero-p{max-width:430px;font:400 17px/24px Inter,sans-serif;margin-top:24px}
.hero-home .btn-dark{margin-top:26px;height:50px;padding:0 30px;border-radius:25px}
.hero-home .hero-m{display:none}
.hero-home .hero-art{right:-70px;top:-24px;width:610px;height:570px}
.hero-home .hero-phone-back{height:500px;left:40px;top:34px;transform:rotate(-13deg)}
.hero-home .hero-phone-front{height:555px;right:-22px;top:-18px;transform:rotate(9deg)}
.home-intro{
  display:flex;align-items:flex-end;justify-content:space-between;gap:64px;
  padding:96px 0 76px;position:relative;
}
.home-intro-h{font:600 52px/58px Inter,sans-serif;letter-spacing:-.035em;margin-top:20px}
.home-intro-p{
  max-width:520px;font:400 16px/25px Inter,sans-serif;color:#656976;margin-top:24px;
}
.home-intro-index{font:500 12px/1 Inter,sans-serif;color:#C92332;letter-spacing:.08em;white-space:nowrap}
.home-moment{
  position:relative;min-height:470px;display:grid;grid-template-columns:1fr 1fr;
  align-items:center;overflow:hidden;border-radius:28px;
}
.home-moment.full{width:calc(100% + 128px);margin-left:-64px;border-radius:0}
.home-moment-dark{background:#14171E;color:#fff}
.home-moment-blush{background:#FCE6E9}
.home-moment-pair{background:#D8F2E7}
.home-moment-copy{position:relative;z-index:2;padding:64px;max-width:610px}
.home-copy-right{grid-column:2}
.home-kicker{font:600 11.5px/1 Inter,sans-serif;color:#C92332;letter-spacing:.08em}
.home-moment-dark .home-kicker{color:#FDECEE}
.home-moment-h{font:600 48px/54px Inter,sans-serif;letter-spacing:-.035em;margin-top:24px}
.home-moment-p{font:400 16px/25px Inter,sans-serif;color:#656976;margin-top:24px;max-width:450px}
.home-moment-dark .home-moment-p{color:#C9CBD1}
.home-link{
  display:inline-flex;align-items:center;gap:10px;margin-top:34px;
  border-bottom:1px solid currentColor;padding-bottom:5px;
  font:600 14px/1 Inter,sans-serif;color:#C92332;
}
.home-moment-dark .home-link{color:#fff}
.home-link:hover{color:#96151F}
.home-moment-dark .home-link:hover{color:#FDECEE}
.home-moment-art{position:absolute;pointer-events:none;z-index:1}
.home-moment-art img{
  display:block;max-width:none;width:auto;height:auto;
  filter:drop-shadow(0 30px 36px rgba(20,23,30,.22));
}
.home-art-left{left:-62px;bottom:-118px;width:380px}
.home-art-left img{height:570px;transform:rotate(-9deg)}
.home-art-right{right:-48px;bottom:-112px;width:360px}
.home-art-right img{height:560px;transform:rotate(10deg)}
.home-art-pair{left:8%;bottom:-90px;width:520px;height:530px}
.home-art-pair img{position:absolute;height:520px}
.home-art-pair .pair-back{left:20px;top:18px;transform:rotate(-12deg)}
.home-art-pair .pair-front{right:20px;top:-8px;transform:rotate(10deg)}
.home-values{
  display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:1px;
  background:#E8E6E7;margin:0 0 0;
}
.home-value{background:#FAF9F9;padding:42px 32px 46px;min-height:190px}
.home-value-n{font:600 11.5px/1 Inter,sans-serif;color:#C92332;letter-spacing:.08em}
.home-value h3{font:600 20px/25px Inter,sans-serif;letter-spacing:-.015em;margin-top:26px}
.home-value p{font:400 13.5px/20px Inter,sans-serif;color:#656976;margin-top:12px}
.home-close{
  min-height:390px;border-radius:32px 32px 0 0;background:#C92332;color:#fff;
  display:flex;align-items:center;justify-content:space-between;gap:48px;
  padding:72px 64px;margin-top:0;
}
.home-close .eyebrow{color:#fff}
.home-close h2{font:600 56px/62px Inter,sans-serif;letter-spacing:-.04em;margin-top:22px}
.home-close p:last-child{font:400 15px/23px Inter,sans-serif;color:#FDECEE;margin-top:22px;max-width:430px}
.home-close-cta{
  display:inline-flex;align-items:center;gap:14px;height:58px;padding:0 34px;
  border-radius:29px;background:#fff;color:#14171E;
  font:600 15px/1 Inter,sans-serif;white-space:nowrap;
  transition:transform .12s ease,background .12s ease;
}
.home-close-cta:hover{transform:translateY(-2px);background:#F5F3F3}

/* breadcrumb */
.crumb{font:400 13px/16px Inter,sans-serif;color:#6B6F79;display:flex;align-items:center}
.crumb a:hover{color:#C92332}
.crumb span{padding:0 9px;color:#C3C5CB}
.crumb .cur{padding:0}

/* ── product ───────────────────────────────────────────────────────────── */
.pdp{display:grid;grid-template-columns:624px minmax(0,1fr);gap:64px;margin-top:32px}
.gallery{background:#fff;border-radius:22px;padding:14px 28px 0;display:flex;flex-direction:column}
.gallery-plate{
  width:100%;aspect-ratio:568/427;border-radius:14px;background:#F3F3F3;overflow:hidden;
  display:flex;align-items:center;justify-content:center;
}
.gallery-plate img{width:100%;height:100%;object-fit:contain;padding:18px}
.gallery-plate .plate-art svg{width:46%;height:46%;max-height:220px}
.gallery-plate svg{width:60%;height:60%}
.gallery-foot{display:flex;align-items:center;justify-content:space-between;padding:0;height:101px;gap:16px}
.gallery-note{font:400 13px/16px Inter,sans-serif;color:#4E5159}
.gallery-tag{
  height:38px;padding:0 20px;border-radius:19px;background:#FDECEE;color:#96151F;
  font:500 13px/1 Inter,sans-serif;display:inline-flex;align-items:center;white-space:nowrap;
}
.buy-eyebrow{font:500 12px/1 Inter,sans-serif;color:#C92332;letter-spacing:.04em}
.buy{margin-top:-7px}
.buy-h{font:600 41px/48px Inter,sans-serif;letter-spacing:-.014em;margin-top:17px}
.rating-row{display:flex;align-items:center;gap:9px;margin-top:19px;font:400 13px/1 Inter,sans-serif}
.rating-row b{font-weight:600}
.rating-c{color:#656976;margin-left:16px;font-size:14px}
.buy-price{font:600 38px/44px Inter,sans-serif;letter-spacing:-.02em;margin-top:21px}
.buy-tax{font:400 13px/16px Inter,sans-serif;color:#4E5159;margin-top:0}
.buy-h2{font:500 20px/25px Inter,sans-serif;letter-spacing:-.01em;margin-top:26px}
.buy-p{font:400 13.5px/19px Inter,sans-serif;color:#656976;margin-top:12px;max-width:31em}
.opt-label{font:500 13px/16px Inter,sans-serif;color:#3C3F48;margin-top:24px}
.swatches{display:flex;gap:14px;margin-top:14px;flex-wrap:wrap}
.swatch{
  height:50px;padding:0 24px;border-radius:25px;background:#F1EFF0;
  font:500 14px/1 Inter,sans-serif;transition:background .12s ease,color .12s ease;
}
.swatch:hover{background:#EDE9EA}
.swatch.is-on{background:#FDECEE;color:#96151F;box-shadow:inset 0 0 0 1px #F7D7DB}
.qty-label{margin-top:22px}
.qty-row{display:flex;align-items:center;gap:18px;margin-top:12px;flex-wrap:wrap}
.stepper{
  height:50px;border-radius:25px;border:1px solid #E2E2E3;background:#fff;
  display:inline-flex;align-items:center;justify-content:space-between;padding:0 18px;
  width:130px;flex:0 0 auto;
}
.stepper.sm{height:44px;width:124px;border:0;background:#F3F1F2;border-radius:22px;padding:0 14px}
.step{font:400 16px/1 Inter,sans-serif;color:#4E5159;padding:6px}
.step:hover{color:#C92332}
.step-n{font:500 15px/1 Inter,sans-serif}
.btn-red{
  display:inline-flex;align-items:center;justify-content:center;height:48px;border-radius:24px;
  background:#C92332;color:#fff;font:600 15px/1 Inter,sans-serif;
  transition:background .12s ease,transform .12s ease;
}
.btn-red:hover{background:#B01D2B}
.btn-add{height:50px;border-radius:25px;flex:1;min-width:280px}
.btn-add.added{background:#1B6B4A}
.buy-meta{font:400 13px/16px Inter,sans-serif;color:#3C3F48;margin-top:24px}
.buy-meta .dot{color:#B4B7BD;padding:0 6px}

.benefits{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:28px;margin-top:41px}
.benefit{background:#fff;border-radius:22px;padding:26px 28px 30px}
.b-n{font:500 12px/1 Inter,sans-serif;color:#C92332}
.b-h{font:600 18px/22px Inter,sans-serif;margin-top:14px;letter-spacing:-.01em}
.b-p{font:400 13.5px/19px Inter,sans-serif;color:#656976;margin-top:11px}

.tabs{display:flex;align-items:center;margin-top:44px;border-bottom:1px solid #E8E6E7;padding-bottom:2px}
.tabs-l{display:flex;gap:56px}
.tab{font:400 13px/1 Inter,sans-serif;color:#4E5159;padding:12px 0;border-bottom:2px solid transparent;margin-bottom:-3px}
.tab:hover{color:#14171E}
.tab.is-on{font-weight:600;color:#C92332;border-bottom-color:#C92332}
.tabs-help{margin-left:auto;font:400 13px/1 Inter,sans-serif}
.tabs-help:hover{color:#C92332}
.tabpanel{padding-top:26px}
.tab-p{font:400 14px/22px Inter,sans-serif;color:#4E5159;max-width:64em}
.specs{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:0 64px}
.specs div{display:flex;justify-content:space-between;gap:24px;padding:14px 0;border-bottom:1px solid #EDEDEF}
.specs dt{font:500 13px/16px Inter,sans-serif;color:#656976}
.specs dd{font:400 13px/16px Inter,sans-serif;text-align:right}
.reviews{display:grid;grid-template-columns:200px minmax(0,1fr);gap:56px}
.rev-big{font:600 56px/60px Inter,sans-serif;letter-spacing:-.03em}
.rev-sub{font:400 13px/16px Inter,sans-serif;color:#656976;margin-top:6px}
.rev-list{display:flex;flex-direction:column;gap:22px}
.rev-head{display:flex;align-items:center;gap:12px;font:400 13px/16px Inter,sans-serif}
.rev-body{font:400 14px/21px Inter,sans-serif;color:#4E5159;margin-top:6px}

/* ── bag / checkout split ──────────────────────────────────────────────── */
.page-h{font:600 40px/48px Inter,sans-serif;letter-spacing:-.014em}
.page-p{font:400 15px/19px Inter,sans-serif;color:#656976;margin-top:9px}
.bag-head{display:flex;align-items:flex-start;margin-top:22px;gap:24px}
.continue{margin-left:auto;margin-top:14px;font:500 14px/1 Inter,sans-serif;color:#C92332;white-space:nowrap}
.continue:hover{text-decoration:underline;text-underline-offset:4px}
.bag-grid{display:grid;grid-template-columns:minmax(0,824fr) minmax(0,456fr);gap:32px;margin-top:39px;align-items:start}

.bag-main{display:flex;flex-direction:column;gap:24px}
.bag-card{background:#fff;border-radius:22px;padding:24px 32px 30px;display:flex;flex-direction:column;justify-content:space-between;gap:20px}
.bag-cols{display:grid;grid-template-columns:minmax(0,1fr) 160px 150px;padding-bottom:9px;border-bottom:1px solid #E8E6E7}
.bag-cols span{font:500 11px/1 Inter,sans-serif;color:#656976;letter-spacing:.06em}
.c-q{text-align:center}
.c-t{text-align:right}
.bag-row{display:grid;grid-template-columns:minmax(0,1fr) 160px 150px;align-items:start;padding-top:34px;gap:16px}
.bag-info{display:flex;flex-direction:column;align-items:flex-start}
.bag-prod{display:flex;gap:28px}
.bag-thumb{
  width:145px;height:145px;border-radius:14px;background:#F3F3F3;overflow:hidden;flex:0 0 auto;
  display:flex;align-items:center;justify-content:center;
}
.bag-thumb img{width:100%;height:100%;object-fit:contain;padding:10px}
.bag-thumb svg{width:80%;height:80%}
.bag-name{font:600 20px/24px Inter,sans-serif}
.bag-name a:hover{color:#C92332}
.bag-meta{font:400 13px/19px Inter,sans-serif;color:#7A7E88;margin-top:11px}
.bag-stock{font:400 12.5px/15px Inter,sans-serif;color:#3F8A66;margin-top:11px}
.bag-remove{font:400 13px/16px Inter,sans-serif;color:#4E5159;margin-top:30px;padding-right:4px}
.bag-remove:hover{color:#C92332}
.bag-save{font:500 12.5px/15px Inter,sans-serif;color:#C92332;margin-top:39px;text-align:left}
.bag-qty{display:flex;flex-direction:column;align-items:flex-end;padding-top:4px}
.bag-total{font:600 19px/23px Inter,sans-serif;text-align:right;padding-top:16px}
.bag-inline-total{display:none;font:600 17px/22px Inter,sans-serif;margin-top:12px}
.ship-note{background:#FDECEE;border-radius:20px;padding:25px 26px 26px}
.ship-h{font:600 18px/23px Inter,sans-serif;color:#96151F;letter-spacing:-.004em}
.ship-p{font:400 13.5px/18px Inter,sans-serif;color:#6B5B5E;margin-top:9px}
.summary,.order-card{background:#fff;border-radius:22px;padding:26px 28px 28px}
.sum-h{font:600 24px/31px Inter,sans-serif;letter-spacing:-.02em}
.sum-line{display:flex;justify-content:space-between;gap:16px;margin-top:20px;font:400 14px/17px Inter,sans-serif;color:#656976}
.sum-line span:last-child{color:#14171E}
.green{color:#2F7A52!important}
.sum-rule{height:1px;background:#E8E6E7;margin-top:20px}
.sum-total{display:flex;justify-content:space-between;align-items:baseline;margin-top:18px;gap:16px}
.sum-total span:first-child{font:600 20px/24px Inter,sans-serif}
.sum-total span:last-child{font:600 28px/32px Inter,sans-serif;letter-spacing:-.02em}
.sum-tax{font:400 13px/16px Inter,sans-serif;color:#656976;margin-top:12px}
.btn-checkout{width:100%;height:56px;border-radius:28px;margin-top:20px}
.sum-secure{font:400 12.5px/15px Inter,sans-serif;color:#656976;text-align:center;margin-top:18px}
.sum-promo{font:500 12.5px/15px Inter,sans-serif;color:#96151F;text-align:center;margin-top:12px}

.also{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:32px;margin-top:24px}
.also-card{background:#fff;border-radius:22px;padding:14px;display:grid;grid-template-columns:129px minmax(0,1fr);gap:20px}
.also-plate{
  position:relative;width:129px;height:152px;border-radius:14px;overflow:hidden;background:#F3F3F3;
  display:flex;align-items:center;justify-content:center;
}
.also-plate img{width:100%;height:100%;object-fit:contain;padding:10px}
.also-plate svg{width:80%;height:80%}
.also-body{padding-top:6px;display:flex;flex-direction:column}
.also-name{font:600 16px/21px Inter,sans-serif}
.also-name a:hover{color:#C92332}
.also-price{font:400 14px/17px Inter,sans-serif;margin-top:10px}
.also-link{margin-top:auto;font:500 12.5px/15px Inter,sans-serif;color:#C92332}
.sec-h.narrow{margin-top:46px}

/* checkout */
.back{font:400 13px/16px Inter,sans-serif;color:#C92332;display:inline-block}
.co-head .page-p{margin-top:4px}
.back:hover{text-decoration:underline;text-underline-offset:3px}
.co-head{display:flex;align-items:flex-end;gap:24px;margin-top:20px}
.steps{margin-left:auto;font:400 14px/17px Inter,sans-serif;color:#6B6F79}
.steps .sep{color:#C3C5CB;padding:0 10px}
.steps-cur{color:#4E5159}
.co-grid{display:grid;grid-template-columns:minmax(0,824fr) minmax(0,456fr);gap:32px;margin-top:26px;align-items:start}
.co-main{min-width:0}
.co-card{background:#fff;border-radius:22px;padding:24px 32px 30px}
.co-row-h{display:flex;align-items:baseline;gap:16px}
.co-h{font:600 20px/26px Inter,sans-serif}
.co-h.mt{margin-top:14px}
.co-signin{margin-left:auto;font:400 13px/16px Inter,sans-serif;color:#3C3F48}
.link-red{color:#C92332}
.link-red:hover{text-decoration:underline;text-underline-offset:3px}
.fld{display:block;margin-top:17px}
.fld-l{display:block;font:400 11.5px/14px Inter,sans-serif;color:#3C3F48;margin-bottom:10px}
.fld-i{
  display:block;width:100%;height:44px;border-radius:10px;border:1px solid #DCDCDD;
  padding:0 14px;font:400 14px/1 Inter,sans-serif;color:#14171E;background:#fff;
  transition:border-color .12s ease,box-shadow .12s ease;
}
.fld-i:focus{outline:none;border-color:#C92332;box-shadow:0 0 0 3px rgba(201,35,50,.12)}
.fld-i.err{border-color:#C92332;background:#FFF7F8}
.co-help{font:400 12.5px/15px Inter,sans-serif;color:#7A7E88;margin-top:6px}
.co-rule{height:1px;background:#E8E6E7;margin-top:18px}
.two{display:grid;grid-template-columns:1fr 1fr;gap:0 34px}
.three{display:grid;grid-template-columns:214px 214px minmax(0,1fr);gap:0 34px}
.deliv{display:flex;align-items:center;gap:16px;background:#FDECEE;border-radius:12px;padding:16px 20px;margin-top:24px}
.deliv-dot{width:11px;height:11px;border-radius:6px;background:#C92332;flex:0 0 auto}
.deliv-body{flex:1}
.deliv-h{font:500 14px/19px Inter,sans-serif;color:#3C1D22}
.deliv-p{font:400 12px/16px Inter,sans-serif;color:#7C6065}
.deliv-free{font:500 14px/1 Inter,sans-serif;color:#2F7A52}
.pay-tabs{display:flex;gap:14px;margin-top:20px;flex-wrap:wrap}
.pay-tab{
  height:48px;padding:0 26px;border-radius:24px;background:#F1EFF0;
  font:500 14px/1 Inter,sans-serif;display:inline-flex;align-items:center;gap:12px;
}
.pay-tab.is-on{background:#FDECEE;color:#96151F}
.radio{width:13px;height:13px;border-radius:7px;border:1.6px solid #6E7178;display:inline-block}
.radio.on{background:#C92332;border-color:#C92332}
.pay-fields{display:grid;grid-template-columns:minmax(0,1fr) 200px 116px;gap:0 34px;margin-top:3px}
.form-err{
  margin-top:18px;background:#FDECEE;color:#96151F;border-radius:10px;
  padding:12px 16px;font:500 13px/18px Inter,sans-serif;
}
.ord-prod{display:flex;gap:22px;margin-top:22px}
.ord-thumb{
  width:88px;height:86px;border-radius:12px;background:#F3F3F3;overflow:hidden;flex:0 0 auto;
  display:flex;align-items:center;justify-content:center;
}
.ord-thumb img{width:100%;height:100%;object-fit:contain;padding:7px}
.ord-thumb svg{width:80%;height:80%}
.ord-name{font:600 15px/19px Inter,sans-serif}
.ord-meta{font:400 13px/17px Inter,sans-serif;color:#7A7E88;margin-top:6px}
.ord-price{font:600 15px/18px Inter,sans-serif;margin-top:6px}
.ord-l{font:400 13px/16px Inter,sans-serif;color:#4E5159;margin-top:22px}
.promo-row{min-width:0;display:flex;gap:14px;margin-top:11px}
.promo-input{min-width:0;  flex:1;min-width:0;height:50px;border-radius:10px;border:1px solid #DCDCDD;padding:0 14px;
  font:400 14px/1 Inter,sans-serif;background:#fff;
}
.promo-input:focus{outline:none;border-color:#C92332;box-shadow:0 0 0 3px rgba(201,35,50,.12)}
.promo-btn{
  width:96px;height:50px;border-radius:25px;background:#F1EFF0;
  font:500 14px/1 Inter,sans-serif;flex:0 0 auto;
}
.promo-btn:hover{background:#EDE9EA}
.promo-msg{font:500 12.5px/16px Inter,sans-serif;color:#2F7A52;margin-top:10px}
.btn-pay{width:100%;height:56px;border-radius:28px;margin-top:20px}
.legal{font:400 13px/19px Inter,sans-serif;color:#656976;margin-top:17px}
.protect{background:#FAEDEF;border-radius:20px;padding:22px 26px;margin-top:32px}
.protect-h{font:600 17px/21px Inter,sans-serif;color:#96151F}
.protect-p{font:400 13px/19px Inter,sans-serif;color:#6B5B5E;margin-top:9px}

/* confirmed / order */
.done-hero{
  min-height:281px;border-radius:28px;background:#FDECEE;position:relative;
  display:flex;align-items:center;padding:34px 36px 34px 30px;
}
.done-tick{
  position:absolute;left:28px;top:38px;width:44px;height:44px;border-radius:22px;background:#D8F2E7;
  display:flex;align-items:center;justify-content:center;
}
.done-l{flex:1;min-width:0;padding-left:74px}
.done-eyebrow{font:500 12px/15px Inter,sans-serif;color:#96151F;letter-spacing:.03em}
.done-h{font:600 41px/50px Inter,sans-serif;letter-spacing:-.031em;margin-top:14px;color:#1A1417}
.done-p{font:400 14px/21px Inter,sans-serif;color:#5E4E52;margin-top:13px}
.done-actions{display:flex;gap:14px;margin-top:23px;flex-wrap:wrap}
.btn-details{height:48px;padding:0 33px;border-radius:24px;font-size:14px}
.btn-plain{
  display:inline-flex;align-items:center;justify-content:center;height:48px;padding:0 30px;border-radius:24px;
  background:#fff;color:#14171E;font:600 14px/1 Inter,sans-serif;
  transition:background .12s ease;
}
.btn-plain:hover{background:#F5F3F3}
.btn-plain.sm{height:44px;padding:0 26px;border-radius:22px;font-size:13.5px;gap:8px}
.done-r{margin-left:auto;padding-right:34px}
.done-est{font:400 13px/16px Inter,sans-serif;color:#7C6065}
.done-date{font:600 34px/40px Inter,sans-serif;color:#96151F;margin-top:12px;letter-spacing:-.02em}
.done-ship{font:400 13px/16px Inter,sans-serif;color:#7C6065;margin-top:12px}
.done-grid{display:grid;grid-template-columns:minmax(0,824fr) minmax(0,456fr);gap:32px;margin-top:12px;align-items:start}
.done-col{display:flex;flex-direction:column;gap:24px}
.track-card{background:#fff;border-radius:22px;padding:26px 32px 30px}
.card-h{font:600 23px/28px Inter,sans-serif;letter-spacing:-.02em}
.track-p{font:400 13.5px/17px Inter,sans-serif;color:#656976;margin-top:11px}
.track{display:flex;margin-top:34px;position:relative}
.track:before{content:"";position:absolute;left:16px;right:16px;top:15px;height:1px;background:#E8E8E8}
.track-i{flex:1;display:flex;flex-direction:column;position:relative;z-index:1}
.track-n{
  width:31px;height:31px;border-radius:16px;background:#EFEFEF;color:#7A7E88;
  font:500 12px/1 Inter,sans-serif;display:flex;align-items:center;justify-content:center;
}
.track-i.is-done .track-n{background:#C92332;color:#fff}
.track-l{font:400 13px/16px Inter,sans-serif;color:#4E5159;margin-top:14px}
.track-i.is-done .track-l{font-weight:600;color:#C92332}
.info-card{background:#fff;border-radius:22px;padding:26px 32px 30px;display:flex;gap:32px}
.info-col{flex:1}
.info-sep{width:1px;background:#E8E6E7}
.info-h{font:600 17px/21px Inter,sans-serif}
.info-b{font:500 13.5px/17px Inter,sans-serif;margin-top:20px}
.info-p{font:400 13px/19px Inter,sans-serif;color:#656976;margin-top:9px}
.info-link{font:600 13px/16px Inter,sans-serif;color:#C92332;display:inline-block;margin-top:18px}
.info-link:hover{text-decoration:underline;text-underline-offset:3px}
.way-card{background:#fff;border-radius:22px;padding:26px 28px 28px}
.support{
  min-height:108px;border-radius:22px;background:#FAEDEF;display:flex;align-items:center;
  padding:24px 30px 24px 32px;margin-top:32px;gap:24px;
}
.support-h{font:600 19px/24px Inter,sans-serif;color:#96151F}
.support-p{font:400 13px/17px Inter,sans-serif;color:#6B5B5E;margin-top:9px}
.support .btn-plain{margin-left:auto}

/* account */
.acct{margin-top:26px}
.pill{
  display:inline-flex;align-items:center;height:26px;padding:0 12px;border-radius:13px;
  font:600 11px/1 Inter,sans-serif;letter-spacing:.02em;
}
.pill-red{background:#FDECEE;color:#96151F}
.pill-grey{background:#F1EFF0;color:#4E5159}
.order-row{background:#fff;border-radius:22px;padding:24px 28px 22px;margin-bottom:24px}
.order-row-top{display:flex;align-items:center;gap:16px;padding-bottom:18px;border-bottom:1px solid #E8E6E7}
.order-id{font:600 16px/20px Inter,sans-serif}
.order-date{font:400 13px/16px Inter,sans-serif;color:#7A7E88;margin-top:6px;white-space:nowrap}
.order-total{margin-left:auto;font:600 19px/23px Inter,sans-serif}
.order-row-body{display:flex;align-items:center;gap:24px;padding-top:18px;flex-wrap:wrap}
.order-line{display:flex;align-items:center;gap:14px}
.order-thumb{
  width:56px;height:56px;border-radius:10px;background:#F3F3F3;overflow:hidden;flex:0 0 auto;
  display:flex;align-items:center;justify-content:center;
}
.order-thumb img{width:100%;height:100%;object-fit:contain;padding:5px}
.order-thumb svg{width:80%;height:80%}
.order-name{font:600 14px/18px Inter,sans-serif}
.order-meta{font:400 12.5px/16px Inter,sans-serif;color:#7A7E88;margin-top:4px}
.order-link{margin-left:auto;font:500 12.5px/15px Inter,sans-serif;color:#C92332}
.order-link:hover{text-decoration:underline;text-underline-offset:3px}
.det{display:flex;justify-content:space-between;gap:16px;margin-top:16px;font:400 13.5px/17px Inter,sans-serif;color:#656976}
.det span:last-child{color:#14171E}
.addr{margin-top:14px}
.addr-h{display:flex;align-items:center;gap:10px;font:500 13.5px/17px Inter,sans-serif}
.addr-p{font:400 13px/19px Inter,sans-serif;color:#656976;margin-top:9px}

/* help */
.help-grid{display:grid;grid-template-columns:1fr 1fr;gap:24px;margin-top:30px}
.help-card{background:#fff;border-radius:22px;padding:28px 30px 30px}
.help-h{font:600 18px/23px Inter,sans-serif}
.help-p{font:400 13.5px/19px Inter,sans-serif;color:#4E5159;margin-top:10px}
.help-b{font:400 13px/20px Inter,sans-serif;color:#656976;margin-top:12px}

/* toast */
.toast{
  position:fixed;left:50%;bottom:28px;transform:translate(-50%,16px);
  background:#14171E;color:#fff;border-radius:16px;padding:14px 20px;
  font:500 13.5px/1.35 Inter,sans-serif;white-space:nowrap;
  box-shadow:0 18px 44px rgba(20,23,30,.24);opacity:0;pointer-events:none;
  transition:opacity .2s ease,transform .2s ease;z-index:60;
}
.toast.show{opacity:1;transform:translate(-50%,0);pointer-events:auto}
.toast a{color:#fff;font-weight:600;margin-left:10px;text-decoration:underline;text-underline-offset:3px;cursor:pointer}

/* ── responsive ────────────────────────────────────────────────────────── */
@media (max-width:1120px){
  .pdp{grid-template-columns:1fr;gap:32px}
  .cards{grid-template-columns:repeat(3,minmax(0,1fr))}
  .nav{gap:22px}
  .search{width:230px}
  .hdr-right{gap:22px}
}
@media (max-width:960px){
  .hdr{padding:0 28px;height:auto;min-height:72px;flex-wrap:wrap;gap:8px 0;padding-top:10px;padding-bottom:10px}
  .hdr-row{flex-wrap:wrap;gap:6px}
  .page{padding:24px 28px 64px}
  .ftr-in{padding:0 28px}
  .hero{min-height:560px;height:auto;flex-direction:column;align-items:flex-start;padding:28px 24px;gap:20px}
  .hero-l{padding-left:0;padding-top:0;width:min(100%,520px)}
  .hero-m{position:relative;left:auto;top:auto;width:auto;height:auto;display:block;padding-left:0}
  .hero-art{right:-90px;top:auto;bottom:-70px;width:430px;height:430px}
  .hero-phone-back{height:370px;left:10px;top:24px}
  .hero-phone-front{height:420px;right:0;top:-8px}
  .hero-h{font-size:38px;line-height:46px}
  .hero-p{margin-top:16px}
  .cards{grid-template-columns:repeat(2,minmax(0,1fr));gap:20px}
  .also{grid-template-columns:1fr}
  .bag-grid,.co-grid,.done-grid{grid-template-columns:1fr}
  .bag-grid>*,.co-grid>*,.done-grid>*{min-width:0}
  .summary,.order-card,.co-side,.done-side{max-width:none}
  .bag-cols{display:none}
  .bag-row{grid-template-columns:1fr;gap:18px;padding-top:20px}
  .bag-qty{justify-content:flex-start}
  .bag-total{text-align:left;padding-top:0}
  .benefits{grid-template-columns:1fr;gap:16px}
  .help-grid{grid-template-columns:1fr}
  .co-head{flex-wrap:wrap}
  .steps{margin-left:0;width:100%;margin-top:6px}
  .two,.three,.pay-fields{grid-template-columns:1fr;gap:0}
  .info-card{flex-direction:column;gap:24px}
  .info-sep{width:auto;height:1px}
  .reviews{grid-template-columns:1fr;gap:28px}
  .specs{grid-template-columns:1fr}
  .done-hero{flex-direction:column;align-items:flex-start;padding:24px}
  .done-l{padding-left:0;padding-top:56px}
  .done-r{margin:26px 0 0;padding:0}
  .done-h{font-size:32px;line-height:40px}
  .done-tick{left:24px;top:24px}
  .service-strip{flex-direction:column;height:auto;gap:12px;padding:18px}
  .filter-row{flex-wrap:wrap;gap:12px}
  .count{margin-left:0;width:100%;order:3}
  .sortwrap{margin-left:auto}
  .ftr{height:auto}
  .ftr-in{flex-direction:column;align-items:flex-start;gap:16px;padding-top:26px;padding-bottom:26px}
  .ftr-right{margin-left:0;flex-wrap:wrap;gap:20px}
  .tabs{flex-wrap:wrap;gap:8px}
  .tabs-help{margin-left:0;width:100%;margin-top:10px;padding-bottom:10px}
}
@media (max-width:640px){
  .hdr{
    height:auto;flex:0 0 auto;padding:12px 18px 0;gap:0;
    align-items:center;flex-wrap:wrap;
  }
  .hdr-tools{display:flex;gap:2px}
  .hdr-ico[data-go="bag"]{display:none}
  .hdr-row{order:3;width:100%;flex-direction:column;align-items:stretch;gap:0}
  .hdr-right{order:-1;margin-left:0;gap:10px;width:100%;padding-top:10px}
  .search{width:auto;flex:1 1 auto;min-width:0}
  .nav{order:2;width:100%;overflow-x:auto;gap:20px;margin:10px 0 0;padding:2px 0 10px;scrollbar-width:none}
  .nav::-webkit-scrollbar{display:none}
  .nav-i{white-space:nowrap}
  .page{padding:20px 18px 56px}
  .ftr-in{padding:0 18px}
  .mark{font-size:24px}
  .nav{order:3;width:100%;gap:18px;margin-left:0;overflow-x:auto;padding-bottom:4px}
  .nav-i{font-size:14px;white-space:nowrap}
  .hdr-right{order:2;margin-left:auto;gap:14px}
  .search{width:auto;flex:1;min-width:0;height:42px}
  .orders{display:none}
  .bag-pill{height:42px;min-width:0;padding:0 18px;font-size:13px}
  /* phones: image + name + price, two compact invitations per row */
  .cards{grid-template-columns:repeat(2,minmax(0,1fr));gap:12px;margin-top:18px}
  .card{padding:8px 8px 12px;border-radius:14px}
  .card-plate{aspect-ratio:1/1;border-radius:10px}
  .plate-bg img{padding:8px 14px}
  .card-kind,.card-rate,.card-link,.badge,.heart{display:none}
  .card-name{font:600 14px/18px Inter,sans-serif;letter-spacing:-.004em;margin-top:8px}
  .card-foot{margin-top:8px;padding-top:0}
  .card-price{font:600 14px/17px Inter,sans-serif}
  .chip{height:42px;padding:0 18px;font-size:13.5px;white-space:nowrap}
  .filter-row{flex-wrap:wrap;gap:12px;margin-top:18px}
  .chips{flex-wrap:wrap;gap:10px;width:100%}
  .count{order:3;margin-left:0;width:auto}
  .sortwrap{order:2;margin-left:auto}
  .sort{height:42px;padding:0 18px;font-size:13.5px}
  .hero{min-height:430px;padding:24px 22px;gap:18px;border-radius:22px}
  .hero-m{display:none}
  .hero-h{font-size:30px;line-height:38px}
  .hero-art{right:-130px;bottom:-70px;width:340px;height:360px}
  .hero-phone-back{height:310px;left:0;top:22px}
  .hero-phone-front{height:355px;right:0;top:-8px}
  .eyebrow{font-size:11px}
  .sec-h{font-size:23px;line-height:29px;margin-top:34px}
  .hero-h{font-size:32px;line-height:40px}
  .page-h{font-size:32px;line-height:40px}
  .buy-h{font-size:32px;line-height:40px}
  .done-h{font-size:27px;line-height:34px}
  .btn-add{width:100%;min-width:0}
  .qty-row{flex-direction:column;align-items:stretch}
  .stepper{width:100%;justify-content:space-between}
  .also-card{grid-template-columns:1fr}
  .also-plate{width:100%;height:180px}
  .bag-prod{gap:16px}
  .bag-thumb{width:96px;height:96px}
  .bag-card{padding:20px 18px 24px;border-radius:18px}
  .bag-row{padding-top:16px}
  .bag-save,.bag-remove{margin-top:16px}
  .bag-total{display:none}
  .bag-inline-total{display:block}
  .bag-qty{align-items:flex-start;padding-top:12px}
  .stepper.sm{width:132px}
  .bag-remove{margin-top:12px}
  .also-plate{height:auto}
  .also-card{grid-template-columns:110px minmax(0,1fr);gap:14px;padding:12px}
  .also-plate{width:110px;height:130px}
  .co-card{padding:22px 18px 26px}
  .pay-tab{height:50px;padding:0 20px;font-size:13px}
  .deliv{padding:14px 16px}
  .back{font-size:12.5px}
  .page-h{font-size:29px;line-height:36px}
  .done-h{font-size:25px;line-height:32px}
  .done-hero{padding:20px 20px 24px}
  .done-tick{left:20px;top:20px;width:38px;height:38px;border-radius:19px}
  .done-l{padding-top:50px}
  .summary,.order-card,.track-card,.info-card,.way-card,.help-card,.benefit{border-radius:18px}
  .co-card{padding:22px 20px 26px}
  .summary,.order-card,.track-card,.info-card,.way-card,.help-card{padding:22px 20px}
  .tabpanel,.tab-p{font-size:13.5px}
}

@media (max-width:960px){
  .home{padding:20px 28px 0}
  .hero-home{min-height:620px;align-items:flex-start;padding:36px 30px}
  .hero-home:after{font-size:130px;right:22px;top:34px}
  .hero-home .hero-l{width:min(100%,580px);padding-left:0;padding-top:18px}
  .hero-home .hero-h{font-size:52px;line-height:58px}
  .hero-home .hero-art{right:-115px;top:auto;bottom:-90px;width:500px;height:500px}
  .hero-home .hero-phone-back{height:430px;left:20px;top:30px}
  .hero-home .hero-phone-front{height:490px;right:0;top:-8px}
  .home-intro{padding:72px 0 56px;gap:32px}
  .home-intro-h{font-size:42px;line-height:48px}
  .home-moment.full{width:calc(100% + 56px);margin-left:-28px}
  .home-moment{min-height:420px;grid-template-columns:1fr}
  .home-moment-copy,.home-copy-right{grid-column:1;padding:44px 30px;max-width:560px}
  .home-moment-h{font-size:38px;line-height:44px}
  .home-art-left{left:-100px;bottom:-120px;width:300px}
  .home-art-left img{height:470px}
  .home-art-right{right:-110px;bottom:-120px;width:300px}
  .home-art-right img{height:470px}
  .home-art-pair{left:-80px;bottom:-110px;width:420px;height:450px;opacity:.8}
  .home-art-pair img{height:440px}
  .home-values{grid-template-columns:repeat(2,minmax(0,1fr))}
  .home-close{min-height:340px;padding:56px 30px;gap:32px}
  .home-close h2{font-size:44px;line-height:50px}
}
@media (max-width:640px){
  .home{padding:16px 18px 0}
  body.is-home{overflow-x:hidden}
  .hero-home{min-height:560px;padding:28px 22px;border-radius:22px}
  .hero-home:after{font-size:86px;right:14px;top:28px}
  .hero-home .hero-l{width:100%;padding-top:12px}
  .hero-home .hero-h{font-size:40px;line-height:46px;letter-spacing:-.035em}
  .hero-home .hero-p{font-size:15px;line-height:22px;max-width:330px;margin-top:18px}
  .hero-home .btn-dark{margin-top:20px}
  .hero-home .hero-art{right:-145px;bottom:-90px;width:390px;height:420px}
  .hero-home .hero-phone-back{height:365px;left:10px;top:28px}
  .hero-home .hero-phone-front{height:415px;right:0;top:-8px}
  .home-intro{padding:58px 0 44px;display:block}
  .home-intro-h{font-size:34px;line-height:40px}
  .home-intro-p{font-size:14px;line-height:22px}
  .home-intro-index{display:none}
  .home-moment.full{width:calc(100% + 36px);margin-left:-18px}
  .home-moment{min-height:440px}
  .home-moment-copy,.home-copy-right{padding:34px 22px}
  .home-moment-h{font-size:32px;line-height:38px}
  .home-moment-p{font-size:14px;line-height:22px;max-width:330px}
  .home-link{margin-top:26px}
  .home-art-left{left:-130px;bottom:-120px;width:250px}
  .home-art-left img{height:400px}
  .home-art-right{right:-130px;bottom:-120px;width:250px}
  .home-art-right img{height:400px}
  .home-art-pair{left:-150px;bottom:-120px;width:360px;height:400px;opacity:.55}
  .home-art-pair img{height:390px}
  .home-values{grid-template-columns:1fr}
  .home-value{min-height:150px;padding:30px 24px 34px}
  .home-close{min-height:420px;flex-direction:column;align-items:flex-start;justify-content:center;padding:48px 22px;border-radius:24px 24px 0 0}
  .home-close h2{font-size:36px;line-height:42px}
  .home-close p:last-child{font-size:14px;line-height:21px}
  .home-close-cta{height:52px;padding:0 26px}
}

@media (prefers-reduced-motion:reduce){
  *{animation:none!important;transition:none!important}
  html{scroll-behavior:auto}
}
`;

/* ── client bundle ─────────────────────────────────────────────────────── */
/* Everything the browser needs: precomputed images, the catalogue, the small
   helpers, and the view functions themselves (shipped as source). Built with
   concatenation, never a template literal, so their `${}` survives intact. */

const PICS = {};
for (const n of ['iphone-16-pro-front.webp','iphone-15-blue-back.webp','iphone-14-pro-purple.webp','iphone-13-midnight.webp']) {
  PICS[n] = img(n);
}

/* Everything the views read, minus the build-time paths (img() resolves those
   from the embedded PICS map instead). */
const KEEP = ['id','name','short','kind','cat','price','rate','reviews','tag','colors','plate','art','thumb','blurb','body','meta','hook','note','gallery','hero','crop','foot','secHead','bens','revs','specs','tile'];
const CATALOGUE = PRODUCTS.map((p) =>
  KEEP.reduce((o, k) => (p[k] === undefined ? o : Object.assign(o, { [k]: p[k] })), {}));

/* Arrow functions stringify as "(args) => ...", which is not a statement on its
   own. Re-attach the declaration so the bundle parses. */
const named = (name, fn) => 'const ' + name + ' = ' + fn.toString() + ';';

const HELPERS = [
  'const PRODUCTS = ' + JSON.stringify(CATALOGUE) + ';',
  'const PICS = ' + JSON.stringify(PICS) + ';',
  'const money = (n) => "$" + n.toFixed(2);',
  'const byId = (id) => PRODUCTS.find((p) => p.id === id);',
  'const img = (n) => PICS[n] || "";',
  named('art', art),
  named('plate', plate),
  named('heartSvg', heartSvg),
  named('card', card),
  named('fld', fld),
  named('heroBand', heroBand),
  named('home', home),
  named('shop', shop),
  named('product', product),
  named('bag', bag),
  named('checkout', checkout),
  named('confirmed', confirmed),
  named('account', account),
  named('orderDetail', orderDetail),
  named('help', help),
  'const VIEWS = { home, shop, product, bag, checkout, confirmed, account, order: orderDetail, help };',
].join('\n');

const RUNTIME = String.raw`
const initialParts = location.hash.replace(/^#\/?/, '').split('/');
const initialRoute = initialParts[0] === 'orders' ? 'order' : initialParts[0];
const initialArg = initialParts[1] || null;
const initialProduct = byId(initialArg) || PRODUCTS[0];
let expectedHash = location.hash || '#/home';

const store = {
  route: VIEWS[initialRoute] ? initialRoute : 'home', arg: null,
  cart: [], favs: [], orders: [],
  cat: initialRoute === 'shop' && initialArg && !['all', 'store'].includes(initialArg) ? initialArg : 'all',
  sort: 'featured', query: '',
  product: initialProduct, qty: 1, color: initialProduct.colors[0], tab: 'overview',
  promo: '', promoMsg: '', discount: 0,
  form: {
    email: 'alex.morgan@example.com',
    first: 'Alex', last: 'Morgan',
    street: 'Kepler Street 14', city: 'Rotterdam',
    postal: '3011 AA', country: 'Netherlands',
    card: '•••• •••• •••• 4242', exp: '08 / 29', cvc: '•••',
  },
  viewOrder: null,
};

try {
  const saved = JSON.parse(localStorage.getItem('volta.state') || 'null');
  if (saved) {
    if (Array.isArray(saved.cart)) store.cart = saved.cart;
    if (Array.isArray(saved.favs)) store.favs = saved.favs;
    if (Array.isArray(saved.orders)) store.orders = saved.orders;
    if (saved.form) Object.assign(store.form, saved.form);
  }
} catch (e) {}

const persist = () => {
  try {
    localStorage.setItem('volta.state', JSON.stringify({
      cart: store.cart, favs: store.favs, orders: store.orders, form: store.form,
    }));
  } catch (e) {}
};

const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));

const SORTS = {
  featured: { label: 'Featured', fn: (a, b) => PRODUCTS.findIndex((p) => p.id === a.id) - PRODUCTS.findIndex((p) => p.id === b.id) },
  low: { label: 'Price: low to high', fn: (a, b) => a.price - b.price },
  high: { label: 'Price: high to low', fn: (a, b) => b.price - a.price },
  rating: { label: 'Top rated', fn: (a, b) => parseFloat(b.rate) - parseFloat(a.rate) },
};

function results() {
  let list = PRODUCTS.slice();
  if (store.cat !== 'all') list = list.filter((p) => p.cat.toLowerCase() === store.cat.toLowerCase());
  if (store.query) {
    const q = store.query.toLowerCase();
    list = list.filter((p) => (p.name + ' ' + p.kind + ' ' + p.cat + ' ' + p.tag).toLowerCase().includes(q));
  }
  list.sort(SORTS[store.sort].fn);
  return list;
}

const count = () => store.cart.reduce((n, l) => n + l.qty, 0);

let toastTimer;
function toast(msg, linkLabel, linkRoute) {
  const el = $('#toast');
  el.innerHTML = msg + (linkLabel ? ' <a data-toast-go="' + linkRoute + '">' + linkLabel + '</a>' : '');
  el.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => el.classList.remove('show'), 4200);
}

function renderFavs() {
  $$('[data-fav]').forEach((b) => b.classList.toggle('is-on', store.favs.includes(b.dataset.fav)));
}

function paint() {
  const view = VIEWS[store.route] || VIEWS.shop;
  const state = Object.assign({}, store, {
    results: results(),
    sortLabel: SORTS[store.sort].label,
    order: store.viewOrder || store.orders[0] || null,
  });
  $('#app').innerHTML = view(state);
  document.body.classList.toggle('is-home', store.route === 'home');

  const catLabel = store.cat === 'all'
    ? 'Shop'
    : store.cat.charAt(0).toUpperCase() + store.cat.slice(1);
  const active = store.route === 'home'
    ? ''
    : store.route === 'shop'
      ? catLabel
      : (store.route === 'product' ? store.product.cat : 'Shop');
  $$('.nav-i').forEach((a) => a.classList.toggle('is-current', a.dataset.nav === active));

  $$('[data-bagcount]').forEach((el) => {
    el.textContent = el.classList.contains('hdr-n') ? String(count()) : 'Bag (' + count() + ')';
  });
  renderFavs();

  const si = $('.search input');
  if (si && document.activeElement !== si) si.value = store.query;
}

function setStoreRoute(route, arg) {
  store.route = route;
  store.arg = arg || null;
  if (route === 'shop') {
    store.cat = !arg || arg === 'all' || arg === 'store' ? 'all' : arg;
  }
  if (route === 'product') {
    const p = byId(arg) || PRODUCTS[0];
    store.product = p; store.qty = 1; store.color = p.colors[0]; store.tab = 'overview';
  }
  if (route === 'account') store.viewOrder = null;
}

function routeHash(route, arg) {
  const key = route === 'order' ? 'orders' : route;
  if (route === 'product') return '#/product/' + (store.product ? store.product.id : arg || '');
  if (route === 'shop' && arg && !['all', 'store'].includes(arg)) return '#/shop/' + arg;
  return '#/' + key;
}

function go(route, arg) {
  setStoreRoute(route, arg);
  const hash = routeHash(route, arg);
  expectedHash = hash;
  if (location.hash !== hash) location.hash = hash;
  paint();
  window.scrollTo(0, 0);
}

window.addEventListener('hashchange', () => {
  if (location.hash === expectedHash) return;
  expectedHash = location.hash;
  const parts = location.hash.replace(/^#\/?/, '').split('/');
  const route = parts[0] === 'orders' ? 'order' : parts[0];
  if (!VIEWS[route]) return;
  setStoreRoute(route, parts[1] || null);
  paint();
  window.scrollTo(0, 0);
});

document.addEventListener('click', (e) => {
  const t = e.target.closest('[data-go],[data-filter],[data-sort],[data-sortby],[data-clear],[data-qty],[data-add],[data-color],[data-remove],[data-save],[data-line-qty],[data-fav],[data-tab],[data-apply],[data-view],[data-receipt],[data-toast-go]');
  if (!t) {
    if (!e.target.closest('.sortwrap')) { const m = $('[data-sortmenu]'); if (m) m.hidden = true; }
    return;
  }
  const d = t.dataset;

  if (d.toastGo) { go(d.toastGo); return; }
  if (d.go) { go(d.go, d.arg); return; }
  if (d.filter) { store.cat = d.filter; paint(); return; }
  if (t.hasAttribute('data-clear')) { store.query = ''; store.cat = 'all'; paint(); return; }
  if (t.hasAttribute('data-sort')) { const m = $('[data-sortmenu]'); if (m) m.hidden = !m.hidden; return; }
  if (d.sortby) { store.sort = d.sortby; paint(); return; }
  if (d.qty) { store.qty = Math.max(1, Math.min(9, store.qty + Number(d.qty))); paint(); return; }
  if (d.color) { store.color = d.color; paint(); return; }
  if (d.tab) { store.tab = d.tab; paint(); return; }
  if (d.add) {
    const p = byId(d.add);
    const line = store.cart.find((l) => l.id === p.id && l.color === store.color);
    if (line) line.qty = Math.min(9, line.qty + store.qty);
    else store.cart.push({ id: p.id, qty: store.qty, color: store.color });
    persist(); paint();
    const pill = $('.bag-pill');
    if (pill) { pill.classList.add('pop'); setTimeout(() => pill.classList.remove('pop'), 340); }
    toast(p.name + ' added to your bag.', 'View bag', 'bag');
    return;
  }
  if (d.remove) { store.cart = store.cart.filter((l) => l.id !== d.remove); persist(); paint(); return; }
  if (d.save) {
    const p = byId(d.save);
    if (!store.favs.includes(p.id)) store.favs = store.favs.concat(p.id);
    store.cart = store.cart.filter((l) => l.id !== d.save);
    persist(); paint();
    toast(p.name + ' saved for later.');
    return;
  }
  if (d.lineQty) {
    const line = store.cart.find((l) => l.id === d.lineQty);
    if (line) {
      line.qty += Number(d.d);
      if (line.qty < 1) store.cart = store.cart.filter((l) => l.id !== d.lineQty);
      if (line.qty > 9) line.qty = 9;
      persist(); paint();
    }
    return;
  }
  if (d.fav) {
    const id = d.fav;
    store.favs = store.favs.includes(id) ? store.favs.filter((x) => x !== id) : store.favs.concat(id);
    persist();
    t.classList.toggle('is-on', store.favs.includes(id));
    return;
  }
  if (t.hasAttribute('data-apply')) {
    const code = (store.promo || '').trim().toUpperCase();
    const sub = store.cart.reduce((n, l) => n + byId(l.id).price * l.qty, 0);
    if (code === 'VOLTA10') {
      store.discount = Math.round(sub * 10) / 100;
      store.promoMsg = 'VOLTA10 applied — 10% off.';
    } else if (!code) {
      store.discount = 0; store.promoMsg = '';
    } else {
      store.discount = 0; store.promoMsg = 'That code didn\u2019t work. Try VOLTA10.';
    }
    paint();
    return;
  }
  if (d.view) {
    store.viewOrder = store.orders.find((o) => o.id === d.view) || store.orders[0];
    store.route = 'order'; paint(); window.scrollTo(0, 0); return;
  }
  if (t.hasAttribute('data-receipt')) { toast('Receipt sent to ' + store.form.email + '.'); return; }
});

document.addEventListener('input', (e) => {
  if (e.target.matches('[data-search] input')) {
    store.query = e.target.value.trim();
    if (store.route !== 'shop') {
      expectedHash = '#/shop';
      store.route = 'shop';
      if (location.hash !== expectedHash) location.hash = expectedHash;
    }
    const pos = e.target.selectionStart;
    paint();
    const again = $('.search input');
    if (again) { again.focus(); try { again.setSelectionRange(pos, pos); } catch (err) {} }
    return;
  }
  if (e.target.closest('[data-checkout]') && e.target.name) {
    store.form[e.target.name] = e.target.value;
    persist();
  }
  if (e.target.matches('[data-promo]')) store.promo = e.target.value;
});

document.addEventListener('submit', (e) => {
  if (e.target.matches('[data-search]')) {
    e.preventDefault();
    const i = $('.search input');
    if (i) { store.query = i.value.trim(); go('shop', store.cat); }
    return;
  }
  if (!e.target.matches('[data-checkout]')) return;
  e.preventDefault();
  const f = store.form;
  const bad = [];
  if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(f.email)) bad.push('email');
  if (!f.first.trim()) bad.push('first');
  if (!f.last.trim()) bad.push('last');
  if (!f.street.trim()) bad.push('street');
  if (!f.city.trim()) bad.push('city');

  const err = $('[data-err]');
  $$('.fld-i').forEach((i) => i.classList.remove('err'));

  if (bad.length) {
    bad.forEach((n) => { const el = $('.fld-i[name="' + n + '"]'); if (el) el.classList.add('err'); });
    if (err) {
      err.hidden = false;
      err.textContent = 'Check the highlighted fields — we need them to deliver your order.';
    }
    const first = $('.fld-i.err');
    if (first) first.focus();
    return;
  }
  if (!store.cart.length) { go('bag'); return; }

  const subtotal = store.cart.reduce((n, l) => n + byId(l.id).price * l.qty, 0);
  const total = Math.round((subtotal - store.discount) * 100) / 100;
  const digits = (f.card || '').replace(/\D/g, '');

  const order = {
    id: 'VX-' + (88217 + store.orders.length),
    date: 'NOV 26, 2026',
    status: 'Confirmed',
    first: f.first, last: f.last, email: f.email,
    street: f.street, city: f.city, postal: f.postal, country: f.country,
    last4: digits.slice(-4) || '4242',
    lines: store.cart.slice(),
    subtotal: subtotal, discount: store.discount, total: total,
  };

  store.orders.unshift(order);
  store.cart = [];
  store.discount = 0; store.promo = ''; store.promoMsg = '';
  persist();
  store.route = 'confirmed';
  paint();
  window.scrollTo(0, 0);
});

document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') { const m = $('[data-sortmenu]'); if (m) m.hidden = true; }
});

if (!store.orders.length) {
  store.orders = [{
    id: 'VX-47102', date: 'OCT 14, 2026', status: 'Delivered',
    first: 'Alex', last: 'Morgan', email: 'alex.morgan@example.com',
    street: 'Kepler Street 14', city: 'Rotterdam', postal: '3011 AA', country: 'Netherlands',
    last4: '4242',
    lines: [{ id: 'iphone-15', qty: 1, color: 'Blue' }],
    subtotal: 799, discount: 0, total: 799,
  }];
}

paint();
`;

const SHELL = [
  '<!DOCTYPE html>',
  '<html lang="en">',
  '<head>',
  '<meta charset="utf-8">',
  '<meta name="viewport" content="width=device-width, initial-scale=1">',
  '<meta name="description" content="VOLTA — an interactive, iPhone-only storefront mockup.">',
  '<title>VOLTA — good tech, better everyday</title>',
  '<style>',
  [400, 500, 600, 700].map((w) => font(w, `inter-latin-${w}-normal.woff2`)).join('\n'),
  CSS,
  '</style>',
  '</head>',
  '<body>',
  chrome(),
  '<div id="app"></div>',
  footer(),
  '<div class="toast" id="toast" role="status" aria-live="polite"></div>',
  '<script>',
  HELPERS,
  RUNTIME,
  '</' + 'script>',
  '</body>',
  '</html>',
].join('\n');

fs.writeFileSync(path.join(ROOT, 'index.html'), SHELL);
console.log(`index.html — ${(fs.statSync(path.join(ROOT, 'index.html')).size / 1024).toFixed(0)} KB`);
