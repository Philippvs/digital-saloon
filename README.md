# SalonFlow

Single-salon online appointment booking (pilot MVP) on the React + Firebase template stack.

Customers book without an account via a single-page, step-based wizard (`/book`; `/` redirects there).
Administrators manage services, hours, and reservations after sign-in.

## Stack

- React 19 + Vite + TypeScript (strict)
- Material UI
- TanStack Router + TanStack Query
- Firebase (Auth, Firestore, Storage, Functions) + Emulator Suite
- Valibot for boundary validation
- `pnpm`, ESLint, Prettier, Vitest, Playwright

## Prerequisites

- Node 22+
- `pnpm`
- Java 21+ (Firestore emulator)

## Setup

```bash
pnpm install
npm --prefix functions ci
cp .env.example .env
```

Optional salon overrides (see `.env.example`): `VITE_SALON_ID`, `SEED_SALON_NAME`, `SEED_SALON_TIMEZONE` (default `Europe/Vienna`), `SEED_ADMIN_EMAIL`.

## Daily development

```bash
pnpm start
```

Alias: `pnpm start:local` / `pnpm dev:local`. Frees occupied ports, starts emulators, seeds the pilot salon + admin, then Vite:

| URL         | Port                  |
| ----------- | --------------------- |
| App         | http://127.0.0.1:3100 |
| Emulator UI | http://127.0.0.1:4100 |

Demo admin (after seed): `admin@salonflow.local` / `password123`

Ports are non-default so this stack can run next to other Firebase projects. Free them with:

```bash
pnpm free:ports
```

Vite only (no emulators): `pnpm dev`

## Milestone status

| Slice | Scope                                       | Status |
| ----- | ------------------------------------------- | ------ |
| M1    | Foundation, seed, rules, admin gate         | Done   |
| M2    | Config data access (services, settings)     | Done   |
| M3    | Availability engine + transactional booking | Done   |
| M4    | Customer booking + manage-by-token          | Done   |
| M5    | Admin calendar, confirm/decline, manual     | Done   |
| M6    | Notifications, pending expiry, launch       | Done   |

## Scripts

| Script                               | Purpose                                   |
| ------------------------------------ | ----------------------------------------- |
| `pnpm dev:local`                     | Emulators + seed + Vite                   |
| `pnpm free:ports`                    | Kill listeners on template ports          |
| `pnpm emulators`                     | Emulators only                            |
| `pnpm seed`                          | Seed running emulators                    |
| `pnpm typecheck` / `lint` / `format` | Quality                                   |
| `pnpm test`                          | Vitest (architecture, schemas, port sync) |
| `pnpm test:e2e`                      | Playwright against emulators + Vite       |
| `pnpm test:e2e:install`              | Install Chromium for Playwright           |
| `pnpm verify`                        | Unit/build gate                           |
| `pnpm verify:e2e`                    | `verify` + Playwright                     |
| `pnpm build` / `deploy`              | Hosting build / deploy                    |

### Playwright

```bash
pnpm test:e2e:install   # once
pnpm test:e2e           # starts emulators, seeds, runs smoke journeys
```

Specs live in `e2e/`. The webServer entry is `scripts/start-e2e.mjs` (same ports as `dev:local`, no Emulator UI).

## Architecture

Layers (enforced by `src/architecture.test.ts` + ESLint):

`routes` → `pages` → `components` → `hooks` → `data` → `firebase.ts`

- Public: salon profile + active services via Firestore
- Occupancy changes: Cloud Functions + Firestore transactions
- Availability math: pure domain under `functions/src/domain/`

Routing APIs stay in `src/routes/`. See `AGENTS.md` and `.cursor/rules/`.

## Agent skills

Project skills live under `.agents/skills/`:

- Firebase basics / auth / Firestore / hosting / rules auditor
- Frontend design

## Customer booking links (no email/SMS provider)

- Each booking creates a cryptographically secure management token; Firestore stores only the SHA-256 hash.
- After booking, the personal `/manage/{token}` URL is shown prominently (copy / Web Share / optional `mailto:` to the customer’s own mail app).
- Successful bookings are saved in `localStorage` and listed under **Meine Termine** (`/my-bookings`). Details are always loaded via Cloud Functions — never trusted from local storage alone.
- Pending requests older than `pendingExpirationHours` become `EXPIRED` via `processPendingReservations` (callable + schedule). Admin **Wartung** can trigger this manually.

## Firebase project checklist / deploy

Live production deploy is intentionally deferred for this MVP slice. When you are ready:

1. Create a Firebase project; enable Auth (Email/Password), Firestore, Storage, Functions (`europe-west8`).
2. Copy `.env.example` → `.env` / Functions env: `SALON_ID`.
3. Update `.firebaserc` and Vite `VITE_FIREBASE_*` values.
4. Deploy rules + indexes: `firebase deploy --only firestore:rules,firestore:indexes,storage`
5. Deploy functions: `firebase deploy --only functions` (schedulers need Blaze).
6. Build and deploy hosting: `pnpm build && firebase deploy --only hosting`
7. Seed admin user / salon config for the real project (do not reuse emulator-only passwords).

Security notes:

- Reservations / slotLocks are function-mediated; no public reservation PII reads.
- Management tokens are bearer secrets (hash-only at rest); validate every access server-side.
