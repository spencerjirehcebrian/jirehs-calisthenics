import { useState, useRef, useCallback, useEffect } from 'react'

interface UseTimerOptions {
  initialSeconds: number
  direction: 'up' | 'down'
  autoStart?: boolean
  onComplete?: () => void
  onTick?: (seconds: number) => void
}

interface UseTimerReturn {
  seconds: number
  isRunning: boolean
  isComplete: boolean
  start: () => void
  pause: () => void
  reset: (newInitial?: number) => void
}

export function useTimer({
  initialSeconds,
  direction,
  autoStart = false,
  onComplete,
  onTick
}: UseTimerOptions): UseTimerReturn {
  const [seconds, setSeconds] = useState(initialSeconds)
  const [isRunning, setIsRunning] = useState(autoStart)
  const [isComplete, setIsComplete] = useState(false)

  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const onCompleteRef = useRef(onComplete)
  const onTickRef = useRef(onTick)
  const hasCalledCompleteRef = useRef(false)

  // Keep refs updated
  useEffect(() => {
    onCompleteRef.current = onComplete
    onTickRef.current = onTick
  }, [onComplete, onTick])

  const clearTimerInterval = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current)
      intervalRef.current = null
    }
  }, [])

  const start = useCallback(() => {
    if (!isRunning) {
      setIsRunning(true)
    }
  }, [isRunning])

  const pause = useCallback(() => {
    setIsRunning(false)
    clearTimerInterval()
  }, [clearTimerInterval])

  const reset = useCallback((newInitial?: number) => {
    clearTimerInterval()
    setSeconds(newInitial ?? initialSeconds)
    setIsRunning(false)
    setIsComplete(false)
    hasCalledCompleteRef.current = false
  }, [clearTimerInterval, initialSeconds])

  useEffect(() => {
    if (isRunning) {
      intervalRef.current = setInterval(() => {
        setSeconds((prev) => {
          const next = direction === 'down' ? prev - 1 : prev + 1

          // Call onTick
          onTickRef.current?.(next)

          // Check for completion (countdown reaching 0)
          if (direction === 'down' && next === 0 && !hasCalledCompleteRef.current) {
            hasCalledCompleteRef.current = true
            setIsComplete(true)
            onCompleteRef.current?.()
          }

          return next
        })
      }, 1000)
    } else {
      clearTimerInterval()
    }

    return clearTimerInterval
  }, [isRunning, direction, clearTimerInterval])

  // Auto-start effect - handles autoStart prop changes after initial mount
  /* eslint-disable react-hooks/set-state-in-effect */
  useEffect(() => {
    if (autoStart && !isRunning) {
      setIsRunning(true)
    }
  }, [autoStart, isRunning])
  /* eslint-enable react-hooks/set-state-in-effect */

  return {
    seconds,
    isRunning,
    isComplete,
    start,
    pause,
    reset
  }
}
