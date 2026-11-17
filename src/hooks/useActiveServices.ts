import { useQuery } from '@tanstack/react-query'

import { fetchActiveServices } from '../data/services'
import { getSalonId } from '../data/salonConfig'
import { queryKeyOf } from './queryKeys'

export function useActiveServices() {
  return useQuery({
    queryKey: queryKeyOf('services', getSalonId(), 'active'),
    queryFn: fetchActiveServices,
  })
}
