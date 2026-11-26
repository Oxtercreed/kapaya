import React from 'react'

const S = ({ size = 20, sw = 1.5, children, ...rest }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={sw}
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
    {...rest}
  >
    {children}
  </svg>
)

export const IconSearch = (p) => (
  <S {...p}>
    <circle cx="11" cy="11" r="7" />
    <path d="m16.2 16.2 4 4" />
  </S>
)

export const IconBag = (p) => (
  <S {...p}>
    <path d="M5 8h14l-1.1 11.2a1.6 1.6 0 0 1-1.6 1.4H7.7a1.6 1.6 0 0 1-1.6-1.4Z" />
    <path d="M9 8V6.6a3 3 0 0 1 6 0V8" />
  </S>
)

export const IconUser = (p) => (
  <S {...p}>
    <circle cx="12" cy="8.4" r="3.7" />
    <path d="M4.6 20.4a7.6 7.6 0 0 1 14.8 0" />
  </S>
)

export const IconChat = (p) => (
  <S {...p}>
    <path d="M20.5 11.7c0 4-3.8 7.2-8.5 7.2-1 0-2-.15-2.9-.42L4 20.5l1.35-3.6A6.8 6.8 0 0 1 3.5 11.7c0-4 3.8-7.2 8.5-7.2s8.5 3.2 8.5 7.2Z" />
  </S>
)

export const IconHeart = ({ filled, ...p }) => (
  <S {...p} fill={filled ? 'currentColor' : 'none'}>
    <path d="M12 20s-7.4-4.3-7.4-9.4A4.1 4.1 0 0 1 12 7.6a4.1 4.1 0 0 1 7.4 3c0 5.1-7.4 9.4-7.4 9.4Z" />
  </S>
)

export const IconArrowRight = (p) => (
  <S {...p}>
    <path d="M4 12h15" />
    <path d="m13.5 6 6 6-6 6" />
  </S>
)

export const IconArrowLeft = (p) => (
  <S {...p}>
    <path d="M20 12H5" />
    <path d="m10.5 6-6 6 6 6" />
  </S>
)

export const IconChevronDown = (p) => (
  <S {...p}>
    <path d="m6 9.5 6 6 6-6" />
  </S>
)

export const IconChevronRight = (p) => (
  <S {...p}>
    <path d="m9.5 6 6 6-6 6" />
  </S>
)

export const IconClose = (p) => (
  <S {...p}>
    <path d="M6 6l12 12M18 6 6 18" />
  </S>
)

export const IconPlus = (p) => (
  <S {...p}>
    <path d="M12 5v14M5 12h14" />
  </S>
)

export const IconMinus = (p) => (
  <S {...p}>
    <path d="M5 12h14" />
  </S>
)

export const IconCheck = (p) => (
  <S {...p}>
    <path d="m4.5 12.5 5 5 10-11" />
  </S>
)

export const IconStar = ({ filled = true, ...p }) => (
  <S {...p} fill={filled ? 'currentColor' : 'none'} strokeWidth={1.2}>
    <path d="M12 3.6l2.5 5.3 5.6.7-4.1 3.9 1 5.6-5-2.8-5 2.8 1-5.6L3.9 9.6l5.6-.7Z" />
  </S>
)

export const IconTruck = (p) => (
  <S {...p}>
    <path d="M2.5 6.5h10v9h-10z" />
    <path d="M12.5 10h4l3 3v2.5h-7z" />
    <circle cx="6.5" cy="18" r="1.7" />
    <circle cx="16.5" cy="18" r="1.7" />
  </S>
)

export const IconReturn = (p) => (
  <S {...p}>
    <path d="M4 9h11a4.5 4.5 0 1 1 0 9H8" />
    <path d="m8 5-4 4 4 4" />
  </S>
)

export const IconShield = (p) => (
  <S {...p}>
    <path d="M12 3.5 19 6v6c0 4.2-3 7.2-7 8.5-4-1.3-7-4.3-7-8.5V6Z" />
    <path d="m9 12 2 2 4-4" />
  </S>
)

export const IconSend = (p) => (
  <S {...p}>
    <path d="M4 12 20 4.5 14.5 20l-2.6-6.3L4 12Z" />
  </S>
)

