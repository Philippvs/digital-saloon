/** Pure calendar-day arithmetic on YYYY-MM-DD (UTC date parts). */
export function addCalendarDays(dateYmd: string, days: number): string {
  const [y, m, d] = dateYmd.split('-').map(Number)
  const utc = new Date(Date.UTC(y, m - 1, d + days))
  const yyyy = utc.getUTCFullYear()
  const mm = String(utc.getUTCMonth() + 1).padStart(2, '0')
  const dd = String(utc.getUTCDate()).padStart(2, '0')
  return `${yyyy}-${mm}-${dd}`
}

export function todayYmdInTimeZone(timeZone: string, now: Date = new Date()): string {
  return new Intl.DateTimeFormat('en-CA', {
    timeZone,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).format(now)
}
