import { createRoute } from '@tanstack/react-router'

import { useSalon } from '../hooks/useSalon'
import { PrivacyPage } from '../pages/PrivacyPage'
import { rootRoute } from './root'

export const privacyRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/datenschutz',
  component: function PrivacyRoute() {
    const salon = useSalon()

    return <PrivacyPage salon={salon.data ?? null} />
  },
})
