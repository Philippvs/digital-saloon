import { collection, getDocs } from 'firebase/firestore'
import * as v from 'valibot'

import { firestore } from '../firebase'
import { getSalonId } from './salonConfig'
import { openingHoursSchema, weekdaySchema, type OpeningHours, type Weekday } from './schemas'

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
