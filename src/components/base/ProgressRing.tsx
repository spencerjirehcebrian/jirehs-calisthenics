import { motion } from 'framer-motion'

type ProgressRingVariant = 'default' | 'warning' | 'success'

interface ProgressRingProps {
  progress: number
  size?: number
  strokeWidth?: number
  className?: string
  variant?: ProgressRingVariant
  animate?: boolean
  children?: React.ReactNode
}

export function ProgressRing({
  progress,
  size = 200,
  strokeWidth = 8,
  className = '',
  variant = 'default',
  animate = true,
  children
}: ProgressRingProps) {
  const radius = (size - strokeWidth) / 2
  const circumference = radius * 2 * Math.PI
  const offset = circumference - (progress * circumference)

  const variantColors: Record<ProgressRingVariant, { track: string; progress: string; glow: string }> = {
    default: {
      track: 'text-cream-300 dark:text-ink-700',
      progress: 'text-earth-500 dark:text-earth-400',
      glow: 'rgba(156, 130, 89, 0.25)'
    },
    warning: {
      track: 'text-terra-200 dark:text-terra-900',
      progress: 'text-terra-500 dark:text-terra-400',
      glow: 'rgba(217, 116, 82, 0.25)'
    },
    success: {
      track: 'text-moss-200 dark:text-moss-900',
      progress: 'text-moss-500 dark:text-moss-400',
      glow: 'rgba(74, 138, 85, 0.25)'
    }
  }

  const colors = variantColors[variant]

  return (
    <div className={`relative inline-flex items-center justify-center ${className}`}>
      <svg
        width={size}
        height={size}
        aria-valuenow={Math.round(progress * 100)}
        aria-valuemin={0}
        aria-valuemax={100}
        role="progressbar"
      >
        {/* Background circle */}
        <circle
          stroke="currentColor"
          className={colors.track}
          fill="transparent"
          strokeWidth={strokeWidth}
          r={radius}
          cx={size / 2}
          cy={size / 2}
        />
        {/* Progress circle */}
        <motion.circle
          stroke="currentColor"
          className={colors.progress}
          fill="transparent"
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          initial={animate ? { strokeDashoffset: circumference } : { strokeDashoffset: offset }}
          animate={{ strokeDashoffset: offset }}
          transition={animate ? { duration: 0.3, ease: 'easeOut' } : { duration: 0 }}
          strokeLinecap="round"
          r={radius}
          cx={size / 2}
          cy={size / 2}
          transform={`rotate(-90 ${size / 2} ${size / 2})`}
          style={{ filter: `drop-shadow(0 0 4px ${colors.glow})` }}
        />
      </svg>
      {children && (
        <div className="absolute inset-0 flex items-center justify-center">
          {children}
        </div>
      )}
    </div>
  )
}
