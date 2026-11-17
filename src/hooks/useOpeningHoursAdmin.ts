import { useMutation, useQueryClient } from '@tanstack/react-query'

import { addHoliday, deleteDayException, deleteHoliday, saveDayException } from '../data/closures'
import { saveOpeningHours } from '../data/openingHours'
import type { AbsenceSave } from '../data/openingHoursForm'
import { queryKeyOf } from './queryKeys'

/** Mutations for weekly hours and absences; each refreshes what customers can book. */
export function useOpeningHoursAdmin() {
  const queryClient = useQueryClient()
  const refresh = async (...roots: Array<'openingHours' | 'closures'>) => {
    await Promise.all([
      ...roots.map((root) => queryClient.invalidateQueries({ queryKey: queryKeyOf(root) })),
      queryClient.invalidateQueries({ queryKey: queryKeyOf('availableSlots') }),
    ])
  }

  const saveWeekly = useMutation({
    mutationFn: saveOpeningHours,
    onSuccess: () => refresh('openingHours'),
  })

  const addAbsence = useMutation({
    mutationFn: async (absence: AbsenceSave) => {
      if (absence.type === 'holiday') await addHoliday(absence.holiday)
      else await saveDayException(absence.dayException)
    },
    onSuccess: () => refresh('closures'),
  })

  const removeAbsence = useMutation({
    mutationFn: async (input: { type: 'holiday' | 'dayException'; id: string }) => {
      if (input.type === 'holiday') await deleteHoliday(input.id)
      else await deleteDayException(input.id)
    },
    onSuccess: () => refresh('closures'),
  })

  return { saveWeekly, addAbsence, removeAbsence }
}
