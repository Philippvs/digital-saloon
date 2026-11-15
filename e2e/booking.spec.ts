import { expect, test, type Page } from '@playwright/test'

async function pickFirstAvailableSlot(page: Page): Promise<void> {
  const dateButtons = page.locator('button').filter({ hasText: /\d{2}\.\d{2}\.\d{4}/ })
  const dateCount = await dateButtons.count()
  expect(dateCount).toBeGreaterThan(0)

  for (let index = 0; index < dateCount; index += 1) {
    await dateButtons.nth(index).click()
    const empty = page.getByText('Keine freien Termine an diesem Tag.')
    const slotButton = page.getByRole('button', { name: /^\d{2}:\d{2}$/ }).first()
    try {
      await expect(slotButton).toBeVisible({ timeout: 8_000 })
      await slotButton.click()
      return
    } catch {
      if (await empty.isVisible().catch(() => false)) continue
    }
  }

  throw new Error('No available slot found in the next 14 days')
}

test.describe('customer booking @smoke', () => {
  test('customer books without account and can cancel via manage link', async ({ page }) => {
    await page.goto('/')
    await page.getByRole('button', { name: 'Termin buchen' }).click()
    await expect(page).toHaveURL(/\/book$/)

    await page.getByRole('button', { name: 'Auswählen' }).first().click()
    await expect(page).toHaveURL(/\/book\/slots/)

    await pickFirstAvailableSlot(page)
    await expect(page).toHaveURL(/\/book\/checkout/)

    await page.getByLabel('Vorname').fill('Erika')
    await page.getByLabel('Nachname').fill('Muster')
    await page.getByLabel('Telefon').fill('+43 660 9999999')
    await page.getByLabel('E-Mail (optional)').fill('erika@example.com')
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
    await expect(page.getByText('Status: CANCELLED')).toBeVisible({ timeout: 15_000 })
  })
})
