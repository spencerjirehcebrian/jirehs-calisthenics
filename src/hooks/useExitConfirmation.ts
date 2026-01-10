import { useState, useCallback } from 'react'

interface UseExitConfirmationReturn {
  /** Whether the exit confirmation dialog is currently visible */
  showDialog: boolean
  /** Open the exit confirmation dialog */
  openDialog: () => void
  /** Close the exit confirmation dialog without exiting */
  closeDialog: () => void
  /** Confirm exit - closes dialog and calls the onConfirm callback */
  confirmExit: () => void
  /** Props to spread onto ConfirmDialog component */
  dialogProps: {
    isOpen: boolean
    title: string
    message: string
    confirmLabel: string
    cancelLabel: string
    onConfirm: () => void
    onCancel: () => void
  }
}

/**
 * Hook to manage exit confirmation dialog state.
 * Provides consistent exit confirmation UX across workout screens.
 *
 * @param onConfirm - Callback to execute when user confirms exit
 * @returns Object with dialog state, handlers, and props for ConfirmDialog
 *
 * @example
 * ```tsx
 * const { openDialog, dialogProps } = useExitConfirmation(() => navigate('home'))
 *
 * return (
 *   <>
 *     <Button onClick={openDialog}>Exit</Button>
 *     <ConfirmDialog {...dialogProps} />
 *   </>
 * )
 * ```
 */
export function useExitConfirmation(onConfirm: () => void): UseExitConfirmationReturn {
  const [showDialog, setShowDialog] = useState(false)

  const openDialog = useCallback(() => {
    setShowDialog(true)
  }, [])

  const closeDialog = useCallback(() => {
    setShowDialog(false)
  }, [])

  const confirmExit = useCallback(() => {
    setShowDialog(false)
    onConfirm()
  }, [onConfirm])

  return {
    showDialog,
    openDialog,
    closeDialog,
    confirmExit,
    dialogProps: {
      isOpen: showDialog,
      title: 'Exit Workout?',
      message: 'Your progress will not be saved. Are you sure you want to exit?',
      confirmLabel: 'Exit',
      cancelLabel: 'Continue',
      onConfirm: confirmExit,
      onCancel: closeDialog
    }
  }
}
