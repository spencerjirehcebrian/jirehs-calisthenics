/**
 * Audio Manager for Workout Cues
 *
 * Phase 11 Implementation:
 * - Uses Web Audio API for reliable, low-latency audio playback
 * - Synthesizes tones programmatically (no external files needed)
 * - Supports background audio for PWA keep-alive
 * - Respects individual audio cue settings
 */

import type { AudioSettings } from '@/types'

// ============================================================================
// Types
// ============================================================================

export type AudioCueType =
  | 'restCountdownWarning' // 10s warning during rest
  | 'restComplete' // Rest timer finished
  | 'setComplete' // Exercise set finished
  | 'holdCountdownTick' // Tick during hold countdown (3, 2, 1)
  | 'holdComplete' // Hold timer finished

// ============================================================================
// Audio Context Singleton
// ============================================================================

let audioContext: AudioContext | null = null
let isAudioUnlocked = false
let keepAliveInterval: ReturnType<typeof setInterval> | null = null

/**
 * Get or create the audio context
 * Must be called after user interaction on mobile
 */
function getAudioContext(): AudioContext | null {
  if (!audioContext) {
    try {
      audioContext = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)()
    } catch {
      console.warn('Web Audio API not supported')
      return null
    }
  }
  return audioContext
}

/**
 * Resume audio context (required after user gesture on mobile)
 */
export async function unlockAudio(): Promise<void> {
  const ctx = getAudioContext()
  if (ctx && ctx.state === 'suspended') {
    try {
      await ctx.resume()
      isAudioUnlocked = true
    } catch {
      console.warn('Failed to resume audio context')
    }
  } else if (ctx) {
    isAudioUnlocked = true
  }
}

/**
 * Check if audio is ready to play
 */
export function isAudioReady(): boolean {
  return isAudioUnlocked && audioContext?.state === 'running'
}

// ============================================================================
// Sound Synthesis
// ============================================================================

/**
 * Play a simple tone using Web Audio API
 */
function playTone(
  frequency: number,
  duration: number,
  type: OscillatorType = 'sine',
  volume: number = 0.3
): void {
  const ctx = getAudioContext()
  if (!ctx || ctx.state !== 'running') return

  const oscillator = ctx.createOscillator()
  const gainNode = ctx.createGain()

  oscillator.connect(gainNode)
  gainNode.connect(ctx.destination)

  oscillator.type = type
  oscillator.frequency.setValueAtTime(frequency, ctx.currentTime)

  // Envelope: quick attack, sustain, quick release
  gainNode.gain.setValueAtTime(0, ctx.currentTime)
  gainNode.gain.linearRampToValueAtTime(volume, ctx.currentTime + 0.01)
  gainNode.gain.setValueAtTime(volume, ctx.currentTime + duration - 0.05)
  gainNode.gain.linearRampToValueAtTime(0, ctx.currentTime + duration)

  oscillator.start(ctx.currentTime)
  oscillator.stop(ctx.currentTime + duration)
}

/**
 * Play a double beep (for warnings)
 */
function playDoubleBeep(frequency: number, volume: number = 0.3): void {
  playTone(frequency, 0.1, 'sine', volume)
  setTimeout(() => playTone(frequency, 0.1, 'sine', volume), 150)
}

/**
 * Play a rising completion chime
 */
function playCompletionChime(volume: number = 0.3): void {
  const ctx = getAudioContext()
  if (!ctx || ctx.state !== 'running') return

  // Three rising notes
  const notes = [523.25, 659.25, 783.99] // C5, E5, G5
  notes.forEach((freq, i) => {
    setTimeout(() => playTone(freq, 0.15, 'sine', volume), i * 100)
  })
}

/**
 * Play a single tick sound
 */
function playTick(volume: number = 0.4): void {
  playTone(800, 0.08, 'sine', volume)
}

// ============================================================================
// Public Audio Cue Functions
// ============================================================================

/**
 * Play a specific audio cue
 */
export function playAudioCue(cue: AudioCueType): void {
  if (!isAudioReady()) return

  switch (cue) {
    case 'restCountdownWarning':
      playDoubleBeep(660, 0.3)
      break
    case 'restComplete':
      playCompletionChime(0.4)
      break
    case 'setComplete':
      playCompletionChime(0.35)
      break
    case 'holdCountdownTick':
      playTick(0.5)
      break
    case 'holdComplete':
      playCompletionChime(0.4)
      break
  }
}

/**
 * Check if a specific audio cue should be played based on settings
 */
export function shouldPlayAudioCue(
  cue: AudioCueType,
  settings: AudioSettings
): boolean {
  switch (cue) {
    case 'restCountdownWarning':
      return settings.restCountdown
    case 'restComplete':
      return settings.restComplete
    case 'setComplete':
      return settings.setComplete
    case 'holdCountdownTick':
      return settings.holdCountdown
    case 'holdComplete':
      return settings.holdComplete
    default:
      return false
  }
}

/**
 * Play an audio cue if enabled in settings
 */
export function playAudioCueIfEnabled(
  cue: AudioCueType,
  settings: AudioSettings
): void {
  if (shouldPlayAudioCue(cue, settings)) {
    playAudioCue(cue)
  }
}

// ============================================================================
// PWA Keep-Alive Audio
// ============================================================================

/**
 * Start background audio to prevent PWA suspension
 * Plays a silent or near-silent tone periodically
 */
export function startKeepAlive(): void {
  if (keepAliveInterval) return

  const ctx = getAudioContext()
  if (!ctx) return

  // Play a very quiet, short tone every 10 seconds to keep the audio context active
  keepAliveInterval = setInterval(() => {
    if (ctx.state === 'running') {
      playTone(20, 0.01, 'sine', 0.001) // Inaudible: 20Hz at 0.1% volume
    }
  }, 10000)
}

/**
 * Stop background keep-alive audio
 */
export function stopKeepAlive(): void {
  if (keepAliveInterval) {
    clearInterval(keepAliveInterval)
    keepAliveInterval = null
  }
}

// ============================================================================
// Initialization
// ============================================================================

/**
 * Initialize audio system
 * Should be called on first user interaction
 */
export async function initAudio(): Promise<void> {
  await unlockAudio()
}

/**
 * Clean up audio resources
 */
export function cleanupAudio(): void {
  stopKeepAlive()
  if (audioContext) {
    audioContext.close()
    audioContext = null
    isAudioUnlocked = false
  }
}

// ============================================================================
// Legacy exports for backward compatibility
// ============================================================================

export type AudioCue = 'countdown' | 'complete' | 'warning' | 'tick'

export function preloadAudio(): void {
  // No-op: Web Audio API doesn't need preloading
}

export function shouldPlayCue(
  cue: AudioCue,
  audioCues: AudioSettings
): boolean {
  switch (cue) {
    case 'countdown':
      return audioCues.restCountdown || audioCues.holdCountdown
    case 'complete':
      return audioCues.restComplete || audioCues.holdComplete || audioCues.setComplete
    case 'warning':
      return audioCues.restCountdown
    case 'tick':
      return audioCues.holdCountdown
    default:
      return false
  }
}
