import type * as React from 'react'
import { createContext, useContext, useEffect, useState } from 'react'
import { onAuthStateChanged, type User } from 'firebase/auth'

import { firebaseAuth } from '../firebase'

export type AuthSession = {
  user: User | null
  isLoading: boolean
}

const AuthContext = createContext<AuthSession | null>(null)

export const AuthProvider: React.FunctionComponent<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [session, setSession] = useState<AuthSession>({ user: null, isLoading: true })

  useEffect(() => {
    return onAuthStateChanged(firebaseAuth, (user) => {
      setSession({ user, isLoading: false })
    })
  }, [])

  return <AuthContext.Provider value={session}>{children}</AuthContext.Provider>
}

export function useAuth(): AuthSession {
  const session = useContext(AuthContext)
  if (session === null) {
    throw new Error('useAuth must be used inside AuthProvider')
  }
  return session
}
