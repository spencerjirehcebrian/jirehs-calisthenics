import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { useTimer } from './useTimer'

describe('useTimer', () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  describe('initialization', () => {
    it('should initialize with initialSeconds', () => {
      const { result } = renderHook(() =>
        useTimer({ initialSeconds: 10, direction: 'down' })
      )

      expect(result.current.seconds).toBe(10)
    })

    it('should not start automatically by default', () => {
      const { result } = renderHook(() =>
        useTimer({ initialSeconds: 10, direction: 'down' })
      )

      expect(result.current.isRunning).toBe(false)
    })

    it('should not be complete initially', () => {
      const { result } = renderHook(() =>
        useTimer({ initialSeconds: 10, direction: 'down' })
      )

      expect(result.current.isComplete).toBe(false)
    })
  })

  describe('autoStart option', () => {
    it('should start running immediately when autoStart is true', () => {
      const { result } = renderHook(() =>
        useTimer({ initialSeconds: 10, direction: 'down', autoStart: true })
      )

      expect(result.current.isRunning).toBe(true)
    })
  })

  describe('countdown mode', () => {
    it('should decrement by 1 every second when running', () => {
      const { result } = renderHook(() =>
        useTimer({ initialSeconds: 10, direction: 'down' })
      )

      act(() => {
        result.current.start()
      })

      expect(result.current.seconds).toBe(10)

      act(() => {
        vi.advanceTimersByTime(1000)
      })

      expect(result.current.seconds).toBe(9)
    })

    it('should call onTick with new value each second', () => {
      const onTick = vi.fn()
      const { result } = renderHook(() =>
        useTimer({ initialSeconds: 3, direction: 'down', onTick })
      )

      act(() => {
        result.current.start()
      })

      act(() => {
        vi.advanceTimersByTime(1000)
      })

      expect(onTick).toHaveBeenCalledWith(2)

      act(() => {
        vi.advanceTimersByTime(1000)
      })

      expect(onTick).toHaveBeenCalledWith(1)
    })

    it('should call onComplete when reaching 0', () => {
      const onComplete = vi.fn()
      const { result } = renderHook(() =>
        useTimer({ initialSeconds: 2, direction: 'down', onComplete })
      )

      act(() => {
        result.current.start()
      })

      act(() => {
        vi.advanceTimersByTime(2000)
      })

      expect(onComplete).toHaveBeenCalledTimes(1)
    })

    it('should set isComplete to true when reaching 0', () => {
      const { result } = renderHook(() =>
        useTimer({ initialSeconds: 2, direction: 'down' })
      )

      act(() => {
        result.current.start()
      })

      act(() => {
        vi.advanceTimersByTime(2000)
      })

      expect(result.current.isComplete).toBe(true)
    })

    it('should only call onComplete once', () => {
      const onComplete = vi.fn()
      const { result } = renderHook(() =>
        useTimer({ initialSeconds: 2, direction: 'down', onComplete })
      )

      act(() => {
        result.current.start()
      })

      act(() => {
        vi.advanceTimersByTime(5000)
      })

      expect(onComplete).toHaveBeenCalledTimes(1)
    })
  })

  describe('countup mode', () => {
    it('should increment by 1 every second', () => {
      const { result } = renderHook(() =>
        useTimer({ initialSeconds: 0, direction: 'up' })
      )

      act(() => {
        result.current.start()
      })

      act(() => {
        vi.advanceTimersByTime(1000)
      })

      expect(result.current.seconds).toBe(1)

      act(() => {
        vi.advanceTimersByTime(2000)
      })

      expect(result.current.seconds).toBe(3)
    })

    it('should not call onComplete (never reaches 0)', () => {
      const onComplete = vi.fn()
      const { result } = renderHook(() =>
        useTimer({ initialSeconds: 0, direction: 'up', onComplete })
      )

      act(() => {
        result.current.start()
      })

      act(() => {
        vi.advanceTimersByTime(10000)
      })

      expect(onComplete).not.toHaveBeenCalled()
    })
  })

  describe('start', () => {
    it('should set isRunning to true', () => {
      const { result } = renderHook(() =>
        useTimer({ initialSeconds: 10, direction: 'down' })
      )

      act(() => {
        result.current.start()
      })

      expect(result.current.isRunning).toBe(true)
    })

    it('should not restart if already running', () => {
      const { result } = renderHook(() =>
        useTimer({ initialSeconds: 10, direction: 'down' })
      )

      act(() => {
        result.current.start()
      })

      act(() => {
        vi.advanceTimersByTime(2000)
      })

      act(() => {
        result.current.start()
      })

      act(() => {
        vi.advanceTimersByTime(1000)
      })

      expect(result.current.seconds).toBe(7)
    })
  })

  describe('pause', () => {
    it('should stop the timer', () => {
      const { result } = renderHook(() =>
        useTimer({ initialSeconds: 10, direction: 'down' })
      )

      act(() => {
        result.current.start()
      })

      act(() => {
        vi.advanceTimersByTime(2000)
      })

      act(() => {
        result.current.pause()
      })

      act(() => {
        vi.advanceTimersByTime(5000)
      })

      expect(result.current.seconds).toBe(8)
    })

    it('should preserve current seconds value', () => {
      const { result } = renderHook(() =>
        useTimer({ initialSeconds: 10, direction: 'down' })
      )

      act(() => {
        result.current.start()
      })

      act(() => {
        vi.advanceTimersByTime(3000)
      })

      act(() => {
        result.current.pause()
      })

      expect(result.current.seconds).toBe(7)
    })

    it('should set isRunning to false', () => {
      const { result } = renderHook(() =>
        useTimer({ initialSeconds: 10, direction: 'down' })
      )

      act(() => {
        result.current.start()
      })

      act(() => {
        result.current.pause()
      })

      expect(result.current.isRunning).toBe(false)
    })
  })

  describe('reset', () => {
    it('should reset seconds to initialSeconds', () => {
      const { result } = renderHook(() =>
        useTimer({ initialSeconds: 10, direction: 'down' })
      )

      act(() => {
        result.current.start()
      })

      act(() => {
        vi.advanceTimersByTime(5000)
      })

      act(() => {
        result.current.reset()
      })

      expect(result.current.seconds).toBe(10)
    })

    it('should stop the timer', () => {
      const { result } = renderHook(() =>
        useTimer({ initialSeconds: 10, direction: 'down' })
      )

      act(() => {
        result.current.start()
      })

      act(() => {
        result.current.reset()
      })

      expect(result.current.isRunning).toBe(false)
    })

    it('should allow new initial value', () => {
      const { result } = renderHook(() =>
        useTimer({ initialSeconds: 10, direction: 'down' })
      )

      act(() => {
        result.current.reset(20)
      })

      expect(result.current.seconds).toBe(20)
    })

    it('should reset isComplete flag', () => {
      const { result } = renderHook(() =>
        useTimer({ initialSeconds: 2, direction: 'down' })
      )

      act(() => {
        result.current.start()
      })

      act(() => {
        vi.advanceTimersByTime(2000)
      })

      expect(result.current.isComplete).toBe(true)

      act(() => {
        result.current.reset()
      })

      expect(result.current.isComplete).toBe(false)
    })
  })
})
