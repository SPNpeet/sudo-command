import { useEffect, useMemo, useRef, useState } from 'react'
import Icon from './Icon'

/**
 * Command palette แบบที่ Linear / Vercel / GitHub ใช้ กด Ctrl+K หรือ ⌘K
 * ใช้ <dialog> ของเบราว์เซอร์เอง เลยได้ focus trap กับปุ่ม Escape มาฟรี
 * ไม่ต้องพึ่งไลบรารีภายนอก บันเดิลไม่โต และไม่มีสคริปต์นอกให้ต้องเชื่อใจ
 *
 * ค้นหาแบบตัดสระ/วรรณยุกต์ทิ้งก่อน กลุ่มลูกค้าอาจพิมพ์เร็วแล้วหลุดวรรณยุกต์
 * พิมพ์ "ติดตอ" ต้องเจอ "ติดต่อ" เหมือนกัน
 */
const NORMALIZE = /[\u0E31\u0E34-\u0E3A\u0E47-\u0E4E]/g

function norm(s) {
  return String(s).normalize('NFKD').replace(NORMALIZE, '').toLowerCase()
}

export default function CommandPalette({ open, onClose, actions, t }) {
  const dialogRef = useRef(null)
  const inputRef = useRef(null)
  const listRef = useRef(null)
  const [q, setQ] = useState('')
  const [cursor, setCursor] = useState(0)
  const P = t.palette

  const results = useMemo(() => {
    const term = norm(q).trim()
    if (!term) return actions
    return actions.filter((a) =>
      norm(`${a.label} ${a.hint || ''} ${(a.keywords || []).join(' ')}`).includes(term)
    )
  }, [q, actions])

  // เปิด/ปิด dialog ให้ตรงกับ state
  useEffect(() => {
    const el = dialogRef.current
    if (!el) return
    if (open && !el.open) {
      const previous = document.activeElement
      el.showModal()
      setQ('')
      setCursor(0)
      // บางเบราว์เซอร์ไม่ยอมให้โฟกัส input ทันทีหลัง showModal (อยู่ระหว่าง animation)
      // ถ้าโฟกัสไม่ได้ Escape จะไม่ส่ง cancel event ให้ dialog → กด Esc ไม่ปิด
      // เลยลองใหม่เป็นช่วงจนกว่าจะติด หรือครบ 12 ครั้ง
      let tries = 0
      const focusTimer = window.setInterval(() => {
        if (!inputRef.current) return
        inputRef.current.focus()
        if (document.activeElement === inputRef.current) window.clearInterval(focusTimer)
        if (++tries > 12) window.clearInterval(focusTimer)
      }, 80)
      return () => { window.clearInterval(focusTimer); window.setTimeout(() => { if (!el.isConnected) previous?.focus({ preventScroll: true }) }, 0) }
    } else if (!open && el.open) {
      el.close()
    }
  }, [open])

  // ปุ่ม Escape ของ <dialog> ยิง cancel ต้องส่งกลับให้ React รู้
  // แต่ cancel จะยิงเฉพาะตอนโฟกัสอยู่ใน dialog — ถ้าโฟกัสหลุดออกข้างนอก
  // ผู้ใช้กด Esc แล้วจะไม่เกิดอะไรเลย เลยมี document listener คอยดักเป็นชั้นสำรอง
  useEffect(() => {
    const el = dialogRef.current
    if (!el) return
    const onCancel = (e) => {
      e.preventDefault()
      onClose()
    }
    const onKey = (e) => {
      if (e.key === 'Escape' && el.open) onClose()
    }
    el.addEventListener('cancel', onCancel)
    el.addEventListener('close', onClose)
    document.addEventListener('keydown', onKey)
    return () => {
      el.removeEventListener('cancel', onCancel)
      el.removeEventListener('close', onClose)
      document.removeEventListener('keydown', onKey)
    }
  }, [onClose])

  useEffect(() => {
    setCursor(0)
  }, [q])

  // เลื่อนรายการที่เลือกให้อยู่ในสายตาเสมอ
  useEffect(() => {
    if (!open) return
    const el = listRef.current?.querySelector(`[data-i="${cursor}"]`)
    el?.scrollIntoView({ block: 'nearest' })
  }, [cursor, open])

  const run = (action) => {
    onClose()
    // รอให้ dialog ปิดก่อน ไม่งั้น scroll กับ focus จะชนกัน
    // ห้ามใช้ requestAnimationFrame ตรงนี้ เพราะแท็บที่ไม่ได้อยู่หน้าจอจะไม่ยิง
    // แล้วคำสั่งที่ผู้ใช้เลือกจะหายเงียบ ๆ — setTimeout ยิงแน่นอนกว่า
    window.setTimeout(() => action.run(), 0)
  }

  const onKeyDown = (e) => {
    if (e.nativeEvent.isComposing) return
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      setCursor((c) => (results.length ? (c + 1) % results.length : 0))
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setCursor((c) => (results.length ? (c - 1 + results.length) % results.length : 0))
    } else if (e.key === 'Enter') {
      e.preventDefault()
      const a = results[cursor]
      if (a) run(a)
    }
  }

  // คลิกพื้นหลังนอกกล่องแล้วปิด — คลิกที่ backdrop จะยิงมาที่ตัว dialog เอง
  // จำเป็นมาก เพราะบนมือถือไม่มีปุ่ม Escape ให้กด
  const onDialogClick = (e) => {
    if (e.target === dialogRef.current) onClose()
  }

  return (
    <dialog
      className="cmdk"
      ref={dialogRef}
      aria-label={P.title}
      onClick={onDialogClick}
    >
      <div className="cmdk-box">
        <div className="cmdk-search">
          <span className="cmdk-prompt" aria-hidden="true">
            $
          </span>
          <input
            ref={inputRef}
            type="text"
            role="combobox"
            aria-expanded={open}
            aria-controls="cmdk-results"
            aria-autocomplete="list"
            aria-activedescendant={results[cursor] ? `cmdk-opt-${cursor}` : undefined}
            onKeyDown={onKeyDown}
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder={P.ph}
            aria-label={P.aria}
            autoComplete="off"
            spellCheck="false"
          />
          <button type="button" className="cmdk-close" onClick={onClose} aria-label={P.close}>
            <Icon name="close" />
          </button>
        </div>

        <ul
          className="cmdk-list"
          id="cmdk-results"
          ref={listRef}
          role="listbox"
          aria-label={P.results}
        >
          {results.map((a, i) => (
            <li key={a.id} role="presentation">
              <button
                type="button"
                id={`cmdk-opt-${i}`}
                data-i={i}
                role="option"
                tabIndex={-1}
                aria-selected={i === cursor}
                className={i === cursor ? 'on' : ''}
                onMouseMove={() => setCursor(i)}
                onClick={() => run(a)}
              >
                <Icon name={a.icon} />
                <span className="cmdk-label">{a.label}</span>
                {a.hint && <span className="cmdk-hint">{a.hint}</span>}
              </button>
            </li>
          ))}
          {results.length === 0 && (
            <li className="cmdk-empty">
              {P.empty}
            </li>
          )}
        </ul>

        <footer className="cmdk-foot">
          <span>
            <kbd>↑</kbd>
            <kbd>↓</kbd> {P.nav}
          </span>
          <span>
            <kbd>enter</kbd> {P.select}
          </span>
          <span className="cmdk-foot-end">{P.outside}</span>
        </footer>
      </div>
    </dialog>
  )
}
