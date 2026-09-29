import test from 'node:test'
import assert from 'node:assert/strict'
import { DATA, L10N } from '../src/i18n.js'
for (const lang of ['th','en']) {
  test(`${lang}: application examples contain only conceptual flows`,()=>{
    const items = L10N[lang].gallery.items
    for (const i of [1,2,5]) {assert.equal(items[i].flowOnly,true);assert.match(items[i].src,/\/flow-[a-z]+\.svg$/);assert.ok(!items[i].href)}
  })
  test(`${lang}: project destinations do not expose live systems or source`,()=>{
    assert.ok(L10N[lang].gallery.items.every(item=>!item.href))
    assert.ok(DATA[lang].works.every(item=>!item.href || item.href.startsWith('https://www.facebook.com/')))
  })
}
