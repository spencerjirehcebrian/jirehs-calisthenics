import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest'
import { useNavigationStore } from '@/stores/navigationStore'
import { useWorkoutSessionStore } from '@/stores/workoutSessionStore'
import { useExerciseHistoryStore } from '@/stores/exerciseHistoryStore'

describe('Workout Flow Integration', () => {
  beforeEach(() => {
    vi.useFakeTimers()
    vi.setSystemTime(new Date('2024-01-15T10:00:00.000Z'))
    useNavigationStore.setState({ currentScreen: 'home', previousScreen: null })
    useWorkoutSessionStore.getState().resetSession()
    useExerciseHistoryStore.getState().clearHistory()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  describe('workout selection and start', () => {
    it('should navigate from home to workout selection', () => {
      useNavigationStore.getState().navigate('workout-selection')

      expect(useNavigationStore.getState().currentScreen).toBe('workout-selection')
    })

    it('should start workout A and navigate to warmup', () => {
      useNavigationStore.getState().navigate('workout-selection')
      useWorkoutSessionStore.getState().startWorkout('workout-a')
      useNavigationStore.getState().navigate('warmup')

      expect(useWorkoutSessionStore.getState().isActive).toBe(true)
      expect(useWorkoutSessionStore.getState().workoutId).toBe('workout-a')
      expect(useWorkoutSessionStore.getState().phase).toBe('warmup')
      expect(useNavigationStore.getState().currentScreen).toBe('warmup')
    })

    it('should start workout B', () => {
      useWorkoutSessionStore.getState().startWorkout('workout-b')

      expect(useWorkoutSessionStore.getState().workoutId).toBe('workout-b')
    })

    it('should start workout C', () => {
      useWorkoutSessionStore.getState().startWorkout('workout-c')

      expect(useWorkoutSessionStore.getState().workoutId).toBe('workout-c')
    })
  })

  describe('warmup phase', () => {
    it('should transition to strength phase after warmup', () => {
      useWorkoutSessionStore.getState().startWorkout('workout-a')
      useWorkoutSessionStore.getState().completeWarmup()
      useWorkoutSessionStore.getState().setPhase('strength')
      useNavigationStore.getState().navigate('active-workout')

      expect(useWorkoutSessionStore.getState().phase).toBe('strength')
      expect(useWorkoutSessionStore.getState().warmupStatus).toBe('completed')
    })

    it('should allow skipping warmup', () => {
      useWorkoutSessionStore.getState().startWorkout('workout-a')
      useWorkoutSessionStore.getState().skipWarmup()
      useWorkoutSessionStore.getState().setPhase('strength')

      expect(useWorkoutSessionStore.getState().warmupStatus).toBe('skipped')
      expect(useWorkoutSessionStore.getState().phase).toBe('strength')
    })
  })

  describe('exercise tracking', () => {
    it('should track exercise sets', () => {
      useWorkoutSessionStore.getState().startWorkout('workout-a')
      useWorkoutSessionStore.getState().setPhase('strength')

      // Complete first set of first exercise
      useWorkoutSessionStore.getState().recordExerciseSet('push-ups', 15, 0)

      const progress = useWorkoutSessionStore.getState().exerciseProgress
      expect(progress).toHaveLength(1)
      expect(progress[0].exerciseId).toBe('push-ups')
      expect(progress[0].completedSets).toBe(1)
      expect(progress[0].repsPerSet).toEqual([15])
    })

    it('should track multiple sets of same exercise', () => {
      useWorkoutSessionStore.getState().startWorkout('workout-a')

      useWorkoutSessionStore.getState().recordExerciseSet('push-ups', 15, 0)
      useWorkoutSessionStore.getState().recordExerciseSet('push-ups', 12, 0)
      useWorkoutSessionStore.getState().recordExerciseSet('push-ups', 10, 0)

      const progress = useWorkoutSessionStore.getState().exerciseProgress
      expect(progress[0].completedSets).toBe(3)
      expect(progress[0].repsPerSet).toEqual([15, 12, 10])
    })

    it('should track timed exercises with duration', () => {
      useWorkoutSessionStore.getState().startWorkout('workout-a')

      useWorkoutSessionStore.getState().recordExerciseSet('dead-hang', 0, 30)
      useWorkoutSessionStore.getState().recordExerciseSet('dead-hang', 0, 25)

      const progress = useWorkoutSessionStore.getState().exerciseProgress
      expect(progress[0].durationPerSet).toEqual([30, 25])
    })
  })

  describe('exercise pair transitions', () => {
    it('should alternate between exercises in a pair', () => {
      useWorkoutSessionStore.getState().startWorkout('workout-a')

      expect(useWorkoutSessionStore.getState().currentExerciseInPair).toBe(1)

      useWorkoutSessionStore.getState().moveToNextExercise()
      expect(useWorkoutSessionStore.getState().currentExerciseInPair).toBe(2)

      useWorkoutSessionStore.getState().moveToNextExercise()
      expect(useWorkoutSessionStore.getState().currentExerciseInPair).toBe(1)
    })

    it('should move to next pair', () => {
      useWorkoutSessionStore.getState().startWorkout('workout-a')

      expect(useWorkoutSessionStore.getState().currentPairIndex).toBe(0)

      useWorkoutSessionStore.getState().moveToNextPair()
      expect(useWorkoutSessionStore.getState().currentPairIndex).toBe(1)
      expect(useWorkoutSessionStore.getState().currentExerciseInPair).toBe(1)
      expect(useWorkoutSessionStore.getState().currentSet).toBe(1)
    })
  })

  describe('cooldown and summary', () => {
    it('should transition to cooldown after strength', () => {
      useWorkoutSessionStore.getState().startWorkout('workout-a')
      useWorkoutSessionStore.getState().setPhase('cooldown')
      useNavigationStore.getState().navigate('cooldown')

      expect(useWorkoutSessionStore.getState().phase).toBe('cooldown')
    })

    it('should complete cooldown', () => {
      useWorkoutSessionStore.getState().startWorkout('workout-a')
      useWorkoutSessionStore.getState().setPhase('cooldown')
      useWorkoutSessionStore.getState().completeCooldown()

      expect(useWorkoutSessionStore.getState().cooldownStatus).toBe('completed')
    })

    it('should allow skipping cooldown', () => {
      useWorkoutSessionStore.getState().startWorkout('workout-a')
      useWorkoutSessionStore.getState().setPhase('cooldown')
      useWorkoutSessionStore.getState().skipCooldown()

      expect(useWorkoutSessionStore.getState().cooldownStatus).toBe('skipped')
    })

    it('should end workout and show summary', () => {
      useWorkoutSessionStore.getState().startWorkout('workout-a')
      vi.advanceTimersByTime(60000) // 1 minute
      useWorkoutSessionStore.getState().endWorkout()
      useNavigationStore.getState().navigate('session-summary')

      expect(useWorkoutSessionStore.getState().phase).toBe('summary')
      expect(useWorkoutSessionStore.getState().endTime).not.toBeNull()
      expect(useNavigationStore.getState().currentScreen).toBe('session-summary')
    })
  })

  describe('workout duration tracking', () => {
    it('should track workout duration', () => {
      useWorkoutSessionStore.getState().startWorkout('workout-a')
      const startTime = useWorkoutSessionStore.getState().startTime

      vi.advanceTimersByTime(1800000) // 30 minutes
      useWorkoutSessionStore.getState().endWorkout()

      const endTime = useWorkoutSessionStore.getState().endTime
      expect(endTime! - startTime!).toBe(1800000)
    })
  })

  describe('session reset', () => {
    it('should reset session completely', () => {
      useWorkoutSessionStore.getState().startWorkout('workout-a')
      useWorkoutSessionStore.getState().incrementReps()
      useWorkoutSessionStore.getState().recordExerciseSet('push-ups', 10, 0)

      useWorkoutSessionStore.getState().resetSession()

      const state = useWorkoutSessionStore.getState()
      expect(state.isActive).toBe(false)
      expect(state.workoutId).toBeNull()
      expect(state.currentReps).toBe(0)
      expect(state.exerciseProgress).toEqual([])
    })
  })
})
