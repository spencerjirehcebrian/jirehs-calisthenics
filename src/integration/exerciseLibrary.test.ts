import { describe, it, expect, beforeEach } from 'vitest'
import { useNavigationStore } from '@/stores/navigationStore'
import { usePracticeStore } from '@/stores/practiceStore'

describe('Exercise Library Navigation Integration', () => {
  beforeEach(() => {
    useNavigationStore.setState({ currentScreen: 'home', previousScreen: null })
    usePracticeStore.getState().resetPractice()
  })

  describe('navigation flow', () => {
    it('should navigate from home to exercise library', () => {
      useNavigationStore.getState().navigate('exercise-library')

      expect(useNavigationStore.getState().currentScreen).toBe('exercise-library')
      expect(useNavigationStore.getState().previousScreen).toBe('home')
    })

    it('should navigate back to home from library', () => {
      useNavigationStore.getState().navigate('exercise-library')
      useNavigationStore.getState().goBack()

      expect(useNavigationStore.getState().currentScreen).toBe('home')
    })
  })

  describe('practice mode', () => {
    it('should be able to start practice mode from library', () => {
      // Navigate to library
      useNavigationStore.getState().navigate('exercise-library')

      // Start practice for an exercise
      usePracticeStore.getState().startPractice('push-ups')
      useNavigationStore.getState().navigate('practice')

      expect(useNavigationStore.getState().currentScreen).toBe('practice')
      expect(usePracticeStore.getState().exerciseId).toBe('push-ups')
      expect(usePracticeStore.getState().currentReps).toBe(0)
    })

    it('should track reps during practice', () => {
      usePracticeStore.getState().startPractice('squats')

      usePracticeStore.getState().incrementReps()
      usePracticeStore.getState().incrementReps()
      usePracticeStore.getState().incrementReps()

      expect(usePracticeStore.getState().currentReps).toBe(3)
    })

    it('should reset practice when exiting', () => {
      usePracticeStore.getState().startPractice('push-ups')
      usePracticeStore.getState().incrementReps()
      usePracticeStore.getState().incrementReps()

      usePracticeStore.getState().resetPractice()

      expect(usePracticeStore.getState().exerciseId).toBeNull()
      expect(usePracticeStore.getState().currentReps).toBe(0)
    })
  })
})
