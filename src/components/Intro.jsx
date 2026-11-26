import React, { useState } from 'react'
import Splash from '../screens/Splash'

const KEY = 'kapaya.introSeen'

/**
 * First-visit overlay: plays the brand loading animation, then gets out of the way.
 * Shown once per browser so returning visitors land straight on the store.
 */
export default function Intro({ children }) {
  const [state, setState] = useState(() => {
    try {
      return localStorage.getItem(KEY) === '1' ? 'idle' : 'playing'
    } catch {
      return 'playing'
    }
  })

  const finish = () => {
    try {
      localStorage.setItem(KEY, '1')
    } catch {
      /* ignore */
    }
    setState('fading')
    setTimeout(() => setState('idle'), 700)
  }

  return (
    <>
      {children}
      {state !== 'idle' && (
        <div style={{ opacity: state === 'fading' ? 0 : 1, transition: 'opacity .6s ease' }}>
          <Splash onDone={finish} />
        </div>
      )}
    </>
  )
}
