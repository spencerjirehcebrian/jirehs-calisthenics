# Jireh's Calisthenics

A Progressive Web App (PWA) for structured 3-day-per-week calisthenics workouts. Designed for use during active exercise with minimal cognitive load and maximum reliability.

## Features

- **3 Workout Programs** (A, B, C) with paired exercises
- **Guided Warm-up Flow** with step-by-step movements and timers
- **Active Workout Mode** with rep counters and timed holds
- **Guided Cool-down Flow** with stretches and hold timers
- **Exercise Library** with detailed form cues and progression paths
- **Practice Mode** for individual exercise practice
- **Audio Cues** with configurable notifications (synthesized, no external files)
- **Offline-First PWA** with full offline support
- **Dark Mode** (follows system preference)
- **Deload Mode** option for recovery weeks

## Tech Stack

- React 19 + TypeScript
- Vite 7
- Tailwind CSS v4
- Zustand (state management with localStorage persistence)
- Web Audio API (synthesized audio cues)
- vite-plugin-pwa (service worker with Workbox)
- Vitest + React Testing Library (unit/component tests)
- Playwright (E2E tests)

## Prerequisites

- Bun 1.x or later

## Development Setup

1. Clone the repository:
   ```bash
   git clone <repo-url>
   cd jirehs-calisthenics
   ```

2. Install dependencies:
   ```bash
   bun install
   ```

3. Start development server:
   ```bash
   bun run dev
   ```

4. Open http://localhost:5173 in your browser

## Available Scripts

| Script | Description |
|--------|-------------|
| `bun run dev` | Start development server with HMR |
| `bun run build` | Type-check and build for production |
| `bun run preview` | Preview production build locally |
| `bun run lint` | Run ESLint |
| `bun run test` | Run unit tests in watch mode |
| `bun run test:run` | Run unit tests once |
| `bun run test:coverage` | Run unit tests with coverage report |
| `bun run test:e2e` | Run Playwright E2E tests (all browsers) |
| `bun run test:e2e:chromium` | Run E2E tests on Chromium only |
| `bun run test:e2e:ui` | Run E2E tests with interactive UI |
| `bun run test:e2e:headed` | Run E2E tests with visible browser |

## Building for Production

```bash
bun run build
```

Output will be in the `dist/` directory. The build includes:
- Minified JavaScript bundles with code splitting
- Optimized CSS
- Service worker for offline support
- Web app manifest for PWA installation

## Deployment

The app is a static site that can be deployed to any static hosting provider.

### Vercel

```bash
npx vercel
```

Or connect your repository for automatic deployments.

### Netlify

```bash
npx netlify deploy --prod --dir=dist
```

Or use the Netlify UI to deploy from your repository.

### GitHub Pages

1. Build the project: `bun run build`
2. Deploy the `dist/` folder to GitHub Pages
3. Configure a custom domain or use `<username>.github.io/<repo>`

### Manual Deployment

Upload the contents of `dist/` to any static file server.

**Server Requirements:**
- Serve `index.html` for all routes (SPA fallback)
- HTTPS enabled (required for PWA and service worker)
- Correct MIME types for assets (JS, CSS, etc.)

## PWA Installation

The app can be installed as a standalone application:

- **iOS Safari**: Tap Share > Add to Home Screen
- **Android Chrome**: Tap menu > Install App (or Add to Home Screen)
- **Desktop Chrome/Edge**: Click the install icon in the address bar

## Project Structure

```
src/
  components/
    base/           # Button, Timer, ProgressRing, ErrorBoundary
    interactions/   # RepCounter, TimedHold, RestTimer, HoldToSkip
    layout/         # AppLayout
  screens/          # 9 screen components
  stores/           # Zustand stores (settings, history, session, navigation, practice)
  hooks/            # Custom React hooks (useTimer, useAudioCue, etc.)
  data/             # Exercise, workout, warm-up, cool-down data
  types/            # TypeScript type definitions
  utils/            # Utility functions (audio, guidedFlow, storage)
  test/             # Test setup and utilities
e2e/
  helpers/          # Selectors and navigation utilities
  page-objects/     # Page Object Models for screens
  tests/            # Playwright test specs
```

## Audio

The app uses Web Audio API to synthesize audio cues - no external audio files are required. Audio cues include:
- Rest timer warnings and completion
- Set completion chimes
- Hold timer countdown ticks and completion

See `public/sounds/README.md` for technical details.

## Configuration

### Settings (persisted to localStorage)

- **Audio Cues**: Individual toggles for each cue type
- **Hold Countdown**: 2 or 3 seconds before timed holds start
- **Deload Mode**: Reduces sets from 3 to 2 for recovery weeks

### Theme

The app follows system theme preference (`prefers-color-scheme`). No manual toggle is provided.

## Testing

### Unit Tests (Vitest)

Run the unit test suite:

```bash
bun run test:run
```

The project includes 287 unit tests covering:
- Stores (settings, navigation, workout session, exercise history, practice)
- Hooks (useTimer, useHoldDetection, useKeyboardInteraction, useElapsedTime)
- Components (RepCounter, TimedHold, RestTimer, HoldToSkip)
- Utilities (audio, guidedFlow)
- Integration tests for workout flows

### E2E Tests (Playwright)

Run end-to-end tests:

```bash
bun run test:e2e:chromium   # Fast - Chromium only
bun run test:e2e            # Full - All browsers
bun run test:e2e:ui         # Interactive UI mode
```

The E2E test suite includes 48 tests covering:
- Smoke tests (app loading, navigation)
- Workout flows (complete workout, warmup skip)
- Interaction components (rep counter, hold-to-skip, rest timer)
- Settings persistence across page reloads
- Deload mode behavior

First time setup for E2E tests:
```bash
bunx playwright install chromium
```

## Browser Support

- Chrome/Edge (desktop and mobile)
- Safari (desktop and iOS)
- Firefox

PWA features require HTTPS in production.

## License

[Add license here]
