# Voice Control Feature Specification

This document specifies the hands-free voice control feature for the calisthenics workout app.

---

## Overview

Voice control is a **secondary, additive** input method that allows users to control the app without touching the screen during workouts. All existing touch and keyboard interactions remain fully functional - voice is purely an optional overlay.

### Key Principles

- Voice activates **automatically during exercise phases** (warmup, strength, cooldown)
- Voice is **disabled during navigation** and non-workout screens
- Touch UI remains **completely unchanged** - voice is invisible to users who don't enable it
- **English only** for simplicity and reliability
- Uses **Web Speech API** (free, no external services)

---

## Technical Architecture

### Speech Recognition Engine

**Implementation:** Web Speech API (`webkitSpeechRecognition` / `SpeechRecognition`)

**Characteristics:**
- Free, no API keys required
- Works offline on Chrome and Safari
- May not work on Firefox or older browsers
- Continuous recognition mode for responsive hands-free operation

**Browser Compatibility:**
- Chrome: Full support (desktop and mobile)
- Safari: Full support (desktop and iOS)
- Edge: Full support
- Firefox: Limited/no support (show disabled state)

### Recognition Configuration

```typescript
interface VoiceRecognitionConfig {
  continuous: true           // Keep listening between commands
  interimResults: true       // Enable partial recognition feedback
  lang: 'en-US'              // English only
  maxAlternatives: 3         // Multiple interpretations for matching
}
```

### Lifecycle Management

**Auto-activation:**
- Voice recognition starts when entering exercise phase (warmup, strength, cooldown)
- Voice recognition stops when exiting to navigation screens (home, selection, summary)

**Background Handling:**
- Auto-pause recognition when app loses focus (backgrounded, screen locked)
- Auto-resume recognition when app regains focus
- This prevents resource drain and handles Web Speech API instability in background

**Error Recovery:**
- On recognition error or disconnect: silent fallback to touch-only
- Mic indicator disappears to signal voice is unavailable
- No interrupting error messages during workout
- Console logging for debugging (`console.warn` level)

---

## Command Vocabulary

### Rep Counting (RepCounter Component)

| Command | Aliases | Action |
|---------|---------|--------|
| Number words | "one", "two", "three" ... "twenty" | Set rep count to that number (absolute) |
| Done | "done", "finished", "complete" | Complete current set, start rest |
| Undo | "undo", "minus one", "minus", "back" | Decrement rep count by 1 |

**Number Behavior:** Saying a number **sets the count to that value** (absolute), not sequential. If at rep 5 and user says "seven", count becomes 7.

**Undo Behavior:** Works **anytime** during the set, no time window restriction.

### Timed Holds (TimedHold Component)

| Command | Aliases | Action |
|---------|---------|--------|
| Ready | "ready", "start", "go", "begin" | Start the countdown timer |
| Stop | "stop", "cancel", "abort" | Abort the hold mid-exercise |

**False Trigger Policy:** Accept occasional false triggers as acceptable UX friction. If timer starts accidentally, user can abort with "stop" or let it complete. Keeping simple single-word triggers prioritizes ease of use.

### Rest Periods (RestTimer Component)

| Command | Aliases | Action |
|---------|---------|--------|
| Skip | "skip", "ready", "done", "next" | End rest immediately, continue to next exercise |
| More time | "more time", "extend", "wait" | Add 30 seconds to rest timer |

**Rest Extension:** Each "more time" command adds **30 seconds**. No maximum cap - users can extend indefinitely if needed.

### Guided Movements (GuidedMovementStep - Warmup/Cooldown)

| Command | Aliases | Action |
|---------|---------|--------|
| Done | "done", "finished", "complete" | Complete current movement, advance to next |
| Skip | "skip", "next" | Skip current movement without completion (like hold-to-skip) |

**Behavior Difference:**
- "Done" marks the movement as completed in session tracking
- "Skip" bypasses the movement (matches existing hold-to-skip behavior)

### Commands NOT Supported

- **Navigation commands** ("next exercise", "back", "exit") - too risky for accidental triggers
- **Confirmation dialogs** - always require touch to prevent accidental workout exit
- **Status queries** ("how many reps", "what's next") - adds complexity, minimal value

---

## User Interface

### Floating Mic Indicator

**Position:** Top-left corner of screen (avoids conflict with session timer in bottom-right)

**Size:** 40x40px touch target, 24px icon

**Styling:** Uses `earth-*` color palette to match app theme

**States:**

| State | Visual | Description |
|-------|--------|-------------|
| Off | Gray icon, no animation | Voice disabled or not in exercise phase |
| Listening | Earth-colored icon with audio level visualization | Actively listening for commands |
| Heard Something | Brief pulse animation | Partial speech detected, processing |
| Command Recognized | Quick flash/scale animation | Command successfully matched and executed |
| Processing | Subtle loading indicator | Brief state between hearing and matching |
| Error | Red tint, then fades to off | Recognition failed, falling back to touch |

**Audio Level Visualization:** Small waveform or level meter showing ambient sound being picked up. Provides visual feedback that the mic is alive and hearing something.

### Workout Start Modal

