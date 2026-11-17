import { useMutation, useQueryClient } from '@tanstack/react-query'

import { saveSalonDetails } from '../data/salon'
import { queryKeyOf } from './queryKeys'

export function useSaveSalonDetails() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: saveSalonDetails,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: queryKeyOf('salon') })
    },
  })
}
