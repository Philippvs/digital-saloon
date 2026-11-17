import { deleteField, doc, getDoc, updateDoc } from 'firebase/firestore'
import * as v from 'valibot'

import { firestore } from '../firebase'
import { getSalonId } from './salonConfig'
import { salonDocPath } from './salonPaths'
import { salonDetailsSchema, salonSchema, type Salon, type SalonDetails } from './schemas'

export async function fetchSalon(): Promise<Salon | null> {
  const snapshot = await getDoc(doc(firestore, salonDocPath(getSalonId())))
  if (!snapshot.exists()) return null
  return v.parse(salonSchema, snapshot.data())
}

export async function saveSalonDetails(details: SalonDetails): Promise<void> {
  const { vatId, ...required } = v.parse(salonDetailsSchema, details)
  await updateDoc(doc(firestore, salonDocPath(getSalonId())), {
    ...required,
    vatId: vatId ?? deleteField(),
  })
}

export { getSalonId }
