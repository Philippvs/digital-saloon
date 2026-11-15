import { getApps, initializeApp } from 'firebase-admin/app'
import { getFirestore, type Firestore } from 'firebase-admin/firestore'

import { demoProjectId, emulatorHost, emulatorPorts } from '../src/data/emulatorPorts'

let db: Firestore | null = null

/** Admin SDK against the local Firestore emulator (Playwright Node process). */
export function emulatorFirestore(): Firestore {
  process.env.FIRESTORE_EMULATOR_HOST = `${emulatorHost}:${emulatorPorts.firestore}`
  if (!getApps().length) {
    initializeApp({ projectId: demoProjectId })
  }
  if (!db) {
    db = getFirestore()
  }
  return db
}

export async function listNotificationJobs(
  salonId = 'pilot',
): Promise<Array<{ id: string; type: string; status: string; toEmail: string | null }>> {
  const snap = await emulatorFirestore()
    .collection('salons')
    .doc(salonId)
    .collection('notificationJobs')
    .get()
  return snap.docs.map((doc) => {
    const data = doc.data()
    return {
      id: doc.id,
      type: String(data.type ?? ''),
      status: String(data.status ?? ''),
      toEmail: data.toEmail == null ? null : String(data.toEmail),
    }
  })
}

export async function getReservationStatus(
  reservationId: string,
  salonId = 'pilot',
): Promise<string | null> {
  const snap = await emulatorFirestore()
    .collection('salons')
    .doc(salonId)
    .collection('reservations')
    .doc(reservationId)
    .get()
  if (!snap.exists) return null
  return String(snap.data()?.status ?? '')
}
