import { createRouter } from '@tanstack/react-router'

import {
  adminCalendarRoute,
  adminHolidaysRoute,
  adminIndexRoute,
  adminOpeningHoursRoute,
  adminReservationsRoute,
  adminRoute,
  adminServicesRoute,
  adminSettingsRoute,
} from './routes/admin'
import { bookRoute } from './routes/book'
import { homeRoute } from './routes/home'
import { loginRoute } from './routes/login'
import { rootRoute } from './routes/root'
import { RouteError } from './routes/routeError'

export const router = createRouter({
  scrollRestoration: true,
  defaultErrorComponent: RouteError,
  routeTree: rootRoute.addChildren([
    homeRoute,
    bookRoute,
    loginRoute,
    adminRoute.addChildren([
      adminIndexRoute,
      adminCalendarRoute,
      adminReservationsRoute,
      adminServicesRoute,
      adminOpeningHoursRoute,
      adminHolidaysRoute,
      adminSettingsRoute,
    ]),
  ]),
})

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router
  }
}
