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

test('concurrent createReservationTransactional: exactly one succeeds', async (t) => {
  const reachable = await emulatorReachable()
  if (!reachable) {
    t.skip('Firestore emulator not reachable; start with pnpm emulators')
    return
  }

  const { createReservationTransactional } = await import('./lib/booking/reservationWrite.js')
  const { seedSalonData, salonSeedConfig } = await import('../scripts/seed-salon-data.mjs')
  const { zonedLocalToUtc } = await import('./lib/domain/timezone.js')

  const db = getFirestore()
  const config = salonSeedConfig()
  await seedSalonData(db, config)

  // Unique Tuesday slot per run so leftover locks from prior runs do not collide.
  const slotIndex = Date.now() % 16
  const startAt = zonedLocalToUtc(2027, 2, 2, 10, slotIndex * 15, 'Europe/Vienna')

  const results = await Promise.all(
    Array.from({ length: 5 }, (_, index) =>
      createReservationTransactional(
        {
          firstName: 'Concurrent',
          lastName: `User${index}`,
          phone: '+43660111111',
          email: null,
          serviceId: 'haircut',
          startAt,
          source: 'ONLINE',
          internalNote: null,
          idempotencyKey: `concurrent-${startAt.toISOString()}-${index}`,
          enforceAdvanceRestrictions: false,
          now: new Date('2026-04-01T08:00:00.000Z'),
        },
        db,
        config.salonId,
      ),
    ),
  )

  const successes = results.filter((result) => result.ok)
  const failures = results.filter((result) => !result.ok)

  assert.equal(successes.length, 1, `results=${JSON.stringify(results)}`)
  assert.equal(failures.length, 4)
  assert.ok(failures.every((result) => result.code === 'UNAVAILABLE'))
})
