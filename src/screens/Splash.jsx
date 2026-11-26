import React, { useEffect, useState } from 'react'

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
  }, [onDone, quick])

  return (
    <div className={`splash ${out ? 'is-out' : ''}`} aria-label="VOLTA is loading" role="status">
      <span className="splash__corner splash__corner--tl">VOLTA Studio · Est. 2014</span>
      <span className="splash__corner splash__corner--tr">Dar es Salaam, TZ</span>
      <span className="splash__corner splash__corner--bl mono">{String(count).padStart(3, '0')}</span>
      <span className="splash__corner splash__corner--br">Free shipping over $100</span>

      <div className="splash__center">
        <h1 className="splash__word" aria-label="VOLTA">
          <span>VOLTA</span>
        </h1>
        <span className="splash__hair" aria-hidden="true" />
        <p className="splash__tag">Good tech. Better everyday.</p>
      </div>

      <div className="splash__bar">
        <i style={quick ? { animationDuration: '0.5s' } : undefined} />
      </div>
    </div>
  )
}
