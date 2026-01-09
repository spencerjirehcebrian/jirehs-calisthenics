import { Button } from '@/components/base/Button'
import { useNavigationStore } from '@/stores'
import { motion, type Variants } from 'framer-motion'

const easeOutExpo = [0.16, 1, 0.3, 1] as const

export function HomeScreen() {
  const navigate = useNavigationStore((state) => state.navigate)

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.1
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

  const fadeUpVariants: Variants = {
    hidden: { opacity: 0, y: 24 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.4, ease: easeOutExpo }
    }
  }

  const decorativeVariants: Variants = {
    hidden: { opacity: 0, scale: 0.9 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: { duration: 0.5, ease: easeOutExpo, delay: 0.2 }
    }
  }

  return (
    <motion.div
      className="relative flex-1 flex flex-col min-h-full overflow-hidden bg-cream-100 dark:bg-ink-950 bg-grain"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Decorative geometric shapes - overlapping circles */}
      <motion.div
        className="absolute top-1/4 right-0 translate-x-1/3 pointer-events-none"
        aria-hidden="true"
        variants={decorativeVariants}
      >
        <div className="relative w-64 h-64">
          <div className="absolute top-0 left-0 w-48 h-48 rounded-full bg-earth-200/60 dark:bg-earth-800/30" />
          <div className="absolute top-12 left-12 w-40 h-40 rounded-full bg-earth-300/50 dark:bg-earth-700/25" />
          <div className="absolute top-20 left-6 w-32 h-32 rounded-full bg-earth-400/30 dark:bg-earth-600/20" />
        </div>
      </motion.div>

      {/* Main content */}
      <div className="flex-1 flex flex-col justify-center px-6 pb-8 pt-16">
        {/* Title section - asymmetric, left-aligned */}
        <div className="mb-auto pt-8">
          <h1>
            <motion.span
              className="block font-display font-extrabold text-ink-900 dark:text-cream-100 leading-[0.9] tracking-tight text-display-hero"
              variants={titleVariants}
            >
              JIREH'S
            </motion.span>
            <motion.span
              className="block font-display font-extrabold text-ink-900 dark:text-cream-100 leading-[0.9] tracking-tight text-display-hero"
              variants={titleVariants}
            >
              CALISTHENICS
            </motion.span>
          </h1>
          {/* Decorative underline - offset from title */}
          <motion.div
            className="mt-4 h-1 bg-earth-500 dark:bg-earth-400"
            style={{ width: '60%' }}
            aria-hidden="true"
            variants={fadeUpVariants}
          />
        </div>

        {/* Button section - bottom aligned with stagger */}
        <motion.div
          className="mt-auto space-y-4 max-w-md"
          variants={containerVariants}
        >
          {/* Primary CTA - full width, prominent */}
          <motion.div variants={fadeUpVariants}>
            <Button
              size="hero"
              fullWidth
              icon="arrow"
              onClick={() => navigate('workout-selection')}
            >
              START WORKOUT
            </Button>
          </motion.div>

          {/* Secondary buttons - 2 column grid */}
          <div className="grid grid-cols-2 gap-3">
            <motion.div variants={fadeUpVariants}>
              <Button
                variant="secondary"
                size="lg"
                fullWidth
                onClick={() => navigate('exercise-library')}
                className="h-20 !justify-start !text-left"
              >
                <span className="flex flex-col items-start">
                  <span className="text-xs uppercase tracking-wider text-ink-500 dark:text-cream-400 mb-1">Browse</span>
                  <span className="font-semibold">EXERCISE LIBRARY</span>
                </span>
              </Button>
            </motion.div>
            <motion.div variants={fadeUpVariants}>
              <Button
                variant="secondary"
                size="lg"
                fullWidth
                onClick={() => navigate('settings')}
                className="h-20 !justify-start !text-left"
              >
                <span className="flex flex-col items-start">
                  <span className="text-xs uppercase tracking-wider text-ink-500 dark:text-cream-400 mb-1">Configure</span>
                  <span className="font-semibold">SETTINGS</span>
                </span>
              </Button>
            </motion.div>
          </div>
        </motion.div>
      </div>

      {/* Bottom decorative element - gradient stripe */}
      <div
        className="absolute bottom-0 left-0 w-full h-2 bg-gradient-to-r from-earth-500 via-earth-400 to-transparent dark:from-earth-600 dark:via-earth-500"
        aria-hidden="true"
      />
    </motion.div>
  )
}
