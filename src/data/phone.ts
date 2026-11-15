import * as v from 'valibot'

/** Digits only (leading + preserved separately). */
function digitsOnly(value: string): string {
  return value.replace(/\D/g, '')
}

/**
 * Normalize common AT phone inputs to E.164 (+…).
 * Accepts +43…, 0043…, and national 0… forms.
 */
export function normalizePhoneToE164(raw: string, defaultCountry = 'AT'): string | null {
  const trimmed = raw.trim()
  if (trimmed.length === 0) return null

  let digits = digitsOnly(trimmed)
  if (digits.length === 0) return null

  if (trimmed.startsWith('+')) {
    if (digits.length < 8 || digits.length > 15) return null
    return `+${digits}`
  }

  if (digits.startsWith('00') && digits.length > 4) {
    digits = digits.slice(2)
    if (digits.length < 8 || digits.length > 15) return null
    return `+${digits}`
  }

  if (defaultCountry === 'AT') {
    if (digits.startsWith('0')) {
      digits = `43${digits.slice(1)}`
    } else if (!digits.startsWith('43')) {
      digits = `43${digits}`
    }
    if (digits.length < 10 || digits.length > 15) return null
    return `+${digits}`
  }

  if (digits.length < 8 || digits.length > 15) return null
  return `+${digits}`
}

export const phoneE164Schema = v.pipe(
  v.string(),
  v.minLength(1),
  v.maxLength(40),
  v.check(
    (value) => normalizePhoneToE164(value) !== null,
    'Telefonnummer muss gültig sein (z. B. 0660 1234567).',
  ),
  v.transform((value) => normalizePhoneToE164(value)!),
)

export const bookingContactSchema = v.object({
  firstName: v.pipe(v.string(), v.minLength(1), v.maxLength(80)),
  lastName: v.pipe(v.string(), v.minLength(1), v.maxLength(80)),
  phone: phoneE164Schema,
  privacyAccepted: v.literal(true),
})

export type BookingContact = v.InferOutput<typeof bookingContactSchema>
