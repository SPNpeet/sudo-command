import { useCallback, useEffect, useRef, useState } from 'react'
import Icon from './Icon'
import Terminal from './Terminal'
import { VISUAL_BY_KEY } from './ServiceVisuals'
import CommandPalette from './CommandPalette'
import FloatingContact from './FloatingContact'
import ServiceModal from './ServiceModal'
import { useDismiss, useLang, useReveal, useScrollSpy, useTheme } from './hooks'
import { DATA, L10N } from './i18n'

// ───────────── ช่องทางติดต่อ ─────────────
// ช่องไหนเว้นว่าง = ปุ่มนั้นจะไม่ขึ้นบนเว็บ (กันปุ่มกดแล้วไม่ไปไหน)
const CONTACT = {
  messenger: 'https://m.me/61590190966678',
  facebook: 'https://www.facebook.com/profile.php?id=61590190966678',
  email: 'sudocoffee.home@gmail.com',
  // ใส่ลิงก์ LINE OA เช่น 'https://lin.ee/xxxxxxx'
  line: 'https://line.me/ti/p/~nongpeetza',
  // ใส่เบอร์จริงแบบสากล เช่น '+66811234567'
  phone: '+66611699332',
  // สมัครฟรีที่ web3forms.com แล้ววาง Access Key ตรงนี้ (ต้องเป็นรูปแบบ UUID)
  // ยังไม่ใส่ = ฟอร์มจะส่งผ่าน mailto แทน
  web3formsKey: '',
}

// คำชมจากลูกค้า — ต้องเป็นข้อความจริงที่พิสูจน์ได้เท่านั้น ว่างไว้ = ส่วนนี้จะไม่ขึ้น
const TESTIMONIALS = []

function SectionHead({ num, title, note }) {
  return (
    <header className="sec-head" data-reveal>
      <span className="sec-num">{num}</span>
      <h2>{title}</h2>
      {note && <p className="sec-note">{note}</p>}
    </header>
  )
}

// ปุ่มกลับขึ้นบน — โผล่เมื่อเลื่อนพ้น hero แล้ว หายเมื่ออยู่บนสุด
// อยู่ซ้ายล่าง กันกับปุ่มติดต่อลอย (ขวาล่าง) ไม่บังกัน
function ScrollTop({ label }) {
  const [shown, setShown] = useState(false)
  useEffect(() => {
    const update = () => setShown(window.scrollY > 480)
    update()
    window.addEventListener('scroll', update, { passive: true })
    return () => window.removeEventListener('scroll', update)
  }, [])
  return (
    <button
      type="button"
      className={`scroll-top ${shown ? 'in' : ''}`}
      aria-label={label}
      onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
    >
      <Icon name="chevron" />
    </button>
  )
}

