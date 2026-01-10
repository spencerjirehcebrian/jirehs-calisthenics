# Unified Workout Screens Specification

This document specifies the redesign of WarmupScreen, CooldownScreen, and ActiveWorkoutScreen to achieve visual and architectural consistency through shared primitives.

## Executive Summary

The three workout flow screens (Warmup, Active Workout, Cooldown) currently share similar patterns but have inconsistent implementations. This redesign introduces shared primitive components that all screens will compose, deprecates the `GuidedMovementStep` abstraction, and moves more state to Zustand stores for better organization.

**Priority**: Code consistency first - clean architecture even if some visual differences remain temporarily during incremental implementation.

---

## Architecture Decisions

### Shared Primitives Approach

Create lower-level shared components that all screens compose differently:

| Primitive | Purpose |
|-----------|---------|
| `ExerciseHeader` | Movement/exercise name with context label and accent underline |
| `InteractionArea` | Container for RepCounter/TimedHold with consistent spacing |
| `MetadataTabs` | Pill-style tabs for Form/Setup/Timer content |
| `BottomBar` | Progress bar + contextual info + action button |
| `LoadingState` | Unified loading/error display |

All primitives are **pure presentational components** - they receive all data via props. Screens handle store access and pass data down.

### GuidedMovementStep Deprecation

The existing `GuidedMovementStep` component will be **deprecated entirely**. Warmup and Cooldown screens will compose primitives directly, matching how ActiveWorkoutScreen works.

### State Management Strategy

Move more state to Zustand stores to reduce local state complexity:

- **Flow-level state** (current index, completed steps, phase) → Zustand stores
- **Interaction state** (currentReps, timer values) → Zustand stores
- **UI-only state** (active tab, dialog visibility) → Can remain local or use hooks

Benefits:
- Easier debugging via devtools
- Potential for state persistence/recovery
- Cleaner component code

---

## Component Specifications

### ExerciseHeader

Displays the current movement/exercise with context.

```tsx
interface ExerciseHeaderProps {
  contextLabel: string      // e.g., "WARMUP - JOINT CIRCLES" or "STRENGTH - PAIR 1"
  exerciseName: string      // e.g., "NECK CIRCLES"
  sideLabel?: string        // e.g., "Left side" or "Clockwise"
}
```

**Layout:**
1. Context label (small, earth color, uppercase, tracking-wider)
2. Exercise name (display-md, uppercase, bold)
3. Side label if present (body-lg, earth color)
4. Accent underline (h-1, w-12, earth-500)

**Side Label Logic:**
- `perDirection` type → "Clockwise" / "Counter-clockwise"
- `perSide` type → "Left side" / "Right side"
- Derived dynamically from movement type

### InteractionArea

Wrapper for RepCounter or TimedHold with consistent styling.

```tsx
interface InteractionAreaProps {
  children: React.ReactNode
  onTapAnywhere?: () => void  // For ripple effect
}
```

**Features:**
- Consistent min-height (`min-h-interaction`)
- Ripple effect on tap (unified across all tappable interactions)
- Proper flex centering

### MetadataTabs

Pill-style tabbed content for exercise metadata.

```tsx
interface MetadataTabsProps {
  tabs: Array<{
    id: string
    label: string
    content: React.ReactNode
  }>
  defaultTab?: string  // Defaults to first tab (Form)
}
```

**Behavior:**
- Only render tabs that have content (hide empty tabs)
- Default to "Form" tab when available
- Consistent pill styling with earth accent for active state
- Animated content transitions

**Tab Types:**
| Tab | Content | When to Show |
|-----|---------|--------------|
| Form | Form cues as bullet list | When `formCues` array exists and has items |
| Instructions | Freeform instructions text | When `instructions` string exists (warmup/cooldown) |
| Setup | Equipment setup info | When `equipmentSetup` exists |
| Timer | Set elapsed time | Always (all flows) |

**Content Rendering:**
- Support both `string` and `string[]` formats
- Arrays render as bullet lists
- Strings render as paragraphs

