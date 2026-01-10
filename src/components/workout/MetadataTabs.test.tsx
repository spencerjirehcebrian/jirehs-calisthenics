import { describe, it, expect } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { MetadataTabs } from './MetadataTabs'

describe('MetadataTabs', () => {
  const mockTabs = [
    { id: 'form', label: 'Form', content: <p>Form content</p> },
    { id: 'setup', label: 'Setup', content: <p>Setup content</p> },
    { id: 'timer', label: 'Timer', content: <p>Timer content</p> }
  ]

  describe('display', () => {
    it('should render all tab buttons', () => {
      render(<MetadataTabs tabs={mockTabs} />)

      expect(screen.getByRole('tab', { name: 'Form' })).toBeInTheDocument()
      expect(screen.getByRole('tab', { name: 'Setup' })).toBeInTheDocument()
      expect(screen.getByRole('tab', { name: 'Timer' })).toBeInTheDocument()
    })

    it('should show first tab content by default', () => {
      render(<MetadataTabs tabs={mockTabs} />)

      expect(screen.getByText('Form content')).toBeInTheDocument()
      expect(screen.queryByText('Setup content')).not.toBeInTheDocument()
    })

    it('should show specified default tab content', () => {
      render(<MetadataTabs tabs={mockTabs} defaultTab="setup" />)

      expect(screen.getByText('Setup content')).toBeInTheDocument()
      expect(screen.queryByText('Form content')).not.toBeInTheDocument()
    })

    it('should filter out tabs with null content', () => {
      const tabsWithNull = [
        { id: 'form', label: 'Form', content: <p>Form content</p> },
        { id: 'setup', label: 'Setup', content: null },
        { id: 'timer', label: 'Timer', content: <p>Timer content</p> }
      ]

      render(<MetadataTabs tabs={tabsWithNull} />)

      expect(screen.getByRole('tab', { name: 'Form' })).toBeInTheDocument()
      expect(screen.queryByRole('tab', { name: 'Setup' })).not.toBeInTheDocument()
      expect(screen.getByRole('tab', { name: 'Timer' })).toBeInTheDocument()
    })

    it('should return null when all tabs have no content', () => {
      const emptyTabs = [
        { id: 'form', label: 'Form', content: null },
        { id: 'setup', label: 'Setup', content: undefined }
      ]

      const { container } = render(<MetadataTabs tabs={emptyTabs} />)

      expect(container.firstChild).toBeNull()
    })
  })

  describe('interactions', () => {
    it('should switch tab content on tab click', async () => {
      render(<MetadataTabs tabs={mockTabs} />)

      expect(screen.getByText('Form content')).toBeInTheDocument()

      fireEvent.click(screen.getByRole('tab', { name: 'Setup' }))

      // Wait for AnimatePresence transition to complete
      await waitFor(() => {
        expect(screen.getByText('Setup content')).toBeInTheDocument()
      })
    })
  })

  describe('accessibility', () => {
    it('should have correct tablist role', () => {
      render(<MetadataTabs tabs={mockTabs} />)

      expect(screen.getByRole('tablist')).toBeInTheDocument()
    })

    it('should have correct tab panel role', () => {
      render(<MetadataTabs tabs={mockTabs} />)

      expect(screen.getByRole('tabpanel')).toBeInTheDocument()
    })

    it('should have aria-selected on active tab', () => {
      render(<MetadataTabs tabs={mockTabs} />)

      const formTab = screen.getByRole('tab', { name: 'Form' })
      const setupTab = screen.getByRole('tab', { name: 'Setup' })

      expect(formTab).toHaveAttribute('aria-selected', 'true')
      expect(setupTab).toHaveAttribute('aria-selected', 'false')
    })

    it('should update aria-selected when tab changes', () => {
      render(<MetadataTabs tabs={mockTabs} />)

      fireEvent.click(screen.getByRole('tab', { name: 'Setup' }))

      const formTab = screen.getByRole('tab', { name: 'Form' })
      const setupTab = screen.getByRole('tab', { name: 'Setup' })

      expect(formTab).toHaveAttribute('aria-selected', 'false')
      expect(setupTab).toHaveAttribute('aria-selected', 'true')
    })

    it('should have aria-controls linking tab to panel', () => {
      render(<MetadataTabs tabs={mockTabs} />)

      const formTab = screen.getByRole('tab', { name: 'Form' })
      expect(formTab).toHaveAttribute('aria-controls', 'tabpanel-form')

      const tabPanel = screen.getByRole('tabpanel')
      expect(tabPanel).toHaveAttribute('id', 'tabpanel-form')
    })
  })
})
