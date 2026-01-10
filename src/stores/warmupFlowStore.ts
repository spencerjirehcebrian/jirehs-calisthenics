import { create } from 'zustand'
import type { TimedHoldPhase } from '@/components/interactions'

export type DirectionState = 'first' | 'second' | null

interface WarmupFlowState {
  // Navigation state
  phaseIndex: number
  movementIndex: number
  currentDirection: DirectionState
  currentReps: number
  setStartTime: number | null
  timedHoldPhase: TimedHoldPhase

  // Actions
  setPhaseIndex: (index: number) => void
  setMovementIndex: (index: number) => void
  setCurrentDirection: (direction: DirectionState) => void
  setCurrentReps: (reps: number) => void
  incrementReps: () => void
  setTimedHoldPhase: (phase: TimedHoldPhase) => void

  /**
   * Advance to the next movement in the warmup flow.
   * Handles phase transitions when current phase is complete.
   * @returns true if advanced to next movement/phase, false if warmup is complete
   */
  advanceToNextMovement: (
    currentPhaseItemsLength: number,
    totalPhasesLength: number
  ) => boolean

  /**
   * Reset flow state to initial values.
   * Call this when starting a new warmup.
   */
  resetFlow: () => void

  /**
   * Start a new set timer. Call when beginning a new movement.
   */
  startSetTimer: () => void
}

const initialState = {
  phaseIndex: 0,
  movementIndex: 0,
  currentDirection: null as DirectionState,
  currentReps: 0,
  setStartTime: null as number | null,
  timedHoldPhase: 'ready' as TimedHoldPhase
}

export const useWarmupFlowStore = create<WarmupFlowState>((set, get) => ({
  ...initialState,

  setPhaseIndex: (index) => set({ phaseIndex: index }),

  setMovementIndex: (index) => set({ movementIndex: index }),

  setCurrentDirection: (direction) => set({ currentDirection: direction }),

  setCurrentReps: (reps) => set({ currentReps: reps }),

  incrementReps: () => set((state) => ({ currentReps: state.currentReps + 1 })),

  setTimedHoldPhase: (phase) => set({ timedHoldPhase: phase }),

  advanceToNextMovement: (currentPhaseItemsLength, totalPhasesLength) => {
    const state = get()
    const nextMovementIndex = state.movementIndex + 1

    if (nextMovementIndex < currentPhaseItemsLength) {
      // Advance to next movement in current phase
      set({
        movementIndex: nextMovementIndex,
        currentDirection: null,
        currentReps: 0,
        setStartTime: Date.now(),
        timedHoldPhase: 'ready'
      })
      return true
    } else {
      // Try to advance to next phase
      const nextPhaseIndex = state.phaseIndex + 1
      if (nextPhaseIndex < totalPhasesLength) {
        set({
          phaseIndex: nextPhaseIndex,
          movementIndex: 0,
          currentDirection: null,
          currentReps: 0,
          setStartTime: Date.now(),
          timedHoldPhase: 'ready'
        })
        return true
      } else {
        // Warmup complete
        return false
      }
    }
  },

  resetFlow: () => set({
    ...initialState,
    setStartTime: Date.now()
  }),

  startSetTimer: () => set({ setStartTime: Date.now() })
}))
