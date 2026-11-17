import { collection, doc, getDocs, writeBatch } from 'firebase/firestore'
import * as v from 'valibot'

import { firestore } from '../firebase'
import { getSalonId } from './salonConfig'
import { openingHoursDocPath } from './salonPaths'
import {
  openingHoursSchema,
  timeIntervalSchema,
  weekdaySchema,
  type OpeningHours,
  type TimeInterval,
  type Weekday,
} from './schemas'

export type OpeningHoursByWeekday = Record<Weekday, OpeningHours>

export async function fetchOpeningHours(): Promise<OpeningHoursByWeekday> {
  const salonId = getSalonId()
  const snap = await getDocs(collection(firestore, `salons/${salonId}/openingHours`))
  const result = {} as OpeningHoursByWeekday

  for (const docSnap of snap.docs) {
    const weekday = v.parse(weekdaySchema, docSnap.id)
    result[weekday] = v.parse(openingHoursSchema, docSnap.data())
  }

  return result
}

export async function saveOpeningHours(hours: Record<Weekday, TimeInterval[]>): Promise<void> {
  const salonId = getSalonId()
  const batch = writeBatch(firestore)
  for (const weekday of weekdaySchema.options) {
    const intervals = v.parse(v.array(timeIntervalSchema), hours[weekday] ?? [])
    batch.set(doc(firestore, openingHoursDocPath(salonId, weekday)), { intervals })
  }
  await batch.commit()
}
