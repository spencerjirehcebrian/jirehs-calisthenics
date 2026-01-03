# Jireh's Calisthenics App - Technical Specification

## Overview

A refined, client-side only progressive web app for following a structured 3-day-per-week calisthenics program. Designed for use during active exercise with minimal cognitive load and maximum reliability.

**Core Philosophy:** Simple but refined. No cloud, no accounts, no complexity. Works offline. Respects the user's focus during training.

---

## Technical Foundation

### Platform
- Progressive Web App (PWA) with full offline support via service worker
- Client-side only - no backend, no API calls after initial load
- LocalStorage for all persistence
- Responsive layout supporting both portrait and landscape orientations
- System theme preference (follows device dark/light mode setting)

### Data Strategy
- All data stored in browser LocalStorage
- No export/import functionality - accept data loss on browser clear
- No cloud sync, no accounts
- Only complete workout sessions are saved (partial sessions discarded)

### Audio Strategy
- Background audio cues serve dual purpose: user notifications AND preventing app suspension
- Audio keeps the PWA alive during workout (prevents browser from suspending the tab)
- All audio cues are individually configurable by user

---

## Application Structure

### Screens

1. **Home Screen** - Equal-weight choice menu
   - Start Workout
   - Exercise Library
   - Settings
   - No dashboard, no stats, no streak counters

2. **Workout Selection** - Always presented (no auto-rotation)
   - Workout A: Push focus with core
   - Workout B: Pull focus with legs
   - Workout C: Skill and strength combination
   - All three options presented equally each time

3. **Warm-up Flow** - Guided with timers
   - Step-by-step through each warm-up phase
   - Individual timers for each movement
   - Skippable via hold-to-skip pattern (2 second hold)

4. **Active Workout** - Linear exercise flow
   - One exercise at a time (pairs are implicit in sequencing)
   - Minimal interface with progressive disclosure
   - Subtle session timer in corner

5. **Cool-down Flow** - Same structure as warm-up
   - Guided stretches with hold timers (20-60 seconds each)
   - Same skip mechanics as warm-up

6. **Session Summary** - On workout completion
   - List of exercises completed with rep counts
   - Total duration
   - Done button returns to home

7. **Exercise Library** - Reference and practice
   - All exercises in the program (no external exercises)
   - Full details: description, form cues, progression path, equipment setup
   - Practice mode: do standalone sets (not tracked)

8. **Settings**
   - Audio cue toggles (individual control per cue type)
   - Hold-timer countdown duration (2 or 3 seconds)
   - Deload mode toggle

---

## Core Interaction Patterns

### Rep Input
- Single tap increment for rep-based exercises
- Each tap adds 1 to the counter
- Auto-confirm when transitioning to rest timer (no explicit confirm button)
- For per-side exercises (lunges, dead bugs): track as single total number

### Timed Holds
- Same screen layout as rep-based, but timer replaces tap counter
- User-configurable countdown before timer starts (2 or 3 seconds)
- Timer runs down from target time to zero
- Tap to start timer (full screen is start button)

### Rest Timer
- 90-second default between exercises in a pair (3 minutes effective between same-exercise sets)
- Timer counts down, then goes negative when over-resting
- Requires explicit tap to proceed to next exercise
- Audio cue at rest end (configurable)

### Hold-to-Skip Pattern
Universal friction mechanism used throughout the app:
- Hold for 2 seconds to skip
- Applies to: rest timer, warm-up sections, cool-down sections, individual exercises
- Visual feedback during hold (progress indicator)
- No confirmation dialogs

### Progressive Disclosure
- Default view shows exercise name + rep target in minimal layout
- Explicit icons reveal additional information on tap:
  - Set progress (Set 2 of 3)
  - Form cues (shown by default, collapsible)
  - Equipment setup notes (expandable)
  - Elapsed time for current set

---

## Workout Structure

### Session Flow
```
Home -> Select A/B/C -> Warm-up (skippable) -> Strength Pairs -> Cool-down (skippable) -> Summary -> Home
```

