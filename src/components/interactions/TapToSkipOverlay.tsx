import { useState, useCallback, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ProgressRing } from '@/components/base/ProgressRing'
import { useHoldDetection } from '@/hooks'

interface TapToSkipOverlayProps {
  onSkip: () => void
  holdDuration?: number
  enabled?: boolean
  children: React.ReactNode
}

interface Position {
  x: number
  y: number
}

export function TapToSkipOverlay({
  onSkip,
  holdDuration = 2000,
  enabled = true,
  children
}: TapToSkipOverlayProps) {
  const [position, setPosition] = useState<Position | null>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  const { isHolding, progress, handlers } = useHoldDetection({
    holdDuration,
    onHoldComplete: onSkip,
    onHoldCancel: () => setPosition(null)
  })

  const handlePointerDown = useCallback(
    (e: React.PointerEvent<HTMLDivElement>) => {
      if (!enabled) return
      const rect = e.currentTarget.getBoundingClientRect()
      setPosition({ x: e.clientX - rect.left, y: e.clientY - rect.top })
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
          setPosition({ x: rect.width / 2, y: rect.height / 2 })
        }
      }
      handlers.onKeyDown(e)
    },
    [enabled, handlers]
  )

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
      aria-label={enabled ? `Hold for ${holdDuration / 1000} seconds to skip` : undefined}
    >
      {children}

      <AnimatePresence>
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
