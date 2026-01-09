# Calisthenics App UX Redesign Plan

## Aesthetic Direction: Athletic Brutalism

A bold fusion of raw, geometric forms with organic warmth. The design should feel powerful and grounded - like the physical practice of calisthenics itself.

**Core principles:**
- Heavy, confident typography at extreme scales
- Dramatic negative space creating breathing room
- Geometric shapes with organic color warmth
- Staggered, asymmetric layouts that create visual tension
- Motion that feels like physical force (springs, weight, momentum)

---

## Part 1: Design Specifications

### 1.1 Typography System

**Font Pairing:**
- Display: **Fraunces** (Variable font, optical sizing)
- Body: **Outfit** (Geometric sans with distinctive letterforms, excellent readability)

**Type Scale (using clamp for fluid sizing):**
```
--font-size-display-hero: clamp(3.5rem, 18vmin, 7rem);    /* Home title */
--font-size-display-xl: clamp(3rem, 15vmin, 6rem);        /* Rep counter */
--font-size-display-lg: clamp(2rem, 8vmin, 3.5rem);       /* Screen titles */
--font-size-display-md: clamp(1.5rem, 5vmin, 2rem);       /* Section headers */
--font-size-body-lg: 1.125rem;                            /* 18px - Primary text */
--font-size-body-md: 1rem;                                /* 16px - Body text */
--font-size-body-sm: 0.875rem;                            /* 14px - Secondary text */
--font-size-body-xs: 0.75rem;                             /* 12px - Captions */
```

**Font weights:**
- Display: 400 (regular), 600 (semibold), 800 (extrabold)
- Body: 400 (regular), 500 (medium), 600 (semibold)

### 1.2 Color System

**Core Palette:**
```
/* Ink - Primary text and dark backgrounds */
--color-ink-950: #0a0908;      /* True black */
--color-ink-900: #1a1816;
--color-ink-800: #2d2926;
--color-ink-700: #443e3a;
--color-ink-600: #4d4743;  /* Darkened for WCAG AA contrast */
--color-ink-500: #5c5650;  /* For muted text */

/* Cream - Light backgrounds */
--color-cream-50: #fdfcfa;
--color-cream-100: #faf7f2;
--color-cream-200: #f5f0e8;
--color-cream-300: #ebe4d8;
--color-cream-400: #d9cfc0;

/* Earth - Primary accent (warm browns) */
--color-earth-400: #8a7352;  /* Darkened for WCAG AA contrast */
--color-earth-500: #9c8259;
--color-earth-600: #7d6645;
--color-earth-700: #5e4d36;

/* Moss - Success states */
--color-moss-400: #6aa575;
--color-moss-500: #4a8a55;
--color-moss-600: #3a6e44;

/* Terra - Warning/attention */
--color-terra-400: #e69272;
--color-terra-500: #d97452;
--color-terra-600: #c55a3a;

/* Gold - Achievement/celebration */
--color-gold-400: #d4b83d;
--color-gold-500: #c9a227;
--color-gold-600: #a8871f;
```

**Semantic Colors:**
```
/* Light mode */
--bg-primary: var(--color-cream-100);
--bg-secondary: var(--color-cream-50);
--bg-elevated: white;
--text-primary: var(--color-ink-900);
--text-secondary: var(--color-ink-600);
--text-muted: var(--color-ink-500);
--accent-primary: var(--color-earth-600);
--accent-success: var(--color-moss-500);
--accent-warning: var(--color-terra-500);
--accent-gold: var(--color-gold-500);

/* Dark mode */
--bg-primary: var(--color-ink-950);
--bg-secondary: var(--color-ink-900);
--bg-elevated: var(--color-ink-800);
--text-primary: var(--color-cream-100);
--text-secondary: var(--color-cream-300);
--text-muted: var(--color-cream-400);
--accent-primary: var(--color-earth-500);  /* Lighter for dark bg */
--accent-success: var(--color-moss-400);
--accent-warning: var(--color-terra-400);
--accent-gold: var(--color-gold-400);

/* Dark mode shadows - use black with opacity */
--shadow-sm: 0 1px 2px rgba(0, 0, 0, 0.2);
--shadow-md: 0 4px 6px rgba(0, 0, 0, 0.3), 0 2px 4px rgba(0, 0, 0, 0.2);
--shadow-lg: 0 10px 15px rgba(0, 0, 0, 0.35), 0 4px 6px rgba(0, 0, 0, 0.2);
--shadow-xl: 0 20px 25px rgba(0, 0, 0, 0.4), 0 8px 10px rgba(0, 0, 0, 0.25);
--shadow-earth: 0 4px 14px rgba(156, 130, 89, 0.3);
--shadow-earth-lg: 0 8px 24px rgba(156, 130, 89, 0.35);
```

