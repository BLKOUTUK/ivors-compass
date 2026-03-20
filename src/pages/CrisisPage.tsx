import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'

// ---------------------------------------------------------------------------
// Breathing animation phases (4-7-8 technique)
// ---------------------------------------------------------------------------

type BreathPhase = 'inhale' | 'hold' | 'exhale'

const BREATH_PHASES: { phase: BreathPhase; duration: number; label: string }[] = [
  { phase: 'inhale', duration: 4000, label: 'Breathe in' },
  { phase: 'hold', duration: 7000, label: 'Hold' },
  { phase: 'exhale', duration: 8000, label: 'Breathe out' },
]

const TOTAL_CYCLE = BREATH_PHASES.reduce((sum, p) => sum + p.duration, 0) // 19000ms

function useBreathingCycle() {
  const [elapsed, setElapsed] = useState(0)

  useEffect(() => {
    let raf: number
    let start: number | null = null

    const tick = (timestamp: number) => {
      if (start === null) start = timestamp
      setElapsed((timestamp - start) % TOTAL_CYCLE)
      raf = requestAnimationFrame(tick)
    }

    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [])

  let accumulated = 0
  for (const bp of BREATH_PHASES) {
    if (elapsed < accumulated + bp.duration) {
      const progress = (elapsed - accumulated) / bp.duration
      return { phase: bp.phase, label: bp.label, progress }
    }
    accumulated += bp.duration
  }

  return { phase: 'inhale' as BreathPhase, label: 'Breathe in', progress: 0 }
}

// ---------------------------------------------------------------------------
// Crisis helpline data
// ---------------------------------------------------------------------------

interface Helpline {
  name: string
  description: string
  hours: string
  href: string
  actionLabel: string
  type: 'call' | 'text' | 'web'
}

const helplines: Helpline[] = [
  {
    name: 'Samaritans',
    description: 'Emotional support for anyone in distress',
    hours: '24/7, free from any phone',
    href: 'tel:116123',
    actionLabel: 'Call 116 123',
    type: 'call',
  },
  {
    name: 'Shout Crisis Text Line',
    description: 'Free, confidential, 24/7 text support',
    hours: '24/7, free',
    href: 'sms:85258?body=SHOUT',
    actionLabel: 'Text SHOUT to 85258',
    type: 'text',
  },
  {
    name: 'Switchboard LGBT+ Helpline',
    description: 'LGBT+ support, information and referrals',
    hours: '10am\u201310pm daily',
    href: 'tel:03003300630',
    actionLabel: 'Call 0300 330 0630',
    type: 'call',
  },
  {
    name: 'Galop',
    description: 'LGBT+ anti-violence and abuse charity',
    hours: 'Mon\u2013Fri 10am\u20134pm',
    href: 'tel:08009995428',
    actionLabel: 'Call 0800 999 5428',
    type: 'call',
  },
  {
    name: 'MindOut LGBTQ+ Mental Health',
    description: 'Mental health support by and for LGBTQ+ people',
    hours: 'Mon\u2013Fri 4pm\u20139pm',
    href: 'tel:01273234839',
    actionLabel: 'Call 01273 234839',
    type: 'call',
  },
  {
    name: 'Black Minds Matter UK',
    description: 'Free therapy for Black individuals and families',
    hours: 'Online referrals',
    href: 'https://www.blackmindsmatteruk.com',
    actionLabel: 'Visit blackmindsmatteruk.com',
    type: 'web',
  },
]

// ---------------------------------------------------------------------------
// Component: BreathingCircle
// ---------------------------------------------------------------------------

function BreathingCircle() {
  const { phase, label, progress } = useBreathingCycle()

  // Scale: inhale 1 → 1.5, hold stays 1.5, exhale 1.5 → 1
  let scale: number
  if (phase === 'inhale') {
    scale = 1 + progress * 0.5
  } else if (phase === 'hold') {
    scale = 1.5
  } else {
    scale = 1.5 - progress * 0.5
  }

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="relative w-32 h-32 flex items-center justify-center">
        {/* Outer glow ring */}
        <div
          className="absolute inset-0 rounded-full transition-none"
          style={{
            transform: `scale(${scale})`,
            background: 'radial-gradient(circle, rgba(255,215,0,0.15) 0%, transparent 70%)',
          }}
        />
        {/* Main breathing circle */}
        <div
          className="w-24 h-24 rounded-full border-2 border-gold/40 transition-none flex items-center justify-center"
          style={{
            transform: `scale(${scale})`,
            backgroundColor:
              phase === 'inhale'
                ? `rgba(255,215,0,${0.05 + progress * 0.1})`
                : phase === 'hold'
                  ? 'rgba(255,215,0,0.15)'
                  : `rgba(255,215,0,${0.15 - progress * 0.1})`,
          }}
        >
          <span className="text-gold/80 text-xs font-medium select-none">{label}</span>
        </div>
      </div>
      <p className="text-text-muted/50 text-[11px]">
        4 seconds in &middot; 7 seconds hold &middot; 8 seconds out
      </p>
    </div>
  )
}

