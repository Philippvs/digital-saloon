import { spawn } from 'node:child_process'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

import { ensurePortsAvailable } from './free-port.mjs'

const root = join(dirname(fileURLToPath(import.meta.url)), '..', '..')

export function localBin(name) {
  return join(root, 'node_modules', '.bin', process.platform === 'win32' ? `${name}.cmd` : name)
}

function isRunning(child) {
  return child.exitCode === null && child.signalCode === null
}

function signalGroup(child, signal) {
  try {
    process.kill(process.platform === 'win32' ? child.pid : -child.pid, signal)
  } catch {
    try {
      child.kill(signal)
    } catch {
      // Process already exited.
    }
  }
}

function waitForExit(child, timeoutMs) {
  if (!isRunning(child)) {
    return Promise.resolve(true)
  }

  return new Promise((resolve) => {
    const timer = setTimeout(() => resolve(false), timeoutMs)
    child.once('exit', () => {
      clearTimeout(timer)
      resolve(true)
    })
  })
}

export function createProcessSupervisor({
  label,
  cwd = root,
  ports = [],
  shutdownTimeoutMs = 15_000,
}) {
  const children = []
  let shutdownPromise = null

  function spawnTracked(command, args, { env = {}, stdio = 'inherit', critical = false } = {}) {
    const child = spawn(command, args, {
      cwd,
      stdio,
      shell: false,
      detached: process.platform !== 'win32',
      env: {
        ...process.env,
        NODE_OPTIONS: '--dns-result-order=ipv4first',
        ...env,
      },
    })

    children.push(child)
    child.on('exit', (code, signal) => {
      if (critical && !shutdownPromise) {
        console.error(
          `[${label}] ${command} ${args[0] ?? ''} exited unexpectedly (code ${code}, signal ${signal})`,
        )
        void shutdown(code || 1)
      }
    })
    return child
  }

  async function shutdown(exitCode = 0) {
    if (shutdownPromise) {
      return shutdownPromise
    }

    shutdownPromise = (async () => {
      console.log(`[${label}] Shutting down…`)
      const running = children.filter(isRunning)

      for (const child of running) {
        try {
          child.kill('SIGTERM')
        } catch {
          // Process already exited.
        }
      }

      const exited = await Promise.all(
        running.map((child) => waitForExit(child, shutdownTimeoutMs)),
      )

      running.forEach((child, index) => {
        if (!exited[index]) {
          console.warn(
            `[${label}] Process ${child.pid} did not stop in ${shutdownTimeoutMs}ms — killing`,
          )
        }
        signalGroup(child, 'SIGKILL')
      })

      try {
        await ensurePortsAvailable(ports, { force: true })
      } catch (error) {
        console.error(`[${label}] ${error.message}`)
        exitCode ||= 1
      }

      process.exit(exitCode)
    })()

    return shutdownPromise
  }

  function forceKillAll() {
    for (const child of children) {
      if (isRunning(child)) {
        signalGroup(child, 'SIGKILL')
      }
    }
  }

  let signalCount = 0
  function onSignal() {
    signalCount += 1
    if (signalCount === 1) {
      void shutdown(0)
      return
    }

    console.warn(`[${label}] Second signal — force killing children`)
    forceKillAll()
    process.exit(130)
  }

  process.on('SIGINT', onSignal)
  process.on('SIGTERM', onSignal)
  process.on('SIGHUP', onSignal)
  process.on('exit', forceKillAll)

  return { spawn: spawnTracked, shutdown }
}
