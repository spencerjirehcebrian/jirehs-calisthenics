import { useState } from 'react'
import { Button, ConfirmDialog } from '@/components/base'
import { Timer } from '@/components/base/Timer'
import { ActionBar } from '@/components/layout/ActionBar'
import { RepCounter, TimedHold, RestTimer, TapToSkipOverlay } from '@/components/interactions'
import { useNavigationStore, useWorkoutSessionStore, useSettingsStore } from '@/stores'
import { useElapsedTime, useAudioCue, useKeepAlive } from '@/hooks'
import { getWorkoutById } from '@/data/workouts'
import { getExerciseById } from '@/data/exercises'
import { motion, AnimatePresence } from 'framer-motion'

type InfoTab = 'form' | 'setup' | 'timer'

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

  const [activeTab, setActiveTab] = useState<InfoTab>('form')
  const [showExitDialog, setShowExitDialog] = useState(false)

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

  const getNextExercise = () => {
    if (!workout || !currentPair) return null

    if (currentExerciseInPair === 1) {
      return getExerciseById(currentPair.exercise2.exerciseId)
    }
    const totalSets = deloadMode ? 2 : 3
    if (currentSet < totalSets) {
      return getExerciseById(currentPair.exercise1.exerciseId)
    }
    const nextPair = workout.pairs[currentPairIndex + 1]
    if (nextPair) {
      return getExerciseById(nextPair.exercise1.exerciseId)
    }
    return null
  }

  const totalSets = deloadMode ? 2 : 3

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

  const handleExitExercise = () => {
    setShowExitDialog(true)
  }

  const confirmExit = () => {
    navigate('home')
  }

  if (!workout || !exercise) {
    return (
      <div className="flex-1 flex items-center justify-center p-6 bg-cream-100 dark:bg-ink-950">
        <p className="text-ink-600 dark:text-cream-400">No workout selected</p>
      </div>
    )
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
          className="absolute top-2 left-2 z-10"
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
        />

        {/* Bottom bar */}
        <div className="p-4 border-t border-cream-300/60 dark:border-ink-700 bg-cream-50/80 dark:bg-ink-900/80 backdrop-blur-sm">
          <div className="flex justify-between items-center text-body-sm text-ink-600 dark:text-cream-400">
            <span>Pair {currentPairIndex + 1}/{workout.pairs.length}</span>
            <span>Set {currentSet}/{totalSets}</span>
          </div>
        </div>

        <ConfirmDialog
          isOpen={showExitDialog}
          title="Exit Workout?"
          message="Your progress will not be saved. Are you sure you want to exit?"
          confirmLabel="Exit"
          cancelLabel="Continue"
          onConfirm={confirmExit}
          onCancel={() => setShowExitDialog(false)}
        />
      </motion.div>
    )
  }

  // Exercise state
  const tabs: { id: InfoTab; label: string }[] = [
    { id: 'form', label: 'Form' },
    ...(exercise.equipmentSetup ? [{ id: 'setup' as InfoTab, label: 'Setup' }] : []),
    { id: 'timer', label: 'Timer' }
  ]

  return (
    <TapToSkipOverlay onSkip={handleSkipExercise} enabled={exercise.type === 'reps'}>
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
          Exit Exercise
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
        {/* Exercise name with underline */}
        <div className="p-4 pt-12">
          <motion.h1
            className="font-display font-semibold text-display-md text-ink-900 dark:text-cream-100"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3 }}
          >
            {exercise.name.toUpperCase()}
          </motion.h1>
          <motion.div
            className="mt-2 h-1 w-12 bg-earth-500 dark:bg-earth-400"
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 0.3, delay: 0.1 }}
            style={{ transformOrigin: 'left' }}
          />
        </div>

        {/* Interaction area */}
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
                onIncrement={incrementReps}
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
              />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Pill tabs for info sections */}
        <div className="px-4 pb-2">
          <div className="flex gap-2 mb-3">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`
                  px-4 py-2 rounded-full text-body-sm font-medium transition-all
                  focus-interactive
                  ${activeTab === tab.id
                    ? 'bg-earth-600 text-white dark:bg-earth-500'
                    : 'bg-cream-200 text-ink-700 dark:bg-ink-800 dark:text-cream-300 hover:bg-cream-300 dark:hover:bg-ink-700'
                  }
                `}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Tab content */}
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="p-4 rounded-xl bg-cream-50 dark:bg-ink-800 border border-cream-300/60 dark:border-ink-700"
            >
              {activeTab === 'form' && (
                <ul className="text-body-sm space-y-2 text-ink-700 dark:text-cream-300">
                  {exercise.formCues.map((cue, index) => (
                    <li key={index} className="flex gap-2">
                      <span className="text-earth-500 dark:text-earth-400">-</span>
                      {cue}
                    </li>
                  ))}
                </ul>
              )}
              {activeTab === 'setup' && exercise.equipmentSetup && (
                <p className="text-body-sm text-ink-700 dark:text-cream-300">
                  {exercise.equipmentSetup}
                </p>
              )}
              {activeTab === 'timer' && (
                <div className="flex items-center justify-center py-2">
                  <Timer seconds={setElapsed} size="lg" animate={false} />
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="p-4 border-t border-cream-300/60 dark:border-ink-700 bg-cream-50/80 dark:bg-ink-900/80 backdrop-blur-sm">
        <div className="flex justify-between items-center text-body-sm text-ink-600 dark:text-cream-400 mb-4">
          <span>Pair {currentPairIndex + 1}/{workout.pairs.length}</span>
          <span>Set {currentSet}/{totalSets}</span>
        </div>

        <ActionBar>
          {exercise.type === 'reps' && (
            <Button fullWidth onClick={handleExerciseComplete}>
              DONE - START REST
            </Button>
          )}
        </ActionBar>
      </div>

      <ConfirmDialog
        isOpen={showExitDialog}
        title="Exit Workout?"
        message="Your progress will not be saved. Are you sure you want to exit?"
        confirmLabel="Exit"
        cancelLabel="Continue"
        onConfirm={confirmExit}
        onCancel={() => setShowExitDialog(false)}
      />
      </motion.div>
    </TapToSkipOverlay>
  )
}
