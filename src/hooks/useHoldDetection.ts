import { useState, useRef, useCallback, useEffect } from 'react'

interface UseHoldDetectionOptions {
  holdDuration?: number // ms, default 2000
  onHoldComplete: () => void
  onHoldStart?: () => void
  onHoldCancel?: () => void
}

interface UseHoldDetectionReturn {
  isHolding: boolean
  progress: number // 0-1
  handlers: {
    onPointerDown: (e: React.PointerEvent) => void
    onPointerUp: (e: React.PointerEvent) => void
    onPointerLeave: (e: React.PointerEvent) => void
    onPointerCancel: (e: React.PointerEvent) => void
    onKeyDown: (e: React.KeyboardEvent) => void
    onKeyUp: (e: React.KeyboardEvent) => void
    onBlur: () => void
  }
}

export function useHoldDetection({
  holdDuration = 2000,
  onHoldComplete,
  onHoldStart,
  onHoldCancel
}: UseHoldDetectionOptions): UseHoldDetectionReturn {
  const [isHolding, setIsHolding] = useState(false)
  const [progress, setProgress] = useState(0)

  const startTimeRef = useRef<number | null>(null)
  const animationFrameRef = useRef<number | null>(null)
  const hasCompletedRef = useRef(false)
  const holdingKeyRef = useRef<string | null>(null)

  const onHoldCompleteRef = useRef(onHoldComplete)
  const onHoldStartRef = useRef(onHoldStart)
  const onHoldCancelRef = useRef(onHoldCancel)

  // Keep refs updated
  useEffect(() => {
    onHoldCompleteRef.current = onHoldComplete
    onHoldStartRef.current = onHoldStart
    onHoldCancelRef.current = onHoldCancel
  }, [onHoldComplete, onHoldStart, onHoldCancel])

  const cancelHold = useCallback(() => {
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current)
      animationFrameRef.current = null
    }
    startTimeRef.current = null
    holdingKeyRef.current = null
    setIsHolding(false)
    setProgress(0)

    if (!hasCompletedRef.current) {
      onHoldCancelRef.current?.()
    }
    hasCompletedRef.current = false
  }, [])

  const updateProgress = useCallback(() => {
    if (!startTimeRef.current) return

    const elapsed = Date.now() - startTimeRef.current
    const newProgress = Math.min(elapsed / holdDuration, 1)

    setProgress(newProgress)

    if (newProgress >= 1) {
      hasCompletedRef.current = true
      onHoldCompleteRef.current()
      cancelHold()
    } else {
      animationFrameRef.current = requestAnimationFrame(updateProgress)
    }
  }, [holdDuration, cancelHold])

  const startHold = useCallback(() => {
    if (isHolding) return

    hasCompletedRef.current = false
    startTimeRef.current = Date.now()
    setIsHolding(true)
    setProgress(0)
    onHoldStartRef.current?.()

    animationFrameRef.current = requestAnimationFrame(updateProgress)
  }, [isHolding, updateProgress])

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current)
      }
    }
  }, [])

  const handlers = {
    onPointerDown: (e: React.PointerEvent) => {
      e.preventDefault()
      startHold()
    },
    onPointerUp: (_e: React.PointerEvent) => {
      cancelHold()
    },
    onPointerLeave: (_e: React.PointerEvent) => {
      cancelHold()
    },
    onPointerCancel: (_e: React.PointerEvent) => {
      cancelHold()
    },
    onKeyDown: (e: React.KeyboardEvent) => {
      // Only respond to Enter or Space
      if (e.key !== 'Enter' && e.key !== ' ') return

      // Prevent default space scrolling behavior
      e.preventDefault()

      // Ignore if already holding a key (prevent key repeat from restarting)
      if (holdingKeyRef.current) return

      holdingKeyRef.current = e.key
      startHold()
    },
    onKeyUp: (e: React.KeyboardEvent) => {
      // Only cancel if releasing the same key that started the hold
      if (e.key === holdingKeyRef.current) {
        cancelHold()
      }
    },
    onBlur: () => {
      // Cancel hold if element loses focus
      cancelHold()
    }
  }

  return {
    isHolding,
    progress,
    handlers
  }
}
