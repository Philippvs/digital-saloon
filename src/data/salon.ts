import { doc, getDoc } from 'firebase/firestore'
import * as v from 'valibot'

import { firestore } from '../firebase'
import { getSalonId } from './salonConfig'
import { salonDocPath } from './salonPaths'
import { salonSchema, type Salon } from './schemas'

export async function fetchSalon(): Promise<Salon | null> {
  const snapshot = await getDoc(doc(firestore, salonDocPath(getSalonId())))
  if (!snapshot.exists()) return null
  return v.parse(salonSchema, snapshot.data())
}

export { getSalonId }
