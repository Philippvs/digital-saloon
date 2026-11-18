import { expect, test } from '@playwright/test'

import { selectServiceDateAndTime } from './bookingHelpers'

test.describe('my bookings @smoke', () => {
  test('confirmed booking is saved locally and listed under Meine Termine', async ({ page }) => {
    await page.goto('/book')
    await selectServiceDateAndTime(page)

    await page.getByLabel('Vorname').fill('Lokal')
    await page.getByLabel('Nachname').fill('Buchung')
    await page.getByLabel('Telefon').fill('+43 660 7777777')
    await page.getByLabel('E-Mail-Adresse').fill('lokal@example.com')
    await page.getByLabel(/Datenschutzhinweise/).check()
    await page.getByRole('button', { name: 'Termin verbindlich anfragen' }).click()

    await expect(page).toHaveURL(/\/booking\/confirmed/)
    await expect(
      page.getByRole('heading', { name: /Termin bestätigt|Anfrage eingegangen/ }),
    ).toBeVisible()
    await expect(page.getByRole('button', { name: 'Termin verwalten' })).toBeVisible()

    await expect(
      page.getByRole('banner').getByRole('button', { name: 'Meine Termine' }),
    ).toHaveCount(0)
    await page.getByRole('main').getByRole('button', { name: 'Meine Termine' }).click()
    await expect(page).toHaveURL(/\/my-bookings/)
    await expect(page.getByRole('heading', { name: 'Meine Termine' })).toBeVisible()
    await expect(page.getByRole('button', { name: 'Termin öffnen' }).first()).toBeVisible({
      timeout: 15_000,
    })
  })
})
