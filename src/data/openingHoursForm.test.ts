import { describe, expect, it } from 'vitest'

import type { OpeningHoursByWeekday } from './openingHours'
import {
  absenceIssue,
  absenceSaveOf,
  affectedReservations,
  closeAfternoon,
  closeMorning,
  closedRangesOf,
  intervalIssues,
  nextIntervalSuggestion,
  upcomingAbsences,
  type AbsenceDraft,
} from './openingHoursForm'
import { openIntervalsForDate } from './openingRules'
import type { ReservationWithId } from './reservations'

const weekly: Partial<OpeningHoursByWeekday> = {
  // 2026-11-23 is a Monday
  monday: {
    intervals: [
      { start: '13:00', end: '18:00' },
      { start: '08:00', end: '12:00' },
    ],
  },
  tuesday: { intervals: [{ start: '09:00', end: '18:00' }] },
  sunday: { intervals: [] },
}

const draft = (patch: Partial<AbsenceDraft>): AbsenceDraft => ({
  kind: 'days',
  startDate: '2026-11-23',
  endDate: '2026-11-23',
  note: '',
  customIntervals: [],
  ...patch,
})

describe('intervalIssues', () => {
  it('flags reversed and overlapping intervals', () => {
    expect(intervalIssues([{ start: '10:00', end: '09:00' }])).toEqual(['order'])
    expect(
      intervalIssues([
        { start: '08:00', end: '12:00' },
        { start: '11:00', end: '14:00' },
      ]),
    ).toEqual(['overlap', 'overlap'])
    expect(
      intervalIssues([
        { start: '08:00', end: '12:00' },
        { start: '12:00', end: '14:00' },
      ]),
    ).toEqual([undefined, undefined])
    expect(intervalIssues([{ start: '', end: '12:00' }])).toEqual(['invalid'])
  })
})

describe('closeMorning / closeAfternoon', () => {
  it('keeps only the afternoon, clipping an interval that spans midday', () => {
    expect(closeMorning([{ start: '09:00', end: '18:00' }])).toEqual([
      { start: '12:00', end: '18:00' },
    ])
    expect(closeMorning(weekly.monday!.intervals)).toEqual([{ start: '13:00', end: '18:00' }])
  })

  it('keeps only the morning', () => {
    expect(closeAfternoon([{ start: '09:00', end: '18:00' }])).toEqual([
      { start: '09:00', end: '12:00' },
    ])
    expect(closeAfternoon([{ start: '13:00', end: '18:00' }])).toEqual([])
  })
})

describe('nextIntervalSuggestion', () => {
  it('suggests an afternoon block after the last interval', () => {
    expect(nextIntervalSuggestion([])).toEqual({ start: '09:00', end: '18:00' })
    expect(nextIntervalSuggestion([{ start: '08:00', end: '12:00' }])).toEqual({
      start: '13:00',
      end: '17:00',
    })
  })
})

describe('absenceSaveOf', () => {
  it('saves whole days as a holiday with a fallback name', () => {
    expect(absenceSaveOf(draft({ endDate: '2026-11-30' }), weekly, 'Abwesend')).toEqual({
      type: 'holiday',
      holiday: { name: 'Abwesend', startDate: '2026-11-23', endDate: '2026-11-30' },
    })
  })

  it('saves a closed morning as a day exception with the remaining hours', () => {
    expect(absenceSaveOf(draft({ kind: 'morning' }), weekly, 'x')).toEqual({
      type: 'dayException',
      dayException: {
        date: '2026-11-23',
        intervals: [{ start: '13:00', end: '18:00' }],
        closed: false,
      },
    })
  })

  it('marks the day closed when nothing is left', () => {
    const result = absenceSaveOf(draft({ kind: 'afternoon', startDate: '2026-11-29' }), weekly, 'x')
    expect(result).toEqual({
      type: 'dayException',
      dayException: { date: '2026-11-29', intervals: [], closed: true },
    })
  })
})

describe('absenceIssue', () => {
  it('validates dates and custom intervals', () => {
    expect(absenceIssue(draft({ startDate: '' }))).toBe('dateRequired')
    expect(absenceIssue(draft({ endDate: '2026-11-01' }))).toBe('endBeforeStart')
    expect(absenceIssue(draft({ endDate: '2028-01-01' }))).toBe('tooLong')
    expect(
      absenceIssue(draft({ kind: 'custom', customIntervals: [{ start: '12:00', end: '10:00' }] })),
    ).toBe('intervals')
    expect(absenceIssue(draft({ kind: 'morning', endDate: '' }))).toBeNull()
  })
})

describe('openIntervalsForDate', () => {
  const closures = {
    holidays: [{ id: 'h', name: 'Urlaub', startDate: '2026-11-23', endDate: '2026-11-24' }],
    dayExceptions: [
      {
        id: '2026-11-30',
        date: '2026-11-30',
        intervals: [{ start: '14:00', end: '18:00' }],
        closed: false,
      },
      {
        id: '2026-11-24',
        date: '2026-11-24',
        intervals: [{ start: '09:00', end: '12:00' }],
        closed: false,
      },
    ],
  }

  it('applies holiday > exception > weekly hours', () => {
    expect(openIntervalsForDate('2026-11-23', weekly, closures)).toEqual([])
    expect(openIntervalsForDate('2026-11-24', weekly, closures)).toEqual([])
    expect(openIntervalsForDate('2026-11-30', weekly, closures)).toEqual([
      { start: '14:00', end: '18:00' },
    ])
    expect(openIntervalsForDate('2026-12-01', weekly, closures)).toEqual([
      { start: '09:00', end: '18:00' },
    ])
  })
})

describe('upcomingAbsences', () => {
  it('hides past entries and sorts by date', () => {
    const items = upcomingAbsences(
      {
        holidays: [
          { id: 'old', name: 'Alt', startDate: '2026-01-01', endDate: '2026-01-02' },
          { id: 'xmas', name: 'Weihnachten', startDate: '2026-12-24', endDate: '2027-01-06' },
        ],
        dayExceptions: [{ id: 'd', date: '2026-11-20', intervals: [], closed: true }],
      },
      '2026-11-17',
    )
    expect(items.map((item) => item.id)).toEqual(['d', 'xmas'])
  })
})

describe('affectedReservations', () => {
  const reservation = (id: string, startAt: string, endAt: string, status = 'CONFIRMED') =>
    ({ id, startAt, endAt, status }) as unknown as ReservationWithId

  it('finds active bookings inside the closed part of the day', () => {
    // Europe/Vienna is UTC+1 in November.
    const reservations = [
      reservation('morning', '2026-11-23T08:00:00.000Z', '2026-11-23T09:00:00.000Z'),
      reservation('afternoon', '2026-11-23T13:00:00.000Z', '2026-11-23T14:00:00.000Z'),
      reservation('cancelled', '2026-11-23T08:00:00.000Z', '2026-11-23T09:00:00.000Z', 'CANCELLED'),
    ]
    const ranges = closedRangesOf(draft({ kind: 'morning' }), weekly)
    expect(affectedReservations(reservations, ranges, 'Europe/Vienna').map((r) => r.id)).toEqual([
      'morning',
    ])
  })
})
