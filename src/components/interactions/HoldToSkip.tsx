import { ProgressRing } from '@/components/base/ProgressRing'
import { useHoldDetection } from '@/hooks'
import { motion } from 'framer-motion'

interface HoldToSkipProps {
  onSkip: () => void
  holdDuration?: number
  position?: 'bottom-right' | 'bottom-left' | 'center'
  className?: string
}

export function HoldToSkip({
  onSkip,
  holdDuration = 2000,
  position = 'bottom-right',
  className = ''
}: HoldToSkipProps) {
  const { isHolding, progress, handlers } = useHoldDetection({
    holdDuration,
    onHoldComplete: onSkip
  })

  const positionClasses = {
    'bottom-right': 'absolute bottom-4 right-4',
    'bottom-left': 'absolute bottom-4 left-4',
    'center': 'absolute bottom-4 left-1/2 -translate-x-1/2'
  }

  const holdDurationSeconds = holdDuration / 1000

  return (
    <motion.div
      {...handlers}
      tabIndex={0}
      className={`
        ${positionClasses[position]}
        flex flex-col items-center
        touch-none select-none cursor-pointer
        focus-interactive rounded-xl p-2
        ${className}
      `}
      role="button"
      aria-label={
        isHolding
          ? `Skipping... ${Math.round(progress * 100)}% complete`
          : `Hold for ${holdDurationSeconds} seconds to skip`
      }
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
    >
      <ProgressRing
        progress={progress}
        size={48}
        strokeWidth={4}
        variant={isHolding ? 'default' : 'default'}
        animate={true}
      />
      <motion.span
        className="text-body-xs text-ink-600 dark:text-cream-400 mt-1 whitespace-nowrap"
        animate={{ opacity: isHolding ? 1 : 0.7 }}
      >
        {isHolding ? 'Keep holding...' : 'Hold to skip'}
      </motion.span>
    </motion.div>
  )
}
