import type * as React from 'react'
import { createRoute, useNavigate } from '@tanstack/react-router'

import { usesEmulators } from '../firebase'
import { useActiveServices } from '../hooks/useActiveServices'
import { useSalon } from '../hooks/useSalon'
import { HomePage } from '../pages/HomePage'
import { rootRoute } from './root'

const HomeRoute: React.FunctionComponent = () => {
  const navigate = useNavigate()
  const salon = useSalon()
  const services = useActiveServices()

  return (
    <HomePage
      salon={salon.data}
      services={services.data}
      salonLoading={salon.isLoading}
      servicesLoading={services.isLoading}
      servicesError={services.isError}
      usesEmulators={usesEmulators}
      onBookClick={() => {
        void navigate({ to: '/book' })
      }}
    />
  )
}

export const homeRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
  component: HomeRoute,
})
