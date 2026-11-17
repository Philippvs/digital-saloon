import { describe, expect, it } from 'vitest'

import { bookingFailureOf } from './bookingApi'

describe('bookingFailureOf', () => {
  it('maps the reason sent by createReservation', () => {
    expect(bookingFailureOf({ details: { reason: 'UNAVAILABLE' } })).toBe('slotTaken')
    expect(bookingFailureOf({ details: { reason: 'SERVICE_INACTIVE' } })).toBe('serviceUnavailable')
    expect(bookingFailureOf({ details: { reason: 'NOT_FOUND' } })).toBe('serviceUnavailable')
  })

  it('treats everything else as a generic failure', () => {
    expect(bookingFailureOf({ details: { reason: 'SOMETHING_NEW' } })).toBe('failed')
    expect(bookingFailureOf(new Error('network down'))).toBe('failed')
    expect(bookingFailureOf(null)).toBe('failed')
  })
})
