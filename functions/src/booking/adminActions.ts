import { getFirestore } from 'firebase-admin/firestore'
import { HttpsError, onCall } from 'firebase-functions/v2/https'

import { assertAdmin } from '../authz'
import { functionsRegion, getSalonId } from '../config'
import { isObject } from '../schemas'
import { toPublicReservationView } from './findByToken'
import { enqueueNotificationJob } from './notificationOutbox'
import { lockIdForStart } from './reservationWrite'

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
  const { db, salonId, ref, snap } = await loadReservation(reservationId)
  if (String(snap.data()?.status) !== 'PENDING') {
    throw new HttpsError('failed-precondition', 'Only pending reservations can be confirmed.')
  }
  const updatedAt = new Date().toISOString()

  await db.runTransaction(async (tx) => {
    const fresh = await tx.get(ref)
    if (!fresh.exists) throw new Error('NOT_FOUND')
    const row = fresh.data()!
    if (String(row.status) !== 'PENDING') throw new Error('INACTIVE')
    tx.update(ref, { status: 'CONFIRMED', updatedAt })
    enqueueNotificationJob(tx, db, salonId, {
      type: 'RESERVATION_CONFIRMED',
      reservationId,
      toEmail: typeof row.email === 'string' ? row.email : null,
      payload: {
        firstName: row.firstName,
        serviceName: row.serviceName,
        startAt: row.startAt,
      },
    })
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
    const row = fresh.data()!
    if (String(row.status) !== 'PENDING') throw new Error('INACTIVE')
    tx.update(ref, { status: 'DECLINED', updatedAt })
    if (lockSnap.exists && lockSnap.data()?.reservationId === reservationId) {
      tx.delete(lockRef)
    }
    enqueueNotificationJob(tx, db, salonId, {
      type: 'RESERVATION_DECLINED',
      reservationId,
      toEmail: typeof row.email === 'string' ? row.email : null,
      payload: {
        firstName: row.firstName,
        serviceName: row.serviceName,
        startAt: row.startAt,
      },
    })
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
    const row = fresh.data()!
    if (!ACTIVE.has(String(row.status))) throw new Error('INACTIVE')
    tx.update(ref, { status: 'CANCELLED', updatedAt })
    if (lockSnap.exists && lockSnap.data()?.reservationId === reservationId) {
      tx.delete(lockRef)
    }
    enqueueNotificationJob(tx, db, salonId, {
      type: 'RESERVATION_CANCELLED',
      reservationId,
      toEmail: typeof row.email === 'string' ? row.email : null,
      payload: {
        firstName: row.firstName,
        serviceName: row.serviceName,
        startAt: row.startAt,
      },
    })
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
