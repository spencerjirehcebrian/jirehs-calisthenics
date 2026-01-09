import { useState } from 'react'
import { Button } from '@/components/base/Button'
import { allExercises, getExercisesByCategory, getExerciseById } from '@/data/exercises'
import { useNavigationStore, usePracticeStore } from '@/stores'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowLeft, ChevronRight } from 'lucide-react'
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
    <motion.div
      className="flex-1 flex flex-col p-6 bg-cream-100 dark:bg-ink-950 bg-grain"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      {/* Back button */}
      <motion.button
        onClick={() => navigate('home')}
        className="flex items-center gap-2 text-ink-600 dark:text-cream-400 hover:text-ink-900 dark:hover:text-cream-100 transition-colors mb-6 touch-target focus-interactive rounded-lg w-fit"
        aria-label="Go back"
        whileHover={{ x: -4 }}
        whileTap={{ scale: 0.95 }}
        initial={{ opacity: 0, x: -10 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.3 }}
      >
        <ArrowLeft className="w-5 h-5" />
      </motion.button>

      {/* Title */}
      <h1 className="font-display font-semibold text-display-lg text-ink-900 dark:text-cream-100 mb-6">
        EXERCISE LIBRARY
      </h1>

      {/* Category filter pills */}
      <div className="flex gap-2 overflow-x-auto pb-4 mb-4 -mx-6 px-6">
        <button
          onClick={() => setSelectedCategory('all')}
          className={`px-4 py-2 rounded-full whitespace-nowrap touch-target transition-all text-body-sm font-medium focus-interactive ${
            selectedCategory === 'all'
              ? 'bg-earth-600 text-white dark:bg-earth-500'
              : 'bg-cream-200 text-ink-700 dark:bg-ink-800 dark:text-cream-300 hover:bg-cream-300 dark:hover:bg-ink-700'
          }`}
        >
          All
        </button>
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-4 py-2 rounded-full whitespace-nowrap capitalize touch-target transition-all text-body-sm font-medium focus-interactive ${
              selectedCategory === cat
                ? 'bg-earth-600 text-white dark:bg-earth-500'
                : 'bg-cream-200 text-ink-700 dark:bg-ink-800 dark:text-cream-300 hover:bg-cream-300 dark:hover:bg-ink-700'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Content area */}
      <AnimatePresence mode="wait">
        {selectedExercise ? (
          <motion.div
            key="detail"
            className="flex-1 flex flex-col"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.2 }}
          >
            <button
              onClick={() => setSelectedExerciseId(null)}
              className="flex items-center gap-1 text-earth-600 dark:text-earth-400 mb-4 hover:text-earth-700 dark:hover:text-earth-300 transition-colors text-body-sm focus-interactive w-fit"
            >
              <ArrowLeft size={16} />
              Back to list
            </button>

            {/* Scrollable content */}
            <div className="flex-1 overflow-y-auto">
              <h2 className="font-display font-semibold text-display-md text-ink-900 dark:text-cream-100 mb-1">
                {selectedExercise.name.toUpperCase()}
              </h2>
              <p className="text-body-sm text-ink-600 dark:text-cream-400 capitalize mb-6">
                {selectedExercise.category} - Level {selectedExercise.progressionLevel}
              </p>

              <p className="text-body-md text-ink-700 dark:text-cream-300 mb-6">{selectedExercise.description}</p>

              <div className="mb-6">
                <h3 className="font-semibold mb-2 text-ink-800 dark:text-cream-100 text-body-sm uppercase tracking-wider">
                  Form Cues
                </h3>
                <ul className="space-y-2 text-body-md text-ink-700 dark:text-cream-300">
                  {selectedExercise.formCues.map((cue, index) => (
                    <li key={index} className="flex gap-2">
                      <span className="text-earth-500">-</span>
                      {cue}
                    </li>
                  ))}
                </ul>
              </div>

              {selectedExercise.equipmentSetup && (
                <div className="mb-6">
                  <h3 className="font-semibold mb-2 text-ink-800 dark:text-cream-100 text-body-sm uppercase tracking-wider">
                    Equipment Setup
                  </h3>
                  <p className="text-body-md text-ink-700 dark:text-cream-300">
                    {selectedExercise.equipmentSetup}
                  </p>
                </div>
              )}

              <div className="mb-6">
                <h3 className="font-semibold mb-2 text-ink-800 dark:text-cream-100 text-body-sm uppercase tracking-wider">
                  Target
                </h3>
                <p className="text-body-md text-ink-700 dark:text-cream-300">
                  {selectedExercise.targetDurationSeconds
                    ? `${selectedExercise.targetDurationSeconds} seconds`
                    : `${selectedExercise.targetRepsMin}-${selectedExercise.targetRepsMax} reps`}
                </p>
              </div>

              {/* Progression Path */}
              <div className="mb-6">
                <h3 className="font-semibold mb-3 text-ink-800 dark:text-cream-100 text-body-sm uppercase tracking-wider">
                  Progression Path
                </h3>
                <div className="space-y-2">
                  {selectedExercise.previousExercise && (
                    <button
                      onClick={() => handleNavigateToProgression(selectedExercise.previousExercise!)}
                      className="w-full p-4 text-left rounded-xl bg-cream-50 dark:bg-ink-800 hover:bg-cream-100 dark:hover:bg-ink-700 transition-colors border border-cream-300/60 dark:border-ink-700 flex justify-between items-center group focus-interactive"
                    >
                      <div>
                        <span className="text-body-xs text-ink-500 dark:text-cream-400">Previous:</span>
                        <p className="font-medium text-ink-800 dark:text-cream-100">
                          {getExerciseById(selectedExercise.previousExercise)?.name ?? 'Unknown'}
                        </p>
                      </div>
                      <ChevronRight size={20} className="text-ink-400 group-hover:text-ink-600 dark:group-hover:text-cream-300 transition-colors" />
                    </button>
                  )}

                  {selectedExercise.nextExercise && (
                    <button
                      onClick={() => handleNavigateToProgression(selectedExercise.nextExercise!)}
                      className="w-full p-4 text-left rounded-xl bg-cream-50 dark:bg-ink-800 hover:bg-cream-100 dark:hover:bg-ink-700 transition-colors border border-cream-300/60 dark:border-ink-700 flex justify-between items-center group focus-interactive"
                    >
                      <div>
                        <span className="text-body-xs text-ink-500 dark:text-cream-400">Next:</span>
                        <p className="font-medium text-ink-800 dark:text-cream-100">
                          {getExerciseById(selectedExercise.nextExercise)?.name ?? 'Unknown'}
                        </p>
                      </div>
                      <ChevronRight size={20} className="text-ink-400 group-hover:text-ink-600 dark:group-hover:text-cream-300 transition-colors" />
                    </button>
                  )}

                  {!selectedExercise.previousExercise && !selectedExercise.nextExercise && (
                    <p className="text-body-sm text-ink-500 dark:text-cream-400">
                      This exercise has no progressions defined.
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Practice button */}
            <div className="pt-4 border-t border-cream-300/60 dark:border-ink-700 mt-4">
              <Button fullWidth onClick={handleStartPractice}>
                PRACTICE THIS EXERCISE
              </Button>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="list"
            className="flex-1 overflow-y-auto -mx-6 px-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <ul className="space-y-2">
              {exercises.map((exercise, index) => (
                <motion.li
                  key={exercise.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.03 }}
                >
                  <button
                    onClick={() => setSelectedExerciseId(exercise.id)}
                    className="w-full p-4 text-left rounded-xl hover:bg-cream-50 dark:hover:bg-ink-800 transition-colors touch-target focus-interactive flex justify-between items-center group"
                  >
                    <div>
                      <h3 className="font-semibold text-ink-800 dark:text-cream-100 group-hover:text-earth-600 dark:group-hover:text-earth-400 transition-colors">
                        {exercise.name}
                      </h3>
                      <p className="text-body-sm text-ink-500 dark:text-cream-400 capitalize">
                        {exercise.category} - Level {exercise.progressionLevel}
                      </p>
                    </div>
                    <ChevronRight size={20} className="text-ink-400 group-hover:text-ink-600 dark:group-hover:text-cream-300 transition-colors" />
                  </button>
                </motion.li>
              ))}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}
