import { createRoute, useNavigate } from '@tanstack/react-router'
import * as v from 'valibot'

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
    const managementPath = `/manage/${encodeURIComponent(search.token)}`
    const managementUrl =
      typeof window !== 'undefined' ? `${window.location.origin}${managementPath}` : managementPath

    return (
      <BookingConfirmedPage
        status={search.status}
        serviceName={search.serviceName || null}
        startAt={search.startAt || null}
        managementUrl={managementUrl}
        onManageClick={() => {
          void navigate({ to: '/manage/$token', params: { token: search.token } })
        }}
        onHomeClick={() => {
          void navigate({ to: '/' })
        }}
      />
    )
  },
})
