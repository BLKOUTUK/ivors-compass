import { useEffect, useMemo, useState } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { claimCompassCode, logAnalytics } from '../lib/supabase'
import { syncClaimToSendFox } from '../lib/sendfox'

const UK_POSTCODE = /^[A-Z]{1,2}\d[A-Z\d]?\s*\d[A-Z]{2}$/i

export default function ClaimPage() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const [firstName, setFirstName] = useState('')
  const [email, setEmail] = useState('')
  const [postcode, setPostcode] = useState('')
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [result, setResult] = useState<{
    code: string
    returning: boolean
    firstName: string
  } | null>(null)

  // Partner cohort routing: ?ref=qc routes to the Queer Croydon 100-code pioneer pool
  const source = useMemo(() => {
    const ref = (searchParams.get('ref') || '').toLowerCase()
    if (ref === 'qc' || ref === 'queer-croydon') return 'queer-croydon'
    return 'landing'
  }, [searchParams])
  const isQcCohort = source === 'queer-croydon'

  useEffect(() => {
    logAnalytics(null, 'claim_started', isQcCohort ? { source } : undefined)
  }, [isQcCohort, source])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (!firstName.trim()) return setError('Tell us your first name.')
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
      return setError("That email address doesn't look right.")
    if (!UK_POSTCODE.test(postcode.trim()))
      return setError('Enter a valid UK postcode, e.g. CR0 1AA.')

    setSubmitting(true)
    try {
      const res = await claimCompassCode(firstName, email, postcode, source)

      if (!res.ok) {
        if (res.exhausted) {
          logAnalytics(null, 'claim_exhausted', { source })
          const soldOutQuery =
            res.reason === 'qc_cohort_full' ? 'qc_sold_out' : 'sold_out'
          navigate(`/waitlist?source=${soldOutQuery}`, { replace: true })
          return
        }
        setError(
          res.reason === 'email_invalid'
            ? "That email address doesn't look right."
            : 'Something went wrong. Please try again.',
        )
        return
      }

      syncClaimToSendFox(
        email.trim(),
        firstName.trim(),
        postcode.trim().toUpperCase(),
        source,
      )
      logAnalytics(null, 'claim_completed', {
        returning: res.returning,
        postcode_area: postcode.trim().toUpperCase().replace(/\d.*$/, ''),
        source,
      })

      setResult({
        code: res.code!,
        returning: !!res.returning,
        firstName: res.first_name || firstName.trim(),
      })
    } catch (err) {
      console.error(err)
      setError('Something went wrong. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  // ═══════════════════════════════════════════════════════════════════
  // REVEAL SCREEN
  // ═══════════════════════════════════════════════════════════════════
  if (result) {
    return (
      <div className="min-h-screen bg-compass-black text-warm-white font-sans">
        <div className="border-t-4 border-gold" />

        <div className="relative overflow-hidden">
          <div
            className="absolute inset-0"
            style={{
              background:
                'radial-gradient(circle at 50% 20%, rgba(212,175,55,0.14) 0%, rgba(74,25,66,0.4) 40%, rgba(26,26,46,1) 75%)',
            }}
            aria-hidden
          />

          <div className="relative z-10 max-w-2xl mx-auto px-6 py-20">
            <p className="text-gold text-[11px] font-semibold tracking-[0.3em] uppercase mb-6">
              {result.returning ? 'Welcome back' : "You're in"}
            </p>

            <h1 className="font-sans font-black uppercase leading-[0.88] tracking-tight text-5xl sm:text-7xl mb-4">
              {result.returning ? 'Hello' : 'Thank you,'}
              <br />
              <span className="text-gold">{result.firstName}.</span>
            </h1>

            <p className="font-serif italic text-xl text-warm-white/85 mb-12 max-w-lg">
              {result.returning
                ? 'same code as before — yours to keep.'
                : 'write it down, screenshot it, email it to yourself.'}
            </p>

            <div className="h-px w-24 bg-gold mb-8" aria-hidden />

            {/* The code — big, bold, gold on purple */}
            <div className="bg-blkout-purple border-4 border-gold p-8 sm:p-10 mb-10">
              <p className="text-gold text-[11px] font-semibold tracking-[0.3em] uppercase mb-4">
                Your access code
              </p>
              <p className="font-mono font-black text-4xl sm:text-6xl tracking-[0.2em] text-gold leading-none break-all">
                {result.code}
              </p>
            </div>

            <Link
              to={`/unlock?code=${encodeURIComponent(result.code)}`}
              className="inline-block bg-blkout-red hover:bg-red-700 text-white font-black uppercase tracking-wider text-sm px-10 py-5 transition-colors shadow-[6px_6px_0_0_#d4af37] mb-10"
            >
              Open my compass →
            </Link>

            <div className="border-t border-compass-border pt-8 max-w-lg">
              <p className="text-gold text-[11px] font-semibold tracking-[0.25em] uppercase mb-3">
                {isQcCohort ? 'Your pioneer deal' : 'The deal'}
              </p>
              <p className="text-warm-white/80 text-sm leading-relaxed">
                {isQcCohort ? (
                  <>
                    You're one of 100 <em className="not-italic text-gold">journal pioneers</em> —
                    reserved access for Queer Croydon readers. Thirty days from now we'll send
                    you a short feedback form. Your experience shapes the physical print run
                    going to the designers this summer. That's the whole ask.
                  </>
                ) : (
                  <>
                    We'll email you in May for a short feedback call. It's how we report back
                    to Croydon Council and keep this work funded. Takes about 10 minutes.
                  </>
                )}
              </p>
            </div>
          </div>
        </div>

        <div className="border-b-4 border-gold" />
      </div>
    )
  }

  // ═══════════════════════════════════════════════════════════════════
  // FORM SCREEN
  // ═══════════════════════════════════════════════════════════════════
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
        <p className="text-gold text-[11px] font-semibold tracking-[0.3em] uppercase mb-6">
          {isQcCohort ? 'Queer Croydon pioneer — 100 codes reserved' : 'Three fields · Instant code'}
        </p>

        <h1 className="font-sans font-black uppercase leading-[0.88] tracking-tight text-5xl sm:text-7xl mb-4">
          Claim your
          <br />
          <span className="text-gold">free code.</span>
        </h1>

        <p className="font-serif italic text-xl text-warm-white/85 mb-12 max-w-lg">
          {isQcCohort
            ? 'one of 100 reserved for Queer Croydon readers — first come, first served.'
            : 'one per person — revealed on screen, yours to keep.'}
        </p>

        <div className="h-px w-24 bg-gold mb-12" aria-hidden />

        <form onSubmit={handleSubmit} className="space-y-6 max-w-lg">
          <Field
            id="firstName"
            label="First name"
            value={firstName}
            onChange={setFirstName}
            placeholder="Your first name"
            autoComplete="given-name"
          />
          <Field
            id="email"
            label="Email"
            type="email"
            value={email}
            onChange={setEmail}
            placeholder="you@example.com"
            autoComplete="email"
          />
          <Field
            id="postcode"
            label="Postcode"
            value={postcode}
            onChange={(v) => setPostcode(v.toUpperCase())}
            placeholder="CR0 1AA"
            autoComplete="postal-code"
            hint="For our report to Croydon Council."
          />

          {/* The deal — bold shell block, not a soft "notice" */}
          <div className="bg-blkout-purple border-l-4 border-gold pl-5 pr-4 py-5">
            <p className="text-gold text-[11px] font-semibold tracking-[0.25em] uppercase mb-2">
              {isQcCohort ? 'Your pioneer deal' : 'The deal'}
            </p>
            <p className="text-warm-white/95 text-sm leading-relaxed">
              {isQcCohort
                ? 'By claiming a code you become one of 100 journal pioneers. In 30 days we\'ll send a short feedback form — your experience shapes the physical print run this summer. That\'s the whole ask.'
                : 'By claiming a code you agree to a short feedback conversation in May. It\'s how we report to our funders and keep this work alive.'}
            </p>
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
            {submitting ? 'Claiming…' : 'Claim my code →'}
          </button>
        </form>

        <p className="text-text-muted/70 text-[11px] tracking-wide leading-relaxed mt-10 max-w-lg">
          Journal entries stay on your device — we never see them. Name, email
          and postcode stored only so we can reach you for feedback.
        </p>
      </main>

      <div className="border-b-4 border-gold" />
    </div>
  )
}

function Field({
  id,
  label,
  value,
  onChange,
  placeholder,
  type = 'text',
  autoComplete,
  hint,
}: {
  id: string
  label: string
  value: string
  onChange: (v: string) => void
  placeholder?: string
  type?: string
  autoComplete?: string
  hint?: string
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
      {hint && (
        <p className="text-text-muted/70 text-[11px] mt-2 italic">{hint}</p>
      )}
    </div>
  )
}
