export interface EmptyStateProps {
  icon?: React.ReactNode
  title: string
  description?: string
  action?: React.ReactNode
}

export function EmptyState({ icon, title, description, action }: EmptyStateProps) {
  return (
    <div className="text-center py-12 px-4">
      {icon && <div className="mb-4 flex justify-center text-gold/30">{icon}</div>}
      <h3 className="font-heritage text-lg text-white/80">{title}</h3>
      {description && (
        <p className="text-text-muted text-sm mt-2 max-w-xs mx-auto">{description}</p>
      )}
      {action && <div className="mt-6">{action}</div>}
    </div>
  )
}
