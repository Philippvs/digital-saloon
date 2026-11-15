import assert from 'node:assert/strict'
import { afterEach, describe, it } from 'node:test'

import {
  allowLogOnlyDelivery,
  getResendConfig,
  messageForNotificationJob,
  sendEmail,
} from './lib/notifications/emailTransport.js'

describe('emailTransport', () => {
  const previous = { ...process.env }

  afterEach(() => {
    for (const key of Object.keys(process.env)) {
      if (!(key in previous)) delete process.env[key]
    }
    Object.assign(process.env, previous)
  })

  it('builds a confirmation message', () => {
    const message = messageForNotificationJob({
      type: 'RESERVATION_CONFIRMED',
      toEmail: 'a@example.com',
      payload: { firstName: 'Anna', serviceName: 'Haircut', startAt: '2026-04-01T10:00:00.000Z' },
    })
    assert.match(message.subject, /Haircut/)
    assert.match(message.text, /Anna/)
    assert.equal(message.to, 'a@example.com')
  })

  it('allows log-only in the functions emulator', () => {
    delete process.env.RESEND_API_KEY
    delete process.env.RESEND_FROM_EMAIL
    process.env.FUNCTIONS_EMULATOR = 'true'
    assert.equal(allowLogOnlyDelivery(), true)
    assert.equal(getResendConfig(), null)
  })

  it('refuses silent discard outside emulator without Resend', async () => {
    delete process.env.RESEND_API_KEY
    delete process.env.RESEND_FROM_EMAIL
    delete process.env.FUNCTIONS_EMULATOR
    delete process.env.NOTIFICATIONS_ALLOW_LOG_ONLY
    const result = await sendEmail({
      to: 'a@example.com',
      subject: 't',
      text: 'b',
    })
    assert.equal(result.ok, false)
    assert.match(result.error, /RESEND_API_KEY/)
  })

  it('log-only succeeds when explicitly allowed', async () => {
    delete process.env.RESEND_API_KEY
    delete process.env.FUNCTIONS_EMULATOR
    process.env.NOTIFICATIONS_ALLOW_LOG_ONLY = 'true'
    const result = await sendEmail({
      to: 'a@example.com',
      subject: 't',
      text: 'b',
    })
    assert.deepEqual(result, { ok: true, mode: 'log' })
  })
})
