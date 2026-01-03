import { useCallback } from 'react'

interface UseKeyboardInteractionOptions {
  onActivate: () => void
  disabled?: boolean
}

interface UseKeyboardInteractionReturn {
  tabIndex: 0 | -1
  onKeyDown: (e: React.KeyboardEvent) => void
  role: 'button'
}

/**
 * Hook to add keyboard accessibility to custom interactive elements.
 * Returns props to spread on elements that act as buttons but aren't native <button> elements.
 * Handles Enter and Space key activation.
 */
export function useKeyboardInteraction({
  onActivate,
  disabled = false
}: UseKeyboardInteractionOptions): UseKeyboardInteractionReturn {
  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (disabled) return

      // Activate on Enter or Space
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault()
        onActivate()
      }
    },
    [onActivate, disabled]
  )

  return {
    tabIndex: disabled ? -1 : 0,
    onKeyDown: handleKeyDown,
    role: 'button' as const
  }
}
