import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { LoadingState } from './LoadingState'

describe('LoadingState', () => {
  describe('display', () => {
    it('should display message', () => {
      render(<LoadingState message="Loading warm-up..." />)

      expect(screen.getByText('Loading warm-up...')).toBeInTheDocument()
    })

    it('should display error message with error styling', () => {
      render(<LoadingState message="No workout selected" isError />)

      const message = screen.getByText('No workout selected')
      expect(message).toHaveClass('text-terra-600')
    })

    it('should display normal message without error styling', () => {
      render(<LoadingState message="Loading..." />)

      const message = screen.getByText('Loading...')
      expect(message).toHaveClass('text-ink-600')
      expect(message).not.toHaveClass('text-terra-600')
    })
  })

  describe('accessibility', () => {
    it('should have status role', () => {
      render(<LoadingState message="Loading..." />)

      expect(screen.getByRole('status')).toBeInTheDocument()
    })

    it('should have aria-busy when not error', () => {
      render(<LoadingState message="Loading..." />)

      const status = screen.getByRole('status')
      expect(status).toHaveAttribute('aria-busy', 'true')
    })

    it('should not have aria-busy when error', () => {
      render(<LoadingState message="Error occurred" isError />)

      const status = screen.getByRole('status')
      expect(status).toHaveAttribute('aria-busy', 'false')
    })

    it('should have aria-live polite', () => {
      render(<LoadingState message="Loading..." />)

      const status = screen.getByRole('status')
      expect(status).toHaveAttribute('aria-live', 'polite')
    })
  })
})
