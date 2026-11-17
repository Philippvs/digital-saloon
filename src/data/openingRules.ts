/**
 * Effective opening hours for a calendar date. Mirrors the availability Cloud Function
 * (`functions/src/domain/openingIntervals.ts`): holiday (closed) > day exception > weekly hours.
 */
import type { OpeningHoursByWeekday } from './openingHours'
import type { DayException, Holiday, TimeInterval, Weekday } from './schemas'

export const weekdays: readonly Weekday[] = [
  'monday',
  'tuesday',
  'wednesday',
  'thursday',
  'friday',
  'saturday',
  'sunday',
]

export type HolidayWithId = Holiday & { id: string }
export type DayExceptionWithId = DayException & { id: string }

export type Closures = {
  holidays: readonly HolidayWithId[]
  dayExceptions: readonly DayExceptionWithId[]
}

export function minuteOfHhmm(hhmm: string): number {
  const [hours, minutes] = hhmm.split(':').map(Number)
  return (hours ?? 0) * 60 + (minutes ?? 0)
}

export function weekdayOfYmd(dateYmd: string): Weekday {
  const [y, m, d] = dateYmd.split('-').map(Number)
  const jsDay = new Date(Date.UTC(y!, m! - 1, d!)).getUTCDay()
  return weekdays[(jsDay + 6) % 7]!
}

export function sortIntervals(intervals: readonly TimeInterval[]): TimeInterval[] {
  return [...intervals].sort((a, b) => minuteOfHhmm(a.start) - minuteOfHhmm(b.start))
}

export function weeklyIntervalsForDate(
  dateYmd: string,
  weekly: Partial<OpeningHoursByWeekday> | undefined,
): TimeInterval[] {
  return sortIntervals(weekly?.[weekdayOfYmd(dateYmd)]?.intervals ?? [])
}

export function holidayOnDate(
  dateYmd: string,
  holidays: readonly HolidayWithId[],
): HolidayWithId | undefined {
  return holidays.find((holiday) => dateYmd >= holiday.startDate && dateYmd <= holiday.endDate)
}

export function openIntervalsForDate(
  dateYmd: string,
  weekly: Partial<OpeningHoursByWeekday> | undefined,
  closures: Closures | undefined,
): TimeInterval[] {
  if (closures) {
    if (holidayOnDate(dateYmd, closures.holidays)) return []
    const exception = closures.dayExceptions.find((item) => item.date === dateYmd)
    if (exception) return exception.closed ? [] : sortIntervals(exception.intervals)
  }
  return weeklyIntervalsForDate(dateYmd, weekly)
}
