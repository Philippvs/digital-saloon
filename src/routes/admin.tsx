import type * as React from 'react'
import { useEffect } from 'react'
import { Outlet, createRoute, useNavigate } from '@tanstack/react-router'

import { useAuth } from '../auth/AuthProvider'
import { useAllServices } from '../hooks/useAllServices'
import { useBookingSettings } from '../hooks/useBookingSettings'
import { useOpeningHours } from '../hooks/useOpeningHours'
import { useSalon } from '../hooks/useSalon'
import { useUserProfile } from '../hooks/useUserProfile'
import { AdminHomePage } from '../pages/admin/AdminHomePage'
import { AdminPlaceholderPage } from '../pages/admin/AdminPlaceholderPage'
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

  if (authLoading || (user !== null && profile.isLoading)) {
    return <AdminPlaceholderPage title="Admin" description="Loading…" />
  }

  if (!user) {
    return <AdminPlaceholderPage title="Admin" description="Sign in required." />
  }

  if (profile.data?.role !== 'admin') {
    return (
      <AdminPlaceholderPage
        title="Forbidden"
        description="This area is only available to salon administrators."
      />
    )
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

  return (
    <AdminHomePage
      salonName={salon.data?.name ?? 'Salon'}
      onCalendarClick={() => {
        void navigate({ to: '/admin/calendar' })
      }}
      onServicesClick={() => {
        void navigate({ to: '/admin/services' })
      }}
      onSettingsClick={() => {
        void navigate({ to: '/admin/settings' })
      }}
    />
  )
}

export const adminIndexRoute = createRoute({
  getParentRoute: () => adminRoute,
  path: '/',
  component: AdminIndexRoute,
})

export const adminCalendarRoute = createRoute({
  getParentRoute: () => adminRoute,
  path: '/calendar',
  component: function AdminCalendarRoute() {
    return (
      <AdminPlaceholderPage title="Calendar" description="Reservation calendar arrives in M5." />
    )
  },
})

export const adminReservationsRoute = createRoute({
  getParentRoute: () => adminRoute,
  path: '/reservations',
  component: function AdminReservationsRoute() {
    return (
      <AdminPlaceholderPage title="Reservations" description="Reservation list arrives in M5." />
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
    const hours = useOpeningHours(true)
    const lines = hours.data
      ? Object.entries(hours.data).map(([day, value]) => {
          const label =
            value.intervals.length === 0
              ? 'Closed'
              : value.intervals.map((i) => `${i.start}–${i.end}`).join(', ')
          return `${day}: ${label}`
        })
      : []

    return (
      <AdminPlaceholderPage
        title="Opening Hours"
        description={
          hours.isLoading
            ? 'Loading…'
            : hours.isError
              ? 'Could not load opening hours.'
              : lines.join(' · ') || 'No opening hours configured.'
        }
      />
    )
  },
})

export const adminHolidaysRoute = createRoute({
  getParentRoute: () => adminRoute,
  path: '/holidays',
  component: function AdminHolidaysRoute() {
    return <AdminPlaceholderPage title="Holidays" description="Holiday management arrives in M5." />
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
