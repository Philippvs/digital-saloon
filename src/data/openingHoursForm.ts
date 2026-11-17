/** Pure logic for the admin "opening hours & absences" screen. */
import { addCalendarDays } from './calendarMath'
import type { OpeningHoursByWeekday } from './openingHours'
import {
  minuteOfHhmm,
  sortIntervals,
  weekdays,
  weeklyIntervalsForDate,
  type Closures,
} from './openingRules'
import type { ReservationWithId } from './reservations'
import type { DayException, Holiday, ReservationStatus, TimeInterval, Weekday } from './schemas'
import { zonedDateAndMinute } from './weekPlanner'

/** Local minute where "morning" ends and "afternoon" begins. */
export const middayMinute = 12 * 60
const endOfDayMinute = 24 * 60

export type WeeklyDraft = Record<Weekday, TimeInterval[]>

export const defaultDayInterval: TimeInterval = { start: '09:00', end: '18:00' }

/** `HH:MM`, clamped to the day (24:00 becomes 23:59). */
export function clockOfMinute(minute: number): string {
  const clamped = Math.max(0, Math.min(minute, endOfDayMinute - 1))
  const h = Math.floor(clamped / 60)
  const m = clamped % 60
  return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`
}

export function weeklyDraftOf(hours: Partial<OpeningHoursByWeekday> | undefined): WeeklyDraft {
  const draft = {} as WeeklyDraft
  for (const weekday of weekdays) {
    draft[weekday] = sortIntervals(hours?.[weekday]?.intervals ?? [])
  }
  return draft
}

export type IntervalIssue = 'invalid' | 'order' | 'overlap'

/** Returns one issue per interval index (undefined when the interval is fine). */
export function intervalIssues(
  intervals: readonly TimeInterval[],
): Array<IntervalIssue | undefined> {
  const issues: Array<IntervalIssue | undefined> = intervals.map((interval) => {
    if (!/^\d{2}:\d{2}$/.test(interval.start) || !/^\d{2}:\d{2}$/.test(interval.end)) {
      return 'invalid'
    }
    return minuteOfHhmm(interval.start) < minuteOfHhmm(interval.end) ? undefined : 'order'
  })
  const overlapping = intervals.map((a, i) =>
    intervals.some(
      (b, j) =>
        i !== j &&
        !issues[i] &&
        !issues[j] &&
        minuteOfHhmm(a.start) < minuteOfHhmm(b.end) &&
        minuteOfHhmm(b.start) < minuteOfHhmm(a.end),
    ),
  )
  return issues.map((issue, i) => (overlapping[i] ? 'overlap' : issue))
}

export function weeklyDraftIsValid(draft: WeeklyDraft): boolean {
  return weekdays.every((weekday) => intervalIssues(draft[weekday]).every((issue) => !issue))
}

/** Suggest the next interval to add, e.g. an afternoon block after a lunch break. */
export function nextIntervalSuggestion(intervals: readonly TimeInterval[]): TimeInterval {
  if (intervals.length === 0) return defaultDayInterval
  const lastEnd = Math.max(...intervals.map((interval) => minuteOfHhmm(interval.end)))
  const start = Math.min(lastEnd + 60, endOfDayMinute - 60)
  return { start: clockOfMinute(start), end: clockOfMinute(Math.min(start + 4 * 60, 23 * 60 + 59)) }
}

/** Remove the local range [fromMinute, toMinute) from the open intervals. */
export function closeRange(
  intervals: readonly TimeInterval[],
  fromMinute: number,
  toMinute: number,
): TimeInterval[] {
  const result: TimeInterval[] = []
  for (const interval of sortIntervals(intervals)) {
    const start = minuteOfHhmm(interval.start)
    const end = minuteOfHhmm(interval.end)
    if (start < fromMinute) {
      const pieceEnd = Math.min(end, fromMinute)
      if (pieceEnd > start) result.push({ start: interval.start, end: clockOfMinute(pieceEnd) })
    }
    if (end > toMinute) {
      const pieceStart = Math.max(start, toMinute)
      if (end > pieceStart) result.push({ start: clockOfMinute(pieceStart), end: interval.end })
    }
  }
  return result
}

export function closeMorning(intervals: readonly TimeInterval[]): TimeInterval[] {
  return closeRange(intervals, 0, middayMinute)
}

export function closeAfternoon(intervals: readonly TimeInterval[]): TimeInterval[] {
  return closeRange(intervals, middayMinute, endOfDayMinute)
}

export type AbsenceKind = 'days' | 'morning' | 'afternoon' | 'custom'

export type AbsenceDraft = {
  kind: AbsenceKind
  startDate: string
  endDate: string
  note: string
  customIntervals: TimeInterval[]
}

export type AbsenceSave =
  { type: 'holiday'; holiday: Holiday } | { type: 'dayException'; dayException: DayException }

export type AbsenceIssue = 'dateRequired' | 'endBeforeStart' | 'tooLong' | 'intervals'

const maxAbsenceDays = 366

export function absenceIssue(draft: AbsenceDraft): AbsenceIssue | null {
  const ymd = /^\d{4}-\d{2}-\d{2}$/
  if (!ymd.test(draft.startDate)) return 'dateRequired'
  if (draft.kind === 'days') {
    if (!ymd.test(draft.endDate)) return 'dateRequired'
    if (draft.endDate < draft.startDate) return 'endBeforeStart'
    if (draft.endDate > addCalendarDays(draft.startDate, maxAbsenceDays)) return 'tooLong'
  }
  if (draft.kind === 'custom' && intervalIssues(draft.customIntervals).some(Boolean)) {
    return 'intervals'
  }
  return null
}

/** Open intervals left on the draft's date (for partial-day kinds). */
export function remainingIntervals(
  draft: AbsenceDraft,
  weekly: Partial<OpeningHoursByWeekday> | undefined,
): TimeInterval[] {
  const base = weeklyIntervalsForDate(draft.startDate, weekly)
  switch (draft.kind) {
    case 'days':
      return []
    case 'morning':
      return closeMorning(base)
    case 'afternoon':
      return closeAfternoon(base)
    case 'custom':
      return sortIntervals(draft.customIntervals)
  }
}

export function absenceSaveOf(
  draft: AbsenceDraft,
  weekly: Partial<OpeningHoursByWeekday> | undefined,
  fallbackNote: string,
): AbsenceSave {
  if (draft.kind === 'days') {
    return {
      type: 'holiday',
      holiday: {
        name: draft.note.trim().slice(0, 120) || fallbackNote,
        startDate: draft.startDate,
        endDate: draft.endDate,
      },
    }
  }
  const intervals = remainingIntervals(draft, weekly)
  return {
    type: 'dayException',
    dayException: { date: draft.startDate, intervals, closed: intervals.length === 0 },
  }
}

/** Local [start, end) ranges per date that the absence closes, used to find affected bookings. */
export function closedRangesOf(
  draft: AbsenceDraft,
  weekly: Partial<OpeningHoursByWeekday> | undefined,
): Array<{ dateYmd: string; fromMinute: number; toMinute: number }> {
  if (draft.kind === 'days') {
    const ranges: Array<{ dateYmd: string; fromMinute: number; toMinute: number }> = []
    for (let date = draft.startDate; date <= draft.endDate; date = addCalendarDays(date, 1)) {
      ranges.push({ dateYmd: date, fromMinute: 0, toMinute: endOfDayMinute })
    }
    return ranges
  }
  const open = remainingIntervals(draft, weekly)
  const ranges: Array<{ dateYmd: string; fromMinute: number; toMinute: number }> = []
  let cursor = 0
  for (const interval of open) {
    const start = minuteOfHhmm(interval.start)
    if (start > cursor)
      ranges.push({ dateYmd: draft.startDate, fromMinute: cursor, toMinute: start })
    cursor = Math.max(cursor, minuteOfHhmm(interval.end))
  }
  if (cursor < endOfDayMinute) {
    ranges.push({ dateYmd: draft.startDate, fromMinute: cursor, toMinute: endOfDayMinute })
  }
  return ranges
}

export type UpcomingAbsence =
  | { type: 'holiday'; id: string; startDate: string; endDate: string; name: string }
  | {
      type: 'dayException'
      id: string
      date: string
      closed: boolean
      intervals: TimeInterval[]
    }

/** Absences that end today or later, sorted by start date. */
export function upcomingAbsences(closures: Closures, todayYmd: string): UpcomingAbsence[] {
  const items: Array<UpcomingAbsence & { sortKey: string }> = []
  for (const holiday of closures.holidays) {
    if (holiday.endDate < todayYmd) continue
    items.push({
      type: 'holiday',
      id: holiday.id,
      startDate: holiday.startDate,
      endDate: holiday.endDate,
      name: holiday.name,
      sortKey: holiday.startDate,
    })
  }
  for (const exception of closures.dayExceptions) {
    if (exception.date < todayYmd) continue
    items.push({
      type: 'dayException',
      id: exception.id,
      date: exception.date,
      closed: exception.closed || exception.intervals.length === 0,
      intervals: sortIntervals(exception.intervals),
      sortKey: exception.date,
    })
  }
  return items
    .sort((a, b) => a.sortKey.localeCompare(b.sortKey))
    .map(({ sortKey: _sortKey, ...item }) => item)
}

const blockingStatuses: ReadonlySet<ReservationStatus> = new Set(['PENDING', 'CONFIRMED'])

/** Active bookings that start inside a range the absence would close. */
export function affectedReservations(
  reservations: readonly ReservationWithId[],
  ranges: ReadonlyArray<{ dateYmd: string; fromMinute: number; toMinute: number }>,
  timeZone: string,
): ReservationWithId[] {
  return reservations.filter((reservation) => {
    if (!blockingStatuses.has(reservation.status)) return false
    const start = zonedDateAndMinute(reservation.startAt, timeZone)
    const end = zonedDateAndMinute(reservation.endAt, timeZone)
    const endMinute = end.dateYmd === start.dateYmd ? end.minute : endOfDayMinute
    return ranges.some(
      (range) =>
        range.dateYmd === start.dateYmd &&
        start.minute < range.toMinute &&
        range.fromMinute < endMinute,
    )
  })
}

/** Firestore query window (UTC) covering local dates `startYmd`..`endYmd`. */
export function reservationQueryRange(
  startYmd: string,
  endYmd: string,
): { startIso: string; endIso: string } {
  return {
    startIso: `${addCalendarDays(startYmd, -1)}T00:00:00.000Z`,
    endIso: `${addCalendarDays(endYmd, 2)}T00:00:00.000Z`,
  }
}
