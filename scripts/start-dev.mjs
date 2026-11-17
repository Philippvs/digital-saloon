import { execFileSync } from 'node:child_process'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

import { EMULATOR_PORTS, PROJECT_ID } from './emulator-ports.mjs'
import { waitForEmulators } from './lib/emulator-wait.mjs'
import { DEV_APP_PORTS, ensurePortsAvailable, resolveForceFreePorts } from './lib/free-port.mjs'
import { createProcessSupervisor, localBin } from './lib/process-tree.mjs'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const skipBuild = process.env.DEV_SKIP_BUILD === 'true'
const forceFreePorts = resolveForceFreePorts()
const supervisor = createProcessSupervisor({
  label: 'dev',
  ports: DEV_APP_PORTS,
  shutdownTimeoutMs: 15_000,
})

function buildFunctions() {
  if (skipBuild) {
    console.log('[dev] Skipping functions build (DEV_SKIP_BUILD=true)')
    return
  }

  console.log('[dev] Building functions…')
  execFileSync(
    process.platform === 'win32' ? 'npm.cmd' : 'npm',
    ['--prefix', join(root, 'functions'), 'run', 'build'],
    {
      cwd: root,
      stdio: 'inherit',
      shell: process.platform === 'win32',
    },
  )
}

async function seed() {
  await new Promise((resolve, reject) => {
    const child = supervisor.spawn('node', ['scripts/seed-emulator.mjs'], { critical: false })
    child.on('error', reject)
    child.on('exit', (code) => {
      if (code === 0) {
        resolve()
        return
      }
      reject(new Error(`seed-emulator exited with code ${code}`))
    })
  })
}

async function main() {
  buildFunctions()

  console.log('[dev] Checking ports…')
  await ensurePortsAvailable(DEV_APP_PORTS, { force: forceFreePorts })

  console.log('[dev] Starting local Mail-Catcher…')
  const mailCatcherPort = process.env.MAIL_CATCHER_PORT ?? '4105'
  const mailCatcherUrl = `http://127.0.0.1:${mailCatcherPort}/emails`
  supervisor.spawn('node', ['scripts/mail-catcher.mjs'], {
    env: { MAIL_CATCHER_PORT: mailCatcherPort },
    critical: false,
  })

  console.log('[dev] Starting Firebase emulators…')
  supervisor.spawn(
    localBin('firebase'),
    ['emulators:start', '--only', 'auth,firestore,storage,functions,ui', '--project', PROJECT_ID],
    {
      env: {
        MAIL_CATCHER_URL: mailCatcherUrl,
        PUBLIC_APP_URL: `http://127.0.0.1:${EMULATOR_PORTS.app}`,
      },
      critical: true,
    },
  )

  await waitForEmulators()

  console.log('[dev] Seeding emulator…')
  await seed()

  console.log('[dev] Starting Vite…')
  supervisor.spawn(
    localBin('vite'),
    ['--port', String(EMULATOR_PORTS.app), '--host', '127.0.0.1'],
    {
      env: { VITE_USE_FIREBASE_EMULATORS: 'true' },
      critical: true,
    },
  )

  console.log(
    `[dev] Ready at http://127.0.0.1:${EMULATOR_PORTS.app} (Emulator UI: http://127.0.0.1:${EMULATOR_PORTS.ui}, Mail-Catcher: http://127.0.0.1:${mailCatcherPort})`,
  )
}

main().catch((error) => {
  console.error(error)
  process.exit(1)
})
