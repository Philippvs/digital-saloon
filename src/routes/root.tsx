import type * as React from 'react'
import { Outlet, createRootRoute, useNavigate } from '@tanstack/react-router'

import { useAuth } from '../auth/AuthProvider'
import { AppShell } from '../components/AppShell'
import { useSignOut } from '../hooks/useSignOut'
import { useSalon } from '../hooks/useSalon'

const RootRoute: React.FunctionComponent = () => {
  const { user } = useAuth()
  const navigate = useNavigate()
  const signOut = useSignOut()
  const salon = useSalon()

  return (
    <AppShell
      title={salon.data?.name ?? 'SalonFlow'}
      email={user?.email ?? null}
      onHomeClick={() => {
        void navigate({ to: '/' })
      }}
      onLoginClick={() => {
        void navigate({ to: '/login', search: { redirect: '/admin' } })
      }}
      onAdminClick={() => {
        void navigate({ to: '/admin' })
      }}
      onSignOutClick={() => {
        signOut.mutate(undefined, {
          onSuccess: () => {
            void navigate({ to: '/' })
          },
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
