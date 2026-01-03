import { create } from 'zustand'

interface PracticeState {
  exerciseId: string | null
  currentReps: number

  startPractice: (exerciseId: string) => void
  incrementReps: () => void
  resetPractice: () => void
}

export const usePracticeStore = create<PracticeState>((set) => ({
  exerciseId: null,
  currentReps: 0,

  startPractice: (exerciseId) => set({
    exerciseId,
    currentReps: 0
  }),

  incrementReps: () => set((state) => ({ currentReps: state.currentReps + 1 })),

  resetPractice: () => set({
    exerciseId: null,
    currentReps: 0
  })
}))
