import assert from 'node:assert/strict'
import test from 'node:test'

test('functions package builds to lib/index.js', async () => {
  const mod = await import('./lib/index.js')
  assert.equal(typeof mod.ping, 'function')
})
