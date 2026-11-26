import React, { useEffect, useMemo, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { useStore, formatTZS } from '../store'
import { BRAND, getProduct } from '../data/catalog'
import { useLockBody } from '../components/ui'
import {
  IconArchive,
  IconSend,
  IconArrowLeft,
  IconChevronRight,
  IconAttach,
  IconPhone,
  IconMail,
  IconClock,
  IconPin,
  IconCheck,
  IconLeaf,
  IconChat,
  IconGlobe,
} from '../components/Icons'

const THREADS = [
  { id: 'studio', name: 'Kapaya Studio', role: 'Zawadi · studio team', av: 'KP', cls: 'thread__av--studio', online: true },
  { id: 'care', name: 'Care & repairs', role: 'Neema · aftercare', av: 'CR', cls: 'thread__av--care' },
  { id: 'shipping', name: 'Delivery · Dar', role: 'Courier desk', av: 'DD', cls: 'thread__av--shipping' },
]

const REPLIES = [
  { match: /size|dimension|big|small|tall/i, text: 'Happy to help with sizing — the Sona comes in 24, 34 and 46 cm. For a console I’d go 46 cm; for a dining table, 34 cm reads best.' },
  { match: /deliver|ship|courier|when|arrive/i, text: 'Within Dar, order before 12:00 and we’ll bring it today. Standard delivery to the rest of Tanzania and Kenya is 2–4 working days, free over TZS 500,000.' },
  { match: /price|cost|discount|offer|promo/i, text: 'Prices are as listed and include VAT. First orders get 10% with KARIBU10 — I can apply it to this thread if you’d like.' },
  { match: /stock|available|left|in stock/i, text: 'The chalk tall Sona has 6 left in the studio, and we fire another batch in two weeks. I can hold one for 48 hours if that helps.' },
  { match: /care|wash|clean|dishwasher/i, text: 'Stoneware is best hand washed with warm water. The linen throw can go on a cold gentle cycle — it only gets softer.' },
  { match: /return|exchange|refund/i, text: 'You have 14 days to return anything that doesn’t settle into the room. Just keep it in its original condition and we’ll arrange collection.' },
  { match: /hello|hi|hey|karibu|jambo/i, text: 'Karibu! Lovely to hear from you. What are you furnishing — or is this a gift?' },
  { match: /thanks|thank|asante/i, text: 'Asante sana. I’ll be here if anything else comes up — and I’ll send a note when it ships.' },
]

const H = 3600_000
const D = 24 * H

const ARCHIVE = {
  care: [
    { from: 'owner', text: 'The linen throw arrived — thank you! Do I wash it before first use?', ts: 3 * D + 4 * H },
    { from: 'me', text: 'No need. Cold gentle cycle when it needs it, line dry, and it only softens.', ts: 3 * D + 3.2 * H },
    { from: 'owner', text: 'Perfect. The fringe is my favourite part.', ts: 3 * D + 2.4 * H },
  ],
  shipping: [
    { from: 'owner', text: 'Any idea when the courier will reach Mikocheni?', ts: 8 * D + 5 * H },
    { from: 'me', text: 'Order KP-24816 left the studio at 09:20 — with you before 15:00 today.', ts: 8 * D + 4.3 * H },
  ],
}

const CANNED = [
  'Is the tall Sona in stock?',
  'How long is delivery to Dar?',
  'Can you help me choose a size?',
  'What’s the return policy?',
]

export default function Chat() {
  const { state, dispatch, toast } = useStore()
  const [thread, setThread] = useState('studio')
  const [text, setText] = useState('')
  const [typing, setTyping] = useState(false)
  const scrollRef = useRef(null)
  const taRef = useRef(null)
  const timers = useRef([])

  useEffect(() => {
    document.title = 'Chat with the studio · KAPAYA'
    dispatch({ type: 'readThread' })
    return () => timers.current.forEach(clearTimeout)
  }, [])

  useEffect(() => {
    const el = scrollRef.current
    if (el) el.scrollTop = el.scrollHeight
  }, [state.messages, typing, thread])

  // autosize textarea
  useEffect(() => {
    const ta = taRef.current
    if (!ta) return
    ta.style.height = 'auto'
    ta.style.height = `${Math.min(ta.scrollHeight, 120)}px`
  }, [text])

  const isStudio = thread === 'studio'
  const activeThread = THREADS.find((t) => t.id === thread) ?? THREADS[0]
  const messages = isStudio
    ? state.messages
    : (ARCHIVE[thread] ?? []).map((m, i) => ({
        ...m,
        id: `${thread}-${i}`,
        ts: Date.now() - m.ts,
      }))

  const send = (raw) => {
    const body = (raw ?? text).trim()
    if (!body) return
    dispatch({ type: 'send', text: body })
    setText('')
    setTyping(true)

    const r =
      REPLIES.find((x) => x.match.test(body)) ??
      { text: 'Let me check with the maker on that — I’ll come back to you within the hour. In the meantime, would a photo from the studio help?' }

    timers.current.push(
      setTimeout(() => {
        setTyping(false)
        dispatch({ type: 'receive', text: r.text })
      }, 1300 + Math.random() * 900),
    )
  }

  const lastOwner = [...messages].reverse().find((m) => m.from === 'owner')

  const previews = useMemo(
    () => ({
      studio: lastOwner?.text ?? 'Karibu — how can we help?',
      care: 'Care notes for stoneware & linen',
      shipping: 'Your order KP-24816 is with the courier',
    }),
    [lastOwner],
  )

  return (
    <div className="shell chat-page">
      <div className="page-head" style={{ paddingTop: 6, paddingBottom: 20 }}>
        <div className="split-head">
          <div>
            <p className="eyebrow">
              <span className="dot" /> Direct to the studio
            </p>
            <h1 style={{ fontSize: 'clamp(30px, 4.4vw, 54px)' }}>A conversation, not a bot.</h1>
          </div>
          <p className="lede" style={{ maxWidth: '34ch', fontSize: 13.5 }}>
            Zawadi and the team answer from the studio in {BRAND.city}. Weekdays, usually within the hour.
          </p>
        </div>
      </div>

      <div className={`chat-shell ${thread === 'studio' ? '' : 'is-list'}`}>
        {/* ---------- thread list ---------- */}
        <aside className="chat-list">
          <div className="chat-list__head">
            <h1 style={{ fontFamily: 'var(--font-display)', fontWeight: 400 }}>Messages</h1>
            <button className="icon-btn" style={{ width: 32, height: 32 }} onClick={() => toast('New message started with the studio')} aria-label="New message">
              <IconChat size={17} />
            </button>
          </div>
          <div className="chat-list__items">
            {THREADS.map((t) => (
              <button
                key={t.id}
                className={`thread ${thread === t.id ? 'is-on' : ''}`}
                onClick={() => setThread(t.id)}
              >
                <span className={`thread__av ${t.cls}`}>
                  <span>{t.av}</span>
                  {t.online && <i className="thread__online" />}
                </span>
                <span className="thread__body">
                  <span className="thread__row">
                    <span className="thread__name">{t.name}</span>
                    <span className="thread__time">
                      {t.id === 'studio' ? (typing ? 'now' : '2h') : t.id === 'care' ? 'Mon' : '18 Nov'}
                    </span>
                  </span>
                  <span className="thread__prev">{previews[t.id]}</span>
                </span>
                {t.id === 'studio' && state.notifications.some((n) => n.type === 'chat' && !n.read) && (
                  <span className="thread__unread">1</span>
                )}
              </button>
            ))}
          </div>
          <div className="chat-list__foot">
            <IconLeaf size={13} />
            <span>
              The studio replies personally — no bots, no scripts. Orders placed here go straight to the maker’s
              bench.
            </span>
          </div>
        </aside>

        {/* ---------- conversation ---------- */}
        <section className="chat-main">
          <header className="chat-head">
            <button className="icon-btn chat-head__back" onClick={() => setThread('other')} aria-label="Back to messages">
              <IconArrowLeft size={19} />
            </button>
            <span className={`thread__av ${activeThread.cls}`} style={{ width: 36, height: 36, fontSize: 13 }}>
              <span>{activeThread.av}</span>
              {activeThread.online && <i className="thread__online" />}
            </span>
            <div>
              <div className="chat-head__name">{activeThread.name}</div>
              <div className="chat-head__status" style={!activeThread.online ? { color: 'var(--ink-faint)' } : undefined}>
                {activeThread.online && <i />} {activeThread.online ? 'Online now · replies in ~1h' : activeThread.role}
              </div>
            </div>
            <div className="chat-head__tools">
              <a className="icon-btn" href={`tel:${BRAND.phone.replace(/\s/g, '')}`} aria-label="Call the studio">
                <IconPhone size={17} />
              </a>
              <a className="icon-btn" href={`mailto:${BRAND.email}`} aria-label="Email the studio">
                <IconMail size={17} />
              </a>
            </div>
          </header>

          <div className="chat-scroll" ref={scrollRef} aria-live="polite">
            <div className="chat-day">Today</div>
            {messages.length === 0 && (
              <div style={{ textAlign: 'center', padding: '40px 20px', color: 'var(--ink-soft)', fontSize: 13.5 }}>
                <p style={{ fontFamily: 'var(--font-display)', fontSize: 20, color: 'var(--ink)' }}>
                  Start a conversation
                </p>
                <p style={{ maxWidth: '32ch', margin: '8px auto 0' }}>
                  Ask about a piece, a delivery, or a room you’re trying to finish. Use a prompt below to get
                  going.
                </p>
              </div>
            )}
            {messages.map((m) => {
              const time = new Date(m.ts).toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })
              return (
                <div className={`msg ${m.from === 'me' ? 'msg--me' : ''}`} key={m.id}>
                  {m.from === 'owner' && (
                    <span className="msg__av" aria-hidden="true">
                      {isStudio ? 'Z' : activeThread.av.slice(0, 1)}
                    </span>
                  )}
                  <div className="msg__wrap">
                    <div className="msg__bubble">
                      {m.text}
                      {m.attachments?.map((a) => {
                        const p = getProduct(a.slug)
                        if (!p) return null
                        return (
                          <Link to={`/product/${p.slug}`} className="msg__product" key={a.slug}>
                            <img src={p.images[0]} alt="" />
                            <div>
                              <b>{p.name}</b>
                              <span className="mono">{formatTZS(p.price)}</span>
                            </div>
                            <IconChevronRight size={16} className="go" />
                          </Link>
                        )
                      })}
                    </div>
                    <span className="msg__meta">
                      {time}
                      {m.from === 'me' && <span className="ticks">· Read</span>}
                    </span>
                  </div>
                </div>
              )
            })}
            {typing && (
              <div className="msg">
                <span className="msg__av" aria-hidden="true">Z</span>
                <div className="msg__wrap">
                  <div className="typing" aria-label="Zawadi is typing">
                    <i />
                    <i />
                    <i />
                  </div>
                </div>
              </div>
            )}
          </div>

          {!isStudio && (
            <div className="chat-archived">
              <IconArchive size={15} />
              <span>
                This thread is archived. Continue with{' '}
                <button onClick={() => setThread('studio')} className="underline-link">
                  Kapaya Studio
                </button>{' '}
                — Zawadi will pick it up from here.
              </span>
            </div>
          )}

          <div className="chat-quick" style={!isStudio ? { display: 'none' } : undefined}>
            {CANNED.map((c) => (
              <button key={c} className="chip" onClick={() => send(c)}>
                {c}
              </button>
            ))}
          </div>

          <div className="chat-compose" style={!isStudio ? { display: 'none' } : undefined}>
            <form
              className="chat-compose__box"
              onSubmit={(e) => {
                e.preventDefault()
                send()
              }}
            >
              <button
                type="button"
                className="icon-btn"
                style={{ width: 32, height: 32, marginBottom: 3 }}
                aria-label="Attach a photo"
                onClick={() => toast('Photo attachments are coming soon — for now, describe the room and we’ll help.')}
              >
                <IconAttach size={18} />
              </button>
              <textarea
                ref={taRef}
                rows={1}
                value={text}
                placeholder="Message the studio…"
                onChange={(e) => setText(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault()
                    send()
                  }
                }}
                aria-label="Message the studio"
              />
              <button className="chat-send" type="submit" disabled={!text.trim()} aria-label="Send message">
                <IconSend size={17} />
              </button>
            </form>
            <p className="chat-compose__hint">Press Enter to send · Shift + Enter for a new line</p>
          </div>
        </section>

        {/* ---------- studio info ---------- */}
        <aside className="chat-info">
          <div className="chat-info__studio">
            <div className="chat-info__logo">KP</div>
            <div className="chat-info__name">Kapaya Studio</div>
            <div className="chat-info__role">Zawadi Mushi · Studio lead</div>
          </div>
          <div className="stack gap-12">
            <div className="chat-info__row">
              <IconClock size={14} />
              <span>{BRAND.hours}</span>
            </div>
            <div className="chat-info__row">
              <IconPin size={14} />
              <span>{BRAND.address}</span>
            </div>
            <div className="chat-info__row">
              <IconMail size={14} />
              <a href={`mailto:${BRAND.email}`} className="underline-link">
                {BRAND.email}
              </a>
            </div>
            <div className="chat-info__row">
              <IconGlobe size={14} />
              <span>Ships across East Africa & the UK</span>
            </div>
          </div>
          <div>
            <h3 style={{ marginBottom: 8 }}>Quick help</h3>
            <div className="chat-info__quick">
              <Link to="/account/orders">
                Track an order <IconChevronRight size={14} />
              </Link>
              <Link to="/account/help">
                Care & returns <IconChevronRight size={14} />
              </Link>
              <Link to="/account/addresses">
                Change delivery address <IconChevronRight size={14} />
              </Link>
              <Link to="/makers">
                Meet the makers <IconChevronRight size={14} />
              </Link>
            </div>
          </div>
          <div className="panel" style={{ background: 'var(--paper-3)', border: 0 }}>
            <p className="tiny-meta" style={{ letterSpacing: '0.1em' }}>Need it today?</p>
            <p style={{ fontSize: 12.5, margin: '6px 0 12px', color: 'var(--ink-soft)' }}>
              Order before 12:00 and we’ll hand-deliver within Dar.
            </p>
            <Link to="/shop" className="btn btn--sm btn--block">
              Shop in stock
            </Link>
          </div>
        </aside>
      </div>

      <p className="tiny-meta" style={{ marginTop: 16, textTransform: 'none', letterSpacing: 0, fontSize: 11 }}>
        Messages are stored on this device for the demo. <Link to="/account/help" className="underline-link">Read our care promise</Link>.
      </p>
    </div>
  )
}
