import { useQuery } from '@tanstack/react-query'

import { queryKeyOf } from './queryKeys'

export function useHealthMessage() {
  return useQuery({
    queryKey: queryKeyOf('health'),
    queryFn: async () => 'Template is ready.',
  })
}
