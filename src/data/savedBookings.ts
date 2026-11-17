/** Browser-local booking bookmarks. Tokens are bearer secrets — never log them. */

export const SAVED_BOOKINGS_STORAGE_KEY = 'salonflow.myBookings.v1'

export type SavedBooking = {
  token: string
  reservationId: string
  savedAt: string
}

export type SavedBookingsStorage = {
  getItem(key: string): string | null
  setItem(key: string, value: string): void
  removeItem(key: string): void
}

function memoryStorage(): SavedBookingsStorage {
  const map = new Map<string, string>()
  return {
    getItem: (key) => map.get(key) ?? null,
    setItem: (key, value) => {
      map.set(key, value)
    },
    removeItem: (key) => {
      map.delete(key)
    },
  }
}

export function defaultSavedBookingsStorage(): SavedBookingsStorage {
  if (typeof window === 'undefined' || !window.localStorage) {
    return memoryStorage()
  }
  return window.localStorage
}

export function readSavedBookings(
  storage: SavedBookingsStorage = defaultSavedBookingsStorage(),
): SavedBooking[] {
  const raw = storage.getItem(SAVED_BOOKINGS_STORAGE_KEY)
  if (!raw) return []
  try {
    const parsed: unknown = JSON.parse(raw)
    if (!Array.isArray(parsed)) return []
    return parsed
      .filter((item): item is SavedBooking => {
        if (!item || typeof item !== 'object') return false
        const row = item as Record<string, unknown>
        return (
          typeof row.token === 'string' &&
          row.token.length >= 16 &&
          typeof row.reservationId === 'string' &&
          row.reservationId.length > 0 &&
          typeof row.savedAt === 'string'
        )
      })
      .map((item) => ({
        token: item.token,
        reservationId: item.reservationId,
        savedAt: item.savedAt,
      }))
  } catch {
    return []
  }
}

export function writeSavedBookings(
  bookings: SavedBooking[],
  storage: SavedBookingsStorage = defaultSavedBookingsStorage(),
): void {
  storage.setItem(SAVED_BOOKINGS_STORAGE_KEY, JSON.stringify(bookings))
}

export function saveBooking(
  input: { token: string; reservationId: string; savedAt?: string },
  storage: SavedBookingsStorage = defaultSavedBookingsStorage(),
): SavedBooking[] {
  const token = input.token.trim()
  const reservationId = input.reservationId.trim()
  if (token.length < 16 || reservationId.length === 0) {
    return readSavedBookings(storage)
  }
  const next: SavedBooking = {
    token,
    reservationId,
    savedAt: input.savedAt ?? new Date().toISOString(),
  }
  const existing = readSavedBookings(storage).filter(
    (item) => item.token !== token && item.reservationId !== reservationId,
  )
  const bookings = [next, ...existing]
  writeSavedBookings(bookings, storage)
  return bookings
}

export function removeSavedBooking(
  token: string,
  storage: SavedBookingsStorage = defaultSavedBookingsStorage(),
): SavedBooking[] {
  const bookings = readSavedBookings(storage).filter((item) => item.token !== token)
  writeSavedBookings(bookings, storage)
  return bookings
}

export function managementPathForToken(token: string): string {
  return `/manage/${encodeURIComponent(token)}`
}

export function absoluteManagementUrl(token: string, origin: string): string {
  return `${origin.replace(/\/$/, '')}${managementPathForToken(token)}`
}
