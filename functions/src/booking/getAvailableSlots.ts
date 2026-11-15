import { onCall, HttpsError } from 'firebase-functions/v2/https'

import { functionsRegion, getSalonId } from '../config'
import { isObject } from '../schemas'
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

  const slots = await previewAvailableSlots({
    serviceId,
    fromDateYmd,
    toDateYmd,
    salonId: getSalonId(),
  })

  return { slots }
})
