import { useEffect } from 'react'
import { useWorkoutSessionStore } from '@/stores'

/**
 * Hook to prevent accidental page exit during active workouts.
 * Sets up a beforeunload handler that warns users before closing/navigating away.
 * The handler is only active during warmup, strength, and cooldown phases.
 * It's automatically removed when the workout completes (summary phase) or is reset.
 */
export function useExitProtection() {
  const isActive = useWorkoutSessionStore((state) => state.isActive)
  const phase = useWorkoutSessionStore((state) => state.phase)

  useEffect(() => {
    // Only protect during active workout phases (not summary)
    const shouldProtect = isActive && phase !== 'summary'

    if (!shouldProtect) {
      return
    }

    const handleBeforeUnload = (event: BeforeUnloadEvent) => {
      // Standard way to trigger the browser's confirmation dialog
      event.preventDefault()
      // For older browsers, return a string (modern browsers show a generic message)
      return ''
    }

    window.addEventListener('beforeunload', handleBeforeUnload)

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload)
    }
  }, [isActive, phase])
}
