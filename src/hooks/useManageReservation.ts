import { useMutation, useQuery } from '@tanstack/react-query'

import {
  cancelManagedReservation,
  fetchManagedReservation,
  rescheduleManagedReservation,
} from '../data/bookingApi'
import { queryKeyOf } from './queryKeys'

export function useManageReservation(token: string | null) {
  return useQuery({
    queryKey: queryKeyOf('managedReservation', token),
    queryFn: () => fetchManagedReservation(token!),
    enabled: token !== null && token.length >= 16,
  })
}

export function useCancelReservation() {
  return useMutation({
    mutationFn: cancelManagedReservation,
  })
}

export function useRescheduleReservation() {
  return useMutation({
    mutationFn: rescheduleManagedReservation,
  })
}
