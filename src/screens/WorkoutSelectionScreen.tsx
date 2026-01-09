import { useNavigationStore, useWorkoutSessionStore } from '@/stores'
import { workouts } from '@/data/workouts'
import type { WorkoutId } from '@/types'
import { motion, type Variants } from 'framer-motion'
import { ArrowLeft } from 'lucide-react'

const easeOutExpo = [0.16, 1, 0.3, 1] as const

// Card accent styles - unique decoration for each card
const cardAccents = [
  // Diagonal stripe in corner
  <div key="stripe" className="absolute top-0 right-0 w-20 h-20 overflow-hidden rounded-tr-2xl">
    <div className="absolute -right-4 -top-4 w-24 h-8 bg-earth-300/60 dark:bg-earth-700/40 rotate-45 origin-center" />
  </div>,
  // Corner notch shape
  <div key="notch" className="absolute top-0 right-0">
    <div className="w-12 h-12 bg-earth-300/60 dark:bg-earth-700/40 rounded-bl-2xl rounded-tr-2xl" />
  </div>,
  // Dot pattern overlay
  <div key="dots" className="absolute top-4 right-4 grid grid-cols-3 gap-1.5">
    {[...Array(9)].map((_, i) => (
      <div key={i} className="w-1.5 h-1.5 rounded-full bg-earth-300/60 dark:bg-earth-700/40" />
    ))}
  </div>
]

export function WorkoutSelectionScreen() {
  const navigate = useNavigationStore((state) => state.navigate)
  const startWorkout = useWorkoutSessionStore((state) => state.startWorkout)

  const handleSelectWorkout = (workoutId: WorkoutId) => {
    startWorkout(workoutId)
    navigate('warmup')
  }

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.15
      }
    }
  }

  const titleVariants: Variants = {
    hidden: { opacity: 0, x: -24 },
    visible: {
      opacity: 1,
      x: 0,
      transition: { duration: 0.4, ease: easeOutExpo }
    }
  }

  const cardVariants: Variants = {
    hidden: { opacity: 0, y: 24 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.4, ease: easeOutExpo }
    }
  }

  return (
    <motion.div
      className="flex-1 flex flex-col min-h-0 p-6 pb-0 bg-cream-100 dark:bg-ink-950 bg-grain"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Back button */}
      <motion.button
        onClick={() => navigate('home')}
        className="flex items-center gap-2 text-ink-600 dark:text-cream-400 hover:text-ink-900 dark:hover:text-cream-100 transition-colors mb-8 touch-target focus-interactive rounded-lg w-fit"
        aria-label="Go back"
        whileHover={{ x: -4 }}
        whileTap={{ scale: 0.95 }}
        initial={{ opacity: 0, x: -10 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.3 }}
      >
        <ArrowLeft className="w-5 h-5" />
      </motion.button>

      {/* Title - split across lines */}
      <div className="mb-8">
        <h2>
          <motion.span
            className="block font-display font-semibold text-ink-900 dark:text-cream-100 text-display-lg"
            variants={titleVariants}
          >
            SELECT
          </motion.span>
          <motion.span
            className="block font-display font-semibold text-ink-900 dark:text-cream-100 text-display-lg"
            variants={titleVariants}
          >
            YOUR
          </motion.span>
          <motion.span
            className="block font-display font-semibold text-ink-900 dark:text-cream-100 text-display-lg"
            variants={titleVariants}
          >
            WORKOUT
          </motion.span>
        </h2>
        {/* Decorative underline */}
        <motion.div
          className="mt-3 h-1 w-16 bg-earth-500 dark:bg-earth-400"
          variants={titleVariants}
          aria-hidden="true"
        />
      </div>

      {/* Workout cards - scrollable container */}
      <div className="flex-1 overflow-y-auto scrollbar-hide -mx-6 px-6 pb-6">
        <div className="flex flex-col gap-4">
          {workouts.map((workout, index) => (
            <motion.button
              key={workout.id}
              onClick={() => handleSelectWorkout(workout.id)}
              className="relative p-6 rounded-2xl border border-cream-300 dark:border-ink-700 bg-cream-50 dark:bg-ink-800 text-left touch-target hover-lift-lg group focus-interactive overflow-hidden"
              variants={cardVariants}
              whileHover={{ y: -4 }}
              whileTap={{ scale: 0.98 }}
            >
              {/* Unique accent decoration */}
              {cardAccents[index % cardAccents.length]}

              {/* Card number */}
              <span className="font-display text-earth-400 dark:text-earth-600 text-lg mb-2 block">
                {String(index + 1).padStart(2, '0')}
              </span>

              {/* Workout title */}
              <h3 className="font-body font-semibold text-xl text-ink-900 dark:text-cream-100 uppercase tracking-wide mb-1 group-hover:text-earth-600 dark:group-hover:text-earth-400 transition-colors">
                {workout.name}
              </h3>

              {/* Workout subtitle */}
              <p className="text-ink-600 dark:text-cream-400 text-body-sm">
                {workout.subtitle}
              </p>
            </motion.button>
          ))}
        </div>
      </div>
    </motion.div>
  )
}
