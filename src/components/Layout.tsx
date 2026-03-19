import { Outlet, Link, useLocation } from 'react-router-dom'

export default function Layout() {
  const location = useLocation()
  const isHome = location.pathname === '/compass'

  return (
    <div className="min-h-screen bg-compass-black text-white flex flex-col">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-compass-black/95 backdrop-blur-sm border-b border-gold/20">
        <div className="max-w-lg mx-auto px-4 py-3 flex items-center justify-between">
          <Link to="/compass" className="flex items-center gap-2">
            <span className="font-heritage text-gold text-lg">Ivor's Compass</span>
          </Link>
          {!isHome && (
            <Link
              to="/compass"
              className="text-sm text-text-muted hover:text-gold transition-colors"
            >
              ← Home
            </Link>
          )}
        </div>
      </header>

      {/* Content */}
      <main className="flex-1 max-w-lg mx-auto w-full px-4 py-6">
        <Outlet />
      </main>

      {/* Footer */}
      <footer className="border-t border-compass-border py-6 px-4">
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
    </div>
  )
}
