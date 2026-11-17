import { getFirestore } from 'firebase-admin/firestore'
import { HttpsError, type CallableRequest } from 'firebase-functions/v2/https'

export async function assertSignedIn(request: CallableRequest): Promise<string> {
  if (!request.auth?.uid) {
    throw new HttpsError('unauthenticated', 'Sign in required.')
  }
  return request.auth.uid
}

export async function assertAdmin(request: CallableRequest): Promise<string> {
  const uid = await assertSignedIn(request)
  const snap = await getFirestore().collection('users').doc(uid).get()
  if (!snap.exists || snap.data()?.role !== 'admin') {
    throw new HttpsError('permission-denied', 'Administrator access required.')
  }
  return uid
}
