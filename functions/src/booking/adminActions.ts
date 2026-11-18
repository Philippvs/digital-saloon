import { getFirestore } from 'firebase-admin/firestore'
import { HttpsError, onCall } from 'firebase-functions/v2/https'

import { assertAdmin } from '../authz'
import { functionsRegion, getSalonId } from '../config'
import { isObject } from '../schemas'
import { toPublicReservationView } from './findByToken'
import { lockIdForStart, updateReservationTransactional } from './reservationWrite'

const ACTIVE = new Set(['PENDING', 'CONFIRMED'])

function requireReservationId(data: Record<string, unknown>): string {
  if (typeof data.reservationId !== 'string' || data.reservationId.trim().length === 0) {
    throw new HttpsError('invalid-argument', 'reservationId is required.')
  }
  return data.reservationId.trim()
}

async function loadReservation(reservationId: string) {
  const db = getFirestore()
  const salonId = getSalonId()
  const ref = db.collection('salons').doc(salonId).collection('reservations').doc(reservationId)
  const snap = await ref.get()
  if (!snap.exists) {
    throw new HttpsError('not-found', 'Reservation not found.')
  }
  return { db, salonId, ref, snap }
}

function viewOf(snap: { id: string; data: () => Record<string, unknown> | undefined }) {
  return toPublicReservationView(snap)
}

export const confirmReservation = onCall({ region: functionsRegion }, async (request) => {
  await assertAdmin(request)
  if (!isObject(request.data)) throw new HttpsError('invalid-argument', 'Invalid payload.')
  const reservationId = requireReservationId(request.data)
  const { db, ref, snap } = await loadReservation(reservationId)
  if (String(snap.data()?.status) !== 'PENDING') {
    throw new HttpsError('failed-precondition', 'Only pending reservations can be confirmed.')
  }
  const updatedAt = new Date().toISOString()

  await db.runTransaction(async (tx) => {
    const fresh = await tx.get(ref)
    if (!fresh.exists) throw new Error('NOT_FOUND')
    if (String(fresh.data()?.status) !== 'PENDING') throw new Error('INACTIVE')
    tx.update(ref, { status: 'CONFIRMED', updatedAt })
  })

  const after = await ref.get()
  return { reservation: viewOf(after) }
})

export const declineReservation = onCall({ region: functionsRegion }, async (request) => {
  await assertAdmin(request)
  if (!isObject(request.data)) throw new HttpsError('invalid-argument', 'Invalid payload.')
  if (request.data.confirmed !== true) {
    throw new HttpsError('invalid-argument', 'Decline must be confirmed.')
  }
  const reservationId = requireReservationId(request.data)
  const { db, salonId, ref, snap } = await loadReservation(reservationId)
  if (String(snap.data()?.status) !== 'PENDING') {
    throw new HttpsError('failed-precondition', 'Only pending reservations can be declined.')
  }

  const startAt = new Date(String(snap.data()?.startAt))
  const lockRef = db
    .collection('salons')
    .doc(salonId)
    .collection('slotLocks')
    .doc(lockIdForStart(startAt))
  const updatedAt = new Date().toISOString()

  await db.runTransaction(async (tx) => {
    const fresh = await tx.get(ref)
    const lockSnap = await tx.get(lockRef)
    if (!fresh.exists) throw new Error('NOT_FOUND')
    if (String(fresh.data()?.status) !== 'PENDING') throw new Error('INACTIVE')
    tx.update(ref, { status: 'DECLINED', updatedAt })
    if (lockSnap.exists && lockSnap.data()?.reservationId === reservationId) {
      tx.delete(lockRef)
    }
  })

  const after = await ref.get()
  return {
    reservation: viewOf(after),
    customerMessage: 'Please contact the salon by phone — the online booking request was declined.',
  }
})

