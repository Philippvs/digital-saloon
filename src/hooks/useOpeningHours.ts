import { useQuery } from '@tanstack/react-query'

import { fetchOpeningHours } from '../data/openingHours'
import { getSalonId } from '../data/salonConfig'
import { queryKeyOf } from './queryKeys'

export function useOpeningHours(enabled: boolean) {
  return useQuery({
    queryKey: queryKeyOf('openingHours', getSalonId()),
    queryFn: fetchOpeningHours,
    enabled,
  })
}
