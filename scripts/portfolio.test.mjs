import test from 'node:test'
import assert from 'node:assert/strict'
import { DATA, L10N } from '../src/i18n.js'
for (const lang of ['th','en']) {
  test(`${lang}: application examples use reviewed screenshots or labeled conceptual flows`,()=>{
    const items = L10N[lang].gallery.items
    for (const [i,file] of [[1,'work-sudochatbot.png'],[2,'work-natee-admin.jpg']]) {assert.equal(items[i].flowOnly,false);assert.equal(items[i].src,`/sudo-command/gallery/${file}`);assert.ok(!items[i].href)}
    for (const i of [5,7]) {assert.equal(items[i].flowOnly,true);assert.match(items[i].src,/\/flow-[a-z]+\.svg$/);assert.ok(!items[i].href)}
  })
  test(`${lang}: project destinations do not expose live systems or source`,()=>{
    assert.ok(L10N[lang].gallery.items.every(item=>!item.href))
    assert.ok(DATA[lang].works.every(item=>!item.href || item.href.startsWith('https://www.facebook.com/')))
  })
}

