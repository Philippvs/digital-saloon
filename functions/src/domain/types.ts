export type TimeInterval = {
  start: string
  end: string
}

export type Weekday =
  'monday' | 'tuesday' | 'wednesday' | 'thursday' | 'friday' | 'saturday' | 'sunday'

export type OpeningHoursByWeekday = Record<Weekday, TimeInterval[]>

export type Holiday = {
  startDate: string
  endDate: string
}

export type DayException = {
  date: string
  intervals: TimeInterval[]
  closed: boolean
}

export type BusyInterval = {
  startAt: Date
  endAt: Date
}

export type BookingSettingsInput = {
  slotIntervalMinutes: number
  minAdvanceBookingMinutes: number
  maxAdvanceBookingDays: number
}

export type LocalInterval = {
  /** Inclusive local start as minutes from local midnight. */
  startMinutes: number
  /** Exclusive local end as minutes from local midnight. */
  endMinutes: number
}

export type AvailableSlot = {
  startAt: Date
  endAt: Date
}
