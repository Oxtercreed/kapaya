// Brand, hero, dash, header and behavioural assertions across the whole store.
const { launch, APP } = require('./lib.cjs');

(async () => {
  const b = await launch({ defaultViewport: { width: 1440, height: 1000 } });
  const p = await b.newPage();
  const errs = []; p.on('pageerror', (e) => errs.push(e.message));
  await p.goto(APP, { waitUntil: 'networkidle0' });
  await p.evaluate(() => localStorage.clear());
  await p.reload({ waitUntil: 'networkidle0' });
  await new Promise((r) => setTimeout(r, 300));


  // 0. Kapaya brand identity is present, with no old placeholder brand visible.
  const brand = await p.evaluate(() => ({
    title: document.title,
    logo: !!document.querySelector('.mark .brand-logo'),
    footerLogo: !!document.querySelector('.ftr-mark .brand-logo'),
    favicon: (document.querySelector('link[rel="icon"]')?.getAttribute('href') || '').startsWith('data:image/svg+xml'),
    oldVisible: /VOLTA/i.test(document.body.innerText),
  }));
  if (!brand.title.startsWith('Kapaya') || !brand.logo || !brand.footerLogo || !brand.favicon || brand.oldVisible) {
    throw new Error('brand identity assertion failed: ' + JSON.stringify(brand));
  }
  console.log('brand:', brand.title, '| logo:', brand.logo, '| footer logo:', brand.footerLogo, '| favicon:', brand.favicon, '| old visible:', brand.oldVisible);

  // 0b. Hero keeps left-hand copy and artwork only; the right information column is gone.
  const hero = await p.evaluate(() => {
    const band = document.querySelector('.hero');
    return {
      left: !!band?.querySelector('.hero-l .hero-h'),
      art: !!band?.querySelector('.hero-art'),
      right: band?.querySelectorAll('.hero-m').length || 0,
      oldCopy: /THE COLLECTION|Every generation,|From \$599|Curated iPhones/.test(band?.innerText || ''),
    };
  });
  if (!hero.left || !hero.art || hero.right || hero.oldCopy) {
    throw new Error('hero cleanup assertion failed: ' + JSON.stringify(hero));
  }
  console.log('hero: left copy:', hero.left, '| artwork:', hero.art, '| right info:', hero.right, '| old copy:', hero.oldCopy);

  // 0c. No em dash remains anywhere in the rendered document.
  const dash = await p.evaluate(() => ({
    title: /\u2014/.test(document.title),
    body: /\u2014/.test(document.body.innerText),
    html: /\u2014/.test(document.documentElement.outerHTML),
  }));
  if (dash.title || dash.body || dash.html) {
    throw new Error('em dash assertion failed: ' + JSON.stringify(dash));
  }
  console.log('em dash removed:', !dash.title && !dash.body && !dash.html);

  // 1. landing opens first with the luxury editorial chrome and full-bleed architecture.
  const landing = await p.evaluate(() => {
    const h = getComputedStyle(document.querySelector('.hdr'));
    const fullBleed = ['.hero-home', '#the-edit', '#finishes', '#generations', '.home-close'].every((sel) => {
      const el = document.querySelector(sel);
      const r = el.getBoundingClientRect();
      const c = getComputedStyle(el);
      return Math.abs(r.left) < 1 && Math.abs(r.width - innerWidth) < 1 && parseFloat(c.borderTopLeftRadius) === 0;
    });
    const art = document.querySelector('.hero-home .hero-art');
    const phone = document.querySelector('.hero-home .hero-phone');
    return {
      home: !!document.querySelector('.home'),
      sharedFooterHidden: getComputedStyle(document.querySelector('.ftr')).display === 'none',
      logo: !!document.querySelector('.hdr .mark .brand-logo'),
      cta: document.querySelector('.home-shop-pill')?.textContent.trim(),
      ctaVisible: getComputedStyle(document.querySelector('.home-shop-pill')).display !== 'none',
      chromeHidden: ['.hdr-tools', '.hdr-row'].every((sel) => getComputedStyle(document.querySelector(sel)).display === 'none'),
      visibleHeaderChildren: Array.from(document.querySelectorAll('.hdr > *'))
        .filter((el) => getComputedStyle(el).display !== 'none').length,
      nav: Array.from(document.querySelectorAll('.home-nav a')).map((a) => a.textContent.trim()),
      announcementDivider: getComputedStyle(document.querySelector('.band-div')).display !== 'none',
      frosted: h.position === 'sticky' && /blur\(12px\)/.test(h.backdropFilter || h.webkitBackdropFilter || '') && h.backgroundColor.startsWith('rgba'),
      hairline: parseFloat(h.borderBottomWidth) === 1,
      fullBleed,
      heroDepth: {
        glow: /radial-gradient/.test(getComputedStyle(art, '::before').backgroundImage),
        shadows: (getComputedStyle(phone).filter.match(/drop-shadow/g) || []).length,
      },
      valueIcons: document.querySelectorAll('.home-value-ico').length,
      warranty: document.querySelector('.home-value:nth-child(2) h3')?.textContent.trim(),
      oldTrustCopy: /Clean presentation/.test(document.body.innerText),
      homeFooter: !!document.querySelector('.home-ftr'),
      footerLinks: Array.from(document.querySelectorAll('.home-ftr-col a')).map((a) => a.textContent.trim()),
      payments: Array.from(document.querySelectorAll('.pay-method')).map((el) => el.getAttribute('aria-label')),
      copyright: document.querySelector('.home-ftr-bottom')?.textContent.includes('© 2026 Kapaya'),
    };
  });
  const navOk = JSON.stringify(landing.nav) === JSON.stringify(['The Edit', 'Finishes', 'Generations', 'Why Kapaya']);
  const footerOk = JSON.stringify(landing.footerLinks) === JSON.stringify(['Shop', 'Warranty', 'Returns', 'Contact']);
  const paymentsOk = JSON.stringify(landing.payments) === JSON.stringify(['Apple Pay', 'Visa', 'Mastercard']);
  if (!landing.home || !landing.sharedFooterHidden || !landing.logo || landing.cta !== 'Start shopping' || !landing.ctaVisible || !landing.chromeHidden || landing.visibleHeaderChildren !== 3 || !navOk || !landing.announcementDivider || !landing.frosted || !landing.hairline || !landing.fullBleed || !landing.heroDepth.glow || landing.heroDepth.shadows < 3 || landing.valueIcons !== 4 || landing.warranty !== '12-Month Warranty' || landing.oldTrustCopy || !landing.homeFooter || !footerOk || !paymentsOk || !landing.copyright) {
    throw new Error('luxury landing assertion failed: ' + JSON.stringify(landing));
  }
  console.log('landing opens first:', landing.home, '| frosted sticky nav:', landing.frosted, '| centred links:', landing.nav.length, '| CTA:', landing.cta);
  console.log('full-bleed sections:', landing.fullBleed, '| hero glow:', landing.heroDepth.glow, '| ambient shadows:', landing.heroDepth.shadows);
  console.log('trust icons:', landing.valueIcons, '| warranty:', landing.warranty, '| brand footer:', landing.homeFooter);

  const initialHash = await p.evaluate(() => location.hash);
  await p.click('.home-nav a[data-scroll="finishes"]');
  await new Promise((r) => setTimeout(r, 1100));
  const navScroll = await p.evaluate(() => ({
    hash: location.hash,
    home: !!document.querySelector('.home'),
    targetTop: Math.round(document.querySelector('#finishes').getBoundingClientRect().top),
    headerHeight: document.querySelector('.hdr').offsetHeight,
    y: Math.round(scrollY),
  }));
  if (navScroll.hash !== initialHash || !navScroll.home || navScroll.y < 100 || Math.abs(navScroll.targetTop - navScroll.headerHeight) > 3) {
    throw new Error('landing anchor scroll assertion failed: ' + JSON.stringify({ initialHash, ...navScroll }));
  }
  console.log('anchor smooth-scroll:', navScroll.y > 100, '| target offset:', navScroll.targetTop, '| route unchanged:', navScroll.hash === initialHash);

  await p.click('.home-shop-pill');
  await new Promise((r) => setTimeout(r, 250));
  console.log('header CTA reaches catalogue:', !!(await p.$('.cards')));
  const shopHeader = await p.evaluate(() => ({
    full: getComputedStyle(document.querySelector('.hdr-row')).display !== 'none',
    homeCtaHidden: getComputedStyle(document.querySelector('.home-shop-pill')).display === 'none',
    homeNavHidden: getComputedStyle(document.querySelector('.home-nav')).display === 'none',
  }));
  if (!shopHeader.full || !shopHeader.homeCtaHidden || !shopHeader.homeNavHidden) {
    throw new Error('shop header restoration assertion failed: ' + JSON.stringify(shopHeader));
  }
  console.log('shop header restored:', shopHeader.full, '| home CTA hidden:', shopHeader.homeCtaHidden, '| home nav hidden:', shopHeader.homeNavHidden);

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
  await p.type('.search input', '16');
  await new Promise((r) => setTimeout(r, 250));
  console.log('search cards:', await p.$$eval('.card', (e) => e.length), '| focused:', await p.evaluate(() => document.activeElement.matches('.search input')));

  // 5. nav filter
  await p.evaluate(() => { document.querySelector('.search input').value = ''; });
  await p.click('[data-clear]');
  await new Promise((r) => setTimeout(r, 200));
  await p.click('.nav-i[data-arg="pro"]');
  await new Promise((r) => setTimeout(r, 200));
  console.log('pro count:', await p.$eval('.count', (e) => e.textContent));

  // 6. checkout validation
  await p.evaluate(() => {
    localStorage.setItem('kapaya.state', JSON.stringify({ cart: [{ id: 'iphone-16-pro', qty: 1, color: 'Natural Titanium' }], favs: [], orders: [] }));
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
  await p.type('.fld-i[name="email"]', 'alex@kapaya.example');
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