function App() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [ddOpen, setDdOpen] = useState(false)
  const [paletteOpen, setPaletteOpen] = useState(false)
  const [status, setStatus] = useState('idle') // idle | sending | ok | error | nochan
  const [toast, setToast] = useState('')
  const [theme, setTheme] = useTheme()
  const [lang, setLang] = useLang()
  const [svcOpen, setSvcOpen] = useState(null)
  const [topic, setTopic] = useState('')
  const [faqQ, setFaqQ] = useState('')
  const [msg, setMsg] = useState('')
  const [budget, setBudget] = useState('')
  const [showAllWork, setShowAllWork] = useState(false)
  const [showAllGallery, setShowAllGallery] = useState(false)

  const L = L10N[lang]
  const D = DATA[lang]
  const { services: SERVICES, works: WORKS, steps: STEPS, faqs: FAQS, scenes: SCENES } = D
  const GALLERY = L.gallery.items
  const BUDGETS = L.contact.budgets.map((label, i) => ({ id: `b-${i}`, label }))
  const THEMES = [
    { id: 'light', icon: 'sun', label: L.ui.themeLight },
    { id: 'dark', icon: 'moon', label: L.ui.themeDark },
    { id: 'system', icon: 'monitor', label: L.ui.themeSystem },
  ]
  const CHANNELS = [
    { key: 'messenger', icon: 'chat', label: L.paletteActions.messenger, href: CONTACT.messenger },
    { key: 'line', icon: 'line', label: L.paletteActions.line, href: CONTACT.line },
    { key: 'phone', icon: 'phone', label: CONTACT.phone, href: `tel:${CONTACT.phone}` },
    { key: 'email', icon: 'mail', label: CONTACT.email, href: `mailto:${CONTACT.email}` },
  ].filter((c) => CONTACT[c.key])

  // meta ของหน้าเปลี่ยนตามภาษา — title, lang, description
  useEffect(() => {
    document.documentElement.lang = L.meta.lang
    document.title = L.meta.title
    const md = document.querySelector('meta[name="description"]')
    if (md) md.setAttribute('content', L.meta.description)
  }, [L])

  const ddRef = useRef(null)
  const ddBtnRef = useRef(null)

  const order = [
    'paths',
    'services',
    'why',
    'about',
    ...(WORKS.length ? ['work'] : []),
    'gallery',
    ...(TESTIMONIALS.length ? ['testimonials'] : []),
    'process',
    'perks',
    'faq',
    'contact',
  ]
  const numOf = (id) => String(order.indexOf(id) + 1).padStart(2, '0')
  const active = useScrollSpy(order)
  useReveal([WORKS.length, CONTACT.web3formsKey, lang, GALLERY.length])

  const closeDd = useCallback(() => setDdOpen(false), [])
  useDismiss(ddRef, ddOpen, closeDd)

  // คีย์บอร์ดใน dropdown: ArrowDown/ArrowUp เลื่อนเลือก, Home/End โดด, Esc ปิด
  const onDdKeyDown = useCallback(
    (e) => {
      if (e.key === 'ArrowDown' && !ddOpen) {
        e.preventDefault()
        setDdOpen(true)
        return
      }
      const links = [...(ddRef.current?.querySelectorAll('a') || [])]
      if (!links.length) return
      const idx = links.indexOf(document.activeElement)

      if (e.key === 'ArrowDown') {
        e.preventDefault()
        const next = idx === -1 ? 0 : (idx + 1) % links.length
        links[next].focus()
      } else if (e.key === 'ArrowUp') {
        e.preventDefault()
        const prev = idx <= 0 ? links.length - 1 : idx - 1
        links[prev].focus()
      } else if (e.key === 'Home' || e.key === 'End') {
        e.preventDefault()
        links[e.key === 'Home' ? 0 : links.length - 1].focus()
      }
    },
    [ddOpen],
  )

  // เปิดเมนูแล้ว focus ลิงก์แรกทันที — คนที่เปิดด้วยคีย์บอร์ดเดินต่อได้เลย
  useEffect(() => {
    if (!ddOpen) return
    ddRef.current?.querySelector('a')?.focus()
  }, [ddOpen])

  const goto = useCallback((id) => {
    const el = document.getElementById(id)
    if (!el) return
    el.scrollIntoView({ behavior: 'smooth', block: 'start' })
    el.focus({ preventScroll: true })
  }, [])

  const nav = (id) => (e) => {
    e.preventDefault()
    setMenuOpen(false)
    setDdOpen(false)
    goto(id)
  }

  const flash = useCallback((msg) => {
    setToast(msg)
    window.clearTimeout(flash._t)
    flash._t = window.setTimeout(() => setToast(''), 2600)
  }, [])

  const copyEmail = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(CONTACT.email)
      flash(`${L.toast.copy}${CONTACT.email}`)
    } catch {
      flash(L.toast.copyFail)
    }
  }, [flash, L])

  // Ctrl+K / ⌘K เปิด command palette
  useEffect(() => {
    const onKey = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault()
        setPaletteOpen((v) => !v)
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  const openExternal = (url) => () => window.open(url, '_blank', 'noopener,noreferrer')

  const actions = [
    ...SERVICES.map((s) => ({
      id: s.id,
      icon: s.icon,
      label: s.title,
      hint: s.short,
      keywords: L.paletteActions.kw.services,
      run: () => goto(s.id),
    })),
    ...(WORKS.length
      ? [
          {
            id: 'go-work',
            icon: 'layers',
            label: L.paletteActions.goWork,
            keywords: L.paletteActions.kw.work,
            run: () => goto('work'),
          },
        ]
      : []),
    ...(GALLERY.length
      ? [
          {
            id: 'go-gallery',
            icon: 'grid',
            label: L.paletteActions.goGallery,
            keywords: L.paletteActions.kw.gallery,
            run: () => goto('gallery'),
          },
        ]
      : []),
    {
      id: 'go-process',
      icon: 'grid',
      label: L.paletteActions.goProcess,
      hint: L.paletteActions.goProcessHint,
      keywords: L.paletteActions.kw.process,
      run: () => goto('process'),
    },
    {
      id: 'go-faq',
      icon: 'search',
      label: L.paletteActions.goFaq,
      hint: L.paletteActions.goFaqHint,
      keywords: L.paletteActions.kw.faq,
      run: () => goto('faq'),
    },
    {
      id: 'go-contact',
      icon: 'arrow',
      label: L.paletteActions.goContact,
      keywords: L.paletteActions.kw.contact,
      run: () => goto('contact'),
    },
    {
      id: 'messenger',
      icon: 'chat',
      label: L.paletteActions.messenger,
      hint: L.paletteActions.messengerHint,
      keywords: L.paletteActions.kw.messenger,
      run: openExternal(CONTACT.messenger),
    },
    ...(CONTACT.line
      ? [
          {
            id: 'line',
            icon: 'line',
            label: L.paletteActions.line,
            hint: L.paletteActions.messengerHint,
            keywords: L.paletteActions.kw.line,
            run: openExternal(CONTACT.line),
          },
        ]
      : []),
    ...(CONTACT.phone
      ? [
          {
            id: 'phone',
            icon: 'phone',
            label: `${L.paletteActions.phone} ${CONTACT.phone}`,
            keywords: L.paletteActions.kw.phone,
            run: () => {
              window.location.href = `tel:${CONTACT.phone}`
            },
          },
        ]
      : []),
    {
      id: 'copy-email',
      icon: 'mail',
      label: L.paletteActions.copyEmail,
      hint: CONTACT.email,
      keywords: L.paletteActions.kw.email,
      run: copyEmail,
    },
    {
      id: 'facebook',
      icon: 'chat',
      label: L.paletteActions.facebook,
      keywords: L.paletteActions.kw.facebook,
      run: openExternal(CONTACT.facebook),
    },
    {
      id: 'curtain-web',
      icon: 'web',
      label: L.paletteActions.curtain,
      hint: L.paletteActions.curtainHint,
      keywords: L.paletteActions.kw.curtain,
      run: openExternal('https://curtainstoryhome.com'),
    },
    ...THEMES.map((t) => ({
      id: `theme-${t.id}`,
      icon: t.icon,
      label: t.label,
      hint: theme === t.id ? L.paletteActions.themeHint : undefined,
      keywords: L.paletteActions.kw.theme,
      run: () => setTheme(t.id),
    })),
  ]

  const sendForm = async (e) => {
    e.preventDefault()
    const form = e.target
    const data = new FormData(form)
    const payload = {
      name: data.get('name') || '',
      email: data.get('email') || '',
      line: data.get('line') || '',
      phone: data.get('phone') || '',
      topic: data.get('topic') || '',
      budget: data.get('budget') || '',
      message: data.get('message') || '',
    }

    // ลูกค้าฝากช่องทางติดต่อไว้ก็พอ — แต่ต้องมีอย่างน้อย 1 ช่องทาง
    if (!payload.email && !payload.line && !payload.phone) {
      setStatus('nochan')
      return
    }

    if (!CONTACT.web3formsKey) {
      const subject = encodeURIComponent(`New lead from website: ${payload.topic || 'interested'} (${payload.budget || 'no budget'})`)
      const body = encodeURIComponent(
        `Name: ${payload.name}\nEmail: ${payload.email || '-'}\nLINE: ${payload.line || '-'}\nPhone: ${payload.phone || '-'}\nTopic: ${payload.topic || '-'}\nBudget: ${payload.budget || '-'}\n\nMessage:\n${payload.message || '-'}`
      )
      window.location.href = `mailto:${CONTACT.email}?subject=${subject}&body=${body}`
      return
    }

    setStatus('sending')

    data.append('access_key', CONTACT.web3formsKey)
    data.append('subject', `New lead from Sudo Command — ${payload.topic || 'interested'} (${payload.budget || 'no budget'})`)

    try {
      const res = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        body: data,
      })
      const json = await res.json()
      if (json.success) {
        setStatus('ok')
        form.reset()
        setMsg('')
        setTopic('')
        setBudget('')
      } else {
        setStatus('error')
      }
    } catch {
      setStatus('error')
    }
  }

  const msgTemplate = (id) => {
    const s = SERVICES.find((x) => x.id === id)
    return lang === 'th' ? `สวัสดีครับ สนใจบริการ ${s.title} ครับ` : `Hi, I'm interested in your ${s.title} service.`
  }

  return (
    <>
      <a className="skip" href="#main">
        {L.ui.skip}
      </a>

      <header className="site-head">
        <div className="wrap head-inner">
          <a className="brand" href="#top" onClick={nav('top')}>
            <img
              className="brand-mark"
              src="/sudo-command/favicon.svg"
              alt=""
              width="32"
              height="32"
            />
            <span className="brand-name">
              Sudo Command
              <span className="brand-sub">{L.ui.brandSub}</span>
            </span>
          </a>

          <nav id="site-nav" className={`site-nav ${menuOpen ? 'open' : ''}`} aria-label={L.ui.mainLabel}>
            <div className="dd" ref={ddRef} onKeyDown={onDdKeyDown}>
              <button
                type="button"
                ref={ddBtnRef}
                className={`dd-btn ${active === 'services' ? 'is-active' : ''}`}
                aria-expanded={ddOpen}
                aria-controls="dd-panel"
                onClick={() => setDdOpen((v) => !v)}
              >
                {L.ui.navServices}
                <Icon name="chevron" className={`dd-caret ${ddOpen ? 'up' : ''}`} />
              </button>

              <div id="dd-panel" className="dd-panel" hidden={!ddOpen}>
                <ul>
                  {SERVICES.map((s) => (
                    <li key={s.id}>
                      <a href={`#${s.id}`} onClick={nav(s.id)}>
                        <span className="dd-ic">
                          <Icon name={s.icon} />
                        </span>
                        <span className="dd-text">
                          <strong>{s.title}</strong>
                          <small>{s.short}</small>
                        </span>
                      </a>
                    </li>
                  ))}
                </ul>
                <a className="dd-all" href="#services" onClick={nav('services')}>
                  {L.ui.navServices}
                  <Icon name="arrow" />
                </a>
              </div>
            </div>

            {WORKS.length > 0 && (
              <a
                href="#work"
                className={active === 'work' ? 'is-active' : ''}
                aria-current={active === 'work' ? 'true' : undefined}
                onClick={nav('work')}
              >
                {L.ui.navWork}
              </a>
            )}
            <a
              href="#process"
              className={active === 'process' ? 'is-active' : ''}
              aria-current={active === 'process' ? 'true' : undefined}
              onClick={nav('process')}
            >
              {L.ui.navProcess}
            </a>
            <a
              href="#faq"
              className={active === 'faq' ? 'is-active' : ''}
              aria-current={active === 'faq' ? 'true' : undefined}
              onClick={nav('faq')}
            >
              {L.ui.navFaq}
            </a>
            <a
              href="#contact"
              className={active === 'contact' ? 'is-active' : ''}
              aria-current={active === 'contact' ? 'true' : undefined}
              onClick={nav('contact')}
            >
              {L.ui.navContact}
            </a>

            <div className="theme-switch" role="group" aria-label={L.ui.themeGroup}>
              {THEMES.map((t) => (
                <button
                  key={t.id}
                  type="button"
                  className={theme === t.id ? 'on' : ''}
                  aria-pressed={theme === t.id}
                  title={t.label}
                  onClick={() => setTheme(t.id)}
                >
                  <Icon name={t.icon} />
                  <span className="sr-only">{t.label}</span>
                </button>
              ))}
            </div>

            <div className="theme-switch lang-switch" role="group" aria-label={L.ui.langGroup}>
              <button
                type="button"
                className={lang === 'th' ? 'on' : ''}
                aria-pressed={lang === 'th'}
                onClick={() => setLang('th')}
              >
                ไทย
              </button>
              <button
                type="button"
                className={lang === 'en' ? 'on' : ''}
                aria-pressed={lang === 'en'}
                onClick={() => setLang('en')}
              >
                EN
              </button>
            </div>

            <a className="btn btn-solid nav-cta" href="#contact" onClick={nav('contact')}>
              {L.ui.navCta}
            </a>
          </nav>

          <button
            type="button"
            className="cmdk-trigger"
            onClick={() => setPaletteOpen(true)}
            title={L.ui.searchTitle}
          >
            <Icon name="search" />
            <span className="cmdk-trigger-label">{L.ui.search}</span>
            <kbd>Ctrl K</kbd>
          </button>

          <button
            type="button"
            className="menu-btn"
            aria-expanded={menuOpen}
            aria-controls="site-nav"
            onClick={() => setMenuOpen((v) => !v)}
          >
            {menuOpen ? L.ui.menuOpen : L.ui.menuClose}
          </button>
        </div>
      </header>

      <main id="main" tabIndex={-1}>
        <section className="hero" id="top" tabIndex={-1}>
          <div className="wrap hero-grid">
            <div className="hero-copy">
              <p className="eyebrow">{L.hero.eyebrow}</p>
              <h1>
                {L.hero.title1}
                <br />
                <em>{L.hero.title2}</em>
              </h1>
              <p className="lede">{L.hero.lede}</p>
              <div className="cta">
                <a className="btn btn-solid" href="#contact" onClick={nav('contact')}>
                  {L.hero.cta1}
                  <Icon name="arrow" />
                </a>
                <a className="btn btn-line" href="#services" onClick={nav('services')}>
                  <Icon name="layers" />
                  {L.hero.cta2}
                </a>
              </div>
              <p className="hero-note">{L.hero.note}</p>
              <p className="hero-proof">
                <Icon name="shield" />
                {L.hero.proof}
                <span className="hero-proof-client">{L.hero.proofClient}</span>
              </p>
            </div>

            <Terminal scenes={SCENES} ui={L.hero} />
          </div>
        </section>

        <section className="trust" aria-label={L.trustLabel}>
          <div className="wrap trust-grid">
            {L.trust.map((t, i) => (
              <div className="trust-item" key={i} data-reveal>
                <strong className="trust-num">
                  {t.num} {t.unit && <span className="trust-unit">{t.unit}</span>}
                </strong>
                <span className="trust-cap">{t.cap}</span>
              </div>
            ))}
          </div>
        </section>

        <section className="band" aria-label={L.bandLabel}>
          <div className="wrap band-grid">
            {L.band.map((b, i) => (
              <p key={i}>
                <span className="band-num">{String(i + 1).padStart(2, '0')}</span>
                <strong>{b.strong}</strong>
                {b.text}
              </p>
            ))}
          </div>
        </section>

        <section className="sec" aria-label={L.paths.label} id="paths" tabIndex={-1}>
          <div className="wrap">
            <SectionHead num={numOf('paths')} title={L.paths.head} note={L.paths.note} />
            <div className="paths-grid">
              {[L.paths.sme, L.paths.gov].map((p, i) => (
                <div className={`path path-${i === 0 ? 'sme' : 'gov'}`} key={p.title} data-reveal>
                  <p className="path-eyebrow">{p.eyebrow}</p>
                  <h3>{p.title}</h3>
                  <p className="path-desc">{p.desc}</p>
                  <ul className="path-items">
                    {p.items.map((it) => (
                      <li key={it}>
                        <Icon name="check" />
                        {it}
                      </li>
                    ))}
                  </ul>
                  <a
                    className="btn btn-line"
                    href={i === 0 ? '#services' : '#contact'}
                    onClick={i === 0 ? nav('services') : nav('contact')}
                  >
                    {p.cta}
                    <Icon name="arrow" />
                  </a>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="sec why" aria-label={L.why.label} id="why" tabIndex={-1}>
          <div className="wrap">
            <SectionHead num={numOf('why')} title={L.why.head} note={L.why.note} />
            <ul className="why-list">
              {L.why.items.map((w, i) => (
                <li key={w.title} data-reveal>
                  <span className="why-num">{String(i + 1).padStart(2, '0')}</span>
                  <span className="why-ic" aria-hidden="true">
                    <Icon name={w.icon} />
                  </span>
                  <h3>{w.title}</h3>
                  <p>{w.text}</p>
                </li>
              ))}
            </ul>
          </div>
        </section>

        <section className="sec" aria-label={L.about.label} id="about" tabIndex={-1}>
          <div className="wrap">
            <SectionHead num={numOf('about')} title={L.about.head} note={L.about.note} />
            <ul className="perk-list about-list">
              {L.about.items.map((p) => (
                <li key={p.title} data-reveal>
                  <Icon name={p.icon} />
                  <h3>{p.title}</h3>
                  <p>{p.text}</p>
                </li>
              ))}
            </ul>
          </div>
        </section>

        <section className="sec" id="services" tabIndex={-1}>
          <div className="wrap">
            <SectionHead num={numOf('services')} title={L.services.head} note={L.services.note} />
            <div className="svc-ladder" aria-label={L.services.ladderLabel}>
              <span className="svc-ladder-label">{L.services.ladderLabel}</span>
              <ol>
                {L.services.ladder.map((rung, i) => (
                  <li key={i}>{rung}</li>
                ))}
              </ol>
            </div>
            {['sme', 'gov'].map((grp) => {
              const group = SERVICES.filter((s) => s.group === grp)
              if (!group.length) return null
              return (
                <div className="svc-group" key={grp}>
                  <p className="svc-group-title">
                    <strong>{grp === 'sme' ? L.services.groupSme : L.services.groupGov}</strong>
                    <span>{grp === 'sme' ? L.services.groupSmeNote : L.services.groupGovNote}</span>
                  </p>
                  <ul className="svc-list">
                    {group.map((s) => {
                      const Visual = VISUAL_BY_KEY[s.visual]
                      const open = () => setSvcOpen(s.id)
                      return (
                        <li
                          className={`svc svc-${s.id}`}
                          id={s.id}
                          key={s.id}
                          tabIndex={-1}
                          data-reveal
                        >
                          <button
                            type="button"
                            className="svc-visual"
                            onClick={open}
                            aria-label={`${L.services.viewAria} ${s.title}`}
                          >
                            {Visual && <Visual label={s.title} />}
                          </button>
                          <div className="svc-body">
                            <h3>{s.title}</h3>
                            <p className="svc-short">{s.short}</p>
                            <div className="svc-foot">
                              <span className="svc-quote">
                                {s.price && <strong className="svc-price">{s.price}</strong>}
                                {L.services.quote}
                              </span>
                              <div className="svc-actions">
                                <button type="button" className="btn btn-line btn-sm" onClick={open}>
                                  {L.services.details}
                                </button>
                                <a className="btn btn-solid btn-sm" href="#contact" onClick={nav('contact')}>
                                  {L.services.quoteBtn}
                                </a>
                              </div>
                            </div>
                          </div>
                        </li>
                      )
                    })}
                  </ul>
                </div>
              )
            })}
          </div>
        </section>

        {WORKS.length > 0 && (
          <section className="sec sec-alt" id="work" tabIndex={-1}>
            <div className="wrap">
              <SectionHead num={numOf('work')} title={L.work.head} note={L.work.note} />
              <ul className="work-list">
                {(showAllWork ? WORKS : WORKS.slice(0, 3)).map((w) => {
                  const WVisual = VISUAL_BY_KEY[w.visual]
                  return (
                    <li className="work" key={w.title} data-reveal>
                      <div className="work-visual" aria-hidden="true">
                        {WVisual && <WVisual label={w.title} />}
                      </div>
                      <div className="work-body">
                        {w.client && <p className="work-client">{w.client}</p>}
                        <h3>{w.title}</h3>
                        <p>{w.desc}</p>
                        {w.metric && (
                          <p className="work-metric">
                            <span className="work-metric-label">{L.work.metricLabel}</span>
                            {w.metric}
                          </p>
                        )}
                        {w.tags?.length > 0 && (
                          <ul className="tags">
                            {w.tags.map((t) => (
                              <li key={t}>{t}</li>
                            ))}
                          </ul>
                        )}
                        {w.href && (
                          <a className="work-link" href={w.href} target="_blank" rel="noopener noreferrer">
                            {L.work.visitLabel} <Icon name="arrow" />
                          </a>
                        )}
                      </div>
                    </li>
                  )
                })}
              </ul>
              {WORKS.length > 3 && (
                <button
                  type="button"
                  className="btn btn-line"
                  onClick={() => setShowAllWork((v) => !v)}
                  style={{ marginTop: 'var(--s6)', minHeight: '44px' }}
                >
                  {showAllWork ? L.work.showLess : `${L.work.showAll} (${WORKS.length})`}
                  <Icon name={showAllWork ? 'close' : 'chevron'} />
                </button>
              )}
            </div>
          </section>
        )}

        {TESTIMONIALS.length > 0 && (
          <section className="sec" id="testimonials" tabIndex={-1}>
            <div className="wrap">
              <SectionHead num={numOf('testimonials')} title={L.testimonials.head} note={L.testimonials.note} />
              <ul className="tst-list">
                {TESTIMONIALS.map((t) => (
                  <li key={t.from} data-reveal>
                    <blockquote>“{t.quote}”</blockquote>
                    <footer>
                      <strong>{t.from}</strong>
                      {t.context && <span>{t.context}</span>}
                    </footer>
                  </li>
                ))}
              </ul>
            </div>
          </section>
        )}

        {GALLERY.length > 0 && (
          <section className="sec sec-alt" id="gallery" tabIndex={-1}>
            <div className="wrap">
              <SectionHead num={numOf('gallery')} title={L.gallery.head} note={L.gallery.note} />
              <ul className="gallery-list">
                {(showAllGallery ? GALLERY : GALLERY.slice(0, 2)).map((g) => (
                  <li key={g.src} data-reveal>
                    <figure className="gallery-item">
                      <img
                        className="gallery-photo"
                        src={g.src}
                        alt={g.title}
                        width="720"
                        loading="lazy"
                        decoding="async"
                      />
                      <figcaption>
                        <strong>{g.title}</strong>
                        <span>{g.cap}</span>
                      </figcaption>
                    </figure>
                  </li>
                ))}
              </ul>
              {GALLERY.length > 2 && (
                <button
                  type="button"
                  className="btn btn-line"
                  onClick={() => setShowAllGallery((v) => !v)}
                  style={{ marginTop: 'var(--s6)', minHeight: '44px' }}
                >
                  {showAllGallery ? L.gallery.showLess : `${L.gallery.showAll} (${GALLERY.length})`}
                  <Icon name={showAllGallery ? 'close' : 'chevron'} />
                </button>
              )}
            </div>
          </section>
        )}

        <section className="sec sec-alt" id="process" tabIndex={-1}>
          <div className="wrap">
            <SectionHead num={numOf('process')} title={L.process.head} note={L.process.note} />
            <ol className="steps">
              {STEPS.map((s, i) => (
                <li key={s.title} data-reveal>
                  <span className="step-num">{String(i + 1).padStart(2, '0')}</span>
                  <h3>{s.title}</h3>
                  <div className="step-meta">
                    <span className="step-time">
                      <Icon name="clock" />
                      <span>{s.time}</span>
                    </span>
                    <span className="step-cost">
                      <Icon name="tag" />
                      <span>{s.cost}</span>
                    </span>
                  </div>
                  <p>{s.desc}</p>
                </li>
              ))}
            </ol>
          </div>
        </section>

        <section className="sec" id="perks" tabIndex={-1}>
          <div className="wrap">
            <SectionHead num={numOf('perks')} title={L.perks.head} note={L.perks.note} />
            <ul className="perk-list">
              {L.perks.items.map((p) => (
                <li key={p.title} data-reveal>
                  <Icon name={p.icon} />
                  <h3>{p.title}</h3>
                  <p>{p.text}</p>
                </li>
              ))}
            </ul>
          </div>
        </section>

        <section className="sec" id="faq" tabIndex={-1}>
          <div className="wrap">
            <SectionHead num={numOf('faq')} title={L.faq.head} note={L.faq.note} />
            <div className="faq-search" role="search">
              <Icon name="search" />
              <input
                type="search"
                placeholder={L.faq.searchPh}
                aria-label={L.faq.searchAria}
                value={faqQ}
                onChange={(e) => setFaqQ(e.target.value)}
              />
              {faqQ.trim() && (
                <button type="button" className="faq-clear" onClick={() => setFaqQ('')}>
                  {L.faq.clear}
                  <Icon name="close" />
                </button>
              )}
            </div>
            <ul className={`faq ${faqQ.trim() ? 'faq-filtered' : ''}`}>
              {FAQS.filter((f) => !faqQ.trim() || (f.q + f.a).includes(faqQ.trim())).map((f) => (
                <li key={f.q} data-reveal>
                  <details>
                    <summary>
                      <span>{f.q}</span>
                      <Icon name="chevron" className="faq-caret" />
                    </summary>
                    <p>
                      <span>{f.a}</span>
                    </p>
                  </details>
                </li>
              ))}
              {faqQ.trim() && !FAQS.some((f) => (f.q + f.a).includes(faqQ.trim())) && (
                <li className="faq-none">
                  <p>{L.faq.none}</p>
                </li>
              )}
            </ul>
          </div>
        </section>

        <section className="sec" id="contact" tabIndex={-1}>
          <div className="wrap">
            <SectionHead num={numOf('contact')} title={L.contact.head} note={L.contact.note} />

            <div className="contact-grid">
              <div data-reveal>
                <ul className="channels">
                  {CHANNELS.map((c) => {
                    const external = c.href.startsWith('http')
                    const topicText = topic
                      ? ` ${msgTemplate(topic)}`
                      : ''
                    const href =
                      c.key === 'messenger' && topic
                        ? `${c.href}?text=${encodeURIComponent(topicText.trim())}`
                        : c.href
                    return (
                      <li key={c.key}>
                        <a
                          className="channel"
                          href={href}
                          target={external ? '_blank' : undefined}
                          rel={external ? 'noopener noreferrer' : undefined}
                        >
                          <Icon name={c.icon} />
                          <span>
                            {c.label}
                            {c.key === 'messenger' && topic && ` · ${L.contact.msgReady}`}
                          </span>
                          <Icon name="arrow" className="channel-go" />
                        </a>
                      </li>
                    )
                  })}
                </ul>

                <p className="fine">
                  {L.contact.channelsNote}{' '}
                  <a href={CONTACT.facebook} target="_blank" rel="noopener noreferrer">
                    Sudo Command
                  </a>
                </p>
              </div>

              <form className="form" onSubmit={sendForm} data-reveal>
                <div className="field">
                  <label htmlFor="f-name">{L.contact.formName}</label>
                  <input id="f-name" name="name" type="text" required placeholder={L.contact.formNamePh} />
                </div>
                <div className="field">
                  <span className="field-label" id="f-chan-label">
                    {L.contact.formChan}
                    <span className="opt"> {L.contact.formChanOpt}</span>
                  </span>
                  <div className="field-chan" role="group" aria-labelledby="f-chan-label">
                    <label className="sr-only" htmlFor="f-email">{L.contact.fEmail}</label>
                    <input id="f-email" name="email" type="email" placeholder={L.contact.fEmailPh} />
                    <label className="sr-only" htmlFor="f-line">{L.contact.fLine}</label>
                    <input id="f-line" name="line" type="text" placeholder={L.contact.fLinePh} />
                    <label className="sr-only" htmlFor="f-phone">{L.contact.fPhone}</label>
                    <input id="f-phone" name="phone" type="tel" placeholder={L.contact.fPhonePh} />
                  </div>
                </div>
                <div className="field">
                  <span className="field-label" id="f-topic-label">
                    {L.contact.formTopic}
                  </span>
                  <input type="hidden" name="topic" value={topic} />
                  <div className="field-chips" role="group" aria-labelledby="f-topic-label">
                    {SERVICES.map((s) => (
                      <button
                        key={s.id}
                        type="button"
                        className={topic === s.id ? 'on' : ''}
                        aria-pressed={topic === s.id}
                        onClick={() => {
                          const next = topic === s.id ? '' : s.id
                          setTopic(next)
                          if (next) setMsg(msgTemplate(next))
                        }}
                      >
                        {s.title}
                      </button>
                    ))}
                  </div>
                </div>
                <div className="field">
                  <span className="field-label" id="f-budget-label">
                    {L.contact.formBudget}
                    <span className="opt"> {L.contact.formBudgetOpt}</span>
                  </span>
                  <div className="field-chips" role="radiogroup" aria-labelledby="f-budget-label">
                    {BUDGETS.map((b) => (
                      <label key={b.id} className={`field-chip ${budget === b.id ? 'on' : ''}`}>
                        <input
                          type="radio"
                          name="budget"
                          value={b.label}
                          checked={budget === b.id}
                          onChange={() => setBudget(b.id)}
                        />
                        <span>{b.label}</span>
                      </label>
                    ))}
                  </div>
                </div>
                <div className="field">
                  <label htmlFor="f-msg">
                    {L.contact.formMsg} <span className="opt">{L.contact.formMsgOpt}</span>
                  </label>
                  <textarea
                    id="f-msg"
                    name="message"
                    rows="3"
                    value={msg}
                    onChange={(e) => setMsg(e.target.value)}
                    placeholder={L.contact.formMsgPh}
                  />
                </div>

                <button type="submit" className="btn btn-solid" disabled={status === 'sending'}>
                  {status === 'sending' ? L.contact.sending : L.contact.submit}
                  {status !== 'sending' && <Icon name="arrow" />}
                </button>

                <p className="form-msg" role="status" aria-live="polite">
                  {status === 'ok' && <span className="ok">{L.contact.ok}</span>}
                  {status === 'error' && <span className="err">{L.contact.error}</span>}
                  {status === 'nochan' && <span className="err">{L.contact.nochan}</span>}
                </p>
                <p className="fine">
                  {CONTACT.web3formsKey ? L.contact.fineKey : L.contact.fineNoKey}
                </p>
              </form>
            </div>
          </div>
        </section>
      </main>

      <footer className="site-foot">
        <div className="wrap">
          <p className="foot-say">{L.footer.say}</p>
          <div className="foot-grid">
            <div className="foot-brand">
              <p className="foot-name">
                <img src="/sudo-command/favicon.svg" alt="" width="20" height="20" />
                Sudo Command
              </p>
              <p className="foot-tag">{L.footer.tag}</p>
            </div>
            <nav className="foot-nav" aria-label={L.ui.mainLabel}>
              <p className="foot-h">{L.footer.menu}</p>
              <ul>
                <li><a href="#services" onClick={nav('services')}>{L.ui.navServices}</a></li>
                {WORKS.length > 0 && (
                  <li><a href="#work" onClick={nav('work')}>{L.ui.navWork}</a></li>
                )}
                <li><a href="#process" onClick={nav('process')}>{L.ui.navProcess}</a></li>
                <li><a href="#faq" onClick={nav('faq')}>{L.ui.navFaq}</a></li>
                <li><a href="#contact" onClick={nav('contact')}>{L.ui.navContact}</a></li>
              </ul>
            </nav>
            <div className="foot-channels">
              <p className="foot-h">{L.footer.channels}</p>
              <ul>
                {CHANNELS.map((c) => {
                  const external = c.href.startsWith('http')
                  return (
                    <li key={c.key}>
                      <a
                        href={c.href}
                        target={external ? '_blank' : undefined}
                        rel={external ? 'noopener noreferrer' : undefined}
                      >
                        {c.label}
                      </a>
                    </li>
                  )
                })}
              </ul>
            </div>
          </div>
          <div className="foot-inner">
            <p>© {new Date().getFullYear()} Sudo Command — บางมด กรุงเทพฯ</p>
            <a className="foot-top" href="#top" onClick={nav('top')}>
              {L.footer.top}
              <Icon name="chevron" />
            </a>
          </div>
        </div>
      </footer>

      <FloatingContact channels={CHANNELS} t={L} />

      <ScrollTop label={L.ui.scrollTop} />

      <CommandPalette
        open={paletteOpen}
        onClose={() => setPaletteOpen(false)}
        actions={actions}
        t={L}
      />

      <ServiceModal
        service={SERVICES.find((s) => s.id === svcOpen)}
        t={L}
        onClose={() => setSvcOpen(null)}
        onQuote={() => {
          setSvcOpen(null)
          goto('contact')
        }}
      />

      <div className="toast" role="status" aria-live="polite">
        {toast && <span>{toast}</span>}
      </div>
    </>
  )
}

export default App
