import { useQuery } from '@tanstack/react-query'

import { fetchAllServices } from '../data/services'
import { getSalonId } from '../data/salonConfig'
import { queryKeyOf } from './queryKeys'

export function useAllServices(enabled: boolean) {
  return useQuery({
    queryKey: queryKeyOf('services', getSalonId(), 'all'),
    queryFn: fetchAllServices,
    enabled,
  })
}
