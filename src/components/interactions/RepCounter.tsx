import { useKeyboardInteraction } from '@/hooks'
import { ProgressBar } from '@/components/base/ProgressBar'
import { motion } from 'framer-motion'
import { useState, useCallback } from 'react'

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
  const [ripple, setRipple] = useState<{ x: number; y: number } | null>(null)

  const handleTap = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect()
    setRipple({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    })
    setTimeout(() => setRipple(null), 500)
    onIncrement()
  }, [onIncrement])

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

  const getProgress = () => {
    if (isMaxReps || !targetRepsMax) return 0
    return Math.min(currentReps / targetRepsMax, 1)
  }

  const targetDisplay = getTargetDisplay()
  const progress = getProgress()

  return (
    <div
      onClick={handleTap}
      {...keyboardProps}
      className={`
        flex-1 flex flex-col items-center justify-center
        cursor-pointer select-none touch-none
        min-h-interaction
        focus-interactive relative overflow-hidden
        ${className}
      `}
      aria-label={`Current reps: ${currentReps}. Tap or press Enter to add one rep.`}
    >
      {/* Ripple effect */}
      {ripple && (
        <motion.span
          className="absolute rounded-full bg-earth-500/20 dark:bg-earth-400/20 pointer-events-none"
          style={{
            left: ripple.x,
            top: ripple.y,
            width: 20,
            height: 20,
            marginLeft: -10,
            marginTop: -10
          }}
          initial={{ scale: 0, opacity: 0.5 }}
          animate={{ scale: 10, opacity: 0 }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
        />
      )}

      {/* Geometric container for rep number */}
      <motion.div
        className="w-48 h-48 rounded-[2rem] bg-cream-50 dark:bg-ink-800 shadow-[var(--shadow-md)] flex items-center justify-center mb-6"
        whileTap={{ scale: 1.03 }}
        transition={{ type: 'spring', stiffness: 400, damping: 17 }}
      >
        <motion.span
          key={currentReps}
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: 'spring', stiffness: 500, damping: 25 }}
          className="font-display font-extrabold text-display-xl text-ink-900 dark:text-cream-100 tabular-nums"
        >
          {currentReps}
        </motion.span>
      </motion.div>

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

      {/* Tap instruction */}
      <p className="text-body-sm text-ink-500 dark:text-cream-400 mt-6 animate-pulse-slow">
        Tap to count
      </p>
    </div>
  )
}
