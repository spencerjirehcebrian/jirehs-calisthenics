import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { render, screen, fireEvent, act } from '@testing-library/react'
import { TapToSkipOverlay } from './TapToSkipOverlay'

describe('TapToSkipOverlay', () => {
  beforeEach(() => {
    vi.useFakeTimers()
    vi.setSystemTime(new Date('2024-01-15T10:00:00.000Z'))

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

  describe('rendering', () => {
    it('should render children unchanged', () => {
      render(
        <TapToSkipOverlay onSkip={vi.fn()}>
          <div data-testid="child">Child content</div>
        </TapToSkipOverlay>
      )

      expect(screen.getByTestId('child')).toBeInTheDocument()
      expect(screen.getByText('Child content')).toBeInTheDocument()
    })

    it('should not show progress ring initially', () => {
      render(
        <TapToSkipOverlay onSkip={vi.fn()}>
          <div>Content</div>
        </TapToSkipOverlay>
      )

      expect(screen.queryByRole('progressbar')).not.toBeInTheDocument()
    })
  })

  describe('tap position', () => {
    it('should show progress ring on pointer down', () => {
      render(
        <TapToSkipOverlay onSkip={vi.fn()}>
          <div>Content</div>
        </TapToSkipOverlay>
      )

      const container = screen.getByRole('button')

      act(() => {
        fireEvent.pointerDown(container, { clientX: 100, clientY: 150 })
      })

      expect(screen.getByRole('progressbar')).toBeInTheDocument()
      expect(screen.getByText('Keep holding...')).toBeInTheDocument()
    })

    it('should position ring at tap location', () => {
      render(
        <TapToSkipOverlay onSkip={vi.fn()}>
          <div>Content</div>
        </TapToSkipOverlay>
      )

      const container = screen.getByRole('button')
      // Mock getBoundingClientRect
      vi.spyOn(container, 'getBoundingClientRect').mockReturnValue({
        left: 50,
        top: 100,
        width: 200,
        height: 300,
        right: 250,
        bottom: 400,
        x: 50,
        y: 100,
        toJSON: () => ({})
      })

      act(() => {
        fireEvent.pointerDown(container, { clientX: 150, clientY: 200 })
      })

      // The position is on the motion.div wrapper which has the absolute positioning
      const ringWrapper = screen.getByRole('progressbar').closest('[class*="absolute"]')
      expect(ringWrapper).toHaveStyle({ left: '100px', top: '100px' })
    })
  })

  describe('hold behavior', () => {
    it('should call onSkip when hold completes', () => {
      const onSkip = vi.fn()
      render(
        <TapToSkipOverlay onSkip={onSkip} holdDuration={1000}>
          <div>Content</div>
        </TapToSkipOverlay>
      )

      const container = screen.getByRole('button')

      act(() => {
        fireEvent.pointerDown(container, { clientX: 100, clientY: 100 })
      })

      act(() => {
        vi.advanceTimersByTime(1100)
      })

      expect(onSkip).toHaveBeenCalledTimes(1)
    })

    it('should clear position state on pointer up', () => {
      const onSkip = vi.fn()
      render(
        <TapToSkipOverlay onSkip={onSkip}>
          <div>Content</div>
        </TapToSkipOverlay>
      )

      const container = screen.getByRole('button')

      act(() => {
        fireEvent.pointerDown(container, { clientX: 100, clientY: 100 })
      })

      expect(screen.getByRole('progressbar')).toBeInTheDocument()

      act(() => {
        fireEvent.pointerUp(container)
      })

      // onSkip should not have been called (hold was cancelled)
      expect(onSkip).not.toHaveBeenCalled()
    })

    it('should cancel hold on pointer leave', () => {
      const onSkip = vi.fn()
      render(
        <TapToSkipOverlay onSkip={onSkip} holdDuration={2000}>
          <div>Content</div>
        </TapToSkipOverlay>
      )

      const container = screen.getByRole('button')

      act(() => {
        fireEvent.pointerDown(container, { clientX: 100, clientY: 100 })
      })

      act(() => {
        vi.advanceTimersByTime(500) // Hold for half the duration
      })

      act(() => {
        fireEvent.pointerLeave(container)
      })

      // onSkip should not have been called (hold was cancelled)
      expect(onSkip).not.toHaveBeenCalled()
    })

    it('should not call onSkip when cancelled early', () => {
      const onSkip = vi.fn()
      render(
        <TapToSkipOverlay onSkip={onSkip} holdDuration={2000}>
          <div>Content</div>
        </TapToSkipOverlay>
      )

      const container = screen.getByRole('button')

      act(() => {
        fireEvent.pointerDown(container, { clientX: 100, clientY: 100 })
      })

      act(() => {
        vi.advanceTimersByTime(500)
      })

      act(() => {
        fireEvent.pointerUp(container)
      })

      expect(onSkip).not.toHaveBeenCalled()
    })
  })

  describe('enabled state', () => {
    it('should not respond when enabled=false', () => {
      render(
        <TapToSkipOverlay onSkip={vi.fn()} enabled={false}>
          <div>Content</div>
        </TapToSkipOverlay>
      )

      const container = screen.getByText('Content').parentElement!

      act(() => {
        fireEvent.pointerDown(container, { clientX: 100, clientY: 100 })
      })

      expect(screen.queryByRole('progressbar')).not.toBeInTheDocument()
    })

    it('should not have button role when disabled', () => {
      render(
        <TapToSkipOverlay onSkip={vi.fn()} enabled={false}>
          <div>Content</div>
        </TapToSkipOverlay>
      )

      expect(screen.queryByRole('button')).not.toBeInTheDocument()
    })
  })

  describe('keyboard support', () => {
    it('should respond to Enter key', () => {
      render(
        <TapToSkipOverlay onSkip={vi.fn()}>
          <div>Content</div>
        </TapToSkipOverlay>
      )

      const container = screen.getByRole('button')

      act(() => {
        fireEvent.keyDown(container, { key: 'Enter' })
      })

      expect(screen.getByRole('progressbar')).toBeInTheDocument()
    })

    it('should respond to Space key', () => {
      render(
        <TapToSkipOverlay onSkip={vi.fn()}>
          <div>Content</div>
        </TapToSkipOverlay>
      )

      const container = screen.getByRole('button')

      act(() => {
        fireEvent.keyDown(container, { key: ' ' })
      })

      expect(screen.getByRole('progressbar')).toBeInTheDocument()
    })
  })

  describe('accessibility', () => {
    it('should have correct aria-label', () => {
      render(
        <TapToSkipOverlay onSkip={vi.fn()} holdDuration={2000}>
          <div>Content</div>
        </TapToSkipOverlay>
      )

      expect(screen.getByLabelText('Hold for 2 seconds to skip')).toBeInTheDocument()
    })
  })
})
