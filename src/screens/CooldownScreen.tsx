import { useState, useEffect, useMemo, useCallback } from 'react'
import { Button, ConfirmDialog } from '@/components/base'
import { Timer } from '@/components/base/Timer'
import { RepCounter, TimedHold, TapToSkipOverlay } from '@/components/interactions'
import {
  ExerciseHeader,
  InteractionArea,
  MetadataTabs,
  BottomBar,
  LoadingState
} from '@/components/workout'
import {
  useNavigationStore,
  useWorkoutSessionStore,
  useCooldownFlowStore
} from '@/stores'
import {
  useElapsedTime,
  useKeepAlive,
  useVoiceCommands,
  useExitConfirmation
} from '@/hooks'
import { useSettingsStore } from '@/stores'
import { cooldownStretches } from '@/data/cooldown'
import { normalizeCooldownStretch, getSideLabel } from '@/utils'
import { motion } from 'framer-motion'

export function CooldownScreen() {
  useKeepAlive(true)
  const navigate = useNavigationStore((state) => state.navigate)
  const { endWorkout, startTime, completeCooldown: setCooldownCompleted } = useWorkoutSessionStore()
  const holdCountdown = useSettingsStore((state) => state.holdCountdown)

  // Flow state from Zustand store
  const {
    stretchIndex,
    currentSide,
    currentReps,
    setStartTime,
    timedHoldPhase,
    setCurrentSide,
    setCurrentReps,
    incrementReps,
    setTimedHoldPhase,
    advanceToNextStretch,
    resetFlow
  } = useCooldownFlowStore()

  // Exit confirmation
  const { openDialog: handleExit, dialogProps } = useExitConfirmation(() => navigate('home'))

  // Timers
  const sessionElapsed = useElapsedTime(startTime)
  const setElapsed = useElapsedTime(setStartTime)

  // Normalized data
  const normalizedStretches = useMemo(
    () => cooldownStretches.map(normalizeCooldownStretch),
    []
  )

  const currentStretch = normalizedStretches[stretchIndex]

  // Progress calculation
  const totalSteps = useMemo(() => {
    return normalizedStretches.reduce((total, stretch) => {
      return total + (stretch.sideHandling !== 'none' ? 2 : 1)
    }, 0)
  }, [normalizedStretches])

  const completedSteps = useMemo(() => {
    let completed = 0
    for (let i = 0; i < stretchIndex; i++) {
      completed += normalizedStretches[i].sideHandling !== 'none' ? 2 : 1
    }
    if (currentStretch?.sideHandling !== 'none' && currentSide === 'second') {
      completed += 1
    }
    return completed
  }, [normalizedStretches, stretchIndex, currentSide, currentStretch?.sideHandling])

  // Reset side when stretch changes
  useEffect(() => {
    if (currentStretch?.sideHandling !== 'none') {
      setCurrentSide('first')
    } else {
      setCurrentSide(null)
    }
    setCurrentReps(0)
  }, [stretchIndex, currentStretch?.sideHandling, setCurrentSide, setCurrentReps])

  // Reset flow when component mounts
  useEffect(() => {
    resetFlow()
  }, [resetFlow])

  const completeCooldown = useCallback(() => {
    setCooldownCompleted()
    endWorkout()
    navigate('session-summary')
  }, [setCooldownCompleted, endWorkout, navigate])

  const handleStretchComplete = useCallback(() => {
    if (currentStretch?.sideHandling === 'per-side' && currentSide === 'first') {
      setCurrentSide('second')
      setCurrentReps(0)
      return
    }

    const hasNext = advanceToNextStretch(normalizedStretches.length)

    if (!hasNext) {
      completeCooldown()
    }
  }, [
    currentStretch?.sideHandling,
    currentSide,
    setCurrentSide,
    setCurrentReps,
    advanceToNextStretch,
    normalizedStretches.length,
    completeCooldown
  ])

  const handleSkipStretch = useCallback(() => {
    const hasNext = advanceToNextStretch(normalizedStretches.length)

    if (!hasNext) {
      completeCooldown()
    }
  }, [advanceToNextStretch, normalizedStretches.length, completeCooldown])

  // Voice command handlers
  const handleVoiceNumber = useCallback((n: number) => {
    setCurrentReps(n)
  }, [setCurrentReps])

  const [holdTriggerStart, setHoldTriggerStart] = useState(false)
  const handleVoiceReady = useCallback(() => {
    setHoldTriggerStart(true)
    setTimeout(() => setHoldTriggerStart(false), 100)
  }, [])

  // Unified tap handler for the overlay
  const handleTap = useCallback(() => {
    if (currentStretch?.mode === 'reps') {
      incrementReps()
    } else if (currentStretch?.mode === 'timed' && timedHoldPhase === 'ready') {
      // Trigger timed hold start
      setHoldTriggerStart(true)
      setTimeout(() => setHoldTriggerStart(false), 100)
    }
    // For timed mode in countdown/active/complete phases, tap does nothing
  }, [currentStretch?.mode, timedHoldPhase, incrementReps])

  // Determine if tap should be enabled
  const isTapEnabled = currentStretch?.mode === 'reps' ||
    (currentStretch?.mode === 'timed' && timedHoldPhase === 'ready')

  // Voice commands for guided movements
  useVoiceCommands({
    context: 'guidedMovement',
    handlers: {
      onNumber: currentStretch?.mode === 'reps' ? handleVoiceNumber : undefined,
      onDone: handleStretchComplete,
      onSkip: handleSkipStretch,
      onReady: currentStretch?.mode === 'timed' ? handleVoiceReady : undefined
    },
    enabled: true
  })

  // Loading state
  if (!currentStretch) {
    return <LoadingState message="Loading cool-down..." />
  }

  // Build tabs for MetadataTabs
  const tabs = [
    currentStretch.instructions ? {
      id: 'instructions',
      label: 'Instructions',
      content: (
        <p className="text-body-sm text-ink-700 dark:text-cream-300">
          {currentStretch.instructions}
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

  const sideLabel = currentSide ? getSideLabel(currentStretch.sideHandling, currentSide) : undefined

  return (
    <TapToSkipOverlay onSkip={handleSkipStretch} onTap={isTapEnabled ? handleTap : undefined}>
      <motion.div
        className="flex-1 flex flex-col min-h-0 relative bg-cream-100 dark:bg-ink-950 bg-grain"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        <div aria-live="polite" aria-atomic="true" className="sr-only">
          {currentStretch.name}. Cooldown.
        </div>

        {/* Exit button - top left */}
        <motion.div
          className="absolute top-4 left-4 z-10"
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Button variant="ghost" size="sm" onClick={handleExit} withAccent>
            Exit
          </Button>
        </motion.div>

        {/* Session timer - top right */}
        <div className="absolute top-4 right-4 z-10">
          <span className="text-body-sm text-ink-600 dark:text-cream-400">
            <Timer seconds={sessionElapsed} size="sm" animate={false} />
          </span>
        </div>

        {/* Main content */}
        <div className="flex-1 flex flex-col min-h-0 overflow-y-auto">
          {/* Exercise header */}
          <ExerciseHeader
            contextLabel="COOLDOWN"
            exerciseName={currentStretch.name}
            sideLabel={sideLabel ?? undefined}
          />

          {/* Interaction area */}
          <InteractionArea>
            {currentStretch.mode === 'reps' ? (
              <RepCounter
                currentReps={currentReps}
                targetRepsMin={currentStretch.reps}
                targetRepsMax={currentStretch.reps}
              />
            ) : (
              <TimedHold
                targetSeconds={currentStretch.durationSeconds ?? 30}
                countdownDuration={holdCountdown}
                onComplete={handleStretchComplete}
                onPhaseChange={setTimedHoldPhase}
                externalTriggerStart={holdTriggerStart}
              />
            )}
          </InteractionArea>

          {/* Metadata tabs */}
          <MetadataTabs tabs={tabs} defaultTab={tabs[0]?.id} />
        </div>

        {/* Bottom bar */}
        <BottomBar
          progress={{
            current: completedSteps + 1,
            total: totalSteps
          }}
          contextInfo="Static Stretches"
          actionButton={
            currentStretch.mode === 'reps'
              ? { label: 'DONE', onClick: handleStretchComplete }
              : undefined
          }
        />

        <ConfirmDialog {...dialogProps} />
      </motion.div>
    </TapToSkipOverlay>
  )
}
