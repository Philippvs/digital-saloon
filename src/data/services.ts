import { addDoc, collection, doc, getDocs, query, updateDoc, where } from 'firebase/firestore'
import * as v from 'valibot'

import { firestore } from '../firebase'
import { getSalonId } from './salonConfig'
import { servicesCollectionPath } from './salonPaths'
import { serviceSchema, type Service } from './schemas'
import type { ServiceDraft } from './serviceForm'

export type ServiceWithId = Service & { id: string }

export async function fetchActiveServices(): Promise<ServiceWithId[]> {
  const salonId = getSalonId()
  const snap = await getDocs(
    query(collection(firestore, servicesCollectionPath(salonId)), where('active', '==', true)),
  )

  return snap.docs.map((docSnap) => ({
    id: docSnap.id,
    ...v.parse(serviceSchema, docSnap.data()),
  }))
}

export async function fetchAllServices(): Promise<ServiceWithId[]> {
  const salonId = getSalonId()
  const snap = await getDocs(collection(firestore, servicesCollectionPath(salonId)))

  return snap.docs.map((docSnap) => ({
    id: docSnap.id,
    ...v.parse(serviceSchema, docSnap.data()),
  }))
}

const serviceDraftSchema = v.omit(serviceSchema, ['createdAt', 'updatedAt'])

/** Creates a service and returns its id. */
export async function createService(draft: ServiceDraft): Promise<string> {
  const now = new Date().toISOString()
  const data = v.parse(serviceSchema, { ...draft, createdAt: now, updatedAt: now })
  const ref = await addDoc(collection(firestore, servicesCollectionPath(getSalonId())), data)
  return ref.id
}

/**
 * Updates the editable fields of a service. Reservations keep their own copy of
 * name, duration, and price, so existing appointments are not affected.
 */
export async function updateService(serviceId: string, draft: ServiceDraft): Promise<void> {
  const fields = v.parse(serviceDraftSchema, draft)
  await updateDoc(doc(firestore, servicesCollectionPath(getSalonId()), serviceId), {
    ...fields,
    updatedAt: new Date().toISOString(),
  })
}
