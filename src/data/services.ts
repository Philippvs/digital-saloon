import {
  addDoc,
  collection,
  deleteField,
  doc,
  getDocs,
  query,
  updateDoc,
  where,
} from 'firebase/firestore'
import * as v from 'valibot'

import { firestore } from '../firebase'
import { getSalonId } from './salonConfig'
import { servicesCollectionPath } from './salonPaths'
import { serviceSchema, type Service } from './schemas'
import { normalizeServiceDocument, type ServiceDraft } from './serviceForm'

export type ServiceWithId = Service & { id: string }

function parseServiceDoc(id: string, data: Record<string, unknown>): ServiceWithId {
  return { id, ...v.parse(serviceSchema, normalizeServiceDocument(data)) }
}

export async function fetchActiveServices(): Promise<ServiceWithId[]> {
  const salonId = getSalonId()
  const snap = await getDocs(
    query(collection(firestore, servicesCollectionPath(salonId)), where('active', '==', true)),
  )

  return snap.docs.map((docSnap) => parseServiceDoc(docSnap.id, docSnap.data()))
}

export async function fetchAllServices(): Promise<ServiceWithId[]> {
  const salonId = getSalonId()
  const snap = await getDocs(collection(firestore, servicesCollectionPath(salonId)))

  return snap.docs.map((docSnap) => parseServiceDoc(docSnap.id, docSnap.data()))
}

const serviceDraftSchema = v.omit(serviceSchema, ['createdAt', 'updatedAt'])

/** Creates a service and returns its id. */
function stripUndefined<T extends Record<string, unknown>>(obj: T): T {
  const entries = Object.entries(obj).filter(([, value]) => value !== undefined)
  return Object.fromEntries(entries) as T
}

export async function createService(draft: ServiceDraft): Promise<string> {
  const now = new Date().toISOString()
  const data = stripUndefined(v.parse(serviceSchema, { ...draft, createdAt: now, updatedAt: now }))
  const ref = await addDoc(collection(firestore, servicesCollectionPath(getSalonId())), data)
  return ref.id
}

/**
 * Updates the editable fields of a service. Reservations keep their own copy of
 * name, duration, and price, so existing appointments are not affected.
 * Drops legacy single-language fields if they are still present.
 */
export async function updateService(serviceId: string, draft: ServiceDraft): Promise<void> {
  const parsed = v.parse(serviceDraftSchema, draft)
  const fields = stripUndefined(parsed)
  await updateDoc(doc(firestore, servicesCollectionPath(getSalonId()), serviceId), {
    ...fields,
    ...(parsed.durationMaxMinutes === undefined ? { durationMaxMinutes: deleteField() } : {}),
    ...(parsed.priceMaxCents === undefined ? { priceMaxCents: deleteField() } : {}),
    name: deleteField(),
    description: deleteField(),
    updatedAt: new Date().toISOString(),
  })
}
