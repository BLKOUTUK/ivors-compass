export interface LoadingSkeletonProps {
  lines?: number
  className?: string
}

export function LoadingSkeleton({ lines = 3, className = '' }: LoadingSkeletonProps) {
  return (
    <div className={`space-y-3 animate-pulse ${className}`} role="status" aria-label="Loading">
      {Array.from({ length: lines }).map((_, i) => (
        <div
          key={i}
          className="h-4 bg-compass-card rounded"
          style={{ width: `${85 - i * 15}%` }}
        />
      ))}
      <span className="sr-only">Loading...</span>
    </div>
  )
}
