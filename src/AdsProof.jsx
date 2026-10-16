import { CURTAIN_ADS } from './curtain-ads'
import Icon from './Icon'

export default function AdsProof({ lang, onPreview, featured = false }) {
  const metrics = <dl>{CURTAIN_ADS.metrics.map(metric=><div key={metric.en}><dt>{metric[lang]}</dt><dd>{metric.value}</dd></div>)}</dl>
  return <aside className={`s-ads-proof${featured ? ' s-ads-featured' : ''}`} id={featured ? 'featured-ads' : 'curtain-ads'} tabIndex={-1} aria-label={CURTAIN_ADS.title[lang]}>
    <header><p className="s-kicker">GOOGLE ADS / SEARCH</p><span>{CURTAIN_ADS.period[lang]}</span></header>
    {featured && <div className="s-ads-feature-title"><img src="/sudo-command/clients/curtain.jpg" width="52" height="52" alt=""/><div><p>{lang==='th'?'ตัวอย่างผลโฆษณาจากงานที่ดูแล':'Results from a managed campaign'}</p><h2>CURTAIN STORY HOME</h2></div></div>}
    {featured && metrics}
    <button className="s-ads-image" type="button" onClick={onPreview} aria-label={lang === 'th' ? 'ดูภาพผล Google Ads ของ Curtain Story Home' : 'View Curtain Story Home Google Ads results'}>
      <img src={CURTAIN_ADS.src} alt={CURTAIN_ADS.title[lang]} width={CURTAIN_ADS.width} height={CURTAIN_ADS.height} loading={featured?'eager':'lazy'} fetchPriority={featured?'high':'auto'} decoding="async"/>
      <span><Icon name="search"/>{lang === 'th' ? 'ขยายภาพผลลัพธ์' : 'Enlarge results'}</span>
    </button>
    {!featured && metrics}
    <p className="s-ads-note">{CURTAIN_ADS.caption[lang]}</p>
  </aside>
}
