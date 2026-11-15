import { useSyncExternalStore } from 'react'

import {
  defaultSavedBookingsStorage,
  readSavedBookings,
  removeSavedBooking,
  saveBooking,
  SAVED_BOOKINGS_STORAGE_KEY,
  type SavedBooking,
} from '../data/savedBookings'

const listeners = new Set<() => void>()
let cachedSnapshot: SavedBooking[] = readSavedBookings(defaultSavedBookingsStorage())

function emit(): void {
  cachedSnapshot = readSavedBookings(defaultSavedBookingsStorage())
  for (const listener of listeners) listener()
}

function subscribe(listener: () => void): () => void {
  listeners.add(listener)
  if (typeof window !== 'undefined') {
    const onStorage = (event: StorageEvent): void => {
      if (event.key === null || event.key === SAVED_BOOKINGS_STORAGE_KEY) {
        cachedSnapshot = readSavedBookings(defaultSavedBookingsStorage())
        listener()
      }
    }
    window.addEventListener('storage', onStorage)
    return () => {
      listeners.delete(listener)
      window.removeEventListener('storage', onStorage)
    }
  }
  return () => {
    listeners.delete(listener)
  }
}

function getSnapshot(): SavedBooking[] {
  return cachedSnapshot
}

function getServerSnapshot(): SavedBooking[] {
  return cachedSnapshot
}

export function useSavedBookings(): {
  bookings: SavedBooking[]
  save: (input: { token: string; reservationId: string }) => void
  remove: (token: string) => void
} {
  const bookings = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot)

  return {
    bookings,
    save: (input) => {
      saveBooking(input)
      emit()
    },
    remove: (token) => {
      removeSavedBooking(token)
      emit()
    },
  }
}
