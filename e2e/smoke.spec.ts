import { expect, test } from '@playwright/test'

import { demoAccount, signInAsDemo } from './helpers'

test.describe('smoke @smoke', () => {
  test('home shows the salon and leads to the booking wizard', async ({ page }) => {
    await page.goto('/')
    await expect(page.getByRole('heading', { level: 1, name: /KIMM Hair/ })).toBeVisible()
    await expect(page.getByRole('heading', { name: 'Öffnungszeiten' })).toBeVisible()
    await expect(page.getByText('Via Piave 71, 39012 Meran').first()).toBeVisible()

    await page.getByRole('button', { name: /^Herrenhaarschnitt/ }).click()
    await expect(page).toHaveURL(/\/book\?.*serviceId=haircut/)
    await expect(page.getByRole('heading', { name: /Datum wählen/ })).toBeVisible()

    await page.goto('/')
    await page.getByRole('button', { name: 'Termin online buchen' }).click()
    await expect(page).toHaveURL(/\/book/)
    await expect(page.getByRole('heading', { name: 'Termin buchen' })).toBeVisible()
    await expect(page.getByText(/Ohne Kundenkonto/)).toBeVisible()
    await expect(
      page.getByRole('contentinfo').getByRole('button', { name: 'Login für das Team' }),
    ).toBeVisible()
  })

  test('demo admin can sign in and sign out', async ({ page }) => {
    await signInAsDemo(page)

    await page.getByRole('button', { name: 'Abmelden' }).click()
    await expect(page.getByRole('button', { name: 'Abmelden' })).toHaveCount(0)
    await expect(
      page.getByRole('contentinfo').getByRole('button', { name: 'Login für das Team' }),
    ).toBeVisible()
  })

  test('team login lives in the footer, not in the customer header', async ({ page }) => {
    await page.goto('/book')
    await expect(page.getByRole('banner').getByRole('button', { name: /Login|Admin/ })).toHaveCount(
      0,
    )
    await page.getByRole('contentinfo').getByRole('button', { name: 'Login für das Team' }).click()

    await expect(page).toHaveURL(/\/login/)
    await expect(page.getByRole('heading', { name: /Admin-Anmeldung|Accesso admin/ })).toBeVisible()
    await expect(page.getByLabel(/E-Mail|E-mail/)).toHaveValue(demoAccount.email)
  })

  test('language can switch to Italian', async ({ page }) => {
    await page.goto('/book')
    const languages = page.getByRole('banner').getByRole('group', { name: 'Sprache' })
    await expect(languages.getByRole('button', { name: 'Deutsch' })).toHaveAttribute(
      'aria-pressed',
      'true',
    )
    await languages.getByRole('button', { name: 'Italiano' }).click()
    await expect(
      page.getByRole('banner').getByRole('group', { name: 'Lingua' }).getByRole('button', {
        name: 'Italiano',
      }),
    ).toHaveAttribute('aria-pressed', 'true')
    await expect(page.getByRole('heading', { name: 'Prenota un appuntamento' })).toBeVisible()
    await expect(page.getByRole('banner').getByRole('button', { name: 'Prenota' })).toBeVisible()
    await expect(
      page.getByRole('contentinfo').getByRole('button', { name: 'Privacy' }),
    ).toBeVisible()
  })

  test('customer opens booking without signing in', async ({ page }) => {
    await page.goto('/book')
    await expect(page.getByRole('heading', { name: 'Termin buchen' })).toBeVisible()
    await expect(page.locator('[aria-labelledby="step-service"] button').first()).toBeVisible()
  })
})
