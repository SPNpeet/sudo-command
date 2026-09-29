import { useEffect, useRef, useState } from 'react'
import Icon from './Icon'

export default function ProjectPreview({ item, onClose, labels }) {
  const dialog = useRef(null)
  const [failed, setFailed] = useState(false)
  useEffect(() => {
    const previous = document.activeElement
    const element = dialog.current
    element.showModal()
    const overflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => { document.body.style.overflow = overflow; previous?.focus({ preventScroll: true }) }
  }, [])
  return <dialog ref={dialog} className="s-preview" aria-labelledby="preview-title" onCancel={e => { e.preventDefault(); onClose() }} onClick={e => { if (e.target === dialog.current) onClose() }}>
    <header className="s-preview-head"><div><span>{labels.preview}</span><h2 id="preview-title">{item.title}</h2></div><button type="button" onClick={onClose} aria-label={labels.close}><Icon name="close" /></button></header>
    <div className="s-preview-scroll">{failed ? <p role="status">{labels.imageError}</p> : <img src={item.src} alt={item.title} onError={()=>setFailed(true)} />}<p>{item.cap}</p></div>
    <footer><a href={item.src} target="_blank" rel="noopener noreferrer">{labels.original} ↗</a>{item.href && <a href={item.href} target="_blank" rel="noopener noreferrer">{labels.visit} ↗</a>}</footer>
  </dialog>
}
