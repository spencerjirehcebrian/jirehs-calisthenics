import { useState, useCallback } from 'react'
import { Button } from '@/components/base/Button'
import { ActionBar } from '@/components/layout/ActionBar'
import { RepCounter, TimedHold, TapToSkipOverlay } from '@/components/interactions'
import type { TimedHoldPhase } from '@/components/interactions'
import { useNavigationStore, usePracticeStore, useSettingsStore } from '@/stores'
import { getExerciseById } from '@/data/exercises'
import { motion } from 'framer-motion'
import { Target, Wrench } from 'lucide-react'

export function PracticeScreen() {
  const navigate = useNavigationStore((state) => state.navigate)
  const goBack = useNavigationStore((state) => state.goBack)
  const { exerciseId, currentReps, incrementReps, resetPractice } = usePracticeStore()
  const holdCountdown = useSettingsStore((state) => state.holdCountdown)

  // Timed hold phase tracking for tap-anywhere
  const [timedHoldPhase, setTimedHoldPhase] = useState<TimedHoldPhase>('ready')
  const [holdTriggerStart, setHoldTriggerStart] = useState(false)

  const exercise = exerciseId ? getExerciseById(exerciseId) : null

  const handleComplete = () => {
    // Practice mode does not track/log - just return to library
    resetPractice()
    goBack()
  }

  const handleExit = () => {
    resetPractice()
    goBack()
  }

  // Unified tap handler for the overlay
  const handleTap = useCallback(() => {
    if (exercise?.type === 'reps') {
      incrementReps()
    } else if (timedHoldPhase === 'ready') {
      // Trigger timed hold start
      setHoldTriggerStart(true)
      setTimeout(() => setHoldTriggerStart(false), 100)
    }
  }, [exercise?.type, timedHoldPhase, incrementReps])

  // Determine if tap should be enabled
  // For reps: always tappable; for timed: only in ready phase
  const isTapEnabled = exercise != null && (
    exercise.type === 'reps' || timedHoldPhase === 'ready'
  )

  if (!exercise) {
    return (
      <motion.div
        className="flex-1 flex flex-col items-center justify-center p-6 gap-6 bg-cream-100 dark:bg-ink-950 bg-grain"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        <p className="text-body-lg text-ink-600 dark:text-cream-400">
          No exercise selected for practice
        </p>
        <Button onClick={() => navigate('exercise-library')}>
          GO TO EXERCISE LIBRARY
        </Button>
      </motion.div>
    )
  }

  return (
    <TapToSkipOverlay onSkip={handleComplete} onTap={isTapEnabled ? handleTap : undefined}>
      <motion.div
        className="flex-1 flex flex-col relative bg-cream-100 dark:bg-ink-950 bg-grain"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        {/* Exit button - top left */}
        <motion.div
          className="absolute top-4 left-4 md:top-6 md:left-6 z-10"
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Button variant="ghost" size="sm" onClick={handleExit} withAccent>
            Exit Practice
          </Button>
        </motion.div>

        {/* Main content area */}
        <div className="flex-1 flex flex-col overflow-y-auto">
          {/* Exercise name */}
          <motion.div
            className="p-4 pt-16 text-center"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <p className="text-body-sm text-earth-600 dark:text-earth-400 font-medium mb-1 uppercase tracking-wider">
              Practice Mode
            </p>
            <h1 className="font-display font-semibold text-display-md text-ink-900 dark:text-cream-100">
              {exercise.name.toUpperCase()}
            </h1>
            <div className="mt-3 h-1 w-12 bg-earth-500 dark:bg-earth-400 mx-auto" />
          </motion.div>

          {/* Interaction area based on exercise type */}
          {exercise.type === 'reps' ? (
            <RepCounter
              currentReps={currentReps}
              targetRepsMin={exercise.targetRepsMin}
              targetRepsMax={exercise.targetRepsMax}
            />
          ) : (
            <TimedHold
              targetSeconds={exercise.targetDurationSeconds ?? 30}
              countdownDuration={holdCountdown}
              onComplete={handleComplete}
              onPhaseChange={setTimedHoldPhase}
              externalTriggerStart={holdTriggerStart}
            />
          )}

          {/* Form cues - always shown in practice */}
          <motion.div
            className="px-4 pb-4"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <div className="p-4 rounded-xl bg-cream-50 dark:bg-ink-800 border border-cream-300/60 dark:border-ink-700">
              <h3 className="font-semibold mb-2 text-ink-800 dark:text-cream-100 text-body-sm uppercase tracking-wider">
                Form Cues
              </h3>
              <ul className="space-y-2 text-body-md text-ink-700 dark:text-cream-300">
                {exercise.formCues.map((cue, index) => (
                  <li key={index} className="flex gap-2">
                    <span className="text-earth-500">-</span>
                    {cue}
                  </li>
                ))}
              </ul>
            </div>
          </motion.div>

          {/* Equipment setup if exists */}
          {exercise.equipmentSetup && (
            <motion.div
              className="px-4 pb-4"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.35 }}
            >
              <div className="p-4 rounded-xl bg-cream-50 dark:bg-ink-800 border border-cream-300/60 dark:border-ink-700">
                <div className="flex items-center gap-2 mb-2">
                  <Wrench size={16} className="text-earth-600 dark:text-earth-400" />
                  <h3 className="font-semibold text-ink-800 dark:text-cream-100 text-body-sm uppercase tracking-wider">
                    Equipment Setup
                  </h3>
                </div>
                <p className="text-body-md text-ink-700 dark:text-cream-300">
                  {exercise.equipmentSetup}
                </p>
              </div>
            </motion.div>
          )}

          {/* Target info */}
          <motion.div
            className="px-4 pb-4"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <div className="p-4 rounded-xl bg-cream-50 dark:bg-ink-800 border border-cream-300/60 dark:border-ink-700">
              <div className="flex items-center gap-2 mb-2">
                <Target size={16} className="text-earth-600 dark:text-earth-400" />
                <h3 className="font-semibold text-ink-800 dark:text-cream-100 text-body-sm uppercase tracking-wider">
                  Target
                </h3>
              </div>
              <p className="text-body-md text-ink-700 dark:text-cream-300">
                {exercise.targetDurationSeconds
                  ? `${exercise.targetDurationSeconds} seconds`
                  : `${exercise.targetRepsMin}-${exercise.targetRepsMax} reps`}
              </p>
            </div>
          </motion.div>
        </div>

        {/* Done button for rep exercises */}
        {exercise.type === 'reps' && (
          <motion.div
            className="p-4 border-t border-cream-300/60 dark:border-ink-700 bg-cream-50/80 dark:bg-ink-900/80 backdrop-blur-sm"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <ActionBar>
              <Button fullWidth onClick={handleComplete}>
                DONE
              </Button>
            </ActionBar>
          </motion.div>
        )}
      </motion.div>
    </TapToSkipOverlay>
  )
}
