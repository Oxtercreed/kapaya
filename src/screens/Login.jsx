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
    document.title = 'Sign in · KAPAYA'
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
      toast(mode === 'signup' ? 'Your account is ready — karibu!' : `Karibu back, ${state.user.firstName}.`)
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
    toast('Browsing as a guest — your bag is saved on this device.', { duration: 4200 })
  }

  return (
    <div className="gate">
      <aside className="gate__visual">
        <img src="/images/hero-salon.jpg" alt="A sunlit living room with handmade ceramics" />
        <div className="gate__visual-inner">
          <span className="wordmark">KAPAYA</span>
          <div>
            <span className="gate__pill">
              <IconCheck size={12} /> Free delivery over TZS 500,000
            </span>
            <p className="gate__quote" style={{ marginTop: 18 }}>
              “The objects we keep should get better with time.”
            </p>
            <p className="gate__quote-by">Kapaya Studio — Dar es Salaam</p>
          </div>
        </div>
      </aside>

      <section className="gate__form-side">
        <div className="gate__form-wrap">
          <div className="gate__mobile-brand">
            <span className="wordmark">KAPAYA</span>
            <span className="tiny-meta">Dar es Salaam</span>
          </div>

          <p className="eyebrow gate__eyebrow">
            <span className="dot" /> {mode === 'signin' ? 'Welcome back' : 'Karibu sana'}
          </p>
          <h1>{mode === 'signin' ? 'Sign in to your studio.' : 'Make the studio yours.'}</h1>
          <p className="gate__sub">
            {mode === 'signin'
              ? 'Your saved pieces, orders and notes from the maker — all in one quiet place.'
              : 'Save the pieces you love, follow makers, and get first look at new batches.'}
          </p>

          <div className="gate__socials">
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
              {busy ? 'Opening the studio…' : mode === 'signin' ? 'Sign in' : 'Create account'}
              {!busy && <IconArrowRight size={16} />}
            </button>
          </form>

          <div className="gate__switch">
            {mode === 'signin' ? (
              <>
                New to Kapaya?{' '}
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
            By continuing you agree to our <a href="#terms">Terms</a> and <a href="#privacy">Privacy Policy</a>.
            <br />
            Demo store — no real payments are taken.
          </p>
        </div>
      </section>
    </div>
  )
}
