import { collection, getDocs, query, where } from 'firebase/firestore'
import * as v from 'valibot'

import { firestore } from '../firebase'
import { getSalonId } from './salonConfig'
import { servicesCollectionPath } from './salonPaths'
import { serviceSchema, type Service } from './schemas'

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
