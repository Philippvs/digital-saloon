import type * as React from 'react'
import { useEffect } from 'react'
import { Outlet, createRoute, useNavigate } from '@tanstack/react-router'
import * as v from 'valibot'

import { useAuth } from '../auth/AuthProvider'
import { rangeForView, shiftAnchor, type CalendarView } from '../data/calendarRange'
import { todayYmdInTimeZone } from '../data/calendarMath'
import { upcomingViennaDates } from '../data/dateFormat'
import { optionalSearchParam } from '../data/schemas'
import { useAdminOps } from '../hooks/useAdminOps'
import { useAdminReservation } from '../hooks/useAdminReservation'
import { useAdminReservationActions, useAdminReservations } from '../hooks/useAdminReservations'
import { useAllServices } from '../hooks/useAllServices'
import { useAvailableSlots } from '../hooks/useAvailableSlots'
import { useBookingSettings } from '../hooks/useBookingSettings'
import { useOpeningHours } from '../hooks/useOpeningHours'
import { useSalon } from '../hooks/useSalon'
import { useUserProfile } from '../hooks/useUserProfile'
import { useLocale } from '../i18n'
import { AdminCalendarPage } from '../pages/admin/AdminCalendarPage'
import { AdminHomePage } from '../pages/admin/AdminHomePage'
import { AdminManualBookingPage } from '../pages/admin/AdminManualBookingPage'
import { AdminPlaceholderPage } from '../pages/admin/AdminPlaceholderPage'
import { AdminReservationDetailPage } from '../pages/admin/AdminReservationDetailPage'
import { AdminReservationsPage } from '../pages/admin/AdminReservationsPage'
import { AdminServicesPage } from '../pages/admin/AdminServicesPage'
import { AdminSettingsPage } from '../pages/admin/AdminSettingsPage'
import { rootRoute } from './root'

const AdminLayoutRoute: React.FunctionComponent = () => {
  const { user, isLoading: authLoading } = useAuth()
  const profile = useUserProfile(user?.uid ?? null)
  const navigate = useNavigate()

  useEffect(() => {
    if (!authLoading && user === null) {
      void navigate({ to: '/login', search: { redirect: '/admin' } })
    }
  }, [authLoading, user, navigate])

  const { t } = useLocale()

  if (authLoading || (user !== null && profile.isLoading)) {
    return <AdminPlaceholderPage title={t('admin.title')} description={t('admin.loading')} />
  }

  if (!user) {
    return <AdminPlaceholderPage title={t('admin.title')} description={t('admin.signInRequired')} />
  }

  if (profile.data?.role !== 'admin') {
    return <AdminPlaceholderPage title={t('admin.title')} description={t('admin.forbidden')} />
  }

  return <Outlet />
}

export const adminRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/admin',
  component: AdminLayoutRoute,
})

const AdminIndexRoute: React.FunctionComponent = () => {
  const salon = useSalon()
  const navigate = useNavigate()
  const ops = useAdminOps()
  const { t } = useLocale()

  const opsError =
    ops.processPending.error instanceof Error ? ops.processPending.error.message : null
  const opsMessage =
    ops.processPending.isSuccess && ops.processPending.data
      ? t('admin.expireResult', {
          expired: ops.processPending.data.expired,
          scanned: ops.processPending.data.scanned,
        })
      : null

  return (
    <AdminHomePage
      salonName={salon.data?.name ?? 'Salon'}
      opsBusy={ops.processPending.isPending}
      opsMessage={opsMessage}
      opsError={opsError}
      onCalendarClick={() => {
        void navigate({ to: '/admin/calendar', search: { view: 'week', date: undefined } })
      }}
      onServicesClick={() => {
        void navigate({ to: '/admin/services' })
      }}
      onSettingsClick={() => {
        void navigate({ to: '/admin/settings' })
      }}
      onProcessPendingClick={() => {
        ops.processPending.mutate()
      }}
    />
  )
}

export const adminIndexRoute = createRoute({
  getParentRoute: () => adminRoute,
  path: '/',
  component: AdminIndexRoute,
})

const calendarSearchSchema = v.object({
  view: v.optional(v.picklist(['day', 'week'] as const), 'week'),
  date: optionalSearchParam(v.pipe(v.string(), v.regex(/^\d{4}-\d{2}-\d{2}$/))),
})

