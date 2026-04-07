import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { meditations } from '../data/meditations'
import { supabase } from '../lib/supabase'
import { WarmthOrb, BentoCard } from '../components/ui'
import InstallPrompt from '../components/InstallPrompt'

// ---------------------------------------------------------------------------
// ConvergenceSnapshot — lightweight loader for the homepage card
// ---------------------------------------------------------------------------

interface TodaySnapshot {
  affirmation: string
  phase: string | null
  whisperCount: number
}

function useConvergenceSnapshot() {
  const [snapshot, setSnapshot] = useState<TodaySnapshot | null>(null)

  useEffect(() => {
    let cancelled = false

    async function load() {
      try {
        const { data: daily } = await supabase.rpc('get_todays_convergence')
        if (cancelled || !daily) return

        const d = daily as { id: string; affirmation: string; phase: string | null }

        const { count } = await supabase
          .from('compass_whispers')
          .select('id', { count: 'exact', head: true })
          .eq('daily_id', d.id)

        if (cancelled) return

        setSnapshot({
          affirmation: d.affirmation,
          phase: d.phase,
          whisperCount: count ?? 0,
        })
      } catch {
        // Non-critical -- card still renders without live data
      }
    }

    void load()
    return () => { cancelled = true }
  }, [])

  return snapshot
}

// ---------------------------------------------------------------------------
// Time-of-day greeting
// ---------------------------------------------------------------------------

function getGreeting(): string {
  const hour = new Date().getHours()
  if (hour < 12) return 'Good morning'
  if (hour < 17) return 'Good afternoon'
  return 'Good evening'
}

// ---------------------------------------------------------------------------
// HomePage
// ---------------------------------------------------------------------------

