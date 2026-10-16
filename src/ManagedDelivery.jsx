import { MANAGED_DELIVERY } from './managed-delivery'

export default function ManagedDelivery({ lang }) {
  const data = MANAGED_DELIVERY[lang]
  return <aside className="s-managed" aria-labelledby="managed-delivery-title">
    <p className="s-managed-kicker">SUDO / MANAGED DELIVERY</p><h3 id="managed-delivery-title">{data.title}</h3><p className="s-managed-intro">{data.intro}</p>
    <ol>{data.steps.map(([tag,title,text])=><li key={tag}><span className="s-managed-tag">{tag}</span><h4>{title}</h4><p>{text}</p></li>)}</ol>
    <p className="s-managed-note">{data.note}</p>
  </aside>
}
