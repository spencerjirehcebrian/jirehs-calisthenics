import { useState, useCallback } from 'react'
import { Button, ConfirmDialog } from '@/components/base'
import { Timer } from '@/components/base/Timer'
import { RepCounter, TimedHold, RestTimer, TapToSkipOverlay } from '@/components/interactions'
import type { TimedHoldPhase } from '@/components/interactions'
import {
  ExerciseHeader,
  InteractionArea,
  MetadataTabs,
  BottomBar,
  LoadingState
} from '@/components/workout'
import { useNavigationStore, useWorkoutSessionStore, useSettingsStore } from '@/stores'
import { useElapsedTime, useAudioCue, useKeepAlive, useVoiceCommands, useExitConfirmation } from '@/hooks'
import { getWorkoutById } from '@/data/workouts'
import { getExerciseById } from '@/data/exercises'
import { motion, AnimatePresence } from 'framer-motion'

export function ActiveWorkoutScreen() {
  const { playSetComplete } = useAudioCue()
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

  // Voice control state
  const [holdTriggerStart, setHoldTriggerStart] = useState(false)
  const [holdTriggerStop, setHoldTriggerStop] = useState(false)
  const [restExtendTrigger, setRestExtendTrigger] = useState(false)

  // Timed hold phase tracking for tap-anywhere
  const [timedHoldPhase, setTimedHoldPhase] = useState<TimedHoldPhase>('ready')

  // Exit confirmation
  const { openDialog: handleExitExercise, dialogProps } = useExitConfirmation(() => navigate('home'))

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

  const totalSets = deloadMode ? 2 : 3

  // Calculate progress for progress bar (simple arithmetic, no memoization needed)
  const progress = (() => {
    if (!workout) return { current: 0, total: 0 }

    const totalPairs = workout.pairs.length
    const totalSteps = totalPairs * 2 * totalSets // pairs * exercises per pair * sets

    // Calculate completed steps
    let completed = 0
    // Completed pairs (all sets of both exercises)
    completed += currentPairIndex * 2 * totalSets
    // Completed sets in current pair
    const completedSetsInPair = (currentSet - 1) * 2 + (currentExerciseInPair - 1)
    completed += completedSetsInPair

    return { current: completed + 1, total: totalSteps }
  })()

  const getNextExercise = () => {
    if (!workout || !currentPair) return null

    if (currentExerciseInPair === 1) {
      return getExerciseById(currentPair.exercise2.exerciseId)
    }
    if (currentSet < totalSets) {
      return getExerciseById(currentPair.exercise1.exerciseId)
    }
    const nextPair = workout.pairs[currentPairIndex + 1]
    if (nextPair) {
      return getExerciseById(nextPair.exercise1.exerciseId)
    }
    return null
  }

  const handleExerciseComplete = () => {
    if (currentWorkoutExercise && exercise) {
      const reps = exercise.type === 'reps' ? currentReps : 0
      const duration = exercise.type !== 'reps' ? (currentWorkoutExercise.targetDurationSeconds ?? 0) : 0
      recordExerciseSet(currentWorkoutExercise.exerciseId, reps, duration)

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

    if (currentExerciseInPair === 1) {
      moveToNextExercise()
    } else {
      if (currentSet < totalSets) {
        useWorkoutSessionStore.setState({ currentSet: currentSet + 1 })
        moveToNextExercise()
      } else {
        if (currentPairIndex < (workout?.pairs.length ?? 0) - 1) {
          useWorkoutSessionStore.getState().moveToNextPair()
        } else {
          setPhase('cooldown')
          navigate('cooldown')
        }
      }
    }
  }

  const handleSkipExercise = () => {
    handleExerciseComplete()
  }

  // Voice command handlers
  const handleVoiceNumber = useCallback((n: number) => {
    useWorkoutSessionStore.setState({ currentReps: n })
  }, [])

  const handleVoiceUndo = useCallback(() => {
    const current = useWorkoutSessionStore.getState().currentReps
    if (current > 0) {
      useWorkoutSessionStore.setState({ currentReps: current - 1 })
    }
  }, [])

  const handleVoiceReady = useCallback(() => {
    setHoldTriggerStart(true)
    setTimeout(() => setHoldTriggerStart(false), 100)
  }, [])

  const handleVoiceStop = useCallback(() => {
    setHoldTriggerStop(true)
    setTimeout(() => setHoldTriggerStop(false), 100)
  }, [])

  const handleVoiceExtend = useCallback(() => {
    setRestExtendTrigger(true)
    setTimeout(() => setRestExtendTrigger(false), 100)
  }, [])

  // Voice commands for reps mode
  useVoiceCommands({
    context: 'repCounter',
    handlers: {
      onNumber: handleVoiceNumber,
      onDone: handleExerciseComplete,
      onUndo: handleVoiceUndo
    },
    enabled: !isResting && exercise?.type === 'reps'
  })

  // Voice commands for timed hold mode
  useVoiceCommands({
    context: 'timedHold',
    handlers: {
      onReady: handleVoiceReady,
      onStop: handleVoiceStop
    },
    enabled: !isResting && exercise?.type !== 'reps'
  })

  // Voice commands for rest mode
  useVoiceCommands({
    context: 'rest',
    handlers: {
      onSkip: handleRestComplete,
      onExtend: handleVoiceExtend
    },
    enabled: isResting
  })

  // Unified tap handler for the overlay
  const handleTap = useCallback(() => {
    if (exercise?.type === 'reps') {
      incrementReps()
    } else if (timedHoldPhase === 'ready') {
      // Trigger timed hold start
      setHoldTriggerStart(true)
      setTimeout(() => setHoldTriggerStart(false), 100)
    }
    // For timed mode in countdown/active/complete phases, tap does nothing
  }, [exercise?.type, timedHoldPhase, incrementReps])

  // Determine if tap should be enabled (only for exercise, not rest)
  // For reps: always tappable; for timed: only in ready phase
  const isTapEnabled = !isResting && exercise != null && (
    exercise.type === 'reps' || timedHoldPhase === 'ready'
  )

  if (!workout || !exercise) {
    return <LoadingState message="No workout selected" isError />
  }

  // Rest state
  if (isResting) {
    const nextExercise = getNextExercise()
    return (
      <motion.div
        className="flex-1 flex flex-col min-h-0 relative bg-cream-100 dark:bg-ink-950 bg-grain"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        <div aria-live="polite" aria-atomic="true" className="sr-only">
          Resting. {nextExercise?.name ? `Next: ${nextExercise.name}` : ''}
        </div>

        {/* Exit button - top left */}
        <motion.div
          className="absolute top-4 left-4 z-10"
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Button variant="ghost" size="sm" onClick={handleExitExercise} withAccent>
            Exit
          </Button>
        </motion.div>

        {/* Session timer and deload badge */}
        <div className="absolute top-4 right-4 flex items-center gap-2 z-10">
          {deloadMode && (
            <span className="text-body-xs px-2 py-1 bg-earth-200 dark:bg-earth-800 text-earth-700 dark:text-earth-200 rounded-full font-medium">
              Deload
            </span>
          )}
          <span className="text-body-sm text-ink-600 dark:text-cream-400">
            <Timer seconds={sessionElapsed} size="sm" animate={false} />
          </span>
        </div>

        <RestTimer
          initialSeconds={90}
          onComplete={handleRestComplete}
          nextExerciseName={nextExercise?.name}
          externalExtend={restExtendTrigger}
        />

        {/* Bottom bar with progress */}
        <BottomBar
          progress={progress}
          contextInfo={`Pair ${currentPairIndex + 1}/${workout.pairs.length} - Set ${currentSet}/${totalSets}`}
          showDeloadBadge={deloadMode}
        />

        <ConfirmDialog {...dialogProps} />
      </motion.div>
    )
  }

  // Exercise state - build tabs
  const tabs = [
    {
      id: 'form',
      label: 'Form',
      content: (
        <ul className="text-body-sm space-y-2 text-ink-700 dark:text-cream-300">
          {exercise.formCues.map((cue, index) => (
            <li key={index} className="flex gap-2">
              <span className="text-earth-500 dark:text-earth-400">-</span>
              {cue}
            </li>
          ))}
        </ul>
      )
    },
    exercise.equipmentSetup ? {
      id: 'setup',
      label: 'Setup',
      content: (
        <p className="text-body-sm text-ink-700 dark:text-cream-300">
          {exercise.equipmentSetup}
        </p>
      )
    } : null,
    {
      id: 'timer',
      label: 'Timer',
      content: (
        <div className="flex items-center justify-center py-2">
          <Timer seconds={setElapsed} size="lg" animate={false} />
        </div>
      )
    }
  ].filter(Boolean) as Array<{ id: string; label: string; content: React.ReactNode }>

  return (
    <TapToSkipOverlay onSkip={handleSkipExercise} onTap={isTapEnabled ? handleTap : undefined}>
      <motion.div
        className="flex-1 flex flex-col min-h-0 relative bg-cream-100 dark:bg-ink-950 bg-grain"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        <div aria-live="polite" aria-atomic="true" className="sr-only">
          {exercise.name}. Set {currentSet} of {totalSets}.
        </div>

        {/* Exit button - top left */}
        <motion.div
          className="absolute top-4 left-4 md:top-6 md:left-6 z-10"
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Button variant="ghost" size="sm" onClick={handleExitExercise} withAccent>
            Exit
          </Button>
        </motion.div>

        {/* Session timer and deload badge */}
        <div className="absolute top-4 right-4 flex items-center gap-2 z-10">
          {deloadMode && (
            <span className="text-body-xs px-2 py-1 bg-earth-200 dark:bg-earth-800 text-earth-700 dark:text-earth-200 rounded-full font-medium">
              Deload
            </span>
          )}
          <span className="text-body-sm text-ink-600 dark:text-cream-400">
            <Timer seconds={sessionElapsed} size="sm" animate={false} />
          </span>
        </div>

        {/* Main content */}
        <div className="flex-1 flex flex-col min-h-0 overflow-y-auto">
          {/* Exercise header */}
          <ExerciseHeader
            contextLabel={`STRENGTH - PAIR ${currentPairIndex + 1}`}
            exerciseName={exercise.name}
          />

          {/* Interaction area */}
          <InteractionArea>
            <AnimatePresence mode="wait">
              {exercise.type === 'reps' ? (
                <motion.div
                  key="reps"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                >
                  <RepCounter
                    currentReps={currentReps}
                    targetRepsMin={currentWorkoutExercise?.targetRepsMin}
                    targetRepsMax={currentWorkoutExercise?.targetRepsMax}
                    isMaxReps={currentWorkoutExercise?.isMaxReps}
                  />
                </motion.div>
              ) : (
                <motion.div
                  key="hold"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                >
                  <TimedHold
                    targetSeconds={currentWorkoutExercise?.targetDurationSeconds ?? 30}
                    countdownDuration={holdCountdown}
                    onComplete={handleExerciseComplete}
                    onPhaseChange={setTimedHoldPhase}
                    externalTriggerStart={holdTriggerStart}
                    externalTriggerStop={holdTriggerStop}
                  />
                </motion.div>
              )}
            </AnimatePresence>
          </InteractionArea>

          {/* Metadata tabs */}
          <MetadataTabs tabs={tabs} defaultTab="form" />
        </div>

        {/* Bottom bar with progress */}
        <BottomBar
          progress={progress}
          contextInfo={`Pair ${currentPairIndex + 1}/${workout.pairs.length} - Set ${currentSet}/${totalSets}`}
          actionButton={
            exercise.type === 'reps'
              ? { label: 'DONE - START REST', onClick: handleExerciseComplete }
              : undefined
          }
          showDeloadBadge={deloadMode}
        />

        <ConfirmDialog {...dialogProps} />
      </motion.div>
    </TapToSkipOverlay>
  )
}
