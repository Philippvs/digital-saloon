import { collection, doc, getDoc, getDocs, orderBy, query, where } from 'firebase/firestore'
import * as v from 'valibot'

import { firestore } from '../firebase'
import { getSalonId } from './salonConfig'
import { reservationDocPath, reservationsCollectionPath } from './salonPaths'
import { reservationSchema, type Reservation } from './schemas'

export type ReservationWithId = Reservation & { id: string }

export async function fetchReservationById(
  reservationId: string,
): Promise<ReservationWithId | null> {
  const snapshot = await getDoc(doc(firestore, reservationDocPath(getSalonId(), reservationId)))
  if (!snapshot.exists()) return null
  return {
    id: snapshot.id,
    ...v.parse(reservationSchema, snapshot.data()),
  }
}

export async function fetchReservationsInRange(
  rangeStartIso: string,
  rangeEndIso: string,
): Promise<ReservationWithId[]> {
  const salonId = getSalonId()
  const snap = await getDocs(
    query(
      collection(firestore, reservationsCollectionPath(salonId)),
      where('startAt', '>=', rangeStartIso),
      where('startAt', '<', rangeEndIso),
      orderBy('startAt', 'asc'),
    ),
  )

  return snap.docs.map((docSnap) => ({
    id: docSnap.id,
    ...v.parse(reservationSchema, docSnap.data()),
  }))
}
