import { describe, expect, it } from 'vitest'
import * as v from 'valibot'

import { bookingContactSchema, normalizePhoneToE164 } from './phone'

describe('normalizePhoneToE164', () => {
  it('keeps valid E.164', () => {
    expect(normalizePhoneToE164('+436601234567')).toBe('+436601234567')
  })

  it('normalizes Austrian national numbers', () => {
    expect(normalizePhoneToE164('0660 1234567')).toBe('+436601234567')
  })

  it('normalizes 0043 prefix', () => {
    expect(normalizePhoneToE164('00436601234567')).toBe('+436601234567')
  })

  it('rejects empty or too short', () => {
    expect(normalizePhoneToE164('')).toBeNull()
    expect(normalizePhoneToE164('123')).toBeNull()
  })
})

describe('bookingContactSchema', () => {
  it('accepts valid contact and normalizes phone', () => {
    const parsed = v.parse(bookingContactSchema, {
      firstName: 'Anna',
      lastName: 'Muster',
      phone: '06601234567',
      privacyAccepted: true,
    })
    expect(parsed.phone).toBe('+436601234567')
  })

  it('rejects missing privacy', () => {
    expect(() =>
      v.parse(bookingContactSchema, {
        firstName: 'Anna',
        lastName: 'Muster',
        phone: '+436601234567',
        privacyAccepted: false,
      }),
    ).toThrow()
  })
})
