export interface CardProps {
  variant?: 'default' | 'gold' | 'phase'
  phaseColor?: string
  className?: string
  children: React.ReactNode
}

const borderClasses: Record<string, string> = {
  default: 'border-compass-border',
  gold: 'border-[#D4AF37]/20',
  phase: '', // handled via inline style
}

export function Card({ variant = 'default', phaseColor, className = '', children }: CardProps) {
  return (
    <div
      className={`bg-compass-dark border rounded-xl p-5 ${borderClasses[variant]} ${className}`}
      style={variant === 'phase' && phaseColor ? { borderColor: `${phaseColor}30` } : undefined}
    >
      {children}
    </div>
  )
}
