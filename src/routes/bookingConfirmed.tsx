import { useEffect, useState } from 'react'
import { createRoute, useNavigate } from '@tanstack/react-router'
import * as v from 'valibot'

import { absoluteManagementUrl } from '../data/savedBookings'
import { mailtoShareHref, shareOrCopyLink } from '../data/shareLink'
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
    const [shareHint, setShareHint] = useState<string | null>(null)

    const origin = typeof window !== 'undefined' ? window.location.origin : ''
    const managementUrl = absoluteManagementUrl(search.token, origin || 'http://127.0.0.1:3100')

    useEffect(() => {
      saved.save({ token: search.token, reservationId: search.reservationId })
      // Intentionally once per confirmed booking payload.
      // eslint-disable-next-line react-hooks/exhaustive-deps -- save on mount for this search only
    }, [search.token, search.reservationId])

    const shareInput = {
      url: managementUrl,
      title: 'Mein Salon-Termin',
      text: 'Hier ist mein persönlicher Link zum Verwalten des Termins. Bitte aufbewahren.',
    }

    return (
      <BookingConfirmedPage
        status={search.status}
        serviceName={search.serviceName || null}
        startAt={search.startAt || null}
        managementUrl={managementUrl}
        shareHint={shareHint}
        onManageClick={() => {
          void navigate({ to: '/manage/$token', params: { token: search.token } })
        }}
        onCopyLink={() => {
          void shareOrCopyLink(shareInput, {
            share: undefined,
            canShare: () => false,
          }).then((result) => {
            setShareHint(result === 'copied' ? 'Link in die Zwischenablage kopiert.' : null)
          })
        }}
        onShareLink={() => {
          void shareOrCopyLink(shareInput).then((result) => {
            if (result === 'shared') setShareHint('Link geteilt.')
            else if (result === 'copied') setShareHint('Link in die Zwischenablage kopiert.')
            else setShareHint(null)
          })
        }}
        onMailtoLink={() => {
          window.location.href = mailtoShareHref(shareInput)
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
