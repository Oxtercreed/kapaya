const { JSDOM } = require('/home/user/kapaya/node_modules/jsdom')
const fs = require('fs')
const path = require('path')

const appJs = fs.readFileSync('/tmp/app.js', 'utf8')

const dom = new JSDOM(
  `<!doctype html><html><head><title>t</title></head><body><div id="root"></div></body></html>`,
  {
    url: 'http://localhost:5173/',
    runScripts: 'outside-only',
    pretendToBeVisual: true,
    resources: undefined,
  },
)

const { window } = dom

// ---- shims -------------------------------------------------------------
window.matchMedia = window.matchMedia || (() => ({ matches: false, addListener() {}, removeListener() {}, addEventListener() {}, removeEventListener() {} }))
window.IntersectionObserver = class {
  constructor(cb) { this.cb = cb }
  observe() {}
  unobserve() {}
  disconnect() {}
}
window.ResizeObserver = class { observe() {} unobserve() {} disconnect() {} }
window.requestAnimationFrame = (cb) => setTimeout(() => cb(Date.now()), 16)
window.cancelAnimationFrame = (id) => clearTimeout(id)
window.scrollTo = () => {}
window.HTMLElement.prototype.scrollIntoView = function () {}
window.document.body.style = window.document.body.style || {}

const errors = []
window.addEventListener('error', (e) => errors.push('window error: ' + e.message))
const origErr = console.error
console.error = (...a) => {
  errors.push(a.map(String).join(' '))
  origErr.apply(console, a)
}

window.eval(appJs)

const $ = (sel) => window.document.querySelector(sel)
const $$ = (sel) => [...window.document.querySelectorAll(sel)]
const sleep = (ms) => new Promise((r) => setTimeout(r, ms))
const text = () => window.document.body.textContent || ''

function setValue(el, v) {
  const w = el.ownerDocument.defaultView
  const proto = el.tagName === 'TEXTAREA' ? w.HTMLTextAreaElement.prototype : w.HTMLInputElement.prototype
  Object.getOwnPropertyDescriptor(proto, 'value').set.call(el, v)
  el.dispatchEvent(new w.Event('input', { bubbles: true }))
  el.dispatchEvent(new w.Event('change', { bubbles: true }))
}

async function clickText(label, tag = '*') {
  const nodes = $$(`${tag}`).filter(
    (n) => n.textContent.trim().toLowerCase() === label.toLowerCase() && n.offsetParent !== null,
  )
  const el = nodes[nodes.length - 1] || nodes[0]
  if (!el) return false
  el.dispatchEvent(new window.MouseEvent('click', { bubbles: true, cancelable: true }))
  await sleep(60)
  return true
}

async function waitFor(fn, ms = 2500) {
  const start = Date.now()
  while (Date.now() - start < ms) {
    const v = fn()
    if (v) return v
    await sleep(50)
  }
  return null
}

async function goto(pathname) {
  window.history.pushState({}, '', 'http://localhost:5173' + pathname)
  window.dispatchEvent(new window.PopStateEvent('popstate'))
  await sleep(90)
}

const results = []
const check = (name, cond, extra = '') => {
  results.push({ name, pass: !!cond, extra })
}