### 1.3 Spacing System

```
--space-1: 0.25rem;   /* 4px */
--space-2: 0.5rem;    /* 8px */
--space-3: 0.75rem;   /* 12px */
--space-4: 1rem;      /* 16px */
--space-5: 1.25rem;   /* 20px */
--space-6: 1.5rem;    /* 24px */
--space-8: 2rem;      /* 32px */
--space-10: 2.5rem;   /* 40px */
--space-12: 3rem;     /* 48px */
--space-16: 4rem;     /* 64px */
--space-20: 5rem;     /* 80px */
```

### 1.4 Border Radius

```
--radius-sm: 0.5rem;    /* 8px - small elements */
--radius-md: 0.75rem;   /* 12px - buttons */
--radius-lg: 1rem;      /* 16px - cards */
--radius-xl: 1.5rem;    /* 24px - large cards */
--radius-2xl: 2rem;     /* 32px - hero elements */
--radius-full: 9999px;  /* Pills, circles */
```

### 1.5 Shadows

```
/* Elevation levels */
--shadow-sm: 0 1px 2px rgba(10, 9, 8, 0.05);
--shadow-md: 0 4px 6px rgba(10, 9, 8, 0.07), 0 2px 4px rgba(10, 9, 8, 0.04);
--shadow-lg: 0 10px 15px rgba(10, 9, 8, 0.1), 0 4px 6px rgba(10, 9, 8, 0.05);
--shadow-xl: 0 20px 25px rgba(10, 9, 8, 0.1), 0 8px 10px rgba(10, 9, 8, 0.04);

/* Accent shadows (for primary buttons) */
--shadow-earth: 0 4px 14px rgba(125, 102, 69, 0.25);
--shadow-earth-lg: 0 8px 24px rgba(125, 102, 69, 0.3);
```

### 1.6 Motion/Animation

**Timing Functions:**
```
--ease-out-expo: cubic-bezier(0.16, 1, 0.3, 1);
--ease-out-back: cubic-bezier(0.34, 1.56, 0.64, 1);
--ease-in-out-circ: cubic-bezier(0.85, 0, 0.15, 1);
--spring: cubic-bezier(0.175, 0.885, 0.32, 1.275);
```

**Durations:**
```
--duration-fast: 100ms;
--duration-normal: 200ms;
--duration-slow: 300ms;
--duration-slower: 500ms;
```

**Animation Keyframes:**

```css
/* Stagger entrance - items slide up and fade in */
@keyframes slide-up-fade {
  from {
    opacity: 0;
    transform: translateY(24px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Scale pulse for tap feedback */
@keyframes tap-pulse {
  0% { transform: scale(1); }
  50% { transform: scale(1.05); }
  100% { transform: scale(1); }
}

/* Ripple effect */
@keyframes ripple {
  from {
    transform: scale(0);
    opacity: 0.5;
  }
  to {
    transform: scale(4);
    opacity: 0;
  }
}

/* Breathing animation for countdowns */
@keyframes breathe-scale {
  0%, 100% {
    transform: scale(1);
    opacity: 1;
  }
  50% {
    transform: scale(0.95);
    opacity: 0.85;
  }
}

/* Progress ring drain */
@keyframes ring-drain {
  from { stroke-dashoffset: 0; }
  to { stroke-dashoffset: var(--circumference); }
}

/* Celebration particles */
@keyframes float-up {
  0% {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
  100% {
    opacity: 0;
    transform: translateY(-100px) scale(0.5);
  }
}
```

---

## Part 2: Screen Designs

### 2.1 Home Screen

