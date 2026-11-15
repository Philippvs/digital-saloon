import { expect, test } from '@playwright/test'

import { demoAccount, signInAsDemo } from './helpers'

test.describe('smoke @smoke', () => {
  test('home page loads against emulators', async ({ page }) => {
    await page.goto('/')

    await expect(page.getByRole('heading', { level: 1 })).toBeVisible()
    await expect(page.getByRole('button', { name: 'Termin buchen' })).toBeVisible()
    await expect(page.getByText('Lokale Firebase-Emulatoren aktiv.')).toBeVisible()
    await expect(page.getByRole('button', { name: 'Admin Login' })).toBeVisible()
  })

  test('demo user can sign in and sign out', async ({ page }) => {
    await signInAsDemo(page)

    await page.getByRole('button', { name: 'Abmelden' }).click()
    await expect(
      page.getByRole('banner').getByRole('button', { name: 'Admin Login' }),
    ).toBeVisible()
  })

  test('navigation from header to admin login works', async ({ page }) => {
    await page.goto('/')
    await page.getByRole('banner').getByRole('button', { name: 'Admin Login' }).click()

    await expect(page).toHaveURL(/\/login/)
    await expect(page.getByRole('heading', { name: 'Sign in' })).toBeVisible()
    await expect(page.getByLabel('Email')).toHaveValue(demoAccount.email)
  })

  test('customer can open booking from home', async ({ page }) => {
    await page.goto('/')
    await page.getByRole('button', { name: 'Termin buchen' }).click()
    await expect(page).toHaveURL(/\/book/)
    await expect(page.getByRole('heading', { name: 'Termin buchen' })).toBeVisible()
  })
})
