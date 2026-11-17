export type ShareLinkInput = {
  url: string
  title: string
  text: string
}

export type ShareLinkResult = 'shared' | 'copied' | 'failed'

export function mailtoShareHref(input: ShareLinkInput): string {
  const subject = encodeURIComponent(input.title)
  const body = encodeURIComponent(`${input.text}\n\n${input.url}`)
  return `mailto:?subject=${subject}&body=${body}`
}

export async function shareOrCopyLink(
  input: ShareLinkInput,
  deps: {
    share?: (data: ShareData) => Promise<void>
    canShare?: (data: ShareData) => boolean
    writeText?: (text: string) => Promise<void>
  } = {},
): Promise<ShareLinkResult> {
  const share =
    deps.share ??
    (typeof navigator !== 'undefined' && navigator.share
      ? navigator.share.bind(navigator)
      : undefined)
  const canShare =
    deps.canShare ??
    (typeof navigator !== 'undefined' && navigator.canShare
      ? navigator.canShare.bind(navigator)
      : undefined)
  const writeText =
    deps.writeText ??
    (typeof navigator !== 'undefined' && navigator.clipboard?.writeText
      ? navigator.clipboard.writeText.bind(navigator.clipboard)
      : undefined)

  const shareData: ShareData = {
    title: input.title,
    text: input.text,
    url: input.url,
  }

  if (share && (!canShare || canShare(shareData))) {
    try {
      await share(shareData)
      return 'shared'
    } catch (error) {
      if (error instanceof DOMException && error.name === 'AbortError') {
        return 'failed'
      }
      // Fall through to clipboard.
    }
  }

  if (writeText) {
    try {
      await writeText(input.url)
      return 'copied'
    } catch {
      return 'failed'
    }
  }

  return 'failed'
}
