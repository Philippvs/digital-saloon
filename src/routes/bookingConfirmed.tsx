import { useEffect } from 'react'
import { createRoute, useNavigate } from '@tanstack/react-router'
import * as v from 'valibot'

import { useSavedBookings } from '../hooks/useSavedBookings'
import { BookingConfirmedPage } from '../pages/BookingConfirmedPage'
import { rootRoute } from './root'

const confirmedSearchSchema = v.object({
  reservationId: v.pipe(v.string(), v.minLength(1)),
  token: v.pipe(v.string(), v.minLength(16)),
  status: v.pipe(v.string(), v.minLength(1)),
  serviceName: v.optional(v.string(), ''),
  startAt: v.optional(v.string(), ''),
})

export const bookingConfirmedRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/booking/confirmed',
  validateSearch: (search: Record<string, unknown>) => v.parse(confirmedSearchSchema, search),
  component: function BookingConfirmedRoute() {
    const navigate = useNavigate()
    const search = bookingConfirmedRoute.useSearch()
    const saved = useSavedBookings()

    useEffect(() => {
      saved.save({ token: search.token, reservationId: search.reservationId })
      // Intentionally once per confirmed booking payload.
      // eslint-disable-next-line react-hooks/exhaustive-deps -- save on mount for this search only
    }, [search.token, search.reservationId])

    return (
      <BookingConfirmedPage
        status={search.status}
        serviceName={search.serviceName || null}
        startAt={search.startAt || null}
        onManageClick={() => {
          void navigate({ to: '/manage/$token', params: { token: search.token } })
        }}
        onMyBookingsClick={() => {
          void navigate({ to: '/my-bookings' })
        }}
        onHomeClick={() => {
          void navigate({ to: '/' })
        }}
      />
    )
  },
})
