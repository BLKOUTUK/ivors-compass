export interface PhaseBadgeProps {
  label: string
  color: string
}

export function PhaseBadge({ label, color }: PhaseBadgeProps) {
  return (
    <span
      className="inline-block text-[10px] font-semibold tracking-widest uppercase px-3 py-1 rounded-full"
      style={{ color, border: `1px solid ${color}40`, backgroundColor: `${color}10` }}
    >
      {label}
    </span>
  )
}
