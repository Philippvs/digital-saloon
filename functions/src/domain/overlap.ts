/**
 * Half-open style overlap for appointments:
 * adjacent intervals (10:00–10:30 and 10:30–11:00) do not overlap.
 */
export function intervalsOverlap(
  existingStart: Date,
  existingEnd: Date,
  requestedStart: Date,
  requestedEnd: Date,
): boolean {
  return (
    existingStart.getTime() < requestedEnd.getTime() &&
    existingEnd.getTime() > requestedStart.getTime()
  )
}
