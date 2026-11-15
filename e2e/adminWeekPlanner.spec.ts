import { expect, test, type Page } from '@playwright/test'

import { formatViennaDateTime } from '../src/data/dateFormat'
import { addCalendarDays, plannerDefaultWeek, weekHeading } from './calendarDates'
import { findFutureDemoReservation, getReservationStatus } from './firestoreAdmin'
import { signInAsDemo } from './helpers'

function planner(page: Page) {
  return page.getByRole('region', { name: 'Wochenkalender' })
}

function plannerEntries(page: Page) {
  return planner(page).getByRole('button', { name: /^\d{2}:\d{2}–\d{2}:\d{2}, / })
}

function addSlots(page: Page) {
  return planner(page).getByRole('button', { name: /^Termin eintragen am / })
}

test.describe('admin week planner @smoke', () => {
  test.beforeEach(async ({ page }) => {
    await signInAsDemo(page)
  })

  test('opens on a filled week with daily and weekly totals', async ({ page }) => {
    const weekStart = plannerDefaultWeek()
    await page.goto('/admin')

    await expect(
      page.getByRole('heading', { level: 1, name: weekHeading(weekStart) }),
    ).toBeVisible()
    await expect(page.getByRole('button', { name: 'Diese Woche' })).toBeDisabled()
    await expect.poll(async () => plannerEntries(page).count()).toBeGreaterThan(5)

    const totals = page.getByRole('definition').first()
    await expect(page.locator('dt', { hasText: 'Termine' })).toBeVisible()
    await expect(page.locator('dt', { hasText: 'Gebuchte Zeit' })).toBeVisible()
    await expect(page.locator('dt', { hasText: 'Umsatz' })).toBeVisible()
    await expect(totals).not.toHaveText('0')

    await expect(planner(page).getByText('Geschlossen').first()).toBeVisible()
    await expect(
      planner(page)
        .getByText(/^\d+ Termine?, \d/)
        .first(),
    ).toBeVisible()
  })

  test('moves between weeks and keeps showing appointments', async ({ page }) => {
    const weekStart = plannerDefaultWeek()
    await page.goto('/admin')
    await expect(plannerEntries(page).first()).toBeVisible()

    await page.getByRole('button', { name: 'Nächste Woche' }).click()
    await expect(page).toHaveURL(new RegExp(`week=${addCalendarDays(weekStart, 7)}`))
    await expect(
      page.getByRole('heading', { level: 1, name: weekHeading(addCalendarDays(weekStart, 7)) }),
    ).toBeVisible()
    await expect(plannerEntries(page).first()).toBeVisible()

    await page.getByRole('button', { name: 'Vorherige Woche' }).click()
    await page.getByRole('button', { name: 'Vorherige Woche' }).click()
    await expect(page).toHaveURL(new RegExp(`week=${addCalendarDays(weekStart, -7)}`))
    await expect(
      planner(page)
        .getByRole('button', { name: /, Erledigt$/ })
        .first(),
    ).toBeVisible()

    await page.getByRole('button', { name: 'Diese Woche' }).click()
    await expect(page).not.toHaveURL(/week=/)
    await expect(
      page.getByRole('heading', { level: 1, name: weekHeading(weekStart) }),
    ).toBeVisible()
  })

  test('shows open requests in the grid and opens an appointment', async ({ page }) => {
    const pending = await findFutureDemoReservation('PENDING')
    await page.goto(`/admin?week=${pending.startAt.slice(0, 10)}`)

    const entry = planner(page).getByRole('button', {
      name: new RegExp(`${pending.firstName} ${pending.lastName}, .*, Ausstehend$`),
    })
    await expect(entry.first()).toBeVisible()
    await entry.first().click()

    await expect(page).toHaveURL(/\/admin\/reservations\//)
    await expect(page.getByRole('heading', { name: 'Termin-Details' })).toBeVisible()
    await expect(page.getByText('Ausstehend')).toBeVisible()
  })

  test('enters an appointment by clicking a free time', async ({ page }) => {
    const weekStart = addCalendarDays(plannerDefaultWeek(), 7)
    const lastName = `Raster${Date.now().toString().slice(-6)}`
    await page.goto(`/admin?week=${weekStart}`)

    const slot = addSlots(page).first()
    await expect(slot).toBeAttached()
    const label = (await slot.getAttribute('aria-label')) ?? ''
    const time = /um (\d{2}:\d{2})$/.exec(label)?.[1]
    expect(time).toBeTruthy()
    await slot.click()

    await expect(page).toHaveURL(new RegExp(`/admin/manual\\?.*time=${time?.replace(':', '%3A')}`))
    await page.getByLabel('Leistung').click()
    await page.getByRole('option', { name: /^Herrenschnitt/ }).click()
    await expect(page.getByRole('button', { name: time, exact: true })).toHaveClass(
      /MuiButton-contained/,
    )

    await page.getByLabel('Vorname').fill('Raster')
    await page.getByLabel('Nachname').fill(lastName)
    await page.getByLabel('Telefon').fill('+39 333 1112222')
    await page.getByRole('button', { name: 'Termin anlegen' }).click()
    await expect(page).toHaveURL(/\/admin\/reservations\//)

    await page.goto(`/admin?week=${weekStart}`)
    await expect(
      planner(page).getByRole('button', {
        name: new RegExp(`^${time}–\\d{2}:\\d{2}, Raster ${lastName}, Herrenschnitt`),
      }),
    ).toBeVisible()
  })

  test('confirms an open request from the list next to the calendar', async ({ page }) => {
    await page.goto('/admin')
    const pending = await findFutureDemoReservation('PENDING')
    const requests = page.getByRole('region', { name: 'Offene Anfragen' })
    const request = requests
      .getByRole('listitem')
      .filter({ hasText: `${pending.firstName} ${pending.lastName}` })
      .filter({ hasText: formatViennaDateTime(pending.startAt) })
    await expect(request).toHaveCount(1)

    await request.getByRole('button', { name: 'Bestätigen' }).click()

    await expect(request).toHaveCount(0)
    await expect
      .poll(async () => getReservationStatus(pending.id), { timeout: 15_000 })
      .toBe('CONFIRMED')
  })

  test('links to every admin area', async ({ page }) => {
    const destinations: Array<[string, RegExp]> = [
      ['Alle Termine', /\/admin\/reservations$/],
      ['Leistungen', /\/admin\/services$/],
      ['Einstellungen', /\/admin\/settings$/],
      ['Termin eintragen', /\/admin\/manual/],
    ]
    for (const [name, url] of destinations) {
      await page.goto('/admin')
      await page.getByRole('main').getByRole('button', { name, exact: true }).click()
      await expect(page).toHaveURL(url)
    }
  })

  test('old calendar links open the matching week', async ({ page }) => {
    await page.goto('/admin/calendar?view=day&date=2026-04-08')
    await expect(page).toHaveURL(/\/admin\?week=2026-04-06$/)
    await expect(
      page.getByRole('heading', { level: 1, name: weekHeading('2026-04-06') }),
    ).toBeVisible()
  })
})
