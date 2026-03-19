import { useState } from 'react'
import { useCompass } from '../hooks/useCompass'
import { validateAccessCode } from '../lib/supabase'

export default function UnlockPage() {
  const { unlock } = useCompass()
  const [code, setCode] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    const cleaned = code.toUpperCase().trim()
    if (!cleaned) {
      setError('Please enter your access code')
      return
    }

    setLoading(true)
    try {
      const result = await validateAccessCode(cleaned)
      if (result.valid) {
        unlock(cleaned)
      } else {
        setError('Code not recognised. Check your card and try again.')
      }
    } catch {
      // Offline or Supabase not yet set up — allow any IVOR-XXXX code for dev
      if (/^IVOR-[A-Z0-9]{4}$/i.test(cleaned)) {
        unlock(cleaned)
      } else {
        setError('Unable to verify code. Please check your connection.')
      }
    } finally {
      setLoading(false)
    }
  }

  // Handle URL param (QR code scan)
  const params = new URLSearchParams(window.location.search)
  const urlCode = params.get('code')
  if (urlCode && !code) {
    setCode(urlCode)
  }

  return (
    <div className="min-h-screen bg-compass-black flex flex-col items-center justify-center px-6">
      {/* Logo area */}
      <div className="text-center mb-12 animate-fade-in">
        <div className="w-16 h-16 mx-auto mb-6 rounded-full border-2 border-gold/40 flex items-center justify-center">
          <svg viewBox="0 0 24 24" className="w-8 h-8 text-gold" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" />
          </svg>
        </div>
        <h1 className="font-heritage text-4xl text-white mb-2">Ivor's Compass</h1>
        <p className="text-gold-rich text-sm italic">Making Shared Heritage Personal</p>
      </div>

      {/* Access code form */}
      <form onSubmit={handleSubmit} className="w-full max-w-xs space-y-4 animate-fade-in" style={{ animationDelay: '0.2s' }}>
        <div>
          <label htmlFor="code" className="block text-xs text-text-muted mb-2 text-center">
            Enter your access code
          </label>
          <input
            id="code"
            type="text"
            value={code}
            onChange={(e) => {
              setCode(e.target.value.toUpperCase())
              setError('')
            }}
            placeholder="IVOR-XXXX"
            maxLength={9}
            className="w-full text-center text-xl tracking-[0.3em] font-mono bg-compass-dark border border-compass-border rounded-lg px-4 py-4 text-white placeholder-text-muted/40 focus:outline-none focus:border-gold/60 transition-colors"
            autoFocus
            autoComplete="off"
          />
        </div>

        {error && (
          <p className="text-red-400 text-xs text-center">{error}</p>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full py-3 bg-gold-rich hover:bg-gold text-black font-semibold rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? 'Checking...' : 'Unlock'}
        </button>
      </form>

      {/* QR hint */}
      <p className="text-text-muted/40 text-xs mt-8 text-center animate-fade-in" style={{ animationDelay: '0.4s' }}>
        or scan the QR code on your card
      </p>

      {/* Privacy notice */}
      <div className="mt-12 max-w-xs text-center animate-fade-in" style={{ animationDelay: '0.6s' }}>
        <p className="text-text-muted/30 text-[10px] leading-relaxed">
          Your journal entries stay on your device and are never sent to our servers.
          We collect anonymous usage counts for our funder's evaluation report.
          No personal information is stored.
        </p>
      </div>

      {/* Funder logos */}
      <div className="mt-8 flex items-center gap-6 text-text-muted/20 text-[9px]">
        <span>Croydon Council</span>
        <span>•</span>
        <span>National Lottery Heritage Fund</span>
      </div>
    </div>
  )
}
