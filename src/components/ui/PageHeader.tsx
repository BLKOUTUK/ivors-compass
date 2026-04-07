export interface PageHeaderProps {
  title: string
  subtitle?: string
  badge?: { label: string; color?: string }
}

export function PageHeader({ title, subtitle, badge }: PageHeaderProps) {
  return (
    <div className="text-center py-6">
      {badge && (
        <span
          className="inline-block text-[10px] font-semibold tracking-widest uppercase px-3 py-1 rounded-full mb-4"
          style={{
            color: badge.color ?? '#D4AF37',
            border: `1px solid ${(badge.color ?? '#D4AF37')}40`,
            backgroundColor: `${(badge.color ?? '#D4AF37')}10`,
          }}
        >
          {badge.label}
        </span>
      )}
      <h1 className="font-heritage text-2xl text-white">{title}</h1>
      {subtitle && (
        <p className="text-gold-rich text-sm italic mt-1">{subtitle}</p>
      )}
    </div>
  )
}
