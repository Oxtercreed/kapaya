import React, { useEffect } from 'react'
import { Link, useParams } from 'react-router-dom'
import { categories, products, journal, BRAND, byCategory } from '../data/catalog'
import { ProductCard, SectionHead, Empty } from '../components/ui'
import { IconArrowRight, IconCheck, IconLeaf, IconSparkle, IconArrowLeft } from '../components/Icons'

/* ============================================================
   Collections
   ============================================================ */
const COLLECTIONS = [
  {
    slug: 'commute',
    kicker: 'Collection 01',
    title: 'The commute kit',
    body: 'Aurora buds and the H9 over-ears, plus a cable that survives a bag. Everything you need for the 07:40 and the way home.',
    image: '/images/v-buds.jpg',
    category: 'audio',
  },
  {
    slug: 'desk',
    kicker: 'Collection 02',
    title: 'The quiet desk',
    body: 'A mat, a lamp, a mouse that does not click. The desk you stop noticing around the second week.',
    image: '/images/v-desk.jpg',
    category: 'desk',
  },
  {
    slug: 'wrist',
    kicker: 'Collection 03',
    title: 'On the wrist',
    body: 'The Pulse S2 and the Loop band: nine and fourteen days of battery, no subscription, no noise.',
    image: '/images/v-watch.jpg',
    category: 'wearables',
  },
  {
    slug: 'travel',
    kicker: 'Collection 04',
    title: 'Bag, packed',
    body: 'One charge pad, one braided cable, one speaker that goes on a bike frame. The kit that lives in your bag.',
    image: '/images/v-charger.jpg',
    category: 'power',
  },
]

