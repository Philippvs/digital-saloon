import { getFirestore } from 'firebase-admin/firestore'
import { onCall } from 'firebase-functions/v2/https'
import { onSchedule } from 'firebase-functions/v2/scheduler'

import { assertAdmin } from '../authz'
import { functionsRegion, getSalonId } from '../config'
import { enqueueNotificationJob } from './notificationOutbox'
import { lockIdForStart } from './reservationWrite'
import { loadSalonContext } from './salonContext'

export async function processPendingReservationsOnce(input?: {
  salonId?: string
  now?: Date
  limit?: number
}): Promise<{ expired: number; scanned: number }> {
  const db = getFirestore()
  const salonId = input?.salonId ?? getSalonId()
  const now = input?.now ?? new Date()
  const context = await loadSalonContext(db, salonId)
  const cutoffMs = context.settings.pendingExpirationHours * 60 * 60 * 1000
  const cutoffIso = new Date(now.getTime() - cutoffMs).toISOString()
  const limit = input?.limit ?? 50

  const snap = await db
    .collection('salons')
    .doc(salonId)
    .collection('reservations')
    .where('status', '==', 'PENDING')
    .where('createdAt', '<=', cutoffIso)
    .limit(limit)
    .get()

  let expired = 0

  for (const doc of snap.docs) {
    const data = doc.data()
    const startAt = new Date(String(data.startAt))
    const lockRef = db
      .collection('salons')
      .doc(salonId)
      .collection('slotLocks')
      .doc(lockIdForStart(startAt))

    const didExpire = await db.runTransaction(async (tx) => {
      const fresh = await tx.get(doc.ref)
      if (!fresh.exists) return false
      const row = fresh.data()!
      if (String(row.status) !== 'PENDING') return false
      if (String(row.createdAt) > cutoffIso) return false

      const lockSnap = await tx.get(lockRef)
      const updatedAt = now.toISOString()
      tx.update(doc.ref, { status: 'EXPIRED', updatedAt })
      if (lockSnap.exists && lockSnap.data()?.reservationId === doc.id) {
        tx.delete(lockRef)
      }

      enqueueNotificationJob(tx, db, salonId, {
        type: 'RESERVATION_EXPIRED',
        reservationId: doc.id,
        toEmail: typeof row.email === 'string' ? row.email : null,
        payload: {
          firstName: row.firstName,
          serviceName: row.serviceName,
          startAt: row.startAt,
        },
        now,
      })
      return true
    })

    if (didExpire) expired += 1
  }

  return { expired, scanned: snap.size }
}

export const processPendingReservations = onCall({ region: functionsRegion }, async (request) => {
  await assertAdmin(request)
  return processPendingReservationsOnce()
})

export const processPendingReservationsSchedule = onSchedule(
  { region: functionsRegion, schedule: 'every 5 minutes' },
  async () => {
    await processPendingReservationsOnce()
  },
)
