import type {
  DayException,
  Holiday,
  LocalInterval,
  OpeningHoursByWeekday,
  TimeInterval,
} from './types'
import { parseHm, weekdayInTimeZone, zonedLocalToUtc } from './timezone'

function isHolidayOnDate(dateYmd: string, holidays: readonly Holiday[]): boolean {
  return holidays.some((holiday) => dateYmd >= holiday.startDate && dateYmd <= holiday.endDate)
}

function intervalsToLocal(intervals: readonly TimeInterval[]): LocalInterval[] {
  return intervals.map((interval) => ({
    startMinutes: parseHm(interval.start),
    endMinutes: parseHm(interval.end),
  }))
}

/**
 * Resolve open intervals for a calendar date in salon timezone.
 * Precedence: holiday (closed) > day exception > weekly opening hours.
 */
export function resolveOpenIntervalsForDate(input: {
  dateYmd: string
  timeZone: string
  weekly: OpeningHoursByWeekday
  holidays: readonly Holiday[]
  dayExceptions: readonly DayException[]
}): LocalInterval[] {
  const { dateYmd, timeZone, weekly, holidays, dayExceptions } = input

  if (isHolidayOnDate(dateYmd, holidays)) {
    return []
  }

  const exception = dayExceptions.find((item) => item.date === dateYmd)
  if (exception) {
    if (exception.closed) return []
    return intervalsToLocal(exception.intervals)
  }

  const [y, m, d] = dateYmd.split('-').map(Number)
  const noon = zonedLocalToUtc(y, m, d, 12, 0, timeZone)
  const weekday = weekdayInTimeZone(noon, timeZone)
  return intervalsToLocal(weekly[weekday] ?? [])
}