export function Collections() {
  useEffect(() => {
    document.title = 'Collections · VOLTA'
  }, [])
  return (
    <div>
      <div className="shell">
        <div className="page-head">
          <p className="eyebrow">
            <span className="dot" /> Four ways in
          </p>
          <h1>Kit, assembled with intent.</h1>
          <p className="lede mt-16">
            We don’t do seasons. We build small collections around a single job — the commute, the desk, the
            wrist, the bag — and only add a product when it beats what we already ship.
          </p>
        </div>
      </div>

      <div className="shell">
        <div className="collection-stack">
          {COLLECTIONS.map((c, i) => (
            <article className="collection-card" key={c.slug} data-reveal style={{ '--d': `${i * 60}ms` }}>
              <div className="collection-card__img">
                <img src={c.image} alt={c.title} loading="lazy" />
              </div>
              <div className="collection-card__body">
                <p className="eyebrow">
                  <span className="dot" /> {c.kicker}
                </p>
                <h3>{c.title}</h3>
                <p className="lede" style={{ fontSize: 14 }}>
                  {c.body}
                </p>
                <div className="row gap-8 wrap" style={{ marginTop: 6 }}>
                  <Link to={`/shop?category=${c.category}`} className="btn btn--sm">
                    Shop {categories.find((x) => x.slug === c.category)?.name} <IconArrowRight size={14} />
                  </Link>
                  <span className="tiny-meta">{byCategory(c.category).length} products</span>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>

      <section className="section">
        <div className="shell">
          <SectionHead kicker="Everything" title="In stock right now" action={<Link to="/shop" className="link-arrow">Shop all <IconArrowRight size={15} /></Link>} />
          <div className="plp-grid">
            {products.slice(0, 8).map((p, i) => (
              <ProductCard key={p.slug} product={p} index={i} />
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}

/* ============================================================
   Makers
   ============================================================ */
const MAKERS = [
  {
    name: 'VOLTA Audio',
    studio: 'VOLTA Audio',
    place: 'Tuned in Dar es Salaam',
    craft: 'Audio · earbuds, headphones, speakers',
    image: '/images/v-headphones.jpg',
    body: 'Six weeks of field recordings — a bus engine, a market, an office fan — went into the Aurora and H9 tuning. Vocals sit forward, bass stays rounded, and nothing is boosted to sound impressive in a shop.',
    quote: 'Tune it for the room people actually sit in.',
    years: 'Since 2014',
  },
  {
    name: 'VOLTA Wear',
    studio: 'VOLTA Wear',
    place: 'Field tested in Kigali',
    craft: 'Wearables · watches and bands',
    image: '/images/v-watch.jpg',
    body: 'The brief for Pulse was nine days or it does not ship. That single constraint decided the screen — a dim always-on strip — and the fact that health data stays on the watch until you export it.',
    quote: 'Nine days is the number that makes people keep wearing it.',
    years: 'Since 2017',
  },
  {
    name: 'VOLTA Works',
    studio: 'VOLTA Works',
    place: 'Studio tested in Dar',
    craft: 'Desk · keyboards, mice, stands, lamps',
    image: '/images/v-desk.jpg',
    body: 'Everything on the desk is designed to be quiet: silent switches, a diffused lamp with no visible LED dots, a mat coarse enough for a sensor and soft enough to roll into a bag.',
    quote: 'If we can hear it across the room, it goes back.',
    years: 'Since 2012',
  },
  {
    name: 'VOLTA Power',
    studio: 'VOLTA Power',
    place: 'Designed in Dar es Salaam',
    craft: 'Power · pads, cables, adapters',
    image: '/images/v-charger.jpg',
    body: 'Orbit is heavy on purpose, and Strand puts a soft silicone boot exactly where every cable we owned used to fail — the ten millimetres behind the plug.',
    quote: 'The failure point is a design decision.',
    years: 'Since 2019',
  },
]

export function Makers() {
  useEffect(() => {
    document.title = 'About VOLTA'
  }, [])
  return (
    <div>
      <div className="shell">
        <div className="page-head">
          <p className="eyebrow">
            <span className="dot" /> Four teams, one standard
          </p>
          <h1>The teams behind every product.</h1>
          <p className="lede mt-16">
            VOLTA is a small hardware studio in Dar es Salaam. Four teams — Audio, Wear, Works and Power — design
            and test everything here, and nothing ships until they would all keep it themselves.
          </p>
        </div>
      </div>

      <div className="shell">
        {MAKERS.map((m, i) => (
          <section className="maker-row" key={m.name} data-reveal style={{ '--d': `${i * 50}ms` }}>
            <div className="maker-row__img">
              <img src={m.image} alt={m.name} loading="lazy" />
            </div>
            <div>
              <p className="eyebrow">
                <span className="dot" /> {m.craft}
              </p>
              <h3>{m.name}</h3>
              <p className="tiny-meta">
                {m.place} · {m.years}
              </p>
              <p className="lede" style={{ marginTop: 14 }}>
                {m.body}
              </p>
              <blockquote
                style={{
                  margin: '18px 0 0',
                  fontFamily: 'var(--font-display)',
                  fontSize: 18,
                  fontStyle: 'italic',
                  borderLeft: '2px solid var(--clay)',
                  paddingLeft: 16,
                  color: 'var(--ink-2)',
                }}
              >
                “{m.quote}”
              </blockquote>
              <Link to="/shop" className="link-arrow" style={{ alignSelf: 'flex-start', marginTop: 20 }}>
                Shop the range <IconArrowRight size={15} />
              </Link>
            </div>
          </section>
        ))}
      </div>

      <div className="shell">
        <div className="panel" style={{ marginTop: 40, background: 'var(--paper-3)', border: 0, padding: 'clamp(22px, 3vw, 36px)' }}>
          <div className="row between wrap gap-16">
            <div>
              <p className="eyebrow">
                <span className="dot" /> Our promises
              </p>
              <h2 style={{ fontSize: 'clamp(22px, 2.6vw, 32px)', marginTop: 8 }}>Two-year warranty. Thirty-day returns. No subscriptions.</h2>
            </div>
            <div className="tick-list" style={{ maxWidth: 360 }}>
              <li>
                <IconCheck size={15} /> Every product carries a two-year warranty.
              </li>
              <li>
                <IconCheck size={15} /> Returns are free for thirty days, opened or not.
              </li>
              <li>
                <IconCheck size={15} /> No subscription, no account required to use the hardware.
              </li>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

/* ============================================================
   Journal
   ============================================================ */
export function Journal() {
  useEffect(() => {
    document.title = 'Journal · VOLTA'
  }, [])
  return (
    <div>
      <div className="shell">
        <div className="page-head">
          <p className="eyebrow">
            <span className="dot" /> Journal
          </p>
          <h1>Notes on designing quiet tech.</h1>
          <p className="lede mt-16">
            How we tune, what we cut, and the arguments we had about a hinge. Unhurried writing from the people
            who design the products.
          </p>
        </div>
      </div>

      <div className="shell">
        <div className="collection-stack">
          {journal.map((j, i) => (
            <article className="collection-card" key={j.slug} data-reveal style={{ '--d': `${i * 60}ms` }}>
              <div className="collection-card__img">
                <img src={j.image} alt={j.title} loading="lazy" />
              </div>
              <div className="collection-card__body">
                <p className="eyebrow">
                  <span className="dot" /> {j.kicker} · {j.read}
                </p>
                <h3>{j.title}</h3>
                <p className="lede" style={{ fontSize: 14 }}>
                  {j.excerpt}
                </p>
                <Link to={`/journal/${j.slug}`} className="link-arrow" style={{ alignSelf: 'flex-start', marginTop: 8 }}>
                  Read the piece <IconArrowRight size={15} />
                </Link>
              </div>
            </article>
          ))}
        </div>
      </div>
    </div>
  )
}

const ARTICLES = {
  'quiet-desk': {
    kicker: 'Setup',
    title: 'The quiet desk: four things worth owning',
    read: '5 min read',
    image: '/images/v-desk.jpg',
    body: [
      'A desk is not a place you decorate. It is the surface you put your hands on for eight hours, and almost everything on it is noise you have stopped hearing. The goal is not fewer things. It is fewer things that ask for attention.',
      'Start with the surface itself. A woven mat does two jobs at once: it gives the mouse sensor something to read, and it takes the hard click out of the desk. Ours is 2 mm and coarse on purpose — fine weaves feel lovely and track badly.',
      'Then light. A lamp with visible LED dots is a lamp you will eventually hate, because the dots are exactly where your eye lands. Three layers of acrylic diffuser cost more than a plastic lens and remove the pattern completely. Warm to cool on a slider, not three preset buttons.',
      'Then the mouse. The quietest thing we ever shipped was not a speaker. It was a switch. Fortifying the click down to about 40 dB changes how a shared room feels at 7 pm, when someone is still working and someone else is reading.',
      'Last, the keyboard — and only if you type for a living. A gasket mount and a layer of silicone between plate and body is the difference between a typing sound with a ring to it and one without. Everything else about a keyboard is taste.',
    ],
    quote: 'A good desk disappears. A great one disappears and you never notice it left.',
  },
  'tuning-aurora': {
    kicker: 'Inside VOLTA',
    title: 'How we tune a bud against a bus engine',
    read: '4 min read',
    image: '/images/v-buds.jpg',
    body: [
      'Most earbuds are tuned on a test bench against a target curve. That is useful for comparing two products in a spreadsheet and almost useless for deciding whether you will enjoy the 07:40 commute.',
      'So we recorded one. Six weeks of field recordings from Dar — the Daladala engine note, a market at eleven, an office air-conditioner, a fan at three in the morning — and then we listened to prototypes against those recordings instead of pink noise.',
      'Two decisions came out of it. Vocals sit forward, because the thing you actually lose on a bus is the middle, not the bass. And the bass stays rounded rather than loud: a boosted low end reads as impressive for thirty seconds and as fatigue for the next hour.',
      'Cancellation was the harder argument. Aggressive ANC is easy to demonstrate and unpleasant to wear — the pressure some buds put on your ears is the algorithm fighting the room. We set it to remove the low rumble of air conditioning and left the rest alone.',
      'The result is a bud that does not win a demo. It wins the fourth hour, which is the only hour that matters.',
    ],
    quote: 'We tuned it so you stop noticing it before the second song.',
  },
  'nine-days': {
    kicker: 'Wearables',
    title: 'Why nine days is the number that matters',
    read: '6 min read',
    image: '/images/v-watch.jpg',
    body: [
      'A battery specification is not a number. It is a design decision that has already been made for you, and every other decision follows from it.',
      'Once we committed to nine days on the Pulse S2, the screen had to become a dim always-on strip rather than a bright panel that wakes. The processor had to sleep more than it ran. The health tracking had to sample on a schedule instead of continuously. Each of those looks like a compromise in a specification table.',
      'In the hand, they are the opposite. A watch you charge weekly is a watch you wear. A watch you charge nightly is a watch you leave in a drawer by Thursday, and no amount of animated rings will bring it back.',
      'Nine days also let us keep the data on the device. Continuous upload is what a short battery forces on you — if the watch has to survive a day, it must offload. With a week and a half, we could simply store it and export only when you ask.',
      'The trade-off is honest: no animated complications, no third-party app store, no cellular. Everyone who tested it for a month said the same thing, unprompted — they stopped checking their wrist in bed by the second week. We took that as the win.',
    ],
    quote: 'Nine days is not a spec. It is the reason the watch stays on your wrist.',
  },
}

export function Article() {
  const { slug } = useParams()
  const a = ARTICLES[slug]
  useEffect(() => {
    document.title = a ? `${a.title} · KAPAYA Journal` : 'Journal · KAPAYA'
  }, [a])

  if (!a)
    return (
      <div className="shell" style={{ paddingBlock: 70 }}>
        <Empty
          title="That story isn’t here"
          body="The journal is still being written. Have a look at what is published."
          action={<Link to="/journal" className="btn btn--sm" style={{ marginTop: 8 }}>All stories</Link>}
        />
      </div>
    )

  return (
    <div className="shell">
      <Link to="/journal" className="row gap-8 faint" style={{ fontSize: 12, paddingTop: 24 }}>
        <IconArrowLeft size={14} /> Journal
      </Link>
      <article className="article">
        <p className="eyebrow">
          <span className="dot" /> {a.kicker} · {a.read}
        </p>
        <h1>{a.title}</h1>
        <p className="tiny-meta">By the VOLTA studio · {BRAND.city}</p>
        <figure className="article__figure">
          <img src={a.image} alt="" style={{ borderRadius: 'var(--r-md)', width: '100%' }} />
          <figcaption>Photographed in the studio, {BRAND.city}.</figcaption>
        </figure>
        <div className="article__body">
          {a.body.slice(0, 2).map((p, i) => (
            <p key={i}>{p}</p>
          ))}
          <blockquote className="article__quote">“{a.quote}”</blockquote>
          {a.body.slice(2).map((p, i) => (
            <p key={i}>{p}</p>
          ))}
        </div>
        <div className="divider" />
        <div className="row between wrap gap-12">
          <span className="tiny-meta">Published by VOLTA Labs</span>
          <Link to="/shop" className="btn btn--sm">
            Shop the pieces <IconArrowRight size={14} />
          </Link>
        </div>
      </article>

      <section className="section" style={{ paddingTop: 20 }}>
        <SectionHead kicker="Keep reading" title="More from the journal" action={<Link to="/journal" className="link-arrow">All stories <IconArrowRight size={15} /></Link>} />
        <div className="plp-grid">
          {products.slice(0, 4).map((p, i) => (
            <ProductCard key={p.slug} product={p} index={i} />
          ))}
        </div>
      </section>
    </div>
  )
}
