import { useCallback, useEffect, useRef, useState } from 'react'
import { DATA, L10N, PACKS, CATS } from './i18n'
import { STUDIO } from './studio-copy'
import { UX } from './ux-copy'
import ReelShowcase from './ReelShowcase'
import ClientShowcase from './ClientShowcase'
import SignalField from './SignalField'
import ProjectPreview from './ProjectPreview'
import { useLang, useTheme } from './hooks'
import { SEARCH_PAGES } from './search-pages'
import Icon from './Icon'
import CommandPalette from './CommandPalette'
const BASE = '/sudo-command/'
const CONTACT = { line: 'https://line.me/ti/p/~nongpeetza', messenger: 'https://m.me/61590190966678', email: 'sudocoffee.home@gmail.com', phone: '+66611699332' }
const NAV_IDS = ['work', 'services', 'process', 'faq', 'contact']
const TYPE = ['web', 'app', 'app', 'web', 'web', 'app', 'web', 'app']
const HERO_IMAGES = [0, 1, 2]

function Mark({ className = '' }) {
  return <img className={`s-mark ${className}`} src={`${BASE}favicon.svg?v=original`} width="100" height="100" alt="" aria-hidden="true"/>
}
function Arrow() { return <Icon name="arrow" /> }
function External({ href, children, className = '' }) { return <a className={className} href={href} target="_blank" rel="noopener noreferrer">{children}<Arrow /></a> }
function Heading({ eyebrow, title, note }) { return <header className="s-section-head"><p className="s-kicker">{eyebrow}</p><h2>{title}</h2>{note && <p className="s-section-note">{note}</p>}</header> }

