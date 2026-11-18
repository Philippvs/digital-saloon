import { createRouter } from '@tanstack/react-router'

import {
  adminCalendarRoute,
  adminHolidaysRoute,
  adminHomepageRoute,
  adminIndexRoute,
  adminManualRoute,
  adminOpeningHoursRoute,
  adminReservationDetailRoute,
  adminReservationsRoute,
  adminRoute,
  adminServicesRoute,
  adminSettingsRoute,
} from './routes/admin'
import { balayageRoute } from './routes/balayage'
import { bookRoute } from './routes/book'
import { bookingConfirmedRoute } from './routes/bookingConfirmed'
import { homeRoute } from './routes/home'
import { loginRoute } from './routes/login'
import { manageRoute } from './routes/manage'
import { myBookingsRoute } from './routes/myBookings'
import { rootRoute } from './routes/root'
import { RouteError } from './routes/routeError'

export const router = createRouter({
  scrollRestoration: true,
  defaultErrorComponent: RouteError,
  routeTree: rootRoute.addChildren([
    homeRoute,
    balayageRoute,
    bookRoute,
    bookingConfirmedRoute,
    myBookingsRoute,
    manageRoute,
    loginRoute,
    adminRoute.addChildren([
      adminIndexRoute,
      adminCalendarRoute,
      adminReservationsRoute,
      adminReservationDetailRoute,
      adminManualRoute,
      adminServicesRoute,
      adminOpeningHoursRoute,
      adminHolidaysRoute,
      adminSettingsRoute,
      adminHomepageRoute,
    ]),
  ]),
})

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router
  }
}
