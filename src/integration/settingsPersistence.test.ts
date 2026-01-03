import { describe, it, expect, beforeEach } from 'vitest'
import { useSettingsStore } from '@/stores/settingsStore'

describe('Settings Persistence Integration', () => {
  beforeEach(() => {
    // Reset settings to default
    useSettingsStore.getState().resetSettings()
  })

  describe('audio cue settings', () => {
    it('should persist audio cue changes', () => {
      // Change a setting
      useSettingsStore.getState().setAudioCue('restCountdown', false)

      // Verify it's persisted in state
      expect(useSettingsStore.getState().audioCues.restCountdown).toBe(false)

      // Change another setting
      useSettingsStore.getState().setAudioCue('holdComplete', false)
      expect(useSettingsStore.getState().audioCues.holdComplete).toBe(false)

      // Verify other settings are unchanged
      expect(useSettingsStore.getState().audioCues.restComplete).toBe(true)
      expect(useSettingsStore.getState().audioCues.setComplete).toBe(true)
    })
  })

  describe('holdCountdown settings', () => {
    it('should persist holdCountdown changes', () => {
      // Default is 3
      expect(useSettingsStore.getState().holdCountdown).toBe(3)

      // Change to 2
      useSettingsStore.getState().setHoldCountdown(2)
      expect(useSettingsStore.getState().holdCountdown).toBe(2)

      // Change back to 3
      useSettingsStore.getState().setHoldCountdown(3)
      expect(useSettingsStore.getState().holdCountdown).toBe(3)
    })
  })

  describe('deloadMode settings', () => {
    it('should persist deloadMode changes', () => {
      // Default is false
      expect(useSettingsStore.getState().deloadMode).toBe(false)

      // Enable deload mode
      useSettingsStore.getState().setDeloadMode(true)
      expect(useSettingsStore.getState().deloadMode).toBe(true)

      // Disable deload mode
      useSettingsStore.getState().setDeloadMode(false)
      expect(useSettingsStore.getState().deloadMode).toBe(false)
    })
  })

  describe('reset settings', () => {
    it('should restore all settings to defaults', () => {
      // Make several changes
      useSettingsStore.getState().setAudioCue('restCountdown', false)
      useSettingsStore.getState().setAudioCue('restComplete', false)
      useSettingsStore.getState().setHoldCountdown(2)
      useSettingsStore.getState().setDeloadMode(true)

      // Reset
      useSettingsStore.getState().resetSettings()

      // Verify all defaults
      const state = useSettingsStore.getState()
      expect(state.audioCues.restCountdown).toBe(true)
      expect(state.audioCues.restComplete).toBe(true)
      expect(state.audioCues.setComplete).toBe(true)
      expect(state.audioCues.holdCountdown).toBe(true)
      expect(state.audioCues.holdComplete).toBe(true)
      expect(state.holdCountdown).toBe(3)
      expect(state.deloadMode).toBe(false)
    })
  })
})