// ---------------------------------------------------------------------------
// Component: HelplineButton
// ---------------------------------------------------------------------------

function HelplineButton({ helpline }: { helpline: Helpline }) {
  const isCall = helpline.type === 'call'
  const isText = helpline.type === 'text'
  const isWeb = helpline.type === 'web'

  const baseClasses =
    'block w-full rounded-xl p-5 text-left transition-all active:scale-[0.98] no-underline'

  const typeClasses = isCall
    ? 'bg-red-700/90 border-2 border-red-500/60 hover:bg-red-600/90'
    : isText
      ? 'bg-amber-700/80 border-2 border-amber-500/50 hover:bg-amber-600/80'
      : 'bg-compass-dark border-2 border-gold/30 hover:border-gold/50'

  // Phone / text / web icon
  const icon = isCall ? (
    <svg className="w-7 h-7 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z"
      />
    </svg>
  ) : isText ? (
    <svg className="w-7 h-7 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M8.625 12a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H8.25m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H12m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0h-.375M21 12c0 4.556-4.03 8.25-9 8.25a9.764 9.764 0 01-2.555-.337A5.972 5.972 0 015.41 20.97a5.969 5.969 0 01-.474-.065 4.48 4.48 0 00.978-2.025c.09-.457-.133-.901-.467-1.226C3.93 16.178 3 14.189 3 12c0-4.556 4.03-8.25 9-8.25s9 3.694 9 8.25z"
      />
    </svg>
  ) : (
    <svg className="w-7 h-7 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25"
      />
    </svg>
  )

  const textColor = isWeb ? 'text-gold' : 'text-white'

  return (
    <a href={helpline.href} className={`${baseClasses} ${typeClasses}`} {...(isWeb ? { target: '_blank', rel: 'noopener noreferrer' } : {})}>
      <div className="flex items-start gap-4">
        <div className={`mt-0.5 ${textColor}`}>{icon}</div>
        <div className="flex-1 min-w-0">
          <h3 className={`text-lg font-semibold ${textColor}`}>{helpline.name}</h3>
          <p className={`text-sm mt-0.5 ${isWeb ? 'text-text-muted' : 'text-white/80'}`}>
            {helpline.description}
          </p>
          <div className="flex items-center gap-2 mt-2">
            <span className={`text-base font-bold ${textColor}`}>{helpline.actionLabel}</span>
            <span className={`text-xs ${isWeb ? 'text-text-muted/60' : 'text-white/50'}`}>
              &middot; {helpline.hours}
            </span>
          </div>
        </div>
      </div>
    </a>
  )
}

// ---------------------------------------------------------------------------
// CrisisPage
// ---------------------------------------------------------------------------

