import { useEffect, useRef } from 'react'
import { Timer } from '@/components/base/Timer'
import { HoldToSkip } from './HoldToSkip'
import { useTimer, useAudioCue, useKeyboardInteraction } from '@/hooks'

interface RestTimerProps {
  initialSeconds?: number // default 90
  onComplete: () => void
  nextExerciseName?: string
  className?: string
}

export function RestTimer({
  initialSeconds = 90,
  onComplete,
  nextExerciseName,
  className = ''
}: RestTimerProps) {
  const { playRestWarning, playRestComplete } = useAudioCue()
  const hasPlayedWarning = useRef(false)
  const hasPlayedComplete = useRef(false)

  const timer = useTimer({
    initialSeconds,
    direction: 'down',
    autoStart: true,
    onTick: (seconds) => {
      // Play warning at 10 seconds remaining
      if (seconds === 10 && !hasPlayedWarning.current) {
        hasPlayedWarning.current = true
        playRestWarning()
      }
    },
    onComplete: () => {
      // Play completion sound
      if (!hasPlayedComplete.current) {
        hasPlayedComplete.current = true
        playRestComplete()
      }
      // Timer continues into negative, user must tap to proceed
    }
  })

  // Reset audio flags when initialSeconds changes (new rest period)
  useEffect(() => {
    hasPlayedWarning.current = false
    hasPlayedComplete.current = false
  }, [initialSeconds])

  const handleComplete = () => {
    timer.pause()
    onComplete()
  }

  const keyboardProps = useKeyboardInteraction({
    onActivate: handleComplete
  })

  return (
    <div
      onClick={handleComplete}
      {...keyboardProps}
      className={`
        flex-1 flex flex-col items-center justify-center
        cursor-pointer select-none
        relative
        min-h-interaction
        focus-interactive
        ${className}
      `}
      aria-label="Tap or press Enter to continue to next exercise"
      aria-live="polite"
    >
      {/* Rest label */}
      <p className="text-2xl font-semibold text-neutral-500 mb-4">
        Rest
      </p>

      {/* Timer display */}
      <Timer seconds={timer.seconds} size="xl" />

      {/* Over-resting message - accessible warning state */}
      {timer.seconds < 0 && (
        <p className="warning-state mt-2" role="alert">
          Over-resting
        </p>
      )}

      {/* Next exercise preview */}
      {nextExerciseName && (
        <p className="text-neutral-500 mt-6">
          Next: {nextExerciseName}
        </p>
      )}

      {/* Tap instruction */}
      <p className="text-sm text-neutral-400 mt-4">
        Tap anywhere to continue
      </p>

      {/* Hold to skip */}
      <HoldToSkip
        onSkip={handleComplete}
        position="bottom-right"
      />
    </div>
  )
}
