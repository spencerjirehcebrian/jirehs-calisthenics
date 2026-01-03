import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { ExerciseHistory, ExerciseHistoryEntry } from '@/types'
import { safeStorage } from '@/utils/storage'

interface ExerciseHistoryState {
  history: ExerciseHistory

  updateExerciseHistory: (exerciseId: string, entry: Partial<ExerciseHistoryEntry>) => void
  getLastReps: (exerciseId: string) => number | undefined
  getLastDuration: (exerciseId: string) => number | undefined
  clearHistory: () => void
}

export const useExerciseHistoryStore = create<ExerciseHistoryState>()(
  persist(
    (set, get) => ({
      history: {},

      updateExerciseHistory: (exerciseId, entry) =>
        set((state) => ({
          history: {
            ...state.history,
            [exerciseId]: {
              ...state.history[exerciseId],
              ...entry
            }
          }
        })),

      getLastReps: (exerciseId) =>
        get().history[exerciseId]?.lastReps,

      getLastDuration: (exerciseId) =>
        get().history[exerciseId]?.lastDuration,

      clearHistory: () =>
        set({ history: {} })
    }),
    {
      name: 'jirehs-calisthenics-history',
      storage: safeStorage
    }
  )
)
