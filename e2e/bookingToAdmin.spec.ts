import { expect, test } from '@playwright/test'

import { selectServiceDateAndTime } from './bookingHelpers'
import { findReservationByLastName } from './firestoreAdmin'
import { signInAsDemo } from './helpers'

test.describe('customer booking reaches the salon @smoke', () => {
  test('a new online booking appears in the admin week planner and list', async ({ page }) => {
    const lastName = `E2E${Date.now().toString().slice(-6)}`

    await page.goto('/')
    await page
      .getByRole('region', { name: 'Leistungen und Preise' })
      .getByRole('button')
      .first()
      .click()
    await expect(page).toHaveURL(/\/book\?.*serviceId=/)
    await selectServiceDateAndTime(page)

    await page.getByLabel('Vorname').fill('Neue')
    await page.getByLabel('Nachname').fill(lastName)
    await page.getByLabel('Telefon').fill('+39 333 1234567')
    await page.getByLabel('E-Mail-Adresse').fill('neue@example.com')
    await page.getByLabel(/Datenschutzhinweise/).check()
    await page.getByRole('button', { name: 'Termin verbindlich anfragen' }).click()
    await expect(page).toHaveURL(/\/booking\/confirmed/)

    const booked = await findReservationByLastName(lastName)
    await signInAsDemo(page)
    await page.goto(`/admin?week=${booked.startAt.slice(0, 10)}`)
    await expect(
      page
        .getByRole('region', { name: 'Wochenkalender' })
        .getByRole('button', { name: new RegExp(`Neue ${lastName}`) }),
    ).toBeVisible()

    await page.goto('/admin/reservations')
    await expect(page.getByRole('row').filter({ hasText: `Neue ${lastName}` })).toBeVisible()
  })
})
