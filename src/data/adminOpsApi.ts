import { httpsCallable } from 'firebase/functions'

import { firebaseFunctions } from '../firebase'

export type ProcessNotificationsResult = {
  claimed: number
  sent: number
  failed: number
  skipped: number
}

export type ProcessPendingResult = {
  expired: number
  scanned: number
}

export async function processNotificationJobsAdmin(): Promise<ProcessNotificationsResult> {
  const callable = httpsCallable<Record<string, never>, ProcessNotificationsResult>(
    firebaseFunctions,
    'processNotificationJobs',
  )
  const result = await callable({})
  return result.data
}

export async function processPendingReservationsAdmin(): Promise<ProcessPendingResult> {
  const callable = httpsCallable<Record<string, never>, ProcessPendingResult>(
    firebaseFunctions,
    'processPendingReservations',
  )
  const result = await callable({})
  return result.data
}
