import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { InteractionArea } from './InteractionArea'

describe('InteractionArea', () => {
  describe('display', () => {
    it('should render children', () => {
      render(
        <InteractionArea>
          <span>Child content</span>
        </InteractionArea>
      )

      expect(screen.getByText('Child content')).toBeInTheDocument()
    })
  })

  describe('interactions', () => {
    it('should call onTapAnywhere when clicked', () => {
      const onTap = vi.fn()
      render(
        <InteractionArea onTapAnywhere={onTap}>
          <span>Content</span>
        </InteractionArea>
      )

      fireEvent.click(screen.getByText('Content').parentElement!)

      expect(onTap).toHaveBeenCalledTimes(1)
    })

    it('should not call anything when onTapAnywhere is not provided', () => {
      render(
        <InteractionArea>
          <span>Content</span>
        </InteractionArea>
      )

      // Should not throw when clicked
      fireEvent.click(screen.getByText('Content').parentElement!)
    })
  })

  describe('styling', () => {
    it('should have cursor-pointer when onTapAnywhere is provided', () => {
      const { container } = render(
        <InteractionArea onTapAnywhere={vi.fn()}>
          <span>Content</span>
        </InteractionArea>
      )

      const wrapper = container.firstChild
      expect(wrapper).toHaveClass('cursor-pointer')
    })

    it('should not have cursor-pointer when onTapAnywhere is not provided', () => {
      const { container } = render(
        <InteractionArea>
          <span>Content</span>
        </InteractionArea>
      )

      const wrapper = container.firstChild
      expect(wrapper).not.toHaveClass('cursor-pointer')
    })

    it('should apply custom className', () => {
      const { container } = render(
        <InteractionArea className="custom-class">
          <span>Content</span>
        </InteractionArea>
      )

      const wrapper = container.firstChild
      expect(wrapper).toHaveClass('custom-class')
    })
  })
})
