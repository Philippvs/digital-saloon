import type * as React from 'react'
import { createRoute, useNavigate } from '@tanstack/react-router'
import * as v from 'valibot'

import { optionalSearchParam } from '../data/schemas'
import { LoginPage } from '../pages/LoginPage'
import { rootRoute } from './root'

const loginSearchSchema = v.object({
  redirect: optionalSearchParam(v.pipe(v.string(), v.minLength(1))),
})

const LoginRoute: React.FunctionComponent = () => {
  const navigate = useNavigate()
  const { redirect } = loginRoute.useSearch()

  return (
    <LoginPage
      onSuccess={() => {
        void navigate({ to: redirect && redirect.startsWith('/') ? redirect : '/' })
      }}
      onHomeClick={() => {
        void navigate({ to: '/' })
      }}
    />
  )
}

export const loginRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/login',
  validateSearch: (search: Record<string, unknown>) => v.parse(loginSearchSchema, search),
  component: LoginRoute,
})
