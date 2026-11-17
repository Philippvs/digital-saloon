import { addDoc, collection, deleteDoc, doc, getDocs, setDoc } from 'firebase/firestore'
import * as v from 'valibot'

import { firestore } from '../firebase'
import type { Closures } from './openingRules'
import { getSalonId } from './salonConfig'
import { dayExceptionsCollectionPath, holidaysCollectionPath } from './salonPaths'
import { dayExceptionSchema, holidaySchema, type DayException, type Holiday } from './schemas'

/** Holidays and day exceptions (admin-only; customers only see the resulting free slots). */
export async function fetchClosures(): Promise<Closures> {
  const salonId = getSalonId()
  const [holidaysSnap, exceptionsSnap] = await Promise.all([
    getDocs(collection(firestore, holidaysCollectionPath(salonId))),
    getDocs(collection(firestore, dayExceptionsCollectionPath(salonId))),
  ])
  return {
    holidays: holidaysSnap.docs.map((docSnap) => ({
      id: docSnap.id,
      ...v.parse(holidaySchema, docSnap.data()),
    })),
    dayExceptions: exceptionsSnap.docs.map((docSnap) => ({
      id: docSnap.id,
      ...v.parse(dayExceptionSchema, docSnap.data()),
    })),
  }
}

export async function addHoliday(holiday: Holiday): Promise<void> {
  await addDoc(
    collection(firestore, holidaysCollectionPath(getSalonId())),
    v.parse(holidaySchema, holiday),
  )
}

export async function deleteHoliday(holidayId: string): Promise<void> {
  await deleteDoc(doc(firestore, holidaysCollectionPath(getSalonId()), holidayId))
}

/** One exception per date: the document id is the date, so saving again replaces it. */
export async function saveDayException(dayException: DayException): Promise<void> {
  const parsed = v.parse(dayExceptionSchema, dayException)
  await setDoc(doc(firestore, dayExceptionsCollectionPath(getSalonId()), parsed.date), parsed)
}

export async function deleteDayException(exceptionId: string): Promise<void> {
  await deleteDoc(doc(firestore, dayExceptionsCollectionPath(getSalonId()), exceptionId))
}
