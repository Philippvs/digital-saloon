import { describe, expect, it } from 'vitest'
import * as v from 'valibot'

import { bookingContactIssueOf, bookingContactSchema, normalizePhoneToE164, telHref } from './phone'

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
  it('accepts valid contact with email and optional notes and normalizes phone', () => {
    const parsed = v.parse(bookingContactSchema, {
      firstName: 'Anna',
      lastName: 'Muster',
      phone: '06601234567',
      email: '  anna@example.com  ',
      notes: '  Bitte warmes Wasser  ',
      privacyAccepted: true,
    })
    expect(parsed.phone).toBe('+436601234567')
    expect(parsed.email).toBe('anna@example.com')
    expect(parsed.notes).toBe('Bitte warmes Wasser')
  })

  it('rejects missing or invalid email', () => {
    expect(() =>
      v.parse(bookingContactSchema, {
        firstName: 'Anna',
        lastName: 'Muster',
        phone: '+436601234567',
        email: '',
        privacyAccepted: true,
      }),
    ).toThrow()

    expect(() =>
      v.parse(bookingContactSchema, {
        firstName: 'Anna',
        lastName: 'Muster',
        phone: '+436601234567',
        email: 'not-an-email',
        privacyAccepted: true,
      }),
    ).toThrow()
  })

  it('rejects missing privacy', () => {
    expect(() =>
      v.parse(bookingContactSchema, {
        firstName: 'Anna',
        lastName: 'Muster',
        phone: '+436601234567',
        email: 'anna@example.com',
        privacyAccepted: false,
      }),
    ).toThrow()
  })
})

describe('telHref', () => {
  it('strips spaces and punctuation but keeps the leading +', () => {
    expect(telHref('+39 0473 449267')).toBe('tel:+390473449267')
  })
})

describe('bookingContactIssueOf', () => {
  const valid = {
    firstName: 'Anna',
    lastName: 'Muster',
    phone: '+436601234567',
    email: 'anna@example.com',
    privacyAccepted: true,
  }
  const issueFor = (input: Record<string, unknown>) => {
    const result = v.safeParse(bookingContactSchema, input)
    if (result.success) throw new Error('expected a validation issue')
    return bookingContactIssueOf(result.issues)
  }

  it('returns a translatable code instead of a German sentence', () => {
    expect(issueFor({ ...valid, privacyAccepted: false })).toBe('privacyRequired')
    expect(issueFor({ ...valid, firstName: '' })).toBe('firstNameRequired')
    expect(issueFor({ ...valid, lastName: 'x'.repeat(81) })).toBe('lastNameTooLong')
    expect(issueFor({ ...valid, phone: '123' })).toBe('phoneInvalid')
    expect(issueFor({ ...valid, email: 'keine-mail' })).toBe('emailInvalid')
    expect(issueFor({ ...valid, notes: 'x'.repeat(1001) })).toBe('notesTooLong')
  })

  it('falls back to a generic code for unexpected issues', () => {
    expect(issueFor({ ...valid, firstName: 42 })).toBe('invalid')
  })
})
