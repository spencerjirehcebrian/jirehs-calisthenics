import { useState, useRef, useCallback, useEffect } from 'react'

interface UseHoldDetectionOptions {
  holdDuration?: number // ms, default 2000
  quickTapThreshold?: number // ms, default 300 - release before this = quick tap
  onHoldComplete: () => void
  onHoldStart?: () => void
  onHoldCancel?: () => void
  onQuickTap?: () => void // Called when released before quickTapThreshold
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
  quickTapThreshold = 300,
  onHoldComplete,
  onHoldStart,
  onHoldCancel,
  onQuickTap
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
  const onQuickTapRef = useRef(onQuickTap)

  // Keep refs updated
  useEffect(() => {
    onHoldCompleteRef.current = onHoldComplete
    onHoldStartRef.current = onHoldStart
    onHoldCancelRef.current = onHoldCancel
    onQuickTapRef.current = onQuickTap
  }, [onHoldComplete, onHoldStart, onHoldCancel, onQuickTap])

  // updateProgress needs to be declared before cancelHold to avoid "accessed before declaration" error
  // Using a ref to store the function allows mutual recursion between updateProgress and cancelHold
  const updateProgressRef = useRef<() => void>(() => {})

  const cancelHold = useCallback((checkQuickTap = false, elapsedTime?: number) => {
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current)
      animationFrameRef.current = null
    }

    const wasHolding = startTimeRef.current !== null
    startTimeRef.current = null
    holdingKeyRef.current = null
    setIsHolding(false)
    setProgress(0)

    if (!hasCompletedRef.current) {
      // Check if this was a quick tap (released before threshold)
      if (checkQuickTap && wasHolding && elapsedTime !== undefined && elapsedTime < quickTapThreshold) {
        onQuickTapRef.current?.()
      } else {
        onHoldCancelRef.current?.()
      }
    }
    hasCompletedRef.current = false
  }, [quickTapThreshold])

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
      animationFrameRef.current = requestAnimationFrame(updateProgressRef.current)
    }
  }, [holdDuration, cancelHold])

  // Keep the ref updated
  useEffect(() => {
    updateProgressRef.current = updateProgress
  }, [updateProgress])

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
    onPointerUp: () => {
      // Calculate elapsed time to detect quick tap
      const elapsed = startTimeRef.current ? Date.now() - startTimeRef.current : undefined
      cancelHold(true, elapsed)
    },
    onPointerLeave: () => {
      // Don't trigger quick tap on leave - user moved away
      cancelHold(false)
    },
    onPointerCancel: () => {
      // Don't trigger quick tap on cancel
      cancelHold(false)
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
        // Calculate elapsed time to detect quick tap
        const elapsed = startTimeRef.current ? Date.now() - startTimeRef.current : undefined
        cancelHold(true, elapsed)
      }
    },
    onBlur: () => {
      // Cancel hold if element loses focus - don't trigger quick tap
      cancelHold(false)
    }
  }

  return {
    isHolding,
    progress,
    handlers
  }
}
