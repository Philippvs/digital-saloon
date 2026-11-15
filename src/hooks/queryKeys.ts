import type { QueryClient } from '@tanstack/react-query'

export type QueryVisibility = 'public' | 'private'

export const queryRootVisibility = {
  salon: 'public',
  services: 'public',
  bookingSettings: 'private',
  openingHours: 'private',
  userProfile: 'private',
} as const

export type QueryRoot = keyof typeof queryRootVisibility

const checkedVisibility: Readonly<Record<QueryRoot, QueryVisibility>> = queryRootVisibility

export function queryKeyOf<Root extends QueryRoot>(
  root: Root,
  ...parts: readonly unknown[]
): readonly [Root, ...unknown[]] {
  return [root, ...parts]
}

export function isPublicQueryRoot(root: unknown): boolean {
  return (
    typeof root === 'string' &&
    Object.prototype.hasOwnProperty.call(checkedVisibility, root) &&
    checkedVisibility[root as QueryRoot] === 'public'
  )
}

export function clearPrivateQueries(queryClient: QueryClient): void {
  queryClient.removeQueries({
    predicate: (query) => {
      const root = query.queryKey[0]
      return (
        typeof root === 'string' &&
        Object.prototype.hasOwnProperty.call(checkedVisibility, root) &&
        checkedVisibility[root as QueryRoot] === 'private'
      )
    },
  })
}
