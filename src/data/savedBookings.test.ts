import { describe, expect, it } from 'vitest'

import {
  absoluteManagementUrl,
  readSavedBookings,
  removeSavedBooking,
  saveBooking,
  type SavedBookingsStorage,
} from './savedBookings'

function memory(): SavedBookingsStorage {
  const map = new Map<string, string>()
  return {
    getItem: (key) => map.get(key) ?? null,
    setItem: (key, value) => {
      map.set(key, value)
    },
    removeItem: (key) => {
      map.delete(key)
    },
  }
}

describe('savedBookings', () => {
  it('saves multiple bookings and dedupes by token/reservationId', () => {
    const storage = memory()
    saveBooking(
      { token: 'aaaaaaaaaaaaaaaa', reservationId: 'r1', savedAt: '2026-01-01T00:00:00.000Z' },
      storage,
    )
    saveBooking(
      { token: 'bbbbbbbbbbbbbbbb', reservationId: 'r2', savedAt: '2026-01-02T00:00:00.000Z' },
      storage,
    )
    saveBooking(
      { token: 'aaaaaaaaaaaaaaaa', reservationId: 'r1', savedAt: '2026-01-03T00:00:00.000Z' },
      storage,
    )

    const all = readSavedBookings(storage)
    expect(all).toHaveLength(2)
    expect(all[0]?.reservationId).toBe('r1')
    expect(all[0]?.savedAt).toBe('2026-01-03T00:00:00.000Z')
  })

  it('removes a saved booking by token', () => {
    const storage = memory()
    saveBooking({ token: 'aaaaaaaaaaaaaaaa', reservationId: 'r1' }, storage)
    saveBooking({ token: 'bbbbbbbbbbbbbbbb', reservationId: 'r2' }, storage)
    const remaining = removeSavedBooking('aaaaaaaaaaaaaaaa', storage)
    expect(remaining).toHaveLength(1)
    expect(remaining[0]?.reservationId).toBe('r2')
  })

  it('builds absolute manage URLs without logging helpers exposing secrets beyond path', () => {
    expect(absoluteManagementUrl('tokentokentoken12', 'https://salon.example')).toBe(
      'https://salon.example/manage/tokentokentoken12',
    )
  })

  it('ignores corrupt localStorage payloads', () => {
    const storage = memory()
    storage.setItem('salonflow.myBookings.v1', '{not-json')
    expect(readSavedBookings(storage)).toEqual([])
  })
})
