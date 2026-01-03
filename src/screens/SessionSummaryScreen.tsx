import { Button } from '@/components/base/Button'
import { useNavigationStore, useWorkoutSessionStore, useExerciseHistoryStore } from '@/stores'
import { getWorkoutById } from '@/data/workouts'
import { getExerciseById } from '@/data/exercises'

export function SessionSummaryScreen() {
  const navigate = useNavigationStore((state) => state.navigate)
  const {
    workoutId,
    startTime,
    endTime,
    exerciseProgress,
    warmupStatus,
    cooldownStatus,
    resetSession
  } = useWorkoutSessionStore()
  const updateExerciseHistory = useExerciseHistoryStore((state) => state.updateExerciseHistory)

  const workout = workoutId ? getWorkoutById(workoutId) : null

  const handleDone = () => {
    // Save to exercise history before resetting
    exerciseProgress.forEach(progress => {
      const lastReps = progress.repsPerSet[progress.repsPerSet.length - 1]
      const lastDuration = progress.durationPerSet[progress.durationPerSet.length - 1]

      updateExerciseHistory(progress.exerciseId, {
        ...(lastReps ? { lastReps } : {}),
        ...(lastDuration ? { lastDuration } : {})
      })
    })

    resetSession()
    navigate('home')
  }

  const formatDuration = (ms: number) => {
    const totalSeconds = Math.floor(ms / 1000)
    const minutes = Math.floor(totalSeconds / 60)
    const seconds = totalSeconds % 60
    return `${minutes}:${seconds.toString().padStart(2, '0')}`
  }

  // Use endTime for accurate duration
  const duration = startTime && endTime ? endTime - startTime : 0

  // Get exercise display text based on progress data
  const getExerciseDisplay = (exerciseId: string) => {
    const progress = exerciseProgress.find(p => p.exerciseId === exerciseId)
    if (!progress || progress.completedSets === 0) return 'Not completed'

    const exercise = getExerciseById(exerciseId)

    // For timed exercises, show duration
    if (exercise?.type === 'timed' || exercise?.type === 'timed-per-side') {
      const avgDuration = progress.durationPerSet.length > 0
        ? Math.round(progress.durationPerSet.reduce((a, b) => a + b, 0) / progress.durationPerSet.length)
        : 0
      return `${progress.completedSets} sets, ~${avgDuration}s avg`
    }

    // For rep exercises, show reps
    const totalReps = progress.repsPerSet.reduce((a, b) => a + b, 0)
    return `${progress.completedSets} sets, ${totalReps} total reps`
  }

  // Get all exercises from the workout
  const exercises = workout?.pairs.flatMap(pair => [
    getExerciseById(pair.exercise1.exerciseId),
    getExerciseById(pair.exercise2.exerciseId)
  ]).filter(Boolean) ?? []

  return (
    <div className="flex-1 flex flex-col p-6">
      <h2 className="text-2xl font-bold mb-6">Workout Complete</h2>

      {/* Summary content */}
      <div className="flex-1 overflow-y-auto">
        <div className="p-6 rounded-xl bg-neutral-100 dark:bg-neutral-800 mb-4">
          <h3 className="font-semibold mb-2">Total Duration</h3>
          <p className="text-3xl font-bold font-mono">{formatDuration(duration)}</p>
        </div>

        {/* Session Phases */}
        <div className="p-6 rounded-xl bg-neutral-100 dark:bg-neutral-800 mb-4">
          <h3 className="font-semibold mb-4">Session Phases</h3>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span>Warm-up</span>
              <span className={`text-sm ${
                warmupStatus === 'completed' ? 'text-green-600 dark:text-green-400' :
                warmupStatus === 'skipped' ? 'text-yellow-600 dark:text-yellow-400' :
                'text-neutral-500'
              }`}>
                {warmupStatus === 'completed' ? 'Completed' :
                 warmupStatus === 'skipped' ? 'Skipped' :
                 'Pending'}
              </span>
            </div>
            <div className="flex justify-between">
              <span>Cool-down</span>
              <span className={`text-sm ${
                cooldownStatus === 'completed' ? 'text-green-600 dark:text-green-400' :
                cooldownStatus === 'skipped' ? 'text-yellow-600 dark:text-yellow-400' :
                'text-neutral-500'
              }`}>
                {cooldownStatus === 'completed' ? 'Completed' :
                 cooldownStatus === 'skipped' ? 'Skipped' :
                 'Pending'}
              </span>
            </div>
          </div>
        </div>

        {/* Exercises Completed */}
        <div className="p-6 rounded-xl bg-neutral-100 dark:bg-neutral-800">
          <h3 className="font-semibold mb-4">Exercises Completed</h3>
          <ul className="space-y-2">
            {exercises.map((exercise) => (
              <li key={exercise?.id} className="flex justify-between items-start">
                <span>{exercise?.name}</span>
                <span className="text-neutral-500 text-sm text-right">
                  {exercise ? getExerciseDisplay(exercise.id) : 'N/A'}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="mt-auto pt-6">
        <Button fullWidth onClick={handleDone}>
          Done
        </Button>
      </div>
    </div>
  )
}
