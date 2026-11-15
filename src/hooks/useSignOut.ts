import { useMutation, useQueryClient } from '@tanstack/react-query'
import { signOut } from 'firebase/auth'

import { firebaseAuth } from '../firebase'
import { clearPrivateQueries } from './queryKeys'

export function useSignOut() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async () => {
      await signOut(firebaseAuth)
    },
    onSuccess: () => {
      clearPrivateQueries(queryClient)
    },
  })
}
