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
export function inspect(html) {
  const errors = []
  const csp = html.match(/<meta\s+http-equiv="Content-Security-Policy"\s+content="([^"]+)"/i)
  if (!csp || csp[1] !== policyFor(html)) errors.push('CSP missing, altered or inline hash mismatch')
  if (csp && html.indexOf(csp[0]) > html.search(/<(script|link|style)\b/i)) errors.push('CSP must precede resource loads')
  if (!/<meta name="referrer" content="no-referrer">/.test(html)) errors.push('Referrer policy missing')
  if (/\son[a-z]+\s*=|(?:href|src)\s*=\s*["']\s*javascript:/i.test(html)) errors.push('Inline handler or javascript URL')
  if (/<base\b|<iframe\b|<form\b/i.test(html)) errors.push('Unexpected base, frame or form element')
  if (/\ssrc=["']http:\/\//i.test(html)) errors.push('Insecure resource')
  for (const m of blocks(html, 'script')) if (/\bsrc\s*=/i.test(m[1]) && !/\bsrc=["'](?:\/sudo-command\/|https:\/\/spnpeet\.github\.io\/sudo-command\/|theme\.js)/i.test(m[1])) errors.push('Unexpected script origin')
  return errors
}
async function files(dir) {
  const entries = await readdir(dir, {withFileTypes:true})
  return (await Promise.all(entries.map(e => e.isDirectory() ? files(join(dir,e.name)) : [join(dir,e.name)]))).flat()
}
async function run(mode) {
  if (!['harden','check'].includes(mode)) throw new Error('Use harden or check')
  const all = await files('dist'); let count = 0
  for (const file of all) {
    if (/(?:^|[\\/])\.env|\.(?:pem|key|p12|map)$/i.test(file)) throw new Error('Forbidden deployment file: '+relative('dist',file))
    if (!/\.html$/.test(file)) continue
    let html = await readFile(file,'utf8')
    if (mode === 'harden') {html = harden(html);await writeFile(file,html)}
    const errors = inspect(html)
    if (errors.length) throw new Error(`${file}: ${errors.join('; ')}`)
    count++
  }
  if (count < 9) throw new Error('Expected homepage, privacy, portfolio, five services and 404')
  console.log(`Security policy verified on ${count} HTML pages; deployment file checks passed.`)
}
if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) await run(process.argv[2])
