/**
 * Seeds the single pilot salon tree used by SalonFlow emulator demos.
 * Configured via SEED_* env vars (see .env.example).
 */

const WEEKDAYS = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday']

function envOr(name, fallback) {
  const value = process.env[name]
  return typeof value === 'string' && value.trim().length > 0 ? value.trim() : fallback
}

export function salonSeedConfig() {
  return {
    salonId: envOr('SEED_SALON_ID', envOr('VITE_SALON_ID', 'pilot')),
    name: envOr('SEED_SALON_NAME', 'SalonFlow Pilot'),
    timezone: envOr('SEED_SALON_TIMEZONE', 'Europe/Vienna'),
    address: envOr('SEED_SALON_ADDRESS', 'Hauptstraße 1, 1010 Wien'),
    phone: envOr('SEED_SALON_PHONE', '+43 1 234567'),
    email: envOr('SEED_SALON_EMAIL', 'hello@salonflow.local'),
    adminEmail: envOr('SEED_ADMIN_EMAIL', 'admin@salonflow.local'),
    adminPassword: envOr('SEED_ADMIN_PASSWORD', 'password123'),
  }
}

/** @param {import('firebase-admin/firestore').Firestore} firestore */
export async function seedSalonData(firestore, config = salonSeedConfig()) {
  const now = new Date().toISOString()
  const salonRef = firestore.collection('salons').doc(config.salonId)

  await salonRef.set(
    {
      name: config.name,
      address: config.address,
      phone: config.phone,
      email: config.email,
      timezone: config.timezone,
    },
    { merge: true },
  )

  await salonRef.collection('settings').doc('booking').set(
    {
      confirmationMode: 'AUTOMATIC',
      slotIntervalMinutes: 15,
      minAdvanceBookingMinutes: 60,
      maxAdvanceBookingDays: 60,
      pendingExpirationHours: 24,
    },
    { merge: true },
  )

  const services = [
    {
      id: 'haircut',
      name: 'Haircut',
      description: 'Classic cut and finish',
      durationMinutes: 30,
      priceCents: 2500,
    },
    {
      id: 'haircut-wash',
      name: 'Haircut + Wash',
      description: 'Wash, cut, and style',
      durationMinutes: 45,
      priceCents: 3500,
    },
    {
      id: 'coloring',
      name: 'Hair Coloring',
      description: 'Full color treatment',
      durationMinutes: 120,
      priceCents: 9000,
    },
    {
      id: 'blow-dry',
      name: 'Blow Dry',
      description: 'Wash and blow dry',
      durationMinutes: 30,
      priceCents: 2000,
    },
  ]

  for (const service of services) {
    const { id, ...fields } = service
    await salonRef
      .collection('services')
      .doc(id)
      .set(
        {
          ...fields,
          active: true,
          createdAt: now,
          updatedAt: now,
        },
        { merge: true },
      )
  }

  const weekly = {
    monday: [{ start: '09:00', end: '17:00' }],
    tuesday: [{ start: '09:00', end: '17:00' }],
    wednesday: [{ start: '09:00', end: '13:00' }],
    thursday: [{ start: '09:00', end: '18:00' }],
    friday: [{ start: '09:00', end: '17:00' }],
    saturday: [{ start: '09:00', end: '12:00' }],
    sunday: [],
  }

  for (const weekday of WEEKDAYS) {
    await salonRef
      .collection('openingHours')
      .doc(weekday)
      .set({ intervals: weekly[weekday] }, { merge: true })
  }

  await salonRef.collection('holidays').doc('national-demo').set(
    {
      name: 'National Holiday (demo)',
      startDate: '2026-05-01',
      endDate: '2026-05-01',
    },
    { merge: true },
  )

  await salonRef
    .collection('dayExceptions')
    .doc('2026-12-24')
    .set(
      {
        date: '2026-12-24',
        intervals: [{ start: '09:00', end: '12:00' }],
        closed: false,
      },
      { merge: true },
    )

  await salonRef.collection('blockedSlots').doc('demo-block').set(
    {
      startAt: '2026-04-07T12:00:00.000Z',
      endAt: '2026-04-07T13:00:00.000Z',
      reason: 'Staff meeting',
      createdAt: now,
    },
    { merge: true },
  )

  await salonRef.collection('reservations').doc('demo-confirmed').set(
    {
      firstName: 'Anna',
      lastName: 'Beispiel',
      phone: '+43 660 1111111',
      email: 'anna@example.com',
      serviceId: 'haircut',
      serviceName: 'Haircut',
      durationMinutes: 30,
      priceCents: 2500,
      startAt: '2026-04-08T08:00:00.000Z',
      endAt: '2026-04-08T08:30:00.000Z',
      status: 'CONFIRMED',
      source: 'ONLINE',
      managementTokenHash: 'seed-hash-demo-confirmed',
      internalNote: null,
      idempotencyKey: 'seed-demo-confirmed',
      createdAt: now,
      updatedAt: now,
    },
    { merge: true },
  )

  await salonRef.collection('reservations').doc('demo-pending').set(
    {
      firstName: 'Max',
      lastName: 'Mustermann',
      phone: '+43 660 2222222',
      email: null,
      serviceId: 'blow-dry',
      serviceName: 'Blow Dry',
      durationMinutes: 30,
      priceCents: 2000,
      startAt: '2026-04-08T09:00:00.000Z',
      endAt: '2026-04-08T09:30:00.000Z',
      status: 'PENDING',
      source: 'ONLINE',
      managementTokenHash: 'seed-hash-demo-pending',
      internalNote: null,
      idempotencyKey: 'seed-demo-pending',
      createdAt: now,
      updatedAt: now,
    },
    { merge: true },
  )

  // Stale pending used by expiry E2E (createdAt far in the past).
  const staleCreatedAt = '2020-01-01T00:00:00.000Z'
  await salonRef.collection('reservations').doc('demo-stale-pending').set(
    {
      firstName: 'Alt',
      lastName: 'Anfrage',
      phone: '+43 660 3333333',
      email: 'stale@example.com',
      serviceId: 'haircut',
      serviceName: 'Haircut',
      durationMinutes: 30,
      priceCents: 2500,
      startAt: '2026-05-01T08:00:00.000Z',
      endAt: '2026-05-01T08:30:00.000Z',
      status: 'PENDING',
      source: 'ONLINE',
      managementTokenHash: 'seed-hash-demo-stale-pending',
      internalNote: null,
      idempotencyKey: 'seed-demo-stale-pending',
      createdAt: staleCreatedAt,
      updatedAt: staleCreatedAt,
    },
    { merge: true },
  )
  await salonRef.collection('slotLocks').doc('2026-05-01T08-00-00-000Z').set(
    {
      reservationId: 'demo-stale-pending',
      startAt: '2026-05-01T08:00:00.000Z',
      endAt: '2026-05-01T08:30:00.000Z',
      createdAt: staleCreatedAt,
    },
    { merge: true },
  )
}
