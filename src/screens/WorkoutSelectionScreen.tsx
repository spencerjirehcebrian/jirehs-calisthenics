import { useNavigationStore, useWorkoutSessionStore } from '@/stores'
import { workouts } from '@/data/workouts'
import type { WorkoutId } from '@/types'

export function WorkoutSelectionScreen() {
  const navigate = useNavigationStore((state) => state.navigate)
  const startWorkout = useWorkoutSessionStore((state) => state.startWorkout)

  const handleSelectWorkout = (workoutId: WorkoutId) => {
    startWorkout(workoutId)
    navigate('warmup')
  }

  return (
    <div className="flex-1 flex flex-col p-6">
      <h2 className="text-2xl font-bold mb-6">Choose Your Workout</h2>

      <div className="flex flex-col gap-4">
        {workouts.map((workout) => (
          <button
            key={workout.id}
            onClick={() => handleSelectWorkout(workout.id)}
            className="p-6 rounded-xl border-2 border-neutral-200 dark:border-neutral-700 hover:border-accent-500 transition-colors text-left touch-target"
          >
            <h3 className="text-xl font-bold">{workout.name}</h3>
            <p className="text-neutral-600 dark:text-neutral-400">
              {workout.subtitle}
            </p>
          </button>
        ))}
      </div>
    </div>
  )
}