### BottomBar

Unified bottom section with progress and actions.

```tsx
interface BottomBarProps {
  progress: {
    current: number
    total: number
  }
  contextInfo?: string        // e.g., "Pair 2/3 - Set 1/3" or "Joint Circles"
  actionButton?: {
    label: string             // "DONE", "NEXT", "START"
    onClick: () => void
  }
  showDeloadBadge?: boolean
}
```

**Layout:**
1. Progress bar (full width)
2. Progress text ("X of Y")
3. Contextual info (phase name, pair/set info)
4. Action button (full width)

**Button Label Convention:**
| Context | Label |
|---------|-------|
| Completing rep-based movement | "DONE" |
| Completing exercise before rest | "DONE" |
| Skipping rest period | "NEXT" |
| Starting timed hold | "START" (handled by TimedHold component) |

### LoadingState

Unified loading and error display.

```tsx
interface LoadingStateProps {
  message: string  // e.g., "Loading warm-up...", "No workout selected"
  isError?: boolean
}
```

---

## Screen Layout Specification

All three screens share this layout structure:

```
┌─────────────────────────────────────┐
│ [Exit]                    [Timer]   │  ← Fixed header area
│                          [Deload?]  │
├─────────────────────────────────────┤
│ CONTEXT LABEL                       │
│ EXERCISE NAME                       │  ← ExerciseHeader
│ Side label                          │
│ ────                                │
├─────────────────────────────────────┤
│                                     │
│         [Interaction Area]          │  ← RepCounter or TimedHold
│                                     │
├─────────────────────────────────────┤
│ [Form] [Setup] [Timer]              │  ← MetadataTabs
│ ┌─────────────────────────────────┐ │
│ │ Tab content                     │ │
│ └─────────────────────────────────┘ │
├─────────────────────────────────────┤
│ ═══════════════════════             │  ← BottomBar
│          3 of 12                    │
│     Joint Circles Phase             │
│ ┌─────────────────────────────────┐ │
│ │           DONE                  │ │
│ └─────────────────────────────────┘ │
└─────────────────────────────────────┘
```

### Fixed Header Elements

**Exit Button:**
- Position: `top-4 left-4` (consistent across all screens)
- Variant: `ghost`, size: `sm`, with accent
- Label: "Exit" (generic, not "Exit Exercise")

**Session Timer:**
- Position: `top-4 right-4`
- Shows elapsed time since workout start
- Small, unobtrusive styling

**Deload Badge:**
- Only shown on ActiveWorkoutScreen
- Position: Left of session timer
- Styling: pill badge with earth colors

---

## Progress Calculation

### Universal Progress Bar

All screens show a progress bar. Progress is calculated as **completed steps / total steps**.

### Warmup/Cooldown Progress

```typescript
function calculateWarmupProgress(
  phases: NormalizedPhase[],
  currentPhaseIndex: number,
  currentMovementIndex: number,
  currentSide: 'first' | 'second' | null
): { current: number; total: number }
```

- Each movement = 1 step (or 2 if bilateral)
- Total = sum of all movement steps across phases

### Active Workout Progress

```typescript
function calculateWorkoutProgress(
  pairs: WorkoutPair[],
  currentPairIndex: number,
  currentExerciseInPair: 1 | 2,
  currentSet: number,
  totalSets: number
): { current: number; total: number }
```

- Each **set completion** = 1 step
- Total = pairs × exercises per pair × sets per pair
- Example: 3 pairs × 2 exercises × 3 sets = 18 total steps

---

## Interaction Behaviors

### Hold-to-Skip (TapToSkipOverlay)

**Applies to:** All movement types (including timed holds)

The hold-to-skip gesture wraps the entire interaction area on all screens. Users can hold anywhere to skip the current movement/exercise.

### Ripple Effect

**Applies to:** All tappable areas

- RepCounter tap area
- TimedHold "tap when ready" area
- TapToSkipOverlay hold area

