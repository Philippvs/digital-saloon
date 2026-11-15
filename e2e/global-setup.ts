import { execFileSync } from 'node:child_process'
import { join } from 'node:path'

/**
 * Runs after Playwright's webServer is ready.
 * Fail closed unless Auth/Firestore/Storage/Functions + Vite respond locally.
 */
export default function globalSetup(): void {
  execFileSync(process.execPath, [join(process.cwd(), 'scripts', 'assert-e2e-emulators.mjs')], {
    stdio: 'inherit',
    env: process.env,
  })
}