export const IconAttach = (p) => (
  <S {...p}>
    <path d="M17.5 10.5 11 17a4 4 0 0 1-5.6-5.6L13 3.8a2.8 2.8 0 0 1 4 4l-7.4 7.4a1.6 1.6 0 0 1-2.3-2.3l6.7-6.7" />
  </S>
)

export const IconGrid = (p) => (
  <S {...p}>
    <rect x="3.5" y="3.5" width="7" height="7" rx="1.4" />
    <rect x="13.5" y="3.5" width="7" height="7" rx="1.4" />
    <rect x="3.5" y="13.5" width="7" height="7" rx="1.4" />
    <rect x="13.5" y="13.5" width="7" height="7" rx="1.4" />
  </S>
)

export const IconFilter = (p) => (
  <S {...p}>
    <path d="M3.5 7h17M6.5 12h11M10 17h4" />
  </S>
)

export const IconSliders = (p) => (
  <S {...p}>
    <path d="M4 8h10M18 8h2M4 16h4M12 16h8" />
    <circle cx="16" cy="8" r="2" />
    <circle cx="10" cy="16" r="2" />
  </S>
)

export const IconBell = (p) => (
  <S {...p}>
    <path d="M6 9.5a6 6 0 0 1 12 0c0 4 1.3 5.5 1.3 5.5H4.7S6 13.5 6 9.5Z" />
    <path d="M10 18.5a2.2 2.2 0 0 0 4 0" />
  </S>
)

export const IconPencil = (p) => (
  <S {...p}>
    <path d="M4 20h4L20 8l-4-4L4 16Z" />
    <path d="m14.5 5.5 4 4" />
  </S>
)

export const IconTrash = (p) => (
  <S {...p}>
    <path d="M4 7h16M9 7V5h6v2M6.5 7l1 12.5h9L17.5 7" />
  </S>
)

export const IconPin = (p) => (
  <S {...p}>
    <path d="M12 21s6.5-6.1 6.5-11a6.5 6.5 0 0 0-13 0C5.5 14.9 12 21 12 21Z" />
    <circle cx="12" cy="10" r="2.4" />
  </S>
)

export const IconCard = (p) => (
  <S {...p}>
    <rect x="2.5" y="5.5" width="19" height="13" rx="2.2" />
    <path d="M2.5 10h19" />
  </S>
)

export const IconBox = (p) => (
  <S {...p}>
    <path d="M12 3 20 7v10l-8 4-8-4V7Z" />
    <path d="m4 7 8 4 8-4M12 11v10" />
  </S>
)

export const IconArchive = (p) => (
  <S {...p}>
    <path d="M4 8h16v11a1.5 1.5 0 0 1-1.5 1.5h-13A1.5 1.5 0 0 1 4 19Z" />
    <path d="M3 4.5h18V8H3zM9.5 12h5" />
  </S>
)

export const IconTag = (p) => (
  <S {...p}>
    <path d="M12.6 3.5H20v7.4l-8.6 8.6a1.8 1.8 0 0 1-2.5 0l-5-5a1.8 1.8 0 0 1 0-2.5Z" />
    <circle cx="16.4" cy="7.4" r="1.4" />
  </S>
)

export const IconLogout = (p) => (
  <S {...p}>
    <path d="M14 4.5H6.5A1.5 1.5 0 0 0 5 6v12a1.5 1.5 0 0 0 1.5 1.5H14" />
    <path d="M17 8.5 20.5 12 17 15.5M10 12h10" />
  </S>
)

export const IconMenu = (p) => (
  <S {...p}>
    <path d="M4 7h16M4 12h16M4 17h16" />
  </S>
)

export const IconSparkle = (p) => (
  <S {...p}>
    <path d="M12 3v5M12 16v5M3 12h5M16 12h5M6.5 6.5 9 9M15 15l2.5 2.5M17.5 6.5 15 9M9 15l-2.5 2.5" />
  </S>
)

export const IconLeaf = (p) => (
  <S {...p}>
    <path d="M20 4c0 9-4.5 14-10 14A6 6 0 0 1 4 12C4 6.5 10 4 20 4Z" />
    <path d="M4 20c2-5 5-8 10-10" />
  </S>
)

