import { motion, AnimatePresence } from 'framer-motion'
import { Button } from './Button'

interface ConfirmDialogProps {
  isOpen: boolean
  title: string
  message: string
  confirmLabel?: string
  cancelLabel?: string
  onConfirm: () => void
  onCancel: () => void
}

export function ConfirmDialog({
  isOpen,
  title,
  message,
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  onConfirm,
  onCancel
}: ConfirmDialogProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          {/* Backdrop */}
          <motion.div
            className="absolute inset-0 bg-ink-900/60 dark:bg-ink-950/80"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onCancel}
          />

          {/* Dialog */}
          <motion.div
            className="relative bg-cream-50 dark:bg-ink-800 rounded-2xl shadow-xl max-w-sm w-full p-6"
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          >
            <h2 className="font-display font-semibold text-display-sm text-ink-900 dark:text-cream-100 mb-2">
              {title}
            </h2>
            <p className="text-body-sm text-ink-600 dark:text-cream-400 mb-6">
              {message}
            </p>

            <div className="flex gap-3">
              <Button variant="secondary" size="md" onClick={onCancel} fullWidth>
                {cancelLabel}
              </Button>
              <Button variant="primary" size="md" onClick={onConfirm} fullWidth>
                {confirmLabel}
              </Button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
