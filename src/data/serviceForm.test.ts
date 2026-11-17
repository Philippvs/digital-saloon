import { describe, expect, it } from 'vitest'
import * as v from 'valibot'

import { serviceSchema } from './schemas'
import {
  emptyServiceFormInput,
  parsePriceCents,
  serviceFormInputOf,
  sortServicesForAdmin,
  validateServiceForm,
  type ServiceFormInput,
} from './serviceForm'

const validInput: ServiceFormInput = {
  name: ' Herrenschnitt / Taglio uomo ',
  description: ' Waschen, Schneiden, Finish ',
  duration: '30',
  price: '26',
  active: true,
}

describe('parsePriceCents', () => {
  it.each([
    ['26', 2600],
    ['26,5', 2650],
    ['26,50', 2650],
    ['26.05', 2605],
    ['0', 0],
    [' 48 € ', 4800],
    ['€ 9,90', 990],
  ])('reads %j as %i cents', (raw, cents) => {
    expect(parsePriceCents(raw)).toBe(cents)
  })

  it.each(['', 'abc', '-5', '26,555', '1.000,00', '26,', '10000'])('rejects %j', (raw) => {
    expect(parsePriceCents(raw)).toBeNull()
  })
})

describe('validateServiceForm', () => {
  it('trims text and converts duration and price', () => {
    const result = validateServiceForm(validInput)
    expect(result).toEqual({
      ok: true,
      value: {
        name: 'Herrenschnitt / Taglio uomo',
        description: 'Waschen, Schneiden, Finish',
        durationMinutes: 30,
        priceCents: 2600,
        active: true,
      },
    })
  })

  it('produces data the service schema accepts', () => {
    const result = validateServiceForm(validInput)
    expect(result.ok).toBe(true)
    if (result.ok) {
      const stamped = { ...result.value, createdAt: 'now', updatedAt: 'now' }
      expect(v.is(serviceSchema, stamped)).toBe(true)
    }
  })

  it('allows an empty description and a free service', () => {
    const result = validateServiceForm({ ...validInput, description: '', price: '0' })
    expect(result.ok).toBe(true)
  })

  it('keeps the active flag', () => {
    const result = validateServiceForm({ ...validInput, active: false })
    expect(result.ok && result.value.active).toBe(false)
  })

  it('reports every invalid field', () => {
    expect(
      validateServiceForm({
        name: '  ',
        description: 'x'.repeat(1001),
        duration: '4',
        price: 'gratis',
        active: true,
      }),
    ).toEqual({
      ok: false,
      issues: {
        name: { kind: 'required' },
        description: { kind: 'tooLong', max: 1000 },
        duration: { kind: 'range', min: 5, max: 480 },
        price: { kind: 'price' },
      },
    })
  })

  it.each(['481', '0', '30.5', ''])('rejects duration %j', (duration) => {
    const result = validateServiceForm({ ...validInput, duration })
    expect(result).toEqual({
      ok: false,
      issues: { duration: { kind: 'range', min: 5, max: 480 } },
    })
  })

  it('requires a price and limits the name', () => {
    expect(validateServiceForm({ ...validInput, price: ' ' })).toEqual({
      ok: false,
      issues: { price: { kind: 'required' } },
    })
    expect(validateServiceForm({ ...validInput, name: 'x'.repeat(121) })).toEqual({
      ok: false,
      issues: { name: { kind: 'tooLong', max: 120 } },
    })
  })

  it('starts new services as bookable 30-minute entries', () => {
    expect(validateServiceForm(emptyServiceFormInput)).toEqual({
      ok: false,
      issues: { name: { kind: 'required' }, price: { kind: 'required' } },
    })
  })
})

describe('serviceFormInputOf', () => {
  it('shows prices with a German decimal comma and round-trips', () => {
    const service = {
      name: 'Farbe / Colore',
      description: 'Ansatz',
      durationMinutes: 120,
      priceCents: 8505,
      active: false,
    }
    const input = serviceFormInputOf(service)
    expect(input.price).toBe('85,05')
    expect(serviceFormInputOf({ ...service, priceCents: 8500 }).price).toBe('85')
    expect(validateServiceForm(input)).toEqual({ ok: true, value: service })
  })
})

describe('sortServicesForAdmin', () => {
  it('lists bookable services by price and inactive ones last', () => {
    const base = { description: '', durationMinutes: 30, active: true }
    const sorted = sortServicesForAdmin([
      { ...base, name: 'Farbe', priceCents: 8500 },
      { ...base, name: 'Alt', priceCents: 100, active: false },
      { ...base, name: 'Schnitt', priceCents: 2600 },
    ])
    expect(sorted.map((service) => service.name)).toEqual(['Schnitt', 'Farbe', 'Alt'])
  })
})
