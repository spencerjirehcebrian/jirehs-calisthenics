interface ProgressRingProps {
  progress: number
  size?: number
  strokeWidth?: number
  className?: string
}

export function ProgressRing({
  progress,
  size = 48,
  strokeWidth = 4,
  className = ''
}: ProgressRingProps) {
  const radius = (size - strokeWidth) / 2
  const circumference = radius * 2 * Math.PI
  const offset = circumference - (progress * circumference)

  return (
    <svg
      width={size}
      height={size}
      className={className}
      aria-valuenow={Math.round(progress * 100)}
      aria-valuemin={0}
      aria-valuemax={100}
      role="progressbar"
    >
      {/* Background circle */}
      <circle
        stroke="currentColor"
        className="text-neutral-200 dark:text-neutral-700"
        fill="transparent"
        strokeWidth={strokeWidth}
        r={radius}
        cx={size / 2}
        cy={size / 2}
      />
      {/* Progress circle */}
      <circle
        stroke="currentColor"
        className="text-accent-500 transition-all duration-100"
        fill="transparent"
        strokeWidth={strokeWidth}
        strokeDasharray={circumference}
        strokeDashoffset={offset}
        strokeLinecap="round"
        r={radius}
        cx={size / 2}
        cy={size / 2}
        transform={`rotate(-90 ${size / 2} ${size / 2})`}
      />
    </svg>
  )
}
