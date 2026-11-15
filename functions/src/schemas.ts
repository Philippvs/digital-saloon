/** Shared Valibot-free runtime checks for callable inputs until valibot is added to functions. */

export type ConfirmationMode = 'AUTOMATIC' | 'MANUAL'
export type ReservationStatus =
  'PENDING' | 'CONFIRMED' | 'DECLINED' | 'EXPIRED' | 'CANCELLED' | 'COMPLETED'

export type NotificationJobStatus = 'PENDING' | 'PROCESSING' | 'SENT' | 'FAILED'

export type NotificationJobType =
  | 'RESERVATION_CREATED'
  | 'RESERVATION_CONFIRMED'
  | 'RESERVATION_DECLINED'
  | 'RESERVATION_CANCELLED'
  | 'RESERVATION_RESCHEDULED'
  | 'RESERVATION_EXPIRED'

export type ReservationSource = 'ONLINE' | 'MANUAL'

export type BookingSettings = {
  confirmationMode: ConfirmationMode
  slotIntervalMinutes: number
  minAdvanceBookingMinutes: number
  maxAdvanceBookingDays: number
  pendingExpirationHours: number
}

export type ServiceRecord = {
  name: string
  description: string
  durationMinutes: number
  priceCents: number
  active: boolean
}

export type TimeInterval = {
  start: string
  end: string
}

export function isObject(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
}
