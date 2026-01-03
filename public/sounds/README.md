# Audio Implementation

This directory is reserved for custom audio files if you prefer to replace the default synthesized sounds.

## Current Implementation

The app uses **Web Audio API** to synthesize all audio cues programmatically. No external audio files are required. This approach provides:

- Zero additional asset downloads
- Instant playback without loading
- Consistent audio across all devices
- Smaller bundle size

## Default Synthesized Sounds

| Cue Type | Description | Sound |
|----------|-------------|-------|
| Rest Countdown Warning | Plays at 10 seconds remaining | Double beep (660Hz) |
| Rest Complete | Rest timer finished | Rising chime (C5-E5-G5) |
| Set Complete | Exercise set finished | Rising chime (C5-E5-G5) |
| Hold Countdown Tick | During 3-2-1 countdown | Single tick (800Hz) |
| Hold Complete | Hold timer finished | Rising chime (C5-E5-G5) |

## PWA Keep-Alive

To prevent browser suspension during workouts, the app periodically plays an inaudible tone (20Hz at 0.1% volume). This keeps the audio context active and prevents the PWA from being suspended on mobile devices.

## Audio Settings

Users can toggle individual audio cues in Settings:

- Rest timer countdown warning (10s remaining)
- Rest timer complete
- Set complete chime
- Hold timer countdown warning
- Hold timer complete

All settings are persisted to localStorage.

## Custom Audio Files (Optional)

If you prefer custom sounds, you can add audio files to this directory:

- `countdown.mp3` - Countdown/warning sound
- `complete.mp3` - Completion sound
- `tick.mp3` - Tick sound

Then modify `src/utils/audio.ts` to load and play these files instead of synthesized tones.

## Technical Notes

- Audio is unlocked on first user interaction (required by mobile browsers)
- Uses AudioContext API for low-latency playback
- Gracefully degrades if Web Audio API is not supported
