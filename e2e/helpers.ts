import { expect, type Page } from '@playwright/test'

export const demoAccount = {
  email: 'admin@salonflow.local',
  password: 'password123',
} as const

export async function signInAsDemo(page: Page): Promise<void> {
  await page.goto('/login')
  await expect(page.getByRole('heading', { name: 'Admin-Anmeldung' })).toBeVisible()

  await page.getByLabel('E-Mail').fill(demoAccount.email)
  await page.getByLabel('Passwort').fill(demoAccount.password)
  await page.locator('form').getByRole('button', { name: 'Als Admin anmelden' }).click()

  await expect(page).toHaveURL(/\/admin/)
  await expect(page.getByRole('banner').getByRole('button', { name: 'Kalender' })).toBeVisible()
  await expect(page.getByRole('banner').getByRole('button', { name: 'Abmelden' })).toBeVisible()
}
