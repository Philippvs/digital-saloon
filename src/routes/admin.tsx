import type * as React from 'react'
import { useCallback, useEffect, useState } from 'react'
import { Outlet, createRoute, redirect, useNavigate } from '@tanstack/react-router'
import * as v from 'valibot'

import { useAuth } from '../auth/AuthProvider'
import { dashboardRange, summarizeDashboard } from '../data/adminDashboard'
import { listRange, startOfWeekYmd } from '../data/calendarRange'
import { addCalendarDays, todayYmdInTimeZone } from '../data/calendarMath'
import { upcomingViennaDates } from '../data/dateFormat'
import { optionalSearchParam } from '../data/schemas'
import { reservationQueryRange, upcomingAbsences } from '../data/openingHoursForm'
import { defaultWeekStartYmd, isoWeekNumber, planWeek, weekQueryRange } from '../data/weekPlanner'
import { useAdminOps } from '../hooks/useAdminOps'
import { useAdminReservation } from '../hooks/useAdminReservation'
import { useAdminReservationActions, useAdminReservations } from '../hooks/useAdminReservations'
import { useAllServices } from '../hooks/useAllServices'
import { useAvailableSlots } from '../hooks/useAvailableSlots'
import { useClosures } from '../hooks/useClosures'
import { useBookingSettings } from '../hooks/useBookingSettings'
import { useOpeningHours } from '../hooks/useOpeningHours'
import { useOpeningHoursAdmin } from '../hooks/useOpeningHoursAdmin'
import { useSalon } from '../hooks/useSalon'
import { useSaveBookingSettings } from '../hooks/useSaveBookingSettings'
import { useSaveSalonDetails } from '../hooks/useSaveSalonDetails'
import { useUserProfile } from '../hooks/useUserProfile'
import { useLocale } from '../i18n'
import { AdminHomePage } from '../pages/admin/AdminHomePage'
import { AdminManualBookingPage } from '../pages/admin/AdminManualBookingPage'
import { AdminOpeningHoursPage } from '../pages/admin/AdminOpeningHoursPage'
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

const ymdSearchParam = optionalSearchParam(v.pipe(v.string(), v.regex(/^\d{4}-\d{2}-\d{2}$/)))

const adminIndexSearchSchema = v.object({
  week: ymdSearchParam,
})

