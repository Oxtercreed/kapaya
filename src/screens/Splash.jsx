import React, { useEffect, useState } from 'react'

const WORDS = 'KAPAYA'.split('')

export default function Splash({ onDone, quick = false }) {
  const [out, setOut] = useState(false)
  const [count, setCount] = useState(0)

  useEffect(() => {
    if (quick) {
      const q1 = setTimeout(() => setOut(true), 520)
      const q2 = setTimeout(onDone, 1000)
      setCount(100)
      return () => {
        clearTimeout(q1)
        clearTimeout(q2)
      }
    }
    const start = performance.now()
    let raf
    const tick = (t) => {
      const p = Math.min(1, (t - start) / 2300)
      setCount(Math.round(p * 100))
      if (p < 1) raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)

    const t1 = setTimeout(() => setOut(true), 2550)
    const t2 = setTimeout(onDone, 3300)
    return () => {
      cancelAnimationFrame(raf)
      clearTimeout(t1)
      clearTimeout(t2)
    }
  }, [onDone])

  return (
    <div className={`splash ${out ? 'is-out' : ''}`} aria-label="KAPAYA is loading" role="status">
      <div className="splash__grain" />
      <div className="splash__glow" />
      <span className="splash__corner splash__corner--tl">Kapaya Studio · Est. 2019</span>
      <span className="splash__corner splash__corner--tr">Dar es Salaam, TZ</span>
      <span className="splash__corner splash__corner--bl">Objects for a slower home</span>

      <div className="splash__center">
        <svg className="splash__mark" viewBox="0 0 100 100" fill="none" aria-hidden="true">
          <path
            d="M20 82V48a30 30 0 0 1 60 0v34"
            stroke="#F6F1E8"
            strokeWidth="2"
            strokeLinecap="round"
          />
          <path d="M8 82h84" stroke="rgba(246,241,232,0.4)" strokeWidth="1.4" strokeLinecap="round" />
          <circle cx="50" cy="58" r="6.5" fill="#B4552D" />
        </svg>

        <h1 className="splash__word" aria-label="KAPAYA">
          {WORDS.map((ch, i) => (
            <span key={i} style={{ animationDelay: `${180 + i * 85}ms` }}>
              {ch}
            </span>
          ))}
        </h1>
        <p className="splash__tag">Objects for a slower home</p>
      </div>

      <div className="splash__bar">
        <i style={quick ? { animationDuration: '0.5s' } : undefined} />
      </div>
      <p className="splash__count mono">{String(count).padStart(3, '0')}%</p>
    </div>
  )
}
