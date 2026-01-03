import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest'
import { useNavigationStore } from '@/stores/navigationStore'
import { useWorkoutSessionStore } from '@/stores/workoutSessionStore'

describe('Warm-up Skip Behavior Integration', () => {
  beforeEach(() => {
    vi.useFakeTimers()
    vi.setSystemTime(new Date('2024-01-15T10:00:00.000Z'))
    useNavigationStore.setState({ currentScreen: 'home', previousScreen: null })
    useWorkoutSessionStore.getState().resetSession()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  describe('warmup flow', () => {
    it('should start workout and show warmup screen', () => {
      useWorkoutSessionStore.getState().startWorkout('workout-a')
      useNavigationStore.getState().navigate('warmup')

      expect(useNavigationStore.getState().currentScreen).toBe('warmup')
      expect(useWorkoutSessionStore.getState().phase).toBe('warmup')
      expect(useWorkoutSessionStore.getState().warmupStatus).toBe('pending')
    })

    it('should allow completing warmup normally', () => {
      useWorkoutSessionStore.getState().startWorkout('workout-a')
      useNavigationStore.getState().navigate('warmup')

      // Complete warmup
      useWorkoutSessionStore.getState().completeWarmup()
      useWorkoutSessionStore.getState().setPhase('strength')
      useNavigationStore.getState().navigate('active-workout')

      expect(useWorkoutSessionStore.getState().warmupStatus).toBe('completed')
      expect(useWorkoutSessionStore.getState().phase).toBe('strength')
      expect(useNavigationStore.getState().currentScreen).toBe('active-workout')
    })

    it('should allow skipping warmup', () => {
      useWorkoutSessionStore.getState().startWorkout('workout-a')
      useNavigationStore.getState().navigate('warmup')

      // Skip warmup
      useWorkoutSessionStore.getState().skipWarmup()
      useWorkoutSessionStore.getState().setPhase('strength')
      useNavigationStore.getState().navigate('active-workout')

      expect(useWorkoutSessionStore.getState().warmupStatus).toBe('skipped')
      expect(useWorkoutSessionStore.getState().phase).toBe('strength')
      expect(useNavigationStore.getState().currentScreen).toBe('active-workout')
    })

    it('should record warmup status as skipped in session', () => {
      useWorkoutSessionStore.getState().startWorkout('workout-a')
      useWorkoutSessionStore.getState().skipWarmup()

      // Complete workout
      useWorkoutSessionStore.getState().endWorkout()

      expect(useWorkoutSessionStore.getState().warmupStatus).toBe('skipped')
    })
  })

  describe('transition to strength phase after skip', () => {
    it('should properly initialize for first exercise after skip', () => {
      useWorkoutSessionStore.getState().startWorkout('workout-a')
      useWorkoutSessionStore.getState().skipWarmup()
      useWorkoutSessionStore.getState().setPhase('strength')

      expect(useWorkoutSessionStore.getState().currentPairIndex).toBe(0)
      expect(useWorkoutSessionStore.getState().currentExerciseInPair).toBe(1)
      expect(useWorkoutSessionStore.getState().currentSet).toBe(1)
      expect(useWorkoutSessionStore.getState().currentReps).toBe(0)
    })

    it('should allow normal exercise flow after skipping warmup', () => {
      useWorkoutSessionStore.getState().startWorkout('workout-a')
      useWorkoutSessionStore.getState().skipWarmup()
      useWorkoutSessionStore.getState().setPhase('strength')

      // Track exercise
      useWorkoutSessionStore.getState().incrementReps()
      useWorkoutSessionStore.getState().incrementReps()
      useWorkoutSessionStore.getState().incrementReps()

      expect(useWorkoutSessionStore.getState().currentReps).toBe(3)

      // Complete set
      useWorkoutSessionStore.getState().recordExerciseSet('push-ups', 3, 0)
      expect(useWorkoutSessionStore.getState().exerciseProgress).toHaveLength(1)
    })
  })
})
