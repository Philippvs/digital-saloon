import { expect, test } from '@playwright/test'

test.describe('salon home page @smoke', () => {
  test('shows prices, opening hours, and contact details', async ({ page }) => {
    await page.goto('/')

    await expect(page.getByRole('heading', { level: 1, name: /KIMM Hair/ })).toBeVisible()

    const prices = page.getByRole('region', { name: 'Leistungen und Preise' })
    await expect(prices.getByRole('button')).toHaveCount(19)
    await expect(prices.getByRole('button', { name: /^Herrenhaarschnitt.*22€/ })).toBeVisible()

    await expect(page.getByRole('heading', { name: 'Öffnungszeiten' })).toBeVisible()
    const hours = page.locator('dl').filter({ hasText: 'Montag' })
    await expect(hours.locator('dd').first()).toHaveText(/geschlossen/)
    await expect(hours).toContainText('08:00–12:00, 14:00–18:00')

    await expect(page.locator('address')).toContainText('Via Piave 71, 39012 Meran')
    await expect(
      page.getByRole('main').getByRole('link', { name: '+39 0473 449267', exact: true }),
    ).toHaveAttribute('href', 'tel:+390473449267')
    await expect(page.getByRole('link', { name: /Google Maps/ })).toHaveAttribute(
      'href',
      /google\.com\/maps.*Via%20Piave%2071/,
    )
    await expect(page.getByRole('contentinfo')).toContainText('01732550213')
  })

  test('header and hero buttons lead to booking', async ({ page }) => {
    await page.goto('/')
    await page.getByRole('banner').getByRole('button', { name: 'Termin buchen' }).click()
    await expect(page).toHaveURL(/\/book$/)

    await page
      .getByRole('banner')
      .getByRole('button', { name: /KIMM Hair/ })
      .click()
    await expect(page).toHaveURL(/\/$/)
    await page.getByRole('button', { name: 'Termin online buchen' }).click()
    await expect(page.getByRole('heading', { name: 'Termin buchen' })).toBeVisible()
  })

  test('home page is available in Italian', async ({ page }) => {
    await page.goto('/')
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

    await expect(page.getByRole('heading', { name: 'Servizi e prezzi' })).toBeVisible()
    await expect(
      page.getByRole('region', { name: 'Servizi e prezzi' }).getByRole('button', {
        name: /^Taglio uomo/,
      }),
    ).toBeVisible()
    await expect(page.getByRole('heading', { name: 'Orari di apertura' })).toBeVisible()
    await expect(page.getByRole('button', { name: 'Prenota online' })).toBeVisible()
  })

  test('works on a phone-sized screen', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 })
    await page.goto('/')
    await expect(page.getByRole('heading', { level: 1, name: /KIMM Hair/ })).toBeVisible()
    await expect(page.getByRole('button', { name: 'Termin online buchen' })).toBeInViewport()
    const overflow = await page.evaluate(
      () => document.documentElement.scrollWidth > window.innerWidth,
    )
    expect(overflow).toBe(false)

    const header = page.getByRole('banner')
    const headerBox = await header.boundingBox()
    expect(headerBox?.height).toBeLessThanOrEqual(64)
    await expect(header.getByRole('button', { name: 'Termin buchen' })).toBeInViewport()
    await header.getByRole('button', { name: 'Meine Termine' }).click()
    await expect(page.getByRole('heading', { name: 'Meine Termine' })).toBeVisible()
  })
})
