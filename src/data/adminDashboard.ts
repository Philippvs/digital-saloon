import { addCalendarDays, todayYmdInTimeZone } from './calendarMath'
import type { ReservationWithId } from './reservations'
import type { ReservationStatus } from './schemas'

export const dashboardWindowDays = 30

export type DashboardDay = {
  dateYmd: string
  reservations: ReservationWithId[]
}

export type AdminDashboard = {
  today: ReservationWithId[]
  upcomingDays: DashboardDay[]
  pending: ReservationWithId[]
  todayCount: number
  next7DaysCount: number
  next7DaysRevenueCents: number
}

const bookedStatuses: ReadonlySet<ReservationStatus> = new Set(['PENDING', 'CONFIRMED'])
const revenueStatuses: ReadonlySet<ReservationStatus> = new Set([
  'PENDING',
  'CONFIRMED',
  'COMPLETED',
])

/**
 * Query window for the dashboard. Starts a day early in UTC so appointments
 * shortly after local midnight are included; `summarizeDashboard` filters by local date.
 */
export function dashboardRange(todayYmd: string): { startIso: string; endIso: string } {
  return {
    startIso: `${addCalendarDays(todayYmd, -1)}T00:00:00.000Z`,
    endIso: `${addCalendarDays(todayYmd, dashboardWindowDays + 1)}T00:00:00.000Z`,
  }
}

export function summarizeDashboard(
  reservations: readonly ReservationWithId[],
  todayYmd: string,
  timeZone: string,
): AdminDashboard {
  const localYmd = (iso: string): string => todayYmdInTimeZone(timeZone, new Date(iso))
  const next7End = addCalendarDays(todayYmd, 7)
  const windowEnd = addCalendarDays(todayYmd, dashboardWindowDays)
  const sorted = [...reservations].sort((a, b) => a.startAt.localeCompare(b.startAt))

  const today: ReservationWithId[] = []
  const pending: ReservationWithId[] = []
  const upcomingByDay = new Map<string, ReservationWithId[]>()
  let next7DaysCount = 0
  let next7DaysRevenueCents = 0

  for (const reservation of sorted) {
    const ymd = localYmd(reservation.startAt)
    if (ymd < todayYmd || ymd >= windowEnd) continue

    const booked = bookedStatuses.has(reservation.status)
    if (ymd === todayYmd && (booked || reservation.status === 'COMPLETED')) {
      today.push(reservation)
    }
    if (reservation.status === 'PENDING') pending.push(reservation)
    if (ymd > todayYmd && booked) {
      const day = upcomingByDay.get(ymd) ?? []
      day.push(reservation)
      upcomingByDay.set(ymd, day)
    }
    if (ymd < next7End) {
      if (booked) next7DaysCount += 1
      if (revenueStatuses.has(reservation.status)) {
        next7DaysRevenueCents += reservation.priceCents
      }
    }
  }

  return {
    today,
    upcomingDays: [...upcomingByDay].map(([dateYmd, items]) => ({
      dateYmd,
      reservations: items,
    })),
    pending,
    todayCount: today.length,
    next7DaysCount,
    next7DaysRevenueCents,
  }
}
