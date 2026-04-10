import { useState, useRef, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useConvergence } from '../hooks/useConvergence'
import type { Whisper, DailyConvergence } from '../hooks/useConvergence'
import { phaseConfig } from '../data/journalPrompts'
import type { Phase } from '../data/journalPrompts'
import { supabase } from '../lib/supabase'
import { useCompass } from '../hooks/useCompass'

// ---------- Healing Circle signup ----------

const HEALING_CIRCLE_TARGET = 12
const HEALING_CIRCLE_KEY = 'ivors-compass-healing-circle-signed'

function HealingCircleOffer() {
  const { accessCode } = useCompass()
  const [count, setCount] = useState<number | null>(null)
  const [signedUp, setSignedUp] = useState<boolean>(() => {
    try { return localStorage.getItem(HEALING_CIRCLE_KEY) === 'true' } catch { return false }
  })
  const [email, setEmail] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false
    async function load() {
      try {
        const { count: c } = await supabase
          .from('healing_circle_signups')
          .select('id', { count: 'exact', head: true })
        if (!cancelled && c !== null) setCount(c)
      } catch {
        // Non-critical — component still renders
      }
    }
    void load()
    return () => { cancelled = true }
  }, [signedUp])

  async function handleSignup() {
    if (!email.trim() || !email.includes('@')) {
      setError('Please enter a valid email address.')
      return
    }
    setSubmitting(true)
    setError(null)
    try {
      const { error: insertErr } = await supabase
        .from('healing_circle_signups')
        .insert({
          email: email.trim().toLowerCase(),
          access_code: accessCode ?? null,
        })
      if (insertErr) throw insertErr
      localStorage.setItem(HEALING_CIRCLE_KEY, 'true')
      setSignedUp(true)
      setEmail('')
    } catch (err) {
      console.error('Healing circle signup error:', err)
      setError('Could not sign up. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  const remaining = count !== null ? Math.max(0, HEALING_CIRCLE_TARGET - count) : null
  const threshold = count !== null && count >= HEALING_CIRCLE_TARGET

  return (
    <section className="mt-10 p-6 rounded-2xl bg-compass-card border-2 border-gold/30">
      <div className="flex items-start gap-3 mb-4">
        <svg className="w-6 h-6 text-gold flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
          <circle cx="12" cy="12" r="10" />
          <path d="M8 12h8M12 8v8" />
        </svg>
        <div className="flex-1">
          <h3 className="font-heritage text-lg text-white mb-2">Healing Circle</h3>
          <p className="text-text-muted text-sm leading-relaxed mb-3">
            A journal can hold a lot. It cannot hold everything. If 12 of us sign up, we will work with partner organisations to host an online healing circle — a facilitated space for Black queer men to hold each other in reflection, grief, and joy.
          </p>
          {count !== null && (
            <div className="mb-3 space-y-2">
              <div className="flex items-center justify-between text-xs text-text-muted">
                <span>
                  {threshold
                    ? `${count} of us ready — the circle is happening`
                    : `${count} of 12 signed up`}
                </span>
                {!threshold && remaining !== null && (
                  <span className="text-gold/70">{remaining} more needed</span>
                )}
              </div>
              <div className="h-1.5 bg-compass-border rounded-full overflow-hidden">
                <div
                  className="h-full bg-gold transition-all duration-500"
                  style={{ width: `${Math.min(100, (count / HEALING_CIRCLE_TARGET) * 100)}%` }}
                />
              </div>
            </div>
          )}
        </div>
      </div>

      {signedUp ? (
        <div className="p-3 rounded-lg bg-gold/10 border border-gold/30 text-sm text-gold text-center">
          You're in. We'll be in touch when the circle is ready.
        </div>
      ) : (
        <div className="space-y-2">
          <input
            type="email"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value)
              setError(null)
            }}
            placeholder="Your email"
            className="w-full bg-compass-dark border border-compass-border rounded-lg px-3 py-2.5 text-sm text-white placeholder-text-muted/50 focus:outline-none focus:border-gold/50 transition-colors"
          />
          <button
            onClick={handleSignup}
            disabled={submitting || !email.trim()}
            className="w-full py-2.5 rounded-lg bg-gold text-compass-black font-semibold text-sm disabled:opacity-40 disabled:cursor-not-allowed hover:bg-gold-rich transition-colors"
          >
            {submitting ? 'Signing up...' : 'I want to join a healing circle'}
          </button>
          {error && <p className="text-red-400 text-xs">{error}</p>}
          <p className="text-text-muted/50 text-[10px] text-center leading-relaxed">
            Your email is used only to contact you about the circle. You can unsubscribe at any time.
          </p>
        </div>
      )}
    </section>
  )
}

