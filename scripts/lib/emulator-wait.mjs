import { createConnection } from 'node:net'

import { EMULATOR_HOST, EMULATOR_PORTS, FUNCTIONS_REGION, PROJECT_ID } from '../emulator-ports.mjs'

export async function waitForPort(port, host = EMULATOR_HOST, timeoutMs = 180_000) {
  const startedAt = Date.now()

  while (Date.now() - startedAt < timeoutMs) {
    try {
      await new Promise((resolve, reject) => {
        const socket = createConnection({ port, host }, () => {
          socket.end()
          resolve(undefined)
        })
        socket.on('error', reject)
      })
      return
    } catch {
      await new Promise((resolve) => setTimeout(resolve, 500))
    }
  }

  throw new Error(`Timed out waiting for ${host}:${port}`)
}

/**
 * Port-open is not enough: the Functions emulator accepts TCP before callables
 * are registered. Early POSTs then fail CORS preflight (no ACAO header).
 */
export async function waitForCallableFunctions(timeoutMs = 180_000) {
  const url = `http://${EMULATOR_HOST}:${EMULATOR_PORTS.functions}/${PROJECT_ID}/${FUNCTIONS_REGION}/ping`
  const startedAt = Date.now()

  while (Date.now() - startedAt < timeoutMs) {
    try {
      const response = await fetch(url, {
        method: 'OPTIONS',
        headers: {
          Origin: `http://${EMULATOR_HOST}:${EMULATOR_PORTS.app}`,
          'Access-Control-Request-Method': 'POST',
          'Access-Control-Request-Headers': 'content-type,authorization',
        },
      })
      if (response.status === 204 && Boolean(response.headers.get('access-control-allow-origin'))) {
        return
      }
    } catch {
      // Functions worker still booting.
    }
    await new Promise((resolve) => setTimeout(resolve, 500))
  }

  throw new Error(`Timed out waiting for callable functions at ${url}`)
}

export async function waitForEmulators({ waitForUi = true } = {}) {
  await waitForPort(EMULATOR_PORTS.firestore)
  await waitForPort(EMULATOR_PORTS.auth)
  await waitForPort(EMULATOR_PORTS.storage)
  await waitForPort(EMULATOR_PORTS.functions)
  await waitForCallableFunctions()
  if (waitForUi) {
    await waitForPort(EMULATOR_PORTS.ui)
  }
}
