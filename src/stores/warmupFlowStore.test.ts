import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { useWarmupFlowStore } from './warmupFlowStore'

describe('warmupFlowStore', () => {
  beforeEach(() => {
    vi.useFakeTimers()
    vi.setSystemTime(new Date('2024-01-15T10:00:00.000Z'))
    useWarmupFlowStore.getState().resetFlow()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  describe('initial state', () => {
    it('should have phaseIndex at 0', () => {
      // Reset to initial without setStartTime
      useWarmupFlowStore.setState({ setStartTime: null })
      expect(useWarmupFlowStore.getState().phaseIndex).toBe(0)
    })

    it('should have movementIndex at 0', () => {
      expect(useWarmupFlowStore.getState().movementIndex).toBe(0)
    })

    it('should have currentDirection as null', () => {
      expect(useWarmupFlowStore.getState().currentDirection).toBeNull()
    })

    it('should have currentReps at 0', () => {
      expect(useWarmupFlowStore.getState().currentReps).toBe(0)
    })
  })

  describe('setPhaseIndex', () => {
    it('should update phaseIndex', () => {
      useWarmupFlowStore.getState().setPhaseIndex(2)
      expect(useWarmupFlowStore.getState().phaseIndex).toBe(2)
    })
  })

  describe('setMovementIndex', () => {
    it('should update movementIndex', () => {
      useWarmupFlowStore.getState().setMovementIndex(3)
      expect(useWarmupFlowStore.getState().movementIndex).toBe(3)
    })
  })

  describe('setCurrentDirection', () => {
    it('should set direction to first', () => {
      useWarmupFlowStore.getState().setCurrentDirection('first')
      expect(useWarmupFlowStore.getState().currentDirection).toBe('first')
    })

    it('should set direction to second', () => {
      useWarmupFlowStore.getState().setCurrentDirection('second')
      expect(useWarmupFlowStore.getState().currentDirection).toBe('second')
    })

    it('should set direction to null', () => {
      useWarmupFlowStore.getState().setCurrentDirection('first')
      useWarmupFlowStore.getState().setCurrentDirection(null)
      expect(useWarmupFlowStore.getState().currentDirection).toBeNull()
    })
  })

  describe('setCurrentReps', () => {
    it('should update currentReps', () => {
      useWarmupFlowStore.getState().setCurrentReps(5)
      expect(useWarmupFlowStore.getState().currentReps).toBe(5)
    })
  })

  describe('incrementReps', () => {
    it('should increment currentReps by 1', () => {
      useWarmupFlowStore.getState().incrementReps()
      expect(useWarmupFlowStore.getState().currentReps).toBe(1)
    })

    it('should increment from any starting value', () => {
      useWarmupFlowStore.getState().setCurrentReps(5)
      useWarmupFlowStore.getState().incrementReps()
      expect(useWarmupFlowStore.getState().currentReps).toBe(6)
    })
  })

  describe('advanceToNextMovement', () => {
    it('should advance to next movement in same phase', () => {
      const result = useWarmupFlowStore.getState().advanceToNextMovement(3, 2)
      expect(result).toBe(true)
      expect(useWarmupFlowStore.getState().movementIndex).toBe(1)
      expect(useWarmupFlowStore.getState().phaseIndex).toBe(0)
    })

    it('should advance to next phase when current phase is complete', () => {
      useWarmupFlowStore.getState().setMovementIndex(2)
      const result = useWarmupFlowStore.getState().advanceToNextMovement(3, 2)
      expect(result).toBe(true)
      expect(useWarmupFlowStore.getState().phaseIndex).toBe(1)
      expect(useWarmupFlowStore.getState().movementIndex).toBe(0)
    })

    it('should return false when warmup is complete', () => {
      useWarmupFlowStore.getState().setPhaseIndex(1)
      useWarmupFlowStore.getState().setMovementIndex(2)
      const result = useWarmupFlowStore.getState().advanceToNextMovement(3, 2)
      expect(result).toBe(false)
    })

    it('should reset currentDirection when advancing', () => {
      useWarmupFlowStore.getState().setCurrentDirection('first')
      useWarmupFlowStore.getState().advanceToNextMovement(3, 2)
      expect(useWarmupFlowStore.getState().currentDirection).toBeNull()
    })

    it('should reset currentReps when advancing', () => {
      useWarmupFlowStore.getState().setCurrentReps(10)
      useWarmupFlowStore.getState().advanceToNextMovement(3, 2)
      expect(useWarmupFlowStore.getState().currentReps).toBe(0)
    })

    it('should set new setStartTime when advancing', () => {
      useWarmupFlowStore.getState().advanceToNextMovement(3, 2)
      expect(useWarmupFlowStore.getState().setStartTime).toBe(Date.now())
    })
  })

  describe('resetFlow', () => {
    it('should reset all state to initial values', () => {
      // Modify state
      useWarmupFlowStore.getState().setPhaseIndex(2)
      useWarmupFlowStore.getState().setMovementIndex(3)
      useWarmupFlowStore.getState().setCurrentDirection('second')
      useWarmupFlowStore.getState().setCurrentReps(10)

      // Reset
      useWarmupFlowStore.getState().resetFlow()

      // Verify initial state
      const state = useWarmupFlowStore.getState()
      expect(state.phaseIndex).toBe(0)
      expect(state.movementIndex).toBe(0)
      expect(state.currentDirection).toBeNull()
      expect(state.currentReps).toBe(0)
    })

    it('should set setStartTime when resetting', () => {
      useWarmupFlowStore.setState({ setStartTime: null })
      useWarmupFlowStore.getState().resetFlow()
      expect(useWarmupFlowStore.getState().setStartTime).toBe(Date.now())
    })
  })

  describe('startSetTimer', () => {
    it('should set setStartTime to current timestamp', () => {
      useWarmupFlowStore.setState({ setStartTime: null })
      useWarmupFlowStore.getState().startSetTimer()
      expect(useWarmupFlowStore.getState().setStartTime).toBe(Date.now())
    })

    it('should update setStartTime when called again', () => {
      useWarmupFlowStore.getState().startSetTimer()
      const firstTime = useWarmupFlowStore.getState().setStartTime

      vi.advanceTimersByTime(1000)
      useWarmupFlowStore.getState().startSetTimer()

      expect(useWarmupFlowStore.getState().setStartTime).not.toBe(firstTime)
      expect(useWarmupFlowStore.getState().setStartTime).toBe(Date.now())
    })
  })
})
