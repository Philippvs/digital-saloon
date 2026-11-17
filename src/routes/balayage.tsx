import { createRoute, useNavigate } from '@tanstack/react-router'

import { BalayagePage } from '../pages/BalayagePage'
import { rootRoute } from './root'

export const balayageRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/balayage',
  component: function BalayageRoute() {
    const navigate = useNavigate()

    return (
      <BalayagePage
        onSelectPackage={(serviceId) => {
          void navigate({ to: '/book', search: { serviceId } })
        }}
        onBookClick={() => {
          void navigate({ to: '/book' })
        }}
      />
    )
  },
})
