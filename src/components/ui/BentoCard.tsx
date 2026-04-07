import { Link } from 'react-router-dom'

export interface BentoCardProps {
  to: string
  className?: string
  label?: string
  taskColor?: string
  children: React.JSX.Element | React.JSX.Element[]
}

export function BentoCard({ to, className = '', label, taskColor, children }: BentoCardProps) {
  return (
    <Link
      to={to}
      aria-label={label}
      className={`block bg-compass-dark border border-gold/20 p-5 transition-all active:scale-[0.98] hover:shadow-[0_0_24px_rgba(212,175,55,0.12)] hover:border-gold/40 focus-visible:ring-2 focus-visible:ring-gold/60 focus-visible:ring-offset-2 focus-visible:ring-offset-compass-black ${taskColor ? 'accent-line' : ''} ${className}`}
      style={{
        boxShadow: '0 2px 16px rgba(0,0,0,0.4)',
        ...(taskColor ? { '--accent-color': taskColor } as React.CSSProperties : {}),
      }}
    >
      {children}
    </Link>
  )
}