### Exercise Pairing
Each workout contains 3 pairs. Within a pair:
1. Exercise A, Set 1
2. Rest 90s
3. Exercise B, Set 1
4. Rest 90s
5. Exercise A, Set 2
6. ...continue until all sets complete
7. Move to next pair

User sees one exercise at a time. The pairing is implicit in the flow.

### Transition Cues
- During final set of an exercise, show "Next: [exercise name]" preview
- No interstitial screens between exercises

### Fixed Program (No Customization)
The three workouts are immutable:

**Workout A: Push focus with core**
| Pair | Exercise 1 | Exercise 2 |
|------|-----------|-----------|
| 1 | Push-ups (max reps) | Bodyweight squats (15) |
| 2 | Ring rows (8-12) | Dead bugs (10/side) |
| 3 | Dead hang (20-30s) | Hollow body tuck hold (20s) |

**Workout B: Pull focus with legs**
| Pair | Exercise 1 | Exercise 2 |
|------|-----------|-----------|
| 1 | Scapular pulls (10-12) | Static lunges (8/leg) |
| 2 | Incline push-ups (12-15) | Ring support hold (10-20s) |
| 3 | Glute bridges (15) | Plank (30s) |

**Workout C: Skill and strength combination**
| Pair | Exercise 1 | Exercise 2 |
|------|-----------|-----------|
| 1 | Negative pullups (3-5) | Deep squats (12) |
| 2 | Push-ups (max reps) | Bird dogs (10/side) |
| 3 | Ring rows (8-10) | Side planks (20s/side) |

---

## Warm-up Structure (10-15 minutes)

Guided step-by-step with timers:

**Phase 1: Elevate Heart Rate (2-3 min)**
- 50 jumping jacks OR jog in place

**Phase 2: Joint Circles (2-3 min)**
- Neck circles (10 each direction)
- Shoulder circles forward (10)
- Shoulder circles backward (10)
- Arm circles (10)
- Wrist circles (10)
- Hip circles (10 each direction)
- Knee circles (10)
- Ankle circles (10)
- Wrist rocks on all fours (10)

**Phase 3: Dynamic Stretches (3-5 min)**
- Cat-cow (8-10 reps)
- Leg swings front-to-back (10 each leg)
- Hip circles (5 each direction)
- Inchworms (5-8)

**Phase 4: Movement Activation (3-5 min)**
- Scapular push-ups (10)
- Wall push-ups (5-10)
- Dead hang (10-30 seconds)

---

## Cool-down Structure (5-10 minutes)

Same guided timer approach as warm-up:

- Cross-arm shoulder stretch (30s each side)
- Pigeon stretch (45-60s each side)
- Wrist flexor stretch (30s)
- Cat-cow (10 slow reps)
- Thread the needle (10 each side)

---

## Exercise Library

### Data Per Exercise
- Name
- Description (1-2 sentences)
- Form cues (bullet list of key points)
- Equipment setup notes (if applicable)
- Progression path (what comes before/after)
- Target rep/time ranges

### Exercises Included
All exercises from the three workouts plus their progressions:

**Push Progression:**
Wall push-ups -> Incline push-ups -> Full push-ups -> Diamond push-ups -> Decline push-ups -> Ring push-ups -> Ring push-ups (RTO)

**Pull Progression:**
Dead hangs -> Scapular pulls -> Ring rows (steep) -> Ring rows (45 deg) -> Ring rows (horizontal) -> Jackknife pullups -> Negative pullups -> Full pullups

**Core:**
Dead bugs (heel taps) -> Dead bugs (standard) -> Dead bugs (full)
Hollow body tuck -> Hollow body straddle -> Hollow body full
Plank -> Side planks -> Plank with leg lifts
Bird dogs

**Legs:**
Bodyweight squats -> Deep squats -> Bulgarian split squats -> Assisted pistol squats -> Pistol squats
Static lunges -> Walking lunges
Glute bridges

**Holds:**
Dead hang
Ring support hold
Hollow body holds
Planks (front and side)

### Practice Mode
- Available from exercise library
- Do a single set of any exercise
- Timer or rep counter as appropriate
- Not tracked or logged anywhere

