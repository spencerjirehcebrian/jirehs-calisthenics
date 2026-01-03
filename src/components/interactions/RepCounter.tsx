import { useKeyboardInteraction } from '@/hooks'

interface RepCounterProps {
  currentReps: number
  targetRepsMin?: number
  targetRepsMax?: number
  isMaxReps?: boolean
  onIncrement: () => void
  className?: string
}

export function RepCounter({
  currentReps,
  targetRepsMin,
  targetRepsMax,
  isMaxReps = false,
  onIncrement,
  className = ''
}: RepCounterProps) {
  const keyboardProps = useKeyboardInteraction({
    onActivate: onIncrement
  })

  const getTargetDisplay = () => {
    if (isMaxReps) {
      return 'Max reps'
    }
    if (targetRepsMin && targetRepsMax) {
      if (targetRepsMin === targetRepsMax) {
        return `${targetRepsMin} reps`
      }
      return `${targetRepsMin}-${targetRepsMax} reps`
    }
    if (targetRepsMin) {
      return `${targetRepsMin}+ reps`
    }
    return ''
  }

  const targetDisplay = getTargetDisplay()

  return (
    <div
      onClick={onIncrement}
      {...keyboardProps}
      className={`
        flex-1 flex flex-col items-center justify-center
        cursor-pointer select-none
        active:bg-neutral-100 dark:active:bg-neutral-800
        transition-colors duration-75
        min-h-interaction
        focus-interactive
        ${className}
      `}
      aria-label={`Current reps: ${currentReps}. Tap or press Enter to add one rep.`}
    >
      {/* Current rep count - largest, responsive */}
      <div
        className="font-bold font-mono tabular-nums text-neutral-900 dark:text-neutral-100"
        style={{ fontSize: 'var(--font-size-display)' }}
      >
        {currentReps}
      </div>

      {/* Target display */}
      {targetDisplay && (
        <p className="text-neutral-500 mt-2">
          Target: {targetDisplay}
        </p>
      )}

      {/* Tap instruction */}
      <p className="text-sm text-neutral-400 mt-4">
        Tap to count
      </p>
    </div>
  )
}
