import { useMutation, useQueryClient, type UseMutationResult } from '@tanstack/react-query'

import { saveHomepageConfig } from '../data/homepageConfig'
import { getSalonId } from '../data/salonConfig'
import type { HomepageConfig } from '../data/schemas'
import { queryKeyOf } from './queryKeys'

export function useSaveHomepageConfig(): UseMutationResult<void, Error, HomepageConfig> {
  const queryClient = useQueryClient()
  const salonId = getSalonId()

  return useMutation({
    mutationFn: saveHomepageConfig,
    onSuccess: (_data, next) => {
      queryClient.setQueryData(queryKeyOf('homepageConfig', salonId), next)
    },
  })
}
