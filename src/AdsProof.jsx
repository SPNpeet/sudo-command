import { CURTAIN_ADS } from './curtain-ads'
import Icon from './Icon'

export default function AdsProof({ lang, onPreview }) {
  return <aside className="s-ads-proof" id="curtain-ads" tabIndex={-1} aria-label={CURTAIN_ADS.title[lang]}>
    <header><p className="s-kicker">GOOGLE ADS / SEARCH</p><span>{CURTAIN_ADS.period[lang]}</span></header>
    <button className="s-ads-image" type="button" onClick={onPreview} aria-label={lang === 'th' ? 'ดูภาพผล Google Ads ของ Curtain Story Home' : 'View Curtain Story Home Google Ads results'}>
      <img src={CURTAIN_ADS.src} alt={CURTAIN_ADS.title[lang]} width={CURTAIN_ADS.width} height={CURTAIN_ADS.height} loading="lazy" decoding="async"/>
      <span><Icon name="search"/>{lang === 'th' ? 'ขยายภาพผลลัพธ์' : 'Enlarge results'}</span>
    </button>
    <dl>{CURTAIN_ADS.metrics.map(metric=><div key={metric.en}><dt>{metric[lang]}</dt><dd>{metric.value}</dd></div>)}</dl>
    <p className="s-ads-note">{CURTAIN_ADS.caption[lang]}</p>
  </aside>
}
