import type { ReactNode } from 'react'
import { ArrowRight } from 'lucide-react'
import { motion } from 'framer-motion'

type ButtonVariant = 'primary' | 'secondary' | 'ghost'
type ButtonSize = 'sm' | 'md' | 'lg' | 'xl' | 'hero'

interface ButtonProps {
  variant?: ButtonVariant
  size?: ButtonSize
  children: ReactNode
  fullWidth?: boolean
  icon?: 'arrow' | 'none'
  className?: string
  onClick?: () => void
  disabled?: boolean
  type?: 'button' | 'submit' | 'reset'
  'aria-label'?: string
  /** Shows geometric accent bar on desktop (md+) - for ghost skip buttons */
  withAccent?: boolean
}

export function Button({
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  icon = 'none',
  children,
  className = '',
  onClick,
  disabled,
  type = 'button',
  'aria-label': ariaLabel,
  withAccent = false
}: ButtonProps) {
  const baseStyles = `
    font-medium rounded-xl transition-all duration-200 ease-out
    disabled:opacity-50 disabled:cursor-not-allowed
    focus-interactive relative overflow-hidden
    flex items-center justify-center gap-3
  `.replace(/\s+/g, ' ').trim()

  const variantStyles: Record<ButtonVariant, string> = {
    primary: `
      bg-earth-600 text-white border border-earth-700/20
      shadow-[var(--shadow-earth)]
      hover:bg-earth-700 hover:shadow-[var(--shadow-earth-lg)]
      active:bg-earth-800 active:shadow-none active:scale-[0.98]
      dark:bg-earth-500 dark:hover:bg-earth-600 dark:active:bg-earth-700
    `.replace(/\s+/g, ' ').trim(),
    secondary: `
      bg-cream-50 text-ink-800 border border-cream-300
      hover:bg-cream-100 hover:border-earth-400
      active:bg-cream-200 active:scale-[0.98]
      dark:bg-ink-800 dark:text-cream-100 dark:border-ink-700
      dark:hover:bg-ink-700 dark:hover:border-ink-600
    `.replace(/\s+/g, ' ').trim(),
    ghost: `
      bg-transparent text-ink-700
      hover:bg-cream-100
      active:bg-cream-200 active:scale-[0.98]
      dark:text-cream-300 dark:hover:bg-ink-800 dark:active:bg-ink-700
    `.replace(/\s+/g, ' ').trim()
  }

  const sizeStyles: Record<ButtonSize, string> = {
    sm: 'px-3 py-1.5 text-sm min-h-[36px]',
    md: 'px-4 py-2 text-base min-h-[44px]',
    lg: 'px-6 py-3 text-lg min-h-[52px]',
    xl: 'px-8 py-4 text-xl min-h-[60px]',
    hero: 'px-8 py-5 text-xl min-h-[80px] font-semibold tracking-wide'
  }

  const iconSizes: Record<ButtonSize, number> = {
    sm: 16,
    md: 18,
    lg: 20,
    xl: 24,
    hero: 28
  }

  return (
    <motion.button
      whileTap={{ scale: 0.98 }}
      className={`${baseStyles} ${variantStyles[variant]} ${sizeStyles[size]} ${fullWidth ? 'w-full' : ''} ${className}`}
      onClick={onClick}
      disabled={disabled}
      type={type}
      aria-label={ariaLabel}
    >
      {/* Geometric accent bar - visible on desktop only */}
      {withAccent && (
        <span
          className="hidden md:block w-6 h-1 bg-earth-400 rounded-full flex-shrink-0 dark:bg-earth-500"
          aria-hidden="true"
        />
      )}
      <span className={withAccent ? 'text-center' : 'flex-1 text-center'}>{children}</span>
      {icon === 'arrow' && (
        <ArrowRight
          size={iconSizes[size]}
          className="flex-shrink-0"
          strokeWidth={2.5}
        />
      )}
    </motion.button>
  )
}
