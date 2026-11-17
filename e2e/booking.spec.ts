import { expect, test } from '@playwright/test'

import { selectServiceDateAndTime } from './bookingHelpers'

test.describe('customer booking @smoke', () => {
  test('customer books without account and can cancel via manage link', async ({ page }) => {
    await page.goto('/book')

    await selectServiceDateAndTime(page)

    await page.getByLabel('Vorname').fill('Erika')
    await page.getByLabel('Nachname').fill('Muster')
    await page.getByLabel('Telefon').fill('0660 9999999')
    await page.getByLabel('E-Mail-Adresse').fill('erika@example.com')
    await page.getByLabel(/Notizen/).fill('Bitte Spitzen schneiden')
    await page.getByLabel(/Datenschutzhinweise/).check()
    await page.getByRole('button', { name: 'Termin verbindlich anfragen' }).click()

    await expect(page).toHaveURL(/\/booking\/confirmed/)
    await expect(
      page.getByRole('heading', { name: /Termin bestätigt|Anfrage eingegangen/ }),
    ).toBeVisible()
    await expect(page.getByRole('button', { name: 'Termin verwalten' })).toBeVisible()

    await page.getByRole('button', { name: 'Termin verwalten' }).click()
    await expect(page).toHaveURL(/\/manage\//)
    await expect(page.getByRole('heading', { name: 'Termin verwalten' })).toBeVisible()
    await expect(page.getByText('Erika Muster')).toBeVisible()

    await page.getByRole('button', { name: 'Stornieren' }).click()
    await expect(page.getByText('Status: Storniert')).toBeVisible({ timeout: 15_000 })
  })
})
