import { randomBytes } from 'node:crypto'

import { getFirestore, type Firestore } from 'firebase-admin/firestore'

import { isSlotAvailable, listAvailableSlots } from '../domain/availability'
import { loadBusyIntervals, loadSalonContext, type SalonContext } from './salonContext'
import { hashManagementToken } from './tokens'

export type CreateReservationInput = {
  firstName: string
  lastName: string
  phone: string
  email: string | null
  notes?: string | null
  serviceId: string
  serviceIds?: string[]
  startAt: Date
  source: 'ONLINE' | 'MANUAL'
  internalNote: string | null
  idempotencyKey: string | null
  /** Manual bookings set this false; online bookings keep true. */
  enforceAdvanceRestrictions: boolean
  now?: Date
}

export type CreateReservationResult =
  | {
      ok: true
      reservationId: string
      status: 'PENDING' | 'CONFIRMED'
      managementToken: string | null
      reused: boolean
      serviceName?: string
      durationMinutes?: number
      timeZone?: string
      salonName?: string
      salonAddress?: string
      salonPhone?: string
    }
  | { ok: false; code: 'UNAVAILABLE' | 'SERVICE_INACTIVE' | 'NOT_FOUND'; message: string }

export function lockIdForStart(startAt: Date): string {
  return startAt.toISOString().replace(/[:.]/g, '-')
}

/** Snapshot label for a booking: bilingual when DE/IT differ, with legacy `name` fallback. */
function bilingualLabel(service: Record<string, unknown>): string {
  const nameDe = String(service.nameDe ?? '').trim()
  const nameIt = String(service.nameIt ?? '').trim()
  if (nameDe && nameIt && nameDe !== nameIt) return `${nameDe} / ${nameIt}`
  if (nameDe || nameIt) return nameDe || nameIt
  return String(service.name ?? '').trim()
}

type ResolvedBookingServices =
  | {
      ok: true
      serviceIds: string[]
      serviceName: string
      durationMinutes: number
      priceCents: number
    }
  | { ok: false; code: 'NOT_FOUND' | 'SERVICE_INACTIVE'; message: string }

export const MAX_BOOKING_SERVICES = 15

async function loadActiveServicesForBooking(
  db: Firestore,
  salonId: string,
  rawIds: string[],
): Promise<ResolvedBookingServices> {
  const uniqueIds = Array.from(new Set(rawIds.map((id) => id.trim()).filter(Boolean)))
  if (uniqueIds.length === 0) {
    return { ok: false, code: 'NOT_FOUND', message: 'Service not found.' }
  }
  if (uniqueIds.length > MAX_BOOKING_SERVICES) {
    return {
      ok: false,
      code: 'NOT_FOUND',
      message: `At most ${MAX_BOOKING_SERVICES} services can be booked at once.`,
    }
  }

  const snaps = await Promise.all(
    uniqueIds.map((id) =>
      db.collection('salons').doc(salonId).collection('services').doc(id).get(),
    ),
  )

  let durationMinutes = 0
  let priceCents = 0
  const labels: string[] = []

  for (const snap of snaps) {
    if (!snap.exists) {
      return { ok: false, code: 'NOT_FOUND', message: 'Service not found.' }
    }
    const data = snap.data()!
    if (!data.active) {
      return { ok: false, code: 'SERVICE_INACTIVE', message: 'Service is not active.' }
    }
    const minDuration = Number(data.durationMinutes)
    const maxDuration = Number(data.durationMaxMinutes ?? minDuration)
    durationMinutes += Math.max(minDuration, maxDuration)
    priceCents += Number(data.priceCents)
    labels.push(bilingualLabel(data))
  }

  return {
    ok: true,
    serviceIds: uniqueIds,
    serviceName: labels.join(' + '),
    durationMinutes,
    priceCents,
  }
}

/**
 * Transactional create shared by online and manual booking.
 * Revalidates availability inside the transaction and takes a slot lock
 * so concurrent overlapping creates cannot both succeed.
 */
