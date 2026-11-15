import { getFirestore, type Firestore, type QueryDocumentSnapshot } from 'firebase-admin/firestore'

import { getSalonId } from '../config'
import { hashManagementToken } from './tokens'

export async function findReservationByManagementToken(
  token: string,
  db: Firestore = getFirestore(),
  salonId: string = getSalonId(),
): Promise<QueryDocumentSnapshot | null> {
  const hash = hashManagementToken(token)
  const snap = await db
    .collection('salons')
    .doc(salonId)
    .collection('reservations')
    .where('managementTokenHash', '==', hash)
    .limit(1)
    .get()

  if (snap.empty) return null
  return snap.docs[0]
}

export type PublicReservationView = {
  reservationId: string
  firstName: string
  lastName: string
  phone: string
  email: string | null
  serviceId: string
  serviceName: string
  durationMinutes: number
  priceCents: number
  startAt: string
  endAt: string
  status: string
  source: string
}

export function toPublicReservationView(doc: {
  id: string
  data: () => Record<string, unknown> | undefined
}): PublicReservationView {
  const data = doc.data() ?? {}
  return {
    reservationId: doc.id,
    firstName: String(data.firstName ?? ''),
    lastName: String(data.lastName ?? ''),
    phone: String(data.phone ?? ''),
    email: data.email == null ? null : String(data.email),
    serviceId: String(data.serviceId ?? ''),
    serviceName: String(data.serviceName ?? ''),
    durationMinutes: Number(data.durationMinutes ?? 0),
    priceCents: Number(data.priceCents ?? 0),
    startAt: String(data.startAt ?? ''),
    endAt: String(data.endAt ?? ''),
    status: String(data.status ?? ''),
    source: String(data.source ?? ''),
  }
}
