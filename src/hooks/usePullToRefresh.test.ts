import { describe, expect, it } from 'vitest'

/**
 * Gesture math is covered indirectly via the resisted-pull formula used in the hook.
 * Keep this as a tiny contract so threshold/resistance stay intentional.
 */
function resistedPull(deltaPx: number, maxPullPx: number): number {
  if (deltaPx <= 0) return 0
  return Math.min(maxPullPx, deltaPx * 0.55)
}

describe('pull-to-refresh resistance', () => {
  it('returns 0 for upward or zero movement', () => {
    expect(resistedPull(0, 112)).toBe(0)
    expect(resistedPull(-20, 112)).toBe(0)
  })

  it('applies resistance and caps at maxPullPx', () => {
    expect(resistedPull(100, 112)).toBeCloseTo(55)
    expect(resistedPull(400, 112)).toBe(112)
  })
})
