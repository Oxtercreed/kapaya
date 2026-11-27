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
    sharedFooterHidden: getComputedStyle(document.querySelector('.ftr')).display === 'none',
    homeFooter: !!document.querySelector('.home-ftr'),
    logo: !!document.querySelector('.hdr .mark .brand-logo'),
    cta: document.querySelector('.home-shop-pill')?.textContent.trim(),
    ctaVisible: getComputedStyle(document.querySelector('.home-shop-pill')).display !== 'none',
    chromeHidden: ['.hdr-tools', '.hdr-row'].every((sel) => getComputedStyle(document.querySelector(sel)).display === 'none'),
    visibleHeaderChildren: Array.from(document.querySelectorAll('.hdr > *'))
      .filter((el) => getComputedStyle(el).display !== 'none').length,
    nav: Array.from(document.querySelectorAll('.home-nav a')).map((a) => a.textContent.trim()),
    announcementDivider: getComputedStyle(document.querySelector('.band-div')).display !== 'none',
    valueColumns: getComputedStyle(document.querySelector('.home-values')).gridTemplateColumns.split(' ').length,
  }));
  const navOk = JSON.stringify(landing.nav) === JSON.stringify(['The Edit', 'Finishes', 'Generations', 'Why Kapaya']);
  if (!landing.home || !landing.sharedFooterHidden || !landing.homeFooter || !landing.logo || landing.cta !== 'Start shopping' || !landing.ctaVisible || !landing.chromeHidden || landing.visibleHeaderChildren !== 3 || !navOk || !landing.announcementDivider || landing.valueColumns !== 2) {
    throw new Error('mobile landing header assertion failed: ' + JSON.stringify(landing));
  }
  console.log('landing opens first:', landing.home, '| brand footer:', landing.homeFooter, '| centred links:', landing.nav.length, '| CTA:', landing.cta);

  const mobileLayout = await p.evaluate(() => {
    const h = getComputedStyle(document.querySelector('.hdr'));
    const nav = getComputedStyle(document.querySelector('.home-nav'));
    const navLink = getComputedStyle(document.querySelector('.home-nav a'));
    const sections = ['#the-edit', '#finishes', '#generations'].map((sel) => {
      const sec = document.querySelector(sel);
      const copy = sec.querySelector('.home-moment-copy');
      const art = sec.querySelector('.home-moment-art');
      const cs = getComputedStyle(sec);
      const as = getComputedStyle(art);
      const sr = sec.getBoundingClientRect();
      const cr = copy.getBoundingClientRect();
      const ar = art.getBoundingClientRect();
      const imgs = Array.from(art.querySelectorAll('img'));
      return {
        display: cs.display,
        direction: cs.flexDirection,
        minHeight: parseFloat(cs.minHeight),
        padding: [cs.paddingTop, cs.paddingRight, cs.paddingBottom, cs.paddingLeft].map(parseFloat),
        copyOrder: Number(getComputedStyle(copy).order),
        artOrder: Number(getComputedStyle(art).order),
        artPosition: as.position,
        artWidth: ar.width,
        artMaxWidth: parseFloat(as.maxWidth),
        noOverlap: ar.top >= cr.bottom - 1,
        imagesInSection: imgs.every((img) => {
          const r = img.getBoundingClientRect();
          return r.left >= sr.left - 1 && r.right <= sr.right + 1 && r.top >= sr.top - 1 && r.bottom <= sr.bottom + 1;
        }),
        imagesInViewport: imgs.every((img) => {
          const r = img.getBoundingClientRect();
          return r.left >= -1 && r.right <= innerWidth + 1;
        }),
        noTransforms: imgs.every((img) => getComputedStyle(img).transform === 'none'),
      };
    });
    const hero = document.querySelector('.hero-home');
    const cta = hero.querySelector('.btn-dark');
    const art = hero.querySelector('.hero-art');
    const hs = getComputedStyle(hero);
    const hr = hero.getBoundingClientRect();
    const cr = cta.getBoundingClientRect();
    const ar = art.getBoundingClientRect();
    const phones = Array.from(art.querySelectorAll('img'));
    return {
      header: {
        sticky: h.position === 'sticky',
        padding: [h.paddingTop, h.paddingBottom].map(parseFloat),
        navPadding: [nav.paddingTop, nav.paddingBottom].map(parseFloat),
        navFont: parseFloat(navLink.fontSize),
      },
      sections,
      hero: {
        direction: hs.flexDirection,
        minHeight: parseFloat(hs.minHeight),
        artPosition: getComputedStyle(art).position,
        artWidth: ar.width,
        belowCta: ar.top >= cr.bottom - 1,
        centered: Math.abs((ar.left + ar.right) / 2 - (hr.left + hr.right) / 2) <= 2,
        phonesInViewport: phones.every((img) => {
          const r = img.getBoundingClientRect();
          return r.left >= -1 && r.right <= innerWidth + 1;
        }),
        noTransforms: phones.every((img) => getComputedStyle(img).transform === 'none'),
        watermarkFont: parseFloat(getComputedStyle(hero, '::after').fontSize),
      },
      noOverflow: document.documentElement.scrollWidth <= innerWidth + 1,
    };
  });
  const compactChrome = mobileLayout.header.sticky && mobileLayout.header.padding.every((n) => n === 10) && mobileLayout.header.navPadding.every((n) => n === 6) && mobileLayout.header.navFont === 12;
  const stackedSections = mobileLayout.sections.every((s) => s.display === 'flex' && s.direction === 'column' && s.minHeight === 0 && s.padding.every((n, i) => n === (i % 2 ? 24 : 56)) && s.copyOrder === 1 && s.artOrder === 2 && s.artPosition === 'relative' && s.artWidth <= 320 && s.artMaxWidth === 320 && s.noOverlap && s.imagesInSection && s.imagesInViewport && s.noTransforms);
  const heroOk = mobileLayout.hero.direction === 'column' && mobileLayout.hero.minHeight === 0 && mobileLayout.hero.artPosition === 'relative' && mobileLayout.hero.artWidth <= 320 && mobileLayout.hero.belowCta && mobileLayout.hero.centered && mobileLayout.hero.phonesInViewport && mobileLayout.hero.noTransforms && mobileLayout.hero.watermarkFont <= 64;
  if (!compactChrome || !stackedSections || !heroOk || !mobileLayout.noOverflow) {
    throw new Error('mobile responsive layout assertion failed: ' + JSON.stringify(mobileLayout));
  }
  console.log('mobile stack:', stackedSections, '| compact chrome:', compactChrome, '| uncropped hero:', heroOk, '| no overflow:', mobileLayout.noOverflow);

  await p.click('.home-shop-pill');
  await new Promise((r) => setTimeout(r, 300));
  const shopHeader = await p.evaluate(() => ({
    full: getComputedStyle(document.querySelector('.hdr-row')).display !== 'none',
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
