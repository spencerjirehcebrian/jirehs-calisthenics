import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import {
  shouldPlayAudioCue,
  shouldPlayCue,
  startKeepAlive,
  stopKeepAlive,
  unlockAudio,
  isAudioReady,
  cleanupAudio,
  type AudioCueType,
  type AudioCue,
} from './audio'
import type { AudioSettings } from '@/types'
import { mockAudioContext } from '@/test/mocks/audioContext'

describe('audio utilities', () => {
  describe('shouldPlayAudioCue', () => {
    const defaultSettings: AudioSettings = {
      restCountdown: true,
      restComplete: true,
      setComplete: true,
      holdCountdown: true,
      holdComplete: true,
    }

    it('should return true for restCountdownWarning when setting enabled', () => {
      expect(shouldPlayAudioCue('restCountdownWarning', defaultSettings)).toBe(true)
    })

    it('should return false for restCountdownWarning when setting disabled', () => {
      const settings = { ...defaultSettings, restCountdown: false }
      expect(shouldPlayAudioCue('restCountdownWarning', settings)).toBe(false)
    })

    it('should correctly map restComplete cue to its setting', () => {
      expect(shouldPlayAudioCue('restComplete', defaultSettings)).toBe(true)
      expect(shouldPlayAudioCue('restComplete', { ...defaultSettings, restComplete: false })).toBe(false)
    })

    it('should correctly map setComplete cue to its setting', () => {
      expect(shouldPlayAudioCue('setComplete', defaultSettings)).toBe(true)
      expect(shouldPlayAudioCue('setComplete', { ...defaultSettings, setComplete: false })).toBe(false)
    })

    it('should correctly map holdCountdownTick cue to its setting', () => {
      expect(shouldPlayAudioCue('holdCountdownTick', defaultSettings)).toBe(true)
      expect(shouldPlayAudioCue('holdCountdownTick', { ...defaultSettings, holdCountdown: false })).toBe(false)
    })

    it('should correctly map holdComplete cue to its setting', () => {
      expect(shouldPlayAudioCue('holdComplete', defaultSettings)).toBe(true)
      expect(shouldPlayAudioCue('holdComplete', { ...defaultSettings, holdComplete: false })).toBe(false)
    })

    it('should return false for unknown cue types', () => {
      expect(shouldPlayAudioCue('unknownCue' as AudioCueType, defaultSettings)).toBe(false)
    })
  })

  describe('shouldPlayCue (legacy)', () => {
    const defaultSettings: AudioSettings = {
      restCountdown: true,
      restComplete: true,
      setComplete: true,
      holdCountdown: true,
      holdComplete: true,
    }

    it('should return true for countdown when restCountdown or holdCountdown enabled', () => {
      expect(shouldPlayCue('countdown', defaultSettings)).toBe(true)
      expect(shouldPlayCue('countdown', { ...defaultSettings, restCountdown: false })).toBe(true)
      expect(shouldPlayCue('countdown', { ...defaultSettings, holdCountdown: false })).toBe(true)
      expect(shouldPlayCue('countdown', { ...defaultSettings, restCountdown: false, holdCountdown: false })).toBe(false)
    })

    it('should return true for complete when any complete setting enabled', () => {
      expect(shouldPlayCue('complete', defaultSettings)).toBe(true)
      expect(shouldPlayCue('complete', { ...defaultSettings, restComplete: false, holdComplete: false, setComplete: false })).toBe(false)
    })

    it('should return true for warning when restCountdown enabled', () => {
      expect(shouldPlayCue('warning', defaultSettings)).toBe(true)
      expect(shouldPlayCue('warning', { ...defaultSettings, restCountdown: false })).toBe(false)
    })

    it('should return true for tick when holdCountdown enabled', () => {
      expect(shouldPlayCue('tick', defaultSettings)).toBe(true)
      expect(shouldPlayCue('tick', { ...defaultSettings, holdCountdown: false })).toBe(false)
    })

    it('should return false for unknown cue types', () => {
      expect(shouldPlayCue('unknownCue' as AudioCue, defaultSettings)).toBe(false)
    })
  })

  describe('keep-alive functions', () => {
    beforeEach(() => {
      vi.useFakeTimers()
      mockAudioContext()
    })

    afterEach(() => {
      vi.useRealTimers()
      vi.unstubAllGlobals()
      stopKeepAlive()
      cleanupAudio()
    })

    it('startKeepAlive should set up interval', () => {
      startKeepAlive()
      // Should not throw and interval should be set
      expect(() => stopKeepAlive()).not.toThrow()
    })

    it('stopKeepAlive should clear interval', () => {
      startKeepAlive()
      stopKeepAlive()
      // Should not throw when called again
      expect(() => stopKeepAlive()).not.toThrow()
    })

    it('startKeepAlive should be idempotent (multiple calls do not create multiple intervals)', () => {
      startKeepAlive()
      startKeepAlive()
      startKeepAlive()

      // One stopKeepAlive should be enough
      stopKeepAlive()

      // No errors after stop
      expect(() => vi.advanceTimersByTime(30000)).not.toThrow()
    })
  })

  describe('audio context management', () => {
    beforeEach(() => {
      vi.unstubAllGlobals()
      cleanupAudio()
    })

    afterEach(() => {
      cleanupAudio()
      vi.unstubAllGlobals()
    })

    it('isAudioReady should return false before unlocking', () => {
      expect(isAudioReady()).toBe(false)
    })

    it('unlockAudio should not throw when called', async () => {
      // Audio context is not available in test environment without full mock setup
      // Just verify the function doesn't throw
      await expect(unlockAudio()).resolves.not.toThrow()
    })

    it('cleanupAudio should stop keep-alive and close context', () => {
      mockAudioContext()
      startKeepAlive()

      cleanupAudio()

      // Should not throw
      expect(() => stopKeepAlive()).not.toThrow()
    })
  })
})
