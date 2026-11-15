import { expect, test } from '@playwright/test'

import { demoAccount, signInAsDemo } from './helpers'

test.describe('smoke @smoke', () => {
  test('home page loads against emulators', async ({ page }) => {
    await page.goto('/')

    await expect(page.getByRole('heading', { level: 1 })).toBeVisible()
    await expect(page.getByRole('button', { name: 'Termin buchen' })).toBeVisible()
    await expect(page.getByText('kein Kundenkonto nötig')).toBeVisible()
    await expect(page.getByText('Lokale Firebase-Emulatoren aktiv.')).toBeVisible()
    await expect(page.getByRole('banner').getByRole('button', { name: 'Admin' })).toBeVisible()
  })

  test('demo admin can sign in and sign out', async ({ page }) => {
    await signInAsDemo(page)

    await page.getByRole('button', { name: 'Abmelden' }).click()
    await expect(page.getByRole('banner').getByRole('button', { name: 'Admin' })).toBeVisible()
  })

  test('header admin login is for staff only', async ({ page }) => {
    await page.goto('/')
    await page.getByRole('banner').getByRole('button', { name: 'Admin' }).click()

    await expect(page).toHaveURL(/\/login/)
    await expect(page.getByRole('heading', { name: 'Admin-Anmeldung' })).toBeVisible()
    await expect(page.getByText(/Kunden buchen Termine ohne Login/)).toBeVisible()
    await expect(page.getByLabel('E-Mail')).toHaveValue(demoAccount.email)
  })

  test('customer can open booking from home without signing in', async ({ page }) => {
    await page.goto('/')
    await page.getByRole('button', { name: 'Termin buchen' }).click()
    await expect(page).toHaveURL(/\/book/)
    await expect(page.getByRole('heading', { name: 'Termin buchen' })).toBeVisible()
  })
})
