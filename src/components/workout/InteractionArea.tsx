import { motion } from 'framer-motion'
import { useState, useCallback, type ReactNode } from 'react'

interface InteractionAreaProps {
  children: ReactNode
  onTapAnywhere?: () => void
  className?: string
}

export function InteractionArea({
  children,
  onTapAnywhere,
  className = ''
}: InteractionAreaProps) {
  const [ripple, setRipple] = useState<{ x: number; y: number } | null>(null)

  const handleClick = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (!onTapAnywhere) return

    const rect = e.currentTarget.getBoundingClientRect()
    setRipple({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    })
    setTimeout(() => setRipple(null), 500)
    onTapAnywhere()
  }, [onTapAnywhere])

  return (
    <div
      className={`
        flex-1 flex flex-col items-center justify-center
        min-h-interaction relative overflow-hidden
        ${onTapAnywhere ? 'cursor-pointer' : ''}
        ${className}
      `}
      onClick={onTapAnywhere ? handleClick : undefined}
      aria-label={onTapAnywhere ? 'Tap to interact' : undefined}
    >
      {ripple && (
        <motion.span
          className="absolute rounded-full bg-earth-500/20 dark:bg-earth-400/20 pointer-events-none"
          style={{
            left: ripple.x,
            top: ripple.y,
            width: 20,
            height: 20,
            marginLeft: -10,
            marginTop: -10
          }}
          initial={{ scale: 0, opacity: 0.5 }}
          animate={{ scale: 10, opacity: 0 }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
        />
      )}
      {children}
    </div>
  )
}
