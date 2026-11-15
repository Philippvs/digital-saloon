import { addCalendarDays, todayYmdInTimeZone } from '../src/data/calendarMath'
import { startOfWeekYmd } from '../src/data/calendarRange'
import { defaultWeekStartYmd, isoWeekNumber } from '../src/data/weekPlanner'

const salonTimeZone = 'Europe/Vienna'

/** Monday (YYYY-MM-DD) of the salon's current week, shifted by whole weeks. */
export function mondayOfWeek(weekOffset = 0): string {
  return addCalendarDays(startOfWeekYmd(todayYmdInTimeZone(salonTimeZone)), weekOffset * 7)
}

/** `dd.mm.yyyy` as rendered by the German admin UI. */
export function germanDate(ymd: string): string {
  const [year, month, day] = ymd.split('-')
  return `${day}.${month}.${year}`
}

export { addCalendarDays }

const seededOpenWeekdays = {
  monday: { intervals: [] },
  tuesday: { intervals: [{ start: '08:00', end: '12:00' }] },
  wednesday: { intervals: [{ start: '08:00', end: '16:00' }] },
  thursday: { intervals: [{ start: '08:00', end: '18:00' }] },
  friday: { intervals: [{ start: '08:00', end: '18:00' }] },
  saturday: { intervals: [{ start: '08:00', end: '16:00' }] },
  sunday: { intervals: [] },
}

/** Monday of the week `/admin` opens on with the seeded opening hours. */
export function plannerDefaultWeek(): string {
  return defaultWeekStartYmd(todayYmdInTimeZone(salonTimeZone), seededOpenWeekdays)
}

/** `KW 47` heading for the week starting on the given Monday. */
export function weekHeading(weekStartYmd: string): string {
  return `KW ${isoWeekNumber(weekStartYmd)}`
}
