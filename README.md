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

## Environment files

All real `.env*` files are gitignored; only the `*.example` files are committed. Local dev needs **no** env files — `pnpm dev:local` runs everything against the emulators (`demo-react-firebase-template`).

| File                       | Loaded by                                       | Purpose                                                  |
| -------------------------- | ----------------------------------------------- | -------------------------------------------------------- |
| `.env`                     | Vite, always (dev + build)                      | Local overrides only (`VITE_SALON_ID`, `SEED_*`, …)      |
| `.env.production`          | Vite, `pnpm build` only                         | Firebase Web SDK config for the live project             |
| `functions/.env.kimm-hair` | Firebase CLI, deploys to `kimm-hair` only       | Production Functions config (Resend email)               |
| `functions/.env`           | Firebase CLI, every project **incl. emulators** | Avoid for secrets — the emulators would pick them up too |

Do **not** put the `VITE_FIREBASE_*` values in `.env`: it is also loaded by `pnpm dev:local`, which would point the app at the live project while the emulators run as the demo project.

### `.env.production` (web app → live Firebase project)

```bash
firebase apps:sdkconfig WEB --project kimm-hair   # copy values from the output
```

```dotenv
VITE_FIREBASE_API_KEY=...
VITE_FIREBASE_AUTH_DOMAIN=kimm-hair.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=kimm-hair
VITE_FIREBASE_STORAGE_BUCKET=kimm-hair.firebasestorage.app
VITE_FIREBASE_MESSAGING_SENDER_ID=...
VITE_FIREBASE_APP_ID=...
# VITE_SHOW_PRICES=true
```

### `functions/.env.kimm-hair` (booking emails via Resend)

The file name must match the project ID (`functions/.env.<projectId>`), so it is only used when deploying to that project.

```dotenv
RESEND_API_KEY=re_...                     # Resend → API Keys ("Sending access" is enough)
RESEND_FROM_EMAIL=termine@your-domain.it  # must be on a domain verified in Resend
PUBLIC_APP_URL=https://kimm-hair.web.app  # base URL for manage/cancel links in emails
```

- The sender domain must be verified in Resend (DNS records at your domain registrar). `*.web.app` / `*.firebaseapp.com` cannot be verified.
- Without `RESEND_FROM_EMAIL`, mail is sent from `onboarding@resend.dev`, which Resend only delivers to your own account address.
- Email failures never block a booking — check `firebase functions:log` if emails don't arrive.
- Locally, `scripts/start-dev.mjs` sets `MAIL_CATCHER_URL`, which overrides Resend; open the Mail-Catcher instead of sending real mail.

After changing the file, redeploy: `firebase deploy --only functions --project kimm-hair`.

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

Live project: `kimm-hair` → https://kimm-hair.web.app. Setting up a project from scratch:

1. Create a Firebase project on the Blaze plan; enable Auth (Email/Password), Firestore, Storage, Functions (`europe-west8`).
2. Set `.firebaserc` (`firebase use --add <projectId>`) and create the env files — see [Environment files](#environment-files).
3. (Optional) Functions `SALON_ID` in `functions/.env.<projectId>` (default `pilot`).
4. Deploy rules + indexes: `firebase deploy --only firestore:rules,firestore:indexes,storage`
5. Deploy functions: `firebase deploy --only functions --force` (`--force` sets up the Artifact Registry cleanup policy on first deploy).
6. Build and deploy hosting: `pnpm build && firebase deploy --only hosting`
7. Seed admin user / salon config for the real project (do not reuse emulator-only passwords).

Security notes:

- Reservations / slotLocks are function-mediated; no public reservation PII reads.
- Management tokens are bearer secrets (hash-only at rest); validate every access server-side.
