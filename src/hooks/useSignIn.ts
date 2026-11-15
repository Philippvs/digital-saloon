import { useMutation } from '@tanstack/react-query'
import { signInWithEmailAndPassword } from 'firebase/auth'

import { firebaseAuth } from '../firebase'

export type SignInInput = {
  email: string
  password: string
}

export function useSignIn() {
  return useMutation({
    mutationFn: async ({ email, password }: SignInInput) => {
      const credential = await signInWithEmailAndPassword(firebaseAuth, email, password)
      return credential.user
    },
  })
}