**Layout:**
```
+--------------------------------------------------+
|                                         [gear]   |  <- settings icon, top-right
|                                                  |
|                                                  |
|   JIREH'S                                       |  <- Fraunces 800, hero size
|   CALISTHENICS                                  |  <- split across 2 lines
|   _______________                               |  <- decorative underline
|                                                  |
|                              [geometric accent]  |  <- overlapping circles/shapes
|                                                  |
|                                                  |
|   +------------------------------------------+   |
|   |                                          |   |
|   |  START WORKOUT                      ->   |   |  <- 80px height, full width
|   |                                          |   |
|   +------------------------------------------+   |
|                                                  |
|   +------------------+    +------------------+   |
|   |                  |    |                  |   |
|   |  EXERCISE        |    |  SETTINGS        |   |  <- 2-col grid
|   |  LIBRARY         |    |                  |   |
|   +------------------+    +------------------+   |
|                                                  |
+--------------------------------------------------+
```

**Visual details:**
- Background: cream-100 with subtle grain texture overlay (5% opacity)
- Decorative element: 2-3 overlapping circles in earth-200/earth-300, positioned bottom-right of title
- Title underline: 4px thick, earth-500, 60% of title width
- Primary button: earth-600 bg, white text, earth shadow, arrow icon right-aligned
- Secondary buttons: cream-50 bg, ink-800 text, subtle border

**Animations:**
- Title slides in from left (300ms, ease-out-expo)
- Decorative shapes fade and scale in (400ms, 100ms delay)
- Primary button slides up (300ms, 200ms delay)
- Secondary buttons stagger (300ms each, 300ms/400ms delay)

### 2.2 Workout Selection Screen

**Layout:**
```
+--------------------------------------------------+
|  <-                                              |  <- back arrow
|                                                  |
|  SELECT                                         |  <- Fraunces 600, display-lg
|  YOUR                                           |
|  WORKOUT                                        |
|  ________                                       |
|                                                  |
|  +------------------------------------------+   |
|  |  01                              [stripe]|   |  <- diagonal accent stripe
|  |  FULL BODY STRENGTH                      |   |
|  |  Core, Push, Pull - 45 min               |   |
|  +------------------------------------------+   |
|                                                  |
|  +------------------------------------------+   |
|  |  02                                      |   |
|  |  PUSH FOCUS                              |   |  <- different accent style
|  |  Chest, Shoulders, Triceps - 35 min      |   |
|  +------------------------------------------+   |
|                                                  |
|  +------------------------------------------+   |
|  |  03                                      |   |
|  |  PULL FOCUS                              |   |
|  |  Back, Biceps, Grip - 35 min             |   |
|  +------------------------------------------+   |
|                                                  |
+--------------------------------------------------+
```

**Card details:**
- Number: Fraunces 400, earth-400, positioned top-left
- Title: Outfit 600, ink-900, uppercase, letter-spacing 0.02em
- Subtitle: Outfit 400, ink-600
- Card bg: cream-50 with 1px border cream-300
- Unique accent per card:
  - Card 1: diagonal stripe (earth-300) in corner
  - Card 2: corner notch shape
  - Card 3: dot pattern overlay
- Hover state: lift 4px, shadow-lg, border darkens to earth-400

### 2.3 Active Workout - Rep Counter

**Layout:**
```
+--------------------------------------------------+
|  12:34                            [Deload]       |  <- session timer, badge
|                                                  |
|  PULL-UPS                                       |  <- Fraunces 600
|  _________                                      |
|                                                  |
|                                                  |
|           +-------------------------+            |
|           |                         |            |
|           |          12             |            |  <- massive number
|           |                         |            |  <- inside rounded square
|           +-------------------------+            |
|                                                  |
|           Target: 8-12 reps                     |
|                                                  |
|   [==============================----] 10/12    |  <- progress toward target
|                                                  |
|   [ Form ]    [ Setup ]    [ Timer ]            |  <- pill tabs
|                                                  |
|   +------------------------------------------+   |
|   |  Form cue content here...                |   |  <- expandable content
|   +------------------------------------------+   |
|                                                  |
+--------------------------------------------------+
|  Pair 2/3                           Set 1/3     |
|  +------------------------------------------+   |
|  |          DONE - START REST               |   |
|  +------------------------------------------+   |
+--------------------------------------------------+
```

**Rep counter interaction:**
- Container: 200x200px rounded square (radius-2xl), cream-50 bg, shadow-md
- Number: Fraunces 800, display-xl size, ink-900
- Entire main area is tap zone
- Tap feedback: container scales to 1.03x, ripple from tap point
- Progress bar: 8px height, radius-full, earth-200 track, earth-500 fill
- Progress animates smoothly as reps increase