// ---------- phase helpers ----------

function phaseColor(phase: string | null): string {
  if (!phase) return '#D4AF37'
  return phaseConfig[phase as Phase]?.color ?? '#D4AF37'
}

function phaseLabel(phase: string | null): string {
  if (!phase) return 'Reflection'
  return phaseConfig[phase as Phase]?.label ?? 'Reflection'
}

// ---------- sub-components ----------

function AffirmationHero({ daily }: { daily: DailyConvergence }) {
  const color = phaseColor(daily.phase)

  return (
    <section className="text-center py-8 px-4 archival-texture overflow-hidden gradient-disruption">
      {/* Phase badge */}
      <span
        className="inline-block text-[10px] font-semibold tracking-widest uppercase px-3 py-1 rounded-full mb-6"
        style={{ color, border: `1px solid ${color}40`, backgroundColor: `${color}10` }}
      >
        {phaseLabel(daily.phase)}
      </span>

      {/* Affirmation */}
      <blockquote className="font-heritage text-xl leading-relaxed text-gold sm:text-2xl max-w-xl mx-auto">
        {daily.affirmation}
      </blockquote>

      {/* Date */}
      <p className="text-text-muted/50 text-xs mt-6">
        {new Date(daily.date + 'T00:00:00').toLocaleDateString('en-GB', {
          weekday: 'long',
          day: 'numeric',
          month: 'long',
          year: 'numeric',
        })}
      </p>
    </section>
  )
}

function WhisperInput({
  onSubmit,
  submitting,
}: {
  onSubmit: (text: string) => void
  submitting: boolean
}) {
  const [text, setText] = useState('')
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const remaining = 280 - text.length

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const trimmed = text.trim()
    if (!trimmed || trimmed.length > 280) return
    onSubmit(trimmed)
  }

  // Auto-resize textarea
  useEffect(() => {
    const el = textareaRef.current
    if (!el) return
    el.style.height = 'auto'
    el.style.height = `${el.scrollHeight}px`
  }, [text])

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <label htmlFor="whisper-input" className="sr-only">
        Your whisper
      </label>
      <textarea
        ref={textareaRef}
        id="whisper-input"
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="What does this bring up for you?"
        maxLength={280}
        rows={3}
        className="w-full resize-none bg-compass-dark border border-compass-border rounded-xl px-4 py-3 text-sm text-white placeholder-text-muted/60 focus:outline-none focus:border-gold/50 transition-colors"
      />
      <div className="flex items-center justify-between">
        <span
          className={`text-xs ${remaining < 30 ? 'text-terracotta' : 'text-text-muted/60'}`}
        >
          {remaining}
        </span>
        <button
          type="submit"
          disabled={submitting || !text.trim()}
          className="px-5 py-2 bg-gold-rich hover:bg-gold text-black text-sm font-semibold rounded-lg transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
        >
          {submitting ? 'Sharing...' : 'Share your whisper'}
        </button>
      </div>
    </form>
  )
}