Implement consistent ripple animation across all interactive components.

### Touch Feedback

Replace inconsistent feedback with unified pattern:
- Ripple effect on tap
- Scale animation (`whileTap={{ scale: 1.03 }}`) on pressable containers

---

## Voice Commands

### Unified Flow Context

Replace separate voice contexts (`repCounter`, `timedHold`, `guidedMovement`, `rest`) with a single `workoutFlow` context that adapts based on current interaction state.

```typescript
interface WorkoutFlowVoiceState {
  interactionType: 'reps' | 'timed' | 'rest' | 'idle'
  // Handlers adapt based on interactionType
}
```

**Commands by State:**

| State | Available Commands |
|-------|-------------------|
| `reps` | number (set count), "done", "undo" |
| `timed` | "ready" (start), "stop" (abort) |
| `rest` | "skip", "extend" |
| `idle` | "skip" |

### VoiceSetupModal

- Shows **once per session** on WarmupScreen only
- If voice is already set up or user dismissed, don't show again
- Remove from ActiveWorkoutScreen and never add to CooldownScreen

---

## Rest Periods

Rest periods remain **exclusive to ActiveWorkoutScreen**. Warmup and Cooldown flows are continuous without rest.

The RestTimer component continues to be rendered inline within ActiveWorkoutScreen when `isResting` is true.

---

## Exit Confirmation

### useExitConfirmation Hook

Extract the exit dialog pattern to a reusable hook:

```typescript
function useExitConfirmation(onConfirm: () => void) {
  const [showDialog, setShowDialog] = useState(false)

  return {
    showDialog,
    openDialog: () => setShowDialog(true),
    closeDialog: () => setShowDialog(false),
    confirmExit: () => {
      setShowDialog(false)
      onConfirm()
    },
    ConfirmDialogProps: {
      isOpen: showDialog,
      title: "Exit Workout?",
      message: "Your progress will not be saved. Are you sure you want to exit?",
      confirmLabel: "Exit",
      cancelLabel: "Continue",
      onConfirm: /* confirmExit */,
      onCancel: /* closeDialog */
    }
  }
}
```

---

## Accessibility

### Standardized in Primitives

Each primitive component handles its own accessibility:

| Component | Accessibility Features |
|-----------|----------------------|
| ExerciseHeader | Proper heading hierarchy |
| InteractionArea | aria-label for current state, aria-live for changes |
| MetadataTabs | Tab panel ARIA pattern, keyboard navigation |
| BottomBar | Progress announced to screen readers |
| LoadingState | aria-busy, status role |

### Screen Reader Announcements

Use `aria-live="polite"` regions to announce:
- Movement/exercise changes
- Side changes (left/right)
- Progress milestones
- Rest period start/end

---

## Deload Mode

Deload mode affects **ActiveWorkoutScreen only**:
- Reduces sets from 3 to 2
- Shows deload badge in header

Warmup and Cooldown are independent of training intensity and remain unchanged in deload mode.

---

## Data Model Considerations

### Side Handling Terminology

Keep semantic distinction:
- `perDirection: boolean` - For rotational movements (circles)
- `perSide: boolean` - For lateral movements (stretches)

Both map to similar UI behavior (do twice) but with different labels.

### Cues/Instructions Format

Support both formats in rendering:

```typescript
type CuesOrInstructions = string | string[]

function renderCues(content: CuesOrInstructions) {
  if (Array.isArray(content)) {
    return <ul>{content.map(cue => <li>{cue}</li>)}</ul>
  }
  return <p>{content}</p>
}
```

---

## Test Migration Plan

### Affected Test Files

Based on current e2e tests:

| File | Impact |
|------|--------|
| `e2e/tests/flows/complete-workout.spec.ts` | High - flow changes |
| `e2e/tests/interactions/hold-to-skip.spec.ts` | Medium - skip behavior changes |
| `e2e/tests/interactions/rep-counter.spec.ts` | Low - component unchanged |
| `e2e/tests/interactions/rest-timer.spec.ts` | Low - component unchanged |
| `e2e/page-objects/active-workout.page.ts` | High - selectors may change |

