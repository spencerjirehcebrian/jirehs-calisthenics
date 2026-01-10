import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { ExerciseHeader } from './ExerciseHeader'

describe('ExerciseHeader', () => {
  describe('display', () => {
    it('should display context label', () => {
      render(
        <ExerciseHeader
          contextLabel="WARMUP - JOINT CIRCLES"
          exerciseName="Neck Circles"
        />
      )

      expect(screen.getByText('WARMUP - JOINT CIRCLES')).toBeInTheDocument()
    })

    it('should display exercise name in uppercase', () => {
      render(
        <ExerciseHeader
          contextLabel="WARMUP"
          exerciseName="Neck Circles"
        />
      )

      expect(screen.getByText('NECK CIRCLES')).toBeInTheDocument()
    })

    it('should display side label when provided', () => {
      render(
        <ExerciseHeader
          contextLabel="WARMUP"
          exerciseName="Arm Circles"
          sideLabel="Clockwise"
        />
      )

      expect(screen.getByText('Clockwise')).toBeInTheDocument()
    })

    it('should not display side label when not provided', () => {
      render(
        <ExerciseHeader
          contextLabel="WARMUP"
          exerciseName="Arm Circles"
        />
      )

      expect(screen.queryByText('Clockwise')).not.toBeInTheDocument()
      expect(screen.queryByText('Left side')).not.toBeInTheDocument()
    })
  })

  describe('accessibility', () => {
    it('should render exercise name as h1', () => {
      render(
        <ExerciseHeader
          contextLabel="WARMUP"
          exerciseName="Neck Circles"
        />
      )

      const heading = screen.getByRole('heading', { level: 1 })
      expect(heading).toHaveTextContent('NECK CIRCLES')
    })

    it('should have accent underline hidden from screen readers', () => {
      const { container } = render(
        <ExerciseHeader
          contextLabel="WARMUP"
          exerciseName="Neck Circles"
        />
      )

      const underline = container.querySelector('[aria-hidden="true"]')
      expect(underline).toBeInTheDocument()
    })
  })
})
