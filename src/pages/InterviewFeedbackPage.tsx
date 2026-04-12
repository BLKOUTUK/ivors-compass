import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import EventRecorder from '../components/EventRecorder'
import { supabase, logAnalytics } from '../lib/supabase'

const PROMPTS = [
  'What surprised you about Ivor\'s story?',
  'How does his story connect to yours?',
  'What would you tell someone thinking of coming next time?',
] as const

function TextFeedback() {
  const [surprised, setSurprised] = useState('')
  const [connects, setConnects] = useState('')
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [submitted, setSubmitted] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const submit = async () => {
    if (!surprised.trim() && !connects.trim()) return
    setSubmitting(true)
    setError(null)
    try {
      const { error: insertError } = await supabase.from('compass_feedback_recordings').insert({
        audio_url: null,
        first_name: name.trim() || null,
        email: email.trim().toLowerCase() || null,
        metadata: {
          type: 'text',
          what_surprised_you: surprised.trim(),
          how_it_connects: connects.trim(),
        },
      })
      if (insertError) throw insertError
      setSubmitted(true)
    } catch {
      setError('Could not save. Try again.')
    } finally {
      setSubmitting(false)
    }
  }

  if (submitted) {
    return (
      <div className="border-4 border-gold bg-compass-dark p-8 text-center">
        <p className="text-gold text-[11px] font-semibold tracking-[0.3em] uppercase mb-4">Saved</p>
        <p className="font-serif italic text-xl text-warm-white/90 mb-6">thank you. this is exactly what we needed.</p>
        <button
          onClick={() => { setSubmitted(false); setSurprised(''); setConnects(''); setName(''); setEmail('') }}
          className="text-text-muted hover:text-gold text-xs font-semibold tracking-[0.2em] uppercase transition-colors underline underline-offset-4"
        >
          Submit another
        </button>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <label htmlFor="fb-surprised" className="block text-gold text-[11px] font-semibold tracking-[0.2em] uppercase mb-2">
          What surprised you about Ivor's story?
        </label>
        <textarea
          id="fb-surprised"
          value={surprised}
          onChange={(e) => setSurprised(e.target.value)}
          rows={3}
          placeholder="Anything at all..."
          className="w-full bg-compass-dark border-2 border-compass-border px-4 py-3 text-warm-white text-base placeholder-text-muted/50 focus:outline-none focus:border-gold transition-colors resize-y"
        />
      </div>
      <div>
        <label htmlFor="fb-connects" className="block text-gold text-[11px] font-semibold tracking-[0.2em] uppercase mb-2">
          How does his story connect to yours?
        </label>
        <textarea
          id="fb-connects"
          value={connects}
          onChange={(e) => setConnects(e.target.value)}
          rows={3}
          placeholder="Take your time..."
          className="w-full bg-compass-dark border-2 border-compass-border px-4 py-3 text-warm-white text-base placeholder-text-muted/50 focus:outline-none focus:border-gold transition-colors resize-y"
        />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label htmlFor="fb-name" className="block text-gold text-[11px] font-semibold tracking-[0.2em] uppercase mb-2">First name (optional)</label>
          <input id="fb-name" type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="Your name" autoComplete="given-name"
            className="w-full bg-compass-dark border-2 border-compass-border px-4 py-3 text-warm-white text-base placeholder-text-muted/50 focus:outline-none focus:border-gold transition-colors" />
        </div>
        <div>
          <label htmlFor="fb-email" className="block text-gold text-[11px] font-semibold tracking-[0.2em] uppercase mb-2">Email (optional)</label>
          <input id="fb-email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" autoComplete="email"
            className="w-full bg-compass-dark border-2 border-compass-border px-4 py-3 text-warm-white text-base placeholder-text-muted/50 focus:outline-none focus:border-gold transition-colors" />
        </div>
      </div>
      <button
        onClick={submit}
        disabled={submitting || (!surprised.trim() && !connects.trim())}
        className="w-full bg-blkout-red hover:bg-red-700 disabled:opacity-50 text-white font-black uppercase tracking-wider text-xs py-4 transition-colors"
      >
        {submitting ? 'Saving...' : 'Submit'}
      </button>
      {error && <p className="text-blkout-red text-sm font-semibold text-center" role="alert">{error}</p>}
    </div>
  )
}

export default function InterviewFeedbackPage() {
  const [mode, setMode] = useState<'choose' | 'write' | 'record'>('choose')

  useEffect(() => {
    logAnalytics(null, 'feedback_view')
  }, [])

  return (
    <div className="min-h-screen bg-compass-black text-warm-white font-sans">
      <div className="border-t-4 border-gold" />

      <main className="max-w-2xl mx-auto px-6 pt-10 pb-16">
        <nav className="mb-10">
          <Link
            to="/"
            className="text-text-muted hover:text-gold text-xs font-semibold tracking-[0.2em] uppercase transition-colors"
          >
            ← Compass
          </Link>
        </nav>

        <p className="text-gold text-[11px] font-semibold tracking-[0.3em] uppercase mb-6">
          Evaluation · Your voice
        </p>

        <h1 className="font-sans font-black uppercase leading-[0.88] tracking-tight text-5xl sm:text-7xl mb-4">
          Tell us
          <br />
          <span className="text-gold">how it landed.</span>
        </h1>

        <p className="font-serif italic text-xl text-warm-white/85 mb-12 max-w-lg">
          one minute is all we need.
        </p>

        <div className="h-px w-24 bg-gold mb-12" aria-hidden />

        {/* Why framing */}
        <div className="bg-blkout-purple border-l-4 border-gold pl-5 pr-4 py-4 mb-10">
          <p className="text-gold text-[11px] font-semibold tracking-[0.25em] uppercase mb-2">
            Why we're asking
          </p>
          <p className="text-warm-white/95 text-sm leading-relaxed">
            Croydon Council and the National Lottery Heritage Fund paid for
            this. Your feedback is how we report back — and how we make the case
            for doing it again.
          </p>
        </div>

        {mode === 'choose' && (
          <div className="grid grid-cols-2 gap-4 mb-10">
            <button
              onClick={() => setMode('write')}
              className="border-2 border-gold/60 hover:border-gold p-6 flex flex-col items-center gap-3 transition-colors"
            >
              <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="#d4af37" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 20h9" /><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" />
              </svg>
              <span className="text-gold font-black text-[11px] tracking-[0.2em] uppercase">Write</span>
            </button>
            <button
              onClick={() => setMode('record')}
              className="border-2 border-gold/60 hover:border-gold p-6 flex flex-col items-center gap-3 transition-colors"
            >
              <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="#d4af37" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z" /><path d="M19 10v2a7 7 0 0 1-14 0v-2" /><line x1="12" y1="19" x2="12" y2="23" /><line x1="8" y1="23" x2="16" y2="23" />
              </svg>
              <span className="text-gold font-black text-[11px] tracking-[0.2em] uppercase">Record</span>
            </button>
          </div>
        )}

        {mode === 'write' && (
          <>
            <button onClick={() => setMode('choose')} className="text-text-muted hover:text-gold text-xs font-semibold tracking-[0.2em] uppercase mb-6 transition-colors">← Back</button>
            <TextFeedback />
          </>
        )}

        {mode === 'record' && (
          <>
            <button onClick={() => setMode('choose')} className="text-text-muted hover:text-gold text-xs font-semibold tracking-[0.2em] uppercase mb-6 transition-colors">← Back</button>
            <div className="border-l-4 border-gold pl-5 mb-10">
              <p className="text-gold text-[11px] font-semibold tracking-[0.25em] uppercase mb-4">
                If you're stuck, try one of these
              </p>
              <ul className="space-y-3">
                {PROMPTS.map((prompt) => (
                  <li key={prompt} className="flex gap-3">
                    <span className="text-gold pt-0.5 select-none" aria-hidden>—</span>
                    <span className="text-warm-white/90 font-serif italic text-lg leading-snug">{prompt}</span>
                  </li>
                ))}
              </ul>
            </div>
            <EventRecorder category="feedback" collectIdentity confirmMessage="thank you. this is exactly what we needed." />
          </>
        )}

        <p className="text-text-muted/60 text-[11px] tracking-wide leading-relaxed mt-10 text-center">
          Feedback is used to report back to our funders and shape the
          next edition. We only contact you if you leave an email.
        </p>
      </main>

      <div className="border-b-4 border-gold" />
    </div>
  )
}
