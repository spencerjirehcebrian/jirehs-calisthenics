import { useState, useEffect } from 'react'

/**
 * Hook to track elapsed time from a given start timestamp.
 * Updates every second while startTime is valid.
 *
 * @param startTime - Unix timestamp (Date.now()) or null
 * @returns Elapsed seconds since startTime
 */
export function useElapsedTime(startTime: number | null): number {
  const [elapsedSeconds, setElapsedSeconds] = useState(0)

  /* eslint-disable react-hooks/set-state-in-effect */
  useEffect(() => {
    if (!startTime) {
      setElapsedSeconds(0)
      return
    }

    const calculateElapsed = () => Math.floor((Date.now() - startTime) / 1000)

    // Set initial elapsed time
    setElapsedSeconds(calculateElapsed())

    // Update every second
    const interval = setInterval(() => {
      setElapsedSeconds(calculateElapsed())
    }, 1000)

    return () => clearInterval(interval)
  }, [startTime])
  /* eslint-enable react-hooks/set-state-in-effect */

  return elapsedSeconds
}
