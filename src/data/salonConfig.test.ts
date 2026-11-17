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

describe('arePricesVisible', () => {
  afterEach(() => {
    vi.unstubAllEnvs()
    vi.resetModules()
  })

  it('defaults to true when VITE_SHOW_PRICES is unset', async () => {
    vi.stubEnv('VITE_SHOW_PRICES', '')
    const { arePricesVisible } = await import('./salonConfig')
    expect(arePricesVisible()).toBe(true)
  })

  it('returns false when VITE_SHOW_PRICES is false or 0', async () => {
    vi.stubEnv('VITE_SHOW_PRICES', 'false')
    const mod1 = await import('./salonConfig')
    expect(mod1.arePricesVisible()).toBe(false)

    vi.resetModules()
    vi.stubEnv('VITE_SHOW_PRICES', '0')
    const mod2 = await import('./salonConfig')
    expect(mod2.arePricesVisible()).toBe(false)
  })

  it('returns true when VITE_SHOW_PRICES is true', async () => {
    vi.stubEnv('VITE_SHOW_PRICES', 'true')
    const { arePricesVisible } = await import('./salonConfig')
    expect(arePricesVisible()).toBe(true)
  })
})
