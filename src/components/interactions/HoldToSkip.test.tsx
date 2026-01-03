import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { render, screen, fireEvent, act } from '@testing-library/react'
import { HoldToSkip } from './HoldToSkip'

describe('HoldToSkip', () => {
  beforeEach(() => {
    vi.useFakeTimers()
    vi.setSystemTime(new Date('2024-01-15T10:00:00.000Z'))

    // Mock requestAnimationFrame
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

  describe('display', () => {
    it('should show "Hold to skip" text initially', () => {
      render(<HoldToSkip onSkip={vi.fn()} />)

      expect(screen.getByText('Hold to skip')).toBeInTheDocument()
    })

    it('should show progress ring', () => {
      render(<HoldToSkip onSkip={vi.fn()} />)

      expect(screen.getByRole('progressbar')).toBeInTheDocument()
    })
  })

  describe('hold behavior', () => {
    it('should show "Keep holding..." when holding', () => {
      render(<HoldToSkip onSkip={vi.fn()} />)

      const button = screen.getByRole('button')

      act(() => {
        fireEvent.pointerDown(button)
      })

      expect(screen.getByText('Keep holding...')).toBeInTheDocument()
    })

    it('should call onSkip when hold completes', () => {
      const onSkip = vi.fn()
      render(<HoldToSkip onSkip={onSkip} holdDuration={1000} />)

      const button = screen.getByRole('button')

      act(() => {
        fireEvent.pointerDown(button)
      })

      act(() => {
        vi.advanceTimersByTime(1100)
      })

      expect(onSkip).toHaveBeenCalledTimes(1)
    })

    it('should not call onSkip when hold is cancelled early', () => {
      const onSkip = vi.fn()
      render(<HoldToSkip onSkip={onSkip} holdDuration={2000} />)

      const button = screen.getByRole('button')

      act(() => {
        fireEvent.pointerDown(button)
      })

      act(() => {
        vi.advanceTimersByTime(500)
      })

      act(() => {
        fireEvent.pointerUp(button)
      })

      expect(onSkip).not.toHaveBeenCalled()
    })

    it('should reset to "Hold to skip" when cancelled', () => {
      render(<HoldToSkip onSkip={vi.fn()} />)

      const button = screen.getByRole('button')

      act(() => {
        fireEvent.pointerDown(button)
      })

      expect(screen.getByText('Keep holding...')).toBeInTheDocument()

      act(() => {
        fireEvent.pointerUp(button)
      })

      expect(screen.getByText('Hold to skip')).toBeInTheDocument()
    })
  })

  describe('keyboard support', () => {
    it('should respond to Enter key', () => {
      const onSkip = vi.fn()
      render(<HoldToSkip onSkip={onSkip} holdDuration={1000} />)

      const button = screen.getByRole('button')

      act(() => {
        fireEvent.keyDown(button, { key: 'Enter' })
      })

      expect(screen.getByText('Keep holding...')).toBeInTheDocument()
    })

    it('should respond to Space key', () => {
      const onSkip = vi.fn()
      render(<HoldToSkip onSkip={onSkip} holdDuration={1000} />)

      const button = screen.getByRole('button')

      act(() => {
        fireEvent.keyDown(button, { key: ' ' })
      })

      expect(screen.getByText('Keep holding...')).toBeInTheDocument()
    })
  })

  describe('accessibility', () => {
    it('should have correct aria-label initially', () => {
      render(<HoldToSkip onSkip={vi.fn()} holdDuration={2000} />)

      expect(
        screen.getByLabelText('Hold for 2 seconds to skip')
      ).toBeInTheDocument()
    })

    it('should have role button', () => {
      render(<HoldToSkip onSkip={vi.fn()} />)

      expect(screen.getByRole('button')).toBeInTheDocument()
    })
  })

  describe('positioning', () => {
    it('should apply bottom-right position classes by default', () => {
      render(<HoldToSkip onSkip={vi.fn()} />)

      const button = screen.getByRole('button')
      expect(button.className).toContain('bottom-4')
      expect(button.className).toContain('right-4')
    })

    it('should apply bottom-left position classes when specified', () => {
      render(<HoldToSkip onSkip={vi.fn()} position="bottom-left" />)

      const button = screen.getByRole('button')
      expect(button.className).toContain('bottom-4')
      expect(button.className).toContain('left-4')
    })
  })
})
