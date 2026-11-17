import assert from 'node:assert/strict'
import { createHash, randomBytes } from 'node:crypto'
import { describe, it } from 'node:test'

import { hashManagementToken } from './lib/booking/tokens.js'

describe('management tokens', () => {
  it('hashes with SHA-256 hex and does not equal the raw token', () => {
    const token = randomBytes(32).toString('base64url')
    const hash = hashManagementToken(token)
    assert.equal(hash.length, 64)
    assert.notEqual(hash, token)
    assert.equal(hash, createHash('sha256').update(token).digest('hex'))
  })

  it('is deterministic for the same token', () => {
    const token = 'test-token-value-16chars'
    assert.equal(hashManagementToken(token), hashManagementToken(token))
  })
})