**Pill tabs:**
- Horizontal row of 3 pills
- Active: earth-600 bg, white text
- Inactive: cream-200 bg, ink-700 text
- Only one content panel visible at a time

### 2.4 Rest Timer

**Layout:**
```
+--------------------------------------------------+
|  15:42                                           |
|                                                  |
|                                                  |
|                  REST                            |  <- Fraunces 600, earth-600
|                                                  |
|            +---------------+                     |
|           /                 \                    |
|          |                   |                   |
|          |      1:24         |                   |  <- circular progress ring
|          |                   |                   |
|           \                 /                    |
|            +---------------+                     |
|                                                  |
|   Over-resting [warning if negative]            |
|                                                  |
|   Next: ROWS                                    |  <- preview of next exercise
|                                                  |
|   "Shake out your arms"                         |  <- rotating rest tip
|                                                  |
|                                                  |
|   TAP ANYWHERE TO CONTINUE                      |
|                                                  |
+--------------------------------------------------+
```

**Circular progress:**
- SVG ring, 200px diameter, 8px stroke
- Track: cream-300
- Progress: earth-500, animates drain clockwise
- Time text: Fraunces 700, display-lg, centered in ring
- At 10s remaining: ring transitions to terra-500
- At 0s: ring fills with terra-400, gentle pulse animation

**Background behavior:**
- Entire screen tappable
- Subtle pulse animation on "tap anywhere" text
- Background color subtly shifts warmer as time runs low

### 2.5 Timed Hold

**Phase 1 - Ready:**
```
+--------------------------------------------------+
|                                                  |
|  DEAD HANG                                      |
|  __________                                     |
|                                                  |
|                                                  |
|           +-------------------------+            |
|           |                         |            |
|           |         0:45            |            |
|           |        seconds          |            |
|           +-------------------------+            |
|                                                  |
|                                                  |
|   +------------------------------------------+   |
|   |          TAP WHEN READY                 |   |  <- prominent button
|   +------------------------------------------+   |
|                                                  |
+--------------------------------------------------+
```

**Phase 2 - Countdown:**
```
+--------------------------------------------------+
|                                                  |
|                                                  |
|                                                  |
|                                                  |
|                     3                            |  <- fills screen
|                                                  |  <- Fraunces 800, 200px
|                                                  |
|                                                  |
|                                                  |
+--------------------------------------------------+
```
- Each number (3, 2, 1) scales from 1.2x to 1x while fading slightly
- Background pulses with each tick (cream-100 -> cream-200 -> cream-100)

**Phase 3 - Active:**
```
+--------------------------------------------------+
|                                                  |
|  HOLD                                           |
|                                                  |
|                                                  |
|           +-------------------------+            |
|           |                         |            |
|           |         0:32            |            |
|           |                         |            |
|           +-------------------------+            |
|                                                  |
|   [================================------]      |  <- progress bar
|                                                  |
|   +------------------------------------------+   |  <- expanding rings visual
|   |    ( (  (   o   )  ) )                   |   |
|   +------------------------------------------+   |
|                                                  |
+--------------------------------------------------+
```
- Concentric rings expand outward as hold progresses
- Creates visual representation of sustained effort

**Phase 4 - Complete:**
```
+--------------------------------------------------+
|                                                  |
|                                                  |
|                                                  |
|                 DONE                            |  <- moss-500, scales up
|                                                  |
|                  [checkmark]                    |
|                                                  |
|                                                  |
+--------------------------------------------------+
```
- "DONE" text scales from 0.8x to 1x with spring easing
- Checkmark draws in (SVG stroke animation)
- Background briefly flashes moss-100

### 2.6 Session Summary

