import { expect, type Page } from '@playwright/test'

export const demoAccount = {
  email: 'admin@salonflow.local',
  password: 'password123',
} as const

export async function signInAsDemo(page: Page): Promise<void> {
  await page.goto('/login')
  await expect(page.getByRole('heading', { name: 'Sign in' })).toBeVisible()

  await page.getByLabel('Email').fill(demoAccount.email)
  await page.getByLabel('Password').fill(demoAccount.password)
  await page.locator('form').getByRole('button', { name: 'Sign in' }).click()

  await expect(page.getByRole('heading', { level: 1 })).toBeVisible()
  await expect(page.getByRole('banner').getByRole('button', { name: 'Admin' })).toBeVisible()
}
