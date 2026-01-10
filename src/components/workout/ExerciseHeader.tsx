import { motion } from 'framer-motion'

interface ExerciseHeaderProps {
  contextLabel: string
  exerciseName: string
  sideLabel?: string
}

export function ExerciseHeader({
  contextLabel,
  exerciseName,
  sideLabel
}: ExerciseHeaderProps) {
  return (
    <div className="p-4 pt-12">
      <motion.p
        className="text-body-sm text-earth-600 dark:text-earth-400 font-medium mb-1 uppercase tracking-wider"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
      >
        {contextLabel}
      </motion.p>
      <motion.h1
        className="font-display font-semibold text-display-md text-ink-900 dark:text-cream-100"
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.1 }}
      >
        {exerciseName.toUpperCase()}
      </motion.h1>
      {sideLabel && (
        <motion.p
          className="text-body-lg text-earth-600 dark:text-earth-400 font-medium mt-2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.15 }}
        >
          {sideLabel}
        </motion.p>
      )}
      <motion.div
        className="mt-3 h-1 w-12 bg-earth-500 dark:bg-earth-400"
        initial={{ scaleX: 0 }}
        animate={{ scaleX: 1 }}
        transition={{ duration: 0.3, delay: 0.2 }}
        style={{ transformOrigin: 'left' }}
        aria-hidden="true"
      />
    </div>
  )
}