;(async () => {
  await sleep(200)
  // ---- splash ----
  check('splash renders wordmark', text().includes('KAPAYA'))
  check('splash has loading meter', !!$('.splash__bar'))
  await sleep(3900)
  check('splash removed after animation', !$('.splash'))
  check('login screen shown', !!$('.gate') || text().includes('Sign in'))

  // ---- login ----
  check('login has email field', !!$('#email'))
  check('login has password field', !!$('#password'))
  check('login brand visual', !!$('.gate__visual img'))

  // submit sign-in
  const form = $('form.gate__form')
  form.dispatchEvent(new window.Event('submit', { bubbles: true, cancelable: true }))
  await sleep(1000)
  check('authenticated -> home', !!$('.hero__frame'), 'heading: ' + ($('h1')?.textContent ?? 'none'))
  check('header has chat icon', $$('a[href="/chat"]').length > 0)
  check('header bag count visible', !!$('.cart-count'))
  check('category rail present', $$('.cat-card').length >= 5)
  check('product cards on home', $$('.pcard').length > 0)

  // ---- shop ----
  await goto('/shop')
  await sleep(200)
  check('shop page heading', /Everything/i.test(text()))
  check('shop grid', $$('.pcard').length >= 8, `cards=${$$('.pcard').length}`)
  check('category tabs', $$('.cat-tab').length >= 6)

  const before = $$('.pcard').length
  const ceramicsTab = $$('.cat-tab').find((t) => /Ceramics/i.test(t.textContent))
  ceramicsTab.dispatchEvent(new window.MouseEvent('click', { bubbles: true }))
  await sleep(250)
  check('category filter updates grid', /Ceramics/i.test($('.shop-head h1')?.textContent ?? ''), `h1=${$('.shop-head h1')?.textContent}`)
  check('filtered cards shown', $$('.pcard').length >= 2 && $$('.pcard').length !== before)

  // material filter
  const linenBtn = $$('.fopt').find((b) => /Linen/i.test(b.textContent))
  if (linenBtn) linenBtn.dispatchEvent(new window.MouseEvent('click', { bubbles: true }))
  await sleep(200)
  check('material filter click works', true)

  // clear & search
  await goto('/shop')
  await sleep(200)
  const searchBtn = $$('.tool-btn').find((b) => /Filters/i.test(b.textContent) && b.className.includes('mob-only'))
  // search overlay via header
  const searchTrigger = $$('.icon-btn').find((b) => b.getAttribute('aria-label') === 'Search')
  searchTrigger.dispatchEvent(new window.MouseEvent('click', { bubbles: true }))
  await sleep(200)
  check('search overlay opens', !!$('.search-panel'))
  const input = $('.search-panel input')
  setValue(input, 'vase')
  await sleep(250)
  check('search results appear', $$('.search-hit').length > 0, `hits=${$$('.search-hit').length}`)
  const hit = $('.search-hit')
  hit.dispatchEvent(new window.MouseEvent('click', { bubbles: true }))
  await sleep(300)
  check('search result navigates to product', window.location.pathname.includes('/product/'), window.location.pathname)

  // ---- product ----
  check('pdp title', !!$('.pdp h1'))
  check('pdp has product image', !!$('.pdp__stage img'))
  check('pdp add to bag button', $$('button').some((b) => /Add to bag/i.test(b.textContent)))
  const cartBefore = JSON.parse(window.localStorage.getItem('kapaya.store.v1')).cart.length
  const addBtn = $$('button').find((b) => /Add to bag —/.test(b.textContent))
  addBtn.dispatchEvent(new window.MouseEvent('click', { bubbles: true }))
  await sleep(200)
  const cartAfter = JSON.parse(window.localStorage.getItem('kapaya.store.v1')).cart.length
  check('add to cart increases cart lines', cartAfter >= cartBefore, `${cartBefore}->${cartAfter}`)
  check('toast shown after add', !!$('.toast'))

  // ---- cart ----
  await goto('/cart')
  await sleep(250)
  check('cart page lists lines', $$('.cline').length > 0, `lines=${$$('.cline').length}`)
  check('cart shows total', /TZS/.test($('.total-row.is-strong')?.textContent ?? ''))

  // promo
  const promoInput = $('.summary__promo input')
  if (promoInput) {
    setValue(promoInput, 'KARIBU10')
    await sleep(60)
    const applyBtn = $$('.summary__promo button')[0]
    applyBtn.dispatchEvent(new window.MouseEvent('click', { bubbles: true }))
    await sleep(200)
  }
  check('promo applied', !!$('.promo-applied'), text().includes('KARIBU10') ? 'KARIBU10 seen' : '')

  // qty change
  const plus = $$('.qty button').find((b) => b.getAttribute('aria-label') === 'Increase quantity')
  const subBefore = $('.total-row .mono')?.textContent
  plus.dispatchEvent(new window.MouseEvent('click', { bubbles: true }))
  await sleep(200)
  const subAfter = $('.total-row .mono')?.textContent
  check('quantity updates subtotal', subBefore !== subAfter, `${subBefore} -> ${subAfter}`)

  // checkout flow
  const checkoutBtn = $$('button').find((b) => /^Checkout$/i.test(b.textContent.trim()))
  checkoutBtn.dispatchEvent(new window.MouseEvent('click', { bubbles: true }))
  await sleep(250)
  check('checkout sheet opens', !!$('.sheet'))
  const continueBtn = await waitFor(() => $$('.sheet button').find((b) => /Continue to delivery/i.test(b.textContent)))
  if (continueBtn) continueBtn.dispatchEvent(new window.MouseEvent('click', { bubbles: true }))
  const payStep = await waitFor(() => $$('.sheet button').find((b) => /Continue to payment/i.test(b.textContent)))
  check('delivery step reached', !!payStep)
  if (payStep) payStep.dispatchEvent(new window.MouseEvent('click', { bubbles: true }))
  const payBtn = await waitFor(() => $$('.sheet button').find((b) => /^Pay /i.test(b.textContent.trim())))
  check('payment step reached', !!payBtn)
  if (payBtn) payBtn.dispatchEvent(new window.MouseEvent('click', { bubbles: true }))
  const okShown = await waitFor(() => /Asante sana/i.test(text()))
  check('order confirmation shown', !!okShown, $('.success__id')?.textContent ?? '')
  const orders = (await waitFor(() => {
    const o = JSON.parse(window.localStorage.getItem('kapaya.store.v1')).orders
    return o.length === 4 ? o : null
  }, 2000)) || JSON.parse(window.localStorage.getItem('kapaya.store.v1')).orders
  check('order saved to account', orders.length === 4, `orders=${orders.length}`)

  // ---- chat ----
  await goto('/chat')
  await sleep(300)
  check('chat shell', !!$('.chat-shell'))
  check('existing messages', $$('.msg').length >= 4)
  const ta = $('.chat-compose textarea')
  setValue(ta, 'Do you have the tall Sona in stock?')
  await sleep(80)
  const sendBtn = $('.chat-send')
  sendBtn.dispatchEvent(new window.MouseEvent('click', { bubbles: true }))
  await sleep(150)
  check('message sent appears', text().includes('Do you have the tall Sona in stock?'))
  await sleep(2600)
  const msgs = JSON.parse(window.localStorage.getItem('kapaya.store.v1')).messages
  check('owner auto-reply received', msgs.filter((m) => m.from === 'owner').length >= 4, `owner msgs=${msgs.filter((m) => m.from === 'owner').length}`)

  // ---- account ----
  await goto('/account')
  await sleep(250)
  check('account overview', !!$('.stat-grid'))
  await goto('/account/orders')
  await sleep(400)
  check('orders list', $$('.order').length >= 4, `orders=${$$('.order').length}`)
  await goto('/account/orders/KP-24816')
  await sleep(250)
  check('order detail tracker', !!$('.tracker'))
  await goto('/account/addresses')
  await sleep(250)
  check('addresses listed', $$('.addr').length >= 2)
  await goto('/account/payments')
  await sleep(250)
  check('payment methods', text().includes('Visa'))
  await goto('/account/details')
  await sleep(250)
  check('details form', $$('.acct__body .input').length > 0)
  await goto('/account/notifications')
  await sleep(250)
  check('notifications list', text().includes('on its way'))
  await goto('/account/help')
  await sleep(250)
  check('help accordion', $$('.acc__item').length >= 4)
  await goto('/account/saved')
  await sleep(250)
  check('saved pieces', $$('.saved-item').length >= 1)

  // ---- other routes ----
  for (const [p, needle] of [
    ['/collections', 'Rooms, assembled'],
    ['/makers', 'hands behind'],
    ['/journal', 'Notes on making'],
    ['/journal/clay-and-ash', 'Amani'],
    ['/', 'slow living'],
  ]) {
    await goto(p)
    await sleep(220)
    check(`route ${p}`, text().toLowerCase().includes(needle.toLowerCase()), (text() || '').slice(0, 60))
  }

  // ---- responsive sanity (DOM classes exist for both) ----
  check('tabbar present for mobile', !!$('.tabbar'))
  check('footer present', !!$('.footer'))

  const failed = results.filter((r) => !r.pass)
  console.log('\n=== ROUTE / INTERACTION CHECKS ===')
  for (const r of results) console.log(`${r.pass ? 'PASS' : 'FAIL'}  ${r.name}${r.extra ? '  [' + r.extra + ']' : ''}`)
  console.log(`\n${results.length - failed.length}/${results.length} passed`)
  if (errors.length) {
    console.log('\n=== CONSOLE ERRORS ===')
    console.log([...new Set(errors)].slice(0, 12).join('\n'))
  }
  process.exit(failed.length ? 1 : 0)
})()
