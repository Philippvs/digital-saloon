import { createConnection } from 'node:net'

import { EMULATOR_HOST, EMULATOR_PORTS } from './emulator-ports.mjs'

function canConnect(port) {
  return new Promise((resolve) => {
    const socket = createConnection({ port, host: EMULATOR_HOST })
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

const required = [
  ['auth', EMULATOR_PORTS.auth],
  ['firestore', EMULATOR_PORTS.firestore],
  ['storage', EMULATOR_PORTS.storage],
  ['functions', EMULATOR_PORTS.functions],
  ['app', EMULATOR_PORTS.app],
]

const missing = []
for (const [name, port] of required) {
  if (!(await canConnect(port))) {
    missing.push(`${name}:${port}`)
  }
}

if (missing.length > 0) {
  console.error(`[e2e] Emulators/app not reachable: ${missing.join(', ')}`)
  process.exit(1)
}

console.log('[e2e] Emulators and app are reachable.')
