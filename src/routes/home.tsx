import { createRoute, redirect } from '@tanstack/react-router'

import { rootRoute } from './root'

/** Booking is the product home — no separate marketing landing. */
export const homeRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
  beforeLoad: () => {
    throw redirect({ to: '/book' })
  },
})
