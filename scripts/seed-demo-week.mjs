/**
 * Demo reservations relative to "now" so the admin calendar, dashboard, and list
 * always show the current week: last week (done), this week, and two weeks ahead.
 * Times stay inside the seeded opening hours and never overlap.
 */

export const DEMO_RESERVATION_FLAG = 'seededDemo'

const CUSTOMERS = [
  ['Maria', 'Gruber'],
  ['Lukas', 'Pichler'],
  ['Giulia', 'Rossi'],
  ['Thomas', 'Hofer'],
  ['Sofia', 'Bianchi'],
  ['Elena', 'Kofler'],
  ['Marco', 'Ferrari'],
  ['Katharina', 'Thaler'],
  ['Stefan', 'Egger'],
  ['Laura', 'Gasser'],
  ['Matteo', 'Ricci'],
  ['Verena', 'Mair'],
]

/** Day offsets from Monday (1 = Tuesday … 5 = Saturday) with local start time and service. */
const WEEK_TEMPLATE = [
  [1, '08:30', 'haircut-wash'],
  [1, '10:00', 'haircut'],
  [1, '14:00', 'coloring'],
  [1, '16:30', 'blow-dry'],
  [2, '08:00', 'highlights'],
  [2, '11:00', 'haircut'],
  [2, '13:00', 'haircut-wash'],
  [2, '14:30', 'blow-dry'],
  [3, '09:00', 'coloring'],
  [3, '11:30', 'haircut'],
  [3, '14:00', 'haircut-wash'],
  [3, '16:00', 'haircut'],
  [3, '17:00', 'blow-dry'],
  [4, '08:00', 'haircut'],
  [4, '09:00', 'haircut-wash'],
  [4, '10:30', 'highlights'],
  [5, '08:00', 'blow-dry'],
  [5, '09:00', 'haircut-wash'],
  [5, '10:30', 'haircut'],
  [5, '13:00', 'coloring'],
]

const WEEK_OFFSETS = [-1, 0, 1, 2]

function partsInTimeZone(date, timeZone) {
  const parts = new Intl.DateTimeFormat('en-US', {
    timeZone,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    hourCycle: 'h23',
  }).formatToParts(date)
  const map = {}
  for (const part of parts) {
    if (part.type !== 'literal') map[part.type] = Number(part.value)
  }
  return map
}

export function localYmd(date, timeZone) {
  const p = partsInTimeZone(date, timeZone)
  return `${p.year}-${String(p.month).padStart(2, '0')}-${String(p.day).padStart(2, '0')}`
}

export function addDays(ymd, days) {
  const [y, m, d] = ymd.split('-').map(Number)
  return new Date(Date.UTC(y, m - 1, d + days)).toISOString().slice(0, 10)
}

export function mondayOf(ymd) {
  const [y, m, d] = ymd.split('-').map(Number)
  const weekday = new Date(Date.UTC(y, m - 1, d)).getUTCDay()
  return addDays(ymd, weekday === 0 ? -6 : 1 - weekday)
}

/** Civil time in `timeZone` → UTC Date (DST-safe by refinement). */
export function zonedToUtc(ymd, hm, timeZone) {
  const [y, m, d] = ymd.split('-').map(Number)
  const [hour, minute] = hm.split(':').map(Number)
  const desired = Date.UTC(y, m - 1, d, hour, minute)
  let utc = desired
  for (let i = 0; i < 3; i += 1) {
    const p = partsInTimeZone(new Date(utc), timeZone)
    utc += desired - Date.UTC(p.year, p.month - 1, p.day, p.hour, p.minute)
  }
  return new Date(utc)
}

/**
 * @param {{ now: Date, timeZone: string, services: Array<{ id: string, nameDe: string, nameIt: string, durationMinutes: number, priceCents: number }> }} input
 * @returns {Array<{ id: string, data: Record<string, unknown> }>}
 */
export function buildDemoReservations({ now, timeZone, services }) {
  const serviceById = new Map(services.map((service) => [service.id, service]))
  const thisMonday = mondayOf(localYmd(now, timeZone))
  const nowIso = now.toISOString()
  const reservations = []
  let sequence = 0

  for (const weekOffset of WEEK_OFFSETS) {
    const monday = addDays(thisMonday, weekOffset * 7)
    WEEK_TEMPLATE.forEach(([dayOffset, time, serviceId], templateIndex) => {
      // Leave a few gaps so weeks look different and customers can still book.
      if ((templateIndex + weekOffset * 3) % 5 === 0) return

      const service = serviceById.get(serviceId)
      if (!service) throw new Error(`Unknown demo service ${serviceId}`)

      const ymd = addDays(monday, dayOffset)
      const startAt = zonedToUtc(ymd, time, timeZone)
      const endAt = new Date(startAt.getTime() + service.durationMinutes * 60_000)
      const [firstName, lastName] = CUSTOMERS[sequence % CUSTOMERS.length]
      const isPast = endAt.getTime() <= now.getTime()
      const source = sequence % 5 === 3 ? 'MANUAL' : 'ONLINE'

      let status = 'CONFIRMED'
      if (isPast) status = sequence % 7 === 4 ? 'CANCELLED' : 'COMPLETED'
      else if (sequence % 6 === 2) status = 'PENDING'

      reservations.push({
        id: `demo-${ymd}-${time.replace(':', '')}`,
        data: {
          firstName,
          lastName,
          phone: `+39 33${String(1_000_000 + sequence * 7919).slice(-8)}`,
          email: sequence % 3 === 0 ? `${firstName.toLowerCase()}@example.com` : null,
          serviceId: service.id,
          serviceName:
            service.nameDe === service.nameIt
              ? service.nameDe
              : `${service.nameDe} / ${service.nameIt}`,
          durationMinutes: service.durationMinutes,
          priceCents: service.priceCents,
          startAt: startAt.toISOString(),
          endAt: endAt.toISOString(),
          status,
          source,
          managementTokenHash: `seed-hash-demo-${sequence}`,
          internalNote: source === 'MANUAL' ? 'Telefonisch vereinbart' : null,
          idempotencyKey: `seed-demo-${ymd}-${time}`,
          createdAt: nowIso,
          updatedAt: nowIso,
          [DEMO_RESERVATION_FLAG]: true,
        },
      })
      sequence += 1
    })
  }

  return reservations
}
