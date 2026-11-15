import type * as React from 'react'
import { createContext, useContext, useMemo, useState } from 'react'

import { translate, type MessageKey } from './messages'
import { intlLocaleOf, LOCALE_STORAGE_KEY, locales, type Locale } from './types'

export type TranslateFn = (key: MessageKey, vars?: Record<string, string | number>) => string

type LocaleContextValue = {
  locale: Locale
  intlLocale: string
  setLocale: (locale: Locale) => void
  t: TranslateFn
}

const LocaleContext = createContext<LocaleContextValue | null>(null)

function readStoredLocale(): Locale {
  if (typeof window === 'undefined') return 'de'
  const raw = window.localStorage.getItem(LOCALE_STORAGE_KEY)
  if (raw === 'de' || raw === 'it') return raw
  const browser = window.navigator.language.toLowerCase()
  if (browser.startsWith('it')) return 'it'
  return 'de'
}

export type LocaleProviderProps = {
  children: React.ReactNode
}

export const LocaleProvider: React.FunctionComponent<LocaleProviderProps> = ({ children }) => {
  const [locale, setLocaleState] = useState<Locale>(() => readStoredLocale())

  const value = useMemo<LocaleContextValue>(() => {
    const setLocale = (next: Locale): void => {
      if (!locales.includes(next)) return
      window.localStorage.setItem(LOCALE_STORAGE_KEY, next)
      setLocaleState(next)
      if (typeof document !== 'undefined') {
        document.documentElement.lang = next
      }
    }
    return {
      locale,
      intlLocale: intlLocaleOf[locale],
      setLocale,
      t: (key, vars) => translate(locale, key, vars),
    }
  }, [locale])

  return <LocaleContext.Provider value={value}>{children}</LocaleContext.Provider>
}

export function useLocale(): LocaleContextValue {
  const value = useContext(LocaleContext)
  if (!value) {
    throw new Error('useLocale must be used within LocaleProvider')
  }
  return value
}
