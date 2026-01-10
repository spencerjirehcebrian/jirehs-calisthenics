import { ProgressBar } from '@/components/base/ProgressBar'
import { Button } from '@/components/base/Button'
import { ActionBar } from '@/components/layout/ActionBar'

interface BottomBarProps {
  progress: {
    current: number
    total: number
  }
  contextInfo?: string
  actionButton?: {
    label: string
    onClick: () => void
  }
  showDeloadBadge?: boolean
  className?: string
}

export function BottomBar({
  progress,
  contextInfo,
  actionButton,
  showDeloadBadge,
  className = ''
}: BottomBarProps) {
  const progressPercent = progress.total > 0 ? progress.current / progress.total : 0

  return (
    <div
      className={`p-4 border-t border-cream-300/60 dark:border-ink-700 bg-cream-50/80 dark:bg-ink-900/80 backdrop-blur-sm ${className}`}
      role="region"
      aria-label="Progress and actions"
    >
      {/* Progress bar */}
      <div className="mb-4">
        <ProgressBar progress={progressPercent} />
        <div className="flex justify-between items-center mt-2">
          <p className="text-body-sm text-ink-600 dark:text-cream-400">
            {progress.current} of {progress.total}
          </p>
          {showDeloadBadge && (
            <span className="text-body-xs px-2 py-1 bg-earth-200 dark:bg-earth-800 text-earth-700 dark:text-earth-200 rounded-full font-medium">
              Deload
            </span>
          )}
        </div>
      </div>

      {/* Context info */}
      {contextInfo && (
        <p className="text-center text-body-sm text-ink-600 dark:text-cream-400 mb-4">
          {contextInfo}
        </p>
      )}

      {/* Action button */}
      {actionButton && (
        <ActionBar>
          <Button fullWidth onClick={actionButton.onClick}>
            {actionButton.label}
          </Button>
        </ActionBar>
      )}
    </div>
  )
}
