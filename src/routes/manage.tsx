import { useState } from 'react'
import { createRoute, useNavigate } from '@tanstack/react-router'

import { upcomingViennaDates } from '../data/dateFormat'
import { useAvailableSlots } from '../hooks/useAvailableSlots'
import {
  useCancelReservation,
  useManageReservation,
  useRescheduleReservation,
} from '../hooks/useManageReservation'
import { useLocale } from '../i18n'
import { ManageReservationPage } from '../pages/ManageReservationPage'
import { rootRoute } from './root'

export const manageRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/manage/$token',
  component: function ManageRoute() {
    const navigate = useNavigate()
    const { token } = manageRoute.useParams()
    const reservation = useManageReservation(token)
    const cancel = useCancelReservation()
    const reschedule = useRescheduleReservation()
    const { t } = useLocale()
    const [showReschedule, setShowReschedule] = useState(false)

    const dates = upcomingViennaDates(7)
    const fromDateYmd = dates[0] ?? null
    const toDateYmd = dates[dates.length - 1] ?? null
    const serviceId = reservation.data?.serviceId ?? null
    const slots = useAvailableSlots({
      serviceId: showReschedule ? serviceId : null,
      fromDateYmd: showReschedule ? fromDateYmd : null,
      toDateYmd: showReschedule ? toDateYmd : null,
      managementToken: token,
    })

    const actionError =
      cancel.isError || reschedule.isError
        ? cancel.error instanceof Error
          ? cancel.error.message
          : reschedule.error instanceof Error
            ? reschedule.error.message
            : t('manage.actionFailed')
        : null

    return (
      <ManageReservationPage
        reservation={reservation.data}
        isLoading={reservation.isLoading}
        isError={reservation.isError}
        cancelPending={cancel.isPending}
        reschedulePending={reschedule.isPending}
        actionError={actionError}
        rescheduleSlots={slots.data?.filter((slot) => slot.startAt !== reservation.data?.startAt)}
        rescheduleLoading={slots.isLoading}
        showReschedule={showReschedule}
        onToggleReschedule={() => {
          setShowReschedule((value) => !value)
        }}
        onCancel={() => {
          cancel.mutate(token, {
            onSuccess: () => {
              void reservation.refetch()
              setShowReschedule(false)
            },
          })
        }}
        onReschedule={(startAt) => {
          reschedule.mutate(
            { token, startAt },
            {
              onSuccess: () => {
                void reservation.refetch()
                setShowReschedule(false)
              },
            },
          )
        }}
        onHomeClick={() => {
          void navigate({ to: '/' })
        }}
      />
    )
  },
})
