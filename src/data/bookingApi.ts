import { httpsCallable } from 'firebase/functions'

import { firebaseFunctions } from '../firebase'

export type AvailableSlotDto = {
  startAt: string
  endAt: string
}

export type CreateReservationResult = {
  reservationId: string
  status: 'PENDING' | 'CONFIRMED'
  managementToken: string | null
  reused: boolean
}

export type PublicReservation = {
  reservationId: string
  firstName: string
  lastName: string
  phone: string
  email: string | null
  serviceId: string
  serviceName: string
  durationMinutes: number
  priceCents: number
  startAt: string
  endAt: string
  status: string
  source: string
}

export async function fetchAvailableSlots(input: {
  serviceId: string
  fromDateYmd: string
  toDateYmd: string
}): Promise<AvailableSlotDto[]> {
  const callable = httpsCallable<
    { serviceId: string; fromDateYmd: string; toDateYmd: string },
    { slots: AvailableSlotDto[] }
  >(firebaseFunctions, 'getAvailableSlots')
  const result = await callable(input)
  return result.data.slots
}

export async function submitOnlineReservation(input: {
  serviceId: string
  startAt: string
  firstName: string
  lastName: string
  phone: string
  email: string | null
  privacyAccepted: true
  idempotencyKey: string
}): Promise<CreateReservationResult> {
  const callable = httpsCallable<typeof input, CreateReservationResult>(
    firebaseFunctions,
    'createReservation',
  )
  const result = await callable(input)
  return result.data
}

export async function fetchManagedReservation(token: string): Promise<PublicReservation> {
  const callable = httpsCallable<{ token: string }, { reservation: PublicReservation }>(
    firebaseFunctions,
    'manageReservation',
  )
  const result = await callable({ token })
  return result.data.reservation
}

export async function cancelManagedReservation(token: string): Promise<PublicReservation> {
  const callable = httpsCallable<{ token: string }, { reservation: PublicReservation }>(
    firebaseFunctions,
    'cancelReservation',
  )
  const result = await callable({ token })
  return result.data.reservation
}

export async function rescheduleManagedReservation(input: {
  token: string
  startAt: string
}): Promise<PublicReservation> {
  const callable = httpsCallable<typeof input, { reservation: PublicReservation }>(
    firebaseFunctions,
    'rescheduleReservation',
  )
  const result = await callable(input)
  return result.data.reservation
}
