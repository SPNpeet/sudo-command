import { useEffect, useRef, useState } from 'react'
import Icon from './Icon'
import { useDismiss } from './hooks'

/**
 * ปุ่มติดต่อลอยตามตอนเลื่อน
 * ใช้ scroll listener ไม่ใช้ IntersectionObserver เพราะตัวนั้นเงียบได้ในบางเบราว์เซอร์
 * แล้วปุ่มจะไม่โผล่เลย ซึ่งแปลว่าเสียโอกาสให้ลูกค้าทัก
 *
 * ซ่อนตัวเองเมื่อเลื่อนถึงส่วนติดต่อแล้ว เพราะตรงนั้นมีช่องทางครบอยู่แล้ว
 * ไม่มีเหตุผลที่จะเอาปุ่มไปบังเนื้อหา
 */
export default function FloatingContact({ channels, t }) {
  const [shown, setShown] = useState(false)
  const [open, setOpen] = useState(false)
  const wrapRef = useRef(null)
  const btnRef = useRef(null)
  const panelRef = useRef(null)
  const F = t.fab

  useDismiss(wrapRef, open, () => {
    setOpen(false)
    btnRef.current?.focus()
  })

  useEffect(() => {
    const update = () => {
      const pastHero = window.scrollY > 480

      let atContact = false
      const contact = document.getElementById('contact')
      if (contact) {
        const r = contact.getBoundingClientRect()
        atContact = r.top < window.innerHeight * 0.8 && r.bottom > 0
      }

      setShown(pastHero && !atContact)
    }

    update()
    window.addEventListener('scroll', update, { passive: true })
    window.addEventListener('resize', update)
    return () => {
      window.removeEventListener('scroll', update)
      window.removeEventListener('resize', update)
    }
  }, [])

  // เลื่อนพ้นไปแล้วต้องพับเก็บด้วย ไม่ใช่ปล่อยกางค้างไว้นอกจอ
  useEffect(() => {
    if (!shown) setOpen(false)
  }, [shown])

  useEffect(() => {
    if (open) panelRef.current?.querySelector('a')?.focus()
  }, [open])

  if (!channels.length) return null

  return (
    // inert ตัดทั้งก้อนออกจากทั้ง tab order และ accessibility tree ในทีเดียว
    // ดีกว่าไล่ใส่ tabIndex ทีละปุ่ม เพราะถ้ามีคนเพิ่มปุ่มใหม่แล้วลืมใส่
    // ปุ่มนั้นจะ tab ไปถึงได้ทั้งที่มองไม่เห็น ซึ่งเป็นปัญหา a11y จริง
    <div
      className={`fab ${shown ? 'in' : ''} ${open ? 'open' : ''}`}
      ref={wrapRef}
      inert={shown ? undefined : true}
    >
      <div className="fab-panel" ref={panelRef} hidden={!open}>
        <p className="fab-head">{F.head}</p>
        <ul>
          {channels.map((c) => {
            const external = c.href.startsWith('http')
            return (
              <li key={c.key}>
                <a
                  href={c.href}
                  target={external ? '_blank' : undefined}
                  rel={external ? 'noopener noreferrer' : undefined}
                >
                  <Icon name={c.icon} />
                  <span>{c.label}</span>
                </a>
              </li>
            )
          })}
        </ul>
      </div>

      <button
        type="button"
        className="fab-btn"
        ref={btnRef}
        aria-expanded={open}
        aria-label={open ? F.close : F.open}
        onClick={() => setOpen((v) => !v)}
      >
        <Icon name={open ? 'chevron' : 'chat'} className="fab-ic" />
        <span className="fab-text">{F.text}</span>
      </button>
    </div>
  )
}
