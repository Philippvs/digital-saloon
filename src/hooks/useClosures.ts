import { useQuery } from '@tanstack/react-query'

import { fetchClosures } from '../data/closures'
import { getSalonId } from '../data/salonConfig'
import { queryKeyOf } from './queryKeys'

export function useClosures(enabled: boolean) {
  return useQuery({
    queryKey: queryKeyOf('closures', getSalonId()),
    queryFn: fetchClosures,
    enabled,
  })
}
