import { expect, test, type APIRequestContext } from '@playwright/test'

import { demoProjectId, emulatorHost, emulatorPorts } from '../src/data/emulatorPorts'
import {
  getBookingSettings,
  getSalonDetails,
  restoreSeededSettings,
  seededBookingSettings,
} from './firestoreAdmin'
import { demoAccount } from './helpers'

const guestAccount = { email: 'guest@example.com', password: 'password123' } as const

const authUrl = `http://${emulatorHost}:${emulatorPorts.auth}/identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=fake-api-key`
const documentsUrl = `http://${emulatorHost}:${emulatorPorts.firestore}/v1/projects/${demoProjectId}/databases/(default)/documents`
const salonPath = 'salons/pilot'
const bookingSettingsPath = 'salons/pilot/settings/booking'

type FieldValue = string | number

function toFirestoreFields(data: Record<string, FieldValue>): Record<string, object> {
  return Object.fromEntries(
    Object.entries(data).map(([key, value]) => [
      key,
      typeof value === 'number' ? { integerValue: String(value) } : { stringValue: value },
    ]),
  )
}

async function signIn(
  request: APIRequestContext,
  account: { email: string; password: string },
): Promise<string> {
  const response = await request.post(authUrl, {
    data: { email: account.email, password: account.password, returnSecureToken: true },
  })
  expect(response.ok(), `sign-in as ${account.email}`).toBe(true)
  const body = (await response.json()) as { idToken: string }
  return body.idToken
}

type WriteOptions = {
  token: string | null
  path: string
  data: Record<string, FieldValue>
  /** Only these fields are written (merge); without a mask the document is replaced. */
  mask?: string[]
}

async function writeStatus(
  request: APIRequestContext,
  { token, path, data, mask }: WriteOptions,
): Promise<number> {
  const query = mask?.map((field) => `updateMask.fieldPaths=${field}`).join('&')
  const response = await request.patch(`${documentsUrl}/${path}${query ? `?${query}` : ''}`, {
    headers: token ? { Authorization: `Bearer ${token}` } : {},
    data: { fields: toFirestoreFields(data) },
  })
  return response.status()
}

async function readStatus(
  request: APIRequestContext,
  token: string | null,
  path: string,
): Promise<number> {
  const response = await request.get(`${documentsUrl}/${path}`, {
    headers: token ? { Authorization: `Bearer ${token}` } : {},
  })
  return response.status()
}

