import { createConnection } from 'node:net'

import { EMULATOR_HOST, EMULATOR_PORTS } from '../emulator-ports.mjs'

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

export async function waitForEmulators({ waitForUi = true } = {}) {
  await waitForPort(EMULATOR_PORTS.firestore)
  await waitForPort(EMULATOR_PORTS.auth)
  await waitForPort(EMULATOR_PORTS.storage)
  await waitForPort(EMULATOR_PORTS.functions)
  if (waitForUi) {
    await waitForPort(EMULATOR_PORTS.ui)
  }
}
