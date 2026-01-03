import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { Settings, AudioSettings } from '@/types'
import { safeStorage } from '@/utils/storage'

interface SettingsState extends Settings {
  setAudioCue: (cue: keyof AudioSettings, enabled: boolean) => void
  setHoldCountdown: (duration: 2 | 3) => void
  setDeloadMode: (enabled: boolean) => void
  resetSettings: () => void
}

const defaultSettings: Settings = {
  audioCues: {
    restCountdown: true,
    restComplete: true,
    setComplete: true,
    holdCountdown: true,
    holdComplete: true
  },
  holdCountdown: 3,
  deloadMode: false
}

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set) => ({
      ...defaultSettings,

      setAudioCue: (cue, enabled) =>
        set((state) => ({
          audioCues: { ...state.audioCues, [cue]: enabled }
        })),

      setHoldCountdown: (duration) =>
        set({ holdCountdown: duration }),

      setDeloadMode: (enabled) =>
        set({ deloadMode: enabled }),

      resetSettings: () =>
        set(defaultSettings)
    }),
    {
      name: 'jirehs-calisthenics-settings',
      storage: safeStorage
    }
  )
)
