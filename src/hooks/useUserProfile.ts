import { useQuery } from '@tanstack/react-query'

import { fetchUserProfile } from '../data/userProfile'
import { queryKeyOf } from './queryKeys'

export function useUserProfile(uid: string | null) {
  return useQuery({
    queryKey: queryKeyOf('userProfile', uid),
    queryFn: async () => {
      if (uid === null) return null
      return fetchUserProfile(uid)
    },
    enabled: uid !== null,
  })
}