function VeiledPlaceholder({ count }: { count: number }) {
  // Show blurred placeholder cards to hint at community activity
  const placeholders = Array.from({ length: Math.min(count, 4) }, (_, i) => i)

  return (
    <section className="space-y-4 mt-8">
      <div className="flex items-center gap-3 mb-2">
        {/* Ripple icon */}
        <svg
          className="w-5 h-5 text-gold/40"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth="1.5"
        >
          <circle cx="12" cy="12" r="3" />
          <circle cx="12" cy="12" r="7" opacity="0.5" />
          <circle cx="12" cy="12" r="11" opacity="0.25" />
        </svg>
        <p className="text-text-muted text-sm">
          {count === 0
            ? 'Be the first to reflect today.'
            : `${count} ${count === 1 ? 'other' : 'others'} reflecting today`}
        </p>
      </div>

      {count > 0 && (
        <div className="relative">
          {/* Blurred cards */}
          <div className="space-y-3 select-none" aria-hidden="true">
            {placeholders.map((i) => (
              <div
                key={i}
                className="bg-compass-dark border border-compass-border rounded-xl p-4 blur-sm"
              >
                <p className="text-text-muted text-sm leading-relaxed">
                  {i % 2 === 0
                    ? 'This reflection is waiting for you to share yours first...'
                    : 'A brother shared something meaningful here today...'}
                </p>
              </div>
            ))}
          </div>

          {/* Overlay message */}
          <div className="absolute inset-0 flex items-center justify-center">
            <p className="bg-compass-black/80 text-gold-rich text-sm px-4 py-2 rounded-lg border border-gold/20 backdrop-blur-sm">
              Share yours to see others
            </p>
          </div>
        </div>
      )}
    </section>
  )
}

function WhisperCard({
  whisper,
  onResonate,
}: {
  whisper: Whisper
  onResonate: (id: string) => void
}) {
  const [resonated, setResonated] = useState(false)

  const handleResonate = () => {
    if (resonated || whisper.isMine) return
    setResonated(true)
    onResonate(whisper.id)
  }

  return (
    <div
      className={`bg-compass-dark border rounded-xl p-4 transition-all ${
        whisper.isMine
          ? 'border-gold/40 ring-1 ring-gold/10'
          : 'border-compass-border'
      }`}
    >
      <p className="text-white/90 text-sm leading-relaxed">{whisper.whisper_text}</p>

      <div className="flex items-center justify-between mt-3">
        {/* Timestamp */}
        <span className="text-text-muted/60 text-[10px]">
          {whisper.isMine ? 'You' : formatTime(whisper.created_at)}
        </span>

        {/* Resonate button */}
        {whisper.isMine ? (
          <span className="text-gold/40 text-xs">Your whisper</span>
        ) : (
          <button
            onClick={handleResonate}
            disabled={resonated}
            className={`flex items-center gap-1.5 text-xs transition-colors ${
              resonated
                ? 'text-gold cursor-default'
                : 'text-text-muted/50 hover:text-gold'
            }`}
            aria-label={`Resonate with this whisper. ${whisper.resonance_count} resonances.`}
          >
            {/* Ripple/resonance icon */}
            <svg
              className="w-4 h-4"
              fill={resonated ? 'currentColor' : 'none'}
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth="1.5"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z"
              />
            </svg>
            <span>{whisper.resonance_count + (resonated ? 1 : 0)}</span>
          </button>
        )}
      </div>
    </div>
  )
}

function UnveiledWhispers({
  whispers,
  onResonate,
}: {
  whispers: Whisper[]
  onResonate: (id: string) => void
}) {
  // Sort: user's own first, then by resonance descending
  const sorted = [...whispers].sort((a, b) => {
    if (a.isMine && !b.isMine) return -1
    if (!a.isMine && b.isMine) return 1
    return b.resonance_count - a.resonance_count
  })

  return (
    <section className="space-y-3 mt-8">
      <div className="flex items-center gap-3 mb-2">
        <svg
          className="w-5 h-5 text-gold/60"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth="1.5"
        >
          <circle cx="12" cy="12" r="3" />
          <circle cx="12" cy="12" r="7" opacity="0.5" />
          <circle cx="12" cy="12" r="11" opacity="0.25" />
        </svg>
        <p className="text-text-muted text-sm">
          {whispers.length} {whispers.length === 1 ? 'reflection' : 'reflections'} today
        </p>
      </div>

      <div className="space-y-3">
        {sorted.map((w) => (
          <WhisperCard key={w.id} whisper={w} onResonate={onResonate} />
        ))}
      </div>
    </section>
  )
}

