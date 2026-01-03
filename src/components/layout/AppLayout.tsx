import type { ReactNode } from 'react'

interface AppLayoutProps {
  children: ReactNode
  header?: ReactNode
  footer?: ReactNode
  className?: string
}

export function AppLayout({
  children,
  header,
  footer,
  className = ''
}: AppLayoutProps) {
  return (
    <div className="min-h-screen bg-white dark:bg-neutral-900 text-neutral-900 dark:text-neutral-100 flex flex-col">
      {header && (
        <header className="flex-shrink-0 px-4 py-3 border-b border-neutral-200 dark:border-neutral-800">
          {header}
        </header>
      )}
      <main className={`flex-1 flex flex-col ${className}`}>
        {children}
      </main>
      {footer && (
        <footer className="flex-shrink-0 px-4 py-3 border-t border-neutral-200 dark:border-neutral-800">
          {footer}
        </footer>
      )}
    </div>
  )
}
