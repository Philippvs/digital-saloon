import type * as React from 'react'
import { createRoute, useNavigate } from '@tanstack/react-router'

import { useAuth } from '../auth/AuthProvider'
import { usesEmulators } from '../firebase'
import { HomePage } from '../pages/HomePage'
import { rootRoute } from './root'

const HomeRoute: React.FunctionComponent = () => {
  const { user } = useAuth()
  const navigate = useNavigate()

  return (
    <HomePage
      email={user?.email ?? null}
      usesEmulators={usesEmulators}
      onLoginClick={() => {
        void navigate({ to: '/login' })
      }}
    />
  )
}

export const homeRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
  component: HomeRoute,
})
