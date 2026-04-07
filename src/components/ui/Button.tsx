export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger'
  loading?: boolean
  children: React.ReactNode
}

const variantClasses: Record<NonNullable<ButtonProps['variant']>, string> = {
  primary: 'bg-gold-rich hover:bg-gold text-black font-semibold',
  secondary: 'bg-compass-dark border border-compass-border text-white hover:border-gold/40',
  ghost: 'bg-transparent text-text-muted hover:text-white',
  danger: 'bg-red-900/30 border border-red-700/40 text-red-300 hover:border-red-600/60',
}

export function Button({ variant = 'primary', loading, children, className = '', disabled, ...rest }: ButtonProps) {
  return (
    <button
      className={`px-4 py-3 rounded-lg text-sm transition-all active:scale-[0.98] focus-visible:ring-2 focus-visible:ring-gold/60 focus-visible:ring-offset-2 focus-visible:ring-offset-compass-black disabled:opacity-50 disabled:cursor-not-allowed ${variantClasses[variant]} ${className}`}
      disabled={disabled || loading}
      {...rest}
    >
      {loading ? 'Loading...' : children}
    </button>
  )
}
