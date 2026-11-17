# M6 Notifications & Pending Expiry Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Transactional email outbox, Resend/log delivery with safe claiming, and atomic pending→EXPIRED processing for SalonFlow MVP launch readiness (no live deploy).

**Architecture:** Reservation mutations enqueue `notificationJobs` in the same Firestore transaction. Callables `processNotificationJobs` and `processPendingReservations` (also scheduled) claim/process with leases. Email transport is a thin Resend HTTP client; log-only only when emulator or explicit `NOTIFICATIONS_ALLOW_LOG_ONLY`.

**Tech Stack:** Cloud Functions v2 (`onCall` + `onSchedule`), Firestore transactions, Resend REST via `fetch` (no new npm dependency), Vitest/node:test + Playwright.

**Spec:** `docs/superpowers/specs/2026-11-15-m6-notifications-design.md`

## Global Constraints

- Layers: `routes → pages → components → hooks → data → firebase.ts`; functions domain in `functions/src/`.
- No new npm deps unless justified; Resend via `fetch`.
- Customers never log in; admin-only Auth.
- Notification failure must not roll back a committed reservation (outbox is in-tx so enqueue failure fails the mutation — preferred over silent loss).
- Europe/Vienna from salon config; `pendingExpirationHours` from booking settings.

## Review Focus

- Concurrent processors claiming the same job → only one sends.
- Production without `RESEND_API_KEY` → jobs not marked SENT.
- Expire vs decline distinguishable in UI/API (`EXPIRED`).
- Create without email → no customer job enqueued.
- Idempotent re-process of already SENT jobs → no duplicate send.

---

### Task 1: Schema + status labels

**Files:**

- Modify: `src/data/schemas.ts`, `functions/src/schemas.ts`, `src/data/reservationStatus.ts`, `src/data/schemas.test.ts`
- Modify: notification job schema (lease + idempotencyKey)

- [x] Add `EXPIRED` to reservation status picklists and German label
- [x] Extend `notificationJobSchema` with `idempotencyKey`, `leaseUntil`, `leaseOwner`
- [ ] `pnpm test` schemas pass

### Task 2: Outbox helper + wire mutations

**Files:**

- Create: `functions/src/booking/notificationOutbox.ts`
- Modify: `reservationWrite.ts`, `adminActions.ts`, `customerActions.ts`

- [ ] `enqueueNotificationJob(tx, …)` writes job with PENDING + idempotencyKey
- [ ] Create/confirm/decline/cancel/reschedule enqueue in same tx
- [ ] Unit test: create with email writes job; without email skips

### Task 3: Email transport + processor

**Files:**

- Create: `functions/src/notifications/emailTransport.ts`, `functions/src/notifications/processNotificationJobs.ts`
- Modify: `functions/src/index.ts`, `functions/src/config.ts`

- [ ] Transport: Resend when keyed; log-only only if emulator/`NOTIFICATIONS_ALLOW_LOG_ONLY`
- [ ] Claim with lease transaction; retries; mark SENT/FAILED
- [ ] Export callable (+ schedule every 1 min)
- [ ] Unit/integration test for claim + log-only path

### Task 4: Pending expiry

**Files:**

- Create: `functions/src/booking/processPendingReservations.ts`
- Modify: `functions/src/index.ts`

- [ ] Expire PENDING past cutoff → EXPIRED + unlock + enqueue notify atomically
- [ ] Callable + schedule
- [ ] Test with seeded old pending reservation

### Task 5: Rules, E2E, README, verify

**Files:**

- Modify: `firestore.rules` (comment/review; keep jobs client-denied; optional admin read)
- Create: `e2e/notifications.spec.ts`
- Modify: `README.md`, `.env.example`

- [ ] E2E: book with email → job exists; force-expire seed → EXPIRED
- [ ] README deploy + env config
- [ ] `pnpm verify` + `pnpm verify:e2e`
- [ ] Commit M6
