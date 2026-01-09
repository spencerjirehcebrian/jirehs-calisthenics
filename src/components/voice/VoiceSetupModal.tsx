import { useState, useCallback, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Mic, Hash, CheckCircle, SkipForward, Clock } from 'lucide-react'
import { Button } from '@/components/base/Button'
import { useVoiceStore } from '@/stores'

interface VoiceSetupModalProps {
  isOpen: boolean
  onContinue: () => void
}

interface CommandExample {
  icon: React.ReactNode
  examples: string
  description: string
}

const COMMAND_EXAMPLES: CommandExample[] = [
  {
    icon: <Hash size={18} />,
    examples: '"one", "two", "three"...',
    description: 'count reps'
  },
  {
    icon: <CheckCircle size={18} />,
    examples: '"done"',
    description: 'complete set'
  },
  {
    icon: <Mic size={18} />,
    examples: '"ready"',
    description: 'start timed hold'
  },
  {
    icon: <SkipForward size={18} />,
    examples: '"skip"',
    description: 'skip rest period'
  },
  {
    icon: <Clock size={18} />,
    examples: '"more time"',
    description: 'extend rest'
  }
]

/**
 * Modal shown at workout start to introduce voice control.
 * Allows users to enable voice, request mic permission, and dismiss permanently.
 */
export function VoiceSetupModal({ isOpen, onContinue }: VoiceSetupModalProps) {
  const {
    enabled,
    setEnabled,
    showSetupModal,
    setShowSetupModal,
    isSupported,
    permissionStatus,
    setPermissionStatus,
    checkSupport
  } = useVoiceStore()

  const [isRequestingPermission, setIsRequestingPermission] = useState(false)

  // Check browser support on mount
  useEffect(() => {
    checkSupport()
  }, [checkSupport])

  // Check existing permission status
  useEffect(() => {
    async function checkPermission() {
      try {
        const result = await navigator.permissions.query({
          name: 'microphone' as PermissionName
        })
        setPermissionStatus(
          result.state === 'granted'
            ? 'granted'
            : result.state === 'denied'
              ? 'denied'
              : 'prompt'
        )
      } catch {
        // Permissions API not supported, will prompt on first use
      }
    }
    checkPermission()
  }, [setPermissionStatus])

  const handleRequestPermission = useCallback(async () => {
    setIsRequestingPermission(true)
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      // Stop the stream immediately - we just needed to trigger the permission
      stream.getTracks().forEach((track) => track.stop())
      setPermissionStatus('granted')
    } catch (error) {
      console.warn('[Voice] Permission denied:', error)
      setPermissionStatus('denied')
    } finally {
      setIsRequestingPermission(false)
    }
  }, [setPermissionStatus])

  const handleToggleEnabled = useCallback(() => {
    const newEnabled = !enabled
    setEnabled(newEnabled)

    // If enabling and permission not granted, request it
    if (newEnabled && permissionStatus === 'prompt') {
      handleRequestPermission()
    }
  }, [enabled, setEnabled, permissionStatus, handleRequestPermission])

  const handleDontShowAgain = useCallback(
    (checked: boolean) => {
      setShowSetupModal(!checked)
    },
    [setShowSetupModal]
  )

  const handleContinue = useCallback(() => {
    onContinue()
  }, [onContinue])

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          {/* Backdrop */}
          <motion.div
            className="absolute inset-0 bg-ink-900/60 dark:bg-ink-950/80"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          />

          {/* Dialog */}
          <motion.div
            className="relative bg-cream-50 dark:bg-ink-800 rounded-2xl shadow-xl max-w-md w-full p-6 max-h-[90vh] overflow-y-auto"
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          >
            {/* Header */}
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-lg bg-earth-100 dark:bg-earth-900/30 flex items-center justify-center">
                <Mic className="text-earth-600 dark:text-earth-400" size={24} />
              </div>
              <h2 className="font-display font-semibold text-display-sm text-ink-900 dark:text-cream-100">
                Voice Control
              </h2>
            </div>

            {/* Browser support check */}
            {!isSupported ? (
              <div className="bg-terra-50 dark:bg-terra-900/20 border border-terra-200 dark:border-terra-800 rounded-lg p-4 mb-4">
                <p className="text-body-sm text-terra-700 dark:text-terra-300">
                  Voice commands are not available in your browser. Try Chrome or
                  Safari for voice control.
                </p>
              </div>
            ) : (
              <>
                {/* Introduction */}
                <p className="text-body-sm text-ink-600 dark:text-cream-400 mb-4">
                  Control your workout hands-free with voice commands:
                </p>

                {/* Command examples */}
                <div className="space-y-2 mb-6">
                  {COMMAND_EXAMPLES.map((example, index) => (
                    <div
                      key={index}
                      className="flex items-center gap-3 text-body-sm"
                    >
                      <span className="text-earth-600 dark:text-earth-400">
                        {example.icon}
                      </span>
                      <span className="text-ink-700 dark:text-cream-300 font-medium">
                        {example.examples}
                      </span>
                      <span className="text-ink-500 dark:text-cream-500">
                        - {example.description}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Enable toggle */}
                <label className="flex items-center gap-3 p-3 rounded-lg bg-cream-100 dark:bg-ink-700 cursor-pointer mb-4">
                  <input
                    type="checkbox"
                    checked={enabled}
                    onChange={handleToggleEnabled}
                    className="w-5 h-5 rounded border-cream-300 dark:border-ink-600 text-earth-600 focus:ring-earth-500"
                  />
                  <span className="text-body-sm font-medium text-ink-800 dark:text-cream-200">
                    Enable voice control
                  </span>
                </label>

                {/* Permission status */}
                {enabled && permissionStatus === 'denied' && (
                  <div className="bg-terra-50 dark:bg-terra-900/20 border border-terra-200 dark:border-terra-800 rounded-lg p-3 mb-4">
                    <p className="text-body-xs text-terra-700 dark:text-terra-300">
                      Microphone access denied. Enable microphone in your browser
                      settings to use voice control.
                    </p>
                  </div>
                )}

                {enabled && permissionStatus === 'prompt' && (
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={handleRequestPermission}
                    disabled={isRequestingPermission}
                    fullWidth
                    className="mb-4"
                  >
                    {isRequestingPermission
                      ? 'Requesting...'
                      : 'Request Microphone Permission'}
                  </Button>
                )}

                {enabled && permissionStatus === 'granted' && (
                  <div className="flex items-center gap-2 text-moss-600 dark:text-moss-400 text-body-xs mb-4">
                    <CheckCircle size={16} />
                    <span>Microphone access granted</span>
                  </div>
                )}
              </>
            )}

            {/* Don't show again */}
            <label className="flex items-center gap-2 mb-6 cursor-pointer">
              <input
                type="checkbox"
                checked={!showSetupModal}
                onChange={(e) => handleDontShowAgain(e.target.checked)}
                className="w-4 h-4 rounded border-cream-300 dark:border-ink-600 text-earth-600 focus:ring-earth-500"
              />
              <span className="text-body-xs text-ink-500 dark:text-cream-500">
                Don't show this again
              </span>
            </label>

            {/* Continue button */}
            <Button variant="primary" size="lg" onClick={handleContinue} fullWidth>
              Continue to Workout
            </Button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
