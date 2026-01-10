import { useState, useEffect, useMemo, useCallback } from 'react'
import { Button, ConfirmDialog } from '@/components/base'
import { Timer } from '@/components/base/Timer'
import { RepCounter, TimedHold, TapToSkipOverlay } from '@/components/interactions'
import { VoiceSetupModal } from '@/components/voice'
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
  useVoiceStore,
  useWarmupFlowStore
} from '@/stores'
import {
  useElapsedTime,
  useKeepAlive,
  useVoiceCommands,
  useExitConfirmation
} from '@/hooks'
import { useSettingsStore } from '@/stores'
import { warmupPhases } from '@/data/warmup'
import { normalizeWarmupPhases, getTotalMovementSteps, getCompletedSteps, getSideLabel } from '@/utils'
import { motion } from 'framer-motion'

export function WarmupScreen() {
  useKeepAlive(true)
  const navigate = useNavigationStore((state) => state.navigate)
  const { setPhase, startTime, completeWarmup: setWarmupCompleted } = useWorkoutSessionStore()
  const holdCountdown = useSettingsStore((state) => state.holdCountdown)

  // Flow state from Zustand store
  const {
    phaseIndex,
    movementIndex,
    currentDirection,
    currentReps,
    setStartTime,
    timedHoldPhase,
    setCurrentDirection,
    setCurrentReps,
    incrementReps,
    setTimedHoldPhase,
    advanceToNextMovement,
    resetFlow
  } = useWarmupFlowStore()

  // Voice control state
  const { showSetupModal, isSupported: voiceSupported, setShowSetupModal } = useVoiceStore()

  // Exit confirmation
  const { openDialog: handleExit, dialogProps } = useExitConfirmation(() => navigate('home'))

  // Timers
  const sessionElapsed = useElapsedTime(startTime)
  const setElapsed = useElapsedTime(setStartTime)

  // Normalized data
  const normalizedPhases = useMemo(() => normalizeWarmupPhases(warmupPhases), [])

  const currentPhase = normalizedPhases[phaseIndex]
  const currentMovement = currentPhase?.items[movementIndex]

  // Progress calculation
  const totalSteps = useMemo(() => getTotalMovementSteps(normalizedPhases), [normalizedPhases])
  const completedSteps = useMemo(
    () => getCompletedSteps(normalizedPhases, phaseIndex, movementIndex, currentDirection),
    [normalizedPhases, phaseIndex, movementIndex, currentDirection]
  )

  // Reset direction when movement changes
  useEffect(() => {
    if (currentMovement?.sideHandling !== 'none') {
      setCurrentDirection('first')
    } else {
      setCurrentDirection(null)
    }
    setCurrentReps(0)
  }, [phaseIndex, movementIndex, currentMovement?.sideHandling, setCurrentDirection, setCurrentReps])

  // Reset flow when component mounts
  useEffect(() => {
    resetFlow()
  }, [resetFlow])

  const handleMovementComplete = useCallback(() => {
    if (currentMovement?.sideHandling === 'per-direction' && currentDirection === 'first') {
      setCurrentDirection('second')
      setCurrentReps(0)
      return
    }

    const hasNext = advanceToNextMovement(
      currentPhase?.items.length ?? 0,
      normalizedPhases.length
    )

    if (!hasNext) {
      // Warmup complete
      setWarmupCompleted()
      setPhase('strength')
      navigate('active-workout')
    }
  }, [
    currentMovement?.sideHandling,
    currentDirection,
    setCurrentDirection,
    setCurrentReps,
    advanceToNextMovement,
    currentPhase?.items.length,
    normalizedPhases.length,
    setWarmupCompleted,
    setPhase,
    navigate
  ])

  const handleSkipMovement = useCallback(() => {
    const hasNext = advanceToNextMovement(
      currentPhase?.items.length ?? 0,
      normalizedPhases.length
    )

    if (!hasNext) {
      setWarmupCompleted()
      setPhase('strength')
      navigate('active-workout')
    }
  }, [advanceToNextMovement, currentPhase?.items.length, normalizedPhases.length, setWarmupCompleted, setPhase, navigate])

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
    if (currentMovement?.mode === 'reps') {
      incrementReps()
    } else if (currentMovement?.mode === 'timed' && timedHoldPhase === 'ready') {
      // Trigger timed hold start
      setHoldTriggerStart(true)
      setTimeout(() => setHoldTriggerStart(false), 100)
    }
    // For timed mode in countdown/active/complete phases, tap does nothing
  }, [currentMovement?.mode, timedHoldPhase, incrementReps])

  // Determine if tap should be enabled
  const isTapEnabled = currentMovement?.mode === 'reps' ||
    (currentMovement?.mode === 'timed' && timedHoldPhase === 'ready')

  // Voice commands for guided movements
  useVoiceCommands({
    context: 'guidedMovement',
    handlers: {
      onNumber: currentMovement?.mode === 'reps' ? handleVoiceNumber : undefined,
      onDone: handleMovementComplete,
      onSkip: handleSkipMovement,
      onReady: currentMovement?.mode === 'timed' ? handleVoiceReady : undefined
    },
    enabled: true
  })

  // Loading state
  if (!currentMovement || !currentPhase) {
    return <LoadingState message="Loading warm-up..." />
  }

  // Build tabs for MetadataTabs
  const tabs = [
    currentMovement.instructions ? {
      id: 'instructions',
      label: 'Instructions',
      content: (
        <p className="text-body-sm text-ink-700 dark:text-cream-300">
          {currentMovement.instructions}
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

  const sideLabel = currentDirection ? getSideLabel(currentMovement.sideHandling, currentDirection) : undefined

  return (
    <TapToSkipOverlay onSkip={handleSkipMovement} onTap={isTapEnabled ? handleTap : undefined}>
      <motion.div
        className="flex-1 flex flex-col min-h-0 relative bg-cream-100 dark:bg-ink-950 bg-grain"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        <div aria-live="polite" aria-atomic="true" className="sr-only">
          {currentMovement.name}. {currentPhase.name}.
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
            contextLabel={`WARMUP - ${currentPhase.name.toUpperCase()}`}
            exerciseName={currentMovement.name}
            sideLabel={sideLabel ?? undefined}
          />

          {/* Interaction area */}
          <InteractionArea>
            {currentMovement.mode === 'reps' ? (
              <RepCounter
                currentReps={currentReps}
                targetRepsMin={currentMovement.reps}
                targetRepsMax={currentMovement.reps}
              />
            ) : (
              <TimedHold
                targetSeconds={currentMovement.durationSeconds ?? 30}
                countdownDuration={holdCountdown}
                onComplete={handleMovementComplete}
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
          contextInfo={currentPhase.name}
          actionButton={
            currentMovement.mode === 'reps'
              ? { label: 'DONE', onClick: handleMovementComplete }
              : undefined
          }
        />

        <ConfirmDialog {...dialogProps} />

        <VoiceSetupModal
          isOpen={showSetupModal && voiceSupported}
          onContinue={() => setShowSetupModal(false)}
        />
      </motion.div>
    </TapToSkipOverlay>
  )
}
