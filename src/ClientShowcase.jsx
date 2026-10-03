import { useState } from 'react'

const CLIENTS = [
  { id: 'phonchaorai', image: 'phonchaorai.webp', name: ['ผลชาวไร่', 'Phon Chao Rai'], scope: ['เว็บไซต์แบรนด์', 'Brand website'], project: 0 },
  { id: 'curtain', image: 'curtain.jpg', name: ['Curtain Story Home', 'Curtain Story Home'], scope: ['เว็บไซต์และการตลาดออนไลน์', 'Website & digital marketing'], project: 4 },
  { id: 'southside', image: 'southside.webp', name: ['Southside Ink Pattaya', 'Southside Ink Pattaya'], scope: ['เว็บไซต์สองภาษา', 'Bilingual website'], project: 3 },
  { id: 'natee', image: 'natee.webp', name: ['ธารนที', 'Than Natee'], scope: ['เว็บไซต์และระบบหลังบ้าน', 'Website & back office'], project: 2 },
  { id: 'zingstar', image: 'zingstar.webp', name: ['Zing Star Inspector', 'Zing Star Inspector'], scope: ['เว็บไซต์และระบบจัดการราคา', 'Website & pricing management'], project: 6 },
  { id: 'truck', wordmark: ['เฮียตั้ม', 'HIA TUM'], name: ['เฮียตั้มรถบรรทุก ถูกและดี', 'Hia Tum Trucks'], scope: ['วิดีโอและโพสต์อัตโนมัติ', 'Automated video & publishing'] },
  { id: 'astro', wordmark: ['Astro Trader', 'Astro Trader'], name: ['โหรา เทรดเดอร์ Astro Trader', 'Astro Trader'], scope: ['ระบบผลิตคลิปข่าวรายวัน', 'Daily news video automation'] },
]

export default function ClientShowcase({ lang }) {
  const l = lang === 'th' ? 0 : 1
  const [paused, setPaused] = useState(false)
  const card = client => <li key={client.id}>
    <div className={`s-client s-client-${client.id}`}>
      <span className="s-client-logo">{client.image
        ? <img src={`/sudo-command/clients/${client.image}`} alt="" width="160" height="120" loading="lazy" decoding="async"/>
        : <span className="s-client-wordmark" aria-hidden="true">{client.wordmark[l]}</span>}</span>
      <span className="s-client-name">{client.name[l]}</span>
      <span className="s-client-scope">{client.scope[l]}</span>
    </div>
  </li>
  return <section className="s-clients s-container" id="clients" tabIndex={-1} aria-labelledby="clients-title">
    <header className="s-clients-heading">
      <div><p className="s-kicker">THE PEOPLE WE BUILD FOR</p><h2 id="clients-title">{l === 0 ? 'ลูกค้าที่ร่วมงานกับเรา' : 'The brands we build with.'}</h2></div>
      <div className="s-clients-intro"><p>{l === 0 ? 'ต่างธุรกิจ ต่างโจทย์ — ลงมือทำให้เหมาะกับแต่ละแบรนด์' : 'Different businesses. Different challenges. Work shaped around each brand.'}</p><button className="s-client-motion-toggle" type="button" aria-pressed={paused} onClick={()=>setPaused(value=>!value)} aria-label={l===0?'พักการเคลื่อนไหวโลโก้ลูกค้า':'Pause client logo motion'}><span aria-hidden="true">{paused?'▶':'Ⅱ'}</span>{l===0?(paused?'เลื่อนต่อ':'พักภาพ'):(paused?'Resume':'Pause')}</button></div>
    </header>
    <div className="s-client-motion" data-paused={paused}>
      <div className="s-client-marquee">
        <div className="s-client-track">
          <ul className="s-client-loop">{CLIENTS.map(card)}</ul>
          <ul className="s-client-loop" aria-hidden="true">{CLIENTS.map(card)}</ul>
        </div>
      </div>
      <div className="s-client-scope-marquee" aria-hidden="true"><div className="s-client-scope-track">{[0,1].map(copy=><div className="s-client-scope-loop" key={copy}>{CLIENTS.map(client=><span key={client.id}><i/>{client.scope[l]}</span>)}</div>)}</div></div>
    </div>
  </section>
}
