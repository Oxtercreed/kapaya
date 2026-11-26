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
    slug: 'table',
    kicker: 'Collection 01',
    title: 'Table, slowly set',
    body: 'Everyday stoneware and handloomed linen for the table you actually eat at — not the one in the photograph.',
    image: '/images/bowl-ember.jpg',
    category: 'ceramics',
  },
  {
    slug: 'ground',
    kicker: 'Collection 02',
    title: 'Highland wool',
    body: 'Hand-knotted rugs and woven throws in undyed highland wool, made to soften with a decade of feet.',
    image: '/images/rug-dune.jpg',
    category: 'textiles',
  },
  {
    slug: 'evening',
    kicker: 'Collection 03',
    title: 'Warm the evening',
    body: 'Rattan pendant light and hand-poured candles — the two things that turn a room warm around seven.',
    image: '/images/pendant-halcyon.jpg',
    category: 'lighting',
  },
  {
    slug: 'seat',
    kicker: 'Collection 04',
    title: 'A place to sit',
    body: 'Solid oak and mvule seating, joined without screws, built in Arusha in batches of six.',
    image: '/images/chair-obi.jpg',
    category: 'furniture',
  },
]

export function Collections() {
  useEffect(() => {
    document.title = 'Collections · KAPAYA'
  }, [])
  return (
    <div>
      <div className="shell">
        <div className="page-head">
          <p className="eyebrow">
            <span className="dot" /> Four slow collections
          </p>
          <h1>Rooms, assembled with patience.</h1>
          <p className="lede mt-16">
            We don’t design seasons. We build collections around a single idea — the table, the floor, the hour
            after sunset — and let them grow as makers bring new pieces.
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
                  <span className="tiny-meta">{byCategory(c.category).length} pieces</span>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>

      <section className="section">
        <div className="shell">
          <SectionHead kicker="Every piece" title="In the studio right now" action={<Link to="/shop" className="link-arrow">Shop all <IconArrowRight size={15} /></Link>} />
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
    name: 'Amani Mwinyi',
    studio: 'Kibanda Clay Studio',
    place: 'Dar es Salaam, Tanzania',
    craft: 'Stoneware · wheel-thrown',
    image: '/images/vase-sona.jpg',
    body: 'Amani digs his own clay from a riverbank twenty minutes south of the studio, ages it for a month, then throws on a kick wheel his father built. He mixes his glaze from kiln ash and fires twice.',
    quote: 'If the hand shows, it is honest.',
    years: 'Since 2014',
  },
  {
    name: 'Zawadi Weave Studio',
    studio: 'Zawadi Weave Studio',
    place: 'Nairobi, Kenya',
    craft: 'Linen & cotton · handloom',
    image: '/images/throw-terra.jpg',
    body: 'Three weavers, one floor loom, four throws a day. The stripe is measured by eye, which is why the rhythm shifts a little piece to piece — and why Nala prefers it that way.',
    quote: 'We are not making many. We are making well.',
    years: 'Since 2017',
  },
  {
    name: 'Yusuf Bakari',
    studio: 'Halcyon Rattan',
    place: 'Stone Town, Zanzibar',
    craft: 'Rattan & cane · lighting',
    image: '/images/pendant-halcyon.jpg',
    body: 'Yusuf learned cane weaving from his father in the alleys behind the Darajani market. Each dome is steam-bent over a wooden form and takes two days to shape.',
    quote: 'Light should look like it came through leaves.',
    years: 'Since 2012',
  },
  {
    name: 'Mlango Woodwork',
    studio: 'Mlango Woodwork',
    place: 'Arusha, Tanzania',
    craft: 'Solid timber · joinery',
    image: '/images/chair-obi.jpg',
    body: 'A four-person workshop that dry-fits every frame before glue-up. They work mostly in mvule reclaimed from old furniture and oak imported in small quantities.',
    quote: 'A joint you can see is a joint you can trust.',
    years: 'Since 2019',
  },
]

