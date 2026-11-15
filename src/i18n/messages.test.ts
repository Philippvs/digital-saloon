import { describe, expect, it } from 'vitest'

import { catalogs, translate } from './messages'

describe('i18n catalogs', () => {
  it('has the same keys in de and it', () => {
    expect(Object.keys(catalogs.it).sort()).toEqual(Object.keys(catalogs.de).sort())
  })

  it('interpolates variables', () => {
    expect(translate('de', 'book.durationMinutes', { minutes: 30 })).toBe('30 Min')
    expect(translate('it', 'book.durationMinutes', { minutes: 30 })).toBe('30 min')
  })
})
