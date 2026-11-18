import { useQuery, type UseQueryResult } from '@tanstack/react-query'

import { fetchHomepageConfig } from '../data/homepageConfig'
import { getSalonId } from '../data/salonConfig'
import type { HomepageConfig } from '../data/schemas'
import { queryKeyOf } from './queryKeys'

export function useHomepageConfig(): UseQueryResult<HomepageConfig> {
  const salonId = getSalonId()
  return useQuery({
    queryKey: queryKeyOf('homepageConfig', salonId),
    queryFn: fetchHomepageConfig,
  })
}
