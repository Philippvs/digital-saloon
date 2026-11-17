const DEFAULT_SALON_ID = 'pilot'

/** Salon document id for this single-salon deployment. */
export function getSalonId(): string {
  const fromEnv = import.meta.env.VITE_SALON_ID
  if (typeof fromEnv === 'string' && fromEnv.trim().length > 0) {
    return fromEnv.trim()
  }
  return DEFAULT_SALON_ID
}

export const defaultSalonId = DEFAULT_SALON_ID
