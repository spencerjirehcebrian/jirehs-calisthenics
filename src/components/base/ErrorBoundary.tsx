import { Component, type ReactNode, type ErrorInfo } from 'react'
import { Button } from './Button'

interface ErrorBoundaryProps {
  children: ReactNode
  fallback?: ReactNode
  onError?: (error: Error, errorInfo: ErrorInfo) => void
}

interface ErrorBoundaryState {
  hasError: boolean
  error: Error | null
}

export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    console.error('ErrorBoundary caught an error:', error, errorInfo)
    this.props.onError?.(error, errorInfo)
  }

  handleReset = (): void => {
    this.setState({ hasError: false, error: null })
  }

  handleReturnHome = (): void => {
    // Reset error state and reload page to return to home
    window.location.href = '/'
  }

  render(): ReactNode {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback
      }

      return (
        <div className="flex-1 flex flex-col items-center justify-center p-6 text-center">
          <h2 className="text-xl font-semibold text-neutral-900 dark:text-neutral-100 mb-2">
            Something went wrong
          </h2>
          <p className="text-neutral-600 dark:text-neutral-400 mb-6 max-w-md">
            An unexpected error occurred. You can try again or return to the home screen.
          </p>
          <div className="flex flex-col gap-3 w-full max-w-xs">
            <Button variant="primary" onClick={this.handleReset}>
              Try Again
            </Button>
            <Button variant="secondary" onClick={this.handleReturnHome}>
              Return to Home
            </Button>
          </div>
          {this.state.error && (
            <details className="mt-6 text-left w-full max-w-md">
              <summary className="text-sm text-neutral-500 cursor-pointer hover:text-neutral-700 dark:hover:text-neutral-300">
                Error details
              </summary>
              <pre className="mt-2 p-3 bg-neutral-100 dark:bg-neutral-800 rounded text-xs overflow-auto">
                {this.state.error.message}
              </pre>
            </details>
          )}
        </div>
      )
    }

    return this.props.children
  }
}
