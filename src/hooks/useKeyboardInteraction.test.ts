import { describe, it, expect, vi } from 'vitest'
import { renderHook } from '@testing-library/react'
import { useKeyboardInteraction } from './useKeyboardInteraction'

describe('useKeyboardInteraction', () => {
  describe('tabIndex', () => {
    it('should return tabIndex 0 when not disabled', () => {
      const { result } = renderHook(() =>
        useKeyboardInteraction({ onActivate: vi.fn() })
      )

      expect(result.current.tabIndex).toBe(0)
    })

    it('should return tabIndex -1 when disabled', () => {
      const { result } = renderHook(() =>
        useKeyboardInteraction({ onActivate: vi.fn(), disabled: true })
      )

      expect(result.current.tabIndex).toBe(-1)
    })
  })

  describe('role', () => {
    it('should return role "button"', () => {
      const { result } = renderHook(() =>
        useKeyboardInteraction({ onActivate: vi.fn() })
      )

      expect(result.current.role).toBe('button')
    })
  })

  describe('onKeyDown', () => {
    it('should call onActivate on Enter key', () => {
      const onActivate = vi.fn()
      const { result } = renderHook(() =>
        useKeyboardInteraction({ onActivate })
      )

      const event = {
        key: 'Enter',
        preventDefault: vi.fn(),
      } as unknown as React.KeyboardEvent

      result.current.onKeyDown(event)

      expect(onActivate).toHaveBeenCalledTimes(1)
      expect(event.preventDefault).toHaveBeenCalled()
    })

    it('should call onActivate on Space key', () => {
      const onActivate = vi.fn()
      const { result } = renderHook(() =>
        useKeyboardInteraction({ onActivate })
      )

      const event = {
        key: ' ',
        preventDefault: vi.fn(),
      } as unknown as React.KeyboardEvent

      result.current.onKeyDown(event)

      expect(onActivate).toHaveBeenCalledTimes(1)
      expect(event.preventDefault).toHaveBeenCalled()
    })

    it('should prevent default on Enter and Space', () => {
      const { result } = renderHook(() =>
        useKeyboardInteraction({ onActivate: vi.fn() })
      )

      const enterEvent = {
        key: 'Enter',
        preventDefault: vi.fn(),
      } as unknown as React.KeyboardEvent

      result.current.onKeyDown(enterEvent)
      expect(enterEvent.preventDefault).toHaveBeenCalled()

      const spaceEvent = {
        key: ' ',
        preventDefault: vi.fn(),
      } as unknown as React.KeyboardEvent

      result.current.onKeyDown(spaceEvent)
      expect(spaceEvent.preventDefault).toHaveBeenCalled()
    })

    it('should not call onActivate on other keys', () => {
      const onActivate = vi.fn()
      const { result } = renderHook(() =>
        useKeyboardInteraction({ onActivate })
      )

      const event = {
        key: 'a',
        preventDefault: vi.fn(),
      } as unknown as React.KeyboardEvent

      result.current.onKeyDown(event)

      expect(onActivate).not.toHaveBeenCalled()
      expect(event.preventDefault).not.toHaveBeenCalled()
    })

    it('should not call onActivate when disabled', () => {
      const onActivate = vi.fn()
      const { result } = renderHook(() =>
        useKeyboardInteraction({ onActivate, disabled: true })
      )

      const event = {
        key: 'Enter',
        preventDefault: vi.fn(),
      } as unknown as React.KeyboardEvent

      result.current.onKeyDown(event)

      expect(onActivate).not.toHaveBeenCalled()
    })

    it('should not prevent default when disabled', () => {
      const { result } = renderHook(() =>
        useKeyboardInteraction({ onActivate: vi.fn(), disabled: true })
      )

      const event = {
        key: 'Enter',
        preventDefault: vi.fn(),
      } as unknown as React.KeyboardEvent

      result.current.onKeyDown(event)

      expect(event.preventDefault).not.toHaveBeenCalled()
    })
  })
})
