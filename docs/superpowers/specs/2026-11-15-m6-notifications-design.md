# M6 Notifications & Pending Expiry — Design

Approved 2026-11-15 with clarifications.

## Goals

- Async email notifications that cannot be lost relative to reservation mutations.
- Pending reservations expire with a distinct `EXPIRED` status.
- Emulator/dev can run without Resend; production must not silently drop mail.
- Launch docs + rules review + E2E; defer live production deploy.

## Outbox

Enqueue `notificationJobs` documents **inside the same Firestore transaction** as create / confirm / decline / cancel / reschedule / expire.

Job fields: `type`, `reservationId`, `toEmail`, `payload`, `status`, `attempts`, `leaseUntil`, `leaseOwner`, `idempotencyKey`, `lastError`, timestamps.

Skip customer enqueue when `toEmail` is null (no email provided).

## Delivery

`processNotificationJobs` (callable + scheduled):

1. Claim PENDING or expired-lease PROCESSING via transaction (`leaseUntil`, `leaseOwner`).
2. Send via Resend HTTP API when `RESEND_API_KEY` is set.
3. Without key: if emulator or `NOTIFICATIONS_ALLOW_LOG_ONLY=true` → log and mark `SENT`; otherwise leave/retry as `FAILED` / requeue — never silent discard in production.
4. Cap attempts; store `lastError`.

## Pending expiry

`processPendingReservations`: PENDING with `createdAt` older than `pendingExpirationHours` → status `EXPIRED`, delete slot lock, enqueue expiry notification — all in one transaction per reservation.

## Rules

`notificationJobs`: client read/write denied (Admin SDK only). Reservations remain admin-read / function-write.