export default function CrisisPage() {
  const [showBreathing, setShowBreathing] = useState(true)

  return (
    <div className="space-y-6 animate-fade-in">
      {/* ── Grounding section ──────────────────────────────────── */}
      <section className="text-center py-6 space-y-5">
        <h1 className="font-heritage text-3xl text-white">Get Help Now</h1>

        <div className="bg-compass-dark border border-gold/20 rounded-xl p-6 space-y-4">
          <p className="text-white text-lg leading-relaxed font-medium">
            You are safe. You are here.
          </p>
          <p className="text-text-muted text-base leading-relaxed">
            Press your feet into the floor. Feel the ground beneath you. You do not have to
            solve anything right now.
          </p>

          {showBreathing ? (
            <>
              <BreathingCircle />
              <button
                onClick={() => setShowBreathing(false)}
                className="text-text-muted/40 text-xs underline underline-offset-2 hover:text-text-muted/60 transition-colors"
              >
                Hide breathing exercise
              </button>
            </>
          ) : (
            <button
              onClick={() => setShowBreathing(true)}
              className="text-gold/60 text-xs underline underline-offset-2 hover:text-gold/80 transition-colors"
            >
              Show breathing exercise
            </button>
          )}
        </div>
      </section>

      {/* ── Crisis helplines ──────────────────────────────────── */}
      <section className="space-y-3">
        <h2 className="font-heritage text-lg text-white px-1">Speak to someone now</h2>
        <div className="space-y-3">
          {helplines.map((h) => (
            <HelplineButton key={h.name} helpline={h} />
          ))}
        </div>
      </section>

      {/* ── Talk to AIvor ─────────────────────────────────────── */}
      <section className="bg-compass-dark border border-gold/20 rounded-xl p-5">
        <div className="flex items-start gap-4">
          <svg
            className="w-6 h-6 text-gold/60 flex-shrink-0 mt-0.5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth="1.5"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M8.625 12a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H8.25m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H12m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0h-.375M21 12c0 4.556-4.03 8.25-9 8.25a9.764 9.764 0 01-2.555-.337A5.972 5.972 0 015.41 20.97a5.969 5.969 0 01-.474-.065 4.48 4.48 0 00.978-2.025c.09-.457-.133-.901-.467-1.226C3.93 16.178 3 14.189 3 12c0-4.556 4.03-8.25 9-8.25s9 3.694 9 8.25z"
            />
          </svg>
          <div className="flex-1">
            <h3 className="text-white text-base font-medium">Talk to AIvor</h3>
            <p className="text-text-muted text-sm mt-1 leading-relaxed">
              AIvor is not a crisis service, but he can help you find resources and community
              support.
            </p>
            <a
              href="https://blkoutuk.com?chat=open"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 mt-3 px-4 py-2 bg-gold-rich/10 border border-gold-rich/30 text-gold-rich text-sm rounded-lg hover:bg-gold-rich/20 transition-colors"
            >
              Chat with AIvor
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
              </svg>
            </a>
          </div>
        </div>
      </section>

      {/* ── Self-care options ─────────────────────────────────── */}
      <section className="space-y-3">
        <h2 className="font-heritage text-lg text-white px-1">Something gentle</h2>

        <div className="grid grid-cols-1 gap-3">
          <Link
            to="/compass/journal?prompt=58"
            className="flex items-center gap-4 bg-compass-dark border border-terracotta/20 rounded-xl p-4 hover:border-terracotta/40 transition-colors active:scale-[0.98]"
          >
            <span className="text-2xl">📓</span>
            <div>
              <p className="text-white text-sm font-medium">Return to Journal</p>
              <p className="text-text-muted/60 text-xs">Grounding prompt pre-loaded</p>
            </div>
          </Link>

          <Link
            to="/compass/cards"
            className="flex items-center gap-4 bg-compass-dark border border-gold/20 rounded-xl p-4 hover:border-gold/40 transition-colors active:scale-[0.98]"
          >
            <span className="text-2xl">🃏</span>
            <div>
              <p className="text-white text-sm font-medium">Draw an Affirmation Card</p>
              <p className="text-text-muted/60 text-xs">A word to carry with you</p>
            </div>
          </Link>

          <Link
            to="/compass/poem"
            className="flex items-center gap-4 bg-compass-dark border border-gold/20 rounded-xl p-4 hover:border-gold/40 transition-colors active:scale-[0.98]"
          >
            <span className="text-2xl">🎤</span>
            <div>
              <p className="text-white text-sm font-medium">Listen to something</p>
              <p className="text-text-muted/60 text-xs">Keith Jarrett &middot; 3 min</p>
            </div>
          </Link>
        </div>
      </section>

      {/* ── Privacy badge ─────────────────────────────────────── */}
      <div className="flex items-center justify-center gap-2 py-4">
        <svg className="w-4 h-4 text-text-muted/40" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z"
          />
        </svg>
        <p className="text-text-muted/40 text-xs">
          This page doesn&rsquo;t track anything. No data is sent anywhere.
        </p>
      </div>
    </div>
  )
}
