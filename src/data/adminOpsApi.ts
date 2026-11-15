import { httpsCallable } from 'firebase/functions'

import { firebaseFunctions } from '../firebase'

export type ProcessPendingResult = {
  expired: number
  scanned: number
}

export async function processPendingReservationsAdmin(): Promise<ProcessPendingResult> {
  const callable = httpsCallable<Record<string, never>, ProcessPendingResult>(
    firebaseFunctions,
    'processPendingReservations',
  )
  const result = await callable({})
  return result.data
}
