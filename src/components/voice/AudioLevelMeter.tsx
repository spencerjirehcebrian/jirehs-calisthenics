import { motion } from 'framer-motion'

interface AudioLevelMeterProps {
  level: number // 0-1
  isActive: boolean
}

/**
 * Small waveform visualization showing microphone activity level.
 * Displays 5 bars that animate based on the audio level.
 */
export function AudioLevelMeter({ level, isActive }: AudioLevelMeterProps) {
  const bars = [0.3, 0.6, 1, 0.6, 0.3] // Base heights for each bar

  return (
    <div className="flex items-end justify-center gap-0.5 h-3">
      {bars.map((baseHeight, index) => {
        // Calculate height based on level and base height
        const height = isActive
          ? Math.max(0.2, baseHeight * level)
          : 0.2

        return (
          <motion.div
            key={index}
            className="w-0.5 bg-current rounded-full"
            animate={{
              height: `${height * 100}%`,
              opacity: isActive ? 1 : 0.3
            }}
            transition={{
              duration: 0.1,
              ease: 'easeOut'
            }}
          />
        )
      })}
    </div>
  )
}
