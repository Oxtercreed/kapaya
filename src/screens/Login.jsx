import React, { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useStore } from '../store'
import { IconEye, IconEyeOff, IconGoogle, IconApple, IconArrowRight, IconCheck } from '../components/Icons'

const fields = {
  email: { label: 'Email address', type: 'email', placeholder: 'you@example.com', autoComplete: 'email' },
  password: { label: 'Password', type: 'password', placeholder: 'At least 8 characters', autoComplete: 'current-password' },
  name: { label: 'Full name', type: 'text', placeholder: 'Amani Hassan', autoComplete: 'name' },
}

export default function Login() {
  const { setAuthed, toast, state, dispatch } = useStore()
  const nav = useNavigate()
  const [mode, setMode] = useState('signin') // signin | signup
  const [values, setValues] = useState({ email: 'amani.hassan@gmail.com', password: 'kapaya-studio', name: '' })
  const [peek, setPeek] = useState(false)
  const [errors, setErrors] = useState({})
  const [busy, setBusy] = useState(false)
  const emailRef = useRef(null)

  useEffect(() => {
    document.title = 'Sign in · VOLTA'
  }, [])

  const set = (k) => (e) => {
    setValues((v) => ({ ...v, [k]: e.target.value }))
    setErrors((er) => ({ ...er, [k]: undefined }))
  }

  const validate = () => {
    const er = {}
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(values.email)) er.email = 'Enter a valid email address'
    if (values.password.length < 8) er.password = 'Your password needs at least 8 characters'
    if (mode === 'signup' && values.name.trim().length < 2) er.name = 'Tell us what to call you'
    setErrors(er)
    return Object.keys(er).length === 0
  }

  const submit = (e) => {
    e.preventDefault()
    if (!validate()) return
    setBusy(true)
    setTimeout(() => {
      if (mode === 'signup' && values.name.trim()) {
        dispatch({ type: 'updateUser', patch: { name: values.name.trim(), firstName: values.name.trim().split(' ')[0], email: values.email } })
      } else if (values.email !== state.user.email) {
        dispatch({ type: 'updateUser', patch: { email: values.email } })
      }
      setAuthed(true)
      toast(mode === 'signup' ? 'Your account is ready — welcome!' : `Welcome back, ${state.user.firstName}.`)
      nav('/', { replace: true })
    }, 720)
  }

  const social = (provider) => {
    setBusy(true)
    setTimeout(() => {
      setAuthed(true)
      toast(`Signed in with ${provider}`, { duration: 2500 })
      nav('/', { replace: true })
    }, 620)
  }

  const guest = () => {
    setAuthed(true)
    nav('/', { replace: true })
    toast('Browsing as a guest — your bag is saved on this device.', { duration: 2200 })
  }

  return (
    <div className="gate">
      <aside className="m-gate-visual">
        <div className="m-gate-visual__inner">
          <div className="m-gate-visual__top">
            <span className="wordmark" style={{ color: 'var(--paper)' }}>
              VOLTA
            </span>
            <span className="eyebrow" style={{ color: 'rgba(251,250,247,0.55)' }}>
              Est. 2014
            </span>
          </div>
          <div className="m-gate-hero">
            <img src="/images/v-headphones.jpg" alt="Vertex H9 headphones" />
            <div className="m-gate-hero__card">
              <span className="m-gate-hero__kicker">Now in the studio</span>
              <strong>Vertex H9 Headphones</strong>
              <span className="m-gate-hero__price">$329.00 · 40 h playback</span>
            </div>
          </div>
          <h2 className="m-gate-visual__quote">
            Good tech.
            <br />
            <em>Better</em> everyday.
          </h2>
          <div className="m-gate-visual__foot">
            <span>VOLTA — Dar es Salaam</span>
            <span>Free shipping over $100</span>
          </div>
        </div>
      </aside>

      <section className="gate__form-side">
        <div className="gate__form-wrap m-gate__form">
          <div className="gate__mobile-brand">
            <span className="wordmark">VOLTA</span>
            <span className="tiny-meta">Dar es Salaam</span>
          </div>

          <span className="m-gate__folio">{mode === 'signin' ? 'I' : 'II'} — {mode === 'signin' ? 'Welcome back' : 'Create account'}</span>
          <h1 className="m-gate__title">
            {mode === 'signin' ? (
              <>
                Welcome
                <br />
                <em>back.</em>
              </>
            ) : (
              <>
                Create your
                <br />
                <em>account.</em>
              </>
            )}
          </h1>
          <p className="gate__sub">
            {mode === 'signin'
              ? 'Your orders, saved products and messages with the studio — all in one place.'
              : 'Save what you love, track orders, and get first look at new drops.'}
          </p>

          <div className="gate__socials m-gate__socials">
            <button className="social-btn" onClick={() => social('Google')} disabled={busy}>
              <IconGoogle /> Continue with Google
            </button>
            <button className="social-btn" onClick={() => social('Apple')} disabled={busy}>
              <IconApple /> Continue with Apple
            </button>
          </div>

          <div className="hr-label" style={{ marginTop: 22 }}>
            or with email
          </div>

          <form className="gate__form" onSubmit={submit} noValidate>
            {mode === 'signup' && (
              <div className="field">
                <label htmlFor="name">{fields.name.label}</label>
                <input
                  id="name"
                  className="input"
                  type="text"
                  placeholder={fields.name.placeholder}
                  value={values.name}
                  onChange={set('name')}
                  autoComplete="name"
                />
                {errors.name && <span className="field-error">{errors.name}</span>}
              </div>
            )}
            <div className="field">
              <label htmlFor="email">{fields.email.label}</label>
              <input
                id="email"
                ref={emailRef}
                className="input"
                type="email"
                placeholder={fields.email.placeholder}
                value={values.email}
                onChange={set('email')}
                autoComplete="email"
                inputMode="email"
              />
              {errors.email && <span className="field-error">{errors.email}</span>}
            </div>
            <div className="field">
              <label htmlFor="password">{fields.password.label}</label>
              <div className="input-wrap">
                <input
                  id="password"
                  className="input"
                  type={peek ? 'text' : 'password'}
                  placeholder={fields.password.placeholder}
                  value={values.password}
                  onChange={set('password')}
                  autoComplete={mode === 'signin' ? 'current-password' : 'new-password'}
                />
                <button
                  type="button"
                  className="gate__peek"
                  onClick={() => setPeek((p) => !p)}
                  aria-label={peek ? 'Hide password' : 'Show password'}
                >
                  {peek ? <IconEyeOff size={17} /> : <IconEye size={17} />}
                </button>
              </div>
              {errors.password && <span className="field-error">{errors.password}</span>}
            </div>

            <div className="gate__row">
              <label className="checkline">
                <input type="checkbox" defaultChecked /> Keep me signed in
              </label>
              <button type="button" className="underline-link" style={{ fontSize: 12.5 }} onClick={() => toast('A reset link is on its way to your inbox.')}>
                Forgot password?
              </button>
            </div>

            <button className="btn btn--block" type="submit" disabled={busy} style={{ marginTop: 6 }}>
              {busy ? 'Opening VOLTA…' : mode === 'signin' ? 'Sign in' : 'Create account'}
              {!busy && <IconArrowRight size={16} />}
            </button>
          </form>

          <div className="gate__switch">
            {mode === 'signin' ? (
              <>
                New to VOLTA?{' '}
                <button onClick={() => setMode('signup')} type="button">
                  Create an account
                </button>
              </>
            ) : (
              <>
                Already have an account?{' '}
                <button onClick={() => setMode('signin')} type="button">
                  Sign in
                </button>
              </>
            )}
          </div>

          <button className="gate__guest" onClick={guest} type="button">
            Continue as guest <IconArrowRight size={14} />
          </button>

          <p className="gate__fine">
            By continuing you agree to our <button type="button" className="underline-link" onClick={(e) => e.preventDefault()}>Terms</button> and <button type="button" className="underline-link" onClick={(e) => e.preventDefault()}>Privacy Policy</button>.
            <br />
            Demo store — no real payments are taken.
          </p>
        </div>
      </section>
    </div>
  )
}
