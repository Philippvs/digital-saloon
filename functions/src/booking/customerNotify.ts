import type { SalonContext } from './salonContext'
import {
  customerEmailOf,
  isReservationScheduleChange,
  sendBookingEmailWithBudget,
  serviceIdsOf,
  type BookingEmailInput,
} from './sendBookingEmail'

type ReservationFields = Record<string, unknown>

function localeOf(data: ReservationFields): 'de' | 'it' {
  return data.locale === 'it' ? 'it' : 'de'
}

function baseInput(
  reservationId: string,
  data: ReservationFields,
  to: string,
  salon: Pick<SalonContext, 'salonName' | 'salonAddress' | 'salonPhone' | 'timeZone'>,
  extras: Partial<BookingEmailInput> = {},
): BookingEmailInput {
  const status = data.status === 'PENDING' ? 'PENDING' : 'CONFIRMED'
  return {
    kind: 'confirmation',
    reservationId,
    to,
    firstName: String(data.firstName ?? ''),
    lastName: String(data.lastName ?? ''),
    serviceName: String(data.serviceName ?? ''),
    durationMinutes: Number(data.durationMinutes ?? 0),
    startAt: new Date(String(data.startAt)),
    status,
    managementToken: null,
    notes: data.notes == null || data.notes === '' ? null : String(data.notes),
    locale: localeOf(data),
    timeZone: salon.timeZone,
    salonName: salon.salonName,
    salonAddress: salon.salonAddress,
    salonPhone: salon.salonPhone,
    ...extras,
  }
}

/** Cancel mail only when a customer email is present. */
export async function notifyCustomerCancelled(input: {
  reservationId: string
  data: ReservationFields
  salon: Pick<SalonContext, 'salonName' | 'salonAddress' | 'salonPhone' | 'timeZone'>
  managementToken?: string | null
}): Promise<void> {
  const to = customerEmailOf(input.data)
  if (!to) return
  await sendBookingEmailWithBudget(
    baseInput(input.reservationId, input.data, to, input.salon, {
      kind: 'cancelled',
      status: 'CONFIRMED',
      managementToken: input.managementToken ?? null,
    }),
  )
}

/**
 * Reschedule mail only when email is present and start/services/duration changed.
 * Returns whether a schedule change was detected (for callers/tests).
 */
export async function notifyCustomerRescheduled(input: {
  reservationId: string
  before: ReservationFields
  after: ReservationFields
  salon: Pick<SalonContext, 'salonName' | 'salonAddress' | 'salonPhone' | 'timeZone'>
  managementToken?: string | null
}): Promise<boolean> {
  const changed = isReservationScheduleChange(
    {
      startAt: String(input.before.startAt ?? ''),
      durationMinutes: Number(input.before.durationMinutes ?? 0),
      serviceIds: serviceIdsOf(input.before),
    },
    {
      startAt: String(input.after.startAt ?? ''),
      durationMinutes: Number(input.after.durationMinutes ?? 0),
      serviceIds: serviceIdsOf(input.after),
    },
  )
  if (!changed) return false

  const to = customerEmailOf(input.after) ?? customerEmailOf(input.before)
  if (!to) return true

  await sendBookingEmailWithBudget(
    baseInput(input.reservationId, input.after, to, input.salon, {
      kind: 'rescheduled',
      managementToken: input.managementToken ?? null,
    }),
  )
  return true
}