export const adminCancelReservation = onCall({ region: functionsRegion }, async (request) => {
  await assertAdmin(request)
  if (!isObject(request.data)) throw new HttpsError('invalid-argument', 'Invalid payload.')
  const reservationId = requireReservationId(request.data)
  const { db, salonId, ref, snap } = await loadReservation(reservationId)
  if (!ACTIVE.has(String(snap.data()?.status))) {
    throw new HttpsError('failed-precondition', 'Reservation cannot be cancelled.')
  }

  const startAt = new Date(String(snap.data()?.startAt))
  const lockRef = db
    .collection('salons')
    .doc(salonId)
    .collection('slotLocks')
    .doc(lockIdForStart(startAt))
  const updatedAt = new Date().toISOString()

  await db.runTransaction(async (tx) => {
    const fresh = await tx.get(ref)
    const lockSnap = await tx.get(lockRef)
    if (!fresh.exists) throw new Error('NOT_FOUND')
    if (!ACTIVE.has(String(fresh.data()?.status))) throw new Error('INACTIVE')
    tx.update(ref, { status: 'CANCELLED', updatedAt })
    if (lockSnap.exists && lockSnap.data()?.reservationId === reservationId) {
      tx.delete(lockRef)
    }
  })

  const after = await ref.get()
  return { reservation: viewOf(after) }
})

export const completeReservation = onCall({ region: functionsRegion }, async (request) => {
  await assertAdmin(request)
  if (!isObject(request.data)) throw new HttpsError('invalid-argument', 'Invalid payload.')
  const reservationId = requireReservationId(request.data)
  const { ref, snap } = await loadReservation(reservationId)
  if (String(snap.data()?.status) !== 'CONFIRMED') {
    throw new HttpsError('failed-precondition', 'Only confirmed reservations can be completed.')
  }
  const updatedAt = new Date().toISOString()
  await ref.update({ status: 'COMPLETED', updatedAt })
  const after = await ref.get()
  return { reservation: viewOf(after) }
})

function requireNonEmptyString(value: unknown, field: string): string {
  if (typeof value !== 'string' || value.trim().length === 0) {
    throw new HttpsError('invalid-argument', `${field} is required.`)
  }
  return value.trim()
}

function resolveAdminServiceIds(data: Record<string, unknown>): {
  serviceId: string
  serviceIds: string[]
} {
  if (data.serviceIds !== undefined) {
    if (!Array.isArray(data.serviceIds)) {
      throw new HttpsError('invalid-argument', 'serviceIds must be an array of service ids.')
    }
    const ids = Array.from(
      new Set(
        data.serviceIds
          .filter((item): item is string => typeof item === 'string')
          .map((item) => item.trim())
          .filter(Boolean),
      ),
    )
    if (ids.length === 0) {
      throw new HttpsError('invalid-argument', 'serviceIds must not be empty.')
    }
    if (ids.length > 15) {
      throw new HttpsError('invalid-argument', 'At most 15 services can be booked at once.')
    }
    return { serviceId: ids[0], serviceIds: ids }
  }
  const serviceId = requireNonEmptyString(data.serviceId, 'serviceId')
  return { serviceId, serviceIds: [serviceId] }
}

export const adminUpdateReservation = onCall({ region: functionsRegion }, async (request) => {
  await assertAdmin(request)
  if (!isObject(request.data)) throw new HttpsError('invalid-argument', 'Invalid payload.')

  const reservationId = requireReservationId(request.data)
  const startAtRaw = requireNonEmptyString(request.data.startAt, 'startAt')
  const startAt = new Date(startAtRaw)
  if (Number.isNaN(startAt.getTime())) {
    throw new HttpsError('invalid-argument', 'startAt must be an ISO timestamp.')
  }

  const { serviceId, serviceIds } = resolveAdminServiceIds(request.data)
  const result = await updateReservationTransactional(
    {
      reservationId,
      firstName: requireNonEmptyString(request.data.firstName, 'firstName'),
      lastName: requireNonEmptyString(request.data.lastName, 'lastName'),
      phone: requireNonEmptyString(request.data.phone, 'phone'),
      email:
        typeof request.data.email === 'string' && request.data.email.trim().length > 0
          ? request.data.email.trim()
          : null,
      serviceId,
      serviceIds,
      startAt,
      internalNote:
        typeof request.data.internalNote === 'string' && request.data.internalNote.trim().length > 0
          ? request.data.internalNote.trim()
          : null,
      enforceAdvanceRestrictions: false,
    },
    undefined,
    getSalonId(),
  )

  if (!result.ok) {
    throw new HttpsError('failed-precondition', result.message, { reason: result.code })
  }

  const { ref } = await loadReservation(reservationId)
  const after = await ref.get()
  return { reservation: viewOf(after) }
})
