import type * as React from 'react'
import { Navigate } from '@tanstack/react-router'

import { useAuth } from '../auth/AuthProvider'
import { useUserProfile } from '../hooks/useUserProfile'

export type CustomerOnlyProps = {
  children: React.ReactNode
}

/**
 * Wraps customer pages (home, booking) that make no sense for salon staff:
 * a signed-in admin is sent to the admin calendar instead.
 */
export const CustomerOnly: React.FunctionComponent<CustomerOnlyProps> = ({ children }) => {
  const { user, isLoading: authLoading } = useAuth()
  const profile = useUserProfile(user?.uid ?? null)

  if (authLoading || (user !== null && profile.isLoading)) return null
  if (profile.data?.role === 'admin') return <Navigate to="/admin" replace />
  return children
}

/** Route `component` helper: `component: customerOnly(function HomeRoute() { … })`. */
export function customerOnly(Page: React.ComponentType): React.FunctionComponent {
  const CustomerOnlyRoute: React.FunctionComponent = () => (
    <CustomerOnly>
      <Page />
    </CustomerOnly>
  )
  return CustomerOnlyRoute
}
