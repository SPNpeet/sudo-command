import test from 'node:test'
import assert from 'node:assert/strict'
import { harden, inspect } from './security.mjs'
const sample = '<html><head><meta charset="utf-8"><style>body{color:red}</style></head><body><script>console.log("ok")</script></body></html>'
test('valid policy is early, hash based and idempotent',()=>{const secured=harden(sample);assert.deepEqual(inspect(secured),[]);assert.equal(harden(secured),secured);assert.ok(!secured.includes("unsafe-inline"));assert.ok(!secured.includes("unsafe-eval"))})
test('modified inline code fails closed',()=>assert.ok(inspect(harden(sample).replace('console.log("ok")','alert(1)')).length))
test('event handlers, forms and external scripts fail',()=>{for(const payload of ['<img onerror="alert(1)">','<form></form>','<script src="https://evil.invalid/code.js"></script>']) assert.ok(inspect(harden(sample.replace('</body>',payload+'</body>'))).length)})
test('CRLF content hashes normalize as browsers do',()=>assert.deepEqual(inspect(harden(sample.replace('console.log','\r\nconsole.log'))),[]))
