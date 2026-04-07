import { Outlet, Link, useLocation } from 'react-router-dom'
import BottomNav from './BottomNav'
import OfflineIndicator from './OfflineIndicator'

const SECTION_NAMES: Record<string, string> = {
  '/compass/convergence': 'Assembly',
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
      <a href="#main-content" className="skip-link">
        Skip to content
      </a>

      {/* Header — sharp shell */}
      <header className="sticky top-0 z-40 bg-compass-black/95 backdrop-blur-sm border-b-2 border-gold/30" role="banner">
        <div className="max-w-lg mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Link to="/compass" className="font-bold-shell text-gold text-lg tracking-tight">
              Ivor's Compass
            </Link>
            {sectionName && !isHome && (
              <>
                <span className="text-gold/30 text-sm">&mdash;</span>
                <span className="text-gold-dim text-xs font-medium">{sectionName}</span>
              </>
            )}
          </div>
          {!isHome && (
            <Link
              to="/compass"
              className="text-sm text-text-muted hover:text-gold transition-colors focus-visible:ring-2 focus-visible:ring-gold/60 focus-visible:ring-offset-2 focus-visible:ring-offset-compass-black px-1"
            >
              &larr; Home
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

      {/* Footer — gold border */}
      <footer className="border-t-2 border-gold/20 py-6 px-4 pb-24" role="contentinfo">
        <div className="max-w-lg mx-auto text-center space-y-3">
          <p className="text-xs text-text-muted">
            A community-owned heritage project by{' '}
            <span className="text-blkout-red font-semibold">BLKOUT</span>
          </p>
          <div className="flex items-center justify-center gap-4 text-[10px] text-text-muted/60">
            <span>Croydon Council</span>
            <span>&mdash;</span>
            <span>National Lottery Heritage Fund</span>
          </div>
          <p className="text-[10px] text-text-muted/60">
            SCT 150 Small Heritage Grant &mdash; Making Shared Heritage Personal
          </p>
        </div>
      </footer>

      {/* Bottom Navigation */}
      <BottomNav />
    </div>
  )
}
