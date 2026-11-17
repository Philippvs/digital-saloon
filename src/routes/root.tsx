import type * as React from 'react'
import { Outlet, createRootRoute, useNavigate, useRouterState } from '@tanstack/react-router'

import { useAuth } from '../auth/AuthProvider'
import { AppShell } from '../components/AppShell'
import { useSignOut } from '../hooks/useSignOut'
import { useSalon } from '../hooks/useSalon'

const RootRoute: React.FunctionComponent = () => {
  const { user } = useAuth()
  const navigate = useNavigate()
  const signOut = useSignOut()
  const salon = useSalon()

  const pathname = useRouterState({ select: (state) => state.location.pathname })

  return (
    <AppShell
      salon={salon.data ?? null}
      email={user?.email ?? null}
      contentWidth={
        pathname === '/' ? 'full' : pathname.startsWith('/admin') ? 'wide' : 'contained'
      }
      onHomeClick={() => {
        void navigate({ to: '/' })
      }}
      onBookClick={() => {
        void navigate({ to: '/book' })
      }}
      onMyBookingsClick={() => {
        void navigate({ to: '/my-bookings' })
      }}
      onLoginClick={() => {
        void navigate({ to: '/login', search: { redirect: '/admin' } })
      }}
      onAdminClick={() => {
        void navigate({ to: '/admin' })
      }}
      onAdminSettingsClick={() => {
        void navigate({ to: '/admin/settings' })
      }}
      onSignOutClick={() => {
        // Leave admin pages first: their auth guard would otherwise redirect to /login.
        void navigate({ to: '/' }).then(() => {
          signOut.mutate()
        })
      }}
    >
      <Outlet />
    </AppShell>
  )
}

export const rootRoute = createRootRoute({
  component: RootRoute,
})
