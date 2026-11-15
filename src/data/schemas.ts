import * as v from 'valibot'

/** Search params that are missing or invalid fall back instead of failing the route. */
export function optionalSearchParam<TSchema extends v.GenericSchema>(schema: TSchema) {
  return v.optional(v.fallback(schema, undefined))
}

export const userRoleSchema = v.picklist(['user', 'admin'] as const)
export type UserRole = v.InferOutput<typeof userRoleSchema>

export const userProfileSchema = v.object({
  email: v.pipe(v.string(), v.email()),
  displayName: v.pipe(v.string(), v.minLength(1), v.maxLength(80)),
  role: userRoleSchema,
  createdAt: v.string(),
})
export type UserProfile = v.InferOutput<typeof userProfileSchema>
