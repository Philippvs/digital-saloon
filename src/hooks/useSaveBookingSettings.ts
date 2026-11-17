import { useMutation, useQueryClient } from '@tanstack/react-query'

import { saveBookingSettings } from '../data/bookingSettings'
import { queryKeyOf } from './queryKeys'

export function useSaveBookingSettings() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: saveBookingSettings,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: queryKeyOf('bookingSettings') })
      await queryClient.invalidateQueries({ queryKey: queryKeyOf('availableSlots') })
    },
  })
}
