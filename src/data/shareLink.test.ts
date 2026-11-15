import { describe, expect, it, vi } from 'vitest'

import { mailtoShareHref, shareOrCopyLink } from './shareLink'

describe('shareLink', () => {
  it('builds a mailto href with subject and body', () => {
    const href = mailtoShareHref({
      url: 'https://example.com/manage/abc',
      title: 'Mein Termin',
      text: 'Bitte speichern',
    })
    expect(href.startsWith('mailto:?')).toBe(true)
    expect(href).toContain('subject=')
    expect(href).toContain('body=')
    expect(decodeURIComponent(href)).toContain('https://example.com/manage/abc')
  })

  it('prefers Web Share when available', async () => {
    const share = vi.fn(async () => undefined)
    const result = await shareOrCopyLink(
      { url: 'https://x.test/m/1', title: 't', text: 'x' },
      { share, canShare: () => true },
    )
    expect(result).toBe('shared')
    expect(share).toHaveBeenCalled()
  })

  it('falls back to clipboard copy', async () => {
    const writeText = vi.fn(async () => undefined)
    const result = await shareOrCopyLink(
      { url: 'https://x.test/m/1', title: 't', text: 'x' },
      { writeText },
    )
    expect(result).toBe('copied')
    expect(writeText).toHaveBeenCalledWith('https://x.test/m/1')
  })
})
