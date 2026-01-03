import { useSettingsStore } from '@/stores'
import type { AudioSettings } from '@/types'

const audioCueLabels: Record<keyof AudioSettings, string> = {
  restCountdown: 'Rest timer countdown (10s warning)',
  restComplete: 'Rest timer complete',
  setComplete: 'Set complete chime',
  holdCountdown: 'Hold timer countdown warning',
  holdComplete: 'Hold timer complete'
}

export function SettingsScreen() {
  const {
    audioCues,
    holdCountdown,
    deloadMode,
    setAudioCue,
    setHoldCountdown,
    setDeloadMode
  } = useSettingsStore()

  return (
    <div className="flex-1 flex flex-col p-6">
      {/* Audio Cues Section */}
      <section className="mb-8">
        <h2 className="text-xl font-bold mb-4">Audio Cues</h2>
        <div className="space-y-4">
          {(Object.keys(audioCues) as Array<keyof AudioSettings>).map((key) => (
            <label key={key} className="flex items-center justify-between touch-target">
              <span className="pr-4">{audioCueLabels[key]}</span>
              <input
                type="checkbox"
                checked={audioCues[key]}
                onChange={(e) => setAudioCue(key, e.target.checked)}
                className="w-6 h-6 accent-accent-600"
              />
            </label>
          ))}
        </div>
      </section>

      {/* Hold Countdown Section */}
      <section className="mb-8">
        <h2 className="text-xl font-bold mb-4">Hold Countdown Duration</h2>
        <p className="text-sm text-neutral-500 mb-4">
          Countdown before timed holds start
        </p>
        <div className="flex gap-4">
          <label className="flex items-center gap-2 touch-target">
            <input
              type="radio"
              checked={holdCountdown === 2}
              onChange={() => setHoldCountdown(2)}
              className="w-5 h-5 accent-accent-600"
            />
            <span>2 seconds</span>
          </label>
          <label className="flex items-center gap-2 touch-target">
            <input
              type="radio"
              checked={holdCountdown === 3}
              onChange={() => setHoldCountdown(3)}
              className="w-5 h-5 accent-accent-600"
            />
            <span>3 seconds</span>
          </label>
        </div>
      </section>

      {/* Deload Mode Section */}
      <section className="mb-8">
        <h2 className="text-xl font-bold mb-4">Deload Mode</h2>
        <label className="flex items-center justify-between touch-target">
          <div>
            <span className="block">Deload Week</span>
            <span className="text-sm text-neutral-500">Reduces sets from 3 to 2</span>
          </div>
          <input
            type="checkbox"
            checked={deloadMode}
            onChange={(e) => setDeloadMode(e.target.checked)}
            className="w-6 h-6 accent-accent-600"
          />
        </label>
      </section>

      {/* Theme info */}
      <section className="mt-auto pt-6 border-t border-neutral-200 dark:border-neutral-800">
        <p className="text-sm text-neutral-500">
          Theme follows your system preference
        </p>
      </section>
    </div>
  )
}
