import { useState, useEffect, useMemo, useCallback } from 'react'
import { Button, ConfirmDialog } from '@/components/base'
import { Timer } from '@/components/base/Timer'
import { GuidedMovementStep } from '@/components/interactions'
import { VoiceSetupModal } from '@/components/voice'
import { useNavigationStore, useWorkoutSessionStore, useVoiceStore } from '@/stores'
import { useElapsedTime, useKeepAlive, useVoiceCommands } from '@/hooks'
import { warmupPhases } from '@/data/warmup'
import { normalizeWarmupPhases, getTotalMovementSteps, getCompletedSteps } from '@/utils'
import { motion } from 'framer-motion'

export function WarmupScreen() {
  useKeepAlive(true)
  const navigate = useNavigationStore((state) => state.navigate)
  const { setPhase, startTime, completeWarmup: setWarmupCompleted } = useWorkoutSessionStore()

  const [phaseIndex, setPhaseIndex] = useState(0)
  const [movementIndex, setMovementIndex] = useState(0)
  const [currentDirection, setCurrentDirection] = useState<'first' | 'second' | null>(null)
  const [currentReps, setCurrentReps] = useState(0)
  const [showExitDialog, setShowExitDialog] = useState(false)

  // Voice control state
  const { showSetupModal, isSupported: voiceSupported } = useVoiceStore()
  const [showVoiceSetup, setShowVoiceSetup] = useState(showSetupModal && voiceSupported)
  const [holdTriggerStart, setHoldTriggerStart] = useState(false)

  const sessionElapsed = useElapsedTime(startTime)

  const normalizedPhases = useMemo(() => normalizeWarmupPhases(warmupPhases), [])

  const currentPhase = normalizedPhases[phaseIndex]
  const currentMovement = currentPhase?.items[movementIndex]

  const totalSteps = useMemo(() => getTotalMovementSteps(normalizedPhases), [normalizedPhases])
  const completedSteps = useMemo(
    () => getCompletedSteps(normalizedPhases, phaseIndex, movementIndex, currentDirection),
    [normalizedPhases, phaseIndex, movementIndex, currentDirection]
  )

  // Reset direction and reps when movement changes - intentional "reset on prop change" pattern
  /* eslint-disable react-hooks/set-state-in-effect */
  useEffect(() => {
    if (currentMovement?.sideHandling !== 'none') {
      setCurrentDirection('first')
    } else {
      setCurrentDirection(null)
    }
    setCurrentReps(0)
  }, [phaseIndex, movementIndex, currentMovement?.sideHandling])
  /* eslint-enable react-hooks/set-state-in-effect */

  const handleMovementComplete = () => {
    if (currentMovement?.sideHandling === 'per-direction' && currentDirection === 'first') {
      setCurrentDirection('second')
      setCurrentReps(0)
      return
    }
    advanceToNextMovement()
  }

  const advanceToNextMovement = () => {
    const nextMovementIndex = movementIndex + 1

    if (currentPhase && nextMovementIndex < currentPhase.items.length) {
      setMovementIndex(nextMovementIndex)
    } else {
      const nextPhaseIndex = phaseIndex + 1
      if (nextPhaseIndex < normalizedPhases.length) {
        setPhaseIndex(nextPhaseIndex)
        setMovementIndex(0)
      } else {
        completeWarmup()
      }
    }
  }

  const handleSkipMovement = () => {
    advanceToNextMovement()
  }

  const handleExit = () => {
    setShowExitDialog(true)
  }

  const confirmExit = () => {
    navigate('home')
  }

  const completeWarmup = () => {
    setWarmupCompleted()
    setPhase('strength')
    navigate('active-workout')
  }

  // Voice command handlers
  const handleVoiceNumber = useCallback((n: number) => {
    setCurrentReps(n)
  }, [])

  const handleVoiceReady = useCallback(() => {
    setHoldTriggerStart(true)
    setTimeout(() => setHoldTriggerStart(false), 100)
  }, [])

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

  if (!currentMovement || !currentPhase) {
    return (
      <div className="flex-1 flex items-center justify-center p-6 bg-cream-100 dark:bg-ink-950">
        <p className="text-ink-600 dark:text-cream-400">Loading warm-up...</p>
      </div>
    )
  }

  return (
    <motion.div
      className="flex-1 flex flex-col min-h-0 relative"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      {/* Exit button - top left */}
      <motion.div
        className="absolute top-2 left-2 z-10"
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
      <GuidedMovementStep
        item={currentMovement}
        currentSide={currentDirection}
        currentReps={currentReps}
        onRepIncrement={() => setCurrentReps(r => r + 1)}
        onComplete={handleMovementComplete}
        onSkip={handleSkipMovement}
        phaseName={currentPhase.name}
        progress={{
          current: completedSteps + 1,
          total: totalSteps
        }}
        externalTriggerStart={holdTriggerStart}
      />

      <ConfirmDialog
        isOpen={showExitDialog}
        title="Exit Workout?"
        message="Your progress will not be saved. Are you sure you want to exit?"
        confirmLabel="Exit"
        cancelLabel="Continue"
        onConfirm={confirmExit}
        onCancel={() => setShowExitDialog(false)}
      />

      <VoiceSetupModal
        isOpen={showVoiceSetup}
        onContinue={() => setShowVoiceSetup(false)}
      />
    </motion.div>
  )
}
