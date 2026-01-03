import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { useWorkoutSessionStore } from './workoutSessionStore'

describe('workoutSessionStore', () => {
  beforeEach(() => {
    vi.useFakeTimers()
    vi.setSystemTime(new Date('2024-01-15T10:00:00.000Z'))
    useWorkoutSessionStore.getState().resetSession()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  describe('initial state', () => {
    it('should not be active', () => {
      expect(useWorkoutSessionStore.getState().isActive).toBe(false)
    })

    it('should have null workoutId', () => {
      expect(useWorkoutSessionStore.getState().workoutId).toBeNull()
    })

    it('should be in warmup phase', () => {
      expect(useWorkoutSessionStore.getState().phase).toBe('warmup')
    })

    it('should have pending warmup status', () => {
      expect(useWorkoutSessionStore.getState().warmupStatus).toBe('pending')
    })

    it('should have pending cooldown status', () => {
      expect(useWorkoutSessionStore.getState().cooldownStatus).toBe('pending')
    })

    it('should be at pair index 0', () => {
      expect(useWorkoutSessionStore.getState().currentPairIndex).toBe(0)
    })

    it('should be on exercise 1 in pair', () => {
      expect(useWorkoutSessionStore.getState().currentExerciseInPair).toBe(1)
    })

    it('should be on set 1', () => {
      expect(useWorkoutSessionStore.getState().currentSet).toBe(1)
    })
  })

  describe('startWorkout', () => {
    it('should set isActive to true', () => {
      useWorkoutSessionStore.getState().startWorkout('workout-a')
      expect(useWorkoutSessionStore.getState().isActive).toBe(true)
    })

    it('should set workoutId', () => {
      useWorkoutSessionStore.getState().startWorkout('workout-b')
      expect(useWorkoutSessionStore.getState().workoutId).toBe('workout-b')
    })

    it('should set phase to warmup', () => {
      useWorkoutSessionStore.getState().startWorkout('workout-a')
      expect(useWorkoutSessionStore.getState().phase).toBe('warmup')
    })

    it('should set startTime to current timestamp', () => {
      useWorkoutSessionStore.getState().startWorkout('workout-a')
      expect(useWorkoutSessionStore.getState().startTime).toBe(Date.now())
    })

    it('should reset exercise progress', () => {
      // Add some progress first
      useWorkoutSessionStore.getState().recordExerciseSet('test', 10, 0)
      useWorkoutSessionStore.getState().startWorkout('workout-a')
      expect(useWorkoutSessionStore.getState().exerciseProgress).toEqual([])
    })

    it('should reset position to first pair, first exercise, first set', () => {
      useWorkoutSessionStore.getState().startWorkout('workout-a')
      expect(useWorkoutSessionStore.getState().currentPairIndex).toBe(0)
      expect(useWorkoutSessionStore.getState().currentExerciseInPair).toBe(1)
      expect(useWorkoutSessionStore.getState().currentSet).toBe(1)
    })
  })

  describe('setPhase', () => {
    it('should update phase to strength', () => {
      useWorkoutSessionStore.getState().setPhase('strength')
      expect(useWorkoutSessionStore.getState().phase).toBe('strength')
    })

    it('should update phase to cooldown', () => {
      useWorkoutSessionStore.getState().setPhase('cooldown')
      expect(useWorkoutSessionStore.getState().phase).toBe('cooldown')
    })

    it('should update phase to summary', () => {
      useWorkoutSessionStore.getState().setPhase('summary')
      expect(useWorkoutSessionStore.getState().phase).toBe('summary')
    })
  })

  describe('incrementReps', () => {
    it('should increment currentReps by 1', () => {
      useWorkoutSessionStore.getState().incrementReps()
      expect(useWorkoutSessionStore.getState().currentReps).toBe(1)
    })

    it('should increment from any starting value', () => {
      useWorkoutSessionStore.getState().incrementReps()
      useWorkoutSessionStore.getState().incrementReps()
      useWorkoutSessionStore.getState().incrementReps()
      expect(useWorkoutSessionStore.getState().currentReps).toBe(3)
    })
  })

  describe('setDuration', () => {
    it('should update currentDuration', () => {
      useWorkoutSessionStore.getState().setDuration(30)
      expect(useWorkoutSessionStore.getState().currentDuration).toBe(30)
    })
  })

  describe('moveToNextExercise', () => {
    it('should toggle from exercise 1 to 2 in pair', () => {
      useWorkoutSessionStore.getState().startWorkout('workout-a')
      useWorkoutSessionStore.getState().moveToNextExercise()
      expect(useWorkoutSessionStore.getState().currentExerciseInPair).toBe(2)
    })

    it('should toggle from exercise 2 to 1 in pair', () => {
      useWorkoutSessionStore.getState().startWorkout('workout-a')
      useWorkoutSessionStore.getState().moveToNextExercise()
      useWorkoutSessionStore.getState().moveToNextExercise()
      expect(useWorkoutSessionStore.getState().currentExerciseInPair).toBe(1)
    })

    it('should reset currentReps', () => {
      useWorkoutSessionStore.getState().incrementReps()
      useWorkoutSessionStore.getState().incrementReps()
      useWorkoutSessionStore.getState().moveToNextExercise()
      expect(useWorkoutSessionStore.getState().currentReps).toBe(0)
    })

    it('should reset currentDuration', () => {
      useWorkoutSessionStore.getState().setDuration(45)
      useWorkoutSessionStore.getState().moveToNextExercise()
      expect(useWorkoutSessionStore.getState().currentDuration).toBe(0)
    })
  })

  describe('moveToNextPair', () => {
    it('should increment currentPairIndex', () => {
      useWorkoutSessionStore.getState().startWorkout('workout-a')
      useWorkoutSessionStore.getState().moveToNextPair()
      expect(useWorkoutSessionStore.getState().currentPairIndex).toBe(1)
    })

    it('should reset currentExerciseInPair to 1', () => {
      useWorkoutSessionStore.getState().startWorkout('workout-a')
      useWorkoutSessionStore.getState().moveToNextExercise()
      useWorkoutSessionStore.getState().moveToNextPair()
      expect(useWorkoutSessionStore.getState().currentExerciseInPair).toBe(1)
    })

    it('should reset currentSet to 1', () => {
      useWorkoutSessionStore.getState().startWorkout('workout-a')
      useWorkoutSessionStore.setState({ currentSet: 3 })
      useWorkoutSessionStore.getState().moveToNextPair()
      expect(useWorkoutSessionStore.getState().currentSet).toBe(1)
    })

    it('should reset currentReps and currentDuration', () => {
      useWorkoutSessionStore.getState().incrementReps()
      useWorkoutSessionStore.getState().setDuration(30)
      useWorkoutSessionStore.getState().moveToNextPair()
      expect(useWorkoutSessionStore.getState().currentReps).toBe(0)
      expect(useWorkoutSessionStore.getState().currentDuration).toBe(0)
    })
  })

  describe('recordExerciseSet', () => {
    it('should create new progress entry for new exercise', () => {
      useWorkoutSessionStore.getState().recordExerciseSet('push-ups', 12, 0)

      const progress = useWorkoutSessionStore.getState().exerciseProgress
      expect(progress).toHaveLength(1)
      expect(progress[0].exerciseId).toBe('push-ups')
      expect(progress[0].completedSets).toBe(1)
    })

    it('should add to existing progress for known exercise', () => {
      useWorkoutSessionStore.getState().recordExerciseSet('push-ups', 12, 0)
      useWorkoutSessionStore.getState().recordExerciseSet('push-ups', 10, 0)

      const progress = useWorkoutSessionStore.getState().exerciseProgress
      expect(progress).toHaveLength(1)
      expect(progress[0].completedSets).toBe(2)
    })

    it('should track reps when reps > 0', () => {
      useWorkoutSessionStore.getState().recordExerciseSet('push-ups', 12, 0)
      useWorkoutSessionStore.getState().recordExerciseSet('push-ups', 10, 0)

      const progress = useWorkoutSessionStore.getState().exerciseProgress[0]
      expect(progress.repsPerSet).toEqual([12, 10])
    })

    it('should track duration when duration > 0', () => {
      useWorkoutSessionStore.getState().recordExerciseSet('dead-hang', 0, 30)
      useWorkoutSessionStore.getState().recordExerciseSet('dead-hang', 0, 25)

      const progress = useWorkoutSessionStore.getState().exerciseProgress[0]
      expect(progress.durationPerSet).toEqual([30, 25])
    })

    it('should not add to repsPerSet when reps is 0', () => {
      useWorkoutSessionStore.getState().recordExerciseSet('dead-hang', 0, 30)

      const progress = useWorkoutSessionStore.getState().exerciseProgress[0]
      expect(progress.repsPerSet).toEqual([])
    })

    it('should not add to durationPerSet when duration is 0', () => {
      useWorkoutSessionStore.getState().recordExerciseSet('push-ups', 12, 0)

      const progress = useWorkoutSessionStore.getState().exerciseProgress[0]
      expect(progress.durationPerSet).toEqual([])
    })

    it('should increment completedSets each time', () => {
      useWorkoutSessionStore.getState().recordExerciseSet('push-ups', 12, 0)
      useWorkoutSessionStore.getState().recordExerciseSet('push-ups', 10, 0)
      useWorkoutSessionStore.getState().recordExerciseSet('push-ups', 8, 0)

      const progress = useWorkoutSessionStore.getState().exerciseProgress[0]
      expect(progress.completedSets).toBe(3)
    })
  })

  describe('phase status actions', () => {
    it('completeWarmup should set warmupStatus to completed', () => {
      useWorkoutSessionStore.getState().completeWarmup()
      expect(useWorkoutSessionStore.getState().warmupStatus).toBe('completed')
    })

    it('skipWarmup should set warmupStatus to skipped', () => {
      useWorkoutSessionStore.getState().skipWarmup()
      expect(useWorkoutSessionStore.getState().warmupStatus).toBe('skipped')
    })

    it('completeCooldown should set cooldownStatus to completed', () => {
      useWorkoutSessionStore.getState().completeCooldown()
      expect(useWorkoutSessionStore.getState().cooldownStatus).toBe('completed')
    })

    it('skipCooldown should set cooldownStatus to skipped', () => {
      useWorkoutSessionStore.getState().skipCooldown()
      expect(useWorkoutSessionStore.getState().cooldownStatus).toBe('skipped')
    })
  })

  describe('rest management', () => {
    it('startRest should set isResting true', () => {
      useWorkoutSessionStore.getState().startRest()
      expect(useWorkoutSessionStore.getState().isResting).toBe(true)
    })

    it('startRest should set restTimeRemaining to 90', () => {
      useWorkoutSessionStore.getState().startRest()
      expect(useWorkoutSessionStore.getState().restTimeRemaining).toBe(90)
    })

    it('endRest should set isResting to false', () => {
      useWorkoutSessionStore.getState().startRest()
      useWorkoutSessionStore.getState().endRest()
      expect(useWorkoutSessionStore.getState().isResting).toBe(false)
    })

    it('updateRestTime should update restTimeRemaining', () => {
      useWorkoutSessionStore.getState().updateRestTime(45)
      expect(useWorkoutSessionStore.getState().restTimeRemaining).toBe(45)
    })

    it('updateRestTime should allow negative values (over-resting)', () => {
      useWorkoutSessionStore.getState().updateRestTime(-10)
      expect(useWorkoutSessionStore.getState().restTimeRemaining).toBe(-10)
    })
  })

  describe('hold phase management', () => {
    it('setHoldPhase should update holdPhase to countdown', () => {
      useWorkoutSessionStore.getState().setHoldPhase('countdown')
      expect(useWorkoutSessionStore.getState().holdPhase).toBe('countdown')
    })

    it('setHoldPhase should update holdPhase to active', () => {
      useWorkoutSessionStore.getState().setHoldPhase('active')
      expect(useWorkoutSessionStore.getState().holdPhase).toBe('active')
    })

    it('setHoldPhase should update holdPhase to complete', () => {
      useWorkoutSessionStore.getState().setHoldPhase('complete')
      expect(useWorkoutSessionStore.getState().holdPhase).toBe('complete')
    })
  })

  describe('resetExerciseState', () => {
    it('should reset currentReps to 0', () => {
      useWorkoutSessionStore.getState().incrementReps()
      useWorkoutSessionStore.getState().resetExerciseState()
      expect(useWorkoutSessionStore.getState().currentReps).toBe(0)
    })

    it('should reset currentDuration to 0', () => {
      useWorkoutSessionStore.getState().setDuration(30)
      useWorkoutSessionStore.getState().resetExerciseState()
      expect(useWorkoutSessionStore.getState().currentDuration).toBe(0)
    })

    it('should reset holdPhase to ready', () => {
      useWorkoutSessionStore.getState().setHoldPhase('active')
      useWorkoutSessionStore.getState().resetExerciseState()
      expect(useWorkoutSessionStore.getState().holdPhase).toBe('ready')
    })

    it('should set new setStartTime', () => {
      useWorkoutSessionStore.getState().resetExerciseState()
      expect(useWorkoutSessionStore.getState().setStartTime).toBe(Date.now())
    })
  })

  describe('endWorkout', () => {
    it('should set phase to summary', () => {
      useWorkoutSessionStore.getState().startWorkout('workout-a')
      useWorkoutSessionStore.getState().endWorkout()
      expect(useWorkoutSessionStore.getState().phase).toBe('summary')
    })

    it('should set endTime to current timestamp', () => {
      useWorkoutSessionStore.getState().startWorkout('workout-a')
      vi.advanceTimersByTime(60000) // Advance 1 minute
      useWorkoutSessionStore.getState().endWorkout()
      expect(useWorkoutSessionStore.getState().endTime).toBe(Date.now())
    })
  })

  describe('resetSession', () => {
    it('should restore all initial state values', () => {
      // Modify state
      useWorkoutSessionStore.getState().startWorkout('workout-a')
      useWorkoutSessionStore.getState().incrementReps()
      useWorkoutSessionStore.getState().setDuration(30)
      useWorkoutSessionStore.getState().moveToNextExercise()
      useWorkoutSessionStore.getState().moveToNextPair()
      useWorkoutSessionStore.getState().completeWarmup()
      useWorkoutSessionStore.getState().recordExerciseSet('test', 10, 0)

      // Reset
      useWorkoutSessionStore.getState().resetSession()

      // Verify initial state
      const state = useWorkoutSessionStore.getState()
      expect(state.isActive).toBe(false)
      expect(state.workoutId).toBeNull()
      expect(state.phase).toBe('warmup')
      expect(state.startTime).toBeNull()
      expect(state.endTime).toBeNull()
      expect(state.warmupStatus).toBe('pending')
      expect(state.cooldownStatus).toBe('pending')
      expect(state.currentPairIndex).toBe(0)
      expect(state.currentExerciseInPair).toBe(1)
      expect(state.currentSet).toBe(1)
      expect(state.currentReps).toBe(0)
      expect(state.currentDuration).toBe(0)
      expect(state.isResting).toBe(false)
      expect(state.holdPhase).toBe('ready')
      expect(state.exerciseProgress).toEqual([])
    })
  })
})