export function Makers() {
  useEffect(() => {
    document.title = 'Our makers · KAPAYA'
  }, [])
  return (
    <div>
      <div className="shell">
        <div className="page-head">
          <p className="eyebrow">
            <span className="dot" /> Independent workshops
          </p>
          <h1>The hands behind every piece.</h1>
          <p className="lede mt-16">
            We work with four workshops across Tanzania and Kenya. We name the maker on every listing, pay on
            delivery, and never ask for exclusivity — these studios are better for having other customers.
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
                Shop the studio <IconArrowRight size={15} />
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
                <span className="dot" /> Our terms
              </p>
              <h2 style={{ fontSize: 'clamp(22px, 2.6vw, 32px)', marginTop: 8 }}>Fair work, named makers, no middle men.</h2>
            </div>
            <div className="tick-list" style={{ maxWidth: 360 }}>
              <li>
                <IconCheck size={15} /> Makers are paid in full at delivery, not on consignment.
              </li>
              <li>
                <IconCheck size={15} /> Lead times are set by the workshop, never shortened for us.
              </li>
              <li>
                <IconCheck size={15} /> Each listing names the maker and the studio.
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
    document.title = 'Journal · KAPAYA'
  }, [])
  return (
    <div>
      <div className="shell">
        <div className="page-head">
          <p className="eyebrow">
            <span className="dot" /> Studio journal
          </p>
          <h1>Notes on making and keeping.</h1>
          <p className="lede mt-16">
            Long-form, unhurried writing about the materials, the workshops, and the rooms our pieces end up in.
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
  'quiet-rooms': {
    kicker: 'In the studio',
    title: 'The quiet architecture of a Dar living room',
    read: '6 min read',
    image: '/images/hero-salon.jpg',
    body: [
      'There is a particular hour in Dar es Salaam, somewhere around half past four, when the light comes in low and turns every plaster wall the colour of milk tea. It is the hour our customers photograph most. It is also the reason so many of our pieces are chosen by how they behave at that hour rather than how they look at noon.',
      'A quiet room is rarely the result of buying fewer things. It is the result of buying things that agree with one another — not in colour, exactly, but in temperature. Raw clay and washed linen sit at the same temperature. Polished chrome does not.',
      'We have a rule in the studio: if you cannot imagine the object with a small flaw and still want it, it is probably not for you. Hand-thrown stoneware always has a flaw. The rib of a vessel is never perfectly even, because the hand is not perfectly even.',
      'The best rooms we have been shown are almost never finished. There is one good chair, a rug that has known three homes, and a shelf of things that were given rather than bought. The pieces arrive slowly, and the room learns to hold them.',
      'So: buy less, and buy the thing you can live with when it is chipped. The room will follow.',
    ],
    quote: 'A quiet room is not an empty room. It is a room where nothing is arguing.',
  },
  'clay-and-ash': {
    kicker: 'Makers',
    title: 'Amani, and the clay he digs himself',
    read: '4 min read',
    image: '/images/vase-sona.jpg',
    body: [
      'Twenty minutes south of the studio, past the last of the concrete, there is a riverbank where Amani Mwinyi fills two buckets most Wednesday mornings. The clay there is gray-green when wet and fires to a warm oatmeal. He has been taking it from the same bend for eleven years.',
      'The clay rests for a month in a covered pit behind the workshop before it is touched. Then it is wedged by hand, thrown on a kick wheel, and left to dry slowly under damp cloth. A Sona vessel takes roughly four days before it ever sees the kiln.',
      'The ribs are carved while the clay is still soft, using a piece of broken gourd. This is the part that cannot be taught quickly. Too early and the wall collapses; too late and the surface tears.',
      'The glaze is the quiet innovation. Amani mixes ash from the studio’s own kiln with a small amount of feldspar and limestone, producing a matte chalk surface that pools in the ribs and never quite repeats.',
      'He fires twice. The second firing is short and hot, and it is where a batch either comes good or does not. Roughly one in eight is rejected — those become seconds, sold from a shelf near the door.',
    ],
    quote: 'The kiln decides. I only prepare the argument.',
  },
  'weaving-time': {
    kicker: 'Process',
    title: 'Why a handloom cannot be hurried',
    read: '5 min read',
    image: '/images/throw-terra.jpg',
    body: [
      'A floor loom is a patient instrument. It rewards the weaver who stops to fix a single crossed thread, and punishes the one who does not — three metres later, in the form of a line that will never sit flat.',
      'In the Nairobi studio, three weavers share one loom. They work in two-hour rotations, because the work is harder on the shoulders than it looks and because, as Nala puts it, “the loom tells you when it is time.”',
      'A single Terra throw takes about five hours of actual weaving, plus a morning to warp and an afternoon to knot the fringe. That sounds quick. It is not, because the loom is idle much of the week, and because the yarn has to be washed and dried before it can be woven at all.',
      'The linen is European, imported in small quantities because East African flax is not yet produced at the weight we need. The cotton in the napkins is local. We are honest about which is which on every listing.',
      'The result is a cloth that is not uniform. The stripe drifts by a few millimetres across the width. After twenty washes it softens into something closer to skin than textile. That drift is the signature of the hand that made it.',
    ],
    quote: 'You cannot rush a loom. You can only keep it company.',
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
        <p className="tiny-meta">By the Kapaya Studio · {BRAND.city}</p>
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
          <span className="tiny-meta">Published by Kapaya Studio</span>
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
