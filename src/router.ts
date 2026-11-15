import { createRouter } from '@tanstack/react-router'

import { homeRoute } from './routes/home'
import { loginRoute } from './routes/login'
import { rootRoute } from './routes/root'
import { RouteError } from './routes/routeError'

export const router = createRouter({
  scrollRestoration: true,
  defaultErrorComponent: RouteError,
  routeTree: rootRoute.addChildren([homeRoute, loginRoute]),
})

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router
  }
}
