import { describe, expect, it } from 'vitest'

import { bookingFailureOf } from './bookingApi'

describe('bookingFailureOf', () => {
  it('maps the reason sent by createReservation', () => {
    expect(bookingFailureOf({ details: { reason: 'UNAVAILABLE' } })).toBe('slotTaken')
    expect(bookingFailureOf({ details: { reason: 'SERVICE_INACTIVE' } })).toBe('serviceUnavailable')
    expect(bookingFailureOf({ details: { reason: 'NOT_FOUND' } })).toBe('serviceUnavailable')
  })

  it('reads the reason from a Firebase callable error', () => {
    // Shape of the SDK's FunctionsError as TanStack Query hands it to the route.
    const callableError = Object.assign(new Error('Timeslot is not available.'), {
      name: 'FirebaseError',
      code: 'functions/failed-precondition',
      details: { reason: 'UNAVAILABLE' },
    })
    expect(bookingFailureOf(callableError)).toBe('slotTaken')
  })

  it('treats everything else as a generic failure', () => {
    expect(bookingFailureOf({ details: { reason: 'SOMETHING_NEW' } })).toBe('failed')
    expect(bookingFailureOf(new Error('network down'))).toBe('failed')
    expect(bookingFailureOf(null)).toBe('failed')
  })
})
