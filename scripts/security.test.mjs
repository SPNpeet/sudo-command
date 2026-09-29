import test from 'node:test'
import assert from 'node:assert/strict'
import { harden, inspect, allowedScriptSource } from './security.mjs'
const sample = '<html><head><meta charset="utf-8"><style>body{color:red}</style></head><body><script>console.log("ok")</script></body></html>'
test('valid policy is early, hash based and idempotent',()=>{const secured=harden(sample);assert.deepEqual(inspect(secured),[]);assert.equal(harden(secured),secured);assert.ok(!secured.includes("unsafe-inline"));assert.ok(!secured.includes("unsafe-eval"))})
test('modified inline code fails closed',()=>assert.ok(inspect(harden(sample).replace('console.log("ok")','alert(1)')).length))
test('event handlers, forms and external scripts fail',()=>{for(const payload of ['<img onerror="alert(1)">','<form></form>','<script src="https://evil.invalid/code.js"></script>']) assert.ok(inspect(harden(sample.replace('</body>',payload+'</body>'))).length)})
test('CRLF content hashes normalize as browsers do',()=>assert.deepEqual(inspect(harden(sample.replace('console.log','\r\nconsole.log'))),[]))

test('script source validation rejects unquoted and encoded bypasses',()=>{
  for(const source of ['src=https://evil.invalid/code.js','src="//evil.invalid/code.js"','src="theme.js.evil"','src="theme.js?redirect=1"','src="https://spnpeet.github.io.evil.invalid/sudo-command/theme.js"','src="&#104;ttps://evil.invalid/a.js"','src="/sudo-command/../other.js"']) assert.equal(allowedScriptSource(source),false,source)
  for(const source of ['src="theme.js"','src=/sudo-command/assets/index-test.js','src="https://spnpeet.github.io/sudo-command/theme.js"']) assert.equal(allowedScriptSource(source),true,source)
})
