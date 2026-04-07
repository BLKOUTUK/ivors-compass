export interface DividerProps {
  showStar?: boolean
}

export function Divider({ showStar = true }: DividerProps) {
  return (
    <div className="flex items-center gap-4">
      <div className="flex-1 h-px bg-gradient-to-r from-transparent via-gold/30 to-transparent" />
      {showStar && (
        <svg viewBox="0 0 24 24" className="w-4 h-4 text-gold/40" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
          <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" />
        </svg>
      )}
      <div className="flex-1 h-px bg-gradient-to-r from-transparent via-gold/30 to-transparent" />
    </div>
  )
}
