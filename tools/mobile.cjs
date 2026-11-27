// 390x844 @2x walk through every screen: shots + horizontal-overflow check.
const { launch, APP, OUT } = require('./lib.cjs');
const path = require('path');
const fs = require('fs');

(async () => {
  fs.mkdirSync(OUT, { recursive: true });
  const b = await launch({ defaultViewport: { width: 390, height: 844, deviceScaleFactor: 2 } });
  const p = await b.newPage();
  const errs = []; p.on('pageerror', (e) => errs.push(e.message));
  await p.goto(APP, { waitUntil: 'networkidle0' });
  await p.evaluate(() => localStorage.clear());
  await p.reload({ waitUntil: 'networkidle0' });
  await p.evaluate(() => document.fonts.ready);
  await new Promise((r) => setTimeout(r, 350));
  const shot = (n) => p.screenshot({ path: path.join(OUT, `m-${n}.png`) });
  const overflowing = async (label) => {
    const w = await p.evaluate(() => ({ doc: document.documentElement.scrollWidth, win: innerWidth }));
    if (w.doc > w.win + 1) console.log('OVERFLOW', label, w.doc, '>', w.win);
  };

  // First load is the landing page. It has no footer and its CTA opens the shop.
  await shot('00-home');
  await overflowing('home');
  const landing = await p.evaluate(() => ({
    home: !!document.querySelector('.home'),
    footerHidden: getComputedStyle(document.querySelector('.ftr')).display === 'none',
  }));
  console.log('landing opens first:', landing.home, '| footer hidden:', landing.footerHidden);
  await p.click('.home [data-go="shop"]');
  await new Promise((r) => setTimeout(r, 300));

  await shot('01-shop');
  await overflowing('shop');
  const heroClean = await p.evaluate(() => ({
    left: !!document.querySelector('.hero-l .hero-h'),
    art: !!document.querySelector('.hero-art'),
    right: document.querySelectorAll('.hero .hero-m').length,
  }));
  if (!heroClean.left || !heroClean.art || heroClean.right) {
    throw new Error('mobile hero cleanup assertion failed: ' + JSON.stringify(heroClean));
  }
  console.log('hero left-only:', !heroClean.right, '| left copy:', heroClean.left, '| artwork:', heroClean.art);
  const cardState = await p.evaluate(() => {
    const card = document.querySelector('.card');
    const cards = document.querySelector('.cards');
    const hidden = ['.card-link', '.heart', '.card-kind', '.card-rate', '.badge']
      .every((sel) => getComputedStyle(document.querySelector(sel)).display === 'none');
    return {
      height: Math.round(card.getBoundingClientRect().height),
      columns: getComputedStyle(cards).gridTemplateColumns.split(' ').length,
      trimmed: hidden,
    };
  });
  console.log('mobile cards:', cardState.height + 'px', '| columns:', cardState.columns, '| trimmed:', cardState.trimmed);

  await p.evaluate(() => document.querySelector('.cards .card-plate, .card-plate').click());
  await new Promise((r) => setTimeout(r, 300));
  await shot('02-product');
  await overflowing('product');

  await p.evaluate(() => {
    localStorage.setItem('kapaya.state', JSON.stringify({ cart: [{ id: 'iphone-16-pro', qty: 1, color: 'Natural Titanium' }, { id: 'iphone-15', qty: 1, color: 'Blue' }], favs: [], orders: [] }));
  });
  await p.reload({ waitUntil: 'networkidle0' });
  await new Promise((r) => setTimeout(r, 300));
  await shot('03-shop-filled');
  await p.evaluate(() => document.querySelector('.bag-pill').click());
  await new Promise((r) => setTimeout(r, 300));
  await shot('04-bag');
  await overflowing('bag');

  await p.evaluate(() => document.querySelector('[data-go="checkout"]').click());
  await new Promise((r) => setTimeout(r, 300));
  await shot('05-checkout');
  await overflowing('checkout');
  await p.evaluate(() => document.querySelector('.btn-pay').click());
  await new Promise((r) => setTimeout(r, 400));
  await shot('06-confirmed');
  await overflowing('confirmed');

  await p.evaluate(() => document.querySelector('.orders')?.click() || document.querySelector('.hdr-ico').click());
  await new Promise((r) => setTimeout(r, 300));
  await shot('07-account');
  await overflowing('account');
  await p.evaluate(() => document.querySelector('[data-view]').click());
  await new Promise((r) => setTimeout(r, 300));
  await shot('08-order');
  await overflowing('order');
  await p.evaluate(() => document.querySelector('.ftr-l').click());
  await new Promise((r) => setTimeout(r, 300));
  await shot('09-help');
  await overflowing('help');

  console.log('errors:', errs.length ? errs.join(' | ') : 'none');
  await b.close();
})();
