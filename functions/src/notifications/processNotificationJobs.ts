import { randomBytes } from 'node:crypto'

import { getFirestore } from 'firebase-admin/firestore'
import { onCall } from 'firebase-functions/v2/https'
import { onSchedule } from 'firebase-functions/v2/scheduler'

import { assertAdmin } from '../authz'
import { functionsRegion, getSalonId } from '../config'
import { messageForNotificationJob, sendEmail } from './emailTransport'

const LEASE_MS = 60_000
const MAX_ATTEMPTS = 5
const BATCH_LIMIT = 20

type JobDoc = {
  type: string
  reservationId: string
  toEmail: string | null
  payload: Record<string, unknown>
  status: string
  attempts: number
  leaseUntil: string | null
  leaseOwner: string | null
  idempotencyKey: string
}

function canClaim(data: JobDoc, now: Date): boolean {
  if (data.status === 'SENT') return false
  if (data.status === 'FAILED' && data.attempts >= MAX_ATTEMPTS) return false
  if (data.status === 'PENDING' || data.status === 'FAILED') return true
  if (data.status === 'PROCESSING') {
    if (!data.leaseUntil) return true
    return new Date(data.leaseUntil).getTime() <= now.getTime()
  }
  return false
}

export async function processNotificationJobsOnce(input?: {
  salonId?: string
  limit?: number
  now?: Date
}): Promise<{ claimed: number; sent: number; failed: number; skipped: number }> {
  const db = getFirestore()
  const salonId = input?.salonId ?? getSalonId()
  const now = input?.now ?? new Date()
  const limit = input?.limit ?? BATCH_LIMIT
  const owner = randomBytes(8).toString('hex')

  const snap = await db
    .collection('salons')
    .doc(salonId)
    .collection('notificationJobs')
    .where('status', 'in', ['PENDING', 'PROCESSING', 'FAILED'])
    .limit(limit)
    .get()

  let claimed = 0
  let sent = 0
  let failed = 0
  let skipped = 0

  for (const doc of snap.docs) {
    const data = doc.data() as JobDoc
    if (!canClaim(data, now)) {
      skipped += 1
      continue
    }

    const leaseUntil = new Date(now.getTime() + LEASE_MS).toISOString()
    const claimedOk = await db.runTransaction(async (tx) => {
      const fresh = await tx.get(doc.ref)
      if (!fresh.exists) return false
      const row = fresh.data() as JobDoc
      if (!canClaim(row, now)) return false
      if (row.status === 'SENT') return false
      tx.update(doc.ref, {
        status: 'PROCESSING',
        leaseUntil,
        leaseOwner: owner,
        attempts: Number(row.attempts ?? 0) + 1,
        updatedAt: now.toISOString(),
      })
      return true
    })

    if (!claimedOk) {
      skipped += 1
      continue
    }
    claimed += 1

    const fresh = await doc.ref.get()
    const job = fresh.data() as JobDoc
    if (!job.toEmail) {
      await doc.ref.update({
        status: 'FAILED',
        lastError: 'Missing toEmail',
        leaseUntil: null,
        leaseOwner: null,
        updatedAt: new Date().toISOString(),
      })
      failed += 1
      continue
    }

    const result = await sendEmail(
      messageForNotificationJob({
        type: job.type,
        toEmail: job.toEmail,
        payload: job.payload ?? {},
      }),
    )

    if (result.ok) {
      await doc.ref.update({
        status: 'SENT',
        lastError: null,
        leaseUntil: null,
        leaseOwner: null,
        updatedAt: new Date().toISOString(),
        deliveryMode: result.mode,
      })
      sent += 1
      continue
    }

    const attempts = Number(job.attempts ?? 0)
    const terminal = !result.retryable || attempts >= MAX_ATTEMPTS
    await doc.ref.update({
      status: terminal ? 'FAILED' : 'PENDING',
      lastError: result.error,
      leaseUntil: null,
      leaseOwner: null,
      updatedAt: new Date().toISOString(),
    })
    failed += 1
  }

  return { claimed, sent, failed, skipped }
}

export const processNotificationJobs = onCall({ region: functionsRegion }, async (request) => {
  await assertAdmin(request)
  return processNotificationJobsOnce()
})

export const processNotificationJobsSchedule = onSchedule(
  { region: functionsRegion, schedule: 'every 1 minutes' },
  async () => {
    await processNotificationJobsOnce()
  },
)
