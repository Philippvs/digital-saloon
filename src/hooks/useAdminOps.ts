import { useMutation } from '@tanstack/react-query'

import { processNotificationJobsAdmin, processPendingReservationsAdmin } from '../data/adminOpsApi'

export function useAdminOps() {
  const processNotifications = useMutation({
    mutationFn: processNotificationJobsAdmin,
  })
  const processPending = useMutation({
    mutationFn: processPendingReservationsAdmin,
  })

  return { processNotifications, processPending }
}