export async function createReservationTransactional(
  input: CreateReservationInput,
  db: Firestore = getFirestore(),
  salonId?: string,
): Promise<CreateReservationResult> {
  const context = await loadSalonContext(db, salonId)
  const now = input.now ?? new Date()
  const requestedServiceIds =
    input.serviceIds && input.serviceIds.length > 0 ? input.serviceIds : [input.serviceId]
  const resolvedServices = await loadActiveServicesForBooking(
    db,
    context.salonId,
    requestedServiceIds,
  )

  if (!resolvedServices.ok) {
    return resolvedServices
  }

  const { durationMinutes, priceCents, serviceName, serviceIds } = resolvedServices
  const endAt = new Date(input.startAt.getTime() + durationMinutes * 60_000)

  if (input.idempotencyKey) {
    const existing = await db
      .collection('salons')
      .doc(context.salonId)
      .collection('reservations')
      .where('idempotencyKey', '==', input.idempotencyKey)
      .limit(1)
      .get()
    if (!existing.empty) {
      const doc = existing.docs[0]
      return {
        ok: true,
        reservationId: doc.id,
        status: doc.data().status === 'PENDING' ? 'PENDING' : 'CONFIRMED',
        managementToken: null,
        reused: true,
      }
    }
  }

  const reservationRef = db
    .collection('salons')
    .doc(context.salonId)
    .collection('reservations')
    .doc()
  const lockRef = db
    .collection('salons')
    .doc(context.salonId)
    .collection('slotLocks')
    .doc(lockIdForStart(input.startAt))

  const managementToken = randomBytes(32).toString('base64url')
  const managementTokenHash = hashManagementToken(managementToken)
  const status =
    input.source === 'MANUAL' || context.settings.confirmationMode === 'AUTOMATIC'
      ? 'CONFIRMED'
      : 'PENDING'
  const createdAt = now.toISOString()

  try {
    await db.runTransaction(async (tx) => {
      const lockSnap = await tx.get(lockRef)
      if (lockSnap.exists) {
        throw new Error('UNAVAILABLE')
      }

      // Re-read blocking reservations overlapping this window inside the transaction.
      const overlapQuery = db
        .collection('salons')
        .doc(context.salonId)
        .collection('reservations')
        .where('startAt', '<', endAt.toISOString())
      const overlapSnap = await tx.get(overlapQuery)
      const busyFromReservations = overlapSnap.docs
        .filter((doc) => {
          const data = doc.data()
          if (data.status !== 'PENDING' && data.status !== 'CONFIRMED') return false
          const existingEnd = new Date(String(data.endAt))
          return existingEnd.getTime() > input.startAt.getTime()
        })
        .map((doc) => ({
          startAt: new Date(String(doc.data().startAt)),
          endAt: new Date(String(doc.data().endAt)),
        }))

      const blocksSnap = await tx.get(
        db
          .collection('salons')
          .doc(context.salonId)
          .collection('blockedSlots')
          .where('startAt', '<', endAt.toISOString()),
      )
      const busyFromBlocks = blocksSnap.docs
        .filter((doc) => new Date(String(doc.data().endAt)).getTime() > input.startAt.getTime())
        .map((doc) => ({
          startAt: new Date(String(doc.data().startAt)),
          endAt: new Date(String(doc.data().endAt)),
        }))

      const available = isSlotAvailable({
        startAt: input.startAt,
        durationMinutes,
        timeZone: context.timeZone,
        weekly: context.weekly,
        holidays: context.holidays,
        dayExceptions: context.dayExceptions,
        busy: [...busyFromReservations, ...busyFromBlocks],
        settings: context.settings,
        now,
        enforceAdvanceRestrictions: input.enforceAdvanceRestrictions,
      })

      if (!available) {
        throw new Error('UNAVAILABLE')
      }

      tx.set(lockRef, {
        reservationId: reservationRef.id,
        startAt: input.startAt.toISOString(),
        endAt: endAt.toISOString(),
        createdAt,
      })

      tx.set(reservationRef, {
        firstName: input.firstName,
        lastName: input.lastName,
        phone: input.phone,
        email: input.email,
        notes: input.notes ?? null,
        serviceId: serviceIds[0],
        serviceIds,
        serviceName,
        durationMinutes,
        priceCents,
        startAt: input.startAt.toISOString(),
        endAt: endAt.toISOString(),
        status,
        source: input.source,
        managementTokenHash,
        internalNote: input.internalNote,
        idempotencyKey: input.idempotencyKey,
        createdAt,
        updatedAt: createdAt,
      })
    })
  } catch (error) {
    if (error instanceof Error && error.message === 'UNAVAILABLE') {
      return { ok: false, code: 'UNAVAILABLE', message: 'Timeslot is not available.' }
    }
    throw error
  }

  return {
    ok: true,
    reservationId: reservationRef.id,
    status,
    managementToken,
    reused: false,
    serviceName,
    durationMinutes,
    timeZone: context.timeZone,
    salonName: context.salonName,
    salonAddress: context.salonAddress,
    salonPhone: context.salonPhone,
  }
}

export async function previewAvailableSlots(input: {
  serviceId?: string
  serviceIds?: string[]
  fromDateYmd: string
  toDateYmd: string
  now?: Date
  db?: Firestore
  salonId?: string
  context?: SalonContext
  enforceAdvanceRestrictions?: boolean
  /**
   * Moving an existing booking: use its stored duration (the service may have
   * changed or been deactivated since) and ignore its own time as busy.
   */
  reschedule?: { reservationId: string; durationMinutes: number }
}): Promise<{ startAt: string; endAt: string }[]> {
  const db = input.db ?? getFirestore()
  const context = input.context ?? (await loadSalonContext(db, input.salonId))
  let durationMinutes: number
  if (input.reschedule) {
    durationMinutes = input.reschedule.durationMinutes
  } else {
    const requestedIds =
      input.serviceIds && input.serviceIds.length > 0
        ? input.serviceIds
        : input.serviceId
          ? [input.serviceId]
          : []
    const resolved = await loadActiveServicesForBooking(db, context.salonId, requestedIds)
    if (!resolved.ok) {
      return []
    }
    durationMinutes = resolved.durationMinutes
  }
  const rangeStart = new Date(`${input.fromDateYmd}T00:00:00.000Z`)
  const rangeEnd = new Date(`${input.toDateYmd}T23:59:59.999Z`)
  const busy = await loadBusyIntervals(
    db,
    context.salonId,
    rangeStart,
    rangeEnd,
    input.reschedule?.reservationId,
  )

  const slots = listAvailableSlots({
    timeZone: context.timeZone,
    weekly: context.weekly,
    holidays: context.holidays,
    dayExceptions: context.dayExceptions,
    busy,
    durationMinutes,
    settings: context.settings,
    now: input.now ?? new Date(),
    fromDateYmd: input.fromDateYmd,
    toDateYmd: input.toDateYmd,
    enforceAdvanceRestrictions: input.enforceAdvanceRestrictions !== false,
  })

  return slots.map((slot) => ({
    startAt: slot.startAt.toISOString(),
    endAt: slot.endAt.toISOString(),
  }))
}
