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

export const seededBookingSettings = {
  confirmationMode: 'AUTOMATIC',
  slotIntervalMinutes: 15,
  minAdvanceBookingMinutes: 60,
  maxAdvanceBookingDays: 60,
  pendingExpirationHours: 24,
} as const

export const seededSalonDetails = {
  name: 'KIMM Hair',
  address: 'Via Piave 71, 39012 Meran',
  phone: '+39 0473 449267',
  email: 'hello@kimm-hair.local',
  vatId: '01732550213',
} as const

function salonDoc(salonId: string) {
  return emulatorFirestore().collection('salons').doc(salonId)
}

export async function getBookingSettings(salonId = 'pilot'): Promise<Record<string, unknown>> {
  const snap = await salonDoc(salonId).collection('settings').doc('booking').get()
  return snap.data() ?? {}
}

export async function getSalonDetails(salonId = 'pilot'): Promise<Record<string, unknown>> {
  return (await salonDoc(salonId).get()).data() ?? {}
}

/** Restore seeded settings and contact data so later specs see the defaults. */
export async function restoreSeededSettings(salonId = 'pilot'): Promise<void> {
  await salonDoc(salonId).collection('settings').doc('booking').set(seededBookingSettings)
  await salonDoc(salonId).set(seededSalonDetails, { merge: true })
}

export type DemoReservation = {
  id: string
  firstName: string
  lastName: string
  startAt: string
}

/** First seeded demo reservation in the future with the given status. */
export async function findFutureDemoReservation(
  status: 'PENDING' | 'CONFIRMED',
  salonId = 'pilot',
): Promise<DemoReservation> {
  const snap = await emulatorFirestore()
    .collection('salons')
    .doc(salonId)
    .collection('reservations')
    .where('seededDemo', '==', true)
    .where('status', '==', status)
    .get()
  const nowIso = new Date().toISOString()
  const match = snap.docs
    .map((doc) => ({ id: doc.id, ...(doc.data() as Omit<DemoReservation, 'id'>) }))
    .filter((item) => item.startAt > nowIso)
    .sort((a, b) => a.startAt.localeCompare(b.startAt))[0]
  if (!match) throw new Error(`No future ${status} demo reservation seeded`)
  return {
    id: match.id,
    firstName: match.firstName,
    lastName: match.lastName,
    startAt: match.startAt,
  }
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

/** Newest reservation for a customer last name (unique per test run). */
export async function findReservationByLastName(
  lastName: string,
  salonId = 'pilot',
): Promise<DemoReservation & { status: string }> {
  const snap = await emulatorFirestore()
    .collection('salons')
    .doc(salonId)
    .collection('reservations')
    .where('lastName', '==', lastName)
    .get()
  const doc = snap.docs[0]
  if (!doc) throw new Error(`No reservation for ${lastName}`)
  const data = doc.data()
  return {
    id: doc.id,
    firstName: String(data.firstName),
    lastName: String(data.lastName),
    startAt: String(data.startAt),
    status: String(data.status),
  }
}
