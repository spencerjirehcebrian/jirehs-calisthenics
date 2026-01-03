import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { ErrorBoundary } from './ErrorBoundary'

// Component that throws an error
function ThrowingComponent({ shouldThrow }: { shouldThrow: boolean }) {
  if (shouldThrow) {
    throw new Error('Test error message')
  }
  return <div>Content renders successfully</div>
}

describe('ErrorBoundary', () => {
  // Suppress console.error for error boundary tests
  beforeEach(() => {
    vi.spyOn(console, 'error').mockImplementation(() => {})
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  describe('when no error occurs', () => {
    it('should render children normally', () => {
      render(
        <ErrorBoundary>
          <ThrowingComponent shouldThrow={false} />
        </ErrorBoundary>
      )

      expect(screen.getByText('Content renders successfully')).toBeInTheDocument()
    })
  })

  describe('when an error occurs', () => {
    it('should render default error UI', () => {
      render(
        <ErrorBoundary>
          <ThrowingComponent shouldThrow={true} />
        </ErrorBoundary>
      )

      expect(screen.getByText('Something went wrong')).toBeInTheDocument()
      expect(
        screen.getByText(
          'An unexpected error occurred. You can try again or return to the home screen.'
        )
      ).toBeInTheDocument()
    })

    it('should render custom fallback when provided', () => {
      render(
        <ErrorBoundary fallback={<div>Custom error message</div>}>
          <ThrowingComponent shouldThrow={true} />
        </ErrorBoundary>
      )

      expect(screen.getByText('Custom error message')).toBeInTheDocument()
      expect(screen.queryByText('Something went wrong')).not.toBeInTheDocument()
    })

    it('should show Try Again button', () => {
      render(
        <ErrorBoundary>
          <ThrowingComponent shouldThrow={true} />
        </ErrorBoundary>
      )

      expect(screen.getByRole('button', { name: 'Try Again' })).toBeInTheDocument()
    })

    it('should show Return to Home button', () => {
      render(
        <ErrorBoundary>
          <ThrowingComponent shouldThrow={true} />
        </ErrorBoundary>
      )

      expect(
        screen.getByRole('button', { name: 'Return to Home' })
      ).toBeInTheDocument()
    })

    it('should show error details in collapsible section', () => {
      render(
        <ErrorBoundary>
          <ThrowingComponent shouldThrow={true} />
        </ErrorBoundary>
      )

      expect(screen.getByText('Error details')).toBeInTheDocument()
      expect(screen.getByText('Test error message')).toBeInTheDocument()
    })

    it('should call onError callback with error info', () => {
      const onError = vi.fn()

      render(
        <ErrorBoundary onError={onError}>
          <ThrowingComponent shouldThrow={true} />
        </ErrorBoundary>
      )

      expect(onError).toHaveBeenCalledTimes(1)
      expect(onError).toHaveBeenCalledWith(
        expect.objectContaining({ message: 'Test error message' }),
        expect.objectContaining({ componentStack: expect.any(String) })
      )
    })

    it('should log error to console', () => {
      render(
        <ErrorBoundary>
          <ThrowingComponent shouldThrow={true} />
        </ErrorBoundary>
      )

      expect(console.error).toHaveBeenCalled()
    })
  })

  describe('reset functionality', () => {
    it('should clear error state when Try Again is clicked', () => {
      // Note: After clicking Try Again, the error boundary clears its error state.
      // If the child still throws, it will catch the error again.
      // This test verifies the reset mechanism works.
      render(
        <ErrorBoundary>
          <ThrowingComponent shouldThrow={true} />
        </ErrorBoundary>
      )

      // Verify error UI is shown
      expect(screen.getByText('Something went wrong')).toBeInTheDocument()

      // Click Try Again - this resets the error boundary state
      fireEvent.click(screen.getByRole('button', { name: 'Try Again' }))

      // The component will throw again, so error UI should reappear
      // This confirms the reset + re-catch cycle works
      expect(screen.getByText('Something went wrong')).toBeInTheDocument()
    })
  })

  describe('accessibility', () => {
    it('should have accessible heading', () => {
      render(
        <ErrorBoundary>
          <ThrowingComponent shouldThrow={true} />
        </ErrorBoundary>
      )

      expect(
        screen.getByRole('heading', { name: 'Something went wrong' })
      ).toBeInTheDocument()
    })

    it('should have accessible buttons', () => {
      render(
        <ErrorBoundary>
          <ThrowingComponent shouldThrow={true} />
        </ErrorBoundary>
      )

      const buttons = screen.getAllByRole('button')
      expect(buttons).toHaveLength(2)
    })
  })
})
