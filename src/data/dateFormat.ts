const vienna = 'Europe/Vienna'

export function formatViennaDateTime(iso: string, locale = 'de-AT'): string {
  return new Intl.DateTimeFormat(locale, {
    timeZone: vienna,
    weekday: 'short',
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(iso))
}

export function formatViennaTime(iso: string, locale = 'de-AT'): string {
  return new Intl.DateTimeFormat(locale, {
    timeZone: vienna,
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(iso))
}

export function formatViennaDate(isoOrYmd: string, locale = 'de-AT'): string {
  const date = isoOrYmd.includes('T') ? new Date(isoOrYmd) : new Date(`${isoOrYmd}T12:00:00.000Z`)
  return new Intl.DateTimeFormat(locale, {
    timeZone: vienna,
    weekday: 'short',
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  }).format(date)
}

/** Next `count` calendar dates as YYYY-MM-DD in Europe/Vienna. */
export function upcomingViennaDates(count: number, from: Date = new Date()): string[] {
  const dates: string[] = []
  for (let offset = 0; dates.length < count; offset += 1) {
    const probe = new Date(from.getTime() + offset * 24 * 60 * 60_000)
    const ymd = new Intl.DateTimeFormat('en-CA', {
      timeZone: vienna,
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    }).format(probe)
    if (!dates.includes(ymd)) dates.push(ymd)
  }
  return dates
}
