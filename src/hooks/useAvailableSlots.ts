import { useQuery } from '@tanstack/react-query'

import { fetchAvailableSlots } from '../data/bookingApi'
import { queryKeyOf } from './queryKeys'

export function useAvailableSlots(input: {
  serviceId: string | null
  fromDateYmd: string | null
  toDateYmd: string | null
}) {
  const enabled = input.serviceId !== null && input.fromDateYmd !== null && input.toDateYmd !== null

  return useQuery({
    queryKey: queryKeyOf('availableSlots', input.serviceId, input.fromDateYmd, input.toDateYmd),
    queryFn: () =>
      fetchAvailableSlots({
        serviceId: input.serviceId!,
        fromDateYmd: input.fromDateYmd!,
        toDateYmd: input.toDateYmd!,
      }),
    enabled,
  })
}
