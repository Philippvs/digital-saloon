import type { Locale } from '../i18n'
import type { FieldIssue, ValidationResult } from './settingsForm'
import type { Service } from './schemas'

export const serviceLimits = {
  nameMaxLength: 120,
  descriptionMaxLength: 1000,
  minDurationMinutes: 5,
  maxDurationMinutes: 480,
  maxPriceCents: 999_999,
} as const

/** Fields an admin can change. `createdAt` and the id never change after creation. */
export type ServiceDraft = Pick<
  Service,
  | 'nameDe'
  | 'nameIt'
  | 'descriptionDe'
  | 'descriptionIt'
  | 'durationMinutes'
  | 'priceCents'
  | 'active'
>

export type ServiceFormField =
  'nameDe' | 'nameIt' | 'descriptionDe' | 'descriptionIt' | 'duration' | 'price'

export type ServiceFormInput = {
  nameDe: string
  nameIt: string
  descriptionDe: string
  descriptionIt: string
  duration: string
  /** Euro amount as typed, e.g. `26`, `26,50`, or `26.5`. */
  price: string
  active: boolean
}

export const emptyServiceFormInput: ServiceFormInput = {
  nameDe: '',
  nameIt: '',
  descriptionDe: '',
  descriptionIt: '',
  duration: '30',
  price: '',
  active: true,
}

/**
 * Maps a Firestore service document to the current bilingual shape.
 * Old docs used a single `name` / `description`, often as `Deutsch / Italiano`.
 */
export function normalizeServiceDocument(raw: Record<string, unknown>): Service {
  const nameDe =
    typeof raw.nameDe === 'string'
      ? raw.nameDe
      : typeof raw.name === 'string'
        ? splitBilingual(raw.name).de
        : ''
  const nameIt =
    typeof raw.nameIt === 'string'
      ? raw.nameIt
      : typeof raw.name === 'string'
        ? splitBilingual(raw.name).it
        : nameDe
  const descriptionDe =
    typeof raw.descriptionDe === 'string'
      ? raw.descriptionDe
      : typeof raw.description === 'string'
        ? splitBilingual(raw.description).de
        : ''
  const descriptionIt =
    typeof raw.descriptionIt === 'string'
      ? raw.descriptionIt
      : typeof raw.description === 'string'
        ? splitBilingual(raw.description).it
        : descriptionDe

  return {
    nameDe,
    nameIt,
    descriptionDe,
    descriptionIt,
    durationMinutes: Number(raw.durationMinutes),
    priceCents: Number(raw.priceCents),
    active: Boolean(raw.active),
    createdAt: String(raw.createdAt ?? ''),
    updatedAt: String(raw.updatedAt ?? ''),
  }
}

/** Split `Deutsch / Italiano` once; if there is no separator, both sides share the text. */
export function splitBilingual(value: string): { de: string; it: string } {
  const trimmed = value.trim()
  const separator = ' / '
  const index = trimmed.indexOf(separator)
  if (index === -1) return { de: trimmed, it: trimmed }
  const de = trimmed.slice(0, index).trim()
  const it = trimmed.slice(index + separator.length).trim()
  return { de: de || trimmed, it: it || de || trimmed }
}

export function localizedServiceName(service: ServiceDraft, locale: Locale): string {
  return locale === 'it' ? service.nameIt : service.nameDe
}

export function localizedServiceDescription(service: ServiceDraft, locale: Locale): string {
  const text = locale === 'it' ? service.descriptionIt : service.descriptionDe
  return text.trim()
}

/** Compact bilingual label for reservations and the admin list (both languages at once). */
export function bilingualServiceName(service: ServiceDraft): string {
  const de = service.nameDe.trim()
  const it = service.nameIt.trim()
  if (!it || it === de) return de
  if (!de) return it
  return `${de} / ${it}`
}

export function serviceFormInputOf(service: ServiceDraft): ServiceFormInput {
  const euros = Math.floor(service.priceCents / 100)
  const cents = service.priceCents % 100
  return {
    nameDe: service.nameDe,
    nameIt: service.nameIt,
    descriptionDe: service.descriptionDe,
    descriptionIt: service.descriptionIt,
    duration: String(service.durationMinutes),
    price: cents === 0 ? String(euros) : `${euros},${String(cents).padStart(2, '0')}`,
    active: service.active,
  }
}

/** Parses a euro amount with comma or dot decimals into cents; `null` when invalid. */
export function parsePriceCents(raw: string): number | null {
  const match = /^(\d{1,6})(?:[.,](\d{1,2}))?$/.exec(raw.trim().replace(/^€\s*|\s*€$/g, ''))
  if (!match) return null
  const cents = Number(match[1]) * 100 + Number((match[2] ?? '').padEnd(2, '0'))
  return cents <= serviceLimits.maxPriceCents ? cents : null
}

export function validateServiceForm(
  input: ServiceFormInput,
): ValidationResult<ServiceDraft, ServiceFormField> {
  const issues: Partial<Record<ServiceFormField, FieldIssue>> = {}
  const nameDe = input.nameDe.trim()
  const nameIt = input.nameIt.trim()
  const descriptionDe = input.descriptionDe.trim()
  const descriptionIt = input.descriptionIt.trim()

  if (nameDe.length === 0) issues.nameDe = { kind: 'required' }
  else if (nameDe.length > serviceLimits.nameMaxLength) {
    issues.nameDe = { kind: 'tooLong', max: serviceLimits.nameMaxLength }
  }
  if (nameIt.length === 0) issues.nameIt = { kind: 'required' }
  else if (nameIt.length > serviceLimits.nameMaxLength) {
    issues.nameIt = { kind: 'tooLong', max: serviceLimits.nameMaxLength }
  }
  if (descriptionDe.length > serviceLimits.descriptionMaxLength) {
    issues.descriptionDe = { kind: 'tooLong', max: serviceLimits.descriptionMaxLength }
  }
  if (descriptionIt.length > serviceLimits.descriptionMaxLength) {
    issues.descriptionIt = { kind: 'tooLong', max: serviceLimits.descriptionMaxLength }
  }

  const durationRaw = input.duration.trim()
  const durationMinutes = Number(durationRaw)
  if (
    !/^\d+$/.test(durationRaw) ||
    durationMinutes < serviceLimits.minDurationMinutes ||
    durationMinutes > serviceLimits.maxDurationMinutes
  ) {
    issues.duration = {
      kind: 'range',
      min: serviceLimits.minDurationMinutes,
      max: serviceLimits.maxDurationMinutes,
    }
  }

  const priceCents = parsePriceCents(input.price)
  if (input.price.trim().length === 0) issues.price = { kind: 'required' }
  else if (priceCents === null) issues.price = { kind: 'price' }

  if (Object.keys(issues).length > 0 || priceCents === null) {
    return { ok: false, issues }
  }
  return {
    ok: true,
    value: {
      nameDe,
      nameIt,
      descriptionDe,
      descriptionIt,
      durationMinutes,
      priceCents,
      active: input.active,
    },
  }
}

/** Active services first, then by price like the public price list. */
export function sortServicesForAdmin<T extends ServiceDraft>(services: readonly T[]): T[] {
  return [...services].sort(
    (a, b) =>
      Number(b.active) - Number(a.active) ||
      a.priceCents - b.priceCents ||
      a.nameDe.localeCompare(b.nameDe),
  )
}