test.describe('Firestore-Regeln für Einstellungen', () => {
  test.describe.configure({ mode: 'serial' })

  let adminToken = ''
  let guestToken = ''

  test.beforeAll(async ({ request }) => {
    adminToken = await signIn(request, demoAccount)
    guestToken = await signIn(request, guestAccount)
  })

  test.beforeEach(async () => {
    await restoreSeededSettings()
  })

  test.afterAll(async () => {
    await restoreSeededSettings()
  })

  test.describe('Buchungsregeln (settings/booking)', () => {
    test('nur Admins dürfen sie lesen', async ({ request }) => {
      expect(await readStatus(request, adminToken, bookingSettingsPath)).toBe(200)
      expect(await readStatus(request, guestToken, bookingSettingsPath)).toBe(403)
      expect(await readStatus(request, null, bookingSettingsPath)).toBe(403)
    })

    test('Admin darf gültige Regeln speichern', async ({ request }) => {
      const next = {
        confirmationMode: 'MANUAL',
        slotIntervalMinutes: 30,
        minAdvanceBookingMinutes: 0,
        maxAdvanceBookingDays: 365,
        pendingExpirationHours: 168,
      }
      expect(
        await writeStatus(request, { token: adminToken, path: bookingSettingsPath, data: next }),
      ).toBe(200)
      expect(await getBookingSettings()).toEqual(next)
    })

    test('Gäste und Anonyme dürfen nichts ändern', async ({ request }) => {
      const data = { ...seededBookingSettings, confirmationMode: 'MANUAL' }
      expect(
        await writeStatus(request, { token: guestToken, path: bookingSettingsPath, data }),
      ).toBe(403)
      expect(await writeStatus(request, { token: null, path: bookingSettingsPath, data })).toBe(403)
      expect(await getBookingSettings()).toEqual(seededBookingSettings)
    })

    const invalidSettings: Array<[string, Record<string, FieldValue>]> = [
      ['unbekannter Modus', { confirmationMode: 'SOMETIMES' }],
      ['Intervall zu klein', { slotIntervalMinutes: 4 }],
      ['Intervall zu groß', { slotIntervalMinutes: 999 }],
      ['Intervall als Text', { slotIntervalMinutes: '15' }],
      ['negativer Vorlauf', { minAdvanceBookingMinutes: -1 }],
      ['Vorlauf über eine Woche', { minAdvanceBookingMinutes: 10081 }],
      ['0 Tage im Voraus', { maxAdvanceBookingDays: 0 }],
      ['über ein Jahr im Voraus', { maxAdvanceBookingDays: 366 }],
      ['Verfall 0 Stunden', { pendingExpirationHours: 0 }],
      ['Verfall über eine Woche', { pendingExpirationHours: 169 }],
      ['zusätzliches Feld', { surprise: 'x' }],
    ]

    for (const [label, override] of invalidSettings) {
      test(`lehnt ab: ${label}`, async ({ request }) => {
        const data = { ...seededBookingSettings, ...override }
        expect(
          await writeStatus(request, { token: adminToken, path: bookingSettingsPath, data }),
        ).toBe(403)
        expect(await getBookingSettings()).toEqual(seededBookingSettings)
      })
    }

    test('lehnt ab: fehlendes Pflichtfeld', async ({ request }) => {
      const incomplete = {
        confirmationMode: seededBookingSettings.confirmationMode,
        slotIntervalMinutes: seededBookingSettings.slotIntervalMinutes,
        minAdvanceBookingMinutes: seededBookingSettings.minAdvanceBookingMinutes,
        maxAdvanceBookingDays: seededBookingSettings.maxAdvanceBookingDays,
      }
      expect(
        await writeStatus(request, {
          token: adminToken,
          path: bookingSettingsPath,
          data: incomplete,
        }),
      ).toBe(403)
    })
  })

  test.describe('Salon-Daten (salons/pilot)', () => {
    test('sind öffentlich lesbar', async ({ request }) => {
      expect(await readStatus(request, null, salonPath)).toBe(200)
    })

    test('Admin darf Kontaktdaten ändern', async ({ request }) => {
      expect(
        await writeStatus(request, {
          token: adminToken,
          path: salonPath,
          data: { phone: '+39 0473 000000', vatId: '99999999999' },
          mask: ['phone', 'vatId'],
        }),
      ).toBe(200)
      const salon = await getSalonDetails()
      expect(salon.phone).toBe('+39 0473 000000')
      expect(salon.vatId).toBe('99999999999')
      expect(salon.timezone).toBe('Europe/Vienna')
    })

    test('Admin darf die USt-IdNr. entfernen', async ({ request }) => {
      expect(
        await writeStatus(request, {
          token: adminToken,
          path: salonPath,
          data: {},
          mask: ['vatId'],
        }),
      ).toBe(200)
      expect(await getSalonDetails()).not.toHaveProperty('vatId')
    })

    test('Gäste und Anonyme dürfen nichts ändern', async ({ request }) => {
      const write = { path: salonPath, data: { name: 'Gekapert' }, mask: ['name'] }
      expect(await writeStatus(request, { token: guestToken, ...write })).toBe(403)
      expect(await writeStatus(request, { token: null, ...write })).toBe(403)
      expect((await getSalonDetails()).name).toBe('KIMM Hair')
    })

    const invalidSalonWrites: Array<[string, Record<string, FieldValue>]> = [
      ['Zeitzone ändern', { timezone: 'Europe/Rome' }],
      ['leerer Name', { name: '' }],
      ['Name zu lang', { name: 'x'.repeat(121) }],
      ['Adresse zu lang', { address: 'x'.repeat(241) }],
      ['Telefon zu lang', { phone: '1'.repeat(41) }],
      ['leere USt-IdNr.', { vatId: '' }],
      ['Telefon als Zahl', { phone: 4730000 }],
      ['zusätzliches Feld', { ownerUid: 'someone' }],
    ]

    for (const [label, data] of invalidSalonWrites) {
      test(`lehnt ab: ${label}`, async ({ request }) => {
        const before = await getSalonDetails()
        expect(
          await writeStatus(request, {
            token: adminToken,
            path: salonPath,
            data,
            mask: Object.keys(data),
          }),
        ).toBe(403)
        expect(await getSalonDetails()).toEqual(before)
      })
    }

    test('lehnt ab: Pflichtfeld löschen', async ({ request }) => {
      expect(
        await writeStatus(request, {
          token: adminToken,
          path: salonPath,
          data: {},
          mask: ['email'],
        }),
      ).toBe(403)
    })
  })
})
