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
    await expect(page).toHaveURL(new RegExp(`week=${weekStart}`))
    await expect(
      page.getByRole('heading', { level: 1, name: weekHeading(weekStart) }),
    ).toBeVisible()
  })

  test('keeps the selected week in the URL across reload and back from details', async ({
    page,
  }) => {
    const weekStart = addCalendarDays(plannerDefaultWeek(), 7)
    await page.goto(`/admin?week=${weekStart}`)
    await expect(
      page.getByRole('heading', { level: 1, name: weekHeading(weekStart) }),
    ).toBeVisible()

    await page.reload()
    await expect(page).toHaveURL(new RegExp(`week=${weekStart}`))
    await expect(
      page.getByRole('heading', { level: 1, name: weekHeading(weekStart) }),
    ).toBeVisible()

    const entry = plannerEntries(page).first()
    await expect(entry).toBeVisible()
    await entry.click()
    await page.getByRole('menuitem', { name: 'Details anzeigen' }).click()
    await expect(page).toHaveURL(new RegExp(`/admin/reservations/.*week=${weekStart}`))

    await page.getByRole('button', { name: 'Zurück zum Kalender' }).click()
    await expect(page).toHaveURL(new RegExp(`week=${weekStart}`))
    await expect(
      page.getByRole('heading', { level: 1, name: weekHeading(weekStart) }),
    ).toBeVisible()
  })

  test('shows open requests in the grid and opens details via quick menu', async ({ page }) => {
    const pending = await findFutureDemoReservation('PENDING')
    await page.goto(`/admin?week=${pending.startAt.slice(0, 10)}`)

    const entry = planner(page).getByRole('button', {
      name: new RegExp(`${pending.firstName} ${pending.lastName}, .*, Ausstehend$`),
    })
    await expect(entry.first()).toBeVisible()
    await entry.first().click()

    const menu = page.getByRole('menu')
    await expect(menu.getByRole('menuitem', { name: 'Details anzeigen' })).toBeVisible()
    await expect(menu.getByRole('menuitem', { name: 'Umbuchen' })).toBeVisible()
    await expect(menu.getByRole('menuitem', { name: /Stornieren/ })).toHaveCount(0)

    await menu.getByRole('menuitem', { name: 'Details anzeigen' }).click()
    await expect(page).toHaveURL(/\/admin\/reservations\//)
    await expect(page.getByRole('heading', { name: 'Termin-Details' })).toBeVisible()
    await expect(page.getByText('Ausstehend')).toBeVisible()
  })

  test('opens edit form from calendar quick menu and saves customer changes', async ({ page }) => {
    const confirmed = await findFutureDemoReservation('CONFIRMED')
    const newLastName = `Umbuch${Date.now().toString().slice(-5)}`
    await page.goto(`/admin?week=${confirmed.startAt.slice(0, 10)}`)

    const entry = planner(page).getByRole('button', {
      name: new RegExp(`${confirmed.firstName} ${confirmed.lastName}, .*, Bestätigt$`),
    })
    await expect(entry.first()).toBeVisible()
    await entry.first().click()
    await page.getByRole('menuitem', { name: 'Umbuchen' }).click()

    await expect(page).toHaveURL(new RegExp(`/admin/manual\\?.*reservationId=${confirmed.id}`))
    await expect(page.getByRole('heading', { name: 'Termin bearbeiten' })).toBeVisible()
    await expect(page.getByLabel('Vorname')).toHaveValue(confirmed.firstName)
    await expect(page.getByLabel('Nachname')).toHaveValue(confirmed.lastName)

    await page.getByLabel('Nachname').fill(newLastName)
    await page.getByRole('button', { name: 'Änderungen speichern' }).click()

    await expect(page).toHaveURL(new RegExp(`/admin/reservations/${confirmed.id}`))
    await expect(page.getByText(`${confirmed.firstName} ${newLastName}`)).toBeVisible()
    await expect(page.getByText('Bestätigt')).toBeVisible()
  })

  test('cancel from details requires MUI dialog confirmation', async ({ page }) => {
    const confirmed = await findFutureDemoReservation('CONFIRMED')
    await page.goto(`/admin/reservations/${confirmed.id}`)
    await expect(page.getByRole('heading', { name: 'Termin-Details' })).toBeVisible()

    await page.getByRole('button', { name: 'Stornieren' }).click()
    const dialog = page.getByRole('dialog')
    await expect(dialog.getByRole('heading', { name: 'Termin stornieren?' })).toBeVisible()

    await dialog.getByRole('button', { name: 'Abbrechen' }).click()
    await expect(dialog).toHaveCount(0)
    await expect
      .poll(async () => getReservationStatus(confirmed.id), { timeout: 10_000 })
      .toBe('CONFIRMED')

    await page.getByRole('button', { name: 'Stornieren' }).click()
    await page.getByRole('dialog').getByRole('button', { name: 'Ja, stornieren' }).click()
    await expect
      .poll(async () => getReservationStatus(confirmed.id), { timeout: 15_000 })
      .toBe('CANCELLED')
    await expect(page.getByText('Storniert')).toBeVisible()
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
    await page.getByRole('button', { name: /^Herrenhaarschnitt/ }).click()
    await expect(page.getByRole('button', { name: new RegExp(`^${time}`) })).toHaveClass(
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
        name: new RegExp(`^${time}–\\d{2}:\\d{2}, Raster ${lastName}, Herrenhaarschnitt`),
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
    await page.goto('/admin')
    await page
      .getByRole('main')
      .getByRole('button', { name: 'Termin eintragen', exact: true })
      .click()
    await expect(page).toHaveURL(/\/admin\/manual/)

    await page.goto('/admin')
    const views = page.getByRole('group', { name: 'Ansicht' })
    await views.getByRole('button', { name: 'Liste' }).click()
    await expect(page).toHaveURL(/\/admin\/reservations\?week=/)
    await views.getByRole('button', { name: 'Woche' }).click()
    await expect(page).toHaveURL(/\/admin\?week=/)

    await page.getByRole('banner').getByRole('button', { name: 'Einstellungen' }).click()
    await expect(page).toHaveURL(/\/admin\/settings$/)
    const salon = page.getByRole('navigation', { name: 'Salon' })
    await salon.getByRole('button', { name: /^Leistungen/ }).click()
    await expect(page).toHaveURL(/\/admin\/services$/)
    await page.getByRole('button', { name: 'Zu den Einstellungen' }).click()
    await salon.getByRole('button', { name: /^Öffnungszeiten/ }).click()
    await expect(page).toHaveURL(/\/admin\/opening-hours$/)
    await page.getByRole('button', { name: 'Zu den Einstellungen' }).click()
    await expect(page).toHaveURL(/\/admin\/settings$/)
  })

  test('old calendar links open the matching week', async ({ page }) => {
    await page.goto('/admin/calendar?view=day&date=2026-04-08')
    await expect(page).toHaveURL(/\/admin\?week=2026-04-06$/)
    await expect(
      page.getByRole('heading', { level: 1, name: weekHeading('2026-04-06') }),
    ).toBeVisible()
  })
})
