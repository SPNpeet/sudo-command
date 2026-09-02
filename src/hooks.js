import { useEffect, useState } from 'react'

const THEME_KEY = 'sc-theme'
const LANG_KEY = 'sc-lang'

/** ภาษาเว็บ: th | en — auto-detect ต่างชาติจาก browser ตั้งแต่ครั้งแรก */
export function useLang() {
  const [lang, setLang] = useState(() => {
    try {
      const saved = localStorage.getItem(LANG_KEY)
      if (saved === 'th' || saved === 'en') return saved
      const nav = (navigator.language || '').toLowerCase()
      if (nav.startsWith('en')) return 'en'
      return 'th'
    } catch {
      return 'th'
    }
  })

  useEffect(() => {
    try {
      localStorage.setItem(LANG_KEY, lang)
    } catch {
      /* โหมดส่วนตัวบางเบราว์เซอร์เขียนไม่ได้ ปล่อยผ่าน */
    }
  }, [lang])

  return [lang, setLang]
}

/** ธีม 3 สถานะ: light | dark | system (system = ตามเครื่องผู้ใช้) */
export function useTheme() {
  const [theme, setTheme] = useState(() => {
    try {
      return localStorage.getItem(THEME_KEY) || 'system'
    } catch {
      return 'system'
    }
  })

  useEffect(() => {
    const root = document.documentElement
    if (theme === 'system') root.removeAttribute('data-theme')
    else root.setAttribute('data-theme', theme)
    // ตั้งสีแถบเบราว์เซอร์ให้ตรงกับธีมที่ผู้ใช้เลือกเอง
    // ตอน system ปล่อยให้ <meta media> เดิมใน index.html ตอบสนองเครื่องผู้ใช้
    if (theme !== 'system') {
      const m = document.querySelector('meta[name="theme-color"]')
      if (m) m.setAttribute('content', theme === 'dark' ? '#09090b' : '#ffffff')
    }
    try {
      localStorage.setItem(THEME_KEY, theme)
    } catch {
      /* โหมดส่วนตัวบางเบราว์เซอร์เขียนไม่ได้ ปล่อยผ่าน */
    }
  }, [theme])

  return [theme, setTheme]
}

/** ไฮไลต์เมนูตามหัวข้อที่กำลังอ่านอยู่ */
export function useScrollSpy(ids) {
  const key = ids.join(',')
  const [active, setActive] = useState(null)

  useEffect(() => {
    const els = key
      .split(',')
      .map((id) => document.getElementById(id))
      .filter(Boolean)
    if (!els.length || !('IntersectionObserver' in window)) return

    const seen = new Map()
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => seen.set(e.target.id, e.isIntersecting ? e.intersectionRatio : 0))
        let best = null
        let bestRatio = 0
        seen.forEach((ratio, id) => {
          if (ratio > bestRatio) {
            bestRatio = ratio
            best = id
          }
        })
        if (best) setActive(best)
      },
      { rootMargin: '-88px 0px -50% 0px', threshold: [0, 0.15, 0.4, 0.75, 1] }
    )

    els.forEach((el) => io.observe(el))
    return () => io.disconnect()
  }, [key])

  return active
}

/**
 * ค่อย ๆ เผยเนื้อหาตอนเลื่อนถึง
 * ตั้งคลาสบน <html> จากใน effect เอง ถ้า JS หรือ IntersectionObserver ใช้ไม่ได้
 * เนื้อหาจะแสดงปกติทั้งหมด ไม่มีทางที่ลูกค้าจะเจอหน้าว่าง
 */
export function useReveal(deps = []) {
  useEffect(() => {
    const root = document.documentElement
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    // คลาสถูกใส่ไว้ตั้งแต่ก่อนวาดใน index.html
    // ถ้ามาถึงตรงนี้แล้วใช้ไม่ได้ ต้องถอดคืน ไม่งั้นเนื้อหาจะซ่อนถาวร
    if (reduced || !('IntersectionObserver' in window)) {
      root.classList.remove('js-reveal')
      return
    }

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add('revealed')
            io.unobserve(e.target)
          }
        })
      },
      { rootMargin: '0px 0px -8% 0px', threshold: 0.06 }
    )

    const inView = (el) => {
      const r = el.getBoundingClientRect()
      return r.top < window.innerHeight * 0.94 && r.bottom > 0
    }

    const observeAll = () =>
      document.querySelectorAll('[data-reveal]:not(.revealed)').forEach((el) => io.observe(el))
    observeAll()

    // เนื้อหาที่ render ทีหลัง (เช่น FAQ หลังกรอง) ไม่ถูก observe รอบแรก
    // ถ้าปล่อยไว้จะค้างซ่อนทั้งที่อยู่ในจอ — ต้องสแกนใหม่ทุกครั้งที่มี node เพิ่ม
    const mo = new MutationObserver((muts) => {
      let added = false
      for (const m of muts) {
        if (m.addedNodes.length) {
          added = true
          break
        }
      }
      if (!added) return
      document.querySelectorAll('[data-reveal]:not(.revealed)').forEach((el) => {
        io.observe(el)
        if (inView(el)) el.classList.add('revealed')
      })
    })
    mo.observe(document.body, { childList: true, subtree: true })

    // ชั้นสำรอง: กวาดด้วยตำแหน่งจริงเวลาเลื่อนหรือปรับขนาดจอ
    // เผื่อกรณี IntersectionObserver ยิงรอบแรกแล้วเงียบไปเลย ซึ่งเกิดได้จริง
    const sweep = () => {
      document.querySelectorAll('[data-reveal]:not(.revealed)').forEach((el) => {
        if (inView(el)) el.classList.add('revealed')
      })
    }

    window.addEventListener('scroll', sweep, { passive: true })
    window.addEventListener('resize', sweep)

    /* ชั้นสุดท้าย: ถ้าผ่านไปแล้วยังมีบล็อกที่ "อยู่ในจอ" แต่ไม่ถูกเผย
       แปลว่ากลไกเผยใช้การไม่ได้จริงบนเบราว์เซอร์นั้น ให้ถอดคลาสทิ้งทั้งหมด

       เดิมเช็คว่า IntersectionObserver ยิงหรือยัง ซึ่งผิด
       เพราะ IO ยิงรอบแรกเสมอแม้ไม่มีอะไรเข้าจอ watchdog เลยปลดอาวุธตัวเองทันที
       พอ IO เงียบหลังจากนั้น เนื้อหาค้างซ่อนถาวรโดยไม่มีอะไรมากู้ */
    const watchdog = window.setTimeout(() => {
      const stuck = [...document.querySelectorAll('[data-reveal]:not(.revealed)')].some(inView)
      if (stuck) {
        root.classList.remove('js-reveal')
        io.disconnect()
      }
    }, 1500)

    return () => {
      window.clearTimeout(watchdog)
      window.removeEventListener('scroll', sweep)
      window.removeEventListener('resize', sweep)
      mo.disconnect()
      io.disconnect()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps)
}

/** ปิดเมื่อคลิกนอกกล่อง หรือกด Escape */
export function useDismiss(ref, open, onClose) {
  useEffect(() => {
    if (!open) return

    const onDown = (e) => {
      if (ref.current && !ref.current.contains(e.target)) onClose()
    }
    const onKey = (e) => {
      if (e.key === 'Escape') onClose()
    }

    document.addEventListener('pointerdown', onDown)
    document.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('pointerdown', onDown)
      document.removeEventListener('keydown', onKey)
    }
  }, [ref, open, onClose])
}
