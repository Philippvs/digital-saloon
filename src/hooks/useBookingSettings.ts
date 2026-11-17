import { useQuery } from '@tanstack/react-query'

import { fetchBookingSettings } from '../data/bookingSettings'
import { getSalonId } from '../data/salonConfig'
import { queryKeyOf } from './queryKeys'

export function useBookingSettings(enabled: boolean) {
  return useQuery({
    queryKey: queryKeyOf('bookingSettings', getSalonId()),
    queryFn: fetchBookingSettings,
    enabled,
  })
}
