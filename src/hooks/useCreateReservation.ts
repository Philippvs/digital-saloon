import { useMutation } from '@tanstack/react-query'

import { submitOnlineReservation } from '../data/bookingApi'

export function useCreateReservation() {
  return useMutation({
    mutationFn: submitOnlineReservation,
  })
}
