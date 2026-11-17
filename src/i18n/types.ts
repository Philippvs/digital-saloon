export const locales = ['de', 'it'] as const
export type Locale = (typeof locales)[number]

export const localeLabels: Record<Locale, string> = {
  de: 'Deutsch',
  it: 'Italiano',
}

export const intlLocaleOf: Record<Locale, string> = {
  de: 'de-AT',
  it: 'it-IT',
}

export const LOCALE_STORAGE_KEY = 'salonflow.locale'