const AdminIndexRoute: React.FunctionComponent = () => {
  const salon = useSalon()
  const navigate = useNavigate()
  const search = adminIndexRoute.useSearch()
  const ops = useAdminOps()
  const actions = useAdminReservationActions()
  const openingHours = useOpeningHours(true)
  const closures = useClosures(true)
  const { t, intlLocale } = useLocale()
  const timeZone = salon.data?.timezone ?? 'Europe/Vienna'
  const now = new Date()
  const today = todayYmdInTimeZone(timeZone, now)
  const currentWeekStart = defaultWeekStartYmd(today, openingHours.data)
  const weekStart = search.week ? startOfWeekYmd(search.week) : currentWeekStart

  const weekRange = weekQueryRange(weekStart)
  const weekReservations = useAdminReservations(weekRange.startIso, weekRange.endIso, true)
  const plan =
    weekReservations.data && !openingHours.isLoading && !closures.isLoading
      ? planWeek({
          reservations: weekReservations.data,
          weekStartYmd: weekStart,
          openingHours: openingHours.data,
          closures: closures.data,
          timeZone,
          now,
        })
      : undefined

  const upcomingRange = dashboardRange(today)
  const upcoming = useAdminReservations(upcomingRange.startIso, upcomingRange.endIso, true)
  const pending = upcoming.data
    ? summarizeDashboard(upcoming.data, today, timeZone).pending
    : undefined

  const weekRangeLabel = new Intl.DateTimeFormat(intlLocale, {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    timeZone: 'UTC',
  }).formatRange(
    new Date(`${weekStart}T12:00:00.000Z`),
    new Date(`${addCalendarDays(weekStart, 6)}T12:00:00.000Z`),
  )

  const goToWeek = (weekStartYmd: string) => {
    void navigate({
      to: '/admin',
      search: { week: weekStartYmd === currentWeekStart ? undefined : weekStartYmd },
    })
  }

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
      weekTitle={t('admin.weekNumber', { week: isoWeekNumber(weekStart) })}
      weekRangeLabel={weekRangeLabel}
      isCurrentWeek={weekStart === currentWeekStart}
      plan={plan}
      planLoading={weekReservations.isLoading || openingHours.isLoading || closures.isLoading}
      planError={weekReservations.isError}
      pending={pending}
      confirmingReservationId={
        actions.confirm.isPending ? (actions.confirm.variables ?? null) : null
      }
      confirmError={actions.confirm.error instanceof Error ? actions.confirm.error.message : null}
      opsBusy={ops.processPending.isPending}
      opsMessage={opsMessage}
      opsError={opsError}
      onPrevWeekClick={() => {
        goToWeek(addCalendarDays(weekStart, -7))
      }}
      onNextWeekClick={() => {
        goToWeek(addCalendarDays(weekStart, 7))
      }}
      onThisWeekClick={() => {
        goToWeek(currentWeekStart)
      }}
      onSelectReservation={(reservationId) => {
        void navigate({ to: '/admin/reservations/$reservationId', params: { reservationId } })
      }}
      onConfirmReservation={(reservationId) => {
        actions.confirm.mutate(reservationId)
      }}
      onAddReservationClick={() => {
        void navigate({ to: '/admin/manual' })
      }}
      onAddReservationAt={(dateYmd, startTime) => {
        void navigate({ to: '/admin/manual', search: { date: dateYmd, time: startTime } })
      }}
      onReservationsClick={() => {
        void navigate({ to: '/admin/reservations' })
      }}
      onServicesClick={() => {
        void navigate({ to: '/admin/services' })
      }}
      onSettingsClick={() => {
        void navigate({ to: '/admin/settings' })
      }}
      onOpeningHoursClick={() => {
        void navigate({ to: '/admin/opening-hours' })
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
  validateSearch: (search: Record<string, unknown>) => v.parse(adminIndexSearchSchema, search),
  component: AdminIndexRoute,
})

const calendarSearchSchema = v.object({
  view: optionalSearchParam(v.string()),
  date: ymdSearchParam,
})

/** The week planner on `/admin` replaced the separate calendar; keep old links working. */
export const adminCalendarRoute = createRoute({
  getParentRoute: () => adminRoute,
  path: '/calendar',
  validateSearch: (search: Record<string, unknown>) => v.parse(calendarSearchSchema, search),
  beforeLoad: ({ search }) => {
    throw redirect({
      to: '/admin',
      search: { week: search.date ? startOfWeekYmd(search.date) : undefined },
    })
  },
})

export const adminReservationsRoute = createRoute({
  getParentRoute: () => adminRoute,
  path: '/reservations',
  component: function AdminReservationsRoute() {
    const navigate = useNavigate()
    const salon = useSalon()
    const today = todayYmdInTimeZone(salon.data?.timezone ?? 'Europe/Vienna')
    const range = listRange(today)
    const reservations = useAdminReservations(range.startIso, range.endIso, true)

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
          void navigate({ to: '/admin', search: { week: undefined } })
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
          void navigate({ to: '/admin', search: { week: undefined } })
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
  date: ymdSearchParam,
  time: optionalSearchParam(v.pipe(v.string(), v.regex(/^\d{2}:\d{2}$/))),
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
        preferredTime={search.time ?? null}
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
          void navigate({ to: '/admin', search: { week: undefined } })
        }}
        onServiceChange={(serviceId) => {
          void navigate({
            to: '/admin/manual',
            search: { serviceId, date: selectedDate ?? undefined, time: search.time },
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

const AdminOpeningHoursRoute: React.FunctionComponent = () => {
  const navigate = useNavigate()
  const salon = useSalon()
  const timeZone = salon.data?.timezone ?? 'Europe/Vienna'
  const todayYmd = todayYmdInTimeZone(timeZone)
  const hours = useOpeningHours(true)
  const closures = useClosures(true)
  const { saveWeekly, addAbsence, removeAbsence } = useOpeningHoursAdmin()
  const [draftRange, setDraftRange] = useState<{ startYmd: string; endYmd: string } | null>(null)
  const draftQuery = draftRange
    ? reservationQueryRange(draftRange.startYmd, draftRange.endYmd)
    : null
  const draftReservations = useAdminReservations(
    draftQuery?.startIso ?? '',
    draftQuery?.endIso ?? '',
    draftQuery !== null,
  )
  const onDraftDatesChange = useCallback((range: { startYmd: string; endYmd: string } | null) => {
    setDraftRange((current) =>
      current?.startYmd === range?.startYmd && current?.endYmd === range?.endYmd ? current : range,
    )
  }, [])

  return (
    <AdminOpeningHoursPage
      todayYmd={todayYmd}
      timeZone={timeZone}
      weekly={hours.data}
      weeklyLoading={hours.isLoading}
      weeklyError={hours.isError}
      weeklySave={{
        saving: saveWeekly.isPending,
        saved: saveWeekly.isSuccess,
        error: saveWeekly.error instanceof Error ? saveWeekly.error.message : null,
      }}
      onSaveWeekly={(draft) => {
        saveWeekly.mutate(draft)
      }}
      absences={closures.data ? upcomingAbsences(closures.data, todayYmd) : undefined}
      absencesLoading={closures.isLoading}
      absencesError={closures.isError}
      deletingAbsenceId={removeAbsence.isPending ? (removeAbsence.variables?.id ?? null) : null}
      onDeleteAbsence={(absence) => {
        removeAbsence.mutate(absence)
      }}
      draftReservations={draftQuery ? draftReservations.data : undefined}
      onDraftDatesChange={onDraftDatesChange}
      onAddAbsence={(absence) => addAbsence.mutateAsync(absence)}
      onBackClick={() => {
        void navigate({ to: '/admin', search: { week: undefined } })
      }}
    />
  )
}

export const adminOpeningHoursRoute = createRoute({
  getParentRoute: () => adminRoute,
  path: '/opening-hours',
  component: AdminOpeningHoursRoute,
})

/** Holidays are managed together with opening hours; keep old links working. */
export const adminHolidaysRoute = createRoute({
  getParentRoute: () => adminRoute,
  path: '/holidays',
  beforeLoad: () => {
    throw redirect({ to: '/admin/opening-hours' })
  },
})

export const adminSettingsRoute = createRoute({
  getParentRoute: () => adminRoute,
  path: '/settings',
  component: function AdminSettingsRoute() {
    const navigate = useNavigate()
    const settings = useBookingSettings(true)
    const salon = useSalon()
    const saveSettings = useSaveBookingSettings()
    const saveSalon = useSaveSalonDetails()
    const errorText = (error: unknown): string | null =>
      error instanceof Error ? error.message : error ? String(error) : null

    return (
      <AdminSettingsPage
        settings={settings.data}
        settingsLoading={settings.isLoading}
        settingsError={settings.isError}
        settingsSave={{
          saving: saveSettings.isPending,
          saved: saveSettings.isSuccess,
          error: errorText(saveSettings.error),
        }}
        onSaveSettings={(next) => {
          saveSettings.mutate(next)
        }}
        salon={salon.data}
        salonLoading={salon.isLoading}
        salonSave={{
          saving: saveSalon.isPending,
          saved: saveSalon.isSuccess,
          error: errorText(saveSalon.error),
        }}
        onSaveSalon={(details) => {
          saveSalon.mutate(details)
        }}
        onOpeningHoursClick={() => {
          void navigate({ to: '/admin/opening-hours' })
        }}
        onBackClick={() => {
          void navigate({ to: '/admin' })
        }}
      />
    )
  },
})
