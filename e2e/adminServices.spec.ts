import { expect, test, type Page } from '@playwright/test'

import {
  findFutureReservationOfService,
  findServiceByName,
  getReservation,
  getService,
  restoreServices,
  snapshotServices,
  type ServiceSnapshot,
} from './firestoreAdmin'
import { signInAsDemo } from './helpers'

let servicesSnapshot: ServiceSnapshot

async function openServices(page: Page): Promise<void> {
  await page.goto('/admin/services')
  await expect(page.getByRole('heading', { name: 'Leistungen' })).toBeVisible()
  await expect(page.getByRole('list', { name: 'Leistungen' })).toBeVisible()
}

function editor(page: Page, title: string) {
  return page.getByRole('form', { name: title })
}

test.describe('admin services @smoke', () => {
  test.beforeAll(async () => {
    servicesSnapshot = await snapshotServices()
  })

  test.beforeEach(async ({ page }) => {
    await restoreServices(servicesSnapshot)
    await signInAsDemo(page)
    await openServices(page)
  })

  test.afterAll(async () => {
    await restoreServices(servicesSnapshot)
  })

  test('lists seeded services with price and duration', async ({ page }) => {
    const list = page.getByRole('list', { name: 'Leistungen' })
    await expect(list.getByText('Herrenhaarschnitt / Taglio uomo')).toBeVisible()
    await expect(list.getByText('30 Min').first()).toBeVisible()
    await expect(list.getByText(/€\s*22/).first()).toBeVisible()
  })

  test('creates a new service that appears on the website in both languages', async ({ page }) => {
    const suffix = Date.now().toString().slice(-6)
    const nameDe = `E2E Schnitt ${suffix}`
    const nameIt = `E2E Taglio ${suffix}`
    await page.getByRole('button', { name: 'Neue Leistung' }).click()
    const form = editor(page, 'Neue Leistung')
    await form.getByLabel('Name (Deutsch)').fill(nameDe)
    await form.getByLabel('Name (Italienisch)').fill(nameIt)
    await form.getByLabel('Beschreibung (Deutsch, optional)').fill('Nur für den Test')
    await form.getByLabel('Beschreibung (Italienisch, optional)').fill('Solo per il test')
    await form.getByLabel('Dauer').fill('45')
    await form.getByLabel('Preis').fill('33,50')
    await form.getByRole('button', { name: 'Speichern' }).click()

    await expect(page.getByRole('status')).toHaveText('Gespeichert.')
    const created = await findServiceByName(nameDe)
    expect(created).toMatchObject({
      nameDe,
      nameIt,
      descriptionDe: 'Nur für den Test',
      descriptionIt: 'Solo per il test',
      durationMinutes: 45,
      priceCents: 3350,
      active: true,
    })

    await page.goto('/')
    await expect(
      page.getByRole('region', { name: 'Leistungen und Preise' }).getByText(nameDe),
    ).toBeVisible()
    await page
      .getByRole('banner')
      .getByRole('group', { name: 'Sprache' })
      .getByRole('button', {
        name: 'Italiano',
      })
      .click()
    await expect(
      page.getByRole('region', { name: 'Servizi e prezzi' }).getByText(nameIt),
    ).toBeVisible()
    await expect(
      page.getByRole('region', { name: 'Servizi e prezzi' }).getByText(/33,50/),
    ).toBeVisible()
  })

  test('edits price and duration without changing existing reservations', async ({ page }) => {
    const booked = await findFutureReservationOfService('haircut')
    const before = await getReservation(booked.id)
    expect(before?.serviceName).toBe('Herrenhaarschnitt / Taglio uomo')
    expect(before?.priceCents).toBe(2200)
    expect(before?.durationMinutes).toBe(30)

    await page.getByRole('button', { name: 'Herrenhaarschnitt / Taglio uomo bearbeiten' }).click()
    const form = editor(page, 'Leistung bearbeiten')
    await form.getByLabel('Name (Deutsch)').fill('Herrenhaarschnitt neu')
    await form.getByLabel('Name (Italienisch)').fill('Taglio uomo nuovo')
    await form.getByLabel('Dauer').fill('40')
    await form.getByLabel('Preis').fill('29')
    await form.getByRole('button', { name: 'Speichern' }).click()
    await expect(page.getByRole('status')).toHaveText('Gespeichert.')

    await expect.poll(async () => (await getService('haircut'))?.priceCents).toBe(2900)
    expect(await getService('haircut')).toMatchObject({
      nameDe: 'Herrenhaarschnitt neu',
      nameIt: 'Taglio uomo nuovo',
      durationMinutes: 40,
      priceCents: 2900,
      active: true,
    })

    const after = await getReservation(booked.id)
    expect(after).toMatchObject({
      serviceName: before?.serviceName,
      priceCents: before?.priceCents,
      durationMinutes: before?.durationMinutes,
      startAt: before?.startAt,
      endAt: before?.endAt,
    })

    await page.goto(`/admin/reservations/${booked.id}`)
    await expect(page.getByText('Herrenhaarschnitt / Taglio uomo')).toBeVisible()
    await expect(page.getByText('Herrenhaarschnitt neu')).toHaveCount(0)
  })

  test('deactivating a service hides it from booking but keeps old appointments', async ({
    page,
  }) => {
    const booked = await findFutureReservationOfService('blow-dry')
    await page
      .getByRole('button', { name: 'Waschen, föhnen / Lavaggio e piega bearbeiten' })
      .click()
    const form = editor(page, 'Leistung bearbeiten')
    await form.getByLabel('Online buchbar').uncheck()
    await form.getByRole('button', { name: 'Speichern' }).click()
    await expect(page.getByRole('status')).toHaveText('Gespeichert.')
    await expect(page.getByText('Nicht online buchbar')).toBeVisible()

    await expect.poll(async () => (await getService('blow-dry'))?.active).toBe(false)

    await page.goto('/')
    await expect(
      page.getByRole('region', { name: 'Leistungen und Preise' }).getByText('Waschen, föhnen'),
    ).toHaveCount(0)

    await page.goto('/book')
    await expect(page.locator('[aria-labelledby="step-service"]')).not.toContainText(
      'Waschen, föhnen',
    )

    const after = await getReservation(booked.id)
    expect(after?.serviceName).toBe(booked.serviceName)
    expect(after?.priceCents).toBe(booked.priceCents)
  })

  test('rejects invalid duration and price before saving', async ({ page }) => {
    const before = await getService('coloring')
    await page.getByRole('button', { name: 'Farbe / Colore bearbeiten' }).click()
    const form = editor(page, 'Leistung bearbeiten')
    await form.getByLabel('Dauer').fill('3')
    await form.getByLabel('Preis').fill('gratis')
    await form.getByRole('button', { name: 'Speichern' }).click()

    await expect(form).toContainText('Erlaubt sind ganze Zahlen von 5 bis 480.')
    await expect(form).toContainText('Bitte einen Betrag wie 26 oder 26,50 eingeben.')
    expect(await getService('coloring')).toEqual(before)
  })
})
