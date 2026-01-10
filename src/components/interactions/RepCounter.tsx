import { ProgressBar } from '@/components/base/ProgressBar'
import { motion } from 'framer-motion'

interface RepCounterProps {
  currentReps: number
  targetRepsMin?: number
  targetRepsMax?: number
  isMaxReps?: boolean
  className?: string
}

export function RepCounter({
  currentReps,
  targetRepsMin,
  targetRepsMax,
  isMaxReps = false,
  className = ''
}: RepCounterProps) {
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

  const getProgress = () => {
    if (isMaxReps || !targetRepsMax) return 0
    return Math.min(currentReps / targetRepsMax, 1)
  }

  const targetDisplay = getTargetDisplay()
  const progress = getProgress()

  return (
    <div
      className={`
        flex-1 flex flex-col items-center justify-center
        select-none
        min-h-interaction relative
        ${className}
      `}
      aria-label={`Current reps: ${currentReps}`}
      aria-live="polite"
    >
      {/* Display container for rep number - flat styling, no shadow */}
      <div className="w-48 h-48 rounded-[2rem] bg-cream-50 dark:bg-ink-800 border-2 border-cream-200 dark:border-ink-700 flex items-center justify-center mb-6">
        <motion.span
          key={currentReps}
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: 'spring', stiffness: 500, damping: 25 }}
          className="font-display font-extrabold text-display-xl text-ink-900 dark:text-cream-100 tabular-nums"
        >
          {currentReps}
        </motion.span>
      </div>

      {/* Target display */}
      {targetDisplay && (
        <p className="text-ink-600 dark:text-cream-400 text-body-md mb-4">
          Target: {targetDisplay}
        </p>
      )}

      {/* Progress bar - only show if we have a target */}
      {!isMaxReps && targetRepsMax && (
        <div className="w-48">
          <ProgressBar
            progress={progress}
            variant={progress >= 1 ? 'success' : 'default'}
          />
          <p className="text-center text-body-xs text-ink-500 dark:text-cream-400 mt-2">
            {currentReps}/{targetRepsMax}
          </p>
        </div>
      )}

      {/* Tap instruction - updated to reflect tap-anywhere */}
      <p className="text-body-sm text-ink-500 dark:text-cream-400 mt-6 animate-pulse-slow">
        Tap anywhere to count
      </p>
    </div>
  )
}
