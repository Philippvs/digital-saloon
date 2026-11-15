import { expect, test } from '@playwright/test'

import { demoAccount, signInAsDemo } from './helpers'

test.describe('smoke @smoke', () => {
  test('home page loads against emulators', async ({ page }) => {
    await page.goto('/')

    await expect(page.getByRole('heading', { name: 'React Firebase Template' })).toBeVisible()
    await expect(page.getByText('Connected to local Firebase emulators.')).toBeVisible()
    await expect(page.getByText('Template is ready.')).toBeVisible()
    await expect(page.getByText('Not signed in')).toBeVisible()
  })

  test('demo user can sign in and sign out', async ({ page }) => {
    await signInAsDemo(page)

    await page.getByRole('button', { name: 'Sign out' }).click()
    await expect(page.getByText('Not signed in')).toBeVisible()
    await expect(page.getByRole('banner').getByRole('button', { name: 'Sign in' })).toBeVisible()
  })

  test('navigation from home to login works via callback routing', async ({ page }) => {
    await page.goto('/')
    await page.getByRole('button', { name: 'Go to sign in' }).click()

    await expect(page).toHaveURL(/\/login/)
    await expect(page.getByRole('heading', { name: 'Sign in' })).toBeVisible()
    await expect(page.getByLabel('Email')).toHaveValue(demoAccount.email)
  })
})
