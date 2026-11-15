import { addCalendarDays } from './calendarMath'

export type CalendarView = 'day' | 'week'

/** Monday-based week start for YYYY-MM-DD (UTC calendar arithmetic). */
export function startOfWeekYmd(dateYmd: string): string {
  const [y, m, d] = dateYmd.split('-').map(Number)
  const utc = new Date(Date.UTC(y, m - 1, d))
  const day = utc.getUTCDay() // 0 Sun .. 6 Sat
  const offset = day === 0 ? -6 : 1 - day
  return addCalendarDays(dateYmd, offset)
}

export function rangeForView(
  view: CalendarView,
  anchorYmd: string,
): { startIso: string; endIso: string; labelStart: string; labelEnd: string } {
  if (view === 'day') {
    return {
      startIso: `${anchorYmd}T00:00:00.000Z`,
      endIso: `${addCalendarDays(anchorYmd, 1)}T00:00:00.000Z`,
      labelStart: anchorYmd,
      labelEnd: anchorYmd,
    }
  }
  const weekStart = startOfWeekYmd(anchorYmd)
  const weekEndExclusive = addCalendarDays(weekStart, 7)
  return {
    startIso: `${weekStart}T00:00:00.000Z`,
    endIso: `${weekEndExclusive}T00:00:00.000Z`,
    labelStart: weekStart,
    labelEnd: addCalendarDays(weekStart, 6),
  }
}

export function shiftAnchor(view: CalendarView, anchorYmd: string, direction: number): string {
  return addCalendarDays(anchorYmd, view === 'day' ? direction : direction * 7)
}
