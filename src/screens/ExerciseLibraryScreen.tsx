import { useState } from 'react'
import { Button } from '@/components/base/Button'
import { allExercises, getExercisesByCategory, getExerciseById } from '@/data/exercises'
import { useNavigationStore, usePracticeStore } from '@/stores'
import type { ExerciseCategory } from '@/types'

const categories: ExerciseCategory[] = ['push', 'pull', 'core', 'legs', 'holds']

export function ExerciseLibraryScreen() {
  const navigate = useNavigationStore((state) => state.navigate)
  const startPractice = usePracticeStore((state) => state.startPractice)

  const [selectedCategory, setSelectedCategory] = useState<ExerciseCategory | 'all'>('all')
  const [selectedExerciseId, setSelectedExerciseId] = useState<string | null>(null)

  const exercises = selectedCategory === 'all'
    ? allExercises
    : getExercisesByCategory(selectedCategory)

  // Use getExerciseById to ensure we find the exercise even if it's filtered out
  const selectedExercise = selectedExerciseId
    ? getExerciseById(selectedExerciseId)
    : null

  const handleStartPractice = () => {
    if (selectedExerciseId) {
      startPractice(selectedExerciseId)
      navigate('practice')
    }
  }

  const handleNavigateToProgression = (exerciseId: string) => {
    setSelectedExerciseId(exerciseId)
  }

  return (
    <div className="flex-1 flex flex-col p-6">
      {/* Category filter */}
      <div className="flex gap-2 overflow-x-auto pb-4 mb-4 -mx-6 px-6">
        <button
          onClick={() => setSelectedCategory('all')}
          className={`px-4 py-2 rounded-full whitespace-nowrap touch-target ${
            selectedCategory === 'all'
              ? 'bg-accent-600 text-white'
              : 'bg-neutral-100 dark:bg-neutral-800'
          }`}
        >
          All
        </button>
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-4 py-2 rounded-full whitespace-nowrap capitalize touch-target ${
              selectedCategory === cat
                ? 'bg-accent-600 text-white'
                : 'bg-neutral-100 dark:bg-neutral-800'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Exercise list or detail view */}
      {selectedExercise ? (
        <div className="flex-1 flex flex-col">
          <button
            onClick={() => setSelectedExerciseId(null)}
            className="text-left text-accent-600 mb-4"
          >
            Back to list
          </button>

          {/* Scrollable content area */}
          <div className="flex-1 overflow-y-auto">
            <h2 className="text-2xl font-bold mb-2">{selectedExercise.name}</h2>
            <p className="text-neutral-500 capitalize mb-4">
              {selectedExercise.category} - Level {selectedExercise.progressionLevel}
            </p>

            <p className="mb-6">{selectedExercise.description}</p>

            <div className="mb-6">
              <h3 className="font-semibold mb-2">Form Cues</h3>
              <ul className="space-y-1 text-neutral-600 dark:text-neutral-400">
                {selectedExercise.formCues.map((cue, index) => (
                  <li key={index}>{cue}</li>
                ))}
              </ul>
            </div>

            {selectedExercise.equipmentSetup && (
              <div className="mb-6">
                <h3 className="font-semibold mb-2">Equipment Setup</h3>
                <p className="text-neutral-600 dark:text-neutral-400">
                  {selectedExercise.equipmentSetup}
                </p>
              </div>
            )}

            <div className="mb-6">
              <h3 className="font-semibold mb-2">Target</h3>
              <p className="text-neutral-600 dark:text-neutral-400">
                {selectedExercise.targetDurationSeconds
                  ? `${selectedExercise.targetDurationSeconds} seconds`
                  : `${selectedExercise.targetRepsMin}-${selectedExercise.targetRepsMax} reps`}
              </p>
            </div>

            {/* Progression Path */}
            <div className="mb-6">
              <h3 className="font-semibold mb-2">Progression Path</h3>
              <div className="space-y-2">
                {selectedExercise.previousExercise && (
                  <button
                    onClick={() => handleNavigateToProgression(selectedExercise.previousExercise!)}
                    className="w-full p-3 text-left rounded-lg bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 dark:hover:bg-neutral-700 transition-colors"
                  >
                    <span className="text-sm text-neutral-500">Previous:</span>
                    <p className="font-medium">
                      {getExerciseById(selectedExercise.previousExercise)?.name ?? 'Unknown'}
                    </p>
                  </button>
                )}

                {selectedExercise.nextExercise && (
                  <button
                    onClick={() => handleNavigateToProgression(selectedExercise.nextExercise!)}
                    className="w-full p-3 text-left rounded-lg bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 dark:hover:bg-neutral-700 transition-colors"
                  >
                    <span className="text-sm text-neutral-500">Next:</span>
                    <p className="font-medium">
                      {getExerciseById(selectedExercise.nextExercise)?.name ?? 'Unknown'}
                    </p>
                  </button>
                )}

                {!selectedExercise.previousExercise && !selectedExercise.nextExercise && (
                  <p className="text-neutral-500 text-sm">
                    This exercise has no progressions defined.
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Practice button - fixed at bottom */}
          <div className="pt-4 border-t border-neutral-200 dark:border-neutral-800 mt-4">
            <Button fullWidth onClick={handleStartPractice}>
              Practice This Exercise
            </Button>
          </div>
        </div>
      ) : (
        <div className="flex-1 overflow-y-auto -mx-6 px-6">
          <ul className="space-y-2">
            {exercises.map((exercise) => (
              <li key={exercise.id}>
                <button
                  onClick={() => setSelectedExerciseId(exercise.id)}
                  className="w-full p-4 text-left rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors touch-target"
                >
                  <h3 className="font-semibold">{exercise.name}</h3>
                  <p className="text-sm text-neutral-500 capitalize">
                    {exercise.category} - Level {exercise.progressionLevel}
                  </p>
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}
