interface TimerProps {
  seconds: number
  size?: 'sm' | 'md' | 'lg' | 'xl'
  showSign?: boolean
  className?: string
}

export function Timer({
  seconds,
  size = 'lg',
  showSign = true,
  className = ''
}: TimerProps) {
  const isNegative = seconds < 0
  const absoluteSeconds = Math.abs(seconds)
  const minutes = Math.floor(absoluteSeconds / 60)
  const remainingSeconds = absoluteSeconds % 60

  const sizeStyles = {
    sm: 'text-2xl',
    md: 'text-4xl',
    lg: 'text-6xl',
    xl: 'text-8xl'
  }

  const formattedTime = minutes > 0
    ? `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`
    : remainingSeconds.toString()

  return (
    <span
      className={`font-mono font-bold tabular-nums ${sizeStyles[size]} ${isNegative ? 'text-red-500' : ''} ${className}`}
      aria-label={`${isNegative && showSign ? 'negative ' : ''}${minutes} minutes ${remainingSeconds} seconds`}
    >
      {isNegative && showSign && '-'}{formattedTime}
    </span>
  )
}
