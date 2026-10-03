// ไอคอนวาดเองทั้งชุด กริด 24×24 เส้นหนา 1.5 เท่ากันหมด
// ไม่ใช้อิโมจิ เพราะอิโมจิเรนเดอร์คนละแบบทุกเครื่องและทำให้เว็บดูเป็นเทมเพลต

const PATHS = {
  play: <><circle cx="12" cy="12" r="9"/><path d="m10 8 6 4-6 4z"/></>,
  copy: <><rect x="8" y="8" width="12" height="13" rx="2"/><path d="M15 8V5a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h3"/></>,
  web: (
    <>
      <rect x="3" y="4.5" width="18" height="15" rx="2.5" />
      <path d="M3 9.5h18" />
      <circle cx="6.2" cy="7" r=".6" fill="currentColor" stroke="none" />
      <circle cx="8.6" cy="7" r=".6" fill="currentColor" stroke="none" />
    </>
  ),
  ai: (
    <>
      <circle cx="12" cy="12" r="3.2" />
      <circle cx="5" cy="5.8" r="1.7" />
      <circle cx="19" cy="5.8" r="1.7" />
      <circle cx="5" cy="18.2" r="1.7" />
      <circle cx="19" cy="18.2" r="1.7" />
      <path d="M9.6 10 6.4 7.2M14.4 10l3.2-2.8M9.6 14l-3.2 2.8M14.4 14l3.2 2.8" />
    </>
  ),
  ledger: (
    <>
      <path d="M6 3h8l4 4v14H6z" />
      <path d="M14 3v4h4" />
      <path d="M9.5 17.5v-3M12 17.5v-5.5M14.5 17.5v-2" />
    </>
  ),
  layers: (
    <>
      <path d="M12 3 3 8l9 5 9-5z" />
      <path d="m3 12.5 9 5 9-5" />
      <path d="m3 16.5 9 5 9-5" />
    </>
  ),
  cube: (
    <>
      <path d="M12 3 4 7.5v9L12 21l8-4.5v-9z" />
      <path d="M4 7.5 12 12l8-4.5M12 12v9" />
    </>
  ),
  grid: (
    <>
      <rect x="3" y="3" width="7" height="7" rx="1.5" />
      <rect x="14" y="3" width="7" height="7" rx="1.5" />
      <rect x="3" y="14" width="7" height="7" rx="1.5" />
      <rect x="14" y="14" width="7" height="7" rx="1.5" />
      <path d="M10 6.5h4M6.5 10v4M17.5 10v4M10 17.5h4" />
    </>
  ),
  chat: (
    <path d="M4 6.5A2.5 2.5 0 0 1 6.5 4h11A2.5 2.5 0 0 1 20 6.5v7a2.5 2.5 0 0 1-2.5 2.5H10l-6 4z" />
  ),
  line: (
    <path d="M12 3.5c4.7 0 8.5 3.05 8.5 6.8 0 3.75-3.8 6.8-8.5 6.8-.6 0-1.18-.05-1.74-.13L6 20.5l.92-3.4C4.83 15.87 3.5 13.7 3.5 11.3c0-3.75 3.8-7.8 8.5-7.8Z" />
  ),
  phone: (
    <path d="M6.4 3.5h3l1.5 4-2 1.5a11 11 0 0 0 5 5l1.5-2 4 1.5v3a2 2 0 0 1-2.2 2A15.5 15.5 0 0 1 4.4 5.7a2 2 0 0 1 2-2.2Z" />
  ),
  mail: (
    <>
      <rect x="3" y="5" width="18" height="14" rx="2.5" />
      <path d="m3.8 7 8.2 5.8L20.2 7" />
    </>
  ),
  arrow: <path d="M5 12h13M12.5 6l6 6-6 6" />,
  chevron: <path d="m6 9.5 6 6 6-6" />,
  close: <path d="M6 6l12 12M18 6 6 18" />,
  search: (
    <>
      <circle cx="11" cy="11" r="7" />
      <path d="m20.5 20.5-4.2-4.2" />
    </>
  ),
  sun: (
    <>
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2v2.2M12 19.8V22M4.2 4.2l1.6 1.6M18.2 18.2l1.6 1.6M2 12h2.2M19.8 12H22M4.2 19.8l1.6-1.6M18.2 5.8l1.6-1.6" />
    </>
  ),
  moon: <path d="M20.5 14.6A8.6 8.6 0 0 1 9.4 3.5a8.6 8.6 0 1 0 11.1 11.1Z" />,
  monitor: (
    <>
      <rect x="2.5" y="4" width="19" height="13" rx="2" />
      <path d="M9 20.5h6M12 17v3.5" />
    </>
  ),
  clock: (
    <>
      <circle cx="12" cy="12" r="8.5" />
      <path d="M12 7v5l3 2" />
    </>
  ),
  tag: (
    <>
      <path d="M3.5 12.5V4h8.5l8.5 8.5-8.5 8.5z" />
      <circle cx="8" cy="8" r="1.2" fill="currentColor" stroke="none" />
    </>
  ),
  megaphone: (
    <>
      <path d="M3 10.5v3a1.5 1.5 0 0 0 1.5 1.5H6l8 4.5v-15L6 9H4.5A1.5 1.5 0 0 0 3 10.5Z" />
      <path d="M17.5 8.5a5 5 0 0 1 0 7" />
      <path d="M14 8v8" />
    </>
  ),
  chip: (
    <>
      <rect x="7" y="7" width="10" height="10" rx="2" />
      <path d="M9.5 3.5V7M14.5 3.5V7M9.5 17v3.5M14.5 17v3.5M3.5 9.5H7M3.5 14.5H7M17 9.5h3.5M17 14.5h3.5" />
      <path d="M10.5 10.5h3v3h-3z" />
    </>
  ),
  shield: (
    <>
      <path d="M12 3 5 6v5.5C5 15.5 8 19 12 21c4-2 7-5.5 7-9.5V6z" />
      <path d="m8.8 12 2.2 2.2 4.2-4.4" />
    </>
  ),
  check: <path d="m5 12.5 4.5 4.5L19 7.5" />,
}

export default function Icon({ name, className = '' }) {
  const d = PATHS[name]
  if (!d) return null
  return (
    <svg
      className={`icon ${className}`}
      viewBox="0 0 24 24"
      width="24"
      height="24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
    >
      {d}
    </svg>
  )
}