### Migration Strategy

1. **Phase 1: Create Primitives**
   - Build new primitive components with unit tests
   - Don't modify existing screens yet
   - Verify primitives work in isolation

2. **Phase 2: Refactor Warmup Screen**
   - Update WarmupScreen to use primitives
   - Update affected e2e tests
   - Verify feature parity

3. **Phase 3: Refactor Cooldown Screen**
   - Update CooldownScreen to use primitives
   - Add VoiceSetupModal removal (was missing)
   - Update affected e2e tests

4. **Phase 4: Refactor Active Workout**
   - Update ActiveWorkoutScreen to use primitives
   - Most complex due to rest handling
   - Update affected e2e tests

5. **Phase 5: Cleanup**
   - Delete deprecated GuidedMovementStep
   - Remove any dead code
   - Final test pass

### Unit Test Requirements

Each primitive needs unit tests covering:
- Rendering with various prop combinations
- Accessibility attributes
- User interactions (clicks, keyboard)
- Animation triggers

---

## Implementation Notes

### File Structure

Left to implementation discretion. Suggested organization:
- New primitives in `src/components/workout/` or similar
- Progress utilities in `src/utils/`
- Exit confirmation hook in `src/hooks/`

### Performance Considerations

- Memoize progress calculations
- Use `React.memo` on primitives where appropriate
- Avoid unnecessary re-renders from store subscriptions

### Bundle Size

The refactor should not significantly impact bundle size since:
- We're reorganizing existing code, not adding new dependencies
- GuidedMovementStep deletion offsets new primitive code

---

## Summary of Key Changes

| Aspect | Current State | After Redesign |
|--------|---------------|----------------|
| Component architecture | GuidedMovementStep abstraction | Shared primitives composition |
| State management | Heavy local state | More Zustand usage |
| Progress display | Inconsistent | Universal progress bar |
| Exit button | Inconsistent position/label | top-4 left-4, "Exit" |
| Voice setup modal | Warmup + ActiveWorkout | Warmup only (once per session) |
| Metadata tabs | ActiveWorkout only | All screens (when content exists) |
| Set timer | ActiveWorkout only | All screens (in Timer tab) |
| Skip behavior | Varies by screen | Hold-to-skip everywhere |
| Touch feedback | Inconsistent | Ripple effect everywhere |
| Voice contexts | Multiple separate | Single adaptive context |
| Exit dialog | Inline per screen | Shared hook |

---

## Open Questions

None - all decisions have been made through the interview process.

---

## Appendix: Current vs Target Screen Comparison

### WarmupScreen

| Feature | Current | Target |
|---------|---------|--------|
| Uses GuidedMovementStep | Yes | No (primitives) |
| Has metadata tabs | No | Yes |
| Has set elapsed timer | No | Yes (in tab) |
| Exit position | top-2 left-2 | top-4 left-4 |
| VoiceSetupModal | Yes | Yes (only here) |
| Progress display | Bar + "X of Y" | Bar + "X of Y" + phase name |

### CooldownScreen

| Feature | Current | Target |
|---------|---------|--------|
| Uses GuidedMovementStep | Yes | No (primitives) |
| Has metadata tabs | No | Yes |
| Has set elapsed timer | No | Yes (in tab) |
| Exit position | top-2 left-2 | top-4 left-4 |
| VoiceSetupModal | No | No |
| Shows phase name | No | Yes (context label) |

### ActiveWorkoutScreen

| Feature | Current | Target |
|---------|---------|--------|
| Uses primitives | No (inline) | Yes |
| Has metadata tabs | Yes | Yes |
| Progress display | Pair/Set text | Bar + Pair/Set text |
| Exit label | "Exit Exercise" | "Exit" |
| Exit position | top-4 left-4 | top-4 left-4 (unchanged) |
| Skip on timed hold | No | Yes |
