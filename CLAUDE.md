# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Package Manager

This project uses **Bun** as the package manager and runtime.

- Use `bun install` to install dependencies
- Use `bun run <script>` to run scripts (e.g., `bun run dev`, `bun run build`)
- Use `bun run test:run` to run tests (Vitest)
- Do not use npm, yarn, or `bun test` (which runs Bun's native test runner)

## Commands

```bash
bun run dev              # Start development server
bun run build            # Type-check and build for production
bun run lint             # Run ESLint
bun run test:run         # Run all tests once
bun run test             # Run tests in watch mode
bun run test:run src/stores/settingsStore.test.ts  # Run single test file
```

## Architecture

### Tech Stack
- React 19 + TypeScript + Vite
- Zustand for state management (persisted to localStorage)
- Tailwind CSS v4 with custom theme
- Framer Motion for animations
- Vitest + Testing Library for tests

### Directory Structure
- `src/screens/` - Full-page screen components (HomeScreen, WarmupScreen, etc.)
- `src/components/base/` - Reusable UI primitives (Button, Timer, ProgressRing)
- `src/components/interactions/` - Workout interaction components (RepCounter, TimedHold, RestTimer)
- `src/components/layout/` - Layout components (AppLayout, ActionBar)
- `src/stores/` - Zustand stores with localStorage persistence
- `src/data/` - Static workout/exercise data definitions
- `src/hooks/` - Custom React hooks
- `src/types/` - TypeScript type definitions
- `src/utils/` - Utility functions

### State Management
Zustand stores in `src/stores/`:
- `settingsStore` - User preferences (audio cues, deload mode, dark mode)
- `workoutSessionStore` - Active workout state (current exercise, sets, reps, rest)
- `navigationStore` - Screen navigation (custom router, no react-router)
- `exerciseHistoryStore` - Historical exercise performance
- `practiceStore` - Practice mode state

### Navigation
Custom screen-based navigation via `navigationStore` - no URL routing. Screens defined in `src/routes.ts`, rendered by `App.tsx` switch statement.

### Color System
Theme-aware colors defined in `src/index.css`. Use these instead of Tailwind defaults:
- `ink-*` - Dark text/backgrounds (ink-950 to ink-500)
- `cream-*` - Light backgrounds (cream-50 to cream-400)
- `earth-*` - Primary accent (warm browns)
- `moss-*` - Success states
- `terra-*` - Warning/attention
- `gold-*` - Achievement/celebration

Always use dark mode variants: `bg-cream-100 dark:bg-ink-950`, `text-ink-600 dark:text-cream-400`

### Workout Flow
Home -> WorkoutSelection -> Warmup -> ActiveWorkout -> Cooldown -> SessionSummary

The `GuidedMovementStep` component is reused across Warmup and Cooldown screens for consistent movement guidance UI.
