import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { useElapsedTime } from './useElapsedTime'

describe('useElapsedTime', () => {
  beforeEach(() => {
    vi.useFakeTimers()
    vi.setSystemTime(new Date('2024-01-15T10:00:00.000Z'))
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('should return 0 when startTime is null', () => {
    const { result } = renderHook(() => useElapsedTime(null))

    expect(result.current).toBe(0)
  })

  it('should calculate initial elapsed seconds from startTime', () => {
    const startTime = Date.now() - 5000 // 5 seconds ago

    const { result } = renderHook(() => useElapsedTime(startTime))

    expect(result.current).toBe(5)
  })

  it('should update elapsed time every second', () => {
    const startTime = Date.now()

    const { result } = renderHook(() => useElapsedTime(startTime))

    expect(result.current).toBe(0)

    act(() => {
      vi.advanceTimersByTime(1000)
    })

    expect(result.current).toBe(1)

    act(() => {
      vi.advanceTimersByTime(2000)
    })

    expect(result.current).toBe(3)
  })

  it('should reset to 0 when startTime becomes null', () => {
    const startTime = Date.now()

    const { result, rerender } = renderHook(
      ({ startTime }: { startTime: number | null }) => useElapsedTime(startTime),
      { initialProps: { startTime: startTime as number | null } }
    )

    act(() => {
      vi.advanceTimersByTime(5000)
    })

    expect(result.current).toBe(5)

    rerender({ startTime: null })

    expect(result.current).toBe(0)
  })

  it('should handle startTime changes', () => {
    const startTime1 = Date.now()

    const { result, rerender } = renderHook(
      ({ startTime }) => useElapsedTime(startTime),
      { initialProps: { startTime: startTime1 } }
    )

    act(() => {
      vi.advanceTimersByTime(5000)
    })

    expect(result.current).toBe(5)

    // Change to a new start time (now)
    const startTime2 = Date.now()
    rerender({ startTime: startTime2 })

    expect(result.current).toBe(0)
  })

  it('should floor the elapsed seconds', () => {
    const startTime = Date.now() - 2500 // 2.5 seconds ago

    const { result } = renderHook(() => useElapsedTime(startTime))

    expect(result.current).toBe(2) // floored, not rounded
  })
})
