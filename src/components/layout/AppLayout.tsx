import type { ReactNode } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

interface AppLayoutProps {
  children: ReactNode
  header?: ReactNode
  footer?: ReactNode
  className?: string
  showGrain?: boolean
}

export function AppLayout({
  children,
  header,
  footer,
  className = '',
  showGrain = true
}: AppLayoutProps) {
  return (
    <div className={`h-screen overflow-hidden bg-surface-primary text-color-primary flex flex-col ${showGrain ? 'bg-grain' : ''}`}>
      <AnimatePresence>
        {header && (
          <motion.header
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
            className="flex-shrink-0 px-4 py-3 border-b border-cream-300/60 dark:border-ink-700 bg-cream-50/80 dark:bg-ink-900/80 backdrop-blur-sm relative z-10"
          >
            {header}
          </motion.header>
        )}
      </AnimatePresence>
      <main className={`flex-1 flex flex-col min-h-0 relative z-0 ${className}`}>
        {children}
      </main>
      <AnimatePresence>
        {footer && (
          <motion.footer
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
            className="flex-shrink-0 px-4 py-3 border-t border-cream-300/60 dark:border-ink-700 bg-cream-50/80 dark:bg-ink-900/80 backdrop-blur-sm relative z-10"
          >
            {footer}
          </motion.footer>
        )}
      </AnimatePresence>
    </div>
  )
}
