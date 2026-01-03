import { ProgressRing } from '@/components/base/ProgressRing'
import { useHoldDetection } from '@/hooks'

interface HoldToSkipProps {
  onSkip: () => void
  holdDuration?: number // default 2000ms
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
    <div
      {...handlers}
      tabIndex={0}
      className={`
        ${positionClasses[position]}
        flex flex-col items-center
        touch-none select-none cursor-pointer
        focus-interactive
        ${className}
      `}
      role="button"
      aria-label={
        isHolding
          ? `Skipping... ${Math.round(progress * 100)}% complete`
          : `Hold for ${holdDurationSeconds} seconds to skip`
      }
    >
      <ProgressRing
        progress={progress}
        size={48}
        strokeWidth={4}
      />
      <span className="text-xs text-neutral-500 mt-1 whitespace-nowrap">
        {isHolding ? 'Keep holding...' : 'Hold to skip'}
      </span>
    </div>
  )
}
