import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { render, screen, fireEvent, act } from '@testing-library/react'
import { TimedHold } from './TimedHold'

// Mock Framer Motion to remove animation delays in tests
vi.mock('framer-motion', async () => {
  const actual = await vi.importActual('framer-motion')
  return {
    ...actual,
    AnimatePresence: ({ children }: { children: React.ReactNode }) => <>{children}</>,
    motion: {
      div: ({ children, className, ...props }: React.HTMLAttributes<HTMLDivElement>) => <div className={className} {...props}>{children}</div>,
      p: ({ children, className, ...props }: React.HTMLAttributes<HTMLParagraphElement>) => <p className={className} {...props}>{children}</p>,
      span: ({ children, className, 'aria-label': ariaLabel, ...props }: React.HTMLAttributes<HTMLSpanElement> & { 'aria-label'?: string }) => (
        <span className={className} aria-label={ariaLabel} {...props}>{children}</span>
      ),
      button: ({ children, onClick, className, disabled, type, 'aria-label': ariaLabel, tabIndex }: React.ButtonHTMLAttributes<HTMLButtonElement>) => (
        <button onClick={onClick} className={className} disabled={disabled} type={type} aria-label={ariaLabel} tabIndex={tabIndex}>{children}</button>
      ),
    },
  }
})

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

