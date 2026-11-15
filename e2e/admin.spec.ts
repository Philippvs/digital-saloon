import { expect, test } from '@playwright/test'

import { signInAsDemo } from './helpers'

test.describe('admin calendar @smoke', () => {
  test('admin can open calendar and confirm a pending seed reservation', async ({ page }) => {
    await signInAsDemo(page)

    await page.getByRole('banner').getByRole('button', { name: 'Admin' }).click()
    await expect(page).toHaveURL(/\/admin/)
    await page.getByRole('button', { name: 'Kalender' }).click()
    await expect(page).toHaveURL(/\/admin\/calendar/)

    await page.goto('/admin/calendar?view=day&date=2026-04-08')
    await expect(page.getByRole('heading', { name: 'Kalender' })).toBeVisible()
    await expect(page.getByText('Max Mustermann')).toBeVisible({ timeout: 15_000 })

    await page.getByText('Max Mustermann').click()
    await expect(page).toHaveURL(/\/admin\/reservations\//)
    await expect(page.getByRole('heading', { name: 'Termin-Details' })).toBeVisible()
    await expect(page.getByText('Ausstehend')).toBeVisible()

    await page.getByRole('button', { name: 'Bestätigen' }).click()
    await expect(page.getByText('Bestätigt')).toBeVisible({ timeout: 15_000 })
  })

  test('admin can create a manual reservation', async ({ page }) => {
    await signInAsDemo(page)
    await page.goto('/admin/manual')

    await page.getByLabel('Leistung').click()
    await page.getByRole('option', { name: /Haircut$/ }).click()

    const dateButtons = page.locator('button').filter({ hasText: /\d{2}\.\d{2}\.\d{4}/ })
    const dateCount = await dateButtons.count()
    expect(dateCount).toBeGreaterThan(0)

    let booked = false
    for (let index = 0; index < dateCount; index += 1) {
      await dateButtons.nth(index).click()
      const slot = page.getByRole('button', { name: /^\d{2}:\d{2}$/ }).first()
      try {
        await expect(slot).toBeVisible({ timeout: 8_000 })
        await slot.click()
        booked = true
        break
      } catch {
        // try next day
      }
    }
    expect(booked).toBe(true)

    await page.getByLabel('Vorname').fill('Telefon')
    await page.getByLabel('Nachname').fill('Kunde')
    await page.getByLabel('Telefon').fill('+43 660 5555555')
    await page.getByRole('button', { name: 'Termin anlegen' }).click()

    await expect(page).toHaveURL(/\/admin\/reservations\//)
    await expect(page.getByText('Telefon Kunde')).toBeVisible()
    await expect(page.getByText('Bestätigt')).toBeVisible()
  })
})
