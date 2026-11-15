import { initializeApp } from 'firebase-admin/app'
import { onCall } from 'firebase-functions/v2/https'

import { assertSignedIn } from './authz'
import { createManualReservation, createReservation } from './booking/createReservation'
import {
  cancelReservation,
  manageReservation,
  rescheduleReservation,
} from './booking/customerActions'
import { getAvailableSlots } from './booking/getAvailableSlots'
import { functionsRegion, getSalonId } from './config'

initializeApp()

export {
  getAvailableSlots,
  createReservation,
  createManualReservation,
  manageReservation,
  cancelReservation,
  rescheduleReservation,
}

/**
 * Health/auth smoke callable. Always re-check authorization — Admin SDK bypasses rules.
 */
export const ping = onCall({ region: functionsRegion }, async (request) => {
  const uid = await assertSignedIn(request)

  return {
    ok: true as const,
    uid,
    salonId: getSalonId(),
    at: new Date().toISOString(),
  }
})
