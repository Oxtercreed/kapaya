#!/usr/bin/env python3
"""Builds docs/mockup/index.html — a self-contained design deck (images inlined)."""
import base64
import pathlib

ROOT = pathlib.Path(__file__).resolve().parents[2]
SHOTS = ROOT / 'docs' / 'mockup' / 'shots'
OUT = ROOT / 'docs' / 'mockup' / 'index.html'


def b64(name):
    return base64.b64encode((SHOTS / name).read_bytes()).decode()


DESKTOP = [
    ('desktop-splash.jpg', 'Loading', 'The opening animation — wordmark, hairline, progress rule'),
    ('desktop-login.jpg', 'Login', 'Split screen: product theatre on the left, sign-in on the right'),
    ('deck-01-home.jpg', 'Home', 'Full-bleed hero, category tiles, product rail, brand statement'),
    ('deck-02-shop.jpg', 'Shop', 'Category tabs, faceted filters, four-up product grid'),
    ('deck-03-product.jpg', 'Product details', 'Gallery, colourway, price, add to bag, spec list'),
    ('deck-04-cart.jpg', 'Shopping bag', 'Line items, free-shipping meter, order summary'),
    ('deck-05-checkout.jpg', 'Checkout', 'Three steps, saved address, sticky summary'),
    ('deck-06-confirm.jpg', 'Order confirmed', 'Tracking rail, item recap, next-step actions'),
    ('deck-07-account.jpg', 'Account', 'Orders, saved pieces, addresses, account details'),
    ('deck-08-chat.jpg', 'Chat', 'Conversation with the studio, quick replies'),
]

MOBILE = [
    ('mobile-login.jpg', '01 · Login', 'Sign in, socials, guest path'),
    ('mobile-home.jpg', '02 · Home', 'Hero, categories, products'),
    ('mobile-shop.jpg', '03 · Shop', 'Filters, two-up grid'),
    ('mobile-product.jpg', '04 · Product', 'Gallery, options, buy bar'),
    ('mobile-cart.jpg', '05 · Bag', 'Lines, promo, summary'),
    ('mobile-checkout.jpg', '06 · Checkout', 'Steps, address, payment'),
    ('mobile-confirm.jpg', '07 · Confirmed', 'Tracking rail, recap'),
    ('mobile-account.jpg', '08 · Account', 'Orders, addresses, details'),
    ('mobile-chat.jpg', '09 · Chat', 'Message the studio'),
]

TOKENS = [
    ('Field', '#F8F8FC'), ('Ink', '#14171E'), ('Body', '#656976'),
    ('Accent', '#7155E8'), ('Feature', '#EAE4FC'), ('Promo ink', '#493987'),
    ('Hairline', '#E5E3EC'),
]

TYPE = [
    ('Wordmark 28/700', 28, 700, 'VOLTA', '-.045em'),
    ('Section 28/600', 28, 600, 'Shop by category', '-.035em'),
    ('Product 40/600', 40, 600, 'Aurora Buds Pro', '-.04em'),
    ('Price 32/600', 32, 600, '$189.00', '-.03em'),
    ('Card name 17/600', 17, 600, 'Vertex H9 Headphones', '0'),
    ('Nav 15/400', 15, 400, 'Shop · Collections · Journal · Our makers', '0'),
]


def frame(i, name, title, desc):
    return f'''      <figure class="frame">
        <header><span class="frame__n">{i:02d}</span><h3>{title}</h3><p>{desc}</p></header>
        <div class="frame__shot"><img src="data:image/jpeg;base64,{b64(name)}" alt="{title}"></div>
      </figure>'''


def phone(name, title, desc):
    return f'''      <figure class="phone">
        <div class="phone__screen"><img src="data:image/jpeg;base64,{b64(name)}" alt="{title}"></div>
        <figcaption><b>{title}</b><span>{desc}</span></figcaption>
      </figure>'''


tokens_html = '\n'.join(
    f'''      <div class="tok"><div class="tok__sw" style="background:{hexv}"></div>
        <div class="tok__in"><b>{label}</b><span>{hexv}</span></div></div>'''
    for label, hexv in TOKENS
)

type_html = '\n'.join(
    f'''        <div class="type"><span class="type__spec">{spec}</span>
          <span style="font-size:{size}px;font-weight:{w};letter-spacing:{ls}">{sample}</span></div>'''
    for spec, size, w, sample, ls in TYPE
)

type_html += '''
        <div class="type" style="border:0;padding:0"><span class="type__spec">Micro 11/500</span>
          <span style="font-size:11px;font-weight:500;letter-spacing:.12em;text-transform:uppercase;color:var(--faint)">Free shipping over $100</span></div>'''

frames_html = '\n'.join(frame(i, *d) for i, d in enumerate(DESKTOP))
phones_html = '\n'.join(phone(*m) for m in MOBILE)

