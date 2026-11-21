import type { BrandKey } from './types'

/** Sole place that maps `VITE_BRAND` → key (besides intentional tests). */
export function getActiveBrandKey(): BrandKey {
  const raw = import.meta.env.VITE_BRAND
  if (typeof raw === 'string' && raw.trim().toLowerCase() === 'salon1500') {
    return 'salon1500'
  }
  return 'kimm'
}

/** Default Firestore salon ids — kept here so `data/` need not import brand modules. */
export const defaultSalonIdByBrand: Record<BrandKey, string> = {
  kimm: 'pilot',
  salon1500: 'salon1500',
}
