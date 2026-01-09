import { useEffect, useRef, useMemo } from 'react'
import { Timer } from '@/components/base/Timer'
import { ProgressRing } from '@/components/base/ProgressRing'
import { TapToSkipOverlay } from './TapToSkipOverlay'
import { useTimer, useAudioCue } from '@/hooks'
import { motion } from 'framer-motion'

const REST_TIPS = [
  'Shake out your arms',
  'Take deep breaths',
  'Stay hydrated',
  'Visualize the next set',
  'Keep your muscles warm',
  'Focus on your breathing'
]

interface RestTimerProps {
  initialSeconds?: number
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

  // Pick a random rest tip
  const restTip = useMemo(() => {
    return REST_TIPS[Math.floor(Math.random() * REST_TIPS.length)]
  }, [])

  const timer = useTimer({
    initialSeconds,
    direction: 'down',
    autoStart: true,
    onTick: (seconds) => {
      if (seconds === 10 && !hasPlayedWarning.current) {
        hasPlayedWarning.current = true
        playRestWarning()
      }
    },
    onComplete: () => {
      if (!hasPlayedComplete.current) {
        hasPlayedComplete.current = true
        playRestComplete()
      }
    }
  })

  useEffect(() => {
    hasPlayedWarning.current = false
    hasPlayedComplete.current = false
  }, [initialSeconds])

  const handleComplete = () => {
    timer.pause()
    onComplete()
  }

  // Calculate progress (1 = full, 0 = empty)
  const progress = Math.max(0, timer.seconds / initialSeconds)
  const isWarning = timer.seconds <= 10 && timer.seconds > 0
  const isOvertime = timer.seconds < 0

  return (
    <TapToSkipOverlay onSkip={handleComplete}>
      <motion.div
        className={`
          flex-1 flex flex-col items-center justify-center
          relative
          min-h-interaction
          ${className}
        `}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
        aria-live="polite"
      >
      {/* Rest label */}
      <motion.p
        className="text-display-md font-display font-semibold text-earth-600 dark:text-earth-400 mb-8"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        REST
      </motion.p>

      {/* Circular progress ring with timer inside */}
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: 'spring', stiffness: 300, damping: 25 }}
      >
        <ProgressRing
          progress={progress}
          size={200}
          strokeWidth={8}
          variant={isOvertime ? 'warning' : isWarning ? 'warning' : 'default'}
          animate={true}
        >
          <Timer
            seconds={timer.seconds}
            size="display"
            animate={false}
          />
        </ProgressRing>
      </motion.div>

      {/* Over-resting message */}
      {isOvertime && (
        <motion.p
          className="warning-state mt-4 animate-pulse-slow"
          role="alert"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
        >
          Over-resting
        </motion.p>
      )}

      {/* Next exercise preview */}
      {nextExerciseName && (
        <motion.p
          className="text-ink-600 dark:text-cream-400 mt-8 text-body-md"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          Next: <span className="font-semibold">{nextExerciseName}</span>
        </motion.p>
      )}

      {/* Rest tip */}
      <motion.p
        className="text-ink-500 dark:text-cream-400 mt-4 text-body-sm italic"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
      >
        "{restTip}"
      </motion.p>

      {/* Hold instruction */}
      <motion.p
        className="text-body-sm text-ink-500 dark:text-cream-400 mt-8 animate-pulse-slow uppercase tracking-wide"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
      >
        Hold anywhere to continue
      </motion.p>
      </motion.div>
    </TapToSkipOverlay>
  )
}
