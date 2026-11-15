import * as v from 'valibot'

import type { BookingSettings, ConfirmationMode, SalonDetails } from './schemas'

export const defaultBookingSettings: BookingSettings = {
  confirmationMode: 'AUTOMATIC',
  slotIntervalMinutes: 15,
  minAdvanceBookingMinutes: 60,
  maxAdvanceBookingDays: 60,
  pendingExpirationHours: 24,
}

export const slotIntervalOptions: readonly number[] = [5, 10, 15, 20, 30, 45, 60]

export const bookingNumberRanges = {
  minAdvanceBookingMinutes: { min: 0, max: 10080 },
  maxAdvanceBookingDays: { min: 1, max: 365 },
  pendingExpirationHours: { min: 1, max: 168 },
} as const

export type BookingNumberField = keyof typeof bookingNumberRanges

export const salonDetailsMaxLength = {
  name: 120,
  address: 240,
  phone: 40,
  email: 254,
  vatId: 40,
} as const

export type SalonDetailsField = keyof typeof salonDetailsMaxLength

export type FieldIssue =
  | { kind: 'range'; min: number; max: number }
  | { kind: 'required' }
  | { kind: 'email' }
  | { kind: 'tooLong'; max: number }

export type ValidationResult<Value, Field extends string> =
  { ok: true; value: Value } | { ok: false; issues: Partial<Record<Field, FieldIssue>> }

export type BookingRulesInput = {
  confirmationMode: ConfirmationMode
  slotIntervalMinutes: number
  numbers: Record<BookingNumberField, string>
}

/** Slot interval choices, keeping a stored value that is not one of the presets. */
export function slotIntervalChoices(current: number): readonly number[] {
  return slotIntervalOptions.includes(current)
    ? slotIntervalOptions
    : [...slotIntervalOptions, current].sort((a, b) => a - b)
}

export function bookingNumbersOf(settings: BookingSettings): Record<BookingNumberField, string> {
  return {
    minAdvanceBookingMinutes: String(settings.minAdvanceBookingMinutes),
    maxAdvanceBookingDays: String(settings.maxAdvanceBookingDays),
    pendingExpirationHours: String(settings.pendingExpirationHours),
  }
}

export function validateBookingRules(
  input: BookingRulesInput,
): ValidationResult<BookingSettings, BookingNumberField> {
  const issues: Partial<Record<BookingNumberField, FieldIssue>> = {}
  const parsed = {} as Record<BookingNumberField, number>

  for (const field of Object.keys(bookingNumberRanges) as BookingNumberField[]) {
    const { min, max } = bookingNumberRanges[field]
    const raw = input.numbers[field].trim()
    const value = Number(raw)
    if (!/^\d+$/.test(raw) || value < min || value > max) {
      issues[field] = { kind: 'range', min, max }
    } else {
      parsed[field] = value
    }
  }

  if (Object.keys(issues).length > 0) return { ok: false, issues }
  return {
    ok: true,
    value: {
      confirmationMode: input.confirmationMode,
      slotIntervalMinutes: input.slotIntervalMinutes,
      ...parsed,
    },
  }
}

const emailSchema = v.pipe(v.string(), v.email())

export function salonDetailsInputOf(details: SalonDetails): Record<SalonDetailsField, string> {
  return {
    name: details.name,
    address: details.address,
    phone: details.phone,
    email: details.email,
    vatId: details.vatId ?? '',
  }
}

export function validateSalonDetails(
  input: Record<SalonDetailsField, string>,
): ValidationResult<SalonDetails, SalonDetailsField> {
  const trimmed = {
    name: input.name.trim(),
    address: input.address.trim(),
    phone: input.phone.trim(),
    email: input.email.trim(),
    vatId: input.vatId.trim(),
  }
  const issues: Partial<Record<SalonDetailsField, FieldIssue>> = {}

  for (const field of Object.keys(salonDetailsMaxLength) as SalonDetailsField[]) {
    const max = salonDetailsMaxLength[field]
    if (field !== 'vatId' && trimmed[field].length === 0) {
      issues[field] = { kind: 'required' }
    } else if (trimmed[field].length > max) {
      issues[field] = { kind: 'tooLong', max }
    }
  }
  if (!issues.email && !v.is(emailSchema, trimmed.email)) {
    issues.email = { kind: 'email' }
  }

  if (Object.keys(issues).length > 0) return { ok: false, issues }
  return {
    ok: true,
    value: {
      name: trimmed.name,
      address: trimmed.address,
      phone: trimmed.phone,
      email: trimmed.email,
      vatId: trimmed.vatId.length > 0 ? trimmed.vatId : undefined,
    },
  }
}
