# KAPAYA — Objects for a slower home

A complete, clickable storefront for a fictional artisan homeware studio in Dar es Salaam,
built with React + Vite. No backend required — cart, chat, orders and account data live in
`localStorage`, so the whole flow works end to end.

## Run it

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # production bundle in dist/
```

## What's inside

| Screen | Route | Highlights |
| --- | --- | --- |
| Splash + login | `/login` | Brand loading animation, sign-in / create account, Google & Apple buttons, guest entry |
| Home | `/` | Hero, trust bar, category rail, new-in & bestseller rails, editorial band, makers, journal, UGC |
| Shop | `/shop` | Draggable category slider, sidebar filters (category, price, material, maker, tags), 5 sort modes, search & URL params |
| Product | `/product/:slug` | Gallery, colour & size options that change price, accordions, reviews, maker story, related pieces, sticky mobile buy bar |
| Cart | `/cart` | Line editing, promo codes (`KARIBU10`, `STUDIO25`), free-delivery meter, 3-step checkout, order confirmation |
| Chat | `/chat` | Thread list, product card messages, quick prompts, typing indicator, keyword-aware auto replies |
| Account | `/account` | Overview, orders (filter tabs), order detail with tracker, saved pieces, addresses CRUD, payment methods, details, notifications, help |

Everything is responsive down to 360 px, with a fixed bottom tab bar, filter sheets and a
sticky add-to-bag bar on mobile.

## Design notes

Warm editorial minimalism after Aesop and The Citizenry: plaster-and-ink palette, Fraunces
display serif for voice, Instrument Sans for UI, generous whitespace, photography doing the
storytelling. Product imagery was generated to share one studio light and palette so the
grid reads as a single photoshoot.
