import { Button } from '@/components/base/Button'
import { useNavigationStore, useWorkoutSessionStore, useExerciseHistoryStore } from '@/stores'
import { getWorkoutById } from '@/data/workouts'
import { getExerciseById } from '@/data/exercises'
import { motion, type Variants } from 'framer-motion'
import { Check, X } from 'lucide-react'

const easeOutExpo = [0.16, 1, 0.3, 1] as const

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

  const duration = startTime && endTime ? endTime - startTime : 0

  const totalReps = exerciseProgress.reduce((sum, p) =>
    sum + p.repsPerSet.reduce((a, b) => a + b, 0), 0
  )

  const totalSets = exerciseProgress.reduce((sum, p) => sum + p.completedSets, 0)

  const getExerciseDisplay = (exerciseId: string) => {
    const progress = exerciseProgress.find(p => p.exerciseId === exerciseId)
    if (!progress || progress.completedSets === 0) return 'Not completed'

    const exercise = getExerciseById(exerciseId)

    if (exercise?.type === 'timed' || exercise?.type === 'timed-per-side') {
      const avgDuration = progress.durationPerSet.length > 0
        ? Math.round(progress.durationPerSet.reduce((a, b) => a + b, 0) / progress.durationPerSet.length)
        : 0
      return `${progress.completedSets} sets, ~${avgDuration}s avg`
    }

    const exerciseReps = progress.repsPerSet.reduce((a, b) => a + b, 0)
    return `${progress.completedSets} sets, ${exerciseReps} total reps`
  }

  const exercises = workout?.pairs.flatMap(pair => [
    getExerciseById(pair.exercise1.exerciseId),
    getExerciseById(pair.exercise2.exerciseId)
  ]).filter(Boolean) ?? []

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1, delayChildren: 0.1 }
    }
  }

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: easeOutExpo } }
  }

  return (
    <motion.div
      className="flex-1 flex flex-col p-6 bg-cream-100 dark:bg-ink-950 bg-grain"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Title */}
      <motion.div className="mb-8" variants={itemVariants}>
        <h2 className="font-display font-semibold text-display-lg text-ink-900 dark:text-cream-100">
          WORKOUT
        </h2>
        <h2 className="font-display font-semibold text-display-lg text-ink-900 dark:text-cream-100">
          COMPLETE
        </h2>
        <div className="mt-3 h-1 w-16 bg-earth-500 dark:bg-earth-400" />
      </motion.div>

      {/* Stat boxes */}
      <motion.div className="grid grid-cols-3 gap-3 mb-6" variants={itemVariants}>
        <div className="p-4 rounded-xl bg-cream-50 dark:bg-ink-800 shadow-[var(--shadow-sm)] text-center">
          <p className="font-display font-bold text-display-md text-ink-900 dark:text-cream-100">
            {formatDuration(duration)}
          </p>
          <p className="text-body-xs uppercase tracking-wider text-ink-500 dark:text-cream-400 mt-1">
            Time
          </p>
        </div>
        <div className="p-4 rounded-xl bg-cream-50 dark:bg-ink-800 shadow-[var(--shadow-sm)] text-center">
          <p className="font-display font-bold text-display-md text-ink-900 dark:text-cream-100">
            {totalReps}
          </p>
          <p className="text-body-xs uppercase tracking-wider text-ink-500 dark:text-cream-400 mt-1">
            Reps
          </p>
        </div>
        <div className="p-4 rounded-xl bg-cream-50 dark:bg-ink-800 shadow-[var(--shadow-sm)] text-center">
          <p className="font-display font-bold text-display-md text-ink-900 dark:text-cream-100">
            {totalSets}
          </p>
          <p className="text-body-xs uppercase tracking-wider text-ink-500 dark:text-cream-400 mt-1">
            Sets
          </p>
        </div>
      </motion.div>

      {/* Scrollable content */}
      <div className="flex-1 overflow-y-auto space-y-4">
        {/* Session Phases */}
        <motion.div
          className="p-4 rounded-xl bg-cream-50 dark:bg-ink-800 border border-cream-300/60 dark:border-ink-700"
          variants={itemVariants}
        >
          <h3 className="font-semibold mb-3 text-ink-800 dark:text-cream-100 text-body-sm uppercase tracking-wider">
            Session Phases
          </h3>
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-body-md text-ink-700 dark:text-cream-300">Warm-up</span>
              <span className={`flex items-center gap-1 text-body-sm ${
                warmupStatus === 'completed' ? 'text-moss-600 dark:text-moss-400' :
                warmupStatus === 'skipped' ? 'text-terra-600 dark:text-terra-400' :
                'text-ink-500'
              }`}>
                {warmupStatus === 'completed' && <Check size={16} />}
                {warmupStatus === 'skipped' && <X size={16} />}
                {warmupStatus === 'completed' ? 'Completed' :
                 warmupStatus === 'skipped' ? 'Skipped' : 'Pending'}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-body-md text-ink-700 dark:text-cream-300">Cool-down</span>
              <span className={`flex items-center gap-1 text-body-sm ${
                cooldownStatus === 'completed' ? 'text-moss-600 dark:text-moss-400' :
                cooldownStatus === 'skipped' ? 'text-terra-600 dark:text-terra-400' :
                'text-ink-500'
              }`}>
                {cooldownStatus === 'completed' && <Check size={16} />}
                {cooldownStatus === 'skipped' && <X size={16} />}
                {cooldownStatus === 'completed' ? 'Completed' :
                 cooldownStatus === 'skipped' ? 'Skipped' : 'Pending'}
              </span>
            </div>
          </div>
        </motion.div>

        {/* Exercises */}
        <motion.div
          className="p-4 rounded-xl bg-cream-50 dark:bg-ink-800 border border-cream-300/60 dark:border-ink-700"
          variants={itemVariants}
        >
          <h3 className="font-semibold mb-3 text-ink-800 dark:text-cream-100 text-body-sm uppercase tracking-wider">
            Exercises
          </h3>
          <ul className="space-y-3">
            {exercises.map((exercise) => (
              <li key={exercise?.id} className="flex justify-between items-start">
                <span className="text-body-md text-ink-700 dark:text-cream-300">{exercise?.name}</span>
                <span className="text-body-sm text-ink-500 dark:text-cream-400 text-right">
                  {exercise ? getExerciseDisplay(exercise.id) : 'N/A'}
                </span>
              </li>
            ))}
          </ul>
        </motion.div>
      </div>

      {/* Done button */}
      <motion.div className="mt-6" variants={itemVariants}>
        <Button fullWidth onClick={handleDone}>
          DONE
        </Button>
      </motion.div>
    </motion.div>
  )
}