export default function Studio() {
  const [lang, setLang] = useLang()
  const [theme, setTheme] = useTheme()
  const [hero, setHero] = useState(0)
  const [motionPaused, setMotionPaused] = useState(false)
  const [filter, setFilter] = useState('all')
  const [need, setNeed] = useState(0)
  const [query, setQuery] = useState('')
  const [palette, setPalette] = useState(false)
  const [business, setBusiness] = useState('')
  const [brief, setBrief] = useState('')
  const [service, setService] = useState('')
  const [copyStatus, setCopyStatus] = useState('')
  const [preview, setPreview] = useState(null)
  const [manualCopy, setManualCopy] = useState(false)
  const briefPreview = useRef(null)
  const [contactVisible, setContactVisible] = useState(false)
  const menu = useRef(null)
  const menuSummary = useRef(null)
  const T = STUDIO[lang], L = L10N[lang], D = DATA[lang], U = UX[lang]
  const images = L.gallery.items
  const selected = images[HERO_IMAGES[hero]]
  const cases = images.map((item, index) => ({ ...item, number: index + 1, type: TYPE[index] || 'web', typeLabel: T.caseTypes[index] || T.filters[1] }))
  const visibleCases = cases.filter(item => filter === 'all' || item.type === filter)
  const suggestion = T.suggestions[need]
  const closePalette = useCallback(() => setPalette(false), [])
  const closeMenu = () => { if (menu.current) menu.current.open = false }
  const go = (id) => {
    closeMenu()
    const element = document.getElementById(id)
    if (!element) return
    if (element.tagName === 'DETAILS') element.open = true
    window.location.hash = id
    element.focus({ preventScroll: true })
    element.scrollIntoView({ behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth' })
  }
  useEffect(() => {
    document.title = L.meta.title
    document.documentElement.lang = L.meta.lang
    document.querySelector('meta[name="description"]')?.setAttribute('content', L.meta.description)
  }, [L])
  useEffect(() => {
    const onKey = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') { e.preventDefault(); if (!document.querySelector('.s-preview[open]')) { closeMenu(); setPalette(v => !v) } }
      if (e.key === 'Escape' && menu.current?.open) { menu.current.open = false; menuSummary.current?.focus() }
    }
    const onPointer = (e) => { if (menu.current?.open && !menu.current.contains(e.target)) menu.current.open = false }
    document.addEventListener('keydown', onKey)
    document.addEventListener('pointerdown', onPointer)
    // Support existing shared section links after the React tree is mounted.
    const followHash = () => {
      if (['#gallery','#astro-trader','#truck-reels'].includes(window.location.hash)) setFilter('all')
      window.setTimeout(() => {
      let id
      try { id = decodeURIComponent(window.location.hash.slice(1)) } catch { return }
      const target = document.getElementById(id)
      if (target?.tagName === 'DETAILS') target.open = true
      if (target) target.scrollIntoView({ behavior: 'instant' })
      }, 0)
    }
    followHash()
    window.addEventListener('hashchange', followHash)
    const observer = 'IntersectionObserver' in window ? new IntersectionObserver(([entry]) => setContactVisible(entry.isIntersecting), { threshold: 0 }) : null
    const contact = document.getElementById('contact')
    if (contact) observer?.observe(contact)
    return () => { document.removeEventListener('keydown', onKey); document.removeEventListener('pointerdown', onPointer); window.removeEventListener('hashchange', followHash); observer?.disconnect() }
  }, [])
  const actions = [
    ...NAV_IDS.map((id, i) => ({ id, icon: id === 'contact' ? 'chat' : 'arrow', label: T.nav[i], keywords: [id, ...(L.paletteKeywords?.[id] || [])], run: () => go(id) })),
    ...D.services.map(s => ({ id: s.id, icon: s.icon, label: s.title, hint: s.short, run: () => go(s.id) })),
    { id: 'gallery', icon: 'web', label: T.filters[3], keywords: ['n8n', 'LINE', 'video', 'คลิป'], run: () => { setFilter('all'); window.setTimeout(() => go('gallery'), 0) } },
    { id: 'packs', icon: 'tag', label: T.budget, run: () => go('packs') },
    { id: 'portfolio', icon: 'web', label: T.portfolio, run: () => { window.location.href = BASE + 'portfolio/' } },
    ...SEARCH_PAGES.map(p => ({ id: 'page-' + p.slug, icon: 'web', label: lang === 'th' ? p.label : p.en, hint: '↗', run: () => { window.location.href = BASE + 'services/' + p.slug + '/' } })),
  ]
  const serviceTitle = [...D.services, ...PACKS[lang]].find(item => item.id === service)?.title || T.remaining
  const textBrief = `${T.business}: ${business}\n${T.need}: ${serviceTitle}\n\n${brief}`
  const emailHref = `mailto:${CONTACT.email}?subject=${encodeURIComponent(T.formSubject)}&body=${encodeURIComponent(textBrief)}`
  const copyBrief = async () => {
    try { await navigator.clipboard.writeText(textBrief); setCopyStatus(U.copyNext) }
    catch { setCopyStatus(T.copyError); setManualCopy(true); window.setTimeout(() => { briefPreview.current?.focus(); briefPreview.current?.select() }, 0) }
  }
  const quote = (id) => { setService(id); setCopyStatus(''); go('contact'); window.setTimeout(()=>document.getElementById('brief-business')?.focus({preventScroll:true}),0) }
  const enquireProject = () => { const title = images[preview].title; setBrief(value => `${value}${value?'\n\n':''}${lang==='th'?'สนใจงานลักษณะเดียวกับ':'Interested in work similar to'}: ${title}`.slice(0,1800)); setPreview(null); setCopyStatus(U.projectAdded); window.setTimeout(()=>{go('contact');document.getElementById('brief-message')?.focus({preventScroll:true})},0) }
  const normalize = text => text.normalize('NFKD').replace(/[\u0E31\u0E34-\u0E3A\u0E47-\u0E4E]/g, '').toLocaleLowerCase().trim()
  const faqs = D.faqs.filter(f => normalize(`${f.q} ${f.a}`).includes(normalize(query)))

  return <div className="studio">
    <a className="s-skip" href="#main">{L.ui.skip}</a>
    <header className="s-topbar">
      <a className="s-brand" href="#top" aria-label="Sudo Command"><Mark/><span>sudo<span className="s-brand-dot">.</span><small>COMMAND</small></span></a>
      <nav className="s-desktop-nav" aria-label={L.ui.mainLabel}>{NAV_IDS.slice(0, 3).map((id,i)=><a href={`#${id}`} key={id}>{T.nav[i]}</a>)}</nav>
      <div className="s-header-actions">
        <a className="s-button s-button-dark s-header-cta" href="#contact">{T.start}<Arrow/></a>
        <button className="s-icon-button" onClick={()=>setPalette(true)} aria-label={L.ui.searchTitle}><Icon name="search"/></button>
        <button className="s-language" onClick={()=>setLang(lang === 'th' ? 'en' : 'th')} aria-label={lang === 'th' ? 'Switch to English' : 'เปลี่ยนเป็นภาษาไทย'}>{lang === 'th' ? 'EN' : 'ไทย'}</button>
        <details className="s-menu" ref={menu} onBlur={e => { if (e.relatedTarget && !e.currentTarget.contains(e.relatedTarget)) closeMenu() }}>
          <summary ref={menuSummary}><span className="s-menu-lines" aria-hidden="true"/><span className="sr-only">{T.menu}</span></summary>
          <div className="s-menu-panel">
            <button className="s-menu-close" onClick={()=>{closeMenu();menuSummary.current?.focus()}}>{T.close}<Icon name="close"/></button>
            <nav aria-label={T.menu}>{NAV_IDS.map((id,i)=><a key={id} href={`#${id}`} onClick={closeMenu}><span>0{i+1}</span>{T.nav[i]}<Arrow/></a>)}</nav>
            <a href={`${BASE}portfolio/`}>{T.portfolio}<Arrow/></a>
            <label className="s-theme-label">{T.theme}<select value={theme} onChange={e=>setTheme(e.target.value)}>{['system','light','dark'].map((v,i)=><option value={v} key={v}>{T.themes[i]}</option>)}</select></label>
          </div>
        </details>
      </div>
    </header>

    <main id="main" tabIndex={-1}>
      <section className="s-hero s-container" id="top" tabIndex={-1}>
        <div className="s-hero-heading"><p className="s-kicker"><span className="s-status-dot"/>{T.tagline}</p><h1>{T.hero1}<br/><span>{T.hero2}</span></h1><p className="s-hero-intro">{T.intro}</p><div className="s-hero-buttons"><a className="s-button s-button-green" href="#contact">{T.start}<Arrow/></a><a className="s-button s-button-quiet" href="#work">{T.seeWork}<span aria-hidden="true">↘</span></a></div><nav className="s-hero-capabilities" aria-label={lang==='th'?'เลือกบริการ':'Explore services'}>{[['svc-web','Website'],['svc-sheets','Sheets / Excel'],['svc-auto','Automation'],['svc-line','LINE OA']].map(([id,label])=><a href={`#${id}`} key={id} onClick={e=>{e.preventDefault();go(id)}}>{label}<span aria-hidden="true">↗</span></a>)}</nav><p className="s-hero-note">{T.note}</p></div>
        <div className="s-showcase s-project-theatre">
          <SignalField paused={motionPaused}/>
          <div className="s-showcase-heading"><div><p className="s-kicker">SUDO / SELECTED SYSTEMS</p><h2>{lang==='th'?'ไอเดียที่ใช้ได้จริง.':'Ideas, made real.'}</h2></div><button type="button" className="s-motion-toggle" aria-pressed={motionPaused} onClick={()=>setMotionPaused(v=>!v)}>{motionPaused?(lang==='th'?'เปิดการเคลื่อนไหว':'Resume motion'):(lang==='th'?'พักการเคลื่อนไหว':'Pause motion')} <span aria-hidden="true">{motionPaused?'▶':'Ⅱ'}</span></button></div>
          <div className="s-theatre-body">
          <div className="s-project-story">
            <p className="s-project-coordinate">SELECTED / 0{hero+1}</p>
            <h3 aria-live="polite" aria-atomic="true">{selected.title}</h3>
            <p>{selected.cap}</p>
            <button className="s-project-open" onClick={()=>setPreview(HERO_IMAGES[hero])}>{U.preview}<Arrow/></button>
            <div className="s-project-paging"><button aria-label={U.previous} onClick={()=>setHero(v=>(v+2)%3)}>←</button><span>0{hero+1} / 03</span><button aria-label={U.next} onClick={()=>setHero(v=>(v+1)%3)}>→</button></div>
          </div>
          <div className="s-stage">
            {[1,2].map((offset)=>{const i=(hero+offset)%3;return <button className={`s-stage-peek s-stage-peek-${offset}`} key={offset} onClick={()=>setHero(i)} aria-label={`${T.featured}: ${images[HERO_IMAGES[i]].title}`}><img src={images[HERO_IMAGES[i]].src} alt="" width="720" height="500" loading="lazy"/><span>0{i+1} / {T.categories[i]} ↗</span></button>})}
            <div className="s-stage-back" aria-hidden="true"><Mark/></div>
            <button type="button" className="s-stage-window" onClick={() => setPreview(HERO_IMAGES[hero])} aria-label={`${U.preview}: ${selected.title}`}>
              <div className="s-window-bar"><span className="s-window-dots" aria-hidden="true">● ● ●</span><span>{selected.title}</span><Arrow/></div>
              <img key={selected.src} src={selected.src} alt={selected.title} width="720" height="500" fetchPriority="high"/>
            </button>
            <div className="s-stage-stamp"><span>{lang==='th'?'เปิดดูผลงาน':'Explore project'}</span><Arrow/></div>
          </div>
          </div>
          <div className="s-showcase-controls" role="group" aria-label={T.featured}>{T.categories.map((label,i)=><button key={label} aria-pressed={hero===i} onClick={()=>setHero(i)}><img src={images[HERO_IMAGES[i]].src} alt="" width="96" height="64" loading="lazy"/><span className="s-project-tab"><small>0{i+1} / {label}</small><strong>{images[HERO_IMAGES[i]].title}</strong></span><span className="s-control-dot" aria-hidden="true"/></button>)}</div>
        </div>
      </section>

      <div className="s-ribbon" aria-hidden="true">{T.ribbon.map(s=><span key={s}><Mark/>{s}</span>)}</div>
      <ClientShowcase lang={lang}/>
      <section className="s-section s-container" id="work" tabIndex={-1}>
        <div className="s-heading-row"><Heading eyebrow={T.workEyebrow} title={T.workTitle} note={T.workNote}/><a className="s-text-link" href={`${BASE}portfolio/`}>{T.workAll}<Arrow/></a></div>
        <div className="s-filter-bar"><div className="s-filters" role="group" aria-label={T.nav[0]}>{['all','web','app','auto'].map((value,i)=><button aria-pressed={filter===value} onClick={()=>setFilter(value)} key={value}>{T.filters[i]}</button>)}</div><span className="s-counter" role="status">{visibleCases.length + (filter==='all'||filter==='auto'?2:0)} {T.resultCount}</span></div>
        <div className="s-case-grid">{visibleCases.map(item=><article className="s-case" key={item.src}>
          <button type="button" className="s-case-image" onClick={() => setPreview(item.number - 1)} aria-label={`${U.preview}: ${item.title}`}><img src={item.src} alt={item.title} width="720" height="500" loading="lazy" decoding="async"/><span className="s-case-arrow"><Icon name="search"/></span></button>
          <div className="s-case-caption"><div><span className="s-kicker">{item.typeLabel}</span><h3>{item.title}</h3></div><span className="s-case-number">/{String(item.number).padStart(2,'0')}</span></div><p>{item.cap}</p><div className="s-case-actions"><button className="s-text-link" onClick={() => setPreview(item.number - 1)}>{U.preview}<Arrow/></button>{item.href && <a className="s-text-link" href={item.href} target="_blank" rel="noopener noreferrer">{U.visit}<span aria-hidden="true">↗</span><span className="sr-only">{U.newTab}</span></a>}</div>
        </article>)}</div>
        {(filter==='all'||filter==='auto') && <article className="s-automation" id="gallery" tabIndex={-1}>
          <ReelShowcase lang={lang}/>
          <div className="s-auto-copy"><p className="s-kicker">n8n / LINE / AUTO PUBLISH</p><h3>{T.autoTitle}</h3><p>{T.autoNote}</p><External className="s-button s-button-green" href={L.gallery.video.href}>{T.watch}</External><a className="s-auto-extra" href={L.gallery.video.extraHref} target="_blank" rel="noopener noreferrer">{L.gallery.video.extraLabel}<Arrow/></a></div>
          <div className="s-auto-visual"><div className="s-auto-symbol" aria-hidden="true"><Mark/><span>→</span><Icon name="line"/></div><ol>{T.autoSteps.map((step,i)=><li key={step}><span>0{i+1}</span>{step}{i===1&&<b>2h</b>}</li>)}</ol><p>{T.autoFoot}</p></div>
        </article>}
        {filter!=='all' && filter!=='auto' && <a className="s-text-link s-auto-reveal" href="#gallery" onClick={e=>{e.preventDefault();setFilter('all');window.setTimeout(()=>go('gallery'),0)}}>{L.gallery.video.label}<Arrow/></a>}
      </section>

      <section className="s-fit-section" id="paths" tabIndex={-1}><div className="s-container s-fit-grid">
        <div><Heading eyebrow={T.fitEyebrow} title={T.fitTitle} note={T.fitNote}/><div className="s-needs" role="group" aria-label={T.fitTitle}>{T.needs.map((label,i)=><button key={label} aria-pressed={need===i} onClick={()=>setNeed(i)}><span>0{i+1}</span>{label}<Arrow/></button>)}</div></div>
        <div className="s-recommendation" aria-live="polite"><p className="s-rec-label">{lang==='th'?'แนวทางที่เหมาะกับโจทย์นี้':'A direction for your next move'}</p><span className="s-rec-index" aria-hidden="true">0{need+1}</span><Mark/><h3>{suggestion.title}</h3><p>{suggestion.text}</p><ul className="s-tags">{suggestion.tags.map(tag=><li key={tag}>{tag}</li>)}</ul><a className="s-text-link" href={suggestion.href.startsWith('#')?suggestion.href:BASE+suggestion.href}>{suggestion.label}<Arrow/></a></div>
      </div></section>

      <section className="s-section s-container" id="services" tabIndex={-1}>
        <Heading eyebrow="WHAT WE DO" title={T.servicesTitle} note={T.servicesNote}/>
        <div className="s-services">{D.services.map((s,i)=><details className="s-service" key={s.id} id={s.id} tabIndex={-1}><summary><span className="s-service-index">0{i+1}</span><span className="s-service-name"><strong>{s.title}</strong><small>{s.short}</small></span><span className="s-service-plus" aria-hidden="true">+</span></summary><div className="s-service-body"><div><p>{s.desc}</p><p className="s-service-price">{s.price}</p><small>{T.priceNote}</small></div><div><h4>{T.includes}</h4><ul>{s.includes.map(item=><li key={item}>{item}</li>)}</ul><button className="s-button s-button-dark" onClick={()=>quote(s.id)}>{T.quote}<Arrow/></button></div></div></details>)}</div>
        <details className="s-more-services" id="categories"><summary>{T.more}<span aria-hidden="true">+</span></summary><div className="s-category-grid">{CATS[lang].map(c=><div key={c.id}><h3>{c.title}</h3><ul>{c.items.map(item=><li key={item}>{item}</li>)}</ul></div>)}</div></details>
        <details className="s-packages" id="packs" tabIndex={-1}><summary>{T.budget}<span aria-hidden="true">+</span></summary><div className="s-package-grid">{PACKS[lang].map(p=><article key={p.id}><span className="s-kicker">PACK / {p.id}</span><h3>{p.title}</h3><strong>{p.price}</strong><p>{p.sub}</p><ul>{p.items.map(item=><li key={item}>{item}</li>)}</ul><button className="s-text-link" onClick={()=>quote(p.id)}>{T.quote}<Arrow/></button></article>)}</div></details>
      </section>

      <section className="s-about" id="about" tabIndex={-1}><div className="s-container s-about-grid"><div><p className="s-kicker">{T.aboutEyebrow}</p><h2>{T.aboutTitle}</h2><p>{T.aboutText}</p><div className="s-about-signature"><Mark/><span>sudo.<small>COMMAND</small></span></div></div><ul>{T.values.map(([title,text],i)=><li key={title}><span>0{i+1}</span><div><h3>{title}</h3><p>{text}</p></div></li>)}</ul></div></section>
      <section className="s-section s-container" id="process" tabIndex={-1}><Heading eyebrow={T.processEyebrow} title={T.processTitle}/><ol className="s-process">{T.process.map(([title,text],i)=><li key={title}><span>0{i+1}</span><h3>{title}</h3><p>{text}</p></li>)}</ol></section>
      <section className="s-faq-section" id="faq" tabIndex={-1}><div className="s-container s-faq-grid"><div><Heading eyebrow="GOOD QUESTIONS" title={T.faqTitle} note={T.faqNote}/><div className="s-faq-search" role="search"><Icon name="search"/><input id="faq-search" type="search" aria-label={T.faqSearch} placeholder={T.faqSearch} value={query} onChange={e=>setQuery(e.target.value)}/>{query && <button type="button" aria-label={U.clear} onClick={()=>{setQuery('');document.getElementById('faq-search')?.focus()}}><Icon name="close"/></button>}</div><p className="s-search-count" role="status">{faqs.length} {U.faqCount}</p></div><div>{faqs.map(f=><details className="s-faq" key={f.q}><summary>{f.q}<span aria-hidden="true">+</span></summary><p>{f.a}</p></details>)}{!faqs.length&&<p role="status">{T.noFaq}</p>}</div></div></section>

      <section className="s-section s-container" id="contact" tabIndex={-1}><div className="s-contact-invitation" aria-hidden="true"><span>YOUR MOVE.</span><span>↗</span></div><div className="s-contact-grid"><div><Heading eyebrow={T.contactEyebrow} title={T.contactTitle} note={T.contactText}/><div className="s-contact-buttons"><External className="s-button s-button-green" href={CONTACT.line}>{T.direct}</External><External className="s-button s-button-outline" href={CONTACT.messenger}>{T.messenger}</External></div><div className="s-contact-address"><a href={`mailto:${CONTACT.email}`}>{CONTACT.email}<Arrow/></a><a href={`tel:${CONTACT.phone}`}>061 169 9332<Arrow/></a><p>{T.location}</p></div></div>
        <div className="s-brief"><p className="s-kicker">PROJECT / START HERE</p><h3>{T.orBrief}</h3><p className="s-brief-help">{U.briefHelp}</p>{service && <p className="s-selected-service">{U.selected}: {serviceTitle}</p>}<label>{T.business}<input id="brief-business" autoComplete="organization" value={business} maxLength={120} placeholder={T.businessPh} onChange={e=>{setBusiness(e.target.value);setCopyStatus('')}}/></label><label>{T.need}<select value={service} onChange={e=>{setService(e.target.value);setCopyStatus('')}}><option value="">{T.remaining}</option>{D.services.map(s=><option key={s.id} value={s.id}>{s.title}</option>)}{PACKS[lang].map(p=><option key={p.id} value={p.id}>{p.title}</option>)}</select></label><label>{T.brief}<textarea id="brief-message" value={brief} rows={4} maxLength={1800} placeholder={T.briefPh} onChange={e=>{setBrief(e.target.value);setCopyStatus('')}}/></label><div className="s-brief-actions"><a className="s-button s-button-dark" href={emailHref}>{T.email}<Arrow/></a></div><small>{T.emailNote}</small><div className="s-copy-line"><button type="button" onClick={copyBrief}>{U.copyLine}</button><a href={CONTACT.line} target="_blank" rel="noopener noreferrer">2. {T.direct} ↗</a></div><p className="s-copy-status" role="status">{copyStatus}</p><details className="s-brief-preview" open={manualCopy} onToggle={e=>setManualCopy(e.currentTarget.open)}><summary>{U.briefPreview}</summary><textarea ref={briefPreview} readOnly value={textBrief} aria-label={U.briefPreview} rows={6}/></details></div>
      </div></section>
    </main>

    <footer className="s-footer"><div className="s-container"><div className="s-footer-top"><p>{T.footer}</p><a className="s-text-link" href="#top">{T.backTop}<span aria-hidden="true">↑</span></a></div><a className="s-footer-word" href="#top" aria-label="Sudo Command">sudo<Mark/></a><nav className="s-service-links" aria-label={T.more}>{SEARCH_PAGES.map(p=><a href={`${BASE}services/${p.slug}/`} key={p.slug}>{lang==='th'?p.label:`${p.en} (TH)`}</a>)}<a href={`${BASE}portfolio/`}>{T.portfolio}</a></nav><div className="s-footer-bottom"><span>© {new Date().getFullYear()} Sudo Command</span><span>BANGKOK, THAILAND</span><a href={`${BASE}privacy.html`}>{T.privacy}</a></div></div></footer>
    {!contactVisible && <div className="s-mobile-dock"><a href="#work">{T.seeWork}</a><a href={CONTACT.line} target="_blank" rel="noopener noreferrer">{T.direct}<Arrow/></a></div>}
    {preview !== null && <ProjectPreview item={images[preview]} index={preview} total={images.length} onNavigate={setPreview} onEnquire={enquireProject} labels={U} onClose={()=>setPreview(null)}/>}
    {palette&&<CommandPalette open={palette} onClose={closePalette} actions={actions} t={L}/>}
  </div>
}
