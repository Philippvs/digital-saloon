import * as v from 'valibot'

/** Search params that are missing or invalid fall back instead of failing the route. */
export function optionalSearchParam<TSchema extends v.GenericSchema>(schema: TSchema) {
  return v.optional(v.fallback(schema, undefined))
}

export const userRoleSchema = v.picklist(['user', 'admin'] as const)
export type UserRole = v.InferOutput<typeof userRoleSchema>

export const userProfileSchema = v.object({
  email: v.pipe(v.string(), v.email()),
  displayName: v.pipe(v.string(), v.minLength(1), v.maxLength(80)),
  role: userRoleSchema,
  createdAt: v.string(),
})
export type UserProfile = v.InferOutput<typeof userProfileSchema>

export const salonSchema = v.object({
  name: v.pipe(v.string(), v.minLength(1), v.maxLength(120)),
  address: v.pipe(v.string(), v.minLength(1), v.maxLength(240)),
  phone: v.pipe(v.string(), v.minLength(1), v.maxLength(40)),
  email: v.pipe(v.string(), v.email()),
  timezone: v.pipe(v.string(), v.minLength(1), v.maxLength(64)),
  vatId: v.optional(v.pipe(v.string(), v.minLength(1), v.maxLength(40))),
})
export type Salon = v.InferOutput<typeof salonSchema>

/** Fields an admin may edit; the timezone drives slot math and stays fixed. */
export const salonDetailsSchema = v.omit(salonSchema, ['timezone'])
export type SalonDetails = v.InferOutput<typeof salonDetailsSchema>

export const confirmationModeSchema = v.picklist(['AUTOMATIC', 'MANUAL'] as const)
export type ConfirmationMode = v.InferOutput<typeof confirmationModeSchema>

export const bookingSettingsSchema = v.object({
  confirmationMode: confirmationModeSchema,
  slotIntervalMinutes: v.pipe(v.number(), v.integer(), v.minValue(5), v.maxValue(60)),
  minAdvanceBookingMinutes: v.pipe(v.number(), v.integer(), v.minValue(0), v.maxValue(10080)),
  maxAdvanceBookingDays: v.pipe(v.number(), v.integer(), v.minValue(1), v.maxValue(365)),
  pendingExpirationHours: v.pipe(v.number(), v.integer(), v.minValue(1), v.maxValue(168)),
})
export type BookingSettings = v.InferOutput<typeof bookingSettingsSchema>

export const serviceSchema = v.object({
  nameDe: v.pipe(v.string(), v.minLength(1), v.maxLength(120)),
  nameIt: v.pipe(v.string(), v.minLength(1), v.maxLength(120)),
  descriptionDe: v.pipe(v.string(), v.maxLength(1000)),
  descriptionIt: v.pipe(v.string(), v.maxLength(1000)),
  categoryDe: v.optional(v.pipe(v.string(), v.maxLength(80))),
  categoryIt: v.optional(v.pipe(v.string(), v.maxLength(80))),
  durationMinutes: v.pipe(v.number(), v.integer(), v.minValue(5), v.maxValue(480)),
  priceCents: v.pipe(v.number(), v.integer(), v.minValue(0)),
  priceMaxCents: v.optional(v.pipe(v.number(), v.integer(), v.minValue(0))),
  active: v.boolean(),
  createdAt: v.string(),
  updatedAt: v.string(),
})
export type Service = v.InferOutput<typeof serviceSchema>

export const reservationStatusSchema = v.picklist([
  'PENDING',
  'CONFIRMED',
  'DECLINED',
  'EXPIRED',
  'CANCELLED',
  'COMPLETED',
] as const)
export type ReservationStatus = v.InferOutput<typeof reservationStatusSchema>

export const reservationSourceSchema = v.picklist(['ONLINE', 'MANUAL'] as const)
export type ReservationSource = v.InferOutput<typeof reservationSourceSchema>

export const reservationSchema = v.object({
  firstName: v.pipe(v.string(), v.minLength(1), v.maxLength(80)),
  lastName: v.pipe(v.string(), v.minLength(1), v.maxLength(80)),
  phone: v.pipe(v.string(), v.minLength(1), v.maxLength(40)),
  email: v.nullable(v.pipe(v.string(), v.email())),
  notes: v.optional(v.nullable(v.pipe(v.string(), v.maxLength(1000)))),
  serviceId: v.pipe(v.string(), v.minLength(1)),
  serviceIds: v.optional(v.array(v.pipe(v.string(), v.minLength(1)))),
  serviceName: v.pipe(v.string(), v.minLength(1)),
  durationMinutes: v.pipe(v.number(), v.integer(), v.minValue(5)),
  priceCents: v.pipe(v.number(), v.integer(), v.minValue(0)),
  startAt: v.string(),
  endAt: v.string(),
  status: reservationStatusSchema,
  source: reservationSourceSchema,
  managementTokenHash: v.pipe(v.string(), v.minLength(1)),
  internalNote: v.nullable(v.pipe(v.string(), v.maxLength(2000))),
  idempotencyKey: v.nullable(v.pipe(v.string(), v.minLength(1), v.maxLength(128))),
  createdAt: v.string(),
  updatedAt: v.string(),
})
export type Reservation = v.InferOutput<typeof reservationSchema>

export const timeIntervalSchema = v.object({
  start: v.pipe(v.string(), v.regex(/^\d{2}:\d{2}$/)),
  end: v.pipe(v.string(), v.regex(/^\d{2}:\d{2}$/)),
})
export type TimeInterval = v.InferOutput<typeof timeIntervalSchema>

export const weekdaySchema = v.picklist([
  'monday',
  'tuesday',
  'wednesday',
  'thursday',
  'friday',
  'saturday',
  'sunday',
] as const)
export type Weekday = v.InferOutput<typeof weekdaySchema>

export const openingHoursSchema = v.object({
  intervals: v.array(timeIntervalSchema),
})
export type OpeningHours = v.InferOutput<typeof openingHoursSchema>

export const holidaySchema = v.object({
  name: v.pipe(v.string(), v.minLength(1), v.maxLength(120)),
  startDate: v.pipe(v.string(), v.regex(/^\d{4}-\d{2}-\d{2}$/)),
  endDate: v.pipe(v.string(), v.regex(/^\d{4}-\d{2}-\d{2}$/)),
})
export type Holiday = v.InferOutput<typeof holidaySchema>

export const dayExceptionSchema = v.object({
  date: v.pipe(v.string(), v.regex(/^\d{4}-\d{2}-\d{2}$/)),
  intervals: v.array(timeIntervalSchema),
  closed: v.boolean(),
})
export type DayException = v.InferOutput<typeof dayExceptionSchema>

export const blockedSlotSchema = v.object({
  startAt: v.string(),
  endAt: v.string(),
  reason: v.nullable(v.pipe(v.string(), v.maxLength(500))),
  createdAt: v.string(),
})
export type BlockedSlot = v.InferOutput<typeof blockedSlotSchema>
