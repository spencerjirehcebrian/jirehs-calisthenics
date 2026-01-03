import { useState, useEffect, useMemo } from 'react'
import { Button } from '@/components/base/Button'
import { Timer } from '@/components/base/Timer'
import { GuidedMovementStep } from '@/components/interactions'
import { useNavigationStore, useWorkoutSessionStore } from '@/stores'
import { useElapsedTime, useKeepAlive } from '@/hooks'
import { cooldownStretches } from '@/data/cooldown'
import { normalizeCooldownStretch } from '@/utils'

export function CooldownScreen() {
  // Keep audio context alive during workout to prevent PWA suspension
  useKeepAlive(true)
  const navigate = useNavigationStore((state) => state.navigate)
  const { endWorkout, startTime, completeCooldown: setCooldownCompleted, skipCooldown } = useWorkoutSessionStore()

  // Local state for tracking progress through cool-down
  const [stretchIndex, setStretchIndex] = useState(0)
  const [currentSide, setCurrentSide] = useState<'first' | 'second' | null>(null)
  const [currentReps, setCurrentReps] = useState(0)

  // Session elapsed time
  const sessionElapsed = useElapsedTime(startTime)

  // Normalize stretches for consistent handling
  const normalizedStretches = useMemo(
    () => cooldownStretches.map(normalizeCooldownStretch),
    []
  )

  // Get current stretch
  const currentStretch = normalizedStretches[stretchIndex]

  // Calculate total steps (accounting for per-side stretches)
  const totalSteps = useMemo(() => {
    return normalizedStretches.reduce((total, stretch) => {
      return total + (stretch.sideHandling !== 'none' ? 2 : 1)
    }, 0)
  }, [normalizedStretches])

  // Calculate completed steps
  const completedSteps = useMemo(() => {
    let completed = 0
    for (let i = 0; i < stretchIndex; i++) {
      completed += normalizedStretches[i].sideHandling !== 'none' ? 2 : 1
    }
    // If on second side of current stretch, add 1
    if (currentStretch?.sideHandling !== 'none' && currentSide === 'second') {
      completed += 1
    }
    return completed
  }, [normalizedStretches, stretchIndex, currentSide, currentStretch?.sideHandling])

  // Initialize side state when stretch changes
  useEffect(() => {
    if (currentStretch?.sideHandling !== 'none') {
      setCurrentSide('first')
    } else {
      setCurrentSide(null)
    }
    setCurrentReps(0)
  }, [stretchIndex, currentStretch?.sideHandling])

  const handleStretchComplete = () => {
    // If this is a per-side stretch and we just did 'first', switch to 'second'
    if (currentStretch?.sideHandling === 'per-side' && currentSide === 'first') {
      setCurrentSide('second')
      setCurrentReps(0)
      return
    }

    // Move to next stretch
    advanceToNextStretch()
  }

  const advanceToNextStretch = () => {
    const nextIndex = stretchIndex + 1

    if (nextIndex < normalizedStretches.length) {
      setStretchIndex(nextIndex)
    } else {
      // Cool-down complete, go to summary
      completeCooldown()
    }
  }

  const handleSkipStretch = () => {
    // Skip bypasses any remaining sides - goes straight to next stretch
    advanceToNextStretch()
  }

  const handleSkipEntireCooldown = () => {
    skipCooldown()
    endWorkout()
    navigate('session-summary')
  }

  const completeCooldown = () => {
    setCooldownCompleted()
    endWorkout()
    navigate('session-summary')
  }

  // Guard for no current stretch (shouldn't happen in normal flow)
  if (!currentStretch) {
    return (
      <div className="flex-1 flex items-center justify-center p-6">
        <p>Loading cool-down...</p>
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

      {/* Skip entire cool-down button - top left */}
      <div className="absolute top-4 left-4 z-10">
        <Button variant="ghost" size="sm" onClick={handleSkipEntireCooldown}>
          Skip Cool-down
        </Button>
      </div>

      {/* Main content */}
      <GuidedMovementStep
        item={currentStretch}
        currentSide={currentSide}
        currentReps={currentReps}
        onRepIncrement={() => setCurrentReps(r => r + 1)}
        onComplete={handleStretchComplete}
        onSkip={handleSkipStretch}
        progress={{
          current: completedSteps + 1,
          total: totalSteps
        }}
      />
    </div>
  )
}
