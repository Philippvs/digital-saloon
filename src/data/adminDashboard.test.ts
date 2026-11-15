import { describe, expect, it } from 'vitest'

import { dashboardRange, summarizeDashboard } from './adminDashboard'
import type { ReservationWithId } from './reservations'

function reservation(
  id: string,
  startAt: string,
  status: ReservationWithId['status'],
  priceCents = 2600,
): ReservationWithId {
  return {
    id,
    firstName: 'Anna',
    lastName: 'Muster',
    phone: '+390473000000',
    email: null,
    serviceId: 'haircut',
    serviceName: 'Herrenschnitt',
    durationMinutes: 30,
    priceCents,
    startAt,
    endAt: startAt,
    status,
    source: 'ONLINE',
    managementTokenHash: 'hash',
    internalNote: null,
    idempotencyKey: null,
    createdAt: startAt,
    updatedAt: startAt,
  }
}

describe('dashboardRange', () => {
  it('reaches past the end of the current week', () => {
    const range = dashboardRange('2026-11-15')
    expect(range.startIso <= '2026-11-15T00:00:00.000Z').toBe(true)
    expect(range.endIso > '2026-11-20T11:30:00.000Z').toBe(true)
  })
})

describe('summarizeDashboard', () => {
  const today = '2026-11-15'

  it('shows a booking later in the following week on a Sunday', () => {
    const result = summarizeDashboard(
      [reservation('fri', '2026-11-20T11:30:00.000Z', 'CONFIRMED')],
      today,
      'Europe/Vienna',
    )
    expect(result.upcomingDays).toEqual([
      { dateYmd: '2026-11-20', reservations: [expect.objectContaining({ id: 'fri' })] },
    ])
    expect(result.next7DaysCount).toBe(1)
    expect(result.next7DaysRevenueCents).toBe(2600)
  })

  it('groups today, pending, and upcoming by local date', () => {
    const result = summarizeDashboard(
      [
        reservation('late-utc', '2026-11-15T23:30:00.000Z', 'CONFIRMED'),
        reservation('today', '2026-11-15T09:00:00.000Z', 'PENDING'),
        reservation('done', '2026-11-15T08:00:00.000Z', 'COMPLETED', 1000),
        reservation('cancelled', '2026-11-17T09:00:00.000Z', 'CANCELLED'),
        reservation('yesterday', '2026-11-14T09:00:00.000Z', 'CONFIRMED'),
        reservation('far', '2026-11-30T09:00:00.000Z', 'CONFIRMED'),
      ],
      today,
      'Europe/Vienna',
    )
    expect(result.today.map((item) => item.id)).toEqual(['done', 'today'])
    expect(result.pending.map((item) => item.id)).toEqual(['today'])
    expect(result.upcomingDays.map((day) => day.dateYmd)).toEqual(['2026-11-16', '2026-11-30'])
    expect(result.next7DaysCount).toBe(2)
    expect(result.next7DaysRevenueCents).toBe(2600 + 1000 + 2600)
  })
})
