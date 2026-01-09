import type { ReactNode } from 'react'

interface ActionBarProps {
  children: ReactNode
  className?: string
}

/**
 * Responsive container for bottom action buttons.
 * - Mobile: full width
 * - Tablet (768px+): max-width 480px, right-aligned
 * - Desktop (1200px+): max-width 520px, right-aligned
 */
export function ActionBar({ children, className = '' }: ActionBarProps) {
  return (
    <div
      className={`
        w-full flex flex-col gap-2
        md:max-w-[480px] md:ml-auto
        xl:max-w-[520px]
        ${className}
      `.replace(/\s+/g, ' ').trim()}
    >
      {children}
    </div>
  )
}
