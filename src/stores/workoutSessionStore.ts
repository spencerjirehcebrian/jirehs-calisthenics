import { create } from 'zustand'
import type { WorkoutId } from '@/types'

export type WorkoutPhase = 'warmup' | 'strength' | 'cooldown' | 'summary'
export type HoldPhase = 'ready' | 'countdown' | 'active' | 'complete'
export type PhaseStatus = 'pending' | 'completed' | 'skipped'

interface ExerciseProgress {
  exerciseId: string
  completedSets: number
  repsPerSet: number[]
  durationPerSet: number[]
}

interface WorkoutSessionState {
  // Session state
  isActive: boolean
  workoutId: WorkoutId | null
  phase: WorkoutPhase
  startTime: number | null
  endTime: number | null

  // Phase completion status
  warmupStatus: PhaseStatus
  cooldownStatus: PhaseStatus

  // Current position in workout
  currentPairIndex: number
  currentExerciseInPair: 1 | 2
  currentSet: number

  // Current exercise tracking
  currentReps: number
  currentDuration: number
  isResting: boolean
  restTimeRemaining: number
  holdPhase: HoldPhase
  setStartTime: number | null

  // Session history
  exerciseProgress: ExerciseProgress[]

  // Actions
  startWorkout: (workoutId: WorkoutId) => void
  setPhase: (phase: WorkoutPhase) => void
  incrementReps: () => void
  setDuration: (seconds: number) => void
  completeSet: () => void
  startRest: () => void
  endRest: () => void
  updateRestTime: (seconds: number) => void
  moveToNextExercise: () => void
  moveToNextPair: () => void
  endWorkout: () => void
  resetSession: () => void
  setHoldPhase: (phase: HoldPhase) => void
  resetExerciseState: () => void

  // Phase status actions
  completeWarmup: () => void
  skipWarmup: () => void
  completeCooldown: () => void
  skipCooldown: () => void

  // Exercise tracking
  recordExerciseSet: (exerciseId: string, reps: number, duration: number) => void
}

const initialState = {
  isActive: false,
  workoutId: null as WorkoutId | null,
  phase: 'warmup' as WorkoutPhase,
  startTime: null as number | null,
  endTime: null as number | null,
  warmupStatus: 'pending' as PhaseStatus,
  cooldownStatus: 'pending' as PhaseStatus,
  currentPairIndex: 0,
  currentExerciseInPair: 1 as const,
  currentSet: 1,
  currentReps: 0,
  currentDuration: 0,
  isResting: false,
  restTimeRemaining: 90,
  holdPhase: 'ready' as HoldPhase,
  setStartTime: null as number | null,
  exerciseProgress: [] as ExerciseProgress[]
}

export const useWorkoutSessionStore = create<WorkoutSessionState>((set, get) => ({
  ...initialState,

  startWorkout: (workoutId) =>
    set({
      isActive: true,
      workoutId,
      phase: 'warmup',
      startTime: Date.now(),
      setStartTime: Date.now(),
      currentPairIndex: 0,
      currentExerciseInPair: 1,
      currentSet: 1,
      exerciseProgress: []
    }),

  setPhase: (phase) =>
    set({ phase }),

  incrementReps: () =>
    set((state) => ({ currentReps: state.currentReps + 1 })),

  setDuration: (seconds) =>
    set({ currentDuration: seconds }),

  completeSet: () => {
    const state = get()
    const progress = [...state.exerciseProgress]
    // Record set completion logic will be expanded in later phases
    set({
      currentReps: 0,
      currentDuration: 0,
      exerciseProgress: progress
    })
  },

  startRest: () =>
    set({ isResting: true, restTimeRemaining: 90 }),

  endRest: () =>
    set({ isResting: false }),

  updateRestTime: (seconds) =>
    set({ restTimeRemaining: seconds }),

  moveToNextExercise: () =>
    set((state) => ({
      currentExerciseInPair: state.currentExerciseInPair === 1 ? 2 : 1,
      currentReps: 0,
      currentDuration: 0
    })),

  moveToNextPair: () =>
    set((state) => ({
      currentPairIndex: state.currentPairIndex + 1,
      currentExerciseInPair: 1,
      currentSet: 1,
      currentReps: 0,
      currentDuration: 0
    })),

  endWorkout: () =>
    set({ phase: 'summary', endTime: Date.now() }),

  resetSession: () =>
    set(initialState),

  setHoldPhase: (phase) =>
    set({ holdPhase: phase }),

  resetExerciseState: () =>
    set({
      currentReps: 0,
      currentDuration: 0,
      holdPhase: 'ready',
      setStartTime: Date.now()
    }),

  // Phase status actions
  completeWarmup: () => set({ warmupStatus: 'completed' }),
  skipWarmup: () => set({ warmupStatus: 'skipped' }),
  completeCooldown: () => set({ cooldownStatus: 'completed' }),
  skipCooldown: () => set({ cooldownStatus: 'skipped' }),

  // Exercise tracking
  recordExerciseSet: (exerciseId, reps, duration) => {
    set((state) => {
      const progress = [...state.exerciseProgress]
      const existingIndex = progress.findIndex(p => p.exerciseId === exerciseId)

      if (existingIndex >= 0) {
        // Add to existing exercise
        progress[existingIndex] = {
          ...progress[existingIndex],
          completedSets: progress[existingIndex].completedSets + 1,
          repsPerSet: [...progress[existingIndex].repsPerSet, reps],
          durationPerSet: [...progress[existingIndex].durationPerSet, duration]
        }
      } else {
        // Create new exercise progress entry
        progress.push({
          exerciseId,
          completedSets: 1,
          repsPerSet: reps > 0 ? [reps] : [],
          durationPerSet: duration > 0 ? [duration] : []
        })
      }

      return { exerciseProgress: progress }
    })
  }
}))
