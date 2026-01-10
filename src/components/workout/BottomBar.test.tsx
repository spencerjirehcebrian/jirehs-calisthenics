import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { BottomBar } from './BottomBar'

describe('BottomBar', () => {
  describe('display', () => {
    it('should display progress text', () => {
      render(<BottomBar progress={{ current: 3, total: 12 }} />)

      expect(screen.getByText('3 of 12')).toBeInTheDocument()
    })

    it('should display context info when provided', () => {
      render(
        <BottomBar
          progress={{ current: 1, total: 10 }}
          contextInfo="Joint Circles Phase"
        />
      )

      expect(screen.getByText('Joint Circles Phase')).toBeInTheDocument()
    })

    it('should not display context info when not provided', () => {
      render(<BottomBar progress={{ current: 1, total: 10 }} />)

      expect(screen.queryByText('Joint Circles Phase')).not.toBeInTheDocument()
    })

    it('should display action button when provided', () => {
      render(
        <BottomBar
          progress={{ current: 1, total: 10 }}
          actionButton={{ label: 'DONE', onClick: vi.fn() }}
        />
      )

      expect(screen.getByRole('button', { name: 'DONE' })).toBeInTheDocument()
    })

    it('should not display action button when not provided', () => {
      render(<BottomBar progress={{ current: 1, total: 10 }} />)

      expect(screen.queryByRole('button')).not.toBeInTheDocument()
    })

    it('should display deload badge when showDeloadBadge is true', () => {
      render(
        <BottomBar
          progress={{ current: 1, total: 10 }}
          showDeloadBadge
        />
      )

      expect(screen.getByText('Deload')).toBeInTheDocument()
    })

    it('should not display deload badge when showDeloadBadge is false', () => {
      render(
        <BottomBar
          progress={{ current: 1, total: 10 }}
          showDeloadBadge={false}
        />
      )

      expect(screen.queryByText('Deload')).not.toBeInTheDocument()
    })
  })

  describe('interactions', () => {
    it('should call onClick when action button is clicked', () => {
      const onClick = vi.fn()
      render(
        <BottomBar
          progress={{ current: 1, total: 10 }}
          actionButton={{ label: 'DONE', onClick }}
        />
      )

      fireEvent.click(screen.getByRole('button', { name: 'DONE' }))

      expect(onClick).toHaveBeenCalledTimes(1)
    })
  })

  describe('progress bar', () => {
    it('should render progress bar with correct percentage', () => {
      render(<BottomBar progress={{ current: 5, total: 10 }} />)

      const progressBar = screen.getByRole('progressbar')
      expect(progressBar).toHaveAttribute('aria-valuenow', '50')
    })

    it('should handle zero total gracefully', () => {
      render(<BottomBar progress={{ current: 0, total: 0 }} />)

      const progressBar = screen.getByRole('progressbar')
      expect(progressBar).toHaveAttribute('aria-valuenow', '0')
    })
  })

  describe('accessibility', () => {
    it('should have region role with label', () => {
      render(<BottomBar progress={{ current: 1, total: 10 }} />)

      expect(screen.getByRole('region', { name: 'Progress and actions' })).toBeInTheDocument()
    })
  })
})
