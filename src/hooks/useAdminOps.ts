import { useMutation } from '@tanstack/react-query'

import { processPendingReservationsAdmin } from '../data/adminOpsApi'

export function useAdminOps() {
  const processPending = useMutation({
    mutationFn: processPendingReservationsAdmin,
  })

  return { processPending }
}
