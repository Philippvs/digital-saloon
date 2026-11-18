import type * as React from 'react'
import { createContext, useContext, useEffect, useState } from 'react'
import { onAuthStateChanged, type User } from 'firebase/auth'

import { firebaseAuth } from '../firebase'

export type AuthSession = {
  user: User | null
  isOperator: boolean
  isLoading: boolean
}

const AuthContext = createContext<AuthSession | null>(null)

export const AuthProvider: React.FunctionComponent<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [session, setSession] = useState<AuthSession>({
    user: null,
    isOperator: false,
    isLoading: true,
  })

  useEffect(() => {
    return onAuthStateChanged(firebaseAuth, (user) => {
      if (!user) {
        setSession({ user: null, isOperator: false, isLoading: false })
        return
      }
      user
        .getIdTokenResult()
        .then((result) => {
          setSession({
            user,
            isOperator: result.claims.operator === true,
            isLoading: false,
          })
        })
        .catch(() => {
          setSession({ user, isOperator: false, isLoading: false })
        })
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