export default function HomePage() {
  const snapshot = useConvergenceSnapshot()

  return (
    <div className="space-y-4 stagger">
      {/* Hero */}
      <div className="text-center py-6">
        <p className="text-text-muted text-sm mb-1">{getGreeting()}</p>
        <h1 className="font-heritage text-3xl text-gold-gradient mb-2">Ivor's Compass</h1>
        <p className="text-gold-rich text-sm italic">Your compass. Your pace. Your story.</p>
      </div>

      {/* Daily Convergence Card — prominent, shimmer glow */}
      <Link
        to="/compass/convergence"
        aria-label="Daily Convergence — today's shared affirmation and anonymous reflections"
        className="block bg-gradient-to-br from-compass-dark to-compass-card border border-gold/30 hover:border-gold/50 rounded-xl p-5 transition-all active:scale-[0.98] animate-shimmer"
      >
        <div className="flex items-start gap-4">
          {/* Ripple icon */}
          <div className="mt-0.5 flex-shrink-0">
            <svg className="w-7 h-7 text-gold" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
              <circle cx="12" cy="12" r="3" />
              <circle cx="12" cy="12" r="7" opacity="0.5" />
              <circle cx="12" cy="12" r="11" opacity="0.25" />
            </svg>
          </div>
          <div className="flex-1 min-w-0">
            <h2 className="font-heritage text-lg text-gold">Daily Convergence</h2>
            {snapshot ? (
              <>
                <p className="text-white/80 text-sm mt-1 line-clamp-2 font-heritage italic leading-relaxed">
                  &ldquo;{snapshot.affirmation.slice(0, 80)}{snapshot.affirmation.length > 80 ? '...' : ''}&rdquo;
                </p>
                <p className="text-text-muted/60 text-xs mt-2">
                  {snapshot.whisperCount === 0
                    ? 'Be the first to reflect today'
                    : `${snapshot.whisperCount} ${snapshot.whisperCount === 1 ? 'whisper' : 'whispers'} today`}
                </p>
              </>
            ) : (
              <>
                <p className="text-text-muted text-sm mt-0.5">A shared daily ritual</p>
                <p className="text-text-muted/60 text-xs mt-1">Today&apos;s affirmation + anonymous reflections</p>
              </>
            )}
          </div>
          <svg className="w-5 h-5 text-gold/40 mt-1 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
          </svg>
        </div>
      </Link>

      {/* Bento Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">

        {/* Meet Ivor — audio intro, wide */}
        <BentoCard to="/compass/film" className="sm:col-span-2" label="Meet Ivor — 2 minute audio introduction">
          <div className="flex items-start gap-4">
            <div className="mt-0.5 flex-shrink-0">
              <svg className="w-7 h-7 text-gold" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" d="M19.114 5.636a9 9 0 010 12.728M16.463 8.288a5.25 5.25 0 010 7.424M6.75 8.25l4.72-4.72a.75.75 0 011.28.53v15.88a.75.75 0 01-1.28.53l-4.72-4.72H4.51c-.88 0-1.704-.507-1.938-1.354A9.01 9.01 0 012.25 12c0-.83.112-1.633.322-2.396C2.806 8.756 3.63 8.25 4.51 8.25H6.75z" />
              </svg>
            </div>
            <div className="flex-1 min-w-0">
              <h2 className="font-heritage text-lg text-white">Meet Ivor</h2>
              <p className="text-text-muted text-sm mt-0.5">Listen to his story</p>
              <p className="text-text-muted/60 text-xs mt-1">2 min audio introduction</p>
            </div>
            <svg className="w-5 h-5 text-text-muted/60 mt-1 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
            </svg>
          </div>
        </BentoCard>

        {/* Heritage Meditations — tall */}
        <BentoCard to="/compass/meditation/1" className="sm:row-span-2 border-terracotta/20 hover:border-terracotta/40" label="Heritage Meditations — six reflections on Ivor's life">
          <div className="flex flex-col h-full gap-3">
            <WarmthOrb intensity={0.6} color="#802918" size={22} />
            <div className="flex-1">
              <h2 className="font-heritage text-lg text-white">Heritage Meditations</h2>
              <p className="text-text-muted text-sm mt-0.5">Six reflections on a life</p>
              <p className="text-text-muted/60 text-xs mt-1">6 writers · 6 chapters</p>
            </div>
            <div className="space-y-1.5 mt-2">
              {meditations.slice(0, 3).map((m) => (
                <Link
                  key={m.id}
                  to={`/compass/meditation/${m.id}`}
                  className="flex items-center gap-2 py-1 text-xs text-text-muted/60 hover:text-gold transition-colors"
                  onClick={(e) => e.stopPropagation()}
                >
                  <span className="w-5 h-5 rounded-full bg-terracotta/15 text-terracotta text-[10px] flex items-center justify-center font-medium">
                    {m.id}
                  </span>
                  <span className="truncate">{m.title}</span>
                </Link>
              ))}
              <p className="text-text-muted/60 text-[10px] pl-7">+ 3 more chapters</p>
            </div>
          </div>
        </BentoCard>

        {/* Affirmation Cards */}
        <BentoCard to="/compass/cards" label="Affirmation Cards — draw your daily card">
          <div className="flex items-start gap-4">
            <WarmthOrb intensity={0.5} color="#D4AF37" size={20} />
            <div className="flex-1 min-w-0">
              <h2 className="font-heritage text-lg text-white">Affirmation Cards</h2>
              <p className="text-text-muted text-sm mt-0.5">Draw your daily card</p>
              <p className="text-text-muted/60 text-xs mt-1">Deck of 30+</p>
            </div>
          </div>
        </BentoCard>

        {/* Mood Check-in */}
        <BentoCard to="/compass/mood" label="Mood Check-in — track patterns and get journal phase suggestions">
          <div className="flex items-start gap-4">
            <WarmthOrb intensity={0.45} color="#FFD700" size={20} />
            <div className="flex-1 min-w-0">
              <h2 className="font-heritage text-lg text-white">Mood Check-in</h2>
              <p className="text-text-muted text-sm mt-0.5">How are you arriving today?</p>
              <p className="text-text-muted/60 text-xs mt-1">Track patterns · Suggest journal phases</p>
            </div>
          </div>
        </BentoCard>

        {/* Workshops */}
        <BentoCard to="/compass/workshops" className="border-terracotta/20 hover:border-terracotta/40" label="Workshops — self-guided wellness mini-journeys">
          <div className="flex items-start gap-4">
            <WarmthOrb intensity={0.55} color="#802918" size={20} />
            <div className="flex-1 min-w-0">
              <h2 className="font-heritage text-lg text-white">Workshops</h2>
              <p className="text-text-muted text-sm mt-0.5">Self-guided mini-journeys</p>
              <p className="text-text-muted/60 text-xs mt-1">6 workshops · Anxiety, Anger, Shame & more</p>
            </div>
          </div>
        </BentoCard>

        {/* The Sunroom */}
        <BentoCard to="/compass/sunroom" className="sm:col-span-2 border-[#D4AF37]/30 hover:border-[#D4AF37]/50" label="The Sunroom — joy, community, and AIvor chat">
          <div className="flex items-start gap-4">
            <div className="mt-0.5 flex-shrink-0">
              <svg className="w-7 h-7 text-gold" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v2.25m6.364.386l-1.591 1.591M21 12h-2.25m-.386 6.364l-1.591-1.591M12 18.75V21m-4.773-4.227l-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z" />
              </svg>
            </div>
            <div className="flex-1 min-w-0">
              <h2 className="font-heritage text-lg text-gold">The Sunroom</h2>
              <p className="text-text-muted text-sm mt-0.5">Joy, community, and AIvor</p>
              <p className="text-text-muted/60 text-xs mt-1">Laughter notes · Community highlights · AIvor chat</p>
            </div>
            <svg className="w-5 h-5 text-gold/40 mt-1 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
            </svg>
          </div>
        </BentoCard>

        {/* Journal */}
        <BentoCard to="/compass/journal" className="sm:col-span-2" label="Your Journal — private, stored only on your device">
          <div className="flex items-start gap-4">
            <WarmthOrb intensity={0.6} color="#D4AF37" size={24} />
            <div className="flex-1 min-w-0">
              <h2 className="font-heritage text-lg text-white">Your Journal</h2>
              <p className="text-text-muted text-sm mt-0.5">Private. On your device.</p>
              <p className="text-text-muted/60 text-xs mt-1">Never leaves your phone</p>
            </div>
            <svg className="w-5 h-5 text-text-muted/60 mt-1 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
            </svg>
          </div>
        </BentoCard>

        {/* Sacred Momentum */}
        <BentoCard to="/compass/progress" className="sm:col-span-1 border-[#D4AF37]/20 hover:border-[#D4AF37]/40" label="Sacred Momentum — your journey milestones">
          <div className="flex items-start gap-4">
            <div className="mt-0.5 flex-shrink-0">
              <svg className="w-6 h-6 text-gold-rich" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 3v11.25A2.25 2.25 0 006 16.5h2.25M3.75 3h-1.5m1.5 0h16.5m0 0h1.5m-1.5 0v11.25A2.25 2.25 0 0118 16.5h-2.25m-7.5 0h7.5m-7.5 0l-1 3m8.5-3l1 3m0 0l.5 1.5m-.5-1.5h-9.5m0 0l-.5 1.5" />
              </svg>
            </div>
            <div className="flex-1 min-w-0">
              <h2 className="font-heritage text-lg text-white">Sacred Momentum</h2>
              <p className="text-text-muted text-sm mt-0.5">Your journey so far</p>
              <p className="text-text-muted/60 text-xs mt-1">5-month cycle · Milestones · Phase wisdom</p>
            </div>
          </div>
        </BentoCard>

        {/* Crisis Support */}
        <div className="sm:col-span-2">
          <Link
            to="/compass/crisis"
            aria-label="Need support? Crisis helplines, grounding exercises, and care"
            className="block bg-compass-dark border border-red-700/30 hover:border-red-600/50 rounded-xl p-4 transition-all active:scale-[0.98]"
            style={{ boxShadow: '0 2px 12px rgba(0,0,0,0.3)' }}
          >
            <div className="flex items-center gap-3">
              <svg className="w-5 h-5 text-red-400/70 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
              </svg>
              <div className="flex-1 min-w-0">
                <p className="text-white/80 text-sm font-medium">Need Support?</p>
                <p className="text-text-muted/60 text-xs">Crisis helplines, grounding exercises, and care</p>
              </div>
              <span className="text-red-400/60 text-xs flex-shrink-0">Get help now</span>
            </div>
          </Link>
        </div>

        {/* About */}
        <BentoCard to="/compass/about" className="sm:col-span-1 border-compass-border hover:border-gold/30" label="About Ivor Cummings — the gay father of Windrush">
          <div className="flex items-center gap-3">
            <WarmthOrb intensity={0.3} color="#D4AF37" size={16} />
            <div>
              <p className="text-white text-sm font-medium">About Ivor Cummings</p>
              <p className="text-text-muted/60 text-xs">The gay father of Windrush · 1913–1992</p>
            </div>
          </div>
        </BentoCard>
      </div>

      {/* Six Chapters meditation list */}
      <div className="bg-compass-dark border border-terracotta/20 rounded-xl p-5 archival-texture overflow-hidden">
        <h3 className="font-heritage text-sm text-terracotta mb-3 relative z-10">Six Chapters of a Life</h3>
        <div className="space-y-2 relative z-10">
          {meditations.map((m) => (
            <Link
              key={m.id}
              to={`/compass/meditation/${m.id}`}
              className="flex items-center justify-between py-2 px-3 rounded-lg hover:bg-compass-black/50 transition-colors"
            >
              <div className="flex items-center gap-3">
                <span className="w-6 h-6 rounded-full bg-terracotta/20 text-terracotta text-xs flex items-center justify-center font-medium">
                  {m.id}
                </span>
                <span className="text-sm text-white">{m.title}</span>
              </div>
              <span className="text-xs text-text-muted/60">{m.phase ? m.phase : m.era}</span>
            </Link>
          ))}
        </div>
      </div>

      {/* Install prompt */}
      <InstallPrompt />
    </div>
  )
}
