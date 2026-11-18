import { getFirestore } from 'firebase-admin/firestore'
import { HttpsError, type CallableRequest } from 'firebase-functions/v2/https'

export async function assertSignedIn(request: CallableRequest): Promise<string> {
  if (!request.auth?.uid) {
    throw new HttpsError('unauthenticated', 'Sign in required.')
  }
  return request.auth.uid
}

export async function assertOperator(request: CallableRequest): Promise<string> {
  const uid = await assertSignedIn(request)
  if (request.auth?.token?.operator !== true) {
    throw new HttpsError('permission-denied', 'Operator access required.')
  }
  return uid
}

export async function assertAdmin(request: CallableRequest): Promise<string> {
  const uid = await assertSignedIn(request)
  if (request.auth?.token?.operator === true) {
    return uid
  }
  const snap = await getFirestore().collection('users').doc(uid).get()
  if (!snap.exists || snap.data()?.role !== 'admin') {
    throw new HttpsError('permission-denied', 'Administrator access required.')
  }
  return uid
}

export async function assertPrimaryAdmin(request: CallableRequest): Promise<string> {
  const uid = await assertSignedIn(request)
  if (request.auth?.token?.operator === true) {
    throw new HttpsError(
      'permission-denied',
      'Only the primary salon admin can perform this action.',
    )
  }
  const snap = await getFirestore().collection('users').doc(uid).get()
  if (!snap.exists || snap.data()?.role !== 'admin' || snap.data()?.isPrimaryAdmin !== true) {
    throw new HttpsError('permission-denied', 'Primary salon admin access required.')
  }
  return uid
}
