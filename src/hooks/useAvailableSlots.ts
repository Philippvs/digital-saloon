import { useQuery } from '@tanstack/react-query'

import { fetchAvailableSlots } from '../data/bookingApi'
import { queryKeyOf } from './queryKeys'

export function useAvailableSlots(input: {
  serviceId: string | null
  fromDateYmd: string | null
  toDateYmd: string | null
  enforceAdvanceRestrictions?: boolean
}) {
  const enabled = input.serviceId !== null && input.fromDateYmd !== null && input.toDateYmd !== null
  const enforceAdvanceRestrictions = input.enforceAdvanceRestrictions !== false

  return useQuery({
    queryKey: queryKeyOf(
      'availableSlots',
      input.serviceId,
      input.fromDateYmd,
      input.toDateYmd,
      enforceAdvanceRestrictions,
    ),
    queryFn: () =>
      fetchAvailableSlots({
        serviceId: input.serviceId!,
        fromDateYmd: input.fromDateYmd!,
        toDateYmd: input.toDateYmd!,
        enforceAdvanceRestrictions,
      }),
    enabled,
  })
}
