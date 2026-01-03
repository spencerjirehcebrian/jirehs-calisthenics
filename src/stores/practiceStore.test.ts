import { describe, it, expect, beforeEach } from 'vitest'
import { usePracticeStore } from './practiceStore'

describe('practiceStore', () => {
  beforeEach(() => {
    usePracticeStore.getState().resetPractice()
  })

  describe('initial state', () => {
    it('should have null exerciseId', () => {
      expect(usePracticeStore.getState().exerciseId).toBeNull()
    })

    it('should have 0 currentReps', () => {
      expect(usePracticeStore.getState().currentReps).toBe(0)
    })
  })

  describe('startPractice', () => {
    it('should set exerciseId', () => {
      usePracticeStore.getState().startPractice('push-ups')
      expect(usePracticeStore.getState().exerciseId).toBe('push-ups')
    })

    it('should reset currentReps to 0', () => {
      usePracticeStore.getState().startPractice('exercise-1')
      usePracticeStore.getState().incrementReps()
      usePracticeStore.getState().incrementReps()

      usePracticeStore.getState().startPractice('exercise-2')
      expect(usePracticeStore.getState().currentReps).toBe(0)
    })
  })

  describe('incrementReps', () => {
    it('should increment currentReps by 1', () => {
      usePracticeStore.getState().startPractice('test')
      usePracticeStore.getState().incrementReps()
      expect(usePracticeStore.getState().currentReps).toBe(1)
    })

    it('should increment from any starting value', () => {
      usePracticeStore.getState().startPractice('test')
      usePracticeStore.getState().incrementReps()
      usePracticeStore.getState().incrementReps()
      usePracticeStore.getState().incrementReps()
      expect(usePracticeStore.getState().currentReps).toBe(3)
    })
  })

  describe('resetPractice', () => {
    it('should reset exerciseId to null', () => {
      usePracticeStore.getState().startPractice('test')
      usePracticeStore.getState().resetPractice()
      expect(usePracticeStore.getState().exerciseId).toBeNull()
    })

    it('should reset currentReps to 0', () => {
      usePracticeStore.getState().startPractice('test')
      usePracticeStore.getState().incrementReps()
      usePracticeStore.getState().incrementReps()
      usePracticeStore.getState().resetPractice()
      expect(usePracticeStore.getState().currentReps).toBe(0)
    })
  })
})
