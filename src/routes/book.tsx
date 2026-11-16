import { createRoute, useNavigate } from '@tanstack/react-router'
import * as v from 'valibot'

import { addMonths, viennaTodayYmd } from '../data/bookingCalendar'
import { optionalSearchParam } from '../data/schemas'
import { useActiveServices } from '../hooks/useActiveServices'
import { useAvailableSlots } from '../hooks/useAvailableSlots'
import { useCreateReservation } from '../hooks/useCreateReservation'
import { BookingWizardPage } from '../pages/BookingWizardPage'
import { rootRoute } from './root'

const bookSearchSchema = v.object({
  serviceId: optionalSearchParam(v.pipe(v.string(), v.minLength(1))),
  date: optionalSearchParam(v.pipe(v.string(), v.regex(/^\d{4}-\d{2}-\d{2}$/))),
  startAt: optionalSearchParam(v.pipe(v.string(), v.minLength(1))),
  month: optionalSearchParam(v.pipe(v.string(), v.regex(/^\d{4}-\d{2}-\d{2}$/))),
})

export const bookRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/book',
  validateSearch: (search: Record<string, unknown>) => v.parse(bookSearchSchema, search),
  component: function BookWizardRoute() {
    const navigate = useNavigate()
    const search = bookRoute.useSearch()
    const services = useActiveServices()
    const create = useCreateReservation()

    const today = viennaTodayYmd()
    const monthAnchorYmd = search.month ?? `${today.slice(0, 8)}01`
    const rangeFrom = today
    const rangeTo = addMonths(today, 2)

    const rangeSlots = useAvailableSlots({
      serviceId: search.serviceId ?? null,
      fromDateYmd: search.serviceId ? rangeFrom : null,
      toDateYmd: search.serviceId ? rangeTo : null,
    })

    const selectedService = services.data?.find((item) => item.id === search.serviceId)

    return (
      <BookingWizardPage
        services={services.data}
        servicesLoading={services.isLoading}
        servicesError={services.isError}
        selectedServiceId={search.serviceId ?? null}
        selectedDate={search.date ?? null}
        selectedStartAt={search.startAt ?? null}
        rangeSlots={rangeSlots.data}
        rangeLoading={rangeSlots.isLoading}
        rangeError={rangeSlots.isError}
        isSubmitting={create.isPending}
        submitError={
          create.isError
            ? create.error instanceof Error
              ? create.error.message
              : 'Buchung fehlgeschlagen'
            : null
        }
        monthAnchorYmd={monthAnchorYmd}
        onMonthAnchorChange={(anchorYmd) => {
          void navigate({
            to: '/book',
            search: {
              serviceId: search.serviceId,
              date: search.date,
              startAt: search.startAt,
              month: `${anchorYmd.slice(0, 8)}01`,
            },
            replace: true,
            resetScroll: false,
          })
        }}
        onSelectService={(serviceId) => {
          void navigate({
            to: '/book',
            search: {
              serviceId,
              date: undefined,
              startAt: undefined,
              month: monthAnchorYmd,
            },
            replace: true,
            resetScroll: false,
          })
        }}
        onSelectDate={(dateYmd) => {
          void navigate({
            to: '/book',
            search: {
              serviceId: search.serviceId,
              date: dateYmd,
              startAt: undefined,
              month: monthAnchorYmd,
            },
            replace: true,
            resetScroll: false,
          })
        }}
        onSelectTime={(startAt) => {
          void navigate({
            to: '/book',
            search: {
              serviceId: search.serviceId,
              date: search.date,
              startAt,
              month: monthAnchorYmd,
            },
            replace: true,
            resetScroll: false,
          })
        }}
        onClearTime={() => {
          void navigate({
            to: '/book',
            search: {
              serviceId: search.serviceId,
              date: search.date,
              startAt: undefined,
              month: monthAnchorYmd,
            },
            replace: true,
            resetScroll: false,
          })
        }}
        onSubmit={(input) => {
          if (!search.serviceId || !search.startAt) return
          create.mutate(
            {
              serviceId: search.serviceId,
              startAt: search.startAt,
              firstName: input.firstName,
              lastName: input.lastName,
              phone: input.phone,
              email: null,
              privacyAccepted: true,
              idempotencyKey:
                typeof crypto !== 'undefined' && 'randomUUID' in crypto
                  ? crypto.randomUUID()
                  : `idemp-${Date.now()}`,
            },
            {
              onSuccess: (result) => {
                if (!result.managementToken) {
                  void navigate({ to: '/book' })
                  return
                }
                void navigate({
                  to: '/booking/confirmed',
                  search: {
                    reservationId: result.reservationId,
                    token: result.managementToken,
                    status: result.status,
                    serviceName: selectedService?.name ?? '',
                    startAt: search.startAt!,
                  },
                })
              },
            },
          )
        }}
      />
    )
  },
})
