import { Link, useLocation } from 'react-router-dom'

interface NavItem {
  label: string
  to: string
  match: string[]
  icon: React.ReactNode
}

const navItems: NavItem[] = [
  {
    label: 'Home',
    to: '/compass',
    match: ['/compass'],
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-5 h-5">
        <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" />
      </svg>
    ),
  },
  {
    label: 'Meditations',
    to: '/compass/meditation/1',
    match: ['/compass/meditation'],
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-5 h-5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" />
      </svg>
    ),
  },
  {
    label: 'Cards',
    to: '/compass/cards',
    match: ['/compass/cards'],
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-5 h-5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M6 6h.008M6 18h.008M18 6h.008M18 18h.008M3.75 6A2.25 2.25 0 016 3.75h12A2.25 2.25 0 0120.25 6v12A2.25 2.25 0 0118 20.25H6A2.25 2.25 0 013.75 18V6z" />
      </svg>
    ),
  },
  {
    label: 'Journal',
    to: '/compass/journal',
    match: ['/compass/journal'],
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-5 h-5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
      </svg>
    ),
  },
  {
    label: 'Mood',
    to: '/compass/mood',
    match: ['/compass/mood'],
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-5 h-5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
      </svg>
    ),
  },
]

export default function BottomNav() {
  const location = useLocation()

  const isActive = (item: NavItem) => {
    if (item.to === '/compass') {
      return location.pathname === '/compass'
    }
    return item.match.some((prefix) => location.pathname.startsWith(prefix))
  }

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-50 bg-compass-black/95 backdrop-blur-sm"
      style={{ paddingBottom: 'env(safe-area-inset-bottom, 0px)' }}
      role="navigation"
      aria-label="Main navigation"
    >
      {/* Gold glow line */}
      <div className="h-px bg-gradient-to-r from-transparent via-gold/30 to-transparent" />

      <div className="max-w-lg mx-auto flex items-center justify-around px-2 py-2">
        {navItems.map((item) => {
          const active = isActive(item)
          return (
            <Link
              key={item.label}
              to={item.to}
              className={`flex flex-col items-center gap-1 px-3 py-1.5 rounded-lg transition-colors min-w-[52px] ${
                active ? 'text-gold' : 'text-text-muted/50 hover:text-text-muted'
              }`}
              aria-current={active ? 'page' : undefined}
            >
              {item.icon}
              <span className="text-[10px]">{item.label}</span>
              {/* Active dot indicator */}
              {active && (
                <span className="w-1 h-1 rounded-full bg-gold" />
              )}
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
