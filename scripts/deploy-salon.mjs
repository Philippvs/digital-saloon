import { execFileSync } from 'node:child_process'
import { existsSync, readFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const brand = process.argv[2]?.trim()

if (!brand) {
  console.error('Usage: node scripts/deploy-salon.mjs <brand> (e.g. kimm, salon1500)')
  process.exit(1)
}

const envPath = join(root, 'salons', `${brand}.env`)
if (!existsSync(envPath)) {
  console.error(
    `Missing ${envPath}. Copy salons/${brand}.env.example to salons/${brand}.env first.`,
  )
  process.exit(1)
}

function parseEnvFile(filePath) {
  const vars = {}
  for (const line of readFileSync(filePath, 'utf8').split(/\r?\n/)) {
    const trimmed = line.trim()
    if (!trimmed || trimmed.startsWith('#')) continue
    const eq = trimmed.indexOf('=')
    if (eq === -1) continue
    const key = trimmed.slice(0, eq).trim()
    const value = trimmed.slice(eq + 1).trim()
    vars[key] = value
  }
  return vars
}

const salonEnv = parseEnvFile(envPath)
const mergedEnv = { ...process.env, ...salonEnv }
const binExt = process.platform === 'win32' ? '.cmd' : ''
const viteBin = join(root, 'node_modules', '.bin', `vite${binExt}`)
const firebaseBin = join(root, 'node_modules', '.bin', `firebase${binExt}`)

console.log(`[deploy] Building frontend for ${brand}…`)
execFileSync(viteBin, ['build'], {
  cwd: root,
  env: mergedEnv,
  stdio: 'inherit',
  shell: process.platform === 'win32',
})

console.log(`[deploy] Deploying to Firebase alias "${brand}"…`)
execFileSync(firebaseBin, ['deploy', '-P', brand], {
  cwd: root,
  env: mergedEnv,
  stdio: 'inherit',
  shell: process.platform === 'win32',
})
