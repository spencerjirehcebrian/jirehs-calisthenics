import { motion } from 'framer-motion'

type ProgressBarVariant = 'default' | 'success' | 'warning'

interface ProgressBarProps {
  progress: number
  className?: string
  variant?: ProgressBarVariant
  showLabel?: boolean
  label?: string
  height?: number
}

export function ProgressBar({
  progress,
  className = '',
  variant = 'default',
  showLabel = false,
  label,
  height = 8
}: ProgressBarProps) {
  const clampedProgress = Math.min(Math.max(progress, 0), 1)

  const variantColors: Record<ProgressBarVariant, { track: string; fill: string }> = {
    default: {
      track: 'bg-earth-200 dark:bg-ink-700',
      fill: 'bg-earth-500 dark:bg-earth-400'
    },
    success: {
      track: 'bg-moss-200 dark:bg-moss-900',
      fill: 'bg-moss-500 dark:bg-moss-400'
    },
    warning: {
      track: 'bg-terra-200 dark:bg-terra-900',
      fill: 'bg-terra-500 dark:bg-terra-400'
    }
  }

  const colors = variantColors[variant]

  return (
    <div className={className}>
      {showLabel && (
        <div className="flex justify-between items-center mb-1.5">
          <span className="text-body-sm text-ink-600 dark:text-cream-300">
            {label || 'Progress'}
          </span>
          <span className="text-body-sm font-medium text-ink-800 dark:text-cream-100">
            {Math.round(clampedProgress * 100)}%
          </span>
        </div>
      )}
      <div
        className={`w-full rounded-full overflow-hidden ${colors.track}`}
        style={{ height }}
        role="progressbar"
        aria-valuenow={Math.round(clampedProgress * 100)}
        aria-valuemin={0}
        aria-valuemax={100}
      >
        <motion.div
          className={`h-full rounded-full ${colors.fill}`}
          initial={{ width: 0 }}
          animate={{ width: `${clampedProgress * 100}%` }}
          transition={{ duration: 0.3, ease: 'easeOut' }}
        />
      </div>
    </div>
  )
}
