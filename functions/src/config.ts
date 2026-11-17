const DEFAULT_SALON_ID = 'pilot'
const DEFAULT_TIMEZONE = 'Europe/Vienna'

export function getSalonId(): string {
  const fromEnv = process.env.SALON_ID
  if (typeof fromEnv === 'string' && fromEnv.trim().length > 0) {
    return fromEnv.trim()
  }
  return DEFAULT_SALON_ID
}

export function getDefaultTimezone(): string {
  return DEFAULT_TIMEZONE
}

export const functionsRegion = 'europe-west8' as const
