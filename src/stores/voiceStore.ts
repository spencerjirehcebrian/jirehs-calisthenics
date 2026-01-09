import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { safeStorage } from '@/utils/storage'

export type MicState =
  | 'off'
  | 'listening'
  | 'partial'
  | 'recognized'
  | 'processing'
  | 'error'

export type PermissionStatus = 'prompt' | 'granted' | 'denied'

interface VoiceState {
  // Persisted settings
  enabled: boolean
  showSetupModal: boolean

  // Runtime state (not persisted)
  isSupported: boolean
  permissionStatus: PermissionStatus
  isListening: boolean
  micState: MicState
  audioLevel: number
  lastTranscript: string

  // Actions
  setEnabled: (enabled: boolean) => void
  setShowSetupModal: (show: boolean) => void
  setPermissionStatus: (status: PermissionStatus) => void
  setIsListening: (listening: boolean) => void
  setMicState: (state: MicState) => void
  setAudioLevel: (level: number) => void
  setLastTranscript: (transcript: string) => void
  checkSupport: () => void
  reset: () => void
}

const defaultPersistedState = {
  enabled: false,
  showSetupModal: true
}

const defaultRuntimeState = {
  isSupported: false,
  permissionStatus: 'prompt' as PermissionStatus,
  isListening: false,
  micState: 'off' as MicState,
  audioLevel: 0,
  lastTranscript: ''
}

export const useVoiceStore = create<VoiceState>()(
  persist(
    (set) => ({
      ...defaultPersistedState,
      ...defaultRuntimeState,

      setEnabled: (enabled) => set({ enabled }),

      setShowSetupModal: (show) => set({ showSetupModal: show }),

      setPermissionStatus: (status) => set({ permissionStatus: status }),

      setIsListening: (listening) =>
        set({
          isListening: listening,
          micState: listening ? 'listening' : 'off'
        }),

      setMicState: (state) => set({ micState: state }),

      setAudioLevel: (level) => set({ audioLevel: Math.max(0, Math.min(1, level)) }),

      setLastTranscript: (transcript) => set({ lastTranscript: transcript }),

      checkSupport: () => {
        const isSupported =
          'webkitSpeechRecognition' in window || 'SpeechRecognition' in window
        set({ isSupported })
      },

      reset: () =>
        set({
          ...defaultPersistedState,
          ...defaultRuntimeState
        })
    }),
    {
      name: 'jirehs-calisthenics-voice',
      storage: safeStorage,
      partialize: (state) => ({
        enabled: state.enabled,
        showSetupModal: state.showSetupModal
      })
    }
  )
)
