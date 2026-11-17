import { expect, test } from '@playwright/test'

import { getReservationStatus } from './firestoreAdmin'
import { signInAsDemo } from './helpers'

test.describe('pending expiry @smoke', () => {
  test('pending expiration marks stale seed reservation as EXPIRED', async ({ page }) => {
    expect(await getReservationStatus('demo-stale-pending')).toBe('PENDING')

    await signInAsDemo(page)
    await page.goto('/admin/settings')
    await page.getByRole('button', { name: 'Ausstehende Anfragen ablaufen lassen' }).click()
    await expect(page.getByText(/Ablauf:/)).toBeVisible({ timeout: 15_000 })

    await expect
      .poll(async () => getReservationStatus('demo-stale-pending'), { timeout: 15_000 })
      .toBe('EXPIRED')
  })
})
