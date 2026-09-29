import { useEffect, useRef, useState } from 'react'
import Icon from './Icon'

export default function ProjectPreview({ item, index, total, onNavigate, onClose, onEnquire, labels }) {
  const dialog = useRef(null)
  const scroller = useRef(null)
  const image = useRef(null)
  const [status, setStatus] = useState('loading')
  const [zoom, setZoom] = useState(false)
  useEffect(() => {
    const previous = document.activeElement
    const element = dialog.current
    element.showModal()
    const overflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => { document.body.style.overflow = overflow; if (previous?.isConnected) previous.focus({ preventScroll: true }) }
  }, [])
  useEffect(() => {
    setZoom(false)
    setStatus(image.current?.complete ? (image.current.naturalWidth ? 'ready' : 'error') : 'loading')
    scroller.current?.scrollTo({ top: 0, left: 0 })
  }, [item.src])
  const navigate = delta => onNavigate((index + delta + total) % total)
  return <dialog ref={dialog} className="s-preview" aria-labelledby="preview-title" aria-describedby="preview-caption" onCancel={e => { e.preventDefault(); onClose() }} onClick={e => { if(e.target !== dialog.current) return; const r=e.currentTarget.getBoundingClientRect(); if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom) onClose() }} onKeyDown={e=>{if(e.target.closest('a,button,input,textarea,select') || zoom) return; if(e.key==='ArrowLeft'||e.key==='ArrowRight'){e.preventDefault();navigate(e.key==='ArrowLeft'?-1:1)}}}>
    <header className="s-preview-head"><div><span>{labels.preview} · {index+1} / {total}</span><h2 id="preview-title">{item.title}</h2></div><button type="button" onClick={onClose} aria-label={labels.close} autoFocus><Icon name="close" /></button></header>
    <div className="s-preview-tools"><div><button type="button" onClick={()=>navigate(-1)} aria-label={labels.previous}>←</button><span aria-live="polite">{index+1} / {total}</span><button type="button" onClick={()=>navigate(1)} aria-label={labels.next}>→</button></div><button type="button" disabled={status!=='ready'} aria-pressed={zoom} onClick={()=>setZoom(v=>!v)}>{zoom?labels.fit:labels.zoom}</button></div>
    <div ref={scroller} className={`s-preview-scroll ${zoom?'is-zoomed':''}`} tabIndex={0} aria-label={labels.imageArea} aria-busy={status==='loading'}>{status==='loading'&&<p className="s-image-status" role="status">{labels.imageLoading}</p>}{status==='error'&&<p className="s-image-status" role="status">{labels.imageError}</p>}<img ref={image} key={item.src} src={item.src} alt={item.title} hidden={status==='error'} onLoad={()=>setStatus('ready')} onError={()=>setStatus('error')}/><p id="preview-caption">{item.cap}</p></div>
    <footer><a href={item.src} target="_blank" rel="noopener noreferrer">{labels.original} ↗<span className="sr-only">{labels.newTab}</span></a>{item.href && <a href={item.href} target="_blank" rel="noopener noreferrer">{labels.visit} ↗<span className="sr-only">{labels.newTab}</span></a>}<button className="s-preview-enquire" type="button" onClick={onEnquire}>{labels.similar} ↗</button></footer>
  </dialog>
}