export const adminCalendarRoute = createRoute({
  getParentRoute: () => adminRoute,
  path: '/calendar',
  validateSearch: (search: Record<string, unknown>) => v.parse(calendarSearchSchema, search),
  component: function AdminCalendarRoute() {
    const navigate = useNavigate()
    const salon = useSalon()
    const search = adminCalendarRoute.useSearch()
    const view = (search.view ?? 'week') as CalendarView
    const anchor = search.date ?? todayYmdInTimeZone(salon.data?.timezone ?? 'Europe/Vienna')
    const range = rangeForView(view, anchor)
    const reservations = useAdminReservations(range.startIso, range.endIso, true)

    return (
      <AdminCalendarPage
        view={view}
        anchorDateYmd={anchor}
        rangeLabel={`${range.labelStart} – ${range.labelEnd}`}
        reservations={reservations.data}
        isLoading={reservations.isLoading}
        isError={reservations.isError}
        onViewChange={(next) => {
          void navigate({ to: '/admin/calendar', search: { view: next, date: anchor } })
        }}
        onPrev={() => {
          void navigate({
            to: '/admin/calendar',
            search: { view, date: shiftAnchor(view, anchor, -1) },
          })
        }}
        onNext={() => {
          void navigate({
            to: '/admin/calendar',
            search: { view, date: shiftAnchor(view, anchor, 1) },
          })
        }}
        onToday={() => {
          void navigate({
            to: '/admin/calendar',
            search: {
              view,
              date: todayYmdInTimeZone(salon.data?.timezone ?? 'Europe/Vienna'),
            },
          })
        }}
        onSelectReservation={(reservationId) => {
          void navigate({
            to: '/admin/reservations/$reservationId',
            params: { reservationId },
          })
        }}
        onManualClick={() => {
          void navigate({ to: '/admin/manual' })
        }}
        onReservationsClick={() => {
          void navigate({ to: '/admin/reservations' })
        }}
      />
    )
  },
})

export const adminReservationsRoute = createRoute({
  getParentRoute: () => adminRoute,
  path: '/reservations',
  component: function AdminReservationsRoute() {
    const navigate = useNavigate()
    const salon = useSalon()
    const today = todayYmdInTimeZone(salon.data?.timezone ?? 'Europe/Vienna')
    const range = rangeForView('week', today)
    // Show a wider window for the list: 7 days back, 21 forward via week math
    const startIso = `${shiftAnchor('week', today, -1)}T00:00:00.000Z`
    const endIso = range.endIso
    const reservations = useAdminReservations(startIso, endIso, true)

    return (
      <AdminReservationsPage
        reservations={reservations.data}
        isLoading={reservations.isLoading}
        isError={reservations.isError}
        onSelectReservation={(reservationId) => {
          void navigate({
            to: '/admin/reservations/$reservationId',
            params: { reservationId },
          })
        }}
        onCalendarClick={() => {
          void navigate({ to: '/admin/calendar', search: { view: 'week', date: undefined } })
        }}
      />
    )
  },
})

export const adminReservationDetailRoute = createRoute({
  getParentRoute: () => adminRoute,
  path: '/reservations/$reservationId',
  component: function AdminReservationDetailRoute() {
    const navigate = useNavigate()
    const { reservationId } = adminReservationDetailRoute.useParams()
    const reservation = useAdminReservation(reservationId)
    const actions = useAdminReservationActions()

    const failed =
      actions.confirm.error ??
      actions.decline.error ??
      actions.cancel.error ??
      actions.complete.error
    const actionError =
      failed instanceof Error ? failed.message : failed ? 'Aktion fehlgeschlagen' : null

    return (
      <AdminReservationDetailPage
        reservation={reservation.data ?? undefined}
        isLoading={reservation.isLoading}
        actionError={actionError}
        busy={
          actions.confirm.isPending ||
          actions.decline.isPending ||
          actions.cancel.isPending ||
          actions.complete.isPending
        }
        onBackClick={() => {
          void navigate({ to: '/admin/calendar', search: { view: 'week', date: undefined } })
        }}
        onConfirm={() => {
          actions.confirm.mutate(reservationId)
        }}
        onDecline={() => {
          if (window.confirm('Termin wirklich ablehnen? Der Slot wird freigegeben.')) {
            actions.decline.mutate(reservationId)
          }
        }}
        onCancel={() => {
          if (window.confirm('Termin wirklich stornieren?')) {
            actions.cancel.mutate(reservationId)
          }
        }}
        onComplete={() => {
          actions.complete.mutate(reservationId)
        }}
      />
    )
  },
})

