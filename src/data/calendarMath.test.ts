import { describe, expect, it } from 'vitest'

import { addCalendarDays, todayYmdInTimeZone } from './calendarMath'
import { listRange, rangeForView, startOfWeekYmd } from './calendarRange'

describe('calendarMath', () => {
  it('adds calendar days across month boundaries', () => {
    expect(addCalendarDays('2026-01-31', 1)).toBe('2026-02-01')
  })

  it('formats today in Vienna as YYYY-MM-DD', () => {
    expect(todayYmdInTimeZone('Europe/Vienna', new Date('2026-11-15T12:00:00.000Z'))).toBe(
      '2026-11-15',
    )
  })
})

describe('calendarRange', () => {
  it('starts week on Monday', () => {
    expect(startOfWeekYmd('2026-04-08')).toBe('2026-04-06')
  })

  it('builds a day range', () => {
    const range = rangeForView('day', '2026-04-08')
    expect(range.startIso).toBe('2026-04-08T00:00:00.000Z')
    expect(range.endIso).toBe('2026-04-09T00:00:00.000Z')
  })
})

describe('listRange', () => {
  it('includes bookings after the current week ends on a Sunday', () => {
    const range = listRange('2026-11-15')
    expect(range.startIso).toBe('2026-11-08T00:00:00.000Z')
    expect('2026-11-20T11:30:00.000Z' < range.endIso).toBe(true)
  })
})
