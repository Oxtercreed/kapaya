// Render the five desktop screens at 1440x1200 and diff them against the
// Figma crops in docs/mockup/red/ref/.  Writes /tmp/red/fr-0N-*.png.
// Requires the app to be built: node docs/mockup/build.cjs
const { launch, APP, OUT } = require('./lib.cjs');
const path = require('path');
const fs = require('fs');

// The app opens on the editorial landing page; the measured store screens live
// behind the shop CTA at #/shop.
const SHOP = APP + '#/shop';

(async () => {
  fs.mkdirSync(OUT, { recursive: true });
  const b = await launch({ defaultViewport: { width: 1440, height: 1200, deviceScaleFactor: 1 } });
  const p = await b.newPage();
  const errs = []; p.on('pageerror', (e) => errs.push(e.message));
  const open = async () => {
    await p.goto(SHOP, { waitUntil: 'networkidle0' });
    await p.evaluate(() => localStorage.clear());
    await p.reload({ waitUntil: 'networkidle0' });
    await p.evaluate(() => document.fonts.ready);
    await new Promise((r) => setTimeout(r, 350));
  };
  const shot = (n) => p.screenshot({ path: path.join(OUT, `fr-${n}.png`) });

  await open();
  await shot('01-shop');

  await p.click('.card-plate');
  await new Promise((r) => setTimeout(r, 300));
  await shot('02-product');

  await p.evaluate(() => {
    localStorage.setItem('volta.state', JSON.stringify({ cart: [{ id: 'aurora', qty: 1, color: 'Silver' }], favs: [], orders: [] }));
  });
  await p.reload({ waitUntil: 'networkidle0' });
  await new Promise((r) => setTimeout(r, 300));
  await p.evaluate(() => document.querySelector('[data-bagcount]').click());
  await new Promise((r) => setTimeout(r, 300));
  await shot('03-bag');

  await p.click('[data-go="checkout"]');
  await new Promise((r) => setTimeout(r, 300));
  await shot('04-checkout');

  await p.click('.btn-pay');
  await new Promise((r) => setTimeout(r, 400));
  await shot('05-confirmed');

  console.log('errors:', errs.length ? errs.join(' | ') : 'none');
  await b.close();
})();
