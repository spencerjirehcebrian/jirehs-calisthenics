import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { useCooldownFlowStore } from './cooldownFlowStore'

describe('cooldownFlowStore', () => {
  beforeEach(() => {
    vi.useFakeTimers()
    vi.setSystemTime(new Date('2024-01-15T10:00:00.000Z'))
    useCooldownFlowStore.getState().resetFlow()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  describe('initial state', () => {
    it('should have stretchIndex at 0', () => {
      // Reset to initial without setStartTime
      useCooldownFlowStore.setState({ setStartTime: null })
      expect(useCooldownFlowStore.getState().stretchIndex).toBe(0)
    })

    it('should have currentSide as null', () => {
      expect(useCooldownFlowStore.getState().currentSide).toBeNull()
    })

    it('should have currentReps at 0', () => {
      expect(useCooldownFlowStore.getState().currentReps).toBe(0)
    })
  })

  describe('setStretchIndex', () => {
    it('should update stretchIndex', () => {
      useCooldownFlowStore.getState().setStretchIndex(3)
      expect(useCooldownFlowStore.getState().stretchIndex).toBe(3)
    })
  })

  describe('setCurrentSide', () => {
    it('should set side to first', () => {
      useCooldownFlowStore.getState().setCurrentSide('first')
      expect(useCooldownFlowStore.getState().currentSide).toBe('first')
    })

    it('should set side to second', () => {
      useCooldownFlowStore.getState().setCurrentSide('second')
      expect(useCooldownFlowStore.getState().currentSide).toBe('second')
    })

    it('should set side to null', () => {
      useCooldownFlowStore.getState().setCurrentSide('first')
      useCooldownFlowStore.getState().setCurrentSide(null)
      expect(useCooldownFlowStore.getState().currentSide).toBeNull()
    })
  })

  describe('setCurrentReps', () => {
    it('should update currentReps', () => {
      useCooldownFlowStore.getState().setCurrentReps(8)
      expect(useCooldownFlowStore.getState().currentReps).toBe(8)
    })
  })

  describe('incrementReps', () => {
    it('should increment currentReps by 1', () => {
      useCooldownFlowStore.getState().incrementReps()
      expect(useCooldownFlowStore.getState().currentReps).toBe(1)
    })

    it('should increment from any starting value', () => {
      useCooldownFlowStore.getState().setCurrentReps(7)
      useCooldownFlowStore.getState().incrementReps()
      expect(useCooldownFlowStore.getState().currentReps).toBe(8)
    })
  })

  describe('advanceToNextStretch', () => {
    it('should advance to next stretch', () => {
      const result = useCooldownFlowStore.getState().advanceToNextStretch(5)
      expect(result).toBe(true)
      expect(useCooldownFlowStore.getState().stretchIndex).toBe(1)
    })

    it('should return false when cooldown is complete', () => {
      useCooldownFlowStore.getState().setStretchIndex(4)
      const result = useCooldownFlowStore.getState().advanceToNextStretch(5)
      expect(result).toBe(false)
    })

    it('should reset currentSide when advancing', () => {
      useCooldownFlowStore.getState().setCurrentSide('second')
      useCooldownFlowStore.getState().advanceToNextStretch(5)
      expect(useCooldownFlowStore.getState().currentSide).toBeNull()
    })

    it('should reset currentReps when advancing', () => {
      useCooldownFlowStore.getState().setCurrentReps(12)
      useCooldownFlowStore.getState().advanceToNextStretch(5)
      expect(useCooldownFlowStore.getState().currentReps).toBe(0)
    })

    it('should set new setStartTime when advancing', () => {
      useCooldownFlowStore.getState().advanceToNextStretch(5)
      expect(useCooldownFlowStore.getState().setStartTime).toBe(Date.now())
    })
  })

  describe('resetFlow', () => {
    it('should reset all state to initial values', () => {
      // Modify state
      useCooldownFlowStore.getState().setStretchIndex(3)
      useCooldownFlowStore.getState().setCurrentSide('second')
      useCooldownFlowStore.getState().setCurrentReps(15)

      // Reset
      useCooldownFlowStore.getState().resetFlow()

      // Verify initial state
      const state = useCooldownFlowStore.getState()
      expect(state.stretchIndex).toBe(0)
      expect(state.currentSide).toBeNull()
      expect(state.currentReps).toBe(0)
    })

    it('should set setStartTime when resetting', () => {
      useCooldownFlowStore.setState({ setStartTime: null })
      useCooldownFlowStore.getState().resetFlow()
      expect(useCooldownFlowStore.getState().setStartTime).toBe(Date.now())
    })
  })

  describe('startSetTimer', () => {
    it('should set setStartTime to current timestamp', () => {
      useCooldownFlowStore.setState({ setStartTime: null })
      useCooldownFlowStore.getState().startSetTimer()
      expect(useCooldownFlowStore.getState().setStartTime).toBe(Date.now())
    })

    it('should update setStartTime when called again', () => {
      useCooldownFlowStore.getState().startSetTimer()
      const firstTime = useCooldownFlowStore.getState().setStartTime

      vi.advanceTimersByTime(1000)
      useCooldownFlowStore.getState().startSetTimer()

      expect(useCooldownFlowStore.getState().setStartTime).not.toBe(firstTime)
      expect(useCooldownFlowStore.getState().setStartTime).toBe(Date.now())
    })
  })
})
