import { describe, it, expect, vi } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { useExitConfirmation } from './useExitConfirmation'

describe('useExitConfirmation', () => {
  describe('initial state', () => {
    it('should have showDialog as false initially', () => {
      const { result } = renderHook(() => useExitConfirmation(vi.fn()))
      expect(result.current.showDialog).toBe(false)
    })

    it('should have dialogProps.isOpen as false initially', () => {
      const { result } = renderHook(() => useExitConfirmation(vi.fn()))
      expect(result.current.dialogProps.isOpen).toBe(false)
    })
  })

  describe('openDialog', () => {
    it('should set showDialog to true', () => {
      const { result } = renderHook(() => useExitConfirmation(vi.fn()))

      act(() => {
        result.current.openDialog()
      })

      expect(result.current.showDialog).toBe(true)
    })

    it('should update dialogProps.isOpen to true', () => {
      const { result } = renderHook(() => useExitConfirmation(vi.fn()))

      act(() => {
        result.current.openDialog()
      })

      expect(result.current.dialogProps.isOpen).toBe(true)
    })
  })

  describe('closeDialog', () => {
    it('should set showDialog to false', () => {
      const { result } = renderHook(() => useExitConfirmation(vi.fn()))

      act(() => {
        result.current.openDialog()
      })

      act(() => {
        result.current.closeDialog()
      })

      expect(result.current.showDialog).toBe(false)
    })

    it('should not call onConfirm', () => {
      const onConfirm = vi.fn()
      const { result } = renderHook(() => useExitConfirmation(onConfirm))

      act(() => {
        result.current.openDialog()
      })

      act(() => {
        result.current.closeDialog()
      })

      expect(onConfirm).not.toHaveBeenCalled()
    })
  })

  describe('confirmExit', () => {
    it('should call onConfirm callback', () => {
      const onConfirm = vi.fn()
      const { result } = renderHook(() => useExitConfirmation(onConfirm))

      act(() => {
        result.current.confirmExit()
      })

      expect(onConfirm).toHaveBeenCalledTimes(1)
    })

    it('should close the dialog', () => {
      const { result } = renderHook(() => useExitConfirmation(vi.fn()))

      act(() => {
        result.current.openDialog()
      })

      act(() => {
        result.current.confirmExit()
      })

      expect(result.current.showDialog).toBe(false)
    })
  })

  describe('dialogProps', () => {
    it('should have correct title', () => {
      const { result } = renderHook(() => useExitConfirmation(vi.fn()))
      expect(result.current.dialogProps.title).toBe('Exit Workout?')
    })

    it('should have correct message', () => {
      const { result } = renderHook(() => useExitConfirmation(vi.fn()))
      expect(result.current.dialogProps.message).toBe(
        'Your progress will not be saved. Are you sure you want to exit?'
      )
    })

    it('should have correct confirmLabel', () => {
      const { result } = renderHook(() => useExitConfirmation(vi.fn()))
      expect(result.current.dialogProps.confirmLabel).toBe('Exit')
    })

    it('should have correct cancelLabel', () => {
      const { result } = renderHook(() => useExitConfirmation(vi.fn()))
      expect(result.current.dialogProps.cancelLabel).toBe('Continue')
    })

    it('should have onConfirm that calls confirmExit', () => {
      const onConfirm = vi.fn()
      const { result } = renderHook(() => useExitConfirmation(onConfirm))

      act(() => {
        result.current.dialogProps.onConfirm()
      })

      expect(onConfirm).toHaveBeenCalled()
    })

    it('should have onCancel that calls closeDialog', () => {
      const { result } = renderHook(() => useExitConfirmation(vi.fn()))

      act(() => {
        result.current.openDialog()
      })

      act(() => {
        result.current.dialogProps.onCancel()
      })

      expect(result.current.showDialog).toBe(false)
    })
  })

  describe('callback stability', () => {
    it('should maintain stable references for callbacks', () => {
      const onConfirm = vi.fn()
      const { result, rerender } = renderHook(() => useExitConfirmation(onConfirm))

      const firstOpenDialog = result.current.openDialog
      const firstCloseDialog = result.current.closeDialog

      rerender()

      expect(result.current.openDialog).toBe(firstOpenDialog)
      expect(result.current.closeDialog).toBe(firstCloseDialog)
    })
  })
})
