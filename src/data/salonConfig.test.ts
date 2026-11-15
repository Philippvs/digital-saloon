import { afterEach, describe, expect, it, vi } from 'vitest'

describe('getSalonId', () => {
  afterEach(() => {
    vi.unstubAllEnvs()
    vi.resetModules()
  })

  it('defaults to pilot when VITE_SALON_ID is unset', async () => {
    vi.stubEnv('VITE_SALON_ID', '')
    const { getSalonId } = await import('./salonConfig')
    expect(getSalonId()).toBe('pilot')
  })

  it('reads VITE_SALON_ID when set', async () => {
    vi.stubEnv('VITE_SALON_ID', 'wien-mitte')
    const { getSalonId } = await import('./salonConfig')
    expect(getSalonId()).toBe('wien-mitte')
  })
})