export const IconClock = (p) => (
  <S {...p}>
    <circle cx="12" cy="12" r="8.5" />
    <path d="M12 7.5V12l3 2" />
  </S>
)

export const IconGlobe = (p) => (
  <S {...p}>
    <circle cx="12" cy="12" r="8.5" />
    <path d="M3.5 12h17M12 3.5c2.4 2.3 3.6 5.3 3.6 8.5s-1.2 6.2-3.6 8.5c-2.4-2.3-3.6-5.3-3.6-8.5S9.6 5.8 12 3.5Z" />
  </S>
)

export const IconMail = (p) => (
  <S {...p}>
    <rect x="3" y="5" width="18" height="14" rx="2" />
    <path d="m3.8 6.5 8.2 6 8.2-6" />
  </S>
)

export const IconPhone = (p) => (
  <S {...p}>
    <path d="M6.5 3.5h3l1.5 4-2 1.5a11 11 0 0 0 5 5L15.5 12l4 1.5v3a2 2 0 0 1-2.2 2A15.5 15.5 0 0 1 4.5 5.7a2 2 0 0 1 2-2.2Z" />
  </S>
)

export const IconLock = (p) => (
  <S {...p}>
    <rect x="4.5" y="10" width="15" height="10.5" rx="2.2" />
    <path d="M8 10V7.5a4 4 0 0 1 8 0V10" />
  </S>
)

export const IconEye = (p) => (
  <S {...p}>
    <path d="M2.5 12S6 5.8 12 5.8 21.5 12 21.5 12 18 18.2 12 18.2 2.5 12 2.5 12Z" />
    <circle cx="12" cy="12" r="2.8" />
  </S>
)

export const IconEyeOff = (p) => (
  <S {...p}>
    <path d="M4 4.5l16 15" />
    <path d="M9.6 6.4A9.7 9.7 0 0 1 12 6.2c6 0 9.5 5.8 9.5 5.8a17 17 0 0 1-2.9 3.4M6.3 8.3A16.6 16.6 0 0 0 2.5 12S6 17.8 12 17.8a9.6 9.6 0 0 0 3-.47" />
    <path d="M9.9 10a3 3 0 0 0 4.2 4.2" />
  </S>
)

export const IconGoogle = ({ size = 18 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden="true">
    <path fill="#4285F4" d="M22 12.2c0-.8-.07-1.5-.2-2.2H12v4.1h5.6a4.8 4.8 0 0 1-2.1 3.1v2.6h3.4c2-1.8 3.1-4.5 3.1-7.6Z" />
    <path fill="#34A853" d="M12 22c2.8 0 5.1-.9 6.8-2.5l-3.3-2.6c-.9.6-2.1 1-3.5 1a6.1 6.1 0 0 1-5.7-4.2H2.9v2.7A10 10 0 0 0 12 22Z" />
    <path fill="#FBBC05" d="M6.3 13.7a6 6 0 0 1 0-3.8V7.2H2.9a10 10 0 0 0 0 9.2l3.4-2.7Z" />
    <path fill="#EA4335" d="M12 5.9c1.6 0 3 .55 4.1 1.6l3-3A10 10 0 0 0 2.9 7.2l3.4 2.7A6.1 6.1 0 0 1 12 5.9Z" />
  </svg>
)

export const IconApple = ({ size = 18 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M16.4 12.8c0-2.3 1.9-3.4 2-3.5-1.1-1.6-2.8-1.8-3.4-1.9-1.5-.1-2.8.9-3.5.9s-1.9-.9-3.1-.85c-1.6 0-3.1.95-3.9 2.4-1.7 2.9-.4 7.2 1.2 9.5.8 1.2 1.75 2.4 3 2.35 1.2-.05 1.65-.75 3.1-.75s1.85.75 3.1.73c1.3 0 2.1-1.15 2.85-2.3.9-1.3 1.3-2.6 1.3-2.65-.05 0-2.6-1-2.65-3.9ZM14 5.9c.65-.8 1.1-1.9.95-3-.95.05-2.1.65-2.75 1.45-.6.7-1.1 1.8-.95 2.85 1.05.1 2.1-.5 2.75-1.3Z" />
  </svg>
)
