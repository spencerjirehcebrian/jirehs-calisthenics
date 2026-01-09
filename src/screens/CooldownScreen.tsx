import { useState, useEffect, useMemo } from 'react'
import { Button, ConfirmDialog } from '@/components/base'
import { Timer } from '@/components/base/Timer'
import { GuidedMovementStep } from '@/components/interactions'
import { useNavigationStore, useWorkoutSessionStore } from '@/stores'
import { useElapsedTime, useKeepAlive } from '@/hooks'
import { cooldownStretches } from '@/data/cooldown'
import { normalizeCooldownStretch } from '@/utils'
import { motion } from 'framer-motion'

export function CooldownScreen() {
  useKeepAlive(true)
  const navigate = useNavigationStore((state) => state.navigate)
  const { endWorkout, startTime, completeCooldown: setCooldownCompleted } = useWorkoutSessionStore()

  const [stretchIndex, setStretchIndex] = useState(0)
  const [currentSide, setCurrentSide] = useState<'first' | 'second' | null>(null)
  const [currentReps, setCurrentReps] = useState(0)
  const [showExitDialog, setShowExitDialog] = useState(false)

  const sessionElapsed = useElapsedTime(startTime)

  const normalizedStretches = useMemo(
    () => cooldownStretches.map(normalizeCooldownStretch),
    []
  )

  const currentStretch = normalizedStretches[stretchIndex]

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

  useEffect(() => {
    if (currentStretch?.sideHandling !== 'none') {
      setCurrentSide('first')
    } else {
      setCurrentSide(null)
    }
    setCurrentReps(0)
  }, [stretchIndex, currentStretch?.sideHandling])

  const handleStretchComplete = () => {
    if (currentStretch?.sideHandling === 'per-side' && currentSide === 'first') {
      setCurrentSide('second')
      setCurrentReps(0)
      return
    }
    advanceToNextStretch()
  }

  const advanceToNextStretch = () => {
    const nextIndex = stretchIndex + 1

    if (nextIndex < normalizedStretches.length) {
      setStretchIndex(nextIndex)
    } else {
      completeCooldown()
    }
  }

  const handleSkipStretch = () => {
    advanceToNextStretch()
  }

  const handleExit = () => {
    setShowExitDialog(true)
  }

  const confirmExit = () => {
    navigate('home')
  }

  const completeCooldown = () => {
    setCooldownCompleted()
    endWorkout()
    navigate('session-summary')
  }

  if (!currentStretch) {
    return (
      <div className="flex-1 flex items-center justify-center p-6 bg-cream-100 dark:bg-ink-950">
        <p className="text-ink-600 dark:text-cream-400">Loading cool-down...</p>
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
