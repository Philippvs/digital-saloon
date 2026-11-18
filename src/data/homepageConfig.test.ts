import { describe, expect, it } from 'vitest'
import * as v from 'valibot'

import { emptyHomepageConfig, isSectionVisible, resolveGalleryImages } from './homepageConfig'
import { homepageConfigSchema } from './schemas'

const sampleBrandGallery = [
  { src: 'https://example.com/a.jpg', altDe: 'A DE', altIt: 'A IT' },
  { src: 'https://example.com/b.jpg', altDe: 'B DE', altIt: 'B IT' },
]

describe('homepageConfig', () => {
  it('treats all built-in sections as visible when config is missing or empty', () => {
    expect(isSectionVisible(undefined, 'hero')).toBe(true)
    expect(isSectionVisible(emptyHomepageConfig, 'styles')).toBe(true)
    expect(
      isSectionVisible({ hiddenSections: ['styles', 'visit'], customSections: [] }, 'styles'),
    ).toBe(false)
    expect(
      isSectionVisible({ hiddenSections: ['styles', 'visit'], customSections: [] }, 'hero'),
    ).toBe(true)
  })

  it('falls back to brand gallery unless galleryImages is explicitly set', () => {
    expect(resolveGalleryImages(undefined, sampleBrandGallery)).toHaveLength(2)
    expect(resolveGalleryImages(emptyHomepageConfig, sampleBrandGallery)).toHaveLength(2)

    const custom = {
      hiddenSections: [],
      galleryImages: [
        { id: '1', src: 'https://example.com/new.jpg', altDe: 'New', altIt: 'Nuovo' },
      ],
      customSections: [],
    }
    expect(resolveGalleryImages(custom, sampleBrandGallery)).toEqual(custom.galleryImages)

    const cleared = {
      hiddenSections: [],
      galleryImages: [],
      customSections: [],
    }
    expect(resolveGalleryImages(cleared, sampleBrandGallery)).toEqual([])
  })

  it('validates homepageConfigSchema with custom sections and gallery images', () => {
    const valid = {
      hiddenSections: ['visit'],
      galleryImages: [{ id: 'img-1', src: 'https://example.com/1.jpg', altDe: '', altIt: '' }],
      customSections: [
        {
          id: 'sec-1',
          titleDe: 'Aktion',
          titleIt: 'Offerta',
          bodyDe: 'Text DE',
          bodyIt: 'Text IT',
          imageUrl: 'https://example.com/banner.jpg',
        },
      ],
    }
    expect(v.is(homepageConfigSchema, valid)).toBe(true)
  })
})