---

## Progression System

### Philosophy
- Manual progression only
- App tracks data, user decides when to advance
- No automatic suggestions or prompts to progress

### Previous Best Display
- For max-rep exercises, show "Last: X" as reference
- Not presented as a target or goal to beat
- Just information

### Failure Handling
- Log all rep counts silently
- No commentary, warnings, or suggestions on low counts
- User knows when they've failed

---

## Deload Mode

### Activation
- Manual toggle in settings
- Toggle labeled "Deload Week" or similar

### Effect
- Reduces sets from 3 to 2 (half, rounded up)
- Rep targets remain unchanged
- Visual indicator that deload is active

---

## Settings

### Audio Cues (Individual Toggles)
- Rest timer countdown warning (10 seconds remaining)
- Rest timer complete
- Set complete chime
- Hold timer countdown warning
- Hold timer complete

### Timer Settings
- Hold countdown duration: 2 seconds or 3 seconds (radio buttons)

### Display
- Theme follows system (no manual toggle in app - uses prefers-color-scheme)

### Deload
- Deload mode toggle

---

## State Management

### Session Persistence
- Background audio prevents app suspension during active workout
- If app is force-closed mid-workout, session is discarded
- Only complete sessions are saved

### Workout History
- Minimal storage - no elaborate history view
- Store only what's needed for "previous best" display
- Per-exercise: last rep count achieved

### Local Storage Schema
```javascript
{
  settings: {
    audioCues: {
      restCountdown: boolean,
      restComplete: boolean,
      setComplete: boolean,
      holdCountdown: boolean,
      holdComplete: boolean
    },
    holdCountdown: 2 | 3,
    deloadMode: boolean
  },
  exerciseHistory: {
    [exerciseId]: {
      lastReps: number,
      lastDuration: number  // for holds
    }
  }
}
```

---

## Visual Design

### Density
- Extremely minimal by default
- Progressive disclosure reveals additional information
- Large, touch-friendly targets

### Layout Hierarchy
1. Exercise name (largest)
2. Rep counter / timer (prominent)
3. Target reps / time (reference)
4. Everything else (small, icons to reveal)

### Information Icons
- Small info icons that expand details on tap
- Form cues shown by default (collapsible)
- Equipment setup hidden by default (expandable)
- Set progress (expandable)

### Color Palette
- Designer's choice within constraints:
  - Refined, functional aesthetic
  - Works well in both light and dark themes
  - Good contrast for gym environments (varied lighting)
  - Monochrome base with single accent color recommended

### Typography
- Large, readable numbers for counters/timers
- Clear exercise names
- Secondary information in smaller, subdued text

---

## Audio Implementation

### Background Persistence
- Play silent/near-silent audio to prevent browser suspension
- Audio cues double as the persistence mechanism
- If all cues disabled, play inaudible tone during rest periods

### Cue Design
- Short, distinct sounds (not musical or elaborate)
- Different sound for each cue type
- Volume respects system media volume

---

## Accessibility Considerations

- Large touch targets (minimum 44x44px)
- High contrast text
- Screen reader support for exercise names and counts
- No reliance on color alone for state indication

---

## Out of Scope (Explicit Non-Features)

- User accounts / authentication
- Cloud sync
- Data export/import
- Social features
- Workout customization
- Progress graphs or charts
- Achievements or gamification
- Haptic feedback
- Image/video demonstrations
- Rest timer extensions on failed sets
- Automatic progression suggestions
- Workout scheduling or reminders
- Integration with other apps/services

---

## Implementation Notes

### PWA Requirements
- Service worker for full offline functionality
- Web app manifest for installability
- Cache all assets on first load

### Browser Support
- Modern browsers with PWA support
- iOS Safari (with PWA limitations noted)
- Chrome/Edge on desktop and mobile

### Performance
- Minimal JavaScript bundle
- No heavy frameworks required
- Instant load after initial cache

---

## Future Considerations (Not MVP)

These are explicitly deferred but noted for awareness:
- Additional workout programs
- Custom exercise variations
- Extended progression tracking
- Workout notes/annotations
