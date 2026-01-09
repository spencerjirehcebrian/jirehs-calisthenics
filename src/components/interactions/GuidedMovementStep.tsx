import { Button } from '@/components/base/Button'
import { ProgressBar } from '@/components/base/ProgressBar'
import { ActionBar } from '@/components/layout/ActionBar'
import { RepCounter } from './RepCounter'
import { TimedHold } from './TimedHold'
import { TapToSkipOverlay } from './TapToSkipOverlay'
import { useSettingsStore } from '@/stores'
import { useAudioCue } from '@/hooks'
import { getSideLabel } from '@/utils'
import { motion } from 'framer-motion'
import type { GuidedMovementItem } from '@/types/guided-flow'

interface GuidedMovementStepProps {
  item: GuidedMovementItem
  currentSide: 'first' | 'second' | null
  currentReps: number
  onRepIncrement: () => void
  onComplete: () => void
  onSkip: () => void
  phaseName?: string
  progress: {
    current: number
    total: number
  }
}

export function GuidedMovementStep({
  item,
  currentSide,
  currentReps,
  onRepIncrement,
  onComplete,
  onSkip,
  phaseName,
  progress
}: GuidedMovementStepProps) {
  const holdCountdown = useSettingsStore((state) => state.holdCountdown)
  const { playSetComplete } = useAudioCue()

  const handleRepComplete = () => {
    playSetComplete()
    onComplete()
  }

  const sideLabel = currentSide ? getSideLabel(item.sideHandling, currentSide) : null
  const progressPercent = progress.current / progress.total

  return (
    <TapToSkipOverlay onSkip={onSkip}>
      <motion.div
        className="flex-1 flex flex-col min-h-0 relative bg-cream-100 dark:bg-ink-950 bg-grain"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        {/* Main content area */}
        <div className="flex-1 flex flex-col min-h-0 overflow-y-auto">
        {/* Header: Phase name, movement name, side label */}
        <div className="p-4 pt-12">
          {phaseName && (
            <motion.p
              className="text-body-sm text-earth-600 dark:text-earth-400 font-medium mb-1 uppercase tracking-wider"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
            >
              {phaseName}
            </motion.p>
          )}
          <motion.h1
            className="font-display font-semibold text-display-md text-ink-900 dark:text-cream-100"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
          >
            {item.name.toUpperCase()}
          </motion.h1>
          {sideLabel && (
            <motion.p
              className="text-body-lg text-earth-600 dark:text-earth-400 font-medium mt-2"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.15 }}
            >
              {sideLabel}
            </motion.p>
          )}
          <motion.div
            className="mt-3 h-1 w-12 bg-earth-500 dark:bg-earth-400"
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 0.3, delay: 0.2 }}
            style={{ transformOrigin: 'left' }}
          />
        </div>

        {/* Interaction area based on movement mode */}
        {item.mode === 'reps' ? (
          <RepCounter
            currentReps={currentReps}
            targetRepsMin={item.reps}
            targetRepsMax={item.reps}
            onIncrement={onRepIncrement}
          />
        ) : (
          <TimedHold
            targetSeconds={item.durationSeconds ?? 30}
            countdownDuration={holdCountdown}
            onComplete={onComplete}
          />
        )}

        {/* Instructions (if exists) */}
        {item.instructions && (
          <motion.div
            className="px-4 pb-4"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <div className="p-4 rounded-xl bg-cream-50 dark:bg-ink-800 border border-cream-300/60 dark:border-ink-700">
              <p className="text-body-sm text-ink-700 dark:text-cream-300">
                {item.instructions}
              </p>
            </div>
          </motion.div>
        )}
      </div>

      {/* Progress and action button - bottom */}
      <div className="p-4 border-t border-cream-300/60 dark:border-ink-700 bg-cream-50/80 dark:bg-ink-900/80 backdrop-blur-sm">
        {/* Progress bar */}
        <div className="mb-4">
          <ProgressBar progress={progressPercent} />
          <p className="text-center text-body-sm text-ink-600 dark:text-cream-400 mt-2">
            {progress.current} of {progress.total}
          </p>
        </div>

        {/* Done button for rep-based movements only */}
        {item.mode === 'reps' && (
          <ActionBar>
            <Button fullWidth onClick={handleRepComplete}>
              DONE
            </Button>
          </ActionBar>
        )}
      </div>
      </motion.div>
    </TapToSkipOverlay>
  )
}
