import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import EventRecorder from '../components/EventRecorder'
import { logAnalytics } from '../lib/supabase'

const PROMPTS = [
  'What surprised you?',
  'What did today give you that nothing else has?',
  'What would you tell someone thinking of coming next time?',
] as const

export default function InterviewFeedbackPage() {
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
          one minute of your honest voice is worth more than any form.
        </p>

        <div className="h-px w-24 bg-gold mb-12" aria-hidden />

        {/* Prompts — suggestions, not requirements */}
        <div className="border-l-4 border-gold pl-5 mb-10">
          <p className="text-gold text-[11px] font-semibold tracking-[0.25em] uppercase mb-4">
            If you're stuck, try one of these
          </p>
          <ul className="space-y-3">
            {PROMPTS.map((prompt) => (
              <li key={prompt} className="flex gap-3">
                <span className="text-gold pt-0.5 select-none" aria-hidden>
                  —
                </span>
                <span className="text-warm-white/90 font-serif italic text-lg leading-snug">
                  {prompt}
                </span>
              </li>
            ))}
          </ul>
        </div>

        {/* Why framing */}
        <div className="bg-blkout-purple border-l-4 border-gold pl-5 pr-4 py-4 mb-10">
          <p className="text-gold text-[11px] font-semibold tracking-[0.25em] uppercase mb-2">
            Why we're asking
          </p>
          <p className="text-warm-white/95 text-sm leading-relaxed">
            Croydon Council and the National Lottery Heritage Fund paid for
            this. Your voice is how we report back — and how we make the case
            for doing it again. Record anonymously unless you want us to
            write back.
          </p>
        </div>

        <EventRecorder
          category="feedback"
          collectIdentity
          confirmMessage="thank you. this is exactly what we needed."
        />

        <p className="text-text-muted/60 text-[11px] tracking-wide leading-relaxed mt-10 text-center">
          Recordings are used to report back to our funders and shape the
          next edition. We only contact you if you leave an email.
        </p>
      </main>

      <div className="border-b-4 border-gold" />
    </div>
  )
}
