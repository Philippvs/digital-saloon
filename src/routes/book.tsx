import { createRoute, useNavigate } from '@tanstack/react-router'
import * as v from 'valibot'

import { upcomingViennaDates } from '../data/dateFormat'
import { optionalSearchParam } from '../data/schemas'
import { useActiveServices } from '../hooks/useActiveServices'
import { useAvailableSlots } from '../hooks/useAvailableSlots'
import { useCreateReservation } from '../hooks/useCreateReservation'
import { BookCheckoutPage } from '../pages/BookCheckoutPage'
import { BookPage } from '../pages/BookPage'
import { BookSlotsPage } from '../pages/BookSlotsPage'
import { rootRoute } from './root'

const bookSlotsSearchSchema = v.object({
  serviceId: v.pipe(v.string(), v.minLength(1)),
  date: optionalSearchParam(v.pipe(v.string(), v.regex(/^\d{4}-\d{2}-\d{2}$/))),
})

const bookCheckoutSearchSchema = v.object({
  serviceId: v.pipe(v.string(), v.minLength(1)),
  startAt: v.pipe(v.string(), v.minLength(1)),
})

export const bookRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/book',
  component: function BookIndexRoute() {
    const navigate = useNavigate()
    const services = useActiveServices()

    return (
      <BookPage
        services={services.data}
        isLoading={services.isLoading}
        isError={services.isError}
        onBackClick={() => {
          void navigate({ to: '/' })
        }}
        onSelectService={(serviceId) => {
          void navigate({
            to: '/book/slots',
            search: { serviceId, date: undefined },
          })
        }}
      />
    )
  },
})

export const bookSlotsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/book/slots',
  validateSearch: (search: Record<string, unknown>) => v.parse(bookSlotsSearchSchema, search),
  component: function BookSlotsRoute() {
    const navigate = useNavigate()
    const { serviceId, date } = bookSlotsRoute.useSearch()
    const services = useActiveServices()
    const service = services.data?.find((item) => item.id === serviceId)
    const dates = upcomingViennaDates(14)
    const selectedDate = date ?? null
    const slots = useAvailableSlots({
      serviceId,
      fromDateYmd: selectedDate,
      toDateYmd: selectedDate,
    })

    return (
      <BookSlotsPage
        service={service}
        dates={dates}
        selectedDate={selectedDate}
        slots={slots.data}
        slotsLoading={slots.isLoading}
        slotsError={slots.isError}
        onBackClick={() => {
          void navigate({ to: '/book' })
        }}
        onDateSelect={(dateYmd) => {
          void navigate({
            to: '/book/slots',
            search: { serviceId, date: dateYmd },
          })
        }}
        onSlotSelect={(startAt) => {
          void navigate({
            to: '/book/checkout',
            search: { serviceId, startAt },
          })
        }}
      />
    )
  },
})

export const bookCheckoutRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/book/checkout',
  validateSearch: (search: Record<string, unknown>) => v.parse(bookCheckoutSearchSchema, search),
  component: function BookCheckoutRoute() {
    const navigate = useNavigate()
    const { serviceId, startAt } = bookCheckoutRoute.useSearch()
    const services = useActiveServices()
    const service = services.data?.find((item) => item.id === serviceId)
    const create = useCreateReservation()

    return (
      <BookCheckoutPage
        service={service}
        startAt={startAt}
        isSubmitting={create.isPending}
        submitError={
          create.isError
            ? create.error instanceof Error
              ? create.error.message
              : 'Buchung fehlgeschlagen'
            : null
        }
        onBackClick={() => {
          void navigate({
            to: '/book/slots',
            search: { serviceId, date: undefined },
          })
        }}
        onSubmit={(input) => {
          create.mutate(
            {
              serviceId,
              startAt,
              firstName: input.firstName,
              lastName: input.lastName,
              phone: input.phone,
              email: input.email,
              privacyAccepted: true,
              idempotencyKey:
                typeof crypto !== 'undefined' && 'randomUUID' in crypto
                  ? crypto.randomUUID()
                  : `idemp-${Date.now()}`,
            },
            {
              onSuccess: (result) => {
                if (!result.managementToken) {
                  void navigate({ to: '/' })
                  return
                }
                void navigate({
                  to: '/booking/confirmed',
                  search: {
                    reservationId: result.reservationId,
                    token: result.managementToken,
                    status: result.status,
                    serviceName: service?.name ?? '',
                    startAt,
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
