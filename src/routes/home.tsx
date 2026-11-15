import { createRoute, useNavigate } from '@tanstack/react-router'

import { useActiveServices } from '../hooks/useActiveServices'
import { useOpeningHours } from '../hooks/useOpeningHours'
import { useSalon } from '../hooks/useSalon'
import { HomePage } from '../pages/HomePage'
import { rootRoute } from './root'

export const homeRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
  component: function HomeRoute() {
    const navigate = useNavigate()
    const salon = useSalon()
    const services = useActiveServices()
    const openingHours = useOpeningHours(true)

    return (
      <HomePage
        salon={salon.data ?? null}
        services={services.data}
        servicesLoading={services.isLoading}
        servicesError={services.isError}
        openingHours={openingHours.data}
        openingHoursLoading={openingHours.isLoading}
        openingHoursError={openingHours.isError}
        onBookClick={() => {
          void navigate({ to: '/book' })
        }}
        onServiceClick={(serviceId) => {
          void navigate({ to: '/book', search: { serviceId } })
        }}
      />
    )
  },
})
