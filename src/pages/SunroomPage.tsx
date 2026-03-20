import { useState, useEffect, useCallback } from 'react'

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

const LAUGHTER_KEY = 'ivors-compass-laughter'
const MAX_CHARS = 140

interface LaughterNote {
  text: string
  date: string // ISO string
}

// ---------------------------------------------------------------------------
// Persistence helpers
// ---------------------------------------------------------------------------

function loadLaughterNotes(): LaughterNote[] {
  try {
    const raw = localStorage.getItem(LAUGHTER_KEY)
    return raw ? (JSON.parse(raw) as LaughterNote[]) : []
  } catch {
    return []
  }
}

function saveLaughterNotes(notes: LaughterNote[]): void {
  try {
    localStorage.setItem(LAUGHTER_KEY, JSON.stringify(notes))
  } catch {
    /* storage full -- degrade gracefully */
  }
}

// ---------------------------------------------------------------------------
// Community highlights data
// ---------------------------------------------------------------------------

interface CommunityHighlight {
  title: string
  description: string
  href: string
  external: boolean
}

const COMMUNITY_HIGHLIGHTS: CommunityHighlight[] = [
  {
    title: 'BLKOUT turns 10 this year',
    description:
      'A decade of building community, creating space, and holding each other up. Celebrate with us.',
    href: 'https://blkoutuk.com',
    external: true,
  },
  {
    title: 'Black Men Who Brunch returns',
    description:
      'Good food, honest conversation, no performance required. Our signature community gathering.',
    href: 'https://blkoutuk.com',
    external: true,
  },
  {
    title: 'Ivor Cummings: the man behind the name',
    description:
      'A gay Black man who shaped modern Britain. Learn the history that inspired this compass.',
    href: '/compass/about',
    external: false,
  },
  {
    title: 'Your voice matters -- join the cooperative',
    description:
      'BLKOUT is community-owned. Shape what we build, how we grow, and where we go next.',
    href: 'https://blkoutuk.com/join',
    external: true,
  },
]

// ---------------------------------------------------------------------------
// SVG Icons
// ---------------------------------------------------------------------------

function ChatBubbleIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth="1.5"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M8.625 12a.375.375 0 11-.75 0 .375.375 0 01.75 0zm4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z"
      />
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M2.25 12.76c0 1.6 1.123 2.994 2.707 3.227 1.068.157 2.148.279 3.238.364.466.037.893.281 1.153.671L12 21l2.652-3.978c.26-.39.687-.634 1.153-.671 1.09-.085 2.17-.207 3.238-.364 1.584-.233 2.707-1.627 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0012 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018z"
      />
    </svg>
  )
}

function ExternalLinkIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth="1.5"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25"
      />
    </svg>
  )
}

function SunIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth="1.5"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M12 3v2.25m6.364.386l-1.591 1.591M21 12h-2.25m-.386 6.364l-1.591-1.591M12 18.75V21m-4.773-4.227l-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z"
      />
    </svg>
  )
}

function SparklesIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth="1.5"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.455 2.456L21.75 6l-1.036.259a3.375 3.375 0 00-2.455 2.456zM16.894 20.567L16.5 21.75l-.394-1.183a2.25 2.25 0 00-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 001.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 001.423 1.423l1.183.394-1.183.394a2.25 2.25 0 00-1.423 1.423z"
      />
    </svg>
  )
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function formatRelativeDate(iso: string): string {
  const date = new Date(iso)
  const now = new Date()
  const diffMs = now.getTime() - date.getTime()
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24))

  if (diffDays === 0) return 'Today'
  if (diffDays === 1) return 'Yesterday'
  if (diffDays < 7) return `${diffDays} days ago`
  return date.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export default function SunroomPage() {
  const [notes, setNotes] = useState<LaughterNote[]>(loadLaughterNotes)
  const [input, setInput] = useState('')
  const [justSaved, setJustSaved] = useState(false)

  useEffect(() => {
    saveLaughterNotes(notes)
  }, [notes])

  const handleSave = useCallback(() => {
    const trimmed = input.trim()
    if (!trimmed) return

    const newNote: LaughterNote = {
      text: trimmed,
      date: new Date().toISOString(),
    }
    setNotes((prev) => [newNote, ...prev])
    setInput('')
    setJustSaved(true)
    setTimeout(() => setJustSaved(false), 2000)
  }, [input])

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault()
        handleSave()
      }
    },
    [handleSave],
  )

  const recentNotes = notes.slice(0, 7)

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Hero */}
      <div className="text-center py-6">
        <div className="flex items-center justify-center gap-2 mb-3">
          <SunIcon className="w-7 h-7 text-gold" />
        </div>
        <h1 className="font-heritage text-3xl text-white mb-2">The Sunroom</h1>
        <p className="text-gold-rich text-sm italic">
          A warmer space. For joy, community, and connection.
        </p>
      </div>

      {/* ----------------------------------------------------------------- */}
      {/* AIvor Chat Link                                                    */}
      {/* ----------------------------------------------------------------- */}
      <a
        href="https://blkoutuk.com?chat=open"
        target="_blank"
        rel="noopener noreferrer"
        className="block rounded-2xl p-5 transition-all active:scale-[0.98]"
        style={{
          backgroundColor: '#1C1A14',
          border: '2px solid #D4AF3760',
        }}
      >
        <div className="flex items-start gap-4">
          <div
            className="w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0"
            style={{ backgroundColor: '#D4AF3720' }}
          >
            <ChatBubbleIcon className="w-6 h-6 text-gold-rich" />
          </div>
          <div className="flex-1 min-w-0">
            <h2 className="font-heritage text-lg text-white mb-1">Talk to AIvor</h2>
            <p className="text-text-muted text-sm leading-relaxed">
              AIvor is your companion -- named after Ivor Cummings. Ask him about Black
              queer heritage, find events, or just talk.
            </p>
          </div>
          <ExternalLinkIcon className="w-4 h-4 text-gold-dim flex-shrink-0 mt-1" />
        </div>
      </a>

      {/* ----------------------------------------------------------------- */}
      {/* The Laughter Note                                                  */}
      {/* ----------------------------------------------------------------- */}
      <div
        className="rounded-2xl p-5 space-y-4"
        style={{
          backgroundColor: '#161412',
          border: '1px solid #D4AF3730',
        }}
      >
        <div className="flex items-center gap-2">
          <SparklesIcon className="w-5 h-5 text-gold" />
          <h2 className="font-heritage text-lg text-white">The Laughter Note</h2>
        </div>

        <p className="text-text-muted text-sm">
          What made you smile or laugh today? Even the smallest thing.
        </p>

        <div className="space-y-2">
          <div className="relative">
            <input
              type="text"
              value={input}
              onChange={(e) => {
                setInput(e.target.value.slice(0, MAX_CHARS))
                setJustSaved(false)
              }}
              onKeyDown={handleKeyDown}
              placeholder="The way the light hit the window..."
              maxLength={MAX_CHARS}
              className="w-full rounded-xl px-4 py-3 text-sm text-white placeholder-text-muted/40 focus:outline-none"
              style={{
                backgroundColor: '#0A0A0A',
                border: '1px solid #D4AF3725',
              }}
            />
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] text-text-muted/40">
              {input.length}/{MAX_CHARS}
            </span>
          </div>

          <button
            onClick={handleSave}
            disabled={!input.trim()}
            className="w-full py-2.5 rounded-xl text-sm font-medium transition-all active:scale-[0.98] disabled:opacity-30 disabled:cursor-not-allowed"
            style={{
              backgroundColor: justSaved ? '#059669' : '#D4AF3720',
              color: justSaved ? '#ffffff' : '#D4AF37',
              border: `1px solid ${justSaved ? '#05966940' : '#D4AF3740'}`,
            }}
          >
            {justSaved ? 'Noted' : 'Save this moment'}
          </button>
        </div>

        {/* Recent laughter notes */}
        {recentNotes.length > 0 && (
          <div className="space-y-2 pt-2">
            <p className="text-xs text-text-muted/60 uppercase tracking-wider">
              Recent joys
            </p>
            <div className="space-y-2">
              {recentNotes.map((note, i) => (
                <div
                  key={`${note.date}-${i}`}
                  className="rounded-xl px-4 py-3"
                  style={{
                    backgroundColor: '#D4AF3708',
                    border: '1px solid #D4AF3715',
                  }}
                >
                  <p className="text-sm text-white/80">{note.text}</p>
                  <p className="text-[10px] text-text-muted/40 mt-1">
                    {formatRelativeDate(note.date)}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* ----------------------------------------------------------------- */}
      {/* Community Highlights                                               */}
      {/* ----------------------------------------------------------------- */}
      <div className="space-y-3">
        <h2 className="font-heritage text-lg text-white px-1">From the Community</h2>

        <div className="space-y-3">
          {COMMUNITY_HIGHLIGHTS.map((item) => {
            const Tag = item.external ? 'a' : 'a'
            const linkProps = item.external
              ? { href: item.href, target: '_blank', rel: 'noopener noreferrer' }
              : { href: item.href }

            return (
              <Tag
                key={item.title}
                {...linkProps}
                className="block rounded-2xl p-4 transition-all active:scale-[0.98]"
                style={{
                  backgroundColor: '#141210',
                  border: '1px solid #D4AF3720',
                }}
              >
                <div className="flex items-start gap-3">
                  <div className="flex-1 min-w-0">
                    <h3 className="font-heritage text-base text-white mb-1">
                      {item.title}
                    </h3>
                    <p className="text-text-muted text-xs leading-relaxed">
                      {item.description}
                    </p>
                  </div>
                  {item.external && (
                    <ExternalLinkIcon className="w-4 h-4 text-gold-dim/60 flex-shrink-0 mt-0.5" />
                  )}
                  {!item.external && (
                    <svg
                      className="w-4 h-4 text-text-muted/30 flex-shrink-0 mt-0.5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth="1.5"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M8.25 4.5l7.5 7.5-7.5 7.5"
                      />
                    </svg>
                  )}
                </div>
              </Tag>
            )
          })}
        </div>
      </div>

      {/* ----------------------------------------------------------------- */}
      {/* Visual Resonance (placeholder)                                     */}
      {/* ----------------------------------------------------------------- */}
      <div className="space-y-3">
        <div className="px-1">
          <h2 className="font-heritage text-lg text-white">Visual Resonance</h2>
          <p className="text-text-muted text-xs mt-1">
            Curated images from the BLKOUT community -- coming soon
          </p>
        </div>

        <div className="grid grid-cols-3 gap-3">
          {[
            { gradient: 'linear-gradient(135deg, #802918, #5C1D11)', label: 'Terracotta' },
            { gradient: 'linear-gradient(135deg, #D4AF37, #B8941F)', label: 'Gold' },
            { gradient: 'linear-gradient(135deg, #4A5568, #2D3748)', label: 'Slate' },
          ].map((card) => (
            <div
              key={card.label}
              className="aspect-square rounded-2xl flex items-center justify-center"
              style={{
                background: card.gradient,
                opacity: 0.7,
              }}
            >
              <p className="text-white/60 text-[10px] text-center px-2">
                Image coming soon
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Privacy note */}
      <div className="flex items-center justify-center gap-2 py-4">
        <svg
          className="w-3.5 h-3.5 text-text-muted/40"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth="2"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
          />
        </svg>
        <span className="text-[10px] text-text-muted/40">
          Your laughter notes stay on this device. Never uploaded.
        </span>
      </div>
    </div>
  )
}
