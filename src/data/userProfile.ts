import { doc, getDoc } from 'firebase/firestore'
import * as v from 'valibot'

import { firestore } from '../firebase'
import { userProfileSchema, type UserProfile } from './schemas'

export async function fetchUserProfile(uid: string): Promise<UserProfile | null> {
  const snapshot = await getDoc(doc(firestore, 'users', uid))
  if (!snapshot.exists()) return null
  return v.parse(userProfileSchema, snapshot.data())
}
