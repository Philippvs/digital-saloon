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

/**
 * Validation problems in the booking contact form. The schemas below use these codes as
 * their messages; the UI translates them, so customers see their own language.
 */
export const bookingContactIssues = [
  'firstNameRequired',
  'firstNameTooLong',
  'lastNameRequired',
  'lastNameTooLong',
  'phoneInvalid',
  'emailRequired',
  'emailTooLong',
  'emailInvalid',
  'notesTooLong',
  'privacyRequired',
  'invalid',
] as const
export type BookingContactIssue = (typeof bookingContactIssues)[number]

/** First problem of a failed `bookingContactSchema` parse as a translatable code. */
export function bookingContactIssueOf(
  issues: readonly v.BaseIssue<unknown>[],
): BookingContactIssue {
  const message = issues[0]?.message
  return bookingContactIssues.find((code) => code === message) ?? 'invalid'
}

const issue = (code: BookingContactIssue): BookingContactIssue => code

export const phoneE164Schema = v.pipe(
  v.string(),
  v.minLength(1, issue('phoneInvalid')),
  v.maxLength(40, issue('phoneInvalid')),
  v.check((value) => normalizePhoneToE164(value) !== null, issue('phoneInvalid')),
  v.transform((value) => normalizePhoneToE164(value)!),
)

export const emailSchema = v.pipe(
  v.string(),
  v.trim(),
  v.minLength(1, issue('emailRequired')),
  v.maxLength(254, issue('emailTooLong')),
  v.email(issue('emailInvalid')),
)

export const notesSchema = v.optional(
  v.pipe(v.string(), v.trim(), v.maxLength(1000, issue('notesTooLong'))),
)

export const bookingContactSchema = v.object({
  firstName: v.pipe(
    v.string(),
    v.minLength(1, issue('firstNameRequired')),
    v.maxLength(80, issue('firstNameTooLong')),
  ),
  lastName: v.pipe(
    v.string(),
    v.minLength(1, issue('lastNameRequired')),
    v.maxLength(80, issue('lastNameTooLong')),
  ),
  phone: phoneE164Schema,
  email: emailSchema,
  notes: notesSchema,
  privacyAccepted: v.literal(true, issue('privacyRequired')),
})

export type BookingContact = v.InferOutput<typeof bookingContactSchema>

/** `tel:` link for a displayed phone number such as `+39 0473 449267`. */
export function telHref(phone: string): string {
  return `tel:${phone.replace(/[^\d+]/g, '')}`
}
