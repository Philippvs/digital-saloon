import { deleteField, doc, getDoc, setDoc, updateDoc } from 'firebase/firestore'
import * as v from 'valibot'

import { firestore } from '../firebase'
import { getSalonId } from './salonConfig'
import { salonDocPath } from './salonPaths'
import { salonDetailsSchema, salonSchema, type Salon, type SalonDetails } from './schemas'

export const emptySalon: Salon = {
  name: '',
  address: '',
  phone: '',
  email: '',
  timezone: 'Europe/Vienna',
}

export async function fetchSalon(): Promise<Salon | null> {
  const snapshot = await getDoc(doc(firestore, salonDocPath(getSalonId())))
  if (!snapshot.exists()) return null
  return v.parse(salonSchema, snapshot.data())
}

export async function saveSalonDetails(details: SalonDetails): Promise<void> {
  const { vatId, ...required } = v.parse(salonDetailsSchema, details)
  const ref = doc(firestore, salonDocPath(getSalonId()))
  const existing = await getDoc(ref)
  if (existing.exists()) {
    await updateDoc(ref, {
      ...required,
      vatId: vatId ?? deleteField(),
    })
    return
  }
  await setDoc(ref, {
    ...required,
    timezone: 'Europe/Vienna',
    ...(vatId ? { vatId } : {}),
  })
}

export { getSalonId }