const manualSearchSchema = v.object({
  serviceId: optionalSearchParam(v.pipe(v.string(), v.minLength(1))),
  date: optionalSearchParam(v.pipe(v.string(), v.regex(/^\d{4}-\d{2}-\d{2}$/))),
})

export const adminManualRoute = createRoute({
  getParentRoute: () => adminRoute,
  path: '/manual',
  validateSearch: (search: Record<string, unknown>) => v.parse(manualSearchSchema, search),
  component: function AdminManualRoute() {
    const navigate = useNavigate()
    const search = adminManualRoute.useSearch()
    const services = useAllServices(true)
    const dates = upcomingViennaDates(14)
    const selectedServiceId = search.serviceId ?? null
    const selectedDate = search.date ?? null
    const slots = useAvailableSlots({
      serviceId: selectedServiceId,
      fromDateYmd: selectedDate,
      toDateYmd: selectedDate,
      enforceAdvanceRestrictions: false,
    })
    const actions = useAdminReservationActions()

    return (
      <AdminManualBookingPage
        services={services.data?.filter((service) => service.active)}
        dates={dates}
        selectedServiceId={selectedServiceId}
        selectedDate={selectedDate}
        slots={slots.data}
        slotsLoading={slots.isLoading}
        isSubmitting={actions.createManual.isPending}
        submitError={
          actions.createManual.isError
            ? actions.createManual.error instanceof Error
              ? actions.createManual.error.message
              : 'Speichern fehlgeschlagen'
            : null
        }
        onBackClick={() => {
          void navigate({ to: '/admin/calendar', search: { view: 'week', date: undefined } })
        }}
        onServiceChange={(serviceId) => {
          void navigate({
            to: '/admin/manual',
            search: { serviceId, date: selectedDate ?? undefined },
          })
        }}
        onDateChange={(dateYmd) => {
          void navigate({
            to: '/admin/manual',
            search: { serviceId: selectedServiceId ?? undefined, date: dateYmd },
          })
        }}
        onSubmit={(input) => {
          actions.createManual.mutate(
            {
              ...input,
              idempotencyKey:
                typeof crypto !== 'undefined' && 'randomUUID' in crypto
                  ? crypto.randomUUID()
                  : `manual-${Date.now()}`,
            },
            {
              onSuccess: (result) => {
                void navigate({
                  to: '/admin/reservations/$reservationId',
                  params: { reservationId: result.reservationId },
                })
              },
            },
          )
        }}
      />
    )
  },
})

export const adminServicesRoute = createRoute({
  getParentRoute: () => adminRoute,
  path: '/services',
  component: function AdminServicesRoute() {
    const services = useAllServices(true)
    return (
      <AdminServicesPage
        services={services.data}
        isLoading={services.isLoading}
        isError={services.isError}
      />
    )
  },
})

export const adminOpeningHoursRoute = createRoute({
  getParentRoute: () => adminRoute,
  path: '/opening-hours',
  component: function AdminOpeningHoursRoute() {
    const { t } = useLocale()
    const hours = useOpeningHours(true)
    const lines = hours.data
      ? Object.entries(hours.data).map(([day, value]) => {
          const label =
            value.intervals.length === 0
              ? t('admin.closed')
              : value.intervals.map((i) => `${i.start}–${i.end}`).join(', ')
          return `${day}: ${label}`
        })
      : []

    return (
      <AdminPlaceholderPage
        title={t('admin.openingHours')}
        description={
          hours.isLoading
            ? t('admin.openingHoursLoading')
            : hours.isError
              ? t('admin.openingHoursError')
              : lines.join(' · ') || t('admin.openingHoursEmpty')
        }
      />
    )
  },
})

export const adminHolidaysRoute = createRoute({
  getParentRoute: () => adminRoute,
  path: '/holidays',
  component: function AdminHolidaysRoute() {
    const { t } = useLocale()
    return (
      <AdminPlaceholderPage title={t('admin.holidays')} description={t('admin.holidaysHint')} />
    )
  },
})

export const adminSettingsRoute = createRoute({
  getParentRoute: () => adminRoute,
  path: '/settings',
  component: function AdminSettingsRoute() {
    const settings = useBookingSettings(true)
    return (
      <AdminSettingsPage
        settings={settings.data}
        isLoading={settings.isLoading}
        isError={settings.isError}
      />
    )
  },
})
