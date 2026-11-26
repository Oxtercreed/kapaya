// Seven behavioural assertions across the whole store.
const { launch, APP } = require('./lib.cjs');

(async () => {
  const b = await launch({ defaultViewport: { width: 1440, height: 1000 } });
  const p = await b.newPage();
  const errs = []; p.on('pageerror', (e) => errs.push(e.message));
  await p.goto(APP, { waitUntil: 'networkidle0' });
  await p.evaluate(() => localStorage.clear());
  await p.reload({ waitUntil: 'networkidle0' });
  await new Promise((r) => setTimeout(r, 300));

  // 1. landing opens first, footerless, with a working shop CTA
  const landing = await p.evaluate(() => ({
    home: !!document.querySelector('.home'),
    footerHidden: getComputedStyle(document.querySelector('.ftr')).display === 'none',
  }));
  console.log('landing opens first:', landing.home, '| footer hidden:', landing.footerHidden);
  await p.click('.home [data-go="shop"]');
  await new Promise((r) => setTimeout(r, 250));
  console.log('shop CTA reaches catalogue:', !!(await p.$('.cards')));

  // 2. sort menu
  await p.click('[data-sort]');
  const open = await p.$eval('[data-sortmenu]', (e) => !e.hidden);
  await p.click('[data-sortby="low"]');
  const first = await p.$eval('.card-name', (e) => e.textContent);
  console.log('sort menu opens:', open, '| cheapest first:', first.trim());

  // 3. favourite persists across reload
  await p.click('.card .heart');
  await new Promise((r) => setTimeout(r, 150));
  await p.reload({ waitUntil: 'networkidle0' });
  await new Promise((r) => setTimeout(r, 300));
  console.log('fav survives reload:', await p.$$eval('.heart.is-on', (e) => e.length));

  // 4. search filters live and keeps focus
  await p.click('.search input');
  await p.type('.search input', 'watch');
  await new Promise((r) => setTimeout(r, 250));
  console.log('search cards:', await p.$$eval('.card', (e) => e.length), '| focused:', await p.evaluate(() => document.activeElement.matches('.search input')));

  // 5. nav filter
  await p.evaluate(() => { document.querySelector('.search input').value = ''; });
  await p.click('[data-clear]');
  await new Promise((r) => setTimeout(r, 200));
  await p.click('.nav-i[data-arg="wearables"]');
  await new Promise((r) => setTimeout(r, 200));
  console.log('wearables count:', await p.$eval('.count', (e) => e.textContent));

  // 6. checkout validation
  await p.evaluate(() => {
    localStorage.setItem('volta.state', JSON.stringify({ cart: [{ id: 'aurora', qty: 1, color: 'Silver' }], favs: [], orders: [] }));
  });
  await p.reload({ waitUntil: 'networkidle0' });
  await new Promise((r) => setTimeout(r, 250));
  await p.evaluate(() => document.querySelector('.bag-pill').click());
  await new Promise((r) => setTimeout(r, 250));
  await p.click('[data-go="checkout"]');
  await new Promise((r) => setTimeout(r, 250));
  await p.click('.fld-i[name="email"]');
  await p.keyboard.down('Control'); await p.keyboard.press('KeyA'); await p.keyboard.up('Control');
  await p.keyboard.press('Backspace');
  await p.click('.btn-pay');
  await new Promise((r) => setTimeout(r, 300));
  console.log('error shown:', await p.$eval('[data-err]', (e) => !e.hidden && e.textContent.slice(0, 28)));

  // 7. fix and pay
  await p.type('.fld-i[name="email"]', 'alex@volta.example');
  await p.click('.btn-pay');
  await new Promise((r) => setTimeout(r, 400));
  console.log('reached confirmed:', !!(await p.$('.done-hero')));

  // 8. back to shop
  await p.evaluate(() => { document.querySelector('.done-actions .btn-plain').click(); });
  await new Promise((r) => setTimeout(r, 250));
  console.log('back to shop:', await p.$eval('.hero-h', (e) => e.textContent.trim().slice(0, 12)));
  console.log('errors:', errs.length ? errs.join(' | ') : 'none');
  await b.close();
})();
