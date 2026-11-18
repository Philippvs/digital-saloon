import { useEffect, useRef, useState, type RefObject } from 'react'

export type UsePullToRefreshOptions = {
  /** Element that owns the gesture (usually the page shell). */
  containerRef: RefObject<HTMLElement | null>
  /** Called when the pull crosses the threshold and the finger lifts. */
  onRefresh: () => void | Promise<void>
  /** Pixels of resisted pull needed to trigger refresh. */
  thresholdPx?: number
  /** Max visual pull distance. */
  maxPullPx?: number
  enabled?: boolean
}

export type UsePullToRefreshResult = {
  pullDistance: number
  refreshing: boolean
}

function isNestedScrollablePulled(target: EventTarget | null): boolean {
  if (!(target instanceof Element)) return false
  let node: Element | null = target
  while (node && node !== document.body) {
    if (node instanceof HTMLElement) {
      const style = window.getComputedStyle(node)
      const canScrollY =
        (style.overflowY === 'auto' || style.overflowY === 'scroll') &&
        node.scrollHeight > node.clientHeight + 1
      if (canScrollY && node.scrollTop > 0) return true
    }
    node = node.parentElement
  }
  return false
}

function prefersTouchUi(): boolean {
  return window.matchMedia('(pointer: coarse)').matches || navigator.maxTouchPoints > 0
}

/**
 * Custom pull-to-refresh for PWAs where `overscroll-behavior: none` disables
 * the browser gesture. Only active at the top of the page on touch devices.
 */
export function usePullToRefresh(options: UsePullToRefreshOptions): UsePullToRefreshResult {
  const { containerRef, onRefresh, thresholdPx = 64, maxPullPx = 112, enabled = true } = options
  const [pullDistance, setPullDistance] = useState(0)
  const [refreshing, setRefreshing] = useState(false)
  const startY = useRef<number | null>(null)
  const pullDistanceRef = useRef(0)
  const refreshingRef = useRef(false)
  const onRefreshRef = useRef(onRefresh)

  useEffect(() => {
    onRefreshRef.current = onRefresh
  }, [onRefresh])

  useEffect(() => {
    refreshingRef.current = refreshing
  }, [refreshing])

  useEffect(() => {
    const node = containerRef.current
    if (!node || !enabled || !prefersTouchUi()) return

    const setPull = (value: number): void => {
      pullDistanceRef.current = value
      setPullDistance(value)
    }

    const reset = (): void => {
      startY.current = null
      setPull(0)
    }

    const onTouchStart = (event: TouchEvent): void => {
      if (refreshingRef.current) return
      if (window.scrollY > 1) return
      if (isNestedScrollablePulled(event.target)) return
      startY.current = event.touches[0]?.clientY ?? null
    }

    const onTouchMove = (event: TouchEvent): void => {
      if (refreshingRef.current || startY.current === null) return
      if (window.scrollY > 1) {
        reset()
        return
      }
      const currentY = event.touches[0]?.clientY ?? startY.current
      const delta = currentY - startY.current
      if (delta <= 0) {
        setPull(0)
        return
      }
      const resisted = Math.min(maxPullPx, delta * 0.55)
      if (resisted >= 8) {
        event.preventDefault()
      }
      setPull(resisted)
    }

    const onTouchEnd = (): void => {
      if (refreshingRef.current) {
        reset()
        return
      }
      const shouldRefresh = pullDistanceRef.current >= thresholdPx
      if (!shouldRefresh) {
        reset()
        return
      }
      setRefreshing(true)
      setPull(Math.min(52, maxPullPx * 0.45))
      void Promise.resolve(onRefreshRef.current())
        .catch(() => undefined)
        .finally(() => {
          setRefreshing(false)
          reset()
        })
    }

    node.addEventListener('touchstart', onTouchStart, { passive: true })
    node.addEventListener('touchmove', onTouchMove, { passive: false })
    node.addEventListener('touchend', onTouchEnd)
    node.addEventListener('touchcancel', reset)
    return () => {
      node.removeEventListener('touchstart', onTouchStart)
      node.removeEventListener('touchmove', onTouchMove)
      node.removeEventListener('touchend', onTouchEnd)
      node.removeEventListener('touchcancel', reset)
    }
  }, [containerRef, enabled, maxPullPx, thresholdPx])

  return {
    pullDistance: refreshing ? Math.max(pullDistance, 48) : pullDistance,
    refreshing,
  }
}
