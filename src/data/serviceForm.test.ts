import { describe, expect, it } from 'vitest'
import * as v from 'valibot'

import { serviceSchema } from './schemas'
import {
  bilingualServiceName,
  emptyServiceFormInput,
  localizedServiceDescription,
  localizedServiceName,
  normalizeServiceDocument,
  parsePriceCents,
  serviceFormInputOf,
  sortServicesForAdmin,
  splitBilingual,
  validateServiceForm,
  type ServiceFormInput,
} from './serviceForm'

const validInput: ServiceFormInput = {
  nameDe: ' Herrenschnitt ',
  nameIt: ' Taglio uomo ',
  descriptionDe: ' Waschen, Schneiden, Finish ',
  descriptionIt: ' Lavaggio, taglio, finish ',
  duration: '30',
  price: '26',
  active: true,
}

describe('splitBilingual / normalizeServiceDocument', () => {
  it('splits Deutsch / Italiano names from the old single field', () => {
    expect(splitBilingual('Herrenschnitt / Taglio uomo')).toEqual({
      de: 'Herrenschnitt',
      it: 'Taglio uomo',
    })
    expect(splitBilingual('Farbe')).toEqual({ de: 'Farbe', it: 'Farbe' })
  })

  it('normalizes legacy documents and already bilingual ones', () => {
    expect(
      normalizeServiceDocument({
        name: 'Herrenschnitt / Taglio uomo',
        description: 'Waschen / Lavaggio',
        durationMinutes: 30,
        priceCents: 2600,
        active: true,
        createdAt: 'a',
        updatedAt: 'b',
      }),
    ).toMatchObject({
      nameDe: 'Herrenschnitt',
      nameIt: 'Taglio uomo',
      descriptionDe: 'Waschen',
      descriptionIt: 'Lavaggio',
    })

    const bilingual = normalizeServiceDocument({
      nameDe: 'Farbe',
      nameIt: 'Colore',
      descriptionDe: '',
      descriptionIt: 'Tinta',
      durationMinutes: 120,
      priceCents: 8500,
      active: true,
      createdAt: 'a',
      updatedAt: 'b',
    })
    expect(v.is(serviceSchema, bilingual)).toBe(true)
    expect(localizedServiceName(bilingual, 'it')).toBe('Colore')
    expect(localizedServiceDescription(bilingual, 'it')).toBe('Tinta')
    expect(localizedServiceDescription(bilingual, 'de')).toBe('')
  })
})

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
  it('trims both languages and converts duration and price', () => {
    const result = validateServiceForm(validInput)
    expect(result).toEqual({
      ok: true,
      value: {
        nameDe: 'Herrenschnitt',
        nameIt: 'Taglio uomo',
        descriptionDe: 'Waschen, Schneiden, Finish',
        descriptionIt: 'Lavaggio, taglio, finish',
        durationMinutes: 30,
        priceCents: 2600,
        active: true,
      },
    })
  })

  it('requires German and Italian names', () => {
    expect(validateServiceForm({ ...validInput, nameDe: ' ', nameIt: '' })).toEqual({
      ok: false,
      issues: {
        nameDe: { kind: 'required' },
        nameIt: { kind: 'required' },
      },
    })
  })

  it('produces data the service schema accepts', () => {
    const result = validateServiceForm(validInput)
    expect(result.ok).toBe(true)
    if (result.ok) {
      const stamped = { ...result.value, createdAt: 'now', updatedAt: 'now' }
      expect(v.is(serviceSchema, stamped)).toBe(true)
      expect(bilingualServiceName(result.value)).toBe('Herrenschnitt / Taglio uomo')
    }
  })

  it('allows empty descriptions and a free service', () => {
    const result = validateServiceForm({
      ...validInput,
      descriptionDe: '',
      descriptionIt: '',
      price: '0',
    })
    expect(result.ok).toBe(true)
  })

  it('keeps the active flag', () => {
    const result = validateServiceForm({ ...validInput, active: false })
    expect(result.ok && result.value.active).toBe(false)
  })

  it('reports every invalid field', () => {
    expect(
      validateServiceForm({
        nameDe: '  ',
        nameIt: 'x'.repeat(121),
        descriptionDe: 'x'.repeat(1001),
        descriptionIt: '',
        duration: '4',
        price: 'gratis',
        active: true,
      }),
    ).toEqual({
      ok: false,
      issues: {
        nameDe: { kind: 'required' },
        nameIt: { kind: 'tooLong', max: 120 },
        descriptionDe: { kind: 'tooLong', max: 1000 },
        duration: { kind: 'range', min: 5, max: 480 },
        price: { kind: 'price' },
      },
    })
  })

  it('starts new services as bookable 30-minute entries', () => {
    expect(validateServiceForm(emptyServiceFormInput)).toEqual({
      ok: false,
      issues: {
        nameDe: { kind: 'required' },
        nameIt: { kind: 'required' },
        price: { kind: 'required' },
      },
    })
  })
})

describe('serviceFormInputOf', () => {
  it('shows prices with a German decimal comma and round-trips', () => {
    const service = {
      nameDe: 'Farbe',
      nameIt: 'Colore',
      descriptionDe: 'Ansatz',
      descriptionIt: 'Radice',
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
    const base = {
      descriptionDe: '',
      descriptionIt: '',
      durationMinutes: 30,
      active: true,
      nameIt: 'x',
    }
    const sorted = sortServicesForAdmin([
      { ...base, nameDe: 'Farbe', priceCents: 8500 },
      { ...base, nameDe: 'Alt', priceCents: 100, active: false },
      { ...base, nameDe: 'Schnitt', priceCents: 2600 },
    ])
    expect(sorted.map((service) => service.nameDe)).toEqual(['Schnitt', 'Farbe', 'Alt'])
  })
})
