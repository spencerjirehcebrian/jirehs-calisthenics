import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { useHoldDetection } from './useHoldDetection'

describe('useHoldDetection', () => {
  beforeEach(() => {
    vi.useFakeTimers()
    vi.setSystemTime(new Date('2024-01-15T10:00:00.000Z'))

    // Mock requestAnimationFrame
    let rafId = 0
    vi.stubGlobal('requestAnimationFrame', (callback: FrameRequestCallback) => {
      rafId++
      // Schedule the callback to run after a short delay
      setTimeout(() => callback(performance.now()), 16)
      return rafId
    })
    vi.stubGlobal('cancelAnimationFrame', vi.fn())
  })

  afterEach(() => {
    vi.useRealTimers()
    vi.unstubAllGlobals()
  })

  describe('initial state', () => {
    it('should not be holding initially', () => {
      const { result } = renderHook(() =>
        useHoldDetection({ onHoldComplete: vi.fn() })
      )

      expect(result.current.isHolding).toBe(false)
    })

    it('should have progress at 0 initially', () => {
      const { result } = renderHook(() =>
        useHoldDetection({ onHoldComplete: vi.fn() })
      )

      expect(result.current.progress).toBe(0)
    })
  })

  describe('pointer events', () => {
    it('should start hold on pointerDown', () => {
      const { result } = renderHook(() =>
        useHoldDetection({ onHoldComplete: vi.fn() })
      )

      act(() => {
        result.current.handlers.onPointerDown({
          preventDefault: vi.fn(),
        } as unknown as React.PointerEvent)
      })

      expect(result.current.isHolding).toBe(true)
    })

    it('should call onHoldStart callback', () => {
      const onHoldStart = vi.fn()
      const { result } = renderHook(() =>
        useHoldDetection({ onHoldComplete: vi.fn(), onHoldStart })
      )

      act(() => {
        result.current.handlers.onPointerDown({
          preventDefault: vi.fn(),
        } as unknown as React.PointerEvent)
      })

      expect(onHoldStart).toHaveBeenCalledTimes(1)
    })

    it('should cancel hold on pointerUp', () => {
      const { result } = renderHook(() =>
        useHoldDetection({ onHoldComplete: vi.fn() })
      )

      act(() => {
        result.current.handlers.onPointerDown({
          preventDefault: vi.fn(),
        } as unknown as React.PointerEvent)
      })

      act(() => {
        result.current.handlers.onPointerUp({} as React.PointerEvent)
      })

      expect(result.current.isHolding).toBe(false)
    })

    it('should cancel hold on pointerLeave', () => {
      const { result } = renderHook(() =>
        useHoldDetection({ onHoldComplete: vi.fn() })
      )

      act(() => {
        result.current.handlers.onPointerDown({
          preventDefault: vi.fn(),
        } as unknown as React.PointerEvent)
      })

      act(() => {
        result.current.handlers.onPointerLeave({} as React.PointerEvent)
      })

      expect(result.current.isHolding).toBe(false)
    })

    it('should cancel hold on pointerCancel', () => {
      const { result } = renderHook(() =>
        useHoldDetection({ onHoldComplete: vi.fn() })
      )

      act(() => {
        result.current.handlers.onPointerDown({
          preventDefault: vi.fn(),
        } as unknown as React.PointerEvent)
      })

      act(() => {
        result.current.handlers.onPointerCancel({} as React.PointerEvent)
      })

      expect(result.current.isHolding).toBe(false)
    })

    it('should call onHoldCancel when cancelled before complete', () => {
      const onHoldCancel = vi.fn()
      const { result } = renderHook(() =>
        useHoldDetection({ onHoldComplete: vi.fn(), onHoldCancel })
      )

      act(() => {
        result.current.handlers.onPointerDown({
          preventDefault: vi.fn(),
        } as unknown as React.PointerEvent)
      })

      act(() => {
        result.current.handlers.onPointerUp({} as React.PointerEvent)
      })

      expect(onHoldCancel).toHaveBeenCalledTimes(1)
    })
  })

  describe('progress tracking', () => {
    it('should start progress at 0', () => {
      const { result } = renderHook(() =>
        useHoldDetection({ onHoldComplete: vi.fn() })
      )

      act(() => {
        result.current.handlers.onPointerDown({
          preventDefault: vi.fn(),
        } as unknown as React.PointerEvent)
      })

      expect(result.current.progress).toBe(0)
    })

    it('should reset progress on cancel', () => {
      const { result } = renderHook(() =>
        useHoldDetection({ onHoldComplete: vi.fn(), holdDuration: 2000 })
      )

      act(() => {
        result.current.handlers.onPointerDown({
          preventDefault: vi.fn(),
        } as unknown as React.PointerEvent)
      })

      // Advance time to update progress
      act(() => {
        vi.advanceTimersByTime(500)
      })

      act(() => {
        result.current.handlers.onPointerUp({} as React.PointerEvent)
      })

      expect(result.current.progress).toBe(0)
    })

    it('should call onHoldComplete when progress reaches 1', () => {
      const onHoldComplete = vi.fn()
      const { result } = renderHook(() =>
        useHoldDetection({ onHoldComplete, holdDuration: 1000 })
      )

      act(() => {
        result.current.handlers.onPointerDown({
          preventDefault: vi.fn(),
        } as unknown as React.PointerEvent)
      })

      // Advance time past the hold duration
      act(() => {
        vi.advanceTimersByTime(1100)
      })

      expect(onHoldComplete).toHaveBeenCalledTimes(1)
    })
  })

  describe('keyboard support', () => {
    it('should start hold on Enter keyDown', () => {
      const { result } = renderHook(() =>
        useHoldDetection({ onHoldComplete: vi.fn() })
      )

      act(() => {
        result.current.handlers.onKeyDown({
          key: 'Enter',
          preventDefault: vi.fn(),
        } as unknown as React.KeyboardEvent)
      })

      expect(result.current.isHolding).toBe(true)
    })

    it('should start hold on Space keyDown', () => {
      const { result } = renderHook(() =>
        useHoldDetection({ onHoldComplete: vi.fn() })
      )

      act(() => {
        result.current.handlers.onKeyDown({
          key: ' ',
          preventDefault: vi.fn(),
        } as unknown as React.KeyboardEvent)
      })

      expect(result.current.isHolding).toBe(true)
    })

    it('should cancel hold on keyUp of same key', () => {
      const { result } = renderHook(() =>
        useHoldDetection({ onHoldComplete: vi.fn() })
      )

      act(() => {
        result.current.handlers.onKeyDown({
          key: 'Enter',
          preventDefault: vi.fn(),
        } as unknown as React.KeyboardEvent)
      })

      act(() => {
        result.current.handlers.onKeyUp({
          key: 'Enter',
        } as unknown as React.KeyboardEvent)
      })

      expect(result.current.isHolding).toBe(false)
    })

    it('should prevent key repeat from restarting hold', () => {
      const onHoldStart = vi.fn()
      const { result } = renderHook(() =>
        useHoldDetection({ onHoldComplete: vi.fn(), onHoldStart })
      )

      // First key down
      act(() => {
        result.current.handlers.onKeyDown({
          key: 'Enter',
          preventDefault: vi.fn(),
        } as unknown as React.KeyboardEvent)
      })

      // Simulated key repeat (second key down without key up)
      act(() => {
        result.current.handlers.onKeyDown({
          key: 'Enter',
          preventDefault: vi.fn(),
        } as unknown as React.KeyboardEvent)
      })

      // onHoldStart should only be called once
      expect(onHoldStart).toHaveBeenCalledTimes(1)
    })

    it('should not respond to other keys', () => {
      const { result } = renderHook(() =>
        useHoldDetection({ onHoldComplete: vi.fn() })
      )

      act(() => {
        result.current.handlers.onKeyDown({
          key: 'a',
          preventDefault: vi.fn(),
        } as unknown as React.KeyboardEvent)
      })

      expect(result.current.isHolding).toBe(false)
    })

    it('should cancel hold on blur', () => {
      const { result } = renderHook(() =>
        useHoldDetection({ onHoldComplete: vi.fn() })
      )

      act(() => {
        result.current.handlers.onKeyDown({
          key: 'Enter',
          preventDefault: vi.fn(),
        } as unknown as React.KeyboardEvent)
      })

      act(() => {
        result.current.handlers.onBlur()
      })

      expect(result.current.isHolding).toBe(false)
    })
  })

  describe('custom holdDuration', () => {
    it('should respect custom holdDuration', () => {
      const onHoldComplete = vi.fn()
      const { result } = renderHook(() =>
        useHoldDetection({ onHoldComplete, holdDuration: 3000 })
      )

      act(() => {
        result.current.handlers.onPointerDown({
          preventDefault: vi.fn(),
        } as unknown as React.PointerEvent)
      })

      // Advance less than 3000ms
      act(() => {
        vi.advanceTimersByTime(2000)
      })

      expect(onHoldComplete).not.toHaveBeenCalled()

      // Advance past 3000ms
      act(() => {
        vi.advanceTimersByTime(1100)
      })

      expect(onHoldComplete).toHaveBeenCalledTimes(1)
    })
  })

  describe('no duplicate callback calls', () => {
    it('should not call onHoldCancel after onHoldComplete', () => {
      const onHoldComplete = vi.fn()
      const onHoldCancel = vi.fn()
      const { result } = renderHook(() =>
        useHoldDetection({ onHoldComplete, onHoldCancel, holdDuration: 500 })
      )

      act(() => {
        result.current.handlers.onPointerDown({
          preventDefault: vi.fn(),
        } as unknown as React.PointerEvent)
      })

      // Complete the hold
      act(() => {
        vi.advanceTimersByTime(600)
      })

      expect(onHoldComplete).toHaveBeenCalledTimes(1)
      expect(onHoldCancel).not.toHaveBeenCalled()
    })
  })
})
