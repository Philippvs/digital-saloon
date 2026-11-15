import type * as React from 'react'
import { createRoute, useNavigate } from '@tanstack/react-router'

import { useActiveServices } from '../hooks/useActiveServices'
import { BookPage } from '../pages/BookPage'
import { rootRoute } from './root'

const BookRoute: React.FunctionComponent = () => {
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
      onSelectService={() => {
        // Slot selection lands in M4; keep navigation explicit for now.
      }}
    />
  )
}

export const bookRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/book',
  component: BookRoute,
})
