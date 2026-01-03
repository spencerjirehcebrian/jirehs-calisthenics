import { useState } from 'react'
import { Button } from '@/components/base/Button'
import { Timer } from '@/components/base/Timer'
import { RepCounter, TimedHold, RestTimer, HoldToSkip } from '@/components/interactions'
import { useNavigationStore, useWorkoutSessionStore, useSettingsStore } from '@/stores'
import { useElapsedTime, useAudioCue, useKeepAlive } from '@/hooks'
import { getWorkoutById } from '@/data/workouts'
import { getExerciseById } from '@/data/exercises'

export function ActiveWorkoutScreen() {
  const { playSetComplete } = useAudioCue()

  // Keep audio context alive during workout to prevent PWA suspension
  useKeepAlive(true)
  const navigate = useNavigationStore((state) => state.navigate)
  const setPhase = useWorkoutSessionStore((state) => state.setPhase)
  const {
    workoutId,
    currentPairIndex,
    currentExerciseInPair,
    currentSet,
    currentReps,
    isResting,
    startTime,
    setStartTime,
    incrementReps,
    startRest,
    endRest,
    completeSet,
    moveToNextExercise,
    resetExerciseState,
    recordExerciseSet
  } = useWorkoutSessionStore()
  const deloadMode = useSettingsStore((state) => state.deloadMode)
  const holdCountdown = useSettingsStore((state) => state.holdCountdown)

  // Expandable section states
  const [showFormCues, setShowFormCues] = useState(true)
  const [showEquipmentSetup, setShowEquipmentSetup] = useState(false)
  const [showSetTimer, setShowSetTimer] = useState(false)

  // Elapsed time calculations
  const sessionElapsed = useElapsedTime(startTime)
  const setElapsed = useElapsedTime(setStartTime)

  const workout = workoutId ? getWorkoutById(workoutId) : null
  const currentPair = workout?.pairs[currentPairIndex]
  const currentWorkoutExercise = currentExerciseInPair === 1
    ? currentPair?.exercise1
    : currentPair?.exercise2
  const exercise = currentWorkoutExercise
    ? getExerciseById(currentWorkoutExercise.exerciseId)
    : null

  // Get next exercise for preview during rest
  const getNextExercise = () => {
    if (!workout || !currentPair) return null

    // If we're on exercise 1, next is exercise 2
    if (currentExerciseInPair === 1) {
      return getExerciseById(currentPair.exercise2.exerciseId)
    }
    // If we're on exercise 2, next is exercise 1 of same pair (if more sets)
    // or exercise 1 of next pair
    const totalSets = deloadMode ? 2 : 3
    if (currentSet < totalSets) {
      return getExerciseById(currentPair.exercise1.exerciseId)
    }
    // Check if there's a next pair
    const nextPair = workout.pairs[currentPairIndex + 1]
    if (nextPair) {
      return getExerciseById(nextPair.exercise1.exerciseId)
    }
    return null
  }

  const totalSets = deloadMode ? 2 : 3

  const handleExerciseComplete = () => {
    // Record the exercise set before completing
    if (currentWorkoutExercise && exercise) {
      const reps = exercise.type === 'reps' ? currentReps : 0
      const duration = exercise.type !== 'reps' ? (currentWorkoutExercise.targetDurationSeconds ?? 0) : 0
      recordExerciseSet(currentWorkoutExercise.exerciseId, reps, duration)

      // Play set complete audio for rep-based exercises
      // (timed holds play their own completion sound)
      if (exercise.type === 'reps') {
        playSetComplete()
      }
    }
    completeSet()
    startRest()
  }

  const handleRestComplete = () => {
    endRest()
    resetExerciseState()

    // Move to next exercise in pair or next pair
    if (currentExerciseInPair === 1) {
      moveToNextExercise()
    } else {
      // After exercise 2, check if more sets needed
      if (currentSet < totalSets) {
        useWorkoutSessionStore.setState({ currentSet: currentSet + 1 })
        moveToNextExercise()
      } else {
        // Move to next pair or finish
        if (currentPairIndex < (workout?.pairs.length ?? 0) - 1) {
          useWorkoutSessionStore.getState().moveToNextPair()
        } else {
          // All pairs done, go to cooldown
          setPhase('cooldown')
          navigate('cooldown')
        }
      }
    }
  }

  const handleSkipExercise = () => {
    handleExerciseComplete()
  }

  const handleFinishWorkout = () => {
    setPhase('cooldown')
    navigate('cooldown')
  }

  if (!workout || !exercise) {
    return (
      <div className="flex-1 flex items-center justify-center p-6">
        <p>No workout selected</p>
      </div>
    )
  }

  // Rest state
  if (isResting) {
    const nextExercise = getNextExercise()
    return (
      <div className="flex-1 flex flex-col relative">
        {/* Screen reader live region for status updates */}
        <div aria-live="polite" aria-atomic="true" className="sr-only">
          Resting. {nextExercise?.name ? `Next: ${nextExercise.name}` : ''}
        </div>

        {/* Session timer and deload badge - top right */}
        <div className="absolute top-4 right-4 flex items-center gap-2 z-10">
          {deloadMode && (
            <span className="text-xs px-2 py-1 bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200 rounded-full font-medium">
              Deload
            </span>
          )}
          <span className="text-sm text-neutral-500">
            <Timer seconds={sessionElapsed} size="sm" />
          </span>
        </div>

        <RestTimer
          initialSeconds={90}
          onComplete={handleRestComplete}
          nextExerciseName={nextExercise?.name}
        />

        {/* Set progress - bottom */}
        <div className="p-4 border-t border-neutral-200 dark:border-neutral-800">
          <div className="text-center text-neutral-500">
            Pair {currentPairIndex + 1}/{workout.pairs.length} - Set {currentSet}/{totalSets}
          </div>
        </div>
      </div>
    )
  }

  // Exercise state - render based on type
  return (
    <div className="flex-1 flex flex-col relative">
      {/* Screen reader live region for status updates */}
      <div aria-live="polite" aria-atomic="true" className="sr-only">
        {exercise.name}. Set {currentSet} of {totalSets}.
      </div>

      {/* Session timer and deload badge - top right */}
      <div className="absolute top-4 right-4 flex items-center gap-2 z-10">
        {deloadMode && (
          <span className="text-xs px-2 py-1 bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200 rounded-full font-medium">
            Deload
          </span>
        )}
        <span className="text-sm text-neutral-500">
          <Timer seconds={sessionElapsed} size="sm" />
        </span>
      </div>

      {/* Main content area */}
      <div className="flex-1 flex flex-col overflow-y-auto">
        {/* Exercise name - always visible, responsive typography */}
        <div className="p-4 pt-12 text-center">
          <h1
            className="font-bold"
            style={{ fontSize: 'var(--font-size-heading)' }}
          >
            {exercise.name}
          </h1>
        </div>

        {/* Interaction area based on exercise type */}
        {exercise.type === 'reps' ? (
          <RepCounter
            currentReps={currentReps}
            targetRepsMin={currentWorkoutExercise?.targetRepsMin}
            targetRepsMax={currentWorkoutExercise?.targetRepsMax}
            isMaxReps={currentWorkoutExercise?.isMaxReps}
            onIncrement={incrementReps}
          />
        ) : (
          <TimedHold
            targetSeconds={currentWorkoutExercise?.targetDurationSeconds ?? 30}
            countdownDuration={holdCountdown}
            onComplete={handleExerciseComplete}
          />
        )}

        {/* Form cues - collapsible */}
        <div className="px-4 pb-2">
          <button
            onClick={() => setShowFormCues(!showFormCues)}
            aria-expanded={showFormCues}
            aria-controls="form-cues-content"
            className="w-full text-left p-4 rounded-lg bg-neutral-100 dark:bg-neutral-800 focus-interactive"
          >
            <div className="flex justify-between items-center">
              <h3 className="font-semibold">Form Cues</h3>
              <span className="text-neutral-500" aria-hidden="true">
                {showFormCues ? '-' : '+'}
              </span>
            </div>
            <div id="form-cues-content" hidden={!showFormCues}>
              <ul className="text-sm space-y-1 text-neutral-600 dark:text-neutral-400 mt-2">
                {exercise.formCues.map((cue, index) => (
                  <li key={index}>{cue}</li>
                ))}
              </ul>
            </div>
          </button>
        </div>

        {/* Equipment Setup - collapsible, only if exists */}
        {exercise.equipmentSetup && (
          <div className="px-4 pb-2">
            <button
              onClick={() => setShowEquipmentSetup(!showEquipmentSetup)}
              aria-expanded={showEquipmentSetup}
              aria-controls="equipment-setup-content"
              className="w-full text-left p-4 rounded-lg bg-neutral-100 dark:bg-neutral-800 focus-interactive"
            >
              <div className="flex justify-between items-center">
                <h3 className="font-semibold">Equipment Setup</h3>
                <span className="text-neutral-500" aria-hidden="true">
                  {showEquipmentSetup ? '-' : '+'}
                </span>
              </div>
              <div id="equipment-setup-content" hidden={!showEquipmentSetup}>
                <p className="text-sm text-neutral-600 dark:text-neutral-400 mt-2">
                  {exercise.equipmentSetup}
                </p>
              </div>
            </button>
          </div>
        )}

        {/* Set Timer - collapsible */}
        <div className="px-4 pb-4">
          <button
            onClick={() => setShowSetTimer(!showSetTimer)}
            aria-expanded={showSetTimer}
            aria-controls="set-timer-content"
            className="w-full text-left p-4 rounded-lg bg-neutral-100 dark:bg-neutral-800 focus-interactive"
          >
            <div className="flex justify-between items-center">
              <h3 className="font-semibold">Set Timer</h3>
              <span className="text-neutral-500" aria-hidden="true">
                {showSetTimer ? '-' : '+'}
              </span>
            </div>
            <div id="set-timer-content" hidden={!showSetTimer}>
              <div className="mt-2 flex items-center justify-center">
                <Timer seconds={setElapsed} size="md" />
              </div>
            </div>
          </button>
        </div>
      </div>

      {/* Hold to skip - for rep exercises */}
      {exercise.type === 'reps' && (
        <HoldToSkip
          onSkip={handleSkipExercise}
          position="bottom-right"
        />
      )}

      {/* Set progress and finish button - bottom */}
      <div className="p-4 border-t border-neutral-200 dark:border-neutral-800">
        <div className="text-center text-neutral-500 mb-4">
          Pair {currentPairIndex + 1}/{workout.pairs.length} - Set {currentSet}/{totalSets}
        </div>

        {/* Done button for rep exercises */}
        {exercise.type === 'reps' && (
          <Button fullWidth onClick={handleExerciseComplete}>
            Done - Start Rest
          </Button>
        )}

        {/* Skip workout button */}
        <Button
          variant="ghost"
          fullWidth
          onClick={handleFinishWorkout}
          className="mt-2"
        >
          Skip to Cool-down
        </Button>
      </div>
    </div>
  )
}
