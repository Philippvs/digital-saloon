import { useQuery } from '@tanstack/react-query'

import { fetchSalon } from '../data/salon'
import { getSalonId } from '../data/salonConfig'
import { queryKeyOf } from './queryKeys'

export function useSalon() {
  return useQuery({
    queryKey: queryKeyOf('salon', getSalonId()),
    queryFn: fetchSalon,
  })
}