**Trigger:** Appears every time a workout starts, until user checks "Don't show again"

**Content:**
```
Voice Control

Control your workout hands-free with voice commands:

[Icon] "one", "two", "three"... - count reps
[Icon] "done" - complete set
[Icon] "ready" - start timed hold
[Icon] "skip" - skip rest period
[Icon] "more time" - extend rest

[ ] Enable voice control

[Request Microphone Permission button - if not granted]
[Permission status indicator - granted/denied]

[ ] Don't show this again

[Continue to Workout]
```

**Behavior:**
- Toggle enables/disables voice for this and future workouts (persisted to settings)
- Permission button triggers browser mic permission prompt
- Shows permission status (granted, denied, or prompt needed)
- "Don't show again" persists preference, modal stops appearing
- Can re-enable modal from Settings screen

### Settings Screen

**Voice Control Section:**

```
Voice Control
  [Toggle] Enable voice commands

  [If browser doesn't support Web Speech API:]
  Voice commands not available
  Your browser doesn't support speech recognition.
  Try Chrome or Safari for voice control.

  [If mic permission denied:]
  Microphone access denied
  Enable microphone in browser settings to use voice.

  [Checkbox] Show voice setup when starting workout
```

**Disabled States:**
- If Web Speech API unavailable: toggle is disabled, shows explanation
- If mic permission denied: toggle is disabled, shows how to fix
- Reason is always shown so users understand why feature is unavailable

---

## State Management

### New Store: `voiceStore`

```typescript
interface VoiceState {
  // Settings (persisted)
  enabled: boolean                    // User preference for voice control
  showSetupModal: boolean             // Show modal on workout start

  // Runtime state (not persisted)
  isSupported: boolean                // Browser supports Web Speech API
  permissionStatus: 'prompt' | 'granted' | 'denied'
  isListening: boolean                // Currently listening for commands
  micState: 'off' | 'listening' | 'partial' | 'recognized' | 'processing' | 'error'
  audioLevel: number                  // 0-1 for visualization
  lastTranscript: string              // For debugging

  // Actions
  setEnabled: (enabled: boolean) => void
  setShowSetupModal: (show: boolean) => void
  startListening: () => void
  stopListening: () => void
  setMicState: (state: MicState) => void
  setAudioLevel: (level: number) => void
}
```

**Persistence:** Only `enabled` and `showSetupModal` are persisted to localStorage.

### Integration Points

**workoutSessionStore:**
- No changes needed - voice commands call existing actions (`incrementReps`, `completeSet`, `startRest`, etc.)

**settingsStore:**
- Voice settings could live here or in separate `voiceStore` - separate store preferred for modularity

---

## Implementation Components

### Core Hook: `useVoiceRecognition`

```typescript
interface UseVoiceRecognitionOptions {
  onCommand: (command: VoiceCommand) => void
  onPartialResult: (transcript: string) => void
  onAudioLevel: (level: number) => void
  onError: (error: Error) => void
}

interface VoiceCommand {
  type: 'number' | 'done' | 'undo' | 'ready' | 'stop' | 'skip' | 'extend'
  value?: number  // For number commands
  confidence: number
  transcript: string
}
```

**Responsibilities:**
- Initialize Web Speech API
- Handle continuous recognition
- Parse transcripts into commands
- Calculate audio levels from audio stream
- Handle errors gracefully

### Component: `VoiceMicIndicator`

Floating mic icon with state visualization.

**Props:**
```typescript
interface VoiceMicIndicatorProps {
  // No props needed - reads from voiceStore
}
```

**Behavior:**
- Renders in top-left corner via portal or fixed positioning
- Shows appropriate state from `voiceStore.micState`
- Displays audio level visualization when listening
- Click/tap opens voice settings or re-requests permission

### Component: `VoiceSetupModal`

Modal shown at workout start.

**Props:**
```typescript
interface VoiceSetupModalProps {
  onContinue: () => void
}
```

### Higher-Order Component: `withVoiceCommands`

Wrapper that adds voice command handling to exercise components.

```typescript
function withVoiceCommands<P>(
  Component: React.ComponentType<P>,
  commandHandlers: CommandHandlers
): React.ComponentType<P>
```

**Usage:**
```typescript
const VoiceEnabledRepCounter = withVoiceCommands(RepCounter, {
  number: (n) => incrementReps(n),
  done: () => completeSet(),
  undo: () => decrementReps(),
})
```

---

## Command Parsing

### Transcript Matching

**Number Recognition:**
```typescript
const NUMBER_WORDS: Record<string, number> = {
  'one': 1, 'two': 2, 'three': 3, 'four': 4, 'five': 5,
  'six': 6, 'seven': 7, 'eight': 8, 'nine': 9, 'ten': 10,
  'eleven': 11, 'twelve': 12, 'thirteen': 13, 'fourteen': 14, 'fifteen': 15,
  'sixteen': 16, 'seventeen': 17, 'eighteen': 18, 'nineteen': 19, 'twenty': 20,
  // Also match digits
  '1': 1, '2': 2, '3': 3, /* ... */ '20': 20,
}
```

