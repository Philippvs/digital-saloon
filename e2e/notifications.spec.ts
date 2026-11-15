import { expect, test, type Page } from '@playwright/test'

import { getReservationStatus, listNotificationJobs } from './firestoreAdmin'
import { signInAsDemo } from './helpers'

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

test.describe('notifications & expiry @smoke', () => {
  test('booking with email enqueues a notification job that can be processed', async ({ page }) => {
    const before = await listNotificationJobs()

    await page.goto('/')
    await page.getByRole('button', { name: 'Termin buchen' }).click()
    await page.getByRole('button', { name: 'Auswählen' }).first().click()
    await pickFirstAvailableSlot(page)

    await page.getByLabel('Vorname').fill('Mail')
    await page.getByLabel('Nachname').fill('Kunde')
    await page.getByLabel('Telefon').fill('+43 660 4444444')
    await page.getByLabel('E-Mail (optional)').fill('mail.kunde@example.com')
    await page.getByLabel(/Datenschutzhinweise/).check()
    await page.getByRole('button', { name: 'Termin verbindlich anfragen' }).click()
    await expect(page).toHaveURL(/\/booking\/confirmed/)

    await expect
      .poll(async () => (await listNotificationJobs()).length, { timeout: 15_000 })
      .toBeGreaterThan(before.length)

    const jobs = await listNotificationJobs()
    const created = jobs.find(
      (job) =>
        job.toEmail === 'mail.kunde@example.com' &&
        (job.type === 'RESERVATION_CREATED' || job.type === 'RESERVATION_CONFIRMED'),
    )
    expect(created).toBeTruthy()
    expect(created?.status).toBe('PENDING')

    await signInAsDemo(page)
    await page.goto('/admin')
    await page.getByRole('button', { name: 'Benachrichtigungen verarbeiten' }).click()
    await expect(page.getByText(/Benachrichtigungen:/)).toBeVisible({ timeout: 15_000 })

    await expect
      .poll(async () => {
        const after = await listNotificationJobs()
        return after.find((job) => job.id === created?.id)?.status
      })
      .toBe('SENT')
  })

  test('pending expiration marks stale seed reservation as EXPIRED', async ({ page }) => {
    expect(await getReservationStatus('demo-stale-pending')).toBe('PENDING')

    await signInAsDemo(page)
    await page.goto('/admin')
    await page.getByRole('button', { name: 'Ausstehende Anfragen ablaufen lassen' }).click()
    await expect(page.getByText(/Ablauf:/)).toBeVisible({ timeout: 15_000 })

    await expect
      .poll(async () => getReservationStatus('demo-stale-pending'), { timeout: 15_000 })
      .toBe('EXPIRED')

    const jobs = await listNotificationJobs()
    const expiredJob = jobs.find(
      (job) => job.type === 'RESERVATION_EXPIRED' && job.toEmail === 'stale@example.com',
    )
    expect(expiredJob).toBeTruthy()
  })
})
