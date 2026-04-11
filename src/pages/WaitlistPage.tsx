import { useEffect, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { joinCompassWaitlist, logAnalytics } from '../lib/supabase'
import { syncWaitlistToSendFox } from '../lib/sendfox'

export default function WaitlistPage() {
  const [params] = useSearchParams()
  const source = params.get('source') === 'sold_out' ? 'sold_out' : 'opt_in'

  const [firstName, setFirstName] = useState('')
  const [email, setEmail] = useState('')
  const [postcode, setPostcode] = useState('')
  const [wantsDigital, setWantsDigital] = useState(true)
  const [wantsPrint, setWantsPrint] = useState(true)
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [joined, setJoined] = useState(false)

  useEffect(() => {
    logAnalytics(null, 'waitlist_view', { source })
  }, [source])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
      return setError("That email address doesn't look right.")
    if (!wantsDigital && !wantsPrint)
      return setError('Pick at least one — digital or print.')

    setSubmitting(true)
    try {
      const interest: string[] = []
      if (wantsDigital) interest.push('digital_50_off')
      if (wantsPrint) interest.push('print_20_off')

      const res = await joinCompassWaitlist(
        email,
        firstName || undefined,
        postcode || undefined,
        interest,
        source,
      )

      if (!res.ok) {
        setError('Something went wrong. Please try again.')
        return
      }

      syncWaitlistToSendFox(
        email.trim(),
        firstName.trim() || undefined,
        postcode.trim() || undefined,
      )
      logAnalytics(null, 'waitlist_joined', { source, interest })
      setJoined(true)
    } catch (err) {
      console.error(err)
      setError('Something went wrong. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  // ═══════════════════════════════════════════════════════════════════
  // JOINED CONFIRMATION
  // ═══════════════════════════════════════════════════════════════════
  if (joined) {
    return (
      <div className="min-h-screen bg-compass-black text-warm-white font-sans">
        <div className="border-t-4 border-gold" />

        <div className="relative overflow-hidden">
          <div
            className="absolute inset-0"
            style={{
              background:
                'radial-gradient(circle at 50% 20%, rgba(212,175,55,0.12) 0%, rgba(74,25,66,0.4) 40%, rgba(26,26,46,1) 75%)',
            }}
            aria-hidden
          />

          <div className="relative z-10 max-w-2xl mx-auto px-6 py-20">
            <p className="text-gold text-[11px] font-semibold tracking-[0.3em] uppercase mb-6">
              You're on the list
            </p>
            <h1 className="font-sans font-black uppercase leading-[0.88] tracking-tight text-5xl sm:text-7xl mb-4">
              Thank you
              {firstName && (
                <>
                  ,<br />
                  <span className="text-gold">{firstName}.</span>
                </>
              )}
              {!firstName && <span className="text-gold">.</span>}
            </h1>
            <p className="font-serif italic text-xl text-warm-white/85 mb-12 max-w-lg">
              one email when we launch. nothing in between.
            </p>

            <div className="h-px w-24 bg-gold mb-8" aria-hidden />

            <p className="text-gold text-[11px] font-semibold tracking-[0.3em] uppercase mb-5">
              Your discount — locked in
            </p>
            <div className="space-y-4 mb-12 max-w-lg">
              {wantsDigital && (
                <div className="bg-blkout-purple border-l-4 border-gold pl-5 pr-4 py-4 flex items-baseline justify-between">
                  <span className="font-sans font-black uppercase tracking-wide text-warm-white">
                    Digital compass
                  </span>
                  <span className="text-gold font-mono font-bold text-lg">
                    50% off
                  </span>
                </div>
              )}
              {wantsPrint && (
                <div className="bg-blkout-purple border-l-4 border-gold pl-5 pr-4 py-4 flex items-baseline justify-between">
                  <span className="font-sans font-black uppercase tracking-wide text-warm-white">
                    Print journal
                  </span>
                  <span className="text-gold font-mono font-bold text-lg">
                    20% off
                  </span>
                </div>
              )}
            </div>

            <Link
              to="/"
              className="inline-block border-2 border-gold hover:bg-gold hover:text-compass-black text-gold font-black uppercase tracking-wider text-sm px-8 py-5 transition-colors"
            >
              Back to landing →
            </Link>
          </div>
        </div>

        <div className="border-b-4 border-gold" />
      </div>
    )
  }

  // ═══════════════════════════════════════════════════════════════════
  // FORM SCREEN
  // ═══════════════════════════════════════════════════════════════════
  const soldOut = source === 'sold_out'

  return (
    <div className="min-h-screen bg-compass-black text-warm-white font-sans">
      <div className="border-t-4 border-gold" />

      <nav className="max-w-2xl mx-auto px-6 pt-8">
        <Link
          to="/"
          className="text-text-muted hover:text-gold text-xs font-semibold tracking-[0.2em] uppercase transition-colors"
        >
          ← Back
        </Link>
      </nav>

      <main className="max-w-2xl mx-auto px-6 pt-10 pb-20">
        {soldOut && (
          <div className="bg-blkout-red text-white px-4 py-3 mb-8 inline-block">
            <p className="text-[11px] font-black tracking-[0.25em] uppercase">
              All 100 launch codes · claimed
            </p>
          </div>
        )}

        <p className="text-gold text-[11px] font-semibold tracking-[0.3em] uppercase mb-6">
          Summer release · waitlist
        </p>

        <h1 className="font-sans font-black uppercase leading-[0.88] tracking-tight text-5xl sm:text-7xl mb-4">
          Lock in
          <br />
          <span className="text-gold">your discount.</span>
        </h1>

        <p className="font-serif italic text-xl text-warm-white/85 mb-10 max-w-lg">
          wider release this Summer — with a print edition of the journal.
        </p>

        <div className="h-px w-24 bg-gold mb-10" aria-hidden />

        {/* The offer — bold, not soft */}
        <div className="border-4 border-gold bg-compass-dark p-6 mb-12 max-w-lg">
          <div className="flex items-baseline justify-between py-3 border-b border-compass-border">
            <span className="font-sans font-black uppercase tracking-wide text-warm-white">
              Digital compass
            </span>
            <span className="text-gold font-mono font-black text-2xl">50% off</span>
          </div>
          <div className="flex items-baseline justify-between py-3">
            <span className="font-sans font-black uppercase tracking-wide text-warm-white">
              Print journal
            </span>
            <span className="text-gold font-mono font-black text-2xl">20% off</span>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6 max-w-lg">
          <WaitField
            id="wl-email"
            label="Email"
            type="email"
            value={email}
            onChange={setEmail}
            placeholder="you@example.com"
            autoComplete="email"
          />
          <WaitField
            id="wl-name"
            label="First name (optional)"
            value={firstName}
            onChange={setFirstName}
            placeholder="Your first name"
            autoComplete="given-name"
          />
          <WaitField
            id="wl-postcode"
            label="Postcode (optional)"
            value={postcode}
            onChange={(v) => setPostcode(v.toUpperCase())}
            placeholder="CR0 1AA"
            autoComplete="postal-code"
          />

          <div className="pt-2">
            <p className="text-gold text-[11px] font-semibold tracking-[0.2em] uppercase mb-4">
              Interested in
            </p>
            <div className="space-y-3">
              <Toggle
                label="Digital compass (50% off)"
                checked={wantsDigital}
                onChange={setWantsDigital}
              />
              <Toggle
                label="Print journal (20% off)"
                checked={wantsPrint}
                onChange={setWantsPrint}
              />
            </div>
          </div>

          {error && (
            <p
              className="text-blkout-red text-sm font-semibold tracking-wide"
              role="alert"
            >
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={submitting}
            className="w-full bg-blkout-red hover:bg-red-700 text-white font-black uppercase tracking-wider text-sm py-5 transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-[6px_6px_0_0_#d4af37]"
          >
            {submitting ? 'Joining…' : 'Lock in my discount →'}
          </button>
        </form>

        <p className="text-text-muted/70 text-[11px] tracking-wide leading-relaxed mt-10 max-w-lg">
          One email when we launch. No spam. Unsubscribe any time.
        </p>
      </main>

      <div className="border-b-4 border-gold" />
    </div>
  )
}

function WaitField({
  id,
  label,
  value,
  onChange,
  placeholder,
  type = 'text',
  autoComplete,
}: {
  id: string
  label: string
  value: string
  onChange: (v: string) => void
  placeholder?: string
  type?: string
  autoComplete?: string
}) {
  return (
    <div>
      <label
        htmlFor={id}
        className="block text-gold text-[11px] font-semibold tracking-[0.2em] uppercase mb-2"
      >
        {label}
      </label>
      <input
        id={id}
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        autoComplete={autoComplete}
        className="w-full bg-compass-dark border-2 border-compass-border px-4 py-4 text-warm-white text-base font-medium placeholder-text-muted/50 focus:outline-none focus:border-gold transition-colors"
      />
    </div>
  )
}

function Toggle({
  label,
  checked,
  onChange,
}: {
  label: string
  checked: boolean
  onChange: (v: boolean) => void
}) {
  return (
    <label className="flex items-center gap-3 cursor-pointer select-none group">
      <span
        className={`w-6 h-6 flex items-center justify-center border-2 transition-colors ${
          checked
            ? 'border-gold bg-gold'
            : 'border-compass-border group-hover:border-gold/60'
        }`}
        aria-hidden
      >
        {checked && (
          <svg
            className="w-4 h-4 text-compass-black"
            viewBox="0 0 12 12"
            fill="none"
          >
            <path
              d="M2 6l3 3 5-6"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        )}
      </span>
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        className="sr-only"
      />
      <span className="text-warm-white font-medium text-sm">{label}</span>
    </label>
  )
}
