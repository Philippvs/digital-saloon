import { describe, expect, it } from 'vitest'
import * as v from 'valibot'

import { optionalSearchParam, userProfileSchema } from './schemas'

describe('schemas', () => {
  it('accepts a valid user profile', () => {
    const profile = v.parse(userProfileSchema, {
      email: 'demo@example.com',
      displayName: 'Demo User',
      role: 'user',
      createdAt: '2026-01-01T00:00:00.000Z',
    })

    expect(profile.role).toBe('user')
  })

  it('falls back missing optional search params', () => {
    const schema = v.object({
      redirect: optionalSearchParam(v.pipe(v.string(), v.minLength(1))),
    })

    expect(v.parse(schema, {})).toEqual({ redirect: undefined })
    expect(v.parse(schema, { redirect: '/home' })).toEqual({ redirect: '/home' })
  })
})
