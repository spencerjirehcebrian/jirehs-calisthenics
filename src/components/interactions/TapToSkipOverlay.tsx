import { useState, useCallback, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ProgressRing } from '@/components/base/ProgressRing'
import { useHoldDetection } from '@/hooks'

interface TapToSkipOverlayProps {
  onSkip: () => void
  onTap?: () => void
  holdDuration?: number
  quickTapThreshold?: number
  enabled?: boolean
  children: React.ReactNode
}

interface Position {
  x: number
  y: number
}

export function TapToSkipOverlay({
  onSkip,
  onTap,
  holdDuration = 2000,
  quickTapThreshold = 300,
  enabled = true,
  children
}: TapToSkipOverlayProps) {
  const [position, setPosition] = useState<Position | null>(null)
  const [ripple, setRipple] = useState<Position | null>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const lastPositionRef = useRef<Position | null>(null)

  const handleQuickTap = useCallback(() => {
    // Show ripple effect at the tap position
    if (lastPositionRef.current && onTap) {
      setRipple(lastPositionRef.current)
      setTimeout(() => setRipple(null), 500)
    }
    setPosition(null)
    onTap?.()
  }, [onTap])

  const { isHolding, progress, handlers } = useHoldDetection({
    holdDuration,
    quickTapThreshold,
    onHoldComplete: onSkip,
    onHoldCancel: () => setPosition(null),
    onQuickTap: handleQuickTap
  })

  const handlePointerDown = useCallback(
    (e: React.PointerEvent<HTMLDivElement>) => {
      if (!enabled) return
      const rect = e.currentTarget.getBoundingClientRect()
      const pos = { x: e.clientX - rect.left, y: e.clientY - rect.top }
      setPosition(pos)
      lastPositionRef.current = pos
      handlers.onPointerDown(e)
    },
    [enabled, handlers]
  )

  const handlePointerUp = useCallback(
    (e: React.PointerEvent<HTMLDivElement>) => {
      handlers.onPointerUp(e)
      setPosition(null)
    },
    [handlers]
  )

  const handlePointerLeave = useCallback(
    (e: React.PointerEvent<HTMLDivElement>) => {
      handlers.onPointerLeave(e)
      setPosition(null)
    },
    [handlers]
  )

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLDivElement>) => {
      if (!enabled) return
      if (e.key === 'Enter' || e.key === ' ') {
        // Center position for keyboard
        if (containerRef.current) {
          const rect = containerRef.current.getBoundingClientRect()
          const pos = { x: rect.width / 2, y: rect.height / 2 }
          setPosition(pos)
          lastPositionRef.current = pos
        }
      }
      handlers.onKeyDown(e)
    },
    [enabled, handlers]
  )

  const getAriaLabel = () => {
    if (!enabled) return undefined
    if (onTap) {
      return `Tap anywhere to interact. Hold for ${holdDuration / 1000} seconds to skip.`
    }
    return `Hold for ${holdDuration / 1000} seconds to skip`
  }

  return (
    <div
      ref={containerRef}
      className="relative touch-none select-none flex-1 flex flex-col min-h-0"
      onPointerDown={handlePointerDown}
      onPointerUp={handlePointerUp}
      onPointerLeave={handlePointerLeave}
      onPointerCancel={handlers.onPointerCancel}
      onKeyDown={handleKeyDown}
      onKeyUp={handlers.onKeyUp}
      onBlur={handlers.onBlur}
      tabIndex={enabled ? 0 : undefined}
      role={enabled ? 'button' : undefined}
      aria-label={getAriaLabel()}
    >
      {children}

      <AnimatePresence>
        {/* Ripple effect for quick taps */}
        {ripple && (
          <motion.span
            className="absolute rounded-full bg-earth-500/20 dark:bg-earth-400/20 pointer-events-none z-40"
            style={{
              left: ripple.x,
              top: ripple.y,
              width: 20,
              height: 20,
              marginLeft: -10,
              marginTop: -10
            }}
            initial={{ scale: 0, opacity: 0.5 }}
            animate={{ scale: 15, opacity: 0 }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
          />
        )}

        {/* Hold progress indicator */}
        {isHolding && position && (
          <motion.div
            className="absolute pointer-events-none z-50 flex flex-col items-center"
            style={{ left: position.x, top: position.y, transform: 'translate(-50%, -50%)' }}
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 400, damping: 25 }}
          >
            <ProgressRing progress={progress} size={64} strokeWidth={4} animate={false} />
            <span className="text-body-xs text-ink-700 dark:text-cream-300 mt-2 whitespace-nowrap bg-cream-100/90 dark:bg-ink-900/90 px-2 py-1 rounded">
              Keep holding...
            </span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
