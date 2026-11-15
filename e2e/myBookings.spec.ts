import { expect, test, type Page } from '@playwright/test'

async function pickFirstAvailableSlot(page: Page): Promise<void> {
  const dateButtons = page.locator('button').filter({ hasText: /\d{2}\.\d{2}\.\d{4}/ })
  const dateCount = await dateButtons.count()
  expect(dateCount).toBeGreaterThan(0)

  for (let index = 0; index < dateCount; index += 1) {
    await dateButtons.nth(index).click()
    const slotButton = page.getByRole('button', { name: /^\d{2}:\d{2}$/ }).first()
    try {
      await expect(slotButton).toBeVisible({ timeout: 8_000 })
      await slotButton.click()
      return
    } catch {
      // try next day
    }
  }

  throw new Error('No available slot found')
}

test.describe('my bookings @smoke', () => {
  test('confirmed booking is saved locally and listed under Meine Termine', async ({ page }) => {
    await page.goto('/')
    await page.getByRole('button', { name: 'Termin buchen' }).click()
    await page.getByRole('button', { name: 'Auswählen' }).first().click()
    await pickFirstAvailableSlot(page)

    await page.getByLabel('Vorname').fill('Lokal')
    await page.getByLabel('Nachname').fill('Buchung')
    await page.getByLabel('Telefon').fill('+43 660 7777777')
    await page.getByLabel(/Datenschutzhinweise/).check()
    await page.getByRole('button', { name: 'Termin verbindlich anfragen' }).click()

    await expect(page).toHaveURL(/\/booking\/confirmed/)
    await expect(
      page.getByRole('heading', { name: /Verwaltungs-Link|Ihr Verwaltungs-Link/ }),
    ).toBeVisible()
    await expect(page.getByRole('button', { name: 'Link kopieren' })).toBeVisible()

    await page.getByRole('banner').getByRole('button', { name: 'Meine Termine' }).click()
    await expect(page).toHaveURL(/\/my-bookings/)
    await expect(page.getByRole('heading', { name: 'Meine Termine' })).toBeVisible()
    await expect(
      page.getByText('Lokal').or(page.getByText(/Haircut|Blow Dry|Färben|Bart/)),
    ).toBeVisible({
      timeout: 15_000,
    })
    await expect(page.getByRole('button', { name: 'Termin öffnen' }).first()).toBeVisible()
  })
})
