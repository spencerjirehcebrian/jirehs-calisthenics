import { useState, useEffect, useCallback, useRef } from 'react'
import { Timer } from '@/components/base/Timer'
import { ProgressBar } from '@/components/base/ProgressBar'
import { Button } from '@/components/base/Button'
import { useTimer, useAudioCue, useKeyboardInteraction } from '@/hooks'
import { motion, AnimatePresence } from 'framer-motion'
import { Check } from 'lucide-react'

type TimedHoldPhase = 'ready' | 'countdown' | 'active' | 'complete'

interface TimedHoldProps {
  targetSeconds: number
  countdownDuration?: 2 | 3
  onComplete: () => void
  className?: string
  /** External trigger to start the hold (for voice commands) */
  externalTriggerStart?: boolean
  /** External trigger to abort the hold (for voice commands) */
  externalTriggerStop?: boolean
}

// Expanding rings component for active phase
function ExpandingRings({ progress }: { progress: number }) {
  const ringCount = 5
  return (
    <div className="relative w-48 h-12 flex items-center justify-center overflow-hidden opacity-60">
      {[...Array(ringCount)].map((_, i) => {
        const delay = i * 0.15
        const scale = 0.3 + (progress * 0.7) + (i * 0.1)
        return (
          <motion.div
            key={i}
            className="absolute w-8 h-8 rounded-full border-2 border-earth-400 dark:border-earth-500"
            animate={{
              scale: [scale, scale + 0.3],
              opacity: [0.6 - i * 0.1, 0]
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              delay,
              ease: 'easeOut'
            }}
          />
        )
      })}
      <div className="w-3 h-3 rounded-full bg-earth-500 dark:bg-earth-400" />
    </div>
  )
}

export function TimedHold({
  targetSeconds,
  countdownDuration = 3,
  onComplete,
  className = '',
  externalTriggerStart,
  externalTriggerStop
}: TimedHoldProps) {
  const [phase, setPhase] = useState<TimedHoldPhase>('ready')
  const { playHoldTick, playHoldComplete } = useAudioCue()
  const hasPlayedComplete = useRef(false)

  const countdownTimer = useTimer({
    initialSeconds: countdownDuration,
    direction: 'down',
    onTick: (seconds) => {
      if (seconds > 0) {
        playHoldTick()
      }
    },
    onComplete: () => {
      playHoldTick()
      setPhase('active')
      holdTimer.start()
    }
  })

  const holdTimer = useTimer({
    initialSeconds: targetSeconds,
    direction: 'down',
    onComplete: () => {
      setPhase('complete')
      if (!hasPlayedComplete.current) {
        hasPlayedComplete.current = true
        playHoldComplete()
      }
      setTimeout(onComplete, 800)
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

  // Reset when target/countdown changes - this is intentional "reset on prop change" pattern
  // Timer refs are intentionally excluded from deps as they change every render
  /* eslint-disable react-hooks/set-state-in-effect, react-hooks/exhaustive-deps */
  useEffect(() => {
    setPhase('ready')
    countdownTimer.reset(countdownDuration)
    holdTimer.reset(targetSeconds)
    hasPlayedComplete.current = false
  }, [targetSeconds, countdownDuration])
  /* eslint-enable react-hooks/set-state-in-effect, react-hooks/exhaustive-deps */

  // Handle external start trigger (for voice commands)
  /* eslint-disable react-hooks/set-state-in-effect */
  useEffect(() => {
    if (externalTriggerStart && phase === 'ready') {
      handleTapToStart()
    }
  }, [externalTriggerStart, phase, handleTapToStart])

  // Handle external stop trigger (for voice commands)
  useEffect(() => {
    if (externalTriggerStop && (phase === 'countdown' || phase === 'active')) {
      // Abort the hold
      setPhase('ready')
      countdownTimer.reset(countdownDuration)
      holdTimer.reset(targetSeconds)
    }
  }, [externalTriggerStop, phase, countdownTimer, holdTimer, countdownDuration, targetSeconds])
  /* eslint-enable react-hooks/set-state-in-effect */

  const holdProgress = phase === 'active'
    ? 1 - (holdTimer.seconds / targetSeconds)
    : phase === 'complete' ? 1 : 0

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
      <AnimatePresence mode="wait">
        {/* Phase 1: Ready */}
        {phase === 'ready' && (
          <motion.div
            key="ready"
            className="flex flex-col items-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.3 }}
          >
            <h3 className="font-display font-semibold text-ink-900 dark:text-cream-100 text-display-md mb-4">
              HOLD
            </h3>
            <div className="w-48 h-48 rounded-[2rem] bg-cream-50 dark:bg-ink-800 shadow-[var(--shadow-md)] flex flex-col items-center justify-center mb-6">
              <span className="font-display font-bold text-display-lg text-ink-900 dark:text-cream-100">
                0:{String(targetSeconds).padStart(2, '0')}
              </span>
              <span className="text-body-sm text-ink-500 dark:text-cream-400 mt-1">seconds</span>
            </div>
            <Button
              size="lg"
              onClick={handleTapToStart}
              className="mt-4"
            >
              TAP WHEN READY
            </Button>
          </motion.div>
        )}

        {/* Phase 2: Countdown */}
        {phase === 'countdown' && (
          <motion.div
            key="countdown"
            className="flex flex-col items-center justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              key={countdownTimer.seconds}
              className="font-display font-extrabold text-earth-600 dark:text-earth-400"
              style={{ fontSize: 'clamp(8rem, 40vmin, 12rem)' }}
              initial={{ scale: 1.2, opacity: 0.8 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: 'spring', stiffness: 300, damping: 20 }}
            >
              {countdownTimer.seconds}
            </motion.div>
          </motion.div>
        )}

        {/* Phase 3: Active */}
        {phase === 'active' && (
          <motion.div
            key="active"
            className="flex flex-col items-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9 }}
          >
            <motion.p
              className="text-display-md font-display font-semibold text-earth-600 dark:text-earth-400 mb-6"
              animate={{ scale: [1, 1.02, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              HOLD
            </motion.p>

            <Timer seconds={holdTimer.seconds} size="xl" showSign={false} />

            {/* Progress bar */}
            <div className="w-64 mt-8">
              <ProgressBar progress={holdProgress} variant="default" />
            </div>

            {/* Expanding rings visual */}
            <div className="mt-8">
              <ExpandingRings progress={holdProgress} />
            </div>

            <p className="text-body-sm text-ink-500 dark:text-cream-400 mt-6">
              Keep holding until timer reaches zero
            </p>
          </motion.div>
        )}

        {/* Phase 4: Complete */}
        {phase === 'complete' && (
          <motion.div
            key="complete"
            className="flex flex-col items-center"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ type: 'spring', stiffness: 400, damping: 25 }}
          >
            <motion.div
              className="text-display-lg font-display font-bold text-moss-500 dark:text-moss-400 mb-4"
              initial={{ y: 10 }}
              animate={{ y: 0 }}
            >
              DONE!
            </motion.div>
            <motion.div
              className="w-16 h-16 rounded-full bg-moss-100 dark:bg-moss-900 flex items-center justify-center"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.1, type: 'spring', stiffness: 500, damping: 25 }}
            >
              <motion.div
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ delay: 0.2, duration: 0.4 }}
              >
                <Check className="w-8 h-8 text-moss-500 dark:text-moss-400" strokeWidth={3} />
              </motion.div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
