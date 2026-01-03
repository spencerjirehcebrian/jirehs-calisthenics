import { describe, it, expect, beforeEach } from 'vitest'
import { useExerciseHistoryStore } from './exerciseHistoryStore'

describe('exerciseHistoryStore', () => {
  beforeEach(() => {
    useExerciseHistoryStore.getState().clearHistory()
  })

  describe('initial state', () => {
    it('should have empty history', () => {
      expect(useExerciseHistoryStore.getState().history).toEqual({})
    })
  })

  describe('updateExerciseHistory', () => {
    it('should create new entry for new exerciseId', () => {
      useExerciseHistoryStore.getState().updateExerciseHistory('push-ups', {
        lastReps: 15,
      })

      expect(useExerciseHistoryStore.getState().history['push-ups']).toEqual({
        lastReps: 15,
      })
    })

    it('should update existing entry for known exerciseId', () => {
      useExerciseHistoryStore.getState().updateExerciseHistory('push-ups', {
        lastReps: 10,
      })
      useExerciseHistoryStore.getState().updateExerciseHistory('push-ups', {
        lastReps: 15,
      })

      expect(useExerciseHistoryStore.getState().history['push-ups'].lastReps).toBe(15)
    })

    it('should merge partial updates', () => {
      useExerciseHistoryStore.getState().updateExerciseHistory('dead-hang', {
        lastDuration: 30,
      })
      useExerciseHistoryStore.getState().updateExerciseHistory('dead-hang', {
        lastReps: 1,
      })

      const entry = useExerciseHistoryStore.getState().history['dead-hang']
      expect(entry.lastDuration).toBe(30)
      expect(entry.lastReps).toBe(1)
    })

    it('should handle multiple exercises independently', () => {
      useExerciseHistoryStore.getState().updateExerciseHistory('push-ups', {
        lastReps: 15,
      })
      useExerciseHistoryStore.getState().updateExerciseHistory('squats', {
        lastReps: 20,
      })

      expect(useExerciseHistoryStore.getState().history['push-ups'].lastReps).toBe(15)
      expect(useExerciseHistoryStore.getState().history['squats'].lastReps).toBe(20)
    })
  })

  describe('getLastReps', () => {
    it('should return lastReps for known exercise', () => {
      useExerciseHistoryStore.getState().updateExerciseHistory('push-ups', {
        lastReps: 12,
      })

      expect(useExerciseHistoryStore.getState().getLastReps('push-ups')).toBe(12)
    })

    it('should return undefined for unknown exercise', () => {
      expect(useExerciseHistoryStore.getState().getLastReps('unknown')).toBeUndefined()
    })
  })

  describe('getLastDuration', () => {
    it('should return lastDuration for known exercise', () => {
      useExerciseHistoryStore.getState().updateExerciseHistory('dead-hang', {
        lastDuration: 45,
      })

      expect(useExerciseHistoryStore.getState().getLastDuration('dead-hang')).toBe(45)
    })

    it('should return undefined for unknown exercise', () => {
      expect(useExerciseHistoryStore.getState().getLastDuration('unknown')).toBeUndefined()
    })
  })

  describe('clearHistory', () => {
    it('should reset history to empty object', () => {
      useExerciseHistoryStore.getState().updateExerciseHistory('push-ups', {
        lastReps: 10,
      })
      useExerciseHistoryStore.getState().updateExerciseHistory('squats', {
        lastReps: 15,
      })

      useExerciseHistoryStore.getState().clearHistory()

      expect(useExerciseHistoryStore.getState().history).toEqual({})
    })
  })
})
