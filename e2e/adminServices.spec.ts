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
    await expect(list.getByText('Herrenschnitt / Taglio uomo')).toBeVisible()
    await expect(list.getByText('30 Min').first()).toBeVisible()
    await expect(list.getByText(/€\s*26/).first()).toBeVisible()
  })

  test('creates a new service that appears on the website', async ({ page }) => {
    const name = `E2E Schnitt ${Date.now().toString().slice(-6)}`
    await page.getByRole('button', { name: 'Neue Leistung' }).click()
    const form = editor(page, 'Neue Leistung')
    await form.getByLabel('Name').fill(name)
    await form.getByLabel('Beschreibung (optional)').fill('Nur für den Test')
    await form.getByLabel('Dauer').fill('45')
    await form.getByLabel('Preis').fill('33,50')
    await form.getByRole('button', { name: 'Speichern' }).click()

    await expect(page.getByRole('status')).toHaveText('Gespeichert.')
    const created = await findServiceByName(name)
    expect(created).toMatchObject({
      name,
      description: 'Nur für den Test',
      durationMinutes: 45,
      priceCents: 3350,
      active: true,
    })

    await page.goto('/')
    await expect(
      page.getByRole('region', { name: 'Leistungen und Preise' }).getByText(name),
    ).toBeVisible()
    await expect(
      page.getByRole('region', { name: 'Leistungen und Preise' }).getByText(/€\s*33,50/),
    ).toBeVisible()
  })

  test('edits price and duration without changing existing reservations', async ({ page }) => {
    const booked = await findFutureReservationOfService('haircut')
    const before = await getReservation(booked.id)
    expect(before?.serviceName).toBe('Herrenschnitt / Taglio uomo')
    expect(before?.priceCents).toBe(2600)
    expect(before?.durationMinutes).toBe(30)

    await page.getByRole('button', { name: 'Herrenschnitt / Taglio uomo bearbeiten' }).click()
    const form = editor(page, 'Leistung bearbeiten')
    await form.getByLabel('Name').fill('Herrenschnitt / Taglio uomo (neu)')
    await form.getByLabel('Dauer').fill('40')
    await form.getByLabel('Preis').fill('29')
    await form.getByRole('button', { name: 'Speichern' }).click()
    await expect(page.getByRole('status')).toHaveText('Gespeichert.')

    await expect.poll(async () => (await getService('haircut'))?.priceCents).toBe(2900)
    expect(await getService('haircut')).toMatchObject({
      name: 'Herrenschnitt / Taglio uomo (neu)',
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
    await expect(page.getByText('Herrenschnitt / Taglio uomo')).toBeVisible()
    await expect(page.getByText('Herrenschnitt / Taglio uomo (neu)')).toHaveCount(0)
  })

  test('deactivating a service hides it from booking but keeps old appointments', async ({
    page,
  }) => {
    const booked = await findFutureReservationOfService('blow-dry')
    await page.getByRole('button', { name: 'Waschen & Föhnen / Piega bearbeiten' }).click()
    const form = editor(page, 'Leistung bearbeiten')
    await form.getByLabel('Online buchbar').uncheck()
    await form.getByRole('button', { name: 'Speichern' }).click()
    await expect(page.getByRole('status')).toHaveText('Gespeichert.')
    await expect(page.getByText('Nicht online buchbar')).toBeVisible()

    await expect.poll(async () => (await getService('blow-dry'))?.active).toBe(false)

    await page.goto('/')
    await expect(
      page.getByRole('region', { name: 'Leistungen und Preise' }).getByText('Waschen & Föhnen'),
    ).toHaveCount(0)

    await page.goto('/book')
    await expect(page.locator('[aria-labelledby="step-service"]')).not.toContainText(
      'Waschen & Föhnen',
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
