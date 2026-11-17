import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { logAnalytics, submitJournalFeedback } from '../lib/supabase'
import { useCompass } from '../hooks/useCompass'

// The three questions printed on the "Tell us how it went" page of the journal (first edition, 2027).
// Keep the wording identical to the page: readers may have answered on paper first.
const QUESTIONS = [
  { key: 'journal-most', label: 'Which page did the most for you, and why?' },
  { key: 'journal-least', label: 'Which page did nothing for you, or got in your way?' },
  { key: 'journal-next', label: 'What should the next edition ask that this one didn’t?' },
] as const

export default function FeedbackPage() {
  const { accessCode } = useCompass()
  const [answers, setAnswers] = useState<Record<string, string>>({})
  const [email, setEmail] = useState('')
  const [newsletter, setNewsletter] = useState(false)
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [sent, setSent] = useState(false)

  useEffect(() => {
    logAnalytics(null, 'journal_feedback_view')
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    const filled = QUESTIONS.map((q) => ({ category: q.key, message: (answers[q.key] || '').trim() })).filter(
      (a) => a.message,
    )
    if (!filled.length) return setError('Answer at least one of the three.')
    const cleanEmail = email.trim().toLowerCase()
    if (cleanEmail && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cleanEmail))
      return setError("That email address doesn't look right.")
    if (newsletter && !cleanEmail) return setError('Add your email if you want the monthly letter.')

    // The monthly-letter tick is stored as its own row. SendFox's public form is reCAPTCHA-protected, so a page
    // cannot post to it (tested 17 Nov 2026: nothing arrived). A server job has to pick these rows up, as
    // events-calendar's api/newsletter-sync.ts does for event_interest.
    const rows = newsletter && cleanEmail
      ? [...filled, { category: 'newsletter-optin', message: 'Ticked: send me BLKOUT’s monthly letter too' }]
      : filled

    setSubmitting(true)
    const res = await submitJournalFeedback(rows, accessCode, cleanEmail || null)
    setSubmitting(false)
    if (!res.ok) return setError('That didn’t send. Please try again.')

    logAnalytics(null, 'journal_feedback_sent', { answered: filled.length })
    setSent(true)
  }

  if (sent) {
    return (
      <div className="min-h-screen bg-compass-black text-warm-white font-sans">
        <div className="border-t-4 border-gold" />
        <main className="max-w-2xl mx-auto px-6 py-20">
          <p className="text-gold text-[11px] font-semibold tracking-[0.3em] uppercase mb-6">Received</p>
          <h1 className="font-sans font-black uppercase leading-[0.88] tracking-tight text-5xl sm:text-7xl mb-4">
            Thank <span className="text-gold">you.</span>
          </h1>
          <p className="font-serif italic text-xl text-warm-white/85 mb-10 max-w-lg">
            Every answer is read. Yours shapes the app and the next edition.
          </p>
          <div className="h-px w-24 bg-gold mb-8" aria-hidden />
          <p className="text-gold text-[11px] font-semibold tracking-[0.3em] uppercase mb-4">Where next</p>
          <ul className="space-y-3 max-w-lg text-warm-white/90">
            <li>
              <a className="underline decoration-gold underline-offset-4 hover:text-gold" href="https://voices.blkoutuk.com">
                Write for Voices
              </a>
            </li>
            <li>
              <a className="underline decoration-gold underline-offset-4 hover:text-gold" href="https://events.blkoutuk.com">
                Find BLKOUT near you
              </a>
            </li>
            <li>
              <Link className="underline decoration-gold underline-offset-4 hover:text-gold" to="/">
                Back to the compass
              </Link>
            </li>
          </ul>
        </main>
        <div className="border-b-4 border-gold" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-compass-black text-warm-white font-sans">
      <div className="border-t-4 border-gold" />
      <main className="max-w-2xl mx-auto px-6 pt-14 pb-20">
        <p className="text-gold text-[11px] font-semibold tracking-[0.3em] uppercase mb-6">Ivor’s Compass · the journal</p>
        <h1 className="font-sans font-black uppercase leading-[0.88] tracking-tight text-5xl sm:text-7xl mb-4">
          Tell us how
          <br />
          <span className="text-gold">it went.</span>
        </h1>
        <p className="font-serif italic text-xl text-warm-white/85 mb-10 max-w-lg">
          This journal is not finished. The next edition will be shaped by the men who used this one.
        </p>
        <div className="h-px w-24 bg-gold mb-10" aria-hidden />

        <form onSubmit={handleSubmit} className="space-y-8 max-w-lg">
          {QUESTIONS.map((q, i) => (
            <div key={q.key}>
              <label htmlFor={q.key} className="block text-warm-white font-semibold text-base mb-2">
                <span className="text-gold font-black mr-2">{i + 1}.</span>
                {q.label}
              </label>
              <textarea
                id={q.key}
                rows={4}
                value={answers[q.key] || ''}
                onChange={(e) => setAnswers((a) => ({ ...a, [q.key]: e.target.value }))}
                className="w-full bg-compass-dark border-2 border-compass-border px-4 py-3 text-warm-white text-base placeholder-text-muted/50 focus:outline-none focus:border-gold transition-colors"
              />
            </div>
          ))}

          <div>
            <label htmlFor="fb-email" className="block text-gold text-[11px] font-semibold tracking-[0.2em] uppercase mb-2">
              Email (optional, only if you’d like a reply)
            </label>
            <input
              id="fb-email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              autoComplete="email"
              className="w-full bg-compass-dark border-2 border-compass-border px-4 py-4 text-warm-white text-base font-medium placeholder-text-muted/50 focus:outline-none focus:border-gold transition-colors"
            />
          </div>

          <label className="flex items-start gap-3 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={newsletter}
              onChange={(e) => setNewsletter(e.target.checked)}
              className="mt-1 h-5 w-5 accent-[#d4af37]"
            />
            <span className="text-warm-white/90 text-sm">Send me BLKOUT’s monthly letter too.</span>
          </label>

          {error && (
            <p className="text-blkout-red text-sm font-semibold tracking-wide" role="alert">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={submitting}
            className="w-full bg-blkout-red hover:bg-red-700 text-white font-black uppercase tracking-wider text-sm py-5 transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-[6px_6px_0_0_#d4af37]"
          >
            {submitting ? 'Sending…' : 'Send my answers →'}
          </button>
        </form>

        <p className="text-text-muted/70 text-[11px] tracking-wide leading-relaxed mt-10 max-w-lg">
          No name needed. Answer one question or all three. If you leave an email we use it only to reply, unless you tick
          the box.
        </p>
      </main>
      <div className="border-b-4 border-gold" />
    </div>
  )
}
