import { execFileSync } from 'node:child_process'
import { createConnection } from 'node:net'

import { ALL_LOCAL_PORTS, EMULATOR_HOST } from '../emulator-ports.mjs'

export const DEV_APP_PORTS = [...ALL_LOCAL_PORTS]

/** Default: free occupied ports. Opt out with DEV_KEEP_PORTS=true or DEV_FORCE_FREE_PORTS=false. */
export function resolveForceFreePorts() {
  const keepPorts = process.env.DEV_KEEP_PORTS === 'true'
  return !keepPorts && process.env.DEV_FORCE_FREE_PORTS !== 'false'
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

function canConnect(port, host) {
  return new Promise((resolve) => {
    const socket = createConnection({ port, host })
    socket.setTimeout(1000)
    socket.once('connect', () => {
      socket.destroy()
      resolve(true)
    })
    socket.once('timeout', () => {
      socket.destroy()
      resolve(false)
    })
    socket.once('error', () => resolve(false))
  })
}

function run(command, args) {
  try {
    return execFileSync(command, args, {
      encoding: 'utf8',
      stdio: ['ignore', 'pipe', 'ignore'],
    })
  } catch (error) {
    return typeof error?.stdout === 'string' ? error.stdout : ''
  }
}

export function listListenerPids(port) {
  if (process.platform === 'win32') {
    return []
  }

  const fromLsof = run('lsof', ['-nP', '-t', `-iTCP:${port}`, '-sTCP:LISTEN'])
  const pids = fromLsof.split(/\s+/).filter(Boolean)

  if (pids.length === 0 && process.platform === 'linux') {
    pids.push(
      ...run('fuser', [`${port}/tcp`])
        .split(/\s+/)
        .filter(Boolean),
    )
  }

  return [...new Set(pids.map(Number))].filter((pid) => pid > 0 && pid !== process.pid)
}

function describePid(pid) {
  return (
    run('ps', ['-o', 'command=', '-p', String(pid)])
      .trim()
      .slice(0, 120) || 'unknown'
  )
}

export async function isPortInUse(port, host = EMULATOR_HOST) {
  return listListenerPids(port).length > 0 || (await canConnect(port, host))
}

function signalPids(pids, signal) {
  for (const pid of pids) {
    try {
      process.kill(pid, signal)
    } catch {
      // Process already exited.
    }
  }
}

export function killProcessOnPort(port, { signal = 'SIGTERM' } = {}) {
  signalPids(listListenerPids(port), signal)
}

async function waitUntilFree(port, host, timeoutMs) {
  const deadline = Date.now() + timeoutMs

  while (Date.now() < deadline) {
    if (!(await isPortInUse(port, host))) {
      return true
    }
    await sleep(200)
  }

  return false
}

export async function ensurePortAvailable(port, host = EMULATOR_HOST, { force = false } = {}) {
  if (!(await isPortInUse(port, host))) {
    return
  }

  const pids = listListenerPids(port)
  const owners = pids.map((pid) => `${pid} (${describePid(pid)})`).join(', ') || 'unknown process'

  if (!force) {
    throw new Error(
      `Port ${host}:${port} is already in use by ${owners}. Stop other processes or set DEV_FORCE_FREE_PORTS=true.`,
    )
  }

  console.warn(`[ports] Freeing ${host}:${port} — held by ${owners}`)

  signalPids(pids, 'SIGTERM')
  if (await waitUntilFree(port, host, 3000)) {
    return
  }

  console.warn(`[ports] ${host}:${port} still busy — sending SIGKILL`)
  killProcessOnPort(port, { signal: 'SIGKILL' })
  if (await waitUntilFree(port, host, 5000)) {
    return
  }

  throw new Error(`Port ${host}:${port} is still in use after cleanup (held by ${owners}).`)
}

export async function ensurePortsAvailable(ports, options = {}) {
  const uniquePorts = [...new Set(ports)]
  await Promise.all(uniquePorts.map((port) => ensurePortAvailable(port, EMULATOR_HOST, options)))
}