describe('TimedHold', () => {
  beforeEach(() => {
    vi.useFakeTimers()
    vi.setSystemTime(new Date('2024-01-15T10:00:00.000Z'))

    // Mock requestAnimationFrame for Framer Motion animations
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

  describe('ready phase', () => {
    it('should show "HOLD" title and target time', () => {
      render(<TimedHold targetSeconds={30} onComplete={vi.fn()} />)

      expect(screen.getByText('HOLD')).toBeInTheDocument()
      // Timer shows 0:30 format
      expect(screen.getByText(/0:30/)).toBeInTheDocument()
    })

    it('should show "Tap anywhere when ready" hint', () => {
      render(<TimedHold targetSeconds={30} onComplete={vi.fn()} />)

      expect(screen.getByText('Tap anywhere when ready')).toBeInTheDocument()
    })

    it('should show fallback button', () => {
      render(<TimedHold targetSeconds={30} onComplete={vi.fn()} />)

      expect(screen.getByRole('button', { name: /or tap here/i })).toBeInTheDocument()
    })
  })

  describe('countdown phase', () => {
    it('should transition to countdown on fallback button click', () => {
      render(<TimedHold targetSeconds={30} countdownDuration={3} onComplete={vi.fn()} />)

      const button = screen.getByRole('button', { name: /or tap here/i })

      act(() => {
        fireEvent.click(button)
        vi.advanceTimersByTime(100)
      })

      expect(screen.getByText('3')).toBeInTheDocument()
    })

    it('should show countdown number', () => {
      render(<TimedHold targetSeconds={30} countdownDuration={3} onComplete={vi.fn()} />)

      const button = screen.getByRole('button', { name: /or tap here/i })

      act(() => {
        fireEvent.click(button)
        vi.advanceTimersByTime(100)
      })

      expect(screen.getByText('3')).toBeInTheDocument()
    })

    it('should countdown from specified duration', () => {
      render(<TimedHold targetSeconds={30} countdownDuration={3} onComplete={vi.fn()} />)

      const button = screen.getByRole('button', { name: /or tap here/i })

      act(() => {
        fireEvent.click(button)
        vi.advanceTimersByTime(100)
      })

      expect(screen.getByText('3')).toBeInTheDocument()

      act(() => {
        vi.advanceTimersByTime(1000)
      })

      expect(screen.getByText('2')).toBeInTheDocument()
    })

    it('should transition to active phase when countdown reaches 0', () => {
      render(<TimedHold targetSeconds={10} countdownDuration={2} onComplete={vi.fn()} />)

      const button = screen.getByRole('button', { name: /or tap here/i })

      act(() => {
        fireEvent.click(button)
      })

      // Advance through countdown (2 seconds + buffer for useEffect)
      act(() => {
        vi.advanceTimersByTime(2100)
      })

      expect(screen.getByText('HOLD')).toBeInTheDocument()
      expect(screen.getByText('Keep holding until timer reaches zero')).toBeInTheDocument()
    })
  })

  describe('active phase', () => {
    it('should show "HOLD" text in active phase', () => {
      render(<TimedHold targetSeconds={10} countdownDuration={2} onComplete={vi.fn()} />)

      const button = screen.getByRole('button', { name: /or tap here/i })

      act(() => {
        fireEvent.click(button)
      })

      act(() => {
        vi.advanceTimersByTime(2100)
      })

      expect(screen.getByText('HOLD')).toBeInTheDocument()
    })

    it('should show remaining hold time', () => {
      render(<TimedHold targetSeconds={10} countdownDuration={2} onComplete={vi.fn()} />)

      const button = screen.getByRole('button', { name: /or tap here/i })

      act(() => {
        fireEvent.click(button)
      })

      act(() => {
        vi.advanceTimersByTime(2100)
      })

      expect(screen.getByText('10')).toBeInTheDocument()
    })

    it('should countdown from targetSeconds', () => {
      render(<TimedHold targetSeconds={10} countdownDuration={2} onComplete={vi.fn()} />)

      const button = screen.getByRole('button', { name: /or tap here/i })

      act(() => {
        fireEvent.click(button)
      })

      // Advance through countdown (2s)
      act(() => {
        vi.advanceTimersByTime(2100)
      })

      // Verify we're in active phase with initial time
      expect(screen.getByText('10')).toBeInTheDocument()

      // Advance one more second for hold timer to tick
      act(() => {
        vi.advanceTimersByTime(1000)
      })

      expect(screen.getByText('9')).toBeInTheDocument()
    })
  })

  describe('complete phase', () => {
    it('should transition to complete phase after hold finishes', () => {
      render(<TimedHold targetSeconds={1} countdownDuration={2} onComplete={vi.fn()} />)

      const button = screen.getByRole('button', { name: /or tap here/i })

      act(() => {
        fireEvent.click(button)
      })

      // Countdown (2s)
      act(() => {
        vi.advanceTimersByTime(2100)
      })

      // Hold timer (1s)
      act(() => {
        vi.advanceTimersByTime(1100)
      })

      expect(screen.getByText('DONE!')).toBeInTheDocument()
    })

    it('should call onComplete callback', () => {
      const onComplete = vi.fn()
      render(<TimedHold targetSeconds={1} countdownDuration={2} onComplete={onComplete} />)

      const button = screen.getByRole('button', { name: /or tap here/i })

      act(() => {
        fireEvent.click(button)
      })

      act(() => {
        vi.advanceTimersByTime(2100) // countdown
      })

      act(() => {
        vi.advanceTimersByTime(1100) // hold timer
      })

      act(() => {
        vi.advanceTimersByTime(900) // setTimeout delay (800ms + buffer)
      })

      expect(onComplete).toHaveBeenCalledTimes(1)
    })
  })

  describe('reset behavior', () => {
    it('should reset when targetSeconds changes', () => {
      const onComplete = vi.fn()
      const { rerender } = render(
        <TimedHold targetSeconds={30} countdownDuration={3} onComplete={onComplete} />
      )

      const button = screen.getByRole('button', { name: /or tap here/i })

      act(() => {
        fireEvent.click(button)
        vi.advanceTimersByTime(100)
      })

      // In countdown phase
      expect(screen.getByText('3')).toBeInTheDocument()

      act(() => {
        rerender(<TimedHold targetSeconds={20} countdownDuration={3} onComplete={onComplete} />)
      })

      // Should be back to ready phase with new time
      expect(screen.getByText('HOLD')).toBeInTheDocument()
      expect(screen.getByText(/0:20/)).toBeInTheDocument()
    })
  })

  describe('external trigger', () => {
    it('should start on externalTriggerStart', () => {
      const { rerender } = render(
        <TimedHold targetSeconds={30} countdownDuration={3} onComplete={vi.fn()} externalTriggerStart={false} />
      )

      expect(screen.getByText('Tap anywhere when ready')).toBeInTheDocument()

      act(() => {
        rerender(<TimedHold targetSeconds={30} countdownDuration={3} onComplete={vi.fn()} externalTriggerStart={true} />)
        vi.advanceTimersByTime(100)
      })

      expect(screen.getByText('3')).toBeInTheDocument()
    })
  })

  describe('phase change callback', () => {
    it('should call onPhaseChange when phase changes', () => {
      const onPhaseChange = vi.fn()
      render(
        <TimedHold targetSeconds={1} countdownDuration={2} onComplete={vi.fn()} onPhaseChange={onPhaseChange} />
      )

      // Initial phase callback
      expect(onPhaseChange).toHaveBeenCalledWith('ready')

      const button = screen.getByRole('button', { name: /or tap here/i })

      act(() => {
        fireEvent.click(button)
        vi.advanceTimersByTime(100)
      })

      expect(onPhaseChange).toHaveBeenCalledWith('countdown')

      act(() => {
        vi.advanceTimersByTime(2100)
      })

      expect(onPhaseChange).toHaveBeenCalledWith('active')

      act(() => {
        vi.advanceTimersByTime(1100)
      })

      expect(onPhaseChange).toHaveBeenCalledWith('complete')
    })
  })

  describe('accessibility', () => {
    it('should have aria-live region', () => {
      const { container } = render(<TimedHold targetSeconds={30} onComplete={vi.fn()} />)

      expect(container.querySelector('[aria-live="polite"]')).toBeInTheDocument()
    })
  })
})
