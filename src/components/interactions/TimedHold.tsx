import { useState, useEffect, useCallback, useRef } from 'react'
import { Timer } from '@/components/base/Timer'
import { useTimer, useAudioCue, useKeyboardInteraction } from '@/hooks'

type TimedHoldPhase = 'ready' | 'countdown' | 'active' | 'complete'

interface TimedHoldProps {
  targetSeconds: number
  countdownDuration?: 2 | 3
  onComplete: () => void
  className?: string
}

export function TimedHold({
  targetSeconds,
  countdownDuration = 3,
  onComplete,
  className = ''
}: TimedHoldProps) {
  const [phase, setPhase] = useState<TimedHoldPhase>('ready')
  const { playHoldTick, playHoldComplete } = useAudioCue()
  const hasPlayedComplete = useRef(false)

  // Countdown timer (3, 2, 1)
  const countdownTimer = useTimer({
    initialSeconds: countdownDuration,
    direction: 'down',
    onTick: (seconds) => {
      // Play tick on each countdown second (3, 2, 1)
      if (seconds > 0) {
        playHoldTick()
      }
    },
    onComplete: () => {
      // Play final tick for "0"
      playHoldTick()
      setPhase('active')
      holdTimer.start()
    }
  })

  // Hold timer (counts down from target)
  const holdTimer = useTimer({
    initialSeconds: targetSeconds,
    direction: 'down',
    onComplete: () => {
      setPhase('complete')
      // Play completion sound
      if (!hasPlayedComplete.current) {
        hasPlayedComplete.current = true
        playHoldComplete()
      }
      // Small delay before calling onComplete for visual feedback
      setTimeout(onComplete, 500)
    }
  })

  const handleTapToStart = useCallback(() => {
    if (phase === 'ready') {
      setPhase('countdown')
      countdownTimer.start()
    }
  }, [phase, countdownTimer])

  const keyboardProps = useKeyboardInteraction({
    onActivate: handleTapToStart,
    disabled: phase !== 'ready'
  })

  // Reset when targetSeconds changes
  useEffect(() => {
    setPhase('ready')
    countdownTimer.reset(countdownDuration)
    holdTimer.reset(targetSeconds)
    hasPlayedComplete.current = false
  }, [targetSeconds, countdownDuration])

  return (
    <div
      onClick={phase === 'ready' ? handleTapToStart : undefined}
      {...(phase === 'ready' ? keyboardProps : {})}
      className={`
        flex-1 flex flex-col items-center justify-center
        ${phase === 'ready' ? 'cursor-pointer focus-interactive' : ''}
        select-none
        min-h-interaction
        ${className}
      `}
      aria-label={phase === 'ready' ? 'Tap or press Enter to start timer' : undefined}
      aria-live="polite"
    >
      {phase === 'ready' && (
        <>
          <p className="text-2xl text-neutral-500 mb-4">
            Hold for
          </p>
          <Timer seconds={targetSeconds} size="xl" showSign={false} />
          <p className="text-lg text-accent-600 mt-6 font-medium">
            Tap to Start
          </p>
        </>
      )}

      {phase === 'countdown' && (
        <div className="text-center">
          <p className="text-neutral-500 mb-4">Get ready...</p>
          <div className="text-9xl font-bold text-accent-600 animate-pulse">
            {countdownTimer.seconds}
          </div>
        </div>
      )}

      {phase === 'active' && (
        <>
          <p className="text-neutral-500 mb-4">Hold...</p>
          <Timer seconds={holdTimer.seconds} size="xl" showSign={false} />
          <p className="text-sm text-neutral-400 mt-4">
            Keep holding until timer reaches zero
          </p>
        </>
      )}

      {phase === 'complete' && (
        <div className="text-center">
          <div className="text-6xl font-bold text-green-500">
            Done!
          </div>
        </div>
      )}
    </div>
  )
}
