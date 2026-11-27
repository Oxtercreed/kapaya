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

  // First load is the landing page, with its own brand footer and a working shop CTA.
  await shot('00-home');
  await overflowing('home');
  const landing = await p.evaluate(() => ({
    home: !!document.querySelector('.home'),
    toggle: getComputedStyle(document.querySelector('.mobile-menu-button')).display !== 'none',
    navHidden: getComputedStyle(document.querySelector('.home-nav')).display === 'none',
    desktopCtaHidden: getComputedStyle(document.querySelector('.home-shop-pill')).display === 'none',
    chromeHidden: ['.hdr-tools', '.hdr-row'].every((sel) => getComputedStyle(document.querySelector(sel)).display === 'none'),
    sticky: getComputedStyle(document.querySelector('.hdr')).position === 'sticky',
    sections: ['#the-edit', '#finishes', '#generations'].every((sel) => {
      const section = document.querySelector(sel), art = section.querySelector('.home-moment-art');
      const background = getComputedStyle(section).backgroundImage;
      return getComputedStyle(art).display === 'none' && background.includes('linear-gradient') && background.includes('data:image/webp');
    }),
    heroScene: getComputedStyle(document.querySelector('.hero-home')).backgroundImage.includes('data:image/webp') && getComputedStyle(document.querySelector('.hero-home')).backgroundImage.includes('linear-gradient') && getComputedStyle(document.querySelector('.hero-home .hero-art')).display === 'none',
    noOverflow: document.documentElement.scrollWidth <= innerWidth + 1,
  }));
  if (Object.values(landing).some((v) => !v)) throw new Error('mobile landing failed: ' + JSON.stringify(landing));
  await p.click('.mobile-menu-button');
  const menu = await p.evaluate(() => ({
    expanded: document.querySelector('.mobile-menu-button').getAttribute('aria-expanded') === 'true',
    links: Array.from(document.querySelectorAll('.mobile-home-links a[data-scroll]')).map((a) => a.textContent.trim()),
    cta: getComputedStyle(document.querySelector('.mobile-menu-cta')).display !== 'none',
  }));
  if (!menu.expanded || !menu.cta || JSON.stringify(menu.links) !== JSON.stringify(['The Edit', 'Finishes', 'Generations', 'Why Kapaya'])) throw new Error('mobile menu failed: ' + JSON.stringify(menu));
  await p.keyboard.press('Escape');
  if (await p.$eval('.mobile-menu-button', (el) => el.getAttribute('aria-expanded')) !== 'false') throw new Error('Escape did not close menu');
  await p.click('.mobile-menu-button');
  await p.click('.mobile-home-links a[data-scroll="finishes"]');
  if (await p.$eval('.mobile-menu-button', (el) => el.getAttribute('aria-expanded')) !== 'false') throw new Error('navigation did not close menu');
  await p.click('.mobile-menu-button');
  await p.click('.mobile-menu-cta');
  await new Promise((r) => setTimeout(r, 300));
  console.log('mobile menu, editorial scenes, and no overflow:', true);

  const shopHeader = await p.evaluate(() => ({
    full: getComputedStyle(document.querySelector('.mobile-chrome')).display !== 'none' && getComputedStyle(document.querySelector('.mobile-bottom')).position === 'fixed',
    homeCtaHidden: getComputedStyle(document.querySelector('.home-shop-pill')).display === 'none',
  }));
  if (!shopHeader.full || !shopHeader.homeCtaHidden) {
    throw new Error('mobile shop header restoration assertion failed: ' + JSON.stringify(shopHeader));
  }
  console.log('shop header restored:', shopHeader.full, '| home CTA hidden:', shopHeader.homeCtaHidden);

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
      .every((sel) => getComputedStyle(document.querySelector(sel)).display !== 'none');
    return {
      height: Math.round(card.getBoundingClientRect().height),
      columns: getComputedStyle(cards).gridTemplateColumns.split(' ').length,
      complete: hidden,
    };
  });
  if (cardState.columns !== 2 || !cardState.complete) throw new Error('mobile cards failed: ' + JSON.stringify(cardState));
  console.log('mobile cards:', cardState.height + 'px', '| columns:', cardState.columns, '| full details:', cardState.complete);

  await p.click('.mobile-search-button');
  await p.type('.mobile-search input', '14');
  await p.keyboard.press('Enter');
  if (await p.$$eval('.card', (els) => els.length) !== 1) throw new Error('mobile search failed');
  await p.click('.mobile-bottom [data-mobile-route="shop"]');
  await p.$eval('.card .heart', (el) => el.scrollIntoView({block:'center',behavior:'instant'}));
  await new Promise((r) => setTimeout(r, 150));
  await p.click('.card .heart');
  if (!await p.$eval('.card .heart', (el) => el.classList.contains('is-on'))) throw new Error('mobile favourite failed');
  for (const width of [320, 390, 767]) {
    await p.setViewport({ width, height: 844, deviceScaleFactor: 1 });
    const layout = await p.evaluate(() => ({
      fits: document.documentElement.scrollWidth <= innerWidth + 1,
      dock: getComputedStyle(document.querySelector('.mobile-bottom')).position === 'fixed',
      header: getComputedStyle(document.querySelector('.mobile-chrome')).display !== 'none',
      buttons: Array.from(document.querySelectorAll('.shop-page .card-foot')).every((el) => el.scrollWidth <= el.clientWidth + 1),
    }));
    if (Object.values(layout).some((v) => !v)) throw new Error('mobile viewport ' + width + ': ' + JSON.stringify(layout));
  }
  await p.setViewport({ width: 390, height: 844, deviceScaleFactor: 2 });
  console.log('mobile search, favourites and viewport sizes verified');

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
  await p.click('.mobile-bag');
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

  await p.click('.mobile-bottom [data-mobile-route="account"]');
  await new Promise((r) => setTimeout(r, 300));
  await shot('07-account');
  await overflowing('account');
  await p.evaluate(() => document.querySelector('[data-view]').click());
  await new Promise((r) => setTimeout(r, 300));
  await shot('08-order');
  await overflowing('order');
  await p.evaluate(() => { location.hash = '#/help'; });
  await new Promise((r) => setTimeout(r, 300));
  await shot('09-help');
  await overflowing('help');

  console.log('errors:', errs.length ? errs.join(' | ') : 'none');
  await b.close();
})();
