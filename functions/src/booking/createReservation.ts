import { onCall, HttpsError } from 'firebase-functions/v2/https'

import { functionsRegion, getSalonId } from '../config'
import { isObject } from '../schemas'
import { createReservationTransactional } from './reservationWrite'

function requireString(value: unknown, field: string): string {
  if (typeof value !== 'string' || value.trim().length === 0) {
    throw new HttpsError('invalid-argument', `${field} is required.`)
  }
  return value.trim()
}

export const createReservation = onCall({ region: functionsRegion }, async (request) => {
  const data = request.data
  if (!isObject(data)) {
    throw new HttpsError('invalid-argument', 'Invalid payload.')
  }

  const privacyAccepted = data.privacyAccepted === true
  if (!privacyAccepted) {
    throw new HttpsError('invalid-argument', 'Privacy acknowledgement is required.')
  }

  const startAtRaw = requireString(data.startAt, 'startAt')
  const startAt = new Date(startAtRaw)
  if (Number.isNaN(startAt.getTime())) {
    throw new HttpsError('invalid-argument', 'startAt must be an ISO timestamp.')
  }

  const result = await createReservationTransactional(
    {
      firstName: requireString(data.firstName, 'firstName'),
      lastName: requireString(data.lastName, 'lastName'),
      phone: requireString(data.phone, 'phone'),
      email:
        typeof data.email === 'string' && data.email.trim().length > 0 ? data.email.trim() : null,
      serviceId: requireString(data.serviceId, 'serviceId'),
      startAt,
      source: 'ONLINE',
      internalNote: null,
      idempotencyKey:
        typeof data.idempotencyKey === 'string' && data.idempotencyKey.length > 0
          ? data.idempotencyKey
          : null,
      enforceAdvanceRestrictions: true,
    },
    undefined,
    getSalonId(),
  )

  if (!result.ok) {
    throw new HttpsError('failed-precondition', result.message)
  }

  return {
    reservationId: result.reservationId,
    status: result.status,
    managementToken: result.managementToken,
    reused: result.reused,
  }
})

export const createManualReservation = onCall({ region: functionsRegion }, async (request) => {
  const { assertAdmin } = await import('../authz')
  await assertAdmin(request)

  const data = request.data
  if (!isObject(data)) {
    throw new HttpsError('invalid-argument', 'Invalid payload.')
  }

  const startAtRaw = requireString(data.startAt, 'startAt')
  const startAt = new Date(startAtRaw)
  if (Number.isNaN(startAt.getTime())) {
    throw new HttpsError('invalid-argument', 'startAt must be an ISO timestamp.')
  }

  const result = await createReservationTransactional(
    {
      firstName: requireString(data.firstName, 'firstName'),
      lastName: requireString(data.lastName, 'lastName'),
      phone: requireString(data.phone, 'phone'),
      email:
        typeof data.email === 'string' && data.email.trim().length > 0 ? data.email.trim() : null,
      serviceId: requireString(data.serviceId, 'serviceId'),
      startAt,
      source: 'MANUAL',
      internalNote:
        typeof data.internalNote === 'string' && data.internalNote.trim().length > 0
          ? data.internalNote.trim()
          : null,
      idempotencyKey:
        typeof data.idempotencyKey === 'string' && data.idempotencyKey.length > 0
          ? data.idempotencyKey
          : null,
      enforceAdvanceRestrictions: false,
    },
    undefined,
    getSalonId(),
  )

  if (!result.ok) {
    throw new HttpsError('failed-precondition', result.message)
  }

  return {
    reservationId: result.reservationId,
    status: result.status,
    managementToken: result.managementToken,
    reused: result.reused,
  }
})
