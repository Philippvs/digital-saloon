import { createRouter } from '@tanstack/react-router'

import {
  adminCalendarRoute,
  adminHolidaysRoute,
  adminIndexRoute,
  adminManualRoute,
  adminOpeningHoursRoute,
  adminReservationDetailRoute,
  adminReservationsRoute,
  adminRoute,
  adminServicesRoute,
  adminSettingsRoute,
} from './routes/admin'
import { bookCheckoutRoute, bookRoute, bookSlotsRoute } from './routes/book'
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
    bookRoute,
    bookSlotsRoute,
    bookCheckoutRoute,
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
    ]),
  ]),
})

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router
  }
}