// ---------- helpers ----------

function formatTime(iso: string): string {
  try {
    const d = new Date(iso)
    return d.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })
  } catch {
    return ''
  }
}

// ---------- loading skeleton ----------

function ConvergenceSkeleton() {
  return (
    <div className="animate-pulse space-y-6 py-8">
      <div className="flex justify-center">
        <div className="h-6 w-24 bg-compass-card rounded-full" />
      </div>
      <div className="space-y-3 px-4">
        <div className="h-5 bg-compass-card rounded w-3/4 mx-auto" />
        <div className="h-5 bg-compass-card rounded w-1/2 mx-auto" />
      </div>
      <div className="h-4 bg-compass-card rounded w-40 mx-auto" />
      <div className="h-24 bg-compass-card rounded-xl mx-4" />
    </div>
  )
}

// ---------- main page ----------

export default function ConvergencePage() {
  const {
    daily,
    whispers,
    hasContributed,
    totalCount,
    loading,
    submitting,
    error,
    codeId,
    submitWhisper,
    resonate,
  } = useConvergence()

  if (loading) {
    return <ConvergenceSkeleton />
  }

  if (error || !daily) {
    return (
      <div className="text-center py-20 space-y-4 animate-fade-in">
        <p className="text-text-muted text-sm">
          {error ?? 'Unable to load today\u2019s convergence.'}
        </p>
        <Link
          to="/compass"
          className="text-gold-rich text-sm inline-block hover:text-gold transition-colors"
        >
          &larr; Back home
        </Link>
      </div>
    )
  }

  const showInput = !hasContributed && !!codeId

  return (
    <div className="space-y-6 animate-fade-in pb-8">
      {/* Back link */}
      <Link
        to="/compass"
        className="inline-flex items-center gap-1.5 text-text-muted/50 text-xs hover:text-gold-rich transition-colors"
      >
        <svg
          className="w-4 h-4"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth="1.5"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M15.75 19.5L8.25 12l7.5-7.5"
          />
        </svg>
        Home
      </Link>

      {/* Title */}
      <div className="text-center">
        <h1 className="font-bold-shell text-2xl text-white title-underline" style={{ '--accent-color': 'var(--color-task-reflection)' } as React.CSSProperties}>Assembly</h1>
        <p className="text-text-muted/60 text-xs mt-1">
          A shared ritual. One affirmation. Many whispers.
        </p>
      </div>

      {/* Affirmation */}
      <AffirmationHero daily={daily} />

      {/* Divider */}
      <div className="flex items-center gap-4 px-4">
        <div className="flex-1 h-px bg-gradient-to-r from-transparent via-gold/20 to-transparent" />
        <svg
          className="w-3 h-3 text-gold/30"
          fill="currentColor"
          viewBox="0 0 8 8"
        >
          <circle cx="4" cy="4" r="3" />
        </svg>
        <div className="flex-1 h-px bg-gradient-to-r from-transparent via-gold/20 to-transparent" />
      </div>

      {/* Input or post-contribution state */}
      {showInput ? (
        <div className="space-y-4">
          <WhisperInput onSubmit={submitWhisper} submitting={submitting} />
          <VeiledPlaceholder count={totalCount} />
        </div>
      ) : hasContributed ? (
        <UnveiledWhispers whispers={whispers} onResonate={resonate} />
      ) : (
        // No code_id resolved (should be rare -- fallback)
        <div className="text-center py-8">
          <p className="text-text-muted text-sm">
            Enter your access code to join today&apos;s convergence.
          </p>
        </div>
      )}

      {/* Privacy note */}
      <p className="text-text-muted/60 text-[10px] text-center leading-relaxed px-4 mt-8">
        Your reflections are shared anonymously. Only you know which one is yours.
      </p>

      {/* Healing Circle offer */}
      <HealingCircleOffer />
    </div>
  )
}
