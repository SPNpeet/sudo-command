import { readFileSync, writeFileSync, mkdirSync } from 'node:fs'
import { SEARCH_PAGES } from '../src/search-pages.js'
import { DATA, L10N } from '../src/i18n.js'

const base = 'https://spnpeet.github.io/sudo-command/'
const esc = (s = '') => String(s).replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;').replaceAll('"', '&quot;').replaceAll("'", '&#39;')
const json = (v) => JSON.stringify(v).replaceAll('<', '\\u003c')
const link = (url, title) => `<a href="${esc(url)}">${esc(title)}</a>`
const menu = () => `<nav aria-label="บริการและผลงาน">${SEARCH_PAGES.map(p => link(`${base}services/${p.slug}/`, p.label)).join('')} ${link(`${base}portfolio/`, 'ผลงานทั้งหมด')}</nav>`
const contact = `<section id="contact"><h2>คุยเรื่องงานกับ Sudo Command</h2><p>บางมด กรุงเทพฯ · รับงานออนไลน์ทั่วประเทศไทย · ปรึกษาขอบเขตงานก่อนเริ่ม</p><nav aria-label="ช่องทางติดต่อ">${link('https://line.me/ti/p/~nongpeetza', 'แอด LINE')}${link('https://m.me/61590190966678', 'Messenger')}${link('tel:+66611699332', 'โทร 061 169 9332')}${link('mailto:sudocoffee.home@gmail.com', 'sudocoffee.home@gmail.com')}</nav></section>`
const organization = { '@type': 'Organization', '@id': `${base}#organization`, name: 'Sudo Command', url: base, telephone: '+66611699332', email: 'sudocoffee.home@gmail.com' }
const css = readFileSync('src/detail.css', 'utf8')
function document(title, description, path, body, entities = []) {
  const url = base + path
  const schema = {'@context':'https://schema.org','@graph':[organization,{'@type':'WebPage','@id':url+'#page',url,name:title,description,inLanguage:'th-TH',isPartOf:{'@id':base+'#website'}},{'@type':'BreadcrumbList',itemListElement:[{'@type':'ListItem',position:1,name:'Sudo Command',item:base},{'@type':'ListItem',position:2,name:title,item:url}]},...entities]}
  return `<!doctype html><html lang="th"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${esc(title)} | Sudo Command</title><meta name="description" content="${esc(description)}"><meta name="robots" content="index,follow,max-image-preview:large"><link rel="canonical" href="${url}"><link rel="icon" href="${base}favicon.svg"><meta property="og:type" content="website"><meta property="og:locale" content="th_TH"><meta property="og:title" content="${esc(title)} | Sudo Command"><meta property="og:description" content="${esc(description)}"><meta property="og:url" content="${url}"><meta property="og:image" content="${base}og.png"><meta name="twitter:card" content="summary_large_image"><link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin><link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=IBM+Plex+Sans+Thai:wght@400;600;700&display=swap"><link rel="stylesheet" href="${base}search.css"><script type="application/ld+json">${json(schema)}</script></head><body><a class="skip" href="#main">ข้ามไปเนื้อหา</a><header><a class="detail-brand" href="${base}"><img src="${base}favicon.svg" alt="" width="40" height="40">sudo.<small>COMMAND</small></a>${menu()}</header><main id="main"><p class="crumb">${link(base,'หน้าหลัก')} / ${esc(title)}</p><h1>${esc(title)}</h1>${body}${contact}</main><footer>${menu()}<p>© Sudo Command · ${link(`${base}privacy.html`,'นโยบายความเป็นส่วนตัว')}</p></footer></body></html>`
}
function save(path, html) { mkdirSync(`dist/${path}`, {recursive:true}); writeFileSync(`dist/${path}index.html`, html) }
writeFileSync('dist/search.css', css)
for (const page of SEARCH_PAGES) {
  const path = `services/${page.slug}/`
  const body = `<p class="intro">${esc(page.intro)}</p>${page.sections.map(([h,p])=>`<section><h2>${esc(h)}</h2><p>${esc(p)}</p></section>`).join('')}<section><h2>ข้อมูลที่ช่วยให้ประเมินงานได้เร็ว</h2><ul>${page.prepare.map(p=>`<li>${esc(p)}</li>`).join('')}</ul></section><section><h2>คำถามก่อนเริ่มงาน</h2>${page.faq.map(([q,a])=>`<details open><summary>${esc(q)}</summary><p>${esc(a)}</p></details>`).join('')}</section><p>${link(base+'portfolio/','ดูตัวอย่างเว็บไซต์ เว็บแอป และระบบหลังบ้าน')}</p>`
  save(path,document(page.title,page.description,path,body,[{'@type':'Service',name:page.title,description:page.description,url:base+path,provider:{'@id':base+'#organization'},areaServed:{'@type':'Country',name:'ประเทศไทย'}}]))
}
const works = DATA.th.works.map(w=>`<article><p>${esc(w.client)}${w.status?' · '+esc(w.status):''}</p><h2>${esc(w.title)}</h2><p>${esc(w.desc)}</p>${w.href?link(w.href,w.linkLabel||'เปิดเว็บไซต์ผลงาน'):''}</article>`).join('')
const images = L10N.th.gallery.items.map(g=>`<figure><a href="${esc(g.src)}"><img src="${esc(g.src)}" alt="${esc(g.title)}" width="720" loading="lazy"></a><figcaption>${esc(g.title)} — ${esc(g.cap)}</figcaption></figure>`).join('')
save('portfolio/',document('ผลงานเว็บไซต์ เว็บแอป และระบบอัตโนมัติ','รวมผลงาน Sudo Command พร้อมเว็บไซต์จริง ภาพหน้าจอเว็บแอปและระบบหลังบ้าน และตัวอย่างคลิปจากงานอัตโนมัติรายวัน','portfolio/',`<p class="intro">${esc(L10N.th.work.note)}</p>${works}<section><h2>ภาพตัวอย่างจากงาน</h2>${images}</section><section><h2>${esc(L10N.th.gallery.video.title)}</h2><p>${esc(L10N.th.gallery.video.desc)}</p><ol>${L10N.th.gallery.video.steps.map(step=>`<li>${esc(step)}</li>`).join('')}</ol><p>${link(L10N.th.gallery.video.href,L10N.th.gallery.video.cta)}</p><p>${link(L10N.th.gallery.video.extraHref,L10N.th.gallery.video.extraLabel)}</p></section>`))
// The normal React app replaces this useful, visible HTML after startup.
// It is served identically to visitors and crawlers and shares the app's data.
let homepage = readFileSync('dist/index.html','utf8')
const fallback = `<header class="wrap"><h1>รับทำเว็บไซต์ เว็บแอป SEO และระบบอัตโนมัติ — Sudo Command</h1><p>รับงานออนไลน์ทั่วประเทศไทย · บางมด กรุงเทพฯ</p></header><main class="wrap"><section><h2>บริการสำหรับธุรกิจ</h2><ul>${SEARCH_PAGES.map(p=>`<li>${link(base+'services/'+p.slug+'/',p.title)}<p>${esc(p.description)}</p></li>`).join('')}</ul></section><section><h2>ผลงานและโครงการที่พัฒนา</h2>${works}<p>${link(base+'portfolio/','ดูผลงานและภาพตัวอย่างทั้งหมด')}</p></section>${contact}</main>`
homepage = homepage.replace('<div id="root"></div>', `<div id="root">${fallback}</div>`)
writeFileSync('dist/index.html', homepage)
const paths = ['', ...SEARCH_PAGES.map(p=>`services/${p.slug}/`),'portfolio/']
const sitemap = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${paths.map(p=>`  <url><loc>${base+p}</loc></url>`).join('\n')}\n</urlset>\n`
writeFileSync('dist/sitemap.xml',sitemap)
console.log(`Generated ${paths.length} searchable pages, service metadata and sitemap.`)
