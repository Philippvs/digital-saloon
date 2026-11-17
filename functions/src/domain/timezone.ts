const WEEKDAY_BY_UTC_DAY: Record<number, import('./types').Weekday> = {
  0: 'sunday',
  1: 'monday',
  2: 'tuesday',
  3: 'wednesday',
  4: 'thursday',
  5: 'friday',
  6: 'saturday',
}

const formatterCache = new Map<string, Intl.DateTimeFormat>()

function getFormatter(timeZone: string): Intl.DateTimeFormat {
  let formatter = formatterCache.get(timeZone)
  if (!formatter) {
    formatter = new Intl.DateTimeFormat('en-US', {
      timeZone,
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hourCycle: 'h23',
      weekday: 'short',
    })
    formatterCache.set(timeZone, formatter)
  }
  return formatter
}

function partsInTimeZone(date: Date, timeZone: string): Record<string, string> {
  const parts = getFormatter(timeZone).formatToParts(date)
  const map: Record<string, string> = {}
  for (const part of parts) {
    if (part.type !== 'literal') map[part.type] = part.value
  }
  return map
}

/** Calendar date YYYY-MM-DD in the given IANA timezone. */
export function calendarDateInTimeZone(date: Date, timeZone: string): string {
  const parts = partsInTimeZone(date, timeZone)
  return `${parts.year}-${parts.month}-${parts.day}`
}

export function weekdayInTimeZone(date: Date, timeZone: string): import('./types').Weekday {
  // Derive from the local calendar date's UTC noon weekday via zoned conversion.
  const localDate = calendarDateInTimeZone(date, timeZone)
  const [y, m, d] = localDate.split('-').map(Number)
  const utcNoon = zonedLocalToUtc(y, m, d, 12, 0, timeZone)
  return WEEKDAY_BY_UTC_DAY[utcNoon.getUTCDay()]
}

/**
 * Convert a civil date/time in `timeZone` to the corresponding UTC Date.
 * Handles DST by refining the UTC instant until local parts match.
 */
export function zonedLocalToUtc(
  year: number,
  month: number,
  day: number,
  hour: number,
  minute: number,
  timeZone: string,
): Date {
  const desired = Date.UTC(year, month - 1, day, hour, minute, 0)
  let utc = desired
  for (let i = 0; i < 3; i += 1) {
    const asDate = new Date(utc)
    const parts = partsInTimeZone(asDate, timeZone)
    const asYear = Number(parts.year)
    const asMonth = Number(parts.month)
    const asDay = Number(parts.day)
    const asHour = Number(parts.hour)
    const asMinute = Number(parts.minute)
    const actual = Date.UTC(asYear, asMonth - 1, asDay, asHour, asMinute, 0)
    const diff = desired - actual
    if (diff === 0) break
    utc += diff
  }
  return new Date(utc)
}

export function addCalendarDays(dateYmd: string, days: number): string {
  const [y, m, d] = dateYmd.split('-').map(Number)
  const utc = new Date(Date.UTC(y, m - 1, d + days))
  const yyyy = utc.getUTCFullYear()
  const mm = String(utc.getUTCMonth() + 1).padStart(2, '0')
  const dd = String(utc.getUTCDate()).padStart(2, '0')
  return `${yyyy}-${mm}-${dd}`
}

export function parseHm(hm: string): number {
  const [h, m] = hm.split(':').map(Number)
  return h * 60 + m
}
