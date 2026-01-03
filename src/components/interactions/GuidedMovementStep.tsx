import { Button } from '@/components/base/Button'
import { RepCounter } from './RepCounter'
import { TimedHold } from './TimedHold'
import { HoldToSkip } from './HoldToSkip'
import { useSettingsStore } from '@/stores'
import { useAudioCue } from '@/hooks'
import { getSideLabel } from '@/utils'
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

  return (
    <div className="flex-1 flex flex-col relative">
      {/* Main content area */}
      <div className="flex-1 flex flex-col overflow-y-auto">
        {/* Header: Phase name (if warm-up), movement name, side label */}
        <div className="p-4 pt-12 text-center">
          {phaseName && (
            <p className="text-sm text-accent-600 font-medium mb-1">
              {phaseName}
            </p>
          )}
          <h1 className="text-3xl font-bold">
            {item.name}
          </h1>
          {sideLabel && (
            <p className="text-xl text-accent-600 font-medium mt-2">
              {sideLabel}
            </p>
          )}
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
          <div className="px-4 pb-4">
            <div className="p-4 rounded-lg bg-neutral-100 dark:bg-neutral-800">
              <p className="text-sm text-neutral-600 dark:text-neutral-400">
                {item.instructions}
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Hold to skip - always available */}
      <HoldToSkip
        onSkip={onSkip}
        position="bottom-right"
      />

      {/* Progress and action button - bottom */}
      <div className="p-4 border-t border-neutral-200 dark:border-neutral-800">
        <div className="text-center text-neutral-500 mb-4">
          {progress.current} of {progress.total}
        </div>

        {/* Done button for rep-based movements only */}
        {item.mode === 'reps' && (
          <Button fullWidth onClick={handleRepComplete}>
            Done
          </Button>
        )}
      </div>
    </div>
  )
}
