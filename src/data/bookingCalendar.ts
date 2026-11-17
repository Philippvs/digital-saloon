/** Calendar helpers for the booking wizard (YYYY-MM-DD in salon timezone days). */

export function ymdFromParts(year: number, monthIndex: number, day: number): string {
  const month = String(monthIndex + 1).padStart(2, '0')
  const dayStr = String(day).padStart(2, '0')
  return `${year}-${month}-${dayStr}`
}

export function parseYmd(ymd: string): { year: number; monthIndex: number; day: number } {
  const [y, m, d] = ymd.split('-').map(Number)
  return { year: y!, monthIndex: m! - 1, day: d! }
}

export function addMonths(ymd: string, delta: number): string {
  const { year, monthIndex, day } = parseYmd(ymd)
  const date = new Date(Date.UTC(year, monthIndex + delta, 1))
  const lastDay = new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth() + 1, 0)).getUTCDate()
  const clamped = Math.min(day, lastDay)
  return ymdFromParts(date.getUTCFullYear(), date.getUTCMonth(), clamped)
}

export function monthMatrix(year: number, monthIndex: number): Array<Array<string | null>> {
  const firstWeekday = new Date(Date.UTC(year, monthIndex, 1)).getUTCDay()
  // Monday-first
  const offset = (firstWeekday + 6) % 7
  const daysInMonth = new Date(Date.UTC(year, monthIndex + 1, 0)).getUTCDate()
  const cells: Array<string | null> = []
  for (let i = 0; i < offset; i += 1) cells.push(null)
  for (let day = 1; day <= daysInMonth; day += 1) {
    cells.push(ymdFromParts(year, monthIndex, day))
  }
  while (cells.length % 7 !== 0) cells.push(null)
  const weeks: Array<Array<string | null>> = []
  for (let i = 0; i < cells.length; i += 7) {
    weeks.push(cells.slice(i, i + 7))
  }
  return weeks
}

export function viennaTodayYmd(now = new Date()): string {
  return new Intl.DateTimeFormat('en-CA', {
    timeZone: 'Europe/Vienna',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).format(now)
}

export function slotsByDate(slots: Array<{ startAt: string }>): Map<string, string[]> {
  const map = new Map<string, string[]>()
  for (const slot of slots) {
    const ymd = new Intl.DateTimeFormat('en-CA', {
      timeZone: 'Europe/Vienna',
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    }).format(new Date(slot.startAt))
    const list = map.get(ymd) ?? []
    list.push(slot.startAt)
    map.set(ymd, list)
  }
  return map
}
