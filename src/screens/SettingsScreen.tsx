import { useSettingsStore, useNavigationStore, useVoiceStore } from '@/stores'
import { motion, type Variants } from 'framer-motion'
import { Volume2, Clock, Dumbbell, Moon, ArrowLeft, Mic, AlertCircle } from 'lucide-react'
import type { AudioSettings } from '@/types'

const easeOutExpo = [0.16, 1, 0.3, 1] as const

const audioCueLabels: Record<keyof AudioSettings, string> = {
  restCountdown: 'Rest timer countdown (10s warning)',
  restComplete: 'Rest timer complete',
  setComplete: 'Set complete chime',
  holdCountdown: 'Hold timer countdown warning',
  holdComplete: 'Hold timer complete'
}

export function SettingsScreen() {
  const navigate = useNavigationStore((state) => state.navigate)
  const {
    audioCues,
    holdCountdown,
    deloadMode,
    setAudioCue,
    setHoldCountdown,
    setDeloadMode
  } = useSettingsStore()
  const {
    enabled: voiceEnabled,
    setEnabled: setVoiceEnabled,
    showSetupModal,
    setShowSetupModal,
    isSupported: voiceSupported,
    permissionStatus
  } = useVoiceStore()

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1, delayChildren: 0.1 }
    }
  }

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: easeOutExpo } }
  }

  return (
    <motion.div
      className="flex-1 flex flex-col p-6 bg-cream-100 dark:bg-ink-950 bg-grain overflow-y-auto"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Back button */}
      <motion.button
        onClick={() => navigate('home')}
        className="flex items-center gap-2 text-ink-600 dark:text-cream-400 hover:text-ink-900 dark:hover:text-cream-100 transition-colors mb-6 touch-target focus-interactive rounded-lg w-fit"
        aria-label="Go back"
        whileHover={{ x: -4 }}
        whileTap={{ scale: 0.95 }}
        initial={{ opacity: 0, x: -10 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.3 }}
      >
        <ArrowLeft className="w-5 h-5" />
      </motion.button>

      {/* Title */}
      <motion.h1
        className="font-display font-semibold text-display-lg text-ink-900 dark:text-cream-100 mb-8"
        variants={itemVariants}
      >
        SETTINGS
      </motion.h1>

      {/* Audio Cues Section */}
      <motion.section className="mb-8" variants={itemVariants}>
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 rounded-lg bg-earth-100 dark:bg-ink-800">
            <Volume2 size={20} className="text-earth-600 dark:text-earth-400" />
          </div>
          <h2 className="font-display font-semibold text-display-md text-ink-900 dark:text-cream-100">
            AUDIO CUES
          </h2>
        </div>
        <div className="space-y-3">
          {(Object.keys(audioCues) as Array<keyof AudioSettings>).map((key) => (
            <label
              key={key}
              className="flex items-center justify-between p-4 rounded-xl bg-cream-50 dark:bg-ink-800 border border-cream-300/60 dark:border-ink-700 touch-target cursor-pointer hover:bg-cream-100 dark:hover:bg-ink-700 transition-colors"
            >
              <span className="text-body-md text-ink-700 dark:text-cream-300 pr-4">
                {audioCueLabels[key]}
              </span>
              <div className="relative">
                <input
                  type="checkbox"
                  checked={audioCues[key]}
                  onChange={(e) => setAudioCue(key, e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-12 h-7 bg-cream-300 dark:bg-ink-600 rounded-full peer-checked:bg-earth-500 dark:peer-checked:bg-earth-500 transition-colors" />
                <div className="absolute left-1 top-1 w-5 h-5 bg-white dark:bg-cream-100 rounded-full shadow-sm transition-transform peer-checked:translate-x-5" />
              </div>
            </label>
          ))}
        </div>
      </motion.section>

      {/* Hold Countdown Section */}
      <motion.section className="mb-8" variants={itemVariants}>
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 rounded-lg bg-earth-100 dark:bg-ink-800">
            <Clock size={20} className="text-earth-600 dark:text-earth-400" />
          </div>
          <div>
            <h2 className="font-display font-semibold text-display-md text-ink-900 dark:text-cream-100">
              HOLD COUNTDOWN
            </h2>
            <p className="text-body-sm text-ink-500 dark:text-cream-400">
              Countdown before timed holds start
            </p>
          </div>
        </div>
        <div className="flex gap-3">
          <label
            className={`flex-1 p-4 rounded-xl border-2 text-center cursor-pointer transition-all touch-target ${
              holdCountdown === 2
                ? 'bg-earth-500 border-earth-600 text-white'
                : 'bg-cream-50 dark:bg-ink-800 border-cream-300/60 dark:border-ink-700 text-ink-700 dark:text-cream-300 hover:border-earth-400'
            }`}
          >
            <input
              type="radio"
              checked={holdCountdown === 2}
              onChange={() => setHoldCountdown(2)}
              className="sr-only"
            />
            <span className="font-display font-bold text-display-md">2</span>
            <span className="block text-body-sm mt-1 opacity-80">seconds</span>
          </label>
          <label
            className={`flex-1 p-4 rounded-xl border-2 text-center cursor-pointer transition-all touch-target ${
              holdCountdown === 3
                ? 'bg-earth-500 border-earth-600 text-white'
                : 'bg-cream-50 dark:bg-ink-800 border-cream-300/60 dark:border-ink-700 text-ink-700 dark:text-cream-300 hover:border-earth-400'
            }`}
          >
            <input
              type="radio"
              checked={holdCountdown === 3}
              onChange={() => setHoldCountdown(3)}
              className="sr-only"
            />
            <span className="font-display font-bold text-display-md">3</span>
            <span className="block text-body-sm mt-1 opacity-80">seconds</span>
          </label>
        </div>
      </motion.section>

      {/* Deload Mode Section */}
      <motion.section className="mb-8" variants={itemVariants}>
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 rounded-lg bg-earth-100 dark:bg-ink-800">
            <Dumbbell size={20} className="text-earth-600 dark:text-earth-400" />
          </div>
          <h2 className="font-display font-semibold text-display-md text-ink-900 dark:text-cream-100">
            DELOAD MODE
          </h2>
        </div>
        <label className="flex items-center justify-between p-4 rounded-xl bg-cream-50 dark:bg-ink-800 border border-cream-300/60 dark:border-ink-700 touch-target cursor-pointer hover:bg-cream-100 dark:hover:bg-ink-700 transition-colors">
          <div>
            <span className="block text-body-md font-medium text-ink-800 dark:text-cream-100">
              Deload Week
            </span>
            <span className="text-body-sm text-ink-500 dark:text-cream-400">
              Reduces sets from 3 to 2
            </span>
          </div>
          <div className="relative">
            <input
              type="checkbox"
              checked={deloadMode}
              onChange={(e) => setDeloadMode(e.target.checked)}
              className="sr-only peer"
            />
            <div className="w-12 h-7 bg-cream-300 dark:bg-ink-600 rounded-full peer-checked:bg-earth-500 dark:peer-checked:bg-earth-500 transition-colors" />
            <div className="absolute left-1 top-1 w-5 h-5 bg-white dark:bg-cream-100 rounded-full shadow-sm transition-transform peer-checked:translate-x-5" />
          </div>
        </label>
      </motion.section>

      {/* Voice Control Section */}
      <motion.section className="mb-8" variants={itemVariants}>
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 rounded-lg bg-earth-100 dark:bg-ink-800">
            <Mic size={20} className="text-earth-600 dark:text-earth-400" />
          </div>
          <h2 className="font-display font-semibold text-display-md text-ink-900 dark:text-cream-100">
            VOICE CONTROL
          </h2>
        </div>

        {/* Not supported warning */}
        {!voiceSupported && (
          <div className="flex items-start gap-3 p-4 rounded-xl bg-terra-50 dark:bg-terra-900/20 border border-terra-200 dark:border-terra-800 mb-3">
            <AlertCircle size={20} className="text-terra-600 dark:text-terra-400 flex-shrink-0 mt-0.5" />
            <div>
              <span className="block text-body-md font-medium text-terra-700 dark:text-terra-300">
                Voice commands not available
              </span>
              <span className="text-body-sm text-terra-600 dark:text-terra-400">
                Your browser doesn't support speech recognition. Try Chrome or Safari.
              </span>
            </div>
          </div>
        )}

        {/* Permission denied warning */}
        {voiceSupported && permissionStatus === 'denied' && (
          <div className="flex items-start gap-3 p-4 rounded-xl bg-terra-50 dark:bg-terra-900/20 border border-terra-200 dark:border-terra-800 mb-3">
            <AlertCircle size={20} className="text-terra-600 dark:text-terra-400 flex-shrink-0 mt-0.5" />
            <div>
              <span className="block text-body-md font-medium text-terra-700 dark:text-terra-300">
                Microphone access denied
              </span>
              <span className="text-body-sm text-terra-600 dark:text-terra-400">
                Enable microphone in your browser settings to use voice control.
              </span>
            </div>
          </div>
        )}

        <div className="space-y-3">
          {/* Enable voice toggle */}
          <label
            className={`flex items-center justify-between p-4 rounded-xl bg-cream-50 dark:bg-ink-800 border border-cream-300/60 dark:border-ink-700 touch-target transition-colors ${
              voiceSupported && permissionStatus !== 'denied'
                ? 'cursor-pointer hover:bg-cream-100 dark:hover:bg-ink-700'
                : 'opacity-50 cursor-not-allowed'
            }`}
          >
            <div>
              <span className="block text-body-md font-medium text-ink-800 dark:text-cream-100">
                Enable voice commands
              </span>
              <span className="text-body-sm text-ink-500 dark:text-cream-400">
                Control workouts hands-free with voice
              </span>
            </div>
            <div className="relative">
              <input
                type="checkbox"
                checked={voiceEnabled}
                onChange={(e) => setVoiceEnabled(e.target.checked)}
                disabled={!voiceSupported || permissionStatus === 'denied'}
                className="sr-only peer"
              />
              <div className="w-12 h-7 bg-cream-300 dark:bg-ink-600 rounded-full peer-checked:bg-earth-500 dark:peer-checked:bg-earth-500 transition-colors peer-disabled:opacity-50" />
              <div className="absolute left-1 top-1 w-5 h-5 bg-white dark:bg-cream-100 rounded-full shadow-sm transition-transform peer-checked:translate-x-5" />
            </div>
          </label>

          {/* Show setup modal toggle */}
          <label
            className={`flex items-center justify-between p-4 rounded-xl bg-cream-50 dark:bg-ink-800 border border-cream-300/60 dark:border-ink-700 touch-target transition-colors ${
              voiceSupported
                ? 'cursor-pointer hover:bg-cream-100 dark:hover:bg-ink-700'
                : 'opacity-50 cursor-not-allowed'
            }`}
          >
            <span className="text-body-md text-ink-700 dark:text-cream-300 pr-4">
              Show voice setup when starting workout
            </span>
            <div className="relative">
              <input
                type="checkbox"
                checked={showSetupModal}
                onChange={(e) => setShowSetupModal(e.target.checked)}
                disabled={!voiceSupported}
                className="sr-only peer"
              />
              <div className="w-12 h-7 bg-cream-300 dark:bg-ink-600 rounded-full peer-checked:bg-earth-500 dark:peer-checked:bg-earth-500 transition-colors peer-disabled:opacity-50" />
              <div className="absolute left-1 top-1 w-5 h-5 bg-white dark:bg-cream-100 rounded-full shadow-sm transition-transform peer-checked:translate-x-5" />
            </div>
          </label>
        </div>
      </motion.section>

      {/* Theme info */}
      <motion.section
        className="mt-auto pt-6 border-t border-cream-300/60 dark:border-ink-700"
        variants={itemVariants}
      >
        <div className="flex items-center gap-3 text-ink-500 dark:text-cream-400">
          <Moon size={16} />
          <p className="text-body-sm">
            Theme follows your system preference
          </p>
        </div>
      </motion.section>
    </motion.div>
  )
}
