import { Button } from '@/components/base/Button'
import { RepCounter, TimedHold, HoldToSkip } from '@/components/interactions'
import { useNavigationStore, usePracticeStore, useSettingsStore } from '@/stores'
import { getExerciseById } from '@/data/exercises'

export function PracticeScreen() {
  const navigate = useNavigationStore((state) => state.navigate)
  const goBack = useNavigationStore((state) => state.goBack)
  const { exerciseId, currentReps, incrementReps, resetPractice } = usePracticeStore()
  const holdCountdown = useSettingsStore((state) => state.holdCountdown)

  const exercise = exerciseId ? getExerciseById(exerciseId) : null

  const handleComplete = () => {
    // Practice mode does not track/log - just return to library
    resetPractice()
    goBack()
  }

  const handleExit = () => {
    resetPractice()
    goBack()
  }

  if (!exercise) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-6 gap-4">
        <p>No exercise selected for practice</p>
        <Button onClick={() => navigate('exercise-library')}>
          Go to Exercise Library
        </Button>
      </div>
    )
  }

  return (
    <div className="flex-1 flex flex-col relative">
      {/* Exit button - top left */}
      <div className="absolute top-4 left-4 z-10">
        <Button variant="ghost" size="sm" onClick={handleExit}>
          Exit Practice
        </Button>
      </div>

      {/* Main content area */}
      <div className="flex-1 flex flex-col overflow-y-auto">
        {/* Exercise name */}
        <div className="p-4 pt-16 text-center">
          <p className="text-sm text-accent-600 font-medium mb-1">Practice Mode</p>
          <h1 className="text-3xl font-bold">{exercise.name}</h1>
        </div>

        {/* Interaction area based on exercise type */}
        {exercise.type === 'reps' ? (
          <RepCounter
            currentReps={currentReps}
            targetRepsMin={exercise.targetRepsMin}
            targetRepsMax={exercise.targetRepsMax}
            onIncrement={incrementReps}
          />
        ) : (
          <TimedHold
            targetSeconds={exercise.targetDurationSeconds ?? 30}
            countdownDuration={holdCountdown}
            onComplete={handleComplete}
          />
        )}

        {/* Form cues - always shown in practice */}
        <div className="px-4 pb-4">
          <div className="p-4 rounded-lg bg-neutral-100 dark:bg-neutral-800">
            <h3 className="font-semibold mb-2">Form Cues</h3>
            <ul className="text-sm space-y-1 text-neutral-600 dark:text-neutral-400">
              {exercise.formCues.map((cue, index) => (
                <li key={index}>{cue}</li>
              ))}
            </ul>
          </div>
        </div>

        {/* Equipment setup if exists */}
        {exercise.equipmentSetup && (
          <div className="px-4 pb-4">
            <div className="p-4 rounded-lg bg-neutral-100 dark:bg-neutral-800">
              <h3 className="font-semibold mb-2">Equipment Setup</h3>
              <p className="text-sm text-neutral-600 dark:text-neutral-400">
                {exercise.equipmentSetup}
              </p>
            </div>
          </div>
        )}

        {/* Target info */}
        <div className="px-4 pb-4">
          <div className="p-4 rounded-lg bg-neutral-100 dark:bg-neutral-800">
            <h3 className="font-semibold mb-2">Target</h3>
            <p className="text-sm text-neutral-600 dark:text-neutral-400">
              {exercise.targetDurationSeconds
                ? `${exercise.targetDurationSeconds} seconds`
                : `${exercise.targetRepsMin}-${exercise.targetRepsMax} reps`}
            </p>
          </div>
        </div>
      </div>

      {/* Hold to skip for early exit */}
      <HoldToSkip onSkip={handleComplete} position="bottom-right" />

      {/* Done button for rep exercises */}
      {exercise.type === 'reps' && (
        <div className="p-4 border-t border-neutral-200 dark:border-neutral-800">
          <Button fullWidth onClick={handleComplete}>
            Done
          </Button>
        </div>
      )}
    </div>
  )
}
