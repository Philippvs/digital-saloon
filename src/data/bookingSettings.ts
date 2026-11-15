import { doc, getDoc, setDoc } from 'firebase/firestore'
import * as v from 'valibot'

import { firestore } from '../firebase'
import { getSalonId } from './salonConfig'
import { bookingSettingsPath } from './salonPaths'
import { bookingSettingsSchema, type BookingSettings } from './schemas'

export async function fetchBookingSettings(): Promise<BookingSettings | null> {
  const snapshot = await getDoc(doc(firestore, bookingSettingsPath(getSalonId())))
  if (!snapshot.exists()) return null
  return v.parse(bookingSettingsSchema, snapshot.data())
}

export async function saveBookingSettings(settings: BookingSettings): Promise<void> {
  await setDoc(
    doc(firestore, bookingSettingsPath(getSalonId())),
    v.parse(bookingSettingsSchema, settings),
  )
}
