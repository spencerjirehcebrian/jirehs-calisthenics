import { create } from 'zustand'
import type { TimedHoldPhase } from '@/components/interactions'

export type SideState = 'first' | 'second' | null

interface CooldownFlowState {
  // Navigation state
  stretchIndex: number
  currentSide: SideState
  currentReps: number
  setStartTime: number | null
  timedHoldPhase: TimedHoldPhase

  // Actions
  setStretchIndex: (index: number) => void
  setCurrentSide: (side: SideState) => void
  setCurrentReps: (reps: number) => void
  incrementReps: () => void
  setTimedHoldPhase: (phase: TimedHoldPhase) => void

  /**
   * Advance to the next stretch in the cooldown flow.
   * @returns true if advanced to next stretch, false if cooldown is complete
   */
  advanceToNextStretch: (totalStretchesLength: number) => boolean

  /**
   * Reset flow state to initial values.
   * Call this when starting a new cooldown.
   */
  resetFlow: () => void

  /**
   * Start a new set timer. Call when beginning a new stretch.
   */
  startSetTimer: () => void
}

const initialState = {
  stretchIndex: 0,
  currentSide: null as SideState,
  currentReps: 0,
  setStartTime: null as number | null,
  timedHoldPhase: 'ready' as TimedHoldPhase
}

export const useCooldownFlowStore = create<CooldownFlowState>((set, get) => ({
  ...initialState,

  setStretchIndex: (index) => set({ stretchIndex: index }),

  setCurrentSide: (side) => set({ currentSide: side }),

  setCurrentReps: (reps) => set({ currentReps: reps }),

  incrementReps: () => set((state) => ({ currentReps: state.currentReps + 1 })),

  setTimedHoldPhase: (phase) => set({ timedHoldPhase: phase }),

  advanceToNextStretch: (totalStretchesLength) => {
    const state = get()
    const nextIndex = state.stretchIndex + 1

    if (nextIndex < totalStretchesLength) {
      set({
        stretchIndex: nextIndex,
        currentSide: null,
        currentReps: 0,
        setStartTime: Date.now(),
        timedHoldPhase: 'ready'
      })
      return true
    } else {
      // Cooldown complete
      return false
    }
  },

  resetFlow: () => set({
    ...initialState,
    setStartTime: Date.now()
  }),

  startSetTimer: () => set({ setStartTime: Date.now() })
}))
