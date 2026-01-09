import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { render, screen, fireEvent, act } from '@testing-library/react'
import { RestTimer } from './RestTimer'

// Mock the audio cue hook
vi.mock('@/hooks/useAudioCue', () => ({
  useAudioCue: () => ({
    playRestWarning: vi.fn(),
    playRestComplete: vi.fn(),
    playSetComplete: vi.fn(),
    playHoldTick: vi.fn(),
    playHoldComplete: vi.fn(),
    play: vi.fn(),
  }),
}))

describe('RestTimer', () => {
  beforeEach(() => {
    vi.useFakeTimers()
    vi.setSystemTime(new Date('2024-01-15T10:00:00.000Z'))

    // Mock requestAnimationFrame for HoldToSkip
    let rafId = 0
    vi.stubGlobal('requestAnimationFrame', (callback: FrameRequestCallback) => {
      rafId++
      setTimeout(() => callback(performance.now()), 16)
      return rafId
    })
    vi.stubGlobal('cancelAnimationFrame', vi.fn())
  })

  afterEach(() => {
    vi.useRealTimers()
    vi.unstubAllGlobals()
  })

  describe('initial display', () => {
    it('should display "REST" label', () => {
      render(<RestTimer onComplete={vi.fn()} />)

      expect(screen.getByText('REST')).toBeInTheDocument()
    })

    it('should start with initialSeconds (default 90)', () => {
      render(<RestTimer onComplete={vi.fn()} />)

      expect(screen.getByText('1:30')).toBeInTheDocument()
    })

    it('should start with custom initialSeconds', () => {
      render(<RestTimer onComplete={vi.fn()} initialSeconds={60} />)

      expect(screen.getByText('1:00')).toBeInTheDocument()
    })

    it('should show next exercise name if provided', () => {
      render(<RestTimer onComplete={vi.fn()} nextExerciseName="Push-ups" />)

      expect(screen.getByText(/Next:/)).toBeInTheDocument()
      expect(screen.getByText('Push-ups')).toBeInTheDocument()
    })
  })

  describe('countdown behavior', () => {
    it('should auto-start countdown on mount', () => {
      render(<RestTimer onComplete={vi.fn()} initialSeconds={10} />)

      // Timer shows just seconds when < 60 (no "0:" prefix)
      expect(screen.getByText('10')).toBeInTheDocument()

      act(() => {
        vi.advanceTimersByTime(1000)
      })

      expect(screen.getByText('9')).toBeInTheDocument()
    })

    it('should continue into negative time after reaching 0', () => {
      render(<RestTimer onComplete={vi.fn()} initialSeconds={2} />)

      act(() => {
        vi.advanceTimersByTime(3000)
      })

      // Timer should show negative time (seconds only format)
      expect(screen.getByText('-1')).toBeInTheDocument()
    })

    it('should show "Over-resting" message when negative', () => {
      render(<RestTimer onComplete={vi.fn()} initialSeconds={2} />)

      act(() => {
        vi.advanceTimersByTime(3000)
      })

      expect(screen.getByText('Over-resting')).toBeInTheDocument()
    })
  })

  describe('interactions', () => {
    it('should call onComplete after holding', () => {
      const onComplete = vi.fn()
      render(<RestTimer onComplete={onComplete} />)

      // The TapToSkipOverlay wraps the content with hold-to-skip behavior
      const container = screen.getByRole('button', { name: /Hold for 2 seconds to skip/i })

      act(() => {
        fireEvent.pointerDown(container, { clientX: 100, clientY: 100 })
      })

      // Wait for hold duration (default 2000ms)
      act(() => {
        vi.advanceTimersByTime(2100)
      })

      expect(onComplete).toHaveBeenCalledTimes(1)
    })

    it('should call onComplete on keyboard hold', () => {
      const onComplete = vi.fn()
      render(<RestTimer onComplete={onComplete} />)

      const container = screen.getByRole('button', { name: /Hold for 2 seconds to skip/i })

      act(() => {
        fireEvent.keyDown(container, { key: 'Enter' })
      })

      // Wait for hold duration
      act(() => {
        vi.advanceTimersByTime(2100)
      })

      expect(onComplete).toHaveBeenCalledTimes(1)
    })
  })

  describe('TapToSkipOverlay integration', () => {
    it('should show hold instruction', () => {
      render(<RestTimer onComplete={vi.fn()} />)

      expect(screen.getByText('Hold anywhere to continue')).toBeInTheDocument()
    })
  })

  describe('accessibility', () => {
    it('should have aria-live region', () => {
      const { container } = render(<RestTimer onComplete={vi.fn()} />)

      const liveRegion = container.querySelector('[aria-live="polite"]')
      expect(liveRegion).toBeInTheDocument()
    })

    it('should have Over-resting alert role when negative', () => {
      render(<RestTimer onComplete={vi.fn()} initialSeconds={1} />)

      act(() => {
        vi.advanceTimersByTime(2000)
      })

      expect(screen.getByRole('alert')).toHaveTextContent('Over-resting')
    })
  })
})
