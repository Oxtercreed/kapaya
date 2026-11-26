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

  await shot('01-shop');
  await overflowing('shop');

  await p.evaluate(() => document.querySelector('.cards .card-plate, .card-plate').click());
  await new Promise((r) => setTimeout(r, 300));
  await shot('02-product');
  await overflowing('product');

  await p.evaluate(() => {
    localStorage.setItem('volta.state', JSON.stringify({ cart: [{ id: 'aurora', qty: 1, color: 'Silver' }, { id: 'vertex', qty: 1, color: 'Midnight' }], favs: [], orders: [] }));
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
