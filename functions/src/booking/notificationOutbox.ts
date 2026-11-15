import type { Firestore, Transaction } from 'firebase-admin/firestore'

import type { NotificationJobType } from '../schemas'

export type EnqueueNotificationInput = {
  type: NotificationJobType
  reservationId: string
  toEmail: string | null
  payload: Record<string, unknown>
  /** Defaults to `${type}:${reservationId}`. */
  idempotencyKey?: string
  now?: Date
}

/**
 * Enqueue a notification job inside an existing transaction.
 * Skips when there is no customer email (nothing to deliver).
 */
export function enqueueNotificationJob(
  tx: Transaction,
  db: Firestore,
  salonId: string,
  input: EnqueueNotificationInput,
): { enqueued: boolean; jobId: string | null } {
  if (input.toEmail == null || input.toEmail.trim().length === 0) {
    return { enqueued: false, jobId: null }
  }

  const now = input.now ?? new Date()
  const createdAt = now.toISOString()
  const idempotencyKey = input.idempotencyKey ?? `${input.type}:${input.reservationId}`
  const jobRef = db.collection('salons').doc(salonId).collection('notificationJobs').doc()

  tx.set(jobRef, {
    type: input.type,
    reservationId: input.reservationId,
    toEmail: input.toEmail.trim(),
    payload: input.payload,
    status: 'PENDING',
    attempts: 0,
    idempotencyKey,
    leaseUntil: null,
    leaseOwner: null,
    lastError: null,
    createdAt,
    updatedAt: createdAt,
  })

  return { enqueued: true, jobId: jobRef.id }
}
