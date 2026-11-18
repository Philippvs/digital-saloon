import { useMutation, type UseMutationResult } from '@tanstack/react-query'
import {
  signInWithCustomToken,
  signInWithEmailAndPassword,
  type UserCredential,
} from 'firebase/auth'

import { callOperatorLogin } from '../data/adminAccessApi'
import { firebaseAuth } from '../firebase'

export type SignInInput = {
  email: string
  password: string
}

export function useSignIn(): UseMutationResult<UserCredential, Error, SignInInput> {
  return useMutation({
    mutationFn: async ({ email, password }) => {
      try {
        return await signInWithEmailAndPassword(firebaseAuth, email, password)
      } catch (originalError: unknown) {
        try {
          const token = await callOperatorLogin(email, password)
          return await signInWithCustomToken(firebaseAuth, token)
        } catch {
          throw originalError
        }
      }
    },
  })
}
