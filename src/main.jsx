import React, { useEffect, useState } from 'react'
import { createRoot } from 'react-dom/client'
import { Link } from 'react-router-dom'
import { HashRouter, Navigate, Route, Routes, useLocation } from 'react-router-dom'
import { StoreProvider, useStore, useReveal } from './store'
import Layout from './components/Layout'
import Intro from './components/Intro'
import Login from './screens/Login'
import Home from './screens/Home'
import Shop from './screens/Shop'
import Product from './screens/Product'
import Cart from './screens/Cart'
import Checkout from './screens/Checkout'
import OrderConfirmed from './screens/OrderConfirmed'
import Chat from './screens/Chat'
import {
  AccountLayout,
  AccountHome,
  Orders,
  OrderDetail,
  Saved,
  Addresses,
  Payments,
  Details,
  Notifications,
  Help,
} from './screens/Account'
import { Collections, Makers, Journal, Article } from './screens/Pages'
import './styles/base.css'
import './styles/components.css'
import './styles/gate.css'
import './styles/home.css'
import './styles/plp.css'
import './styles/product.css'
import './styles/cart.css'
import './styles/chat.css'
import './styles/volta.css'
import './styles/volta-pages.css'

/* Keeps scroll-reveal observers fresh on every navigation */
function RevealBridge() {
  const loc = useLocation()
  useReveal()
  useEffect(() => {
    const revealInView = () => {
      document.querySelectorAll('[data-reveal]:not(.is-in)').forEach((el) => {
        const r = el.getBoundingClientRect()
        if (r.top < window.innerHeight * 1.1 && r.bottom > -80) el.classList.add('is-in')
      })
    }
    const t = setTimeout(revealInView, 150)
    return () => clearTimeout(t)
  }, [loc.pathname, loc.search])
  return null
}

function NotFound() {
  return (
    <div className="shell" style={{ padding: '90px 0', textAlign: 'center' }}>
      <p className="eyebrow" style={{ justifyContent: 'center' }}>
        <span className="dot" /> 404
      </p>
      <h1 style={{ fontSize: 'clamp(34px, 6vw, 64px)', margin: '14px 0' }}>This shelf is empty.</h1>
      <p className="lede" style={{ margin: '0 auto 26px' }}>
        The page you were looking for isn’t in the studio. Everything we make is a short walk away.
      </p>
      <Link className="btn" to="/shop">
        Back to the shop
      </Link>
    </div>
  )
}

function AppRoutes() {
  const { authed } = useStore()

  return (
    <>
      <RevealBridge />
      <Routes>
        <Route path="/login" element={authed ? <Navigate to="/" replace /> : <Login />} />
        <Route path="/*" element={
          authed ? (
            <Layout />
          ) : (
            <Navigate to="/login" replace />
          )
        }>
          <Route index element={<Home />} />
          <Route path="shop" element={<Shop />} />
          <Route path="product/:slug" element={<Product />} />
          <Route path="cart" element={<Cart />} />
          <Route path="checkout" element={<Checkout />} />
          <Route path="order/:id" element={<OrderConfirmed />} />
          <Route path="chat" element={<Chat />} />
          <Route path="collections" element={<Collections />} />
          <Route path="makers" element={<Makers />} />
          <Route path="journal" element={<Journal />} />
          <Route path="journal/:slug" element={<Article />} />
          <Route path="account" element={<AccountLayout />}>
            <Route index element={<AccountHome />} />
            <Route path="orders" element={<Orders />} />
            <Route path="orders/:id" element={<OrderDetail />} />
            <Route path="saved" element={<Saved />} />
            <Route path="addresses" element={<Addresses />} />
            <Route path="payments" element={<Payments />} />
            <Route path="details" element={<Details />} />
            <Route path="notifications" element={<Notifications />} />
            <Route path="help" element={<Help />} />
          </Route>
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </>
  )
}

function Root() {
  return (
    <StoreProvider>
      <HashRouter>
        <Intro>
          <AppRoutes />
        </Intro>
      </HashRouter>
    </StoreProvider>
  )
}

createRoot(document.getElementById('root')).render(<Root />)
