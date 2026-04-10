import { useState } from 'react'
import { supabase } from '../lib/supabase'
import { useCompass } from '../hooks/useCompass'

type Category = 'suggestion' | 'bug' | 'content' | 'other'

const CATEGORY_OPTIONS: Array<{ value: Category; label: string; hint: string }> = [
  { value: 'suggestion', label: 'Suggestion', hint: 'Something you would like to see' },
  { value: 'bug', label: 'Something broken', hint: 'Errors, glitches, things that do not work' },
  { value: 'content', label: 'Content feedback', hint: 'A prompt, meditation, or piece of writing landed wrong (or right)' },
  { value: 'other', label: 'Something else', hint: 'Whatever you want us to know' },
]

interface FeedbackBoxProps {
  /** Optional: which page this feedback came from, for context. */
  page?: string
  /** Compact view — no heading, smaller spacing. */
  compact?: boolean
}

export default function FeedbackBox({ page, compact = false }: FeedbackBoxProps) {
  const { accessCode } = useCompass()
  const [category, setCategory] = useState<Category>('suggestion')
  const [message, setMessage] = useState('')
  const [email, setEmail] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleSubmit() {
    if (!message.trim()) {
      setError('Please write something before sending.')
      return
    }
    setSubmitting(true)
    setError(null)
    try {
      const { error: insertErr } = await supabase.from('compass_feedback').insert({
        category,
        message: message.trim(),
        email: email.trim() || null,
        access_code: accessCode ?? null,
        page: page ?? null,
      })
      if (insertErr) throw insertErr
      setSubmitted(true)
      setMessage('')
      setEmail('')
    } catch (err) {
      console.error('Feedback submit error:', err)
      setError('Could not send. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  if (submitted) {
    return (
      <div
        className={`p-4 rounded-xl bg-gold/10 border border-gold/30 text-center ${
          compact ? 'text-xs' : 'text-sm'
        } text-gold`}
      >
        Thank you — we read every message.
        <button
          onClick={() => setSubmitted(false)}
          className="block mx-auto mt-2 text-[11px] text-text-muted/60 underline"
        >
          Send another
        </button>
      </div>
    )
  }

  return (
    <section
      className={`${compact ? 'p-4' : 'p-6'} rounded-2xl bg-compass-card border border-compass-border space-y-3`}
    >
      {!compact && (
        <div className="flex items-start gap-3">
          <svg
            className="w-5 h-5 text-gold flex-shrink-0 mt-0.5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth="1.5"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M7.5 8.25h9m-9 3H12m-9.75 1.51c0 1.6 1.123 2.994 2.707 3.227 1.129.166 2.27.293 3.423.379.35.026.67.21.865.501L12 21l2.755-4.133a1.14 1.14 0 01.865-.501 48.172 48.172 0 003.423-.379c1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0012 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018z"
            />
          </svg>
          <div className="flex-1">
            <h3 className="font-heritage text-lg text-white">Tell us what you think</h3>
            <p className="text-text-muted text-xs leading-relaxed mt-1">
              Suggestions, bugs, content feedback — all of it helps us improve the compass. Rob reads every message.
            </p>
          </div>
        </div>
      )}

      {/* Category selector */}
      <div className="flex flex-wrap gap-1.5">
        {CATEGORY_OPTIONS.map((opt) => {
          const active = category === opt.value
          return (
            <button
              key={opt.value}
              onClick={() => setCategory(opt.value)}
              className={`px-3 py-1.5 rounded-full text-xs transition-colors ${
                active
                  ? 'bg-gold/20 text-gold border border-gold/40'
                  : 'bg-compass-dark text-text-muted border border-compass-border hover:text-white'
              }`}
              title={opt.hint}
            >
              {opt.label}
            </button>
          )
        })}
      </div>

      <textarea
        value={message}
        onChange={(e) => {
          setMessage(e.target.value)
          setError(null)
        }}
        placeholder="What is on your mind?"
        rows={compact ? 3 : 4}
        className="w-full bg-compass-dark border border-compass-border rounded-lg p-3 text-sm text-white placeholder-text-muted/50 focus:outline-none focus:border-gold/50 transition-colors resize-none"
      />

      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Your email (optional — only if you want a reply)"
        className="w-full bg-compass-dark border border-compass-border rounded-lg px-3 py-2 text-xs text-white placeholder-text-muted/50 focus:outline-none focus:border-gold/50 transition-colors"
      />

      <button
        onClick={handleSubmit}
        disabled={submitting || !message.trim()}
        className="w-full py-2.5 rounded-lg bg-gold text-compass-black font-semibold text-sm disabled:opacity-40 disabled:cursor-not-allowed hover:bg-gold-rich transition-colors"
      >
        {submitting ? 'Sending...' : 'Send feedback'}
      </button>

      {error && <p className="text-red-400 text-xs text-center">{error}</p>}
    </section>
  )
}
