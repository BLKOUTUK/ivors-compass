export interface WarmthOrbProps {
  intensity?: number
  color?: string
  size?: number
}

export function WarmthOrb({ intensity = 0.5, color = '#D4AF37', size = 24 }: WarmthOrbProps) {
  return (
    <div
      className="rounded-full animate-pulse"
      aria-hidden="true"
      style={{
        width: size,
        height: size,
        background: color,
        opacity: intensity,
        filter: `blur(${size * 0.3}px)`,
        boxShadow: `0 0 ${size}px ${color}`,
      }}
    />
  )
}
