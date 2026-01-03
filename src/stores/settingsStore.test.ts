import { describe, it, expect, beforeEach } from 'vitest'
import { useSettingsStore } from './settingsStore'

describe('settingsStore', () => {
  beforeEach(() => {
    useSettingsStore.getState().resetSettings()
  })

  describe('initial state (default settings)', () => {
    it('should have all audio cues enabled by default', () => {
      const { audioCues } = useSettingsStore.getState()
      expect(audioCues.restCountdown).toBe(true)
      expect(audioCues.restComplete).toBe(true)
      expect(audioCues.setComplete).toBe(true)
      expect(audioCues.holdCountdown).toBe(true)
      expect(audioCues.holdComplete).toBe(true)
    })

    it('should have holdCountdown set to 3 by default', () => {
      expect(useSettingsStore.getState().holdCountdown).toBe(3)
    })

    it('should have deloadMode disabled by default', () => {
      expect(useSettingsStore.getState().deloadMode).toBe(false)
    })
  })

  describe('setAudioCue', () => {
    it('should toggle individual audio cue settings to false', () => {
      useSettingsStore.getState().setAudioCue('restCountdown', false)
      expect(useSettingsStore.getState().audioCues.restCountdown).toBe(false)
    })

    it('should toggle individual audio cue settings to true', () => {
      useSettingsStore.getState().setAudioCue('restCountdown', false)
      useSettingsStore.getState().setAudioCue('restCountdown', true)
      expect(useSettingsStore.getState().audioCues.restCountdown).toBe(true)
    })

    it('should not affect other cue settings', () => {
      useSettingsStore.getState().setAudioCue('restCountdown', false)

      const { audioCues } = useSettingsStore.getState()
      expect(audioCues.restComplete).toBe(true)
      expect(audioCues.setComplete).toBe(true)
      expect(audioCues.holdCountdown).toBe(true)
      expect(audioCues.holdComplete).toBe(true)
    })

    it('should work with all audio cue types', () => {
      useSettingsStore.getState().setAudioCue('restComplete', false)
      useSettingsStore.getState().setAudioCue('setComplete', false)
      useSettingsStore.getState().setAudioCue('holdCountdown', false)
      useSettingsStore.getState().setAudioCue('holdComplete', false)

      const { audioCues } = useSettingsStore.getState()
      expect(audioCues.restCountdown).toBe(true) // unchanged
      expect(audioCues.restComplete).toBe(false)
      expect(audioCues.setComplete).toBe(false)
      expect(audioCues.holdCountdown).toBe(false)
      expect(audioCues.holdComplete).toBe(false)
    })
  })

  describe('setHoldCountdown', () => {
    it('should update to 2 seconds', () => {
      useSettingsStore.getState().setHoldCountdown(2)
      expect(useSettingsStore.getState().holdCountdown).toBe(2)
    })

    it('should update to 3 seconds', () => {
      useSettingsStore.getState().setHoldCountdown(2)
      useSettingsStore.getState().setHoldCountdown(3)
      expect(useSettingsStore.getState().holdCountdown).toBe(3)
    })
  })

  describe('setDeloadMode', () => {
    it('should enable deload mode', () => {
      useSettingsStore.getState().setDeloadMode(true)
      expect(useSettingsStore.getState().deloadMode).toBe(true)
    })

    it('should disable deload mode', () => {
      useSettingsStore.getState().setDeloadMode(true)
      useSettingsStore.getState().setDeloadMode(false)
      expect(useSettingsStore.getState().deloadMode).toBe(false)
    })
  })

  describe('resetSettings', () => {
    it('should restore all default settings', () => {
      // Modify all settings
      useSettingsStore.getState().setAudioCue('restCountdown', false)
      useSettingsStore.getState().setAudioCue('restComplete', false)
      useSettingsStore.getState().setHoldCountdown(2)
      useSettingsStore.getState().setDeloadMode(true)

      // Reset
      useSettingsStore.getState().resetSettings()

      // Verify defaults
      const state = useSettingsStore.getState()
      expect(state.audioCues.restCountdown).toBe(true)
      expect(state.audioCues.restComplete).toBe(true)
      expect(state.holdCountdown).toBe(3)
      expect(state.deloadMode).toBe(false)
    })
  })
})
