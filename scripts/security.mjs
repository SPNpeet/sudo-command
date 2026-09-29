import { createHash } from 'node:crypto'
import { readdir, readFile, writeFile } from 'node:fs/promises'
import { join, relative } from 'node:path'
import { pathToFileURL } from 'node:url'

const hash = value => "'sha256-" + createHash('sha256').update(value.replace(/\r\n?/g, '\n')).digest('base64') + "'"
const blocks = (html, tag) => [...html.matchAll(new RegExp(`<${tag}\\b([^>]*)>([\\s\\S]*?)<\\/${tag}>`, 'gi'))]
export function policyFor(html) {
  const scripts = blocks(html, 'script').filter(m => !/\bsrc\s*=/i.test(m[1])).map(m => hash(m[2]))
  const styles = blocks(html, 'style').map(m => hash(m[2]))
  return [`default-src 'none'`, `script-src 'self' ${scripts.join(' ')}`.trim(), `script-src-attr 'none'`, `style-src 'self' https://fonts.googleapis.com ${styles.join(' ')}`.trim(), `style-src-attr 'none'`, `font-src 'self' https://fonts.gstatic.com`, `img-src 'self' data:`, `connect-src 'none'`, `manifest-src 'self'`, `object-src 'none'`, `base-uri 'none'`, `form-action 'none'`, `frame-src 'none'`, 'upgrade-insecure-requests'].join('; ')
}
export function harden(html) {
  const clean = html.replace(/<meta\s+http-equiv="Content-Security-Policy"[^>]*>\s*/gi, '').replace(/<meta\s+name="referrer"[^>]*>\s*/gi, '')
  return clean.replace(/(<meta\s+charset=[^>]+>)\s*/i, `$1\n<meta http-equiv="Content-Security-Policy" content="${policyFor(clean)}">\n<meta name="referrer" content="no-referrer">\n`)
}
export function allowedScriptSource(attributes) {
  const match = attributes.match(/\bsrc\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s>]+))/i)
  if (!match) return !/\bsrc\b/i.test(attributes)
  const value = match[1] ?? match[2] ?? match[3]
  // Reject ambiguous encoded/control characters before URL normalization.
  if (/[&\\\s]/.test(value)) return false
  try {
    const url = new URL(value, 'https://spnpeet.github.io/sudo-command/')
    return url.origin === 'https://spnpeet.github.io' && /^\/sudo-command\/(?:theme\.js|assets\/[A-Za-z0-9_.-]+\.js)$/.test(url.pathname) && !url.search && !url.hash
  } catch { return false }
}
export const REQUIRED_PAGES = ['index.html','privacy.html','404.html','portfolio/index.html',...['website','seo','ads','web-app-automation','line-oa'].map(s => `services/${s}/index.html`)]
export function inspect(html) {
  const errors = []
  const csp = html.match(/<meta\s+http-equiv="Content-Security-Policy"\s+content="([^"]+)"/i)
  if (!csp || csp[1] !== policyFor(html)) errors.push('CSP missing, altered or inline hash mismatch')
  if (csp && html.indexOf(csp[0]) > html.search(/<(script|link|style)\b/i)) errors.push('CSP must precede resource loads')
  if (!/<meta name="referrer" content="no-referrer">/.test(html)) errors.push('Referrer policy missing')
  if (/\son[a-z]+\s*=|(?:href|src)\s*=\s*["']\s*javascript:/i.test(html)) errors.push('Inline handler or javascript URL')
  if (/<base\b|<iframe\b|<form\b/i.test(html)) errors.push('Unexpected base, frame or form element')
  if (/\ssrc=["']http:\/\//i.test(html)) errors.push('Insecure resource')
  for (const m of blocks(html, 'script')) if (!allowedScriptSource(m[1])) errors.push('Unexpected or ambiguous script source')
  return errors
}
async function files(dir) {
  const entries = await readdir(dir, {withFileTypes:true})
  return (await Promise.all(entries.map(e => e.isDirectory() ? files(join(dir,e.name)) : [join(dir,e.name)]))).flat()
}
async function run(mode) {
  if (!['harden','check'].includes(mode)) throw new Error('Use harden or check')
  const all = (await files('dist')).sort(); let count = 0
  const published = new Set(all.map(file => relative('dist',file).replaceAll('\\','/')))
  for (const page of REQUIRED_PAGES) if (!published.has(page)) throw new Error('Missing required page: '+page)
  for (const file of all) {
    if (/(?:^|[\\/])\.env|\.(?:pem|key|p12|map)$/i.test(file)) throw new Error('Forbidden deployment file: '+relative('dist',file))
    if (/\.(?:html|js|css|json|txt|xml|svg)$/.test(file)) {
      const text = await readFile(file,'utf8')
      if (/-----BEGIN (?:RSA |EC |OPENSSH )?PRIVATE KEY-----|gh[pousr]_[A-Za-z0-9]{30,}|AKIA[A-Z0-9]{16}/.test(text)) throw new Error('Potential credential in deployment file: '+relative('dist',file))
    }
    if (!/\.html$/.test(file)) continue
    let html = await readFile(file,'utf8')
    if (mode === 'harden') {html = harden(html);await writeFile(file,html)}
    const errors = inspect(html)
    if (errors.length) throw new Error(`${file}: ${errors.join('; ')}`)
    count++
  }
  if (count < 9) throw new Error('Expected homepage, privacy, portfolio, five services and 404')
  const manifestPath = join('dist','release-manifest.json')
  const integrity = {}
  for (const file of all.filter(file => file !== manifestPath)) integrity[relative('dist',file).replaceAll('\\','/')] = createHash('sha256').update(await readFile(file)).digest('hex')
  if (mode === 'harden') {
    await writeFile(manifestPath, JSON.stringify({schema:1, sourceCommit:process.env.GITHUB_SHA || 'local-unreleased', algorithm:'sha256', files:integrity},null,2)+'\n')
  } else {
    const manifest = JSON.parse(await readFile(manifestPath,'utf8'))
    if (JSON.stringify(manifest.files) !== JSON.stringify(integrity)) throw new Error('Release manifest does not match deployment files')
    if (process.env.GITHUB_SHA && manifest.sourceCommit !== process.env.GITHUB_SHA) throw new Error('Release source commit mismatch')
  }
  console.log(`Security policy verified on ${count} HTML pages; deployment file checks passed.`)
}
if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) await run(process.argv[2])
