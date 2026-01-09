import { motion, AnimatePresence } from 'framer-motion'
import { Mic, MicOff } from 'lucide-react'
import { useVoiceStore, useNavigationStore } from '@/stores'
import { AudioLevelMeter } from './AudioLevelMeter'

// Screens where voice control should be active
const VOICE_ENABLED_SCREENS = [
  'warmup',
  'active-workout',
  'cooldown'
]

/**
 * Floating microphone indicator that shows voice recognition status.
 * Positioned in the top-left corner during workout phases.
 * Self-contained - reads all state from voiceStore.
 */
export function VoiceMicIndicator() {
  const {
    enabled,
    isSupported,
    permissionStatus,
    micState,
    audioLevel
  } = useVoiceStore()

  const { currentScreen } = useNavigationStore()

  // Only show during workout phases when voice is enabled
  const isWorkoutPhase = VOICE_ENABLED_SCREENS.includes(currentScreen)
  const shouldShow = enabled && isSupported && isWorkoutPhase && permissionStatus !== 'denied'

  // Determine icon and colors based on state
  const isActive = micState === 'listening' || micState === 'partial' || micState === 'recognized'
  const isError = micState === 'error'

  const getStateStyles = () => {
    switch (micState) {
      case 'listening':
        return 'text-earth-600 dark:text-earth-400'
      case 'partial':
        return 'text-earth-500 dark:text-earth-300'
      case 'recognized':
        return 'text-moss-600 dark:text-moss-400'
      case 'processing':
        return 'text-earth-400 dark:text-earth-500'
      case 'error':
        return 'text-terra-600 dark:text-terra-400'
      default:
        return 'text-ink-400 dark:text-cream-600'
    }
  }

  return (
    <AnimatePresence>
      {shouldShow && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.8 }}
          transition={{ duration: 0.2 }}
          className="fixed top-4 left-4 z-50"
        >
          <motion.div
            className={`
              flex items-center gap-1.5 px-2 py-1.5 rounded-lg
              bg-cream-100/90 dark:bg-ink-800/90 backdrop-blur-sm
              border border-cream-200 dark:border-ink-700
              ${getStateStyles()}
            `.replace(/\s+/g, ' ').trim()}
            animate={
              micState === 'recognized'
                ? { scale: [1, 1.1, 1] }
                : micState === 'partial'
                  ? { scale: [1, 1.02, 1] }
                  : {}
            }
            transition={{ duration: 0.2 }}
          >
            {/* Mic icon */}
            <div className="relative">
              {isError ? (
                <MicOff size={20} strokeWidth={2} />
              ) : (
                <Mic size={20} strokeWidth={2} />
              )}

              {/* Pulse ring for listening state */}
              {micState === 'listening' && (
                <motion.div
                  className="absolute inset-0 rounded-full border-2 border-current"
                  animate={{
                    scale: [1, 1.5],
                    opacity: [0.6, 0]
                  }}
                  transition={{
                    duration: 1.5,
                    repeat: Infinity,
                    ease: 'easeOut'
                  }}
                />
              )}
            </div>

            {/* Audio level meter */}
            <AudioLevelMeter level={audioLevel} isActive={isActive} />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
