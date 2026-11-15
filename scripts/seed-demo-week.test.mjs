import { describe, expect, it } from 'vitest'

import { buildDemoReservations, localYmd, mondayOf, zonedToUtc } from './seed-demo-week.mjs'

const services = [
  { id: 'haircut', name: 'Herrenschnitt', durationMinutes: 30, priceCents: 2600 },
  { id: 'haircut-wash', name: 'Damenschnitt', durationMinutes: 60, priceCents: 4800 },
  { id: 'blow-dry', name: 'Föhnen', durationMinutes: 30, priceCents: 2800 },
  { id: 'coloring', name: 'Farbe', durationMinutes: 120, priceCents: 8500 },
  { id: 'highlights', name: 'Strähnen', durationMinutes: 150, priceCents: 9800 },
]

const openingHours = {
  2: [
    ['08:00', '12:00'],
    ['14:00', '18:00'],
  ],
  3: [['08:00', '16:00']],
  4: [['08:00', '18:00']],
  5: [['08:00', '18:00']],
  6: [['08:00', '16:00']],
}

function localHm(iso) {
  return new Intl.DateTimeFormat('en-GB', {
    timeZone: 'Europe/Vienna',
    hour: '2-digit',
    minute: '2-digit',
    hourCycle: 'h23',
  }).format(new Date(iso))
}

describe('buildDemoReservations', () => {
  const now = new Date('2026-11-15T17:00:00.000Z')
  const reservations = buildDemoReservations({ now, timeZone: 'Europe/Vienna', services })

  it('covers last week, the current week, and two weeks ahead', () => {
    const mondays = new Set(
      reservations.map((item) => mondayOf(localYmd(new Date(item.data.startAt), 'Europe/Vienna'))),
    )
    expect([...mondays].sort()).toEqual(['2026-11-02', '2026-11-09', '2026-11-16', '2026-11-23'])
  })

  it('stays inside opening hours without overlaps', () => {
    for (const { data } of reservations) {
      const weekday = new Date(data.startAt).getUTCDay()
      const intervals = openingHours[weekday]
      expect(intervals, `${data.startAt} on a closed day`).toBeDefined()
      const start = localHm(data.startAt)
      const end = localHm(data.endAt)
      expect(intervals.some(([open, close]) => start >= open && end <= close)).toBe(true)
    }
    const sorted = [...reservations].sort((a, b) => a.data.startAt.localeCompare(b.data.startAt))
    for (let i = 1; i < sorted.length; i += 1) {
      expect(sorted[i].data.startAt >= sorted[i - 1].data.endAt).toBe(true)
    }
  })

  it('marks the past as done and keeps open requests in the future', () => {
    for (const { data } of reservations) {
      const past = new Date(data.endAt) <= now
      if (past) expect(['COMPLETED', 'CANCELLED']).toContain(data.status)
      else expect(['CONFIRMED', 'PENDING']).toContain(data.status)
    }
    expect(reservations.some((item) => item.data.status === 'PENDING')).toBe(true)
  })

  it('uses unique, stable ids', () => {
    const ids = reservations.map((item) => item.id)
    expect(new Set(ids).size).toBe(ids.length)
    expect(buildDemoReservations({ now, timeZone: 'Europe/Vienna', services })).toEqual(
      reservations,
    )
  })
})

describe('zonedToUtc', () => {
  it('handles winter and summer time in Vienna', () => {
    expect(zonedToUtc('2026-01-15', '09:00', 'Europe/Vienna').toISOString()).toBe(
      '2026-01-15T08:00:00.000Z',
    )
    expect(zonedToUtc('2026-07-15', '09:00', 'Europe/Vienna').toISOString()).toBe(
      '2026-07-15T07:00:00.000Z',
    )
  })
})
