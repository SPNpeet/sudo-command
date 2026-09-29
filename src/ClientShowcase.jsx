const CLIENTS = [
  { id: 'phonchaorai', image: 'phonchaorai.webp', name: ['ผลชาวไร่', 'Phon Chao Rai'], scope: ['เว็บไซต์แบรนด์', 'Brand website'], project: 0 },
  { id: 'curtain', image: 'curtain.jpg', name: ['Curtain Story Home', 'Curtain Story Home'], scope: ['เว็บไซต์และการตลาดออนไลน์', 'Website & digital marketing'], project: 4 },
  { id: 'southside', image: 'southside.webp', name: ['Southside Ink Pattaya', 'Southside Ink Pattaya'], scope: ['เว็บไซต์สองภาษา', 'Bilingual website'], project: 3 },
  { id: 'natee', image: 'natee.webp', name: ['ธารนที', 'Than Natee'], scope: ['เว็บไซต์และระบบหลังบ้าน', 'Website & back office'], project: 2 },
  { id: 'zingstar', image: 'zingstar.webp', name: ['Zing Star Inspector', 'Zing Star Inspector'], scope: ['เว็บไซต์และระบบจัดการราคา', 'Website & pricing management'], project: 6 },
]

export default function ClientShowcase({ lang }) {
  const l = lang === 'th' ? 0 : 1
  return <section className="s-clients s-container" id="clients" tabIndex={-1} aria-labelledby="clients-title">
    <header className="s-clients-heading">
      <div><p className="s-kicker">THE PEOPLE WE BUILD FOR</p><h2 id="clients-title">{l === 0 ? 'ลูกค้าที่ร่วมงานกับเรา' : 'The brands we build with.'}</h2></div>
      <p>{l === 0 ? 'ต่างธุรกิจ ต่างโจทย์ — งานที่ออกแบบให้เหมาะกับแต่ละแบรนด์' : 'Different businesses. Different challenges. Work shaped around each brand.'}</p>
    </header>
    <ul className="s-client-grid">{CLIENTS.map(client => <li key={client.id}>
      <div className={`s-client s-client-${client.id}`}>
        <span className="s-client-logo"><img src={`/sudo-command/clients/${client.image}`} alt="" width="160" height="120" loading="lazy" decoding="async"/></span>
        <span className="s-client-name">{client.name[l]}</span>
        <span className="s-client-scope">{client.scope[l]}</span>
      </div>
    </li>)}</ul>
  </section>
}
