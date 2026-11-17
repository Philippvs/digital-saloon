import assert from 'node:assert/strict'
import test from 'node:test'

import { initializeApp, getApps } from 'firebase-admin/app'
import { getFirestore } from 'firebase-admin/firestore'

const EMULATOR_HOST = process.env.FIRESTORE_EMULATOR_HOST ?? '127.0.0.1:8180'

async function emulatorReachable() {
  process.env.FIRESTORE_EMULATOR_HOST = EMULATOR_HOST
  process.env.GCLOUD_PROJECT = process.env.GCLOUD_PROJECT ?? 'demo-react-firebase-template'
  if (getApps().length === 0) {
    initializeApp({ projectId: 'demo-react-firebase-template' })
  }
  try {
    await getFirestore().collection('_health').limit(1).get()
    return true
  } catch {
    return false
  }
}

test('editing a service leaves booked reservations and their reschedule slots unchanged', async (t) => {
  const reachable = await emulatorReachable()
  if (!reachable) {
    t.skip('Firestore emulator not reachable; start with pnpm emulators')
    return
  }

  const { createReservationTransactional, previewAvailableSlots } =
    await import('./lib/booking/reservationWrite.js')
  const { seedSalonData, salonSeedConfig } = await import('../scripts/seed-salon-data.mjs')
  const { zonedLocalToUtc } = await import('./lib/domain/timezone.js')

  const db = getFirestore()
  const config = salonSeedConfig()
  await seedSalonData(db, config)

  const salonRef = db.collection('salons').doc(config.salonId)
  const serviceId = `test-service-change-${Date.now()}`
  const serviceRef = salonRef.collection('services').doc(serviceId)
  let reservationRef = null

  try {
    await serviceRef.set({
      name: 'Testschnitt',
      description: '',
      durationMinutes: 30,
      priceCents: 2600,
      active: true,
      createdAt: '2026-01-01T00:00:00.000Z',
      updatedAt: '2026-01-01T00:00:00.000Z',
    })

    // Thursday, open 08:00–18:00; 15-minute grid so the own slot can appear when moving.
    const startAt = zonedLocalToUtc(2027, 3, 4, 9, (Date.now() % 8) * 15, 'Europe/Vienna')
    const created = await createReservationTransactional(
      {
        firstName: 'Service',
        lastName: 'Change',
        phone: '+390473000000',
        email: null,
        serviceId,
        startAt,
        source: 'MANUAL',
        internalNote: null,
        idempotencyKey: `service-change-${serviceId}`,
        enforceAdvanceRestrictions: false,
        now: new Date('2026-04-01T08:00:00.000Z'),
      },
      db,
      config.salonId,
    )
    assert.equal(created.ok, true, JSON.stringify(created))
    reservationRef = salonRef.collection('reservations').doc(created.reservationId)

    await serviceRef.update({
      name: 'Testschnitt lang',
      durationMinutes: 120,
      priceCents: 9900,
      active: false,
      updatedAt: '2026-02-01T00:00:00.000Z',
    })

    const reservation = (await reservationRef.get()).data()
    assert.equal(reservation.serviceName, 'Testschnitt')
    assert.equal(reservation.durationMinutes, 30)
    assert.equal(reservation.priceCents, 2600)
    assert.equal(new Date(reservation.endAt).getTime() - startAt.getTime(), 30 * 60_000)

    const window = {
      serviceId,
      fromDateYmd: '2027-03-04',
      toDateYmd: '2027-03-04',
      db,
      salonId: config.salonId,
      enforceAdvanceRestrictions: false,
      now: new Date('2026-04-01T08:00:00.000Z'),
    }

    const newBookingSlots = await previewAvailableSlots(window)
    assert.deepEqual(newBookingSlots, [], 'deactivated service is not bookable')

    const rescheduleSlots = await previewAvailableSlots({
      ...window,
      reschedule: { reservationId: created.reservationId, durationMinutes: 30 },
    })
    assert.ok(rescheduleSlots.length > 0, 'booked customer can still move the appointment')
    for (const slot of rescheduleSlots) {
      assert.equal(
        new Date(slot.endAt).getTime() - new Date(slot.startAt).getTime(),
        30 * 60_000,
        'slots use the booked duration, not the edited one',
      )
    }
    assert.ok(
      rescheduleSlots.some((slot) => slot.startAt === startAt.toISOString()),
      'the booking does not block its own time',
    )
  } finally {
    if (reservationRef) await reservationRef.delete()
    await serviceRef.delete()
  }
})
