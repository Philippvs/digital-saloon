import { describe, expect, it } from 'vitest'
import * as v from 'valibot'

import { bookingSettingsSchema, salonDetailsSchema } from './schemas'
import {
  bookingNumberRanges,
  bookingNumbersOf,
  defaultBookingSettings,
  salonDetailsInputOf,
  slotIntervalChoices,
  validateBookingRules,
  validateSalonDetails,
} from './settingsForm'

const validNumbers = bookingNumbersOf(defaultBookingSettings)

const validSalon = {
  name: 'KIMM Hair',
  address: 'Via Piave 71, 39012 Meran',
  phone: '+39 0473 449267',
  email: 'info@example.com',
  vatId: '01732550213',
}

describe('validateBookingRules', () => {
  it('turns the form strings into settings the schema accepts', () => {
    const result = validateBookingRules({
      confirmationMode: 'MANUAL',
      slotIntervalMinutes: 30,
      numbers: {
        minAdvanceBookingMinutes: ' 120 ',
        maxAdvanceBookingDays: '90',
        pendingExpirationHours: '48',
      },
    })
    expect(result).toEqual({
      ok: true,
      value: {
        confirmationMode: 'MANUAL',
        slotIntervalMinutes: 30,
        minAdvanceBookingMinutes: 120,
        maxAdvanceBookingDays: 90,
        pendingExpirationHours: 48,
      },
    })
    if (result.ok) expect(v.is(bookingSettingsSchema, result.value)).toBe(true)
  })

  it('round-trips the stored settings unchanged', () => {
    expect(
      validateBookingRules({
        confirmationMode: defaultBookingSettings.confirmationMode,
        slotIntervalMinutes: defaultBookingSettings.slotIntervalMinutes,
        numbers: validNumbers,
      }),
    ).toEqual({ ok: true, value: defaultBookingSettings })
  })

  it.each([
    ['minAdvanceBookingMinutes', '-1'],
    ['minAdvanceBookingMinutes', '10081'],
    ['maxAdvanceBookingDays', '0'],
    ['maxAdvanceBookingDays', '366'],
    ['pendingExpirationHours', '0'],
    ['pendingExpirationHours', '169'],
    ['pendingExpirationHours', '1.5'],
    ['pendingExpirationHours', '1e2'],
    ['pendingExpirationHours', 'abc'],
    ['pendingExpirationHours', ''],
  ] as const)('rejects %s = %j with the allowed range', (field, raw) => {
    const result = validateBookingRules({
      confirmationMode: 'AUTOMATIC',
      slotIntervalMinutes: 15,
      numbers: { ...validNumbers, [field]: raw },
    })
    expect(result).toEqual({
      ok: false,
      issues: { [field]: { kind: 'range', ...bookingNumberRanges[field] } },
    })
  })

  it('accepts the exact range boundaries', () => {
    for (const bound of ['min', 'max'] as const) {
      const result = validateBookingRules({
        confirmationMode: 'AUTOMATIC',
        slotIntervalMinutes: 15,
        numbers: {
          minAdvanceBookingMinutes: String(bookingNumberRanges.minAdvanceBookingMinutes[bound]),
          maxAdvanceBookingDays: String(bookingNumberRanges.maxAdvanceBookingDays[bound]),
          pendingExpirationHours: String(bookingNumberRanges.pendingExpirationHours[bound]),
        },
      })
      expect(result.ok).toBe(true)
      if (result.ok) expect(v.is(bookingSettingsSchema, result.value)).toBe(true)
    }
  })

  it('reports every invalid field at once', () => {
    const result = validateBookingRules({
      confirmationMode: 'AUTOMATIC',
      slotIntervalMinutes: 15,
      numbers: {
        minAdvanceBookingMinutes: 'x',
        maxAdvanceBookingDays: '0',
        pendingExpirationHours: '24',
      },
    })
    expect(result.ok).toBe(false)
    if (!result.ok) {
      expect(Object.keys(result.issues).sort()).toEqual([
        'maxAdvanceBookingDays',
        'minAdvanceBookingMinutes',
      ])
    }
  })
})

describe('slotIntervalChoices', () => {
  it('offers the presets for a preset value', () => {
    expect(slotIntervalChoices(15)).toEqual([5, 10, 15, 20, 30, 45, 60])
  })

  it('keeps a stored value that is not a preset, in order', () => {
    expect(slotIntervalChoices(25)).toEqual([5, 10, 15, 20, 25, 30, 45, 60])
  })
})

describe('validateSalonDetails', () => {
  it('trims input and returns details the schema accepts', () => {
    const result = validateSalonDetails({
      name: '  KIMM Hair ',
      address: ' Via Piave 71, 39012 Meran',
      phone: '+39 0473 449267 ',
      email: ' info@example.com ',
      vatId: ' 01732550213 ',
    })
    expect(result).toEqual({ ok: true, value: validSalon })
    if (result.ok) expect(v.is(salonDetailsSchema, result.value)).toBe(true)
  })

  it('drops an empty VAT number instead of saving an empty string', () => {
    const result = validateSalonDetails({ ...validSalon, vatId: '   ' })
    expect(result).toEqual({ ok: true, value: { ...validSalon, vatId: undefined } })
  })

  it('requires name, address, phone, and email', () => {
    const result = validateSalonDetails({
      name: ' ',
      address: '',
      phone: '',
      email: '',
      vatId: '',
    })
    expect(result).toEqual({
      ok: false,
      issues: {
        name: { kind: 'required' },
        address: { kind: 'required' },
        phone: { kind: 'required' },
        email: { kind: 'required' },
      },
    })
  })

  it.each(['keine-mail', 'a@', '@example.com', 'info@example'])('rejects the email %j', (email) => {
    expect(validateSalonDetails({ ...validSalon, email })).toEqual({
      ok: false,
      issues: { email: { kind: 'email' } },
    })
  })

  it.each([
    ['name', 120],
    ['address', 240],
    ['phone', 40],
    ['vatId', 40],
  ] as const)('limits %s to %i characters like the schema and rules', (field, max) => {
    expect(validateSalonDetails({ ...validSalon, [field]: 'x'.repeat(max) }).ok).toBe(true)
    expect(validateSalonDetails({ ...validSalon, [field]: 'x'.repeat(max + 1) })).toEqual({
      ok: false,
      issues: { [field]: { kind: 'tooLong', max } },
    })
  })

  it('round-trips stored details through the form input', () => {
    expect(validateSalonDetails(salonDetailsInputOf(validSalon))).toEqual({
      ok: true,
      value: validSalon,
    })
    expect(salonDetailsInputOf({ ...validSalon, vatId: undefined }).vatId).toBe('')
  })
})

describe('salonDetailsSchema', () => {
  it('does not let the editable details carry a timezone', () => {
    const parsed = v.parse(salonDetailsSchema, { ...validSalon, timezone: 'Europe/Rome' })
    expect(parsed).not.toHaveProperty('timezone')
  })
})
