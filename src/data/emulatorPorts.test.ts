import { readFileSync } from 'node:fs'
import { join } from 'node:path'
import { describe, expect, it } from 'vitest'

import { emulatorPorts } from './emulatorPorts'

describe('emulatorPorts', () => {
  it('matches firebase.json emulator ports', () => {
    const firebase = JSON.parse(readFileSync(join(process.cwd(), 'firebase.json'), 'utf8')) as {
      emulators: Record<string, { port?: number }>
    }

    expect(firebase.emulators.auth.port).toBe(emulatorPorts.auth)
    expect(firebase.emulators.firestore.port).toBe(emulatorPorts.firestore)
    expect(firebase.emulators.storage.port).toBe(emulatorPorts.storage)
    expect(firebase.emulators.functions.port).toBe(emulatorPorts.functions)
    expect(firebase.emulators.ui.port).toBe(emulatorPorts.ui)
    expect(firebase.emulators.hub.port).toBe(emulatorPorts.hub)
    expect(firebase.emulators.logging.port).toBe(emulatorPorts.logging)
  })

  it('matches scripts/emulator-ports.mjs', () => {
    const source = readFileSync(join(process.cwd(), 'scripts/emulator-ports.mjs'), 'utf8')
    for (const [name, port] of Object.entries(emulatorPorts)) {
      expect(source).toContain(`${name}: ${port}`)
    }
  })
})
