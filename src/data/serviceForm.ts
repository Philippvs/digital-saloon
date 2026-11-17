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
  'name' | 'description' | 'durationMinutes' | 'priceCents' | 'active'
>

export type ServiceFormField = 'name' | 'description' | 'duration' | 'price'

export type ServiceFormInput = {
  name: string
  description: string
  duration: string
  /** Euro amount as typed, e.g. `26`, `26,50`, or `26.5`. */
  price: string
  active: boolean
}

export const emptyServiceFormInput: ServiceFormInput = {
  name: '',
  description: '',
  duration: '30',
  price: '',
  active: true,
}

export function serviceFormInputOf(service: ServiceDraft): ServiceFormInput {
  const euros = Math.floor(service.priceCents / 100)
  const cents = service.priceCents % 100
  return {
    name: service.name,
    description: service.description,
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
  const name = input.name.trim()
  const description = input.description.trim()

  if (name.length === 0) issues.name = { kind: 'required' }
  else if (name.length > serviceLimits.nameMaxLength) {
    issues.name = { kind: 'tooLong', max: serviceLimits.nameMaxLength }
  }
  if (description.length > serviceLimits.descriptionMaxLength) {
    issues.description = { kind: 'tooLong', max: serviceLimits.descriptionMaxLength }
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
    value: { name, description, durationMinutes, priceCents, active: input.active },
  }
}

/** Active services first, then by price like the public price list. */
export function sortServicesForAdmin<T extends ServiceDraft>(services: readonly T[]): T[] {
  return [...services].sort(
    (a, b) =>
      Number(b.active) - Number(a.active) ||
      a.priceCents - b.priceCents ||
      a.name.localeCompare(b.name),
  )
}
