import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import EventRecorder from '../components/EventRecorder'
import { logAnalytics } from '../lib/supabase'

const NUGENT_DOUGLAS_IMAGE = '/images/installation-hero.png'
const VOICES_ARTICLE_URL = 'https://voices.blkoutuk.cloud/articles/the-secret-history-of-harlems-underground'
const VOICES_ARTICLE_TITLE = 'The secret history of Harlem’s underground'

export default function InstallationPage() {
  useEffect(() => {
    logAnalytics(null, 'installation_view')
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
          The installation · Scene Dock
        </p>

        <h1 className="font-sans font-black uppercase leading-[0.88] tracking-tight text-5xl sm:text-7xl mb-4">
          What you
          <br />
          <span className="text-gold">just saw.</span>
        </h1>

        <p className="font-serif italic text-xl text-warm-white/85 mb-12 max-w-lg">
          thirty seconds. one minute. longer if you need it.
        </p>

        <div className="h-px w-24 bg-gold mb-12" aria-hidden />

        {/* Nugent Douglas image frame */}
        <figure className="border-4 border-gold bg-compass-dark mb-8">
          <img
            src={NUGENT_DOUGLAS_IMAGE}
            alt="Nugent & Douglas — from the Ivor's Compass installation"
            className="w-full h-auto block"
            loading="eager"
            onError={(e) => {
              // Graceful fallback if image not yet uploaded
              ;(e.currentTarget as HTMLImageElement).style.display = 'none'
            }}
          />
          <figcaption className="px-5 py-4 border-t-2 border-gold/60">
            <p className="text-gold text-[11px] font-semibold tracking-[0.25em] uppercase mb-2">
              Richard Bruce Nugent · Aaron Douglas
            </p>
            <p className="text-warm-white/85 text-sm leading-relaxed">
              Two Harlem Renaissance artists. A queer writer and a painter of
              Black spiritual life, working side by side. The installation
              begins where they do.
            </p>
          </figcaption>
        </figure>

        {/* Voices article link */}
        <a
          href={VOICES_ARTICLE_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="block border-2 border-gold/60 hover:border-gold hover:bg-blkout-purple/20 p-5 mb-12 transition-colors group"
        >
          <p className="text-gold text-[11px] font-semibold tracking-[0.25em] uppercase mb-2">
            Read the full piece on voices →
          </p>
          <p className="font-serif text-lg text-warm-white group-hover:text-gold transition-colors">
            {VOICES_ARTICLE_TITLE}
          </p>
        </a>

        {/* Prompt + recorder */}
        <div className="border-l-4 border-gold pl-5 mb-8">
          <p className="text-gold text-[11px] font-semibold tracking-[0.25em] uppercase mb-3">
            Your voice
          </p>
          <p className="text-warm-white/95 text-base leading-relaxed mb-2">
            What did you see? What stayed with you?
          </p>
          <p className="text-text-muted text-sm italic leading-relaxed">
            Speak it now. It becomes part of the soundscape.
          </p>
        </div>

        <EventRecorder
          category="installation"
          confirmMessage="your voice is part of the soundscape now."
        />

        <p className="text-text-muted/60 text-[11px] tracking-wide leading-relaxed mt-10 text-center">
          Recordings may be woven into the Ivor's Compass soundscape and
          project materials. Nothing is published with your name unless you
          tell us otherwise.
        </p>
      </main>

      <div className="border-b-4 border-gold" />
    </div>
  )
}
