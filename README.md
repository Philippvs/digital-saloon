# React Firebase Template

GitHub template for new Vite + React + TypeScript + Firebase apps, with the same local emulator DX and agent rules used across your projects.

## Stack

- React 19 + Vite + TypeScript (strict)
- Material UI
- TanStack Router + TanStack Query
- Firebase (Auth, Firestore, Storage, Functions) + Emulator Suite
- Valibot for boundary validation
- `pnpm`, ESLint, Prettier, Vitest, Playwright

## Use as a GitHub template

1. Push this repo to GitHub.
2. Settings → **Template repository**.
3. Create new repos with **Use this template**.

Then replace `demo-react-firebase-template` in `.firebaserc`, `scripts/emulator-ports.mjs`, and `src/data/emulatorPorts.ts`, and fill `.env` from `.env.example`.

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

## Daily development

```bash
pnpm dev:local
```

Starts emulators, seeds a demo user, and Vite:

| URL         | Port                  |
| ----------- | --------------------- |
| App         | http://127.0.0.1:3100 |
| Emulator UI | http://127.0.0.1:4100 |

Demo login (after seed): `demo@example.com` / `password123`

Ports are non-default so this stack can run next to other Firebase projects. Free them with:

```bash
pnpm free:ports
```

Vite only (no emulators): `pnpm dev`

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
pnpm test:e2e           # starts emulators, seeds demo user, runs smoke journeys
```

Specs live in `e2e/`. The webServer entry is `scripts/start-e2e.mjs` (same ports as `dev:local`, no Emulator UI).

## Architecture

Layers (enforced by `src/architecture.test.ts` + ESLint):

`routes` → `pages` → `components` → `hooks` → `data` → `firebase.ts`

Routing APIs stay in `src/routes/`. See `AGENTS.md` and `.cursor/rules/`.

## Agent skills

Project skills live under `.agents/skills/`:

- Firebase basics / auth / Firestore / hosting / rules auditor
- Frontend design

## New Firebase project checklist

1. Create a Firebase project; enable Auth (Email/Password), Firestore, Storage, Functions.
2. Update `.firebaserc` and env vars.
3. Deploy rules: `firebase deploy --only firestore:rules,storage`
4. Deploy functions and hosting when ready.
