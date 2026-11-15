import type * as React from 'react'
import { Outlet, createRootRoute, useNavigate } from '@tanstack/react-router'

import { useAuth } from '../auth/AuthProvider'
import { AppShell } from '../components/AppShell'
import { useSignOut } from '../hooks/useSignOut'

const RootRoute: React.FunctionComponent = () => {
  const { user } = useAuth()
  const navigate = useNavigate()
  const signOut = useSignOut()

  return (
    <AppShell
      title="App Template"
      email={user?.email ?? null}
      onHomeClick={() => {
        void navigate({ to: '/' })
      }}
      onLoginClick={() => {
        void navigate({ to: '/login' })
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
