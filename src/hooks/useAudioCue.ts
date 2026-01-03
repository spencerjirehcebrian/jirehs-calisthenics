import { useCallback, useEffect, useRef } from 'react'
import { useSettingsStore } from '@/stores'
import {
  initAudio,
  playAudioCueIfEnabled,
  startKeepAlive,
  stopKeepAlive,
  type AudioCueType
} from '@/utils/audio'

/**
 * Hook for playing audio cues with settings-aware behavior
 *
 * Automatically:
 * - Initializes audio on first user interaction
 * - Respects user's audio cue settings
 * - Manages PWA keep-alive audio during workouts
 */
export function useAudioCue() {
  const audioCues = useSettingsStore((state) => state.audioCues)
  const isInitialized = useRef(false)

  // Initialize audio on mount
  useEffect(() => {
    if (!isInitialized.current) {
      // Add a one-time click listener to unlock audio
      const unlockOnInteraction = () => {
        initAudio()
        isInitialized.current = true
        document.removeEventListener('click', unlockOnInteraction)
        document.removeEventListener('touchstart', unlockOnInteraction)
      }

      document.addEventListener('click', unlockOnInteraction)
      document.addEventListener('touchstart', unlockOnInteraction)

      return () => {
        document.removeEventListener('click', unlockOnInteraction)
        document.removeEventListener('touchstart', unlockOnInteraction)
      }
    }
  }, [])

  /**
   * Play an audio cue if enabled in settings
   */
  const play = useCallback(
    (cue: AudioCueType) => {
      playAudioCueIfEnabled(cue, audioCues)
    },
    [audioCues]
  )

  /**
   * Play rest countdown warning (at 10 seconds remaining)
   */
  const playRestWarning = useCallback(() => {
    play('restCountdownWarning')
  }, [play])

  /**
   * Play rest complete sound
   */
  const playRestComplete = useCallback(() => {
    play('restComplete')
  }, [play])

  /**
   * Play set complete sound
   */
  const playSetComplete = useCallback(() => {
    play('setComplete')
  }, [play])

  /**
   * Play hold countdown tick (during 3, 2, 1 countdown)
   */
  const playHoldTick = useCallback(() => {
    play('holdCountdownTick')
  }, [play])

  /**
   * Play hold complete sound
   */
  const playHoldComplete = useCallback(() => {
    play('holdComplete')
  }, [play])

  return {
    play,
    playRestWarning,
    playRestComplete,
    playSetComplete,
    playHoldTick,
    playHoldComplete
  }
}

/**
 * Hook to manage PWA keep-alive audio during active workout sessions
 *
 * @param isActive - Whether the workout is currently active
 */
export function useKeepAlive(isActive: boolean) {
  useEffect(() => {
    if (isActive) {
      startKeepAlive()
    } else {
      stopKeepAlive()
    }

    return () => {
      stopKeepAlive()
    }
  }, [isActive])
}
