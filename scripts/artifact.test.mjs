import test from 'node:test'
import assert from 'node:assert/strict'
import { mkdtemp, cp, rename, appendFile, rm } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { resolve, join, dirname } from 'node:path'
import { spawnSync } from 'node:child_process'
const script = resolve('scripts/security.mjs')
async function fixture(change) {
  const tempRoot = resolve(tmpdir())
  const dir = await mkdtemp(join(tempRoot,'sudo-artifact-test-'))
  if (dirname(resolve(dir)) !== tempRoot) throw new Error('Unsafe cleanup path')
  try {
    await cp(resolve('dist'),join(dir,'dist'),{recursive:true})
    await change(join(dir,'dist'))
    return spawnSync(process.execPath,[script,'check'],{cwd:dir,encoding:'utf8'})
  } finally {
    await rm(dir,{recursive:true,force:true})
  }
}
test('unchanged built release verifies',async()=>assert.equal((await fixture(async()=>{})).status,0))
test('missing required page fails even when page count stays the same',async()=>{
  const r=await fixture(dir=>rename(join(dir,'privacy.html'),join(dir,'extra.html')))
  assert.notEqual(r.status,0);assert.match(r.stderr,/Missing required page/)
})
test('changed artifact fails integrity verification',async()=>{
  const r=await fixture(dir=>appendFile(join(dir,'theme.js'),'\n// unexpected change'))
  assert.notEqual(r.status,0);assert.match(r.stderr,/manifest does not match/)
})
