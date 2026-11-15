import { DEV_APP_PORTS, ensurePortsAvailable } from './lib/free-port.mjs'

console.log('[ports] Freeing local dev ports…')

await ensurePortsAvailable(DEV_APP_PORTS, { force: true })

console.log('[ports] Done.')
