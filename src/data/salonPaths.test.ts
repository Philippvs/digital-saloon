import { describe, expect, it } from 'vitest'

import {
  bookingSettingsPath,
  reservationsCollectionPath,
  salonDocPath,
  servicesCollectionPath,
} from './salonPaths'

describe('salonPaths', () => {
  it('builds salon-scoped collection paths', () => {
    expect(salonDocPath('pilot')).toBe('salons/pilot')
    expect(bookingSettingsPath('pilot')).toBe('salons/pilot/settings/booking')
    expect(servicesCollectionPath('pilot')).toBe('salons/pilot/services')
    expect(reservationsCollectionPath('pilot')).toBe('salons/pilot/reservations')
  })
})
