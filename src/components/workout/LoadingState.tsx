interface LoadingStateProps {
  message: string
  isError?: boolean
}

export function LoadingState({ message, isError = false }: LoadingStateProps) {
  return (
    <div
      className="flex-1 flex items-center justify-center p-6 bg-cream-100 dark:bg-ink-950"
      role="status"
      aria-busy={!isError}
      aria-live="polite"
    >
      <p
        className={`text-body-md ${
          isError
            ? 'text-terra-600 dark:text-terra-400'
            : 'text-ink-600 dark:text-cream-400'
        }`}
      >
        {message}
      </p>
    </div>
  )
}