**Layout:**
```
+--------------------------------------------------+
|                                                  |
|  WORKOUT                                        |
|  COMPLETE                                       |
|  __________                                     |
|                                                  |
|  +-----------+  +-----------+  +-----------+    |
|  |   32:14   |  |    127    |  |    6/6    |    |
|  |   TIME    |  |   REPS    |  |   SETS    |    |
|  +-----------+  +-----------+  +-----------+    |
|                                                  |
|  Session Phases                                 |
|  +------------------------------------------+   |
|  |  [x] Warm-up                  Completed  |   |
|  |  [x] Cool-down                Completed  |   |
|  +------------------------------------------+   |
|                                                  |
|  Exercises                                      |
|  +------------------------------------------+   |
|  |  Pull-ups              3 sets, 24 reps   |   |
|  |  Rows                  3 sets, 27 reps   |   |
|  |  Dead Hang             3 sets, ~45s avg  |   |
|  |  ...                                     |   |
|  +------------------------------------------+   |
|                                                  |
|  +------------------------------------------+   |
|  |               DONE                       |   |
|  +------------------------------------------+   |
+--------------------------------------------------+
```

**Stat boxes:**
- 3-column grid, equal width
- Each box: cream-50 bg, shadow-sm, radius-lg
- Number: Fraunces 700, display-md, ink-900
- Label: Outfit 500, body-xs, uppercase, ink-500

**Entry animation:**
- Title slides down
- Stat boxes stagger in (left to right, 100ms apart)
- Content sections fade up after stats complete
- Subtle particle effect (earth-tone dots floating up) behind stats

---

## Part 3: Implementation Plan

### Phase 1: Foundation (index.css + fonts + dependencies)

**Tasks:**
1. Install framer-motion: `bun add framer-motion`
2. Add Google Fonts import for Fraunces and Outfit
3. Update CSS custom properties with new color system
4. Add new typography scale variables
5. Add new spacing, radius, and shadow variables
6. Add animation keyframes (CSS fallbacks for reduced-motion)
7. Update base styles (body, headings)
8. Add grain texture utility class
9. Update reduced-motion and high-contrast media queries

**Files to modify:**
- `package.json` (framer-motion dependency)
- `src/index.css`
- `index.html` (font preload)

### Phase 2: Base Components

**Tasks:**
1. Update `Button.tsx` with new styling
   - New variant styles matching design system
   - Add arrow icon option
   - Update sizes and padding
   - Add tap feedback animation

2. Update `ProgressRing.tsx`
   - SVG-based circular progress
   - Draining animation for rest timer
   - Color transition at thresholds

3. Create `ProgressBar.tsx` component
   - Linear progress for rep targets
   - Smooth fill animation

4. Update `Timer.tsx`
   - New typography
   - Integration with circular ring option

**Files to modify/create:**
- `src/components/base/Button.tsx`
- `src/components/base/ProgressRing.tsx`
- `src/components/base/ProgressBar.tsx` (new)
- `src/components/base/Timer.tsx`

### Phase 3: Layout & Home Screen

**Tasks:**
1. Update `AppLayout.tsx`
   - New background treatment
   - Grain texture overlay
   - Updated header/footer styling

2. Redesign `HomeScreen.tsx`
   - Split title layout
   - Decorative geometric element
   - New button arrangement (1 primary + 2 secondary grid)
   - Entry animations with stagger

**Files to modify:**
- `src/components/layout/AppLayout.tsx`
- `src/screens/HomeScreen.tsx`

### Phase 4: Workout Selection

**Tasks:**
1. Redesign `WorkoutSelectionScreen.tsx`
   - New card layout with numbers
   - Unique accent per card
   - Hover/tap states
   - Entry animation stagger

**Files to modify:**
- `src/screens/WorkoutSelectionScreen.tsx`

### Phase 5: Active Workout Screen

**Tasks:**
1. Update `RepCounter.tsx`
   - Geometric container for number
   - Ripple tap effect
   - Progress bar integration

2. Update `RestTimer.tsx`
   - Circular progress ring
   - Color transitions at thresholds
   - Rest tips rotation
   - Full-screen tap zone styling

3. Update `TimedHold.tsx`
   - Distinct phase designs
   - Full-screen countdown numbers
   - Expanding rings visual for active phase
   - Completion celebration

4. Update `ActiveWorkoutScreen.tsx`
   - Pill tabs for collapsible sections
   - New bottom bar design
   - Overall layout polish

**Files to modify:**
- `src/components/interactions/RepCounter.tsx`
- `src/components/interactions/RestTimer.tsx`
- `src/components/interactions/TimedHold.tsx`
- `src/screens/ActiveWorkoutScreen.tsx`

### Phase 6: Warmup & Cooldown

