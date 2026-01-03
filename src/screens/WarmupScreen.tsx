import { useState, useEffect, useMemo } from 'react'
import { Button } from '@/components/base/Button'
import { Timer } from '@/components/base/Timer'
import { GuidedMovementStep } from '@/components/interactions'
import { useNavigationStore, useWorkoutSessionStore } from '@/stores'
import { useElapsedTime, useKeepAlive } from '@/hooks'
import { warmupPhases } from '@/data/warmup'
import { normalizeWarmupPhases, getTotalMovementSteps, getCompletedSteps } from '@/utils'

export function WarmupScreen() {
  // Keep audio context alive during workout to prevent PWA suspension
  useKeepAlive(true)
  const navigate = useNavigationStore((state) => state.navigate)
  const { setPhase, startTime, completeWarmup: setWarmupCompleted, skipWarmup } = useWorkoutSessionStore()

  // Local state for tracking progress through warm-up
  const [phaseIndex, setPhaseIndex] = useState(0)
  const [movementIndex, setMovementIndex] = useState(0)
  const [currentDirection, setCurrentDirection] = useState<'first' | 'second' | null>(null)
  const [currentReps, setCurrentReps] = useState(0)

  // Session elapsed time
  const sessionElapsed = useElapsedTime(startTime)

  // Normalize phases for consistent handling
  const normalizedPhases = useMemo(() => normalizeWarmupPhases(warmupPhases), [])

  // Get current phase and movement
  const currentPhase = normalizedPhases[phaseIndex]
  const currentMovement = currentPhase?.items[movementIndex]

  // Calculate total and completed steps for progress display
  const totalSteps = useMemo(() => getTotalMovementSteps(normalizedPhases), [normalizedPhases])
  const completedSteps = useMemo(
    () => getCompletedSteps(normalizedPhases, phaseIndex, movementIndex, currentDirection),
    [normalizedPhases, phaseIndex, movementIndex, currentDirection]
  )

  // Initialize direction state when movement changes
  useEffect(() => {
    if (currentMovement?.sideHandling !== 'none') {
      setCurrentDirection('first')
    } else {
      setCurrentDirection(null)
    }
    setCurrentReps(0)
  }, [phaseIndex, movementIndex, currentMovement?.sideHandling])

  const handleMovementComplete = () => {
    // If this is a per-direction movement and we just did 'first', switch to 'second'
    if (currentMovement?.sideHandling === 'per-direction' && currentDirection === 'first') {
      setCurrentDirection('second')
      setCurrentReps(0)
      return
    }

    // Move to next movement
    advanceToNextMovement()
  }

  const advanceToNextMovement = () => {
    const nextMovementIndex = movementIndex + 1

    // Check if there are more movements in current phase
    if (currentPhase && nextMovementIndex < currentPhase.items.length) {
      setMovementIndex(nextMovementIndex)
    } else {
      // Move to next phase
      const nextPhaseIndex = phaseIndex + 1
      if (nextPhaseIndex < normalizedPhases.length) {
        setPhaseIndex(nextPhaseIndex)
        setMovementIndex(0)
      } else {
        // Warm-up complete, transition to workout
        completeWarmup()
      }
    }
  }

  const handleSkipMovement = () => {
    // Skip bypasses any remaining sides - goes straight to next movement
    advanceToNextMovement()
  }

  const handleSkipEntireWarmup = () => {
    skipWarmup()
    setPhase('strength')
    navigate('active-workout')
  }

  const completeWarmup = () => {
    setWarmupCompleted()
    setPhase('strength')
    navigate('active-workout')
  }

  // Guard for no current movement (shouldn't happen in normal flow)
  if (!currentMovement || !currentPhase) {
    return (
      <div className="flex-1 flex items-center justify-center p-6">
        <p>Loading warm-up...</p>
      </div>
    )
  }

  return (
    <div className="flex-1 flex flex-col relative">
      {/* Session timer - top right */}
      <div className="absolute top-4 right-4 z-10">
        <span className="text-sm text-neutral-500">
          <Timer seconds={sessionElapsed} size="sm" />
        </span>
      </div>

      {/* Skip entire warm-up button - top left */}
      <div className="absolute top-4 left-4 z-10">
        <Button variant="ghost" size="sm" onClick={handleSkipEntireWarmup}>
          Skip Warm-up
        </Button>
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
      />
    </div>
  )
}
