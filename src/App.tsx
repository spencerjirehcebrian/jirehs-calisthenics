import { lazy, Suspense } from 'react'
import { useNavigationStore } from '@/stores'
import { AppLayout } from '@/components/layout/AppLayout'
import { Button } from '@/components/base/Button'
import { ErrorBoundary } from '@/components/base/ErrorBoundary'
import { routes } from '@/routes'
import { useExitProtection } from '@/hooks'

// Static import for home screen (entry point)
import { HomeScreen } from '@/screens/HomeScreen'

// Lazy load all other screens for code splitting
const WorkoutSelectionScreen = lazy(() =>
  import('@/screens/WorkoutSelectionScreen').then((m) => ({
    default: m.WorkoutSelectionScreen
  }))
)
const WarmupScreen = lazy(() =>
  import('@/screens/WarmupScreen').then((m) => ({ default: m.WarmupScreen }))
)
const ActiveWorkoutScreen = lazy(() =>
  import('@/screens/ActiveWorkoutScreen').then((m) => ({
    default: m.ActiveWorkoutScreen
  }))
)
const CooldownScreen = lazy(() =>
  import('@/screens/CooldownScreen').then((m) => ({ default: m.CooldownScreen }))
)
const SessionSummaryScreen = lazy(() =>
  import('@/screens/SessionSummaryScreen').then((m) => ({
    default: m.SessionSummaryScreen
  }))
)
const ExerciseLibraryScreen = lazy(() =>
  import('@/screens/ExerciseLibraryScreen').then((m) => ({
    default: m.ExerciseLibraryScreen
  }))
)
const SettingsScreen = lazy(() =>
  import('@/screens/SettingsScreen').then((m) => ({ default: m.SettingsScreen }))
)
const PracticeScreen = lazy(() =>
  import('@/screens/PracticeScreen').then((m) => ({ default: m.PracticeScreen }))
)

function ScreenLoader() {
  return (
    <div className="flex-1 flex items-center justify-center">
      <div className="text-neutral-500 dark:text-neutral-400">Loading...</div>
    </div>
  )
}

function AppRouter() {
  const currentScreen = useNavigationStore((state) => state.currentScreen)

  const renderScreen = () => {
    switch (currentScreen) {
      case 'home':
        return <HomeScreen />
      case 'workout-selection':
        return <WorkoutSelectionScreen />
      case 'warmup':
        return <WarmupScreen />
      case 'active-workout':
        return <ActiveWorkoutScreen />
      case 'cooldown':
        return <CooldownScreen />
      case 'session-summary':
        return <SessionSummaryScreen />
      case 'exercise-library':
        return <ExerciseLibraryScreen />
      case 'settings':
        return <SettingsScreen />
      case 'practice':
        return <PracticeScreen />
      default:
        return <HomeScreen />
    }
  }

  return <Suspense fallback={<ScreenLoader />}>{renderScreen()}</Suspense>
}

function AppHeader() {
  const { currentScreen, goBack } = useNavigationStore()
  const route = routes[currentScreen]

  if (!route.showHeader) return null

  return (
    <div className="flex items-center gap-4">
      {route.showBackButton && (
        <Button variant="ghost" size="sm" onClick={goBack}>
          Back
        </Button>
      )}
      <h1 className="text-lg font-semibold">{route.title}</h1>
    </div>
  )
}

function App() {
  const currentScreen = useNavigationStore((state) => state.currentScreen)
  const route = routes[currentScreen]

  // Prevent accidental page exit during active workouts
  useExitProtection()

  return (
    <ErrorBoundary>
      <AppLayout header={route.showHeader ? <AppHeader /> : undefined}>
        <AppRouter />
      </AppLayout>
    </ErrorBoundary>
  )
}

export default App