**Tasks:**
1. Update `GuidedMovementStep.tsx`
   - Apply new typography and colors
   - Update progress indicators
   - Polish animations

2. Update `WarmupScreen.tsx` and `CooldownScreen.tsx`
   - Consistent styling with active workout
   - Updated skip buttons

**Files to modify:**
- `src/components/interactions/GuidedMovementStep.tsx`
- `src/screens/WarmupScreen.tsx`
- `src/screens/CooldownScreen.tsx`

### Phase 7: Summary & Polish

**Tasks:**
1. Redesign `SessionSummaryScreen.tsx`
   - 3-column stat boxes
   - Updated exercise list
   - Celebration animation

2. Update `ExerciseLibraryScreen.tsx`
   - Apply new card styles
   - Consistent typography

3. Update `SettingsScreen.tsx`
   - Form controls with new styling
   - Section organization

4. Update `PracticeScreen.tsx`
   - Consistent with active workout styling

**Files to modify:**
- `src/screens/SessionSummaryScreen.tsx`
- `src/screens/ExerciseLibraryScreen.tsx`
- `src/screens/SettingsScreen.tsx`
- `src/screens/PracticeScreen.tsx`

### Phase 8: Animation Refinement

**Tasks:**
1. Implement framer-motion animations for:
   - Page transitions (AnimatePresence)
   - Shared element animations (layoutId)
   - Stagger effects (staggerChildren)
   - Spring physics (type: "spring")

2. Test and tune all animations
3. Verify reduced-motion support (useReducedMotion hook)
4. Performance optimization (will-change, GPU compositing)

**Files to modify:**
- Various component files
- `src/index.css` (CSS fallback keyframes)

---

## Part 4: Asset Requirements

### Fonts (Google Fonts)
```html
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,400;0,9..144,600;0,9..144,800&family=Outfit:wght@400;500;600&display=swap" rel="stylesheet">
```

### Icons Needed
- Arrow right (for primary button)
- Checkmark (for completion states)
- Gear/cog (for settings)
- Back arrow
- Plus/minus (for collapsible sections)

Recommendation: Use Lucide React icons (lightweight, consistent)

### Textures
- Grain/noise texture (SVG or CSS filter)
  - Can be generated with CSS: `filter: url(#noise)` with SVG filter
  - Or use a small repeating PNG at low opacity

---

## Part 5: Testing Checklist

### Visual Testing
- [ ] Light mode appearance
- [ ] Dark mode appearance
- [ ] High contrast mode
- [ ] Various screen sizes (320px to 428px width typical for mobile)
- [ ] Landscape orientation
- [ ] Font loading/fallback

### Interaction Testing
- [ ] All tap targets meet 44px minimum
- [ ] Hover states on desktop
- [ ] Focus states for keyboard navigation
- [ ] Animation smoothness (60fps target)
- [ ] Reduced motion preference respected

### Accessibility Testing
- [ ] Screen reader announcements
- [ ] Color contrast ratios (4.5:1 minimum for text)
- [ ] Focus indicators visible
- [ ] No information conveyed by color alone

---

## Appendix: Quick Reference

### Color Usage Guide
| Purpose | Light Mode | Dark Mode |
|---------|-----------|-----------|
| Page background | cream-100 | ink-950 |
| Card background | cream-50 / white | ink-800 |
| Primary text | ink-900 | cream-100 |
| Secondary text | ink-600 | cream-300 |
| Muted text | ink-500 | cream-400 |
| Primary accent | earth-600 | earth-500 |
| Success | moss-500 | moss-400 |
| Warning | terra-500 | terra-400 |
| Achievement | gold-500 | gold-400 |

### Button Variants
| Variant | Background | Text | Border |
|---------|-----------|------|--------|
| Primary | earth-600 | white | none |
| Secondary | cream-50 | ink-800 | cream-300 |
| Ghost | transparent | ink-700 | none |

### Animation Timing Guide
| Element | Duration | Easing | Delay |
|---------|----------|--------|-------|
| Page title | 300ms | ease-out-expo | 0ms |
| Primary CTA | 300ms | ease-out-expo | 200ms |
| Secondary buttons | 300ms | ease-out-expo | 300ms+ |
| Tap feedback | 100ms | ease-out | 0ms |
| Progress bar | 200ms | ease-out | 0ms |
| Countdown numbers | 500ms | spring | 0ms |
