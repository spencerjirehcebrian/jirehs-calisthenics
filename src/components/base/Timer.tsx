import { motion, AnimatePresence } from 'framer-motion'

type TimerSize = 'sm' | 'md' | 'lg' | 'xl' | 'display'

interface TimerProps {
  seconds: number
  size?: TimerSize
  showSign?: boolean
  className?: string
  animate?: boolean
}

export function Timer({
  seconds,
  size = 'lg',
  showSign = true,
  className = '',
  animate = true
}: TimerProps) {
  const isNegative = seconds < 0
  const absoluteSeconds = Math.abs(seconds)
  const minutes = Math.floor(absoluteSeconds / 60)
  const remainingSeconds = absoluteSeconds % 60

  const sizeStyles: Record<TimerSize, string> = {
    sm: 'text-2xl',
    md: 'text-4xl',
    lg: 'text-6xl',
    xl: 'text-8xl',
    display: 'text-display-xl'
  }

  const formattedTime = minutes > 0
    ? `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`
    : remainingSeconds.toString()

  const colorClass = isNegative
    ? 'text-terra-500 dark:text-terra-400'
    : 'text-ink-900 dark:text-cream-100'

  const content = (
    <span
      className={`font-display font-bold tabular-nums ${sizeStyles[size]} ${colorClass} ${className}`}
      aria-label={`${isNegative && showSign ? 'negative ' : ''}${minutes} minutes ${remainingSeconds} seconds`}
    >
      {isNegative && showSign && '-'}{formattedTime}
    </span>
  )

  if (!animate) {
    return content
  }

  return (
    <AnimatePresence mode="wait">
      <motion.span
        key={formattedTime}
        initial={{ opacity: 0.8, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.15, ease: 'easeOut' }}
        className={`font-display font-bold tabular-nums ${sizeStyles[size]} ${colorClass} ${className}`}
        aria-label={`${isNegative && showSign ? 'negative ' : ''}${minutes} minutes ${remainingSeconds} seconds`}
      >
        {isNegative && showSign && '-'}{formattedTime}
      </motion.span>
    </AnimatePresence>
  )
}
