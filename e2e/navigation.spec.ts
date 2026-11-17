import { expect, test } from '@playwright/test'

import { signInAsDemo } from './helpers'

test.describe('navigation @smoke', () => {
  test('customer header has no "Meine Termine" and the footer links the privacy policy', async ({
    page,
  }) => {
    await page.goto('/')
    await expect(
      page.getByRole('banner').getByRole('button', { name: 'Meine Termine' }),
    ).toHaveCount(0)

    await page.getByRole('contentinfo').getByRole('button', { name: 'Datenschutz' }).click()
    await expect(page).toHaveURL(/\/datenschutz$/)
    await expect(
      page.getByRole('heading', { level: 1, name: 'Datenschutzerklärung' }),
    ).toBeVisible()
    await expect(page.getByText('Via Piave 71, 39012 Meran').last()).toBeVisible()
  })

  test('admin is sent from customer pages to the calendar', async ({ page }) => {
    await signInAsDemo(page)

    await page.goto('/')
    await expect(page).toHaveURL(/\/admin$/)

    await page.goto('/book')
    await expect(page).toHaveURL(/\/admin$/)

    await page.goto('/admin/settings')
    await page
      .getByRole('banner')
      .getByRole('button', { name: /KIMM Hair|Salon 1500/ })
      .click()
    await expect(page).toHaveURL(/\/admin$/)
    await expect(
      page.getByRole('banner').getByRole('button', { name: 'Termin buchen' }),
    ).toHaveCount(0)
  })

  test('admin header marks the current page', async ({ page }) => {
    await signInAsDemo(page)
    const header = page.getByRole('banner')

    await expect(header.getByRole('button', { name: 'Kalender' })).toHaveAttribute(
      'aria-current',
      'page',
    )
    await expect(header.getByRole('button', { name: 'Einstellungen' })).not.toHaveAttribute(
      'aria-current',
      'page',
    )

    await header.getByRole('button', { name: 'Einstellungen' }).click()
    await expect(page).toHaveURL(/\/admin\/settings$/)
    await expect(header.getByRole('button', { name: 'Einstellungen' })).toHaveAttribute(
      'aria-current',
      'page',
    )
    await expect(header.getByRole('button', { name: 'Kalender' })).not.toHaveAttribute(
      'aria-current',
      'page',
    )
  })
})
