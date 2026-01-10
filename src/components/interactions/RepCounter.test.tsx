import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { RepCounter } from './RepCounter'

describe('RepCounter', () => {
  describe('display', () => {
    it('should display current rep count', () => {
      render(<RepCounter currentReps={5} />)

      expect(screen.getByText('5')).toBeInTheDocument()
    })

    it('should display "Target: X reps" for single target', () => {
      render(
        <RepCounter
          currentReps={0}
          targetRepsMin={10}
          targetRepsMax={10}
        />
      )

      expect(screen.getByText('Target: 10 reps')).toBeInTheDocument()
    })

    it('should display "Target: X-Y reps" for range target', () => {
      render(
        <RepCounter
          currentReps={0}
          targetRepsMin={8}
          targetRepsMax={12}
        />
      )

      expect(screen.getByText('Target: 8-12 reps')).toBeInTheDocument()
    })

    it('should display "Target: X+ reps" for min-only target', () => {
      render(
        <RepCounter
          currentReps={0}
          targetRepsMin={15}
        />
      )

      expect(screen.getByText('Target: 15+ reps')).toBeInTheDocument()
    })

    it('should display "Target: Max reps" when isMaxReps is true', () => {
      render(
        <RepCounter
          currentReps={0}
          isMaxReps
        />
      )

      expect(screen.getByText('Target: Max reps')).toBeInTheDocument()
    })

    it('should not display target when no target props provided', () => {
      render(<RepCounter currentReps={0} />)

      expect(screen.queryByText(/Target:/)).not.toBeInTheDocument()
    })

    it('should display "Tap anywhere to count" hint', () => {
      render(<RepCounter currentReps={0} />)

      expect(screen.getByText('Tap anywhere to count')).toBeInTheDocument()
    })
  })

  describe('accessibility', () => {
    it('should have correct aria-label', () => {
      render(<RepCounter currentReps={7} />)

      expect(
        screen.getByLabelText('Current reps: 7')
      ).toBeInTheDocument()
    })

    it('should have aria-live for updates', () => {
      const { container } = render(<RepCounter currentReps={0} />)

      expect(container.querySelector('[aria-live="polite"]')).toBeInTheDocument()
    })
  })

  describe('progress bar', () => {
    it('should show progress bar when target is set', () => {
      render(
        <RepCounter
          currentReps={5}
          targetRepsMin={10}
          targetRepsMax={10}
        />
      )

      expect(screen.getByText('5/10')).toBeInTheDocument()
    })

    it('should not show progress bar for max reps mode', () => {
      render(
        <RepCounter
          currentReps={5}
          isMaxReps
        />
      )

      expect(screen.queryByText(/\/\d+/)).not.toBeInTheDocument()
    })
  })
})