**Fuzzy Matching:**
- Lowercase all transcripts before matching
- Handle common mishearings: "won" -> "one", "to" -> "two", "for" -> "four"
- Match against all aliases for each command

**Confidence Threshold:**
- Accept commands with confidence >= 0.5
- Log low-confidence matches for debugging
- Hybrid approach: act on likely match, allow correction

### Recognition Latency

**Optimistic Updates:**
- For rep counting: increment immediately on partial match
- If subsequent full recognition differs: no action (count already updated)
- "Undo" command available for corrections

**Processing Time:**
- Typical: 300-800ms from speech to command execution
- Partial results provide faster feedback (interim transcripts)

---

## Error Handling

### Browser Not Supported

**Detection:**
```typescript
const isSupported = 'webkitSpeechRecognition' in window || 'SpeechRecognition' in window
```

**Behavior:**
- `voiceStore.isSupported = false`
- Settings toggle disabled with explanation
- Voice setup modal not shown
- No voice-related UI appears in workout

### Microphone Permission Denied

**Detection:** Check `navigator.permissions.query({ name: 'microphone' })`

**Behavior:**
- `voiceStore.permissionStatus = 'denied'`
- Settings toggle disabled with explanation
- Show instructions to enable in browser settings

### Runtime Recognition Failure

**Scenarios:**
- Network error (some browsers require internet)
- Audio input device disconnected
- Recognition service timeout

**Behavior:**
- Log error to console: `console.warn('Voice recognition error:', error)`
- Set `voiceStore.micState = 'error'` briefly
- Transition to `voiceStore.isListening = false`
- Mic indicator disappears or shows "off" state
- **No interrupting notifications** - workout continues with touch input
- Can attempt to restart recognition on next exercise transition

---

## Audio Conflict Handling

**Current State:** Deferred - implement special handling only if problems arise in practice.

**Potential Future Solutions:**
- Pause recognition briefly during audio cue playback
- Duck (lower volume) audio cues when voice is active
- Queue recognized commands during audio playback

---

## Files to Create/Modify

### New Files

| File | Purpose |
|------|---------|
| `src/stores/voiceStore.ts` | Voice state management |
| `src/hooks/useVoiceRecognition.ts` | Web Speech API wrapper |
| `src/hooks/useVoiceCommands.ts` | Command parsing and dispatching |
| `src/components/voice/VoiceMicIndicator.tsx` | Floating mic UI |
| `src/components/voice/VoiceSetupModal.tsx` | Workout start modal |
| `src/components/voice/AudioLevelMeter.tsx` | Waveform visualization |
| `src/utils/voiceCommands.ts` | Command vocabulary and matching |

### Modified Files

| File | Changes |
|------|---------|
| `src/screens/ActiveWorkoutScreen.tsx` | Integrate voice commands |
| `src/screens/WarmupScreen.tsx` | Integrate voice commands |
| `src/screens/CooldownScreen.tsx` | Integrate voice commands |
| `src/screens/SettingsScreen.tsx` | Add voice settings section |
| `src/components/interactions/RepCounter.tsx` | Accept voice-triggered updates |
| `src/components/interactions/TimedHold.tsx` | Accept voice start/stop |
| `src/components/interactions/RestTimer.tsx` | Accept voice skip/extend |
| `src/components/interactions/GuidedMovementStep.tsx` | Accept voice done/skip |
| `src/App.tsx` | Render VoiceMicIndicator globally |

---

## Testing Strategy

### Manual Testing

- Test on Chrome (desktop), Chrome (Android), Safari (macOS), Safari (iOS)
- Test with background noise (music, fan, etc.)
- Test with heavy breathing during exercise
- Test permission grant/deny flows
- Test backgrounding app mid-workout

### Automated Testing

**Unit Tests:**
- Command parsing/matching functions
- Voice store state transitions
- Number word recognition

**Integration Tests:**
- Mock `SpeechRecognition` API
- Verify command dispatch to workout store
- Verify UI state updates

### Debug Logging

**Console Output (development only):**
```
[Voice] Recognition started
[Voice] Interim: "seven"
[Voice] Final: "seven" (confidence: 0.92)
[Voice] Command: number(7)
[Voice] Recognition paused (app backgrounded)
[Voice] Recognition resumed
[Voice] Error: network - falling back to touch
```

---

## Future Considerations

### Not in Initial Scope

- **Multi-language support** - would require translated command vocabularies
- **Custom wake word** - Web Speech API doesn't support this natively
- **Voice feedback** (text-to-speech) - reading rep counts aloud
- **Offline cloud fallback** - only Web Speech API for now
- **Voice navigation** - too risky for accidental triggers

### Potential Enhancements

- Audio conflict handling if issues arise
- Sensitivity/threshold settings if false positives are problematic
- Per-phase voice enable/disable if users want granular control
- Voice-triggered rest duration presets ("thirty seconds", "one minute")

---

## Summary

This voice feature provides a lightweight, hands-free input method using the browser's built-in Web Speech API. It activates automatically during exercise phases, supports natural voice commands for rep counting and exercise control, and falls back silently to touch input when voice is unavailable or fails. The implementation is fully additive - the existing touch UI remains completely unchanged for users who don't enable voice.