HTML = f'''<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>VOLTA — storefront design</title>
<style>
  *,*::before,*::after{{box-sizing:border-box}}
  :root{{
    --field:#F8F8FC; --ink:#14171E; --body:#656976; --faint:#8A8E9C;
    --violet:#7155E8; --violet-2:#5A41CC; --feature:#EAE4FC; --promo:#EDE8FD; --promo-ink:#493987;
    --line:#E5E3EC; --r:28px;
  }}
  html{{scroll-behavior:smooth}}
  body{{
    margin:0; background:var(--field); color:var(--ink);
    font-family:"Inter",-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Helvetica,Arial,sans-serif;
    -webkit-font-smoothing:antialiased; font-size:16px; line-height:1.55;
  }}
  img{{display:block; max-width:100%}}
  .wrap{{width:min(1240px, calc(100% - 64px)); margin:0 auto}}
  .eyebrow{{font-size:11px; font-weight:500; letter-spacing:.16em; text-transform:uppercase;
    color:var(--faint); display:inline-flex; align-items:center; gap:8px}}
  .eyebrow::before{{content:""; width:5px; height:5px; border-radius:50%; background:var(--violet)}}
  h1,h2,h3{{margin:0; font-weight:600; line-height:1.04; letter-spacing:-.035em}}

  .cover{{padding:52px 0 0}}
  .cover__top{{display:flex; align-items:center; justify-content:space-between; gap:24px;
    padding-bottom:26px; border-bottom:1px solid var(--line)}}
  .wordmark{{font-size:26px; font-weight:700; letter-spacing:-.045em; display:inline-flex;
    align-items:baseline; gap:5px}}
  .wordmark i{{width:6px; height:6px; border-radius:50%; background:var(--violet);
    display:inline-block; transform:translateY(-1px)}}
  .cover__meta{{font-size:11.5px; letter-spacing:.12em; text-transform:uppercase; color:var(--faint)}}
  .cover h1{{font-size:clamp(42px,7.4vw,100px); margin:42px 0 0; letter-spacing:-.05em; line-height:.95}}
  .cover h1 em{{font-style:normal; color:var(--violet)}}
  .cover__lede{{max-width:620px; margin:24px 0 0; font-size:17px; color:var(--body); line-height:1.62}}
  .chips{{display:flex; flex-wrap:wrap; gap:8px; margin-top:28px}}
  .chip{{padding:8px 14px; border-radius:999px; background:#fff; border:1px solid var(--line);
    font-size:12.5px; font-weight:500; color:var(--ink)}}
  .chip--v{{background:var(--violet); border-color:var(--violet); color:#fff}}

  section{{padding:clamp(56px,7vw,100px) 0}}
  .sec-head{{display:flex; align-items:flex-end; justify-content:space-between; gap:32px;
    flex-wrap:wrap; margin-bottom:34px}}
  .sec-head h2{{font-size:clamp(28px,3.4vw,44px); margin-top:12px}}
  .sec-head p{{margin:0; max-width:430px; font-size:14.5px; color:var(--body)}}

  .tokens{{display:grid; grid-template-columns:repeat(auto-fit,minmax(120px,1fr)); gap:12px}}
  .tok{{border-radius:18px; overflow:hidden; background:#fff; border:1px solid var(--line)}}
  .tok__sw{{height:74px}}
  .tok__in{{padding:11px 13px}}
  .tok__in b{{display:block; font-size:12px; font-weight:600}}
  .tok__in span{{font-size:11px; color:var(--faint); font-variant-numeric:tabular-nums}}

  .typescale{{display:grid; gap:14px; margin-top:36px}}
  .type{{display:flex; align-items:baseline; gap:20px; padding-bottom:14px;
    border-bottom:1px solid var(--line)}}
  .type__spec{{flex:0 0 132px; font-size:11px; letter-spacing:.08em; text-transform:uppercase;
    color:var(--faint)}}

  .phones{{background:#fff; border-radius:var(--r)}}
  .phone-row{{display:grid; grid-template-columns:repeat(3,1fr); gap:28px}}
  @media (max-width:900px){{.phone-row{{grid-template-columns:repeat(2,1fr)}}}}
  @media (max-width:560px){{.phone-row{{grid-template-columns:1fr}}}}
  .phone{{margin:0; display:flex; flex-direction:column; gap:14px}}
  .phone__screen{{border-radius:30px; overflow:hidden; border:1px solid var(--line);
    background:var(--field); box-shadow:0 26px 60px -40px rgba(20,23,30,.35)}}
  .phone__screen img{{width:100%; height:auto}}
  .phone__screen{{aspect-ratio:390/798; display:flex; align-items:flex-start}}
  .phone__screen img{{width:100%; height:100%; object-fit:cover; object-position:top}}
  .phone figcaption{{display:grid; gap:2px; padding-left:4px}}
  .phone figcaption b{{font-size:13.5px; font-weight:600}}
  .phone figcaption span{{font-size:12px; color:var(--faint)}}

  .frame{{margin:0 0 40px}}
  .frame header{{display:flex; align-items:baseline; gap:16px; flex-wrap:wrap; margin-bottom:14px}}
  .frame__n{{font-size:11px; font-weight:600; color:var(--violet); letter-spacing:.1em}}
  .frame h3{{font-size:19px; letter-spacing:-.02em}}
  .frame header p{{margin:0; font-size:13px; color:var(--faint); flex:1 1 320px}}
  .frame__shot{{border-radius:22px; overflow:hidden; border:1px solid var(--line); background:#fff;
    box-shadow:0 34px 80px -56px rgba(20,23,30,.5)}}
  .frame__shot img{{width:100%}}

  .ask{{background:var(--promo); border-radius:var(--r); padding:clamp(28px,4vw,52px)}}
  .ask h2{{color:var(--ink); font-size:clamp(24px,3vw,34px); max-width:640px}}
  .ask .eyebrow{{color:var(--promo-ink)}}
  .ask ul{{list-style:none; padding:0; margin:24px 0 0; display:grid; gap:14px; max-width:720px}}
  .ask li{{display:flex; gap:12px; font-size:15px; line-height:1.55; color:#3C2E6E}}
  .ask li::before{{content:""; flex:0 0 18px; height:18px; margin-top:3px; border-radius:50%;
    background:var(--violet); box-shadow:inset 0 0 0 4px var(--promo)}}

  footer{{padding:36px 0 64px; border-top:1px solid var(--line); display:flex;
    justify-content:space-between; gap:20px; flex-wrap:wrap; font-size:12px; color:var(--faint)}}
</style>
</head>
<body>

<div class="cover">
  <div class="wrap">
    <div class="cover__top">
      <span class="wordmark">VOLTA<i></i></span>
      <span class="cover__meta">Storefront design · 2026 · Dar es Salaam</span>
    </div>
    <h1>Good tech.<br><em>Better everyday.</em></h1>
    <p class="cover__lede">
      A high-fidelity design for an everyday-tech storefront — one calm violet-and-white system
      across ten desktop screens, drawn desktop-first from the Figma file and extended down to
      the phone.
    </p>
    <div class="chips">
      <span class="chip chip--v">10 desktop screens</span>
      <span class="chip">9 phone screens</span>
      <span class="chip">Desktop 1440</span>
      <span class="chip">Mobile 390</span>
      <span class="chip">Indigo + lavender</span>
      <span class="chip">Inter</span>
    </div>
  </div>
</div>

<section>
  <div class="wrap">
    <div class="sec-head">
      <div>
        <span class="eyebrow">Foundations</span>
        <h2>The system behind the screens</h2>
      </div>
      <p>All of it comes from the Figma frames: a near-white field, one ink, one accent, three
         tints and a hairline. No second accent, no shadow heavier than a hint.</p>
    </div>

    <div class="tokens">
{tokens_html}
    </div>

    <div class="typescale">
{type_html}
    </div>
  </div>
</section>

<section>
  <div class="wrap">
    <div class="sec-head">
      <div>
        <span class="eyebrow">Desktop · 1440</span>
        <h2>The screens</h2>
      </div>
      <p>Flow: loading → login → home → shop → product → bag → checkout → confirmation,
         with account and chat one tap away from anywhere in the header.</p>
    </div>
{frames_html}
  </div>
</section>

<section class="phones">
  <div class="wrap">
    <div class="sec-head">
      <div>
        <span class="eyebrow">Mobile · 390</span>
        <h2>The same brand, thumb-first</h2>
      </div>
      <p>The Figma file only defines desktop, so every phone layout is an extension: two-up
         product grid, stacked summaries, a bottom tab bar and a sticky buy button.</p>
    </div>
    <div class="phone-row">
{phones_html}
    </div>
  </div>
</section>

<section>
  <div class="wrap">
    <div class="ask">
      <span class="eyebrow">Hand-off</span>
      <h2 style="margin-top:12px">What I'd add to the Figma file next</h2>
      <ul>
        <li>Seven more frames — home, shop filters, product on mobile, account, chat, login and the loading animation — so the file covers every screen in this deck.</li>
        <li>A component sheet: buttons, inputs, pills, product card, order-status chip, tracker rail, toast.</li>
        <li>Empty, loading and out-of-stock states for shop, bag and checkout.</li>
        <li>Accessibility pass: focus rings, 4.5:1 contrast on the violet-on-white pairings, 44 px tap targets.</li>
      </ul>
    </div>
  </div>
</section>

<footer class="wrap">
  <span>VOLTA — Good tech. Better everyday.</span>
  <span>Design deck · drawn at 1440 and 390</span>
</footer>

</body>
</html>
'''

OUT.write_text(HTML)
print(f'wrote {OUT} — {len(HTML) / 1048576:.2f} MB')
