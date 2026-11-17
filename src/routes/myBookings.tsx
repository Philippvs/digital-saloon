import type * as React from 'react'
import { useState } from 'react'
import { createRoute, useNavigate } from '@tanstack/react-router'

import { absoluteManagementUrl } from '../data/savedBookings'
import { mailtoShareHref, shareOrCopyLink } from '../data/shareLink'
import { useManageReservation } from '../hooks/useManageReservation'
import { useSavedBookings } from '../hooks/useSavedBookings'
import { useLocale } from '../i18n'
import { MyBookingsPage, SavedBookingCard } from '../pages/MyBookingsPage'
import { rootRoute } from './root'

function SavedBookingItem(props: {
  token: string
  onOpenManage: (token: string) => void
  onRemove: (token: string) => void
  onCopyLink: (token: string) => void
  onShareLink: (token: string) => void
  onMailtoLink: (token: string) => void
}): React.ReactNode {
  const query = useManageReservation(props.token)
  return (
    <SavedBookingCard
      reservation={query.data}
      isLoading={query.isLoading}
      isError={query.isError}
      onOpenManage={() => props.onOpenManage(props.token)}
      onRemove={() => props.onRemove(props.token)}
      onCopyLink={() => props.onCopyLink(props.token)}
      onShareLink={() => props.onShareLink(props.token)}
      onMailtoLink={() => props.onMailtoLink(props.token)}
    />
  )
}

export const myBookingsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/my-bookings',
  component: function MyBookingsRoute() {
    const navigate = useNavigate()
    const saved = useSavedBookings()
    const { t } = useLocale()
    const [actionHint, setActionHint] = useState<string | null>(null)
    const origin = typeof window !== 'undefined' ? window.location.origin : ''

    const shareFor = (token: string) => ({
      url: absoluteManagementUrl(token, origin || 'http://127.0.0.1:3100'),
      title: t('myBookings.shareTitle'),
      text: t('myBookings.shareText'),
    })

    return (
      <MyBookingsPage
        isEmpty={saved.bookings.length === 0}
        actionHint={actionHint}
        onBookClick={() => {
          void navigate({ to: '/book' })
        }}
        onHomeClick={() => {
          void navigate({ to: '/' })
        }}
      >
        {saved.bookings.map((booking) => (
          <SavedBookingItem
            key={booking.token}
            token={booking.token}
            onOpenManage={(token) => {
              void navigate({ to: '/manage/$token', params: { token } })
            }}
            onRemove={(token) => {
              saved.remove(token)
              setActionHint(t('myBookings.removed'))
            }}
            onCopyLink={(token) => {
              void shareOrCopyLink(shareFor(token), {
                share: undefined,
                canShare: () => false,
              }).then((result) => {
                setActionHint(
                  result === 'copied' ? t('myBookings.copied') : t('myBookings.copyFailed'),
                )
              })
            }}
            onShareLink={(token) => {
              void shareOrCopyLink(shareFor(token)).then((result) => {
                if (result === 'shared') setActionHint(t('myBookings.shared'))
                else if (result === 'copied') setActionHint(t('myBookings.copied'))
                else setActionHint(null)
              })
            }}
            onMailtoLink={(token) => {
              window.location.href = mailtoShareHref(shareFor(token))
            }}
          />
        ))}
      </MyBookingsPage>
    )
  },
})
