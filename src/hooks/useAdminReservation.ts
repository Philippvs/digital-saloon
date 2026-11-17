import { useQuery } from '@tanstack/react-query'

import { fetchReservationById } from '../data/reservations'
import { getSalonId } from '../data/salonConfig'
import { queryKeyOf } from './queryKeys'

export function useAdminReservation(reservationId: string | null) {
  return useQuery({
    queryKey: queryKeyOf('adminReservation', getSalonId(), reservationId),
    queryFn: () => fetchReservationById(reservationId!),
    enabled: reservationId !== null && reservationId.length > 0,
  })
}
