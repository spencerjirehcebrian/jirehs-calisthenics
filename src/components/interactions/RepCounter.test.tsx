import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { RepCounter } from './RepCounter'

describe('RepCounter', () => {
  describe('display', () => {
    it('should display current rep count', () => {
      render(<RepCounter currentReps={5} onIncrement={vi.fn()} />)

      expect(screen.getByText('5')).toBeInTheDocument()
    })

    it('should display "Target: X reps" for single target', () => {
      render(
        <RepCounter
          currentReps={0}
          targetRepsMin={10}
          targetRepsMax={10}
          onIncrement={vi.fn()}
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
          onIncrement={vi.fn()}
        />
      )

      expect(screen.getByText('Target: 8-12 reps')).toBeInTheDocument()
    })

    it('should display "Target: X+ reps" for min-only target', () => {
      render(
        <RepCounter
          currentReps={0}
          targetRepsMin={15}
          onIncrement={vi.fn()}
        />
      )

      expect(screen.getByText('Target: 15+ reps')).toBeInTheDocument()
    })

    it('should display "Target: Max reps" when isMaxReps is true', () => {
      render(
        <RepCounter
          currentReps={0}
          isMaxReps
          onIncrement={vi.fn()}
        />
      )

      expect(screen.getByText('Target: Max reps')).toBeInTheDocument()
    })

    it('should not display target when no target props provided', () => {
      render(<RepCounter currentReps={0} onIncrement={vi.fn()} />)

      expect(screen.queryByText(/Target:/)).not.toBeInTheDocument()
    })
  })

  describe('interactions', () => {
    it('should call onIncrement on click', () => {
      const onIncrement = vi.fn()
      render(<RepCounter currentReps={0} onIncrement={onIncrement} />)

      fireEvent.click(screen.getByRole('button'))

      expect(onIncrement).toHaveBeenCalledTimes(1)
    })

    it('should call onIncrement on Enter key', () => {
      const onIncrement = vi.fn()
      render(<RepCounter currentReps={0} onIncrement={onIncrement} />)

      fireEvent.keyDown(screen.getByRole('button'), { key: 'Enter' })

      expect(onIncrement).toHaveBeenCalledTimes(1)
    })

    it('should call onIncrement on Space key', () => {
      const onIncrement = vi.fn()
      render(<RepCounter currentReps={0} onIncrement={onIncrement} />)

      fireEvent.keyDown(screen.getByRole('button'), { key: ' ' })

      expect(onIncrement).toHaveBeenCalledTimes(1)
    })
  })

  describe('accessibility', () => {
    it('should have correct aria-label', () => {
      render(<RepCounter currentReps={7} onIncrement={vi.fn()} />)

      expect(
        screen.getByLabelText('Current reps: 7. Tap or press Enter to add one rep.')
      ).toBeInTheDocument()
    })

    it('should have role button', () => {
      render(<RepCounter currentReps={0} onIncrement={vi.fn()} />)

      expect(screen.getByRole('button')).toBeInTheDocument()
    })
  })
})
