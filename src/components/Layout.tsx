import { Outlet, Link, useLocation } from 'react-router-dom'
import BottomNav from './BottomNav'
import OfflineIndicator from './OfflineIndicator'

const SECTION_NAMES: Record<string, string> = {
  '/compass/convergence': 'Daily Convergence',
  '/compass/meditation': 'Meditations',
  '/compass/cards': 'Affirmation Cards',
  '/compass/poem': 'Spoken Word',
  '/compass/film': 'Meet Ivor',
  '/compass/journal': 'Journal',
  '/compass/mood': 'Mood Check-in',
  '/compass/workshops': 'Workshops',
  '/compass/sunroom': 'The Sunroom',
  '/compass/progress': 'Sacred Momentum',
  '/compass/about': 'About Ivor',
  '/compass/crisis': 'Support',
}

function getSectionName(pathname: string): string | null {
  // Try exact match first, then prefix match for routes like /compass/meditation/1
  if (SECTION_NAMES[pathname]) return SECTION_NAMES[pathname]
  const prefix = Object.keys(SECTION_NAMES).find((key) => pathname.startsWith(key))
  return prefix ? SECTION_NAMES[prefix] : null
}

export default function Layout() {
  const location = useLocation()
  const isHome = location.pathname === '/compass'
  const sectionName = getSectionName(location.pathname)

  return (
    <div className="min-h-screen bg-compass-black text-white flex flex-col">
      {/* Skip link */}
      <a
        href="#main-content"
        className="skip-link"
      >
        Skip to content
      </a>

      {/* Header */}
      <header className="sticky top-0 z-40 bg-compass-black/95 backdrop-blur-sm border-b border-gold/20" role="banner">
        <div className="max-w-lg mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Link to="/compass" className="font-heritage text-gold text-lg">
              Ivor's Compass
            </Link>
            {sectionName && !isHome && (
              <>
                <span className="text-gold/30 text-sm">·</span>
                <span className="text-gold-dim text-xs">{sectionName}</span>
              </>
            )}
          </div>
          {!isHome && (
            <Link
              to="/compass"
              className="text-sm text-text-muted hover:text-gold transition-colors focus-visible:ring-2 focus-visible:ring-gold/60 focus-visible:ring-offset-2 focus-visible:ring-offset-compass-black rounded px-1"
            >
              ← Home
            </Link>
          )}
        </div>
      </header>

      {/* Offline indicator */}
      <OfflineIndicator />

      {/* Content */}
      <main id="main-content" className="flex-1 max-w-lg mx-auto w-full px-4 py-6 pb-24" role="main">
        <Outlet />
      </main>

      {/* Footer */}
      <footer className="border-t border-compass-border py-6 px-4 pb-24" role="contentinfo">
        <div className="max-w-lg mx-auto text-center space-y-3">
          <p className="text-xs text-text-muted">
            A heritage wellness project by{' '}
            <span className="text-gold-rich">BLKOUT</span>
          </p>
          <div className="flex items-center justify-center gap-4 text-[10px] text-text-muted/60">
            <span>Croydon Council</span>
            <span>•</span>
            <span>National Lottery Heritage Fund</span>
          </div>
          <p className="text-[10px] text-text-muted/60">
            SCT 150 Small Heritage Grant — Making Shared Heritage Personal
          </p>
        </div>
      </footer>

      {/* Bottom Navigation */}
      <BottomNav />
    </div>
  )
}
