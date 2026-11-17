import { onCall, HttpsError } from 'firebase-functions/v2/https'

import { assertAdmin } from '../authz'
import { functionsRegion, getSalonId } from '../config'
import { isObject } from '../schemas'
import { findReservationByManagementToken } from './findByToken'
import { previewAvailableSlots } from './reservationWrite'

export const getAvailableSlots = onCall({ region: functionsRegion }, async (request) => {
  const data = request.data
  if (!isObject(data)) {
    throw new HttpsError('invalid-argument', 'Invalid payload.')
  }

  const serviceId = data.serviceId
  const fromDateYmd = data.fromDateYmd
  const toDateYmd = data.toDateYmd

  if (typeof serviceId !== 'string' || serviceId.length === 0) {
    throw new HttpsError('invalid-argument', 'serviceId is required.')
  }
  if (typeof fromDateYmd !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(fromDateYmd)) {
    throw new HttpsError('invalid-argument', 'fromDateYmd is required (YYYY-MM-DD).')
  }
  if (typeof toDateYmd !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(toDateYmd)) {
    throw new HttpsError('invalid-argument', 'toDateYmd is required (YYYY-MM-DD).')
  }

  let enforceAdvanceRestrictions = true
  if (data.enforceAdvanceRestrictions === false) {
    await assertAdmin(request)
    enforceAdvanceRestrictions = false
  }

  let reschedule: { reservationId: string; durationMinutes: number } | undefined
  if (typeof data.managementToken === 'string' && data.managementToken.trim().length > 0) {
    if (data.managementToken.trim().length < 16) {
      throw new HttpsError('invalid-argument', 'managementToken is invalid.')
    }
    const reservation = await findReservationByManagementToken(data.managementToken.trim())
    if (!reservation) {
      throw new HttpsError('not-found', 'Reservation not found or token invalid.')
    }
    const status = String(reservation.data().status)
    if (status !== 'PENDING' && status !== 'CONFIRMED') {
      return { slots: [] }
    }
    reschedule = {
      reservationId: reservation.id,
      durationMinutes: Number(reservation.data().durationMinutes),
    }
  }

  const slots = await previewAvailableSlots({
    serviceId,
    fromDateYmd,
    toDateYmd,
    salonId: getSalonId(),
    enforceAdvanceRestrictions,
    reschedule,
  })

  return { slots }
})
