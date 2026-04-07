import { Outlet, Link, useLocation } from 'react-router-dom'
import BottomNav from './BottomNav'
import OfflineIndicator from './OfflineIndicator'

export default function Layout() {
  const location = useLocation()
  const isHome = location.pathname === '/compass'

  return (
    <div className="min-h-screen bg-compass-black text-white flex flex-col">
      {/* Skip link */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-[100] focus:bg-gold focus:text-black focus:px-4 focus:py-2 focus:rounded-lg focus:text-sm"
      >
        Skip to content
      </a>

      {/* Header */}
      <header className="sticky top-0 z-40 bg-compass-black/95 backdrop-blur-sm border-b border-gold/20" role="banner">
        <div className="max-w-lg mx-auto px-4 py-3 flex items-center justify-between">
          <Link to="/compass" className="flex items-center gap-2">
            <span className="font-heritage text-gold text-lg">Ivor's Compass</span>
          </Link>
          {!isHome && (
            <Link
              to="/compass"
              className="text-sm text-text-muted hover:text-gold transition-colors focus-visible:ring-2 focus-visible:ring-gold/60 focus-visible:ring-offset-2 focus-visible:ring-offset-compass-black rounded"
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
          <p className="text-[10px] text-text-muted/40">
            SCT 150 Small Heritage Grant — Making Shared Heritage Personal
          </p>
        </div>
      </footer>

      {/* Bottom Navigation */}
      <BottomNav />
    </div>
  )
}
