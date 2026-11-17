import { useMutation, useQueryClient } from '@tanstack/react-query'

import { createService, updateService } from '../data/services'
import type { ServiceDraft } from '../data/serviceForm'
import { queryKeyOf } from './queryKeys'

export type SaveServiceInput = {
  /** `null` creates a new service. */
  serviceId: string | null
  draft: ServiceDraft
}

export function useSaveService() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async ({ serviceId, draft }: SaveServiceInput): Promise<string> => {
      if (serviceId === null) return createService(draft)
      await updateService(serviceId, draft)
      return serviceId
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: queryKeyOf('services') })
      await queryClient.invalidateQueries({ queryKey: queryKeyOf('availableSlots') })
    },
  })
}
