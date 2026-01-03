import { Button } from '@/components/base/Button'
import { useNavigationStore } from '@/stores'

export function HomeScreen() {
  const navigate = useNavigationStore((state) => state.navigate)

  return (
    <div className="flex-1 flex flex-col items-center justify-center p-6 gap-6">
      <h1 className="text-3xl font-bold text-center mb-8">
        Jireh's Calisthenics
      </h1>

      <div className="w-full max-w-sm flex flex-col gap-4">
        <Button
          size="xl"
          fullWidth
          onClick={() => navigate('workout-selection')}
        >
          Start Workout
        </Button>

        <Button
          variant="secondary"
          size="xl"
          fullWidth
          onClick={() => navigate('exercise-library')}
        >
          Exercise Library
        </Button>

        <Button
          variant="secondary"
          size="xl"
          fullWidth
          onClick={() => navigate('settings')}
        >
          Settings
        </Button>
      </div>
    </div>
  )
}
