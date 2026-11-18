import {
  useMutation,
  useQuery,
  useQueryClient,
  type UseMutationResult,
  type UseQueryResult,
} from '@tanstack/react-query'

import { fetchDemoModeStatus, saveDemoMode } from '../data/adminAccessApi'
import { getSalonId } from '../data/salonConfig'
import { queryKeyOf } from './queryKeys'

export function useDemoModeStatus(enabled: boolean): UseQueryResult<{ enabled: boolean }> {
  const salonId = getSalonId()
  return useQuery({
    queryKey: queryKeyOf('demoMode', salonId),
    queryFn: fetchDemoModeStatus,
    enabled,
  })
}

export function useSetDemoMode(): UseMutationResult<{ enabled: boolean }, Error, boolean> {
  const queryClient = useQueryClient()
  const salonId = getSalonId()

  return useMutation({
    mutationFn: saveDemoMode,
    onSuccess: (result) => {
      queryClient.setQueryData(queryKeyOf('demoMode', salonId), result)
      void queryClient.invalidateQueries({ queryKey: queryKeyOf('adminReservations') })
    },
  })
}
