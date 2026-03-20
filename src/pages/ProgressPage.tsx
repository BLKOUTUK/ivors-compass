import { useState, useEffect, useMemo } from 'react'
import {
  phaseConfig,
  phaseAffirmations,
  journalPrompts,
  type Phase,
} from '../data/journalPrompts'

// ---------------------------------------------------------------------------
// Types & Constants
// ---------------------------------------------------------------------------

const FIRST_UNLOCK_KEY = 'ivors-compass-first-unlock'
const JOURNAL_KEY = 'ivors-compass-journal'
const MOOD_KEY = 'ivors-compass-mood-tracker'
const WORKSHOP_KEY = 'ivors-compass-workshop-progress'
const LAUGHTER_KEY = 'ivors-compass-laughter'

/** The 5-month cycle mapped to phases */
interface CyclePhase {
  month: number
  phase: Phase | 'integration'
  label: string
  subtitle: string
  color: string
}

const CYCLE_PHASES: CyclePhase[] = [
  {
    month: 1,
    phase: 'identity',
    label: 'Identity',
    subtitle: 'Grounding',
    color: '#802918',
  },
  {
    month: 2,
    phase: 'connection',
    label: 'Connection',
    subtitle: 'Vulnerability',
    color: '#A67C52',
  },
  {
    month: 3,
    phase: 'resistance',
    label: 'Resistance',
    subtitle: 'Strength',
    color: '#4A5568',
  },
  {
    month: 4,
    phase: 'joy',
    label: 'Joy',
    subtitle: 'Celebration',
    color: '#D97706',
  },
  {
    month: 5,
    phase: 'integration',
    label: 'Integration',
    subtitle: 'Carrying Forward',
    color: '#D4AF37',
  },
]

/** Milestone definitions */
interface Milestone {
  id: string
  label: string
  description: string
  check: (stats: SacredStats) => boolean
}

interface SacredStats {
  daysWithCompass: number
  journalEntries: number
  moodsTracked: number
  workshopsExplored: number
  laughterNotes: number
  hasStreak7: boolean
  allWorkshopsExplored: boolean
}

const MILESTONES: Milestone[] = [
  {
    id: 'first-journal',
    label: 'First whisper shared',
    description: 'You opened the journal and wrote your first entry.',
    check: (s) => s.journalEntries >= 1,
  },
  {
    id: 'streak-7',
    label: '7-day streak',
    description: 'Seven consecutive days with any activity.',
    check: (s) => s.hasStreak7,
  },
  {
    id: 'all-workshops',
    label: 'All workshops explored',
    description: 'You have opened every workshop at least once.',
    check: (s) => s.allWorkshopsExplored,
  },
  {
    id: 'journal-30',
    label: '30 journal entries',
    description: 'Thirty reflections. A month of presence.',
    check: (s) => s.journalEntries >= 30,
  },
  {
    id: 'first-laugh',
    label: 'First laughter note',
    description: 'You captured a moment of joy in the Sunroom.',
    check: (s) => s.laughterNotes >= 1,
  },
  {
    id: 'mood-14',
    label: 'Two weeks of check-ins',
    description: 'Fourteen mood check-ins. You are paying attention.',
    check: (s) => s.moodsTracked >= 14,
  },
]

// Total number of workshops defined in the data
const TOTAL_WORKSHOPS = 6

// ---------------------------------------------------------------------------
// Data loading helpers
// ---------------------------------------------------------------------------

function getFirstUnlockDate(): Date {
  try {
    const stored = localStorage.getItem(FIRST_UNLOCK_KEY)
    if (stored) return new Date(stored)
  } catch {
    /* ignore */
  }
  // If not stored yet, set it now
  const now = new Date()
  try {
    localStorage.setItem(FIRST_UNLOCK_KEY, now.toISOString())
  } catch {
    /* ignore */
  }
  return now
}

function getJournalEntryCount(): number {
  try {
    const raw = localStorage.getItem(JOURNAL_KEY)
    if (!raw) return 0
    const entries = JSON.parse(raw)
    return Array.isArray(entries) ? entries.length : 0
  } catch {
    return 0
  }
}

function getMoodEntries(): Array<{ date: string }> {
  try {
    const raw = localStorage.getItem(MOOD_KEY)
    if (!raw) return []
    const entries = JSON.parse(raw)
    return Array.isArray(entries) ? entries : []
  } catch {
    return []
  }
}

function getWorkshopProgress(): Record<string, { completed: boolean }> {
  try {
    const raw = localStorage.getItem(WORKSHOP_KEY)
    if (!raw) return {}
    return JSON.parse(raw) as Record<string, { completed: boolean }>
  } catch {
    return {}
  }
}

function getLaughterNoteCount(): number {
  try {
    const raw = localStorage.getItem(LAUGHTER_KEY)
    if (!raw) return 0
    const notes = JSON.parse(raw)
    return Array.isArray(notes) ? notes.length : 0
  } catch {
    return 0
  }
}

/** Check for a 7-day streak of any activity (journal entries, mood entries, laughter notes) */
function check7DayStreak(): boolean {
  const activityDates = new Set<string>()

  // Journal entries
  try {
    const raw = localStorage.getItem(JOURNAL_KEY)
    if (raw) {
      const entries = JSON.parse(raw) as Array<{ createdAt?: string }>
      for (const e of entries) {
        if (e.createdAt) {
          activityDates.add(e.createdAt.split('T')[0])
        }
      }
    }
  } catch {
    /* ignore */
  }

  // Mood entries
  try {
    const raw = localStorage.getItem(MOOD_KEY)
    if (raw) {
      const entries = JSON.parse(raw) as Array<{ date: string }>
      for (const e of entries) {
        if (e.date) {
          activityDates.add(e.date.split('T')[0])
        }
      }
    }
  } catch {
    /* ignore */
  }

  // Laughter notes
  try {
    const raw = localStorage.getItem(LAUGHTER_KEY)
    if (raw) {
      const notes = JSON.parse(raw) as Array<{ date: string }>
      for (const n of notes) {
        if (n.date) {
          activityDates.add(n.date.split('T')[0])
        }
      }
    }
  } catch {
    /* ignore */
  }

  if (activityDates.size < 7) return false

  // Sort dates and check for 7 consecutive
  const sorted = Array.from(activityDates).sort()
  let consecutive = 1
  for (let i = 1; i < sorted.length; i++) {
    const prev = new Date(sorted[i - 1] + 'T12:00:00')
    const curr = new Date(sorted[i] + 'T12:00:00')
    const diffDays = Math.round(
      (curr.getTime() - prev.getTime()) / (1000 * 60 * 60 * 24),
    )
    if (diffDays === 1) {
      consecutive++
      if (consecutive >= 7) return true
    } else {
      consecutive = 1
    }
  }
  return false
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export default function ProgressPage() {
  const [firstUnlock] = useState<Date>(getFirstUnlockDate)

  // Recompute stats on mount
  const stats = useMemo<SacredStats>(() => {
    const now = new Date()
    const diffMs = now.getTime() - firstUnlock.getTime()
    const daysWithCompass = Math.max(1, Math.floor(diffMs / (1000 * 60 * 60 * 24)) + 1)

    const journalEntries = getJournalEntryCount()
    const moodEntries = getMoodEntries()
    const workshopProgress = getWorkshopProgress()
    const laughterNotes = getLaughterNoteCount()

    const workshopsExplored = Object.keys(workshopProgress).length
    const allWorkshopsExplored = workshopsExplored >= TOTAL_WORKSHOPS

    return {
      daysWithCompass,
      journalEntries,
      moodsTracked: moodEntries.length,
      workshopsExplored,
      laughterNotes,
      hasStreak7: check7DayStreak(),
      allWorkshopsExplored,
    }
  }, [firstUnlock])

  // Current phase based on days since first unlock
  const currentPhaseIndex = useMemo(() => {
    // Each phase is ~30 days
    const monthIndex = Math.floor((stats.daysWithCompass - 1) / 30)
    return Math.min(monthIndex, CYCLE_PHASES.length - 1)
  }, [stats.daysWithCompass])

  const currentPhase = CYCLE_PHASES[currentPhaseIndex]

  // Phase wisdom: get a curated prompt matching the current phase
  const phasePrompt = useMemo(() => {
    if (currentPhase.phase === 'integration') {
      // For integration, pick from joy prompts
      const joyPrompts = journalPrompts.filter((p) => p.phase === 'joy')
      return joyPrompts[Math.floor(Math.random() * joyPrompts.length)]
    }
    const matching = journalPrompts.filter((p) => p.phase === currentPhase.phase)
    return matching.length > 0
      ? matching[Math.floor(Math.random() * matching.length)]
      : null
  }, [currentPhase])

  // Trigger re-render when localStorage changes in another tab
  const [, setTick] = useState(0)
  useEffect(() => {
    function onStorage() {
      setTick((t) => t + 1)
    }
    window.addEventListener('storage', onStorage)
    return () => window.removeEventListener('storage', onStorage)
  }, [])

  // Earned milestones
  const earnedMilestones = MILESTONES.filter((m) => m.check(stats))
  const unearnedMilestones = MILESTONES.filter((m) => !m.check(stats))

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Hero */}
      <div className="text-center py-6">
        <h1 className="font-heritage text-3xl text-white mb-2">Sacred Momentum</h1>
        <p className="text-gold-rich text-sm italic">
          Not a checklist. A compass needle finding true north.
        </p>
      </div>

      {/* ----------------------------------------------------------------- */}
      {/* Journey Overview                                                   */}
      {/* ----------------------------------------------------------------- */}
      <div
        className="rounded-2xl p-5 space-y-4"
        style={{
          backgroundColor: '#111111',
          border: '1px solid #2A2A2A',
        }}
      >
        <h2 className="font-heritage text-sm text-gold-rich">The Five-Month Journey</h2>

        {/* Phase path */}
        <div className="flex items-center gap-1">
          {CYCLE_PHASES.map((phase, i) => {
            const isActive = i === currentPhaseIndex
            const isPast = i < currentPhaseIndex
            return (
              <div key={phase.month} className="flex-1 flex flex-col items-center gap-2">
                {/* Dot / node */}
                <div className="relative flex items-center justify-center w-full">
                  {/* Connecting line */}
                  {i > 0 && (
                    <div
                      className="absolute right-1/2 top-1/2 -translate-y-1/2 h-0.5"
                      style={{
                        width: '100%',
                        backgroundColor: isPast ? phase.color + '80' : '#2A2A2A',
                      }}
                    />
                  )}
                  {/* Node */}
                  <div
                    className="relative z-10 rounded-full flex items-center justify-center transition-all"
                    style={{
                      width: isActive ? '36px' : '24px',
                      height: isActive ? '36px' : '24px',
                      backgroundColor: isActive
                        ? phase.color
                        : isPast
                          ? phase.color + '60'
                          : '#1A1A1A',
                      border: isActive
                        ? `2px solid ${phase.color}`
                        : isPast
                          ? `1px solid ${phase.color}40`
                          : '1px solid #2A2A2A',
                      boxShadow: isActive ? `0 0 16px ${phase.color}40` : 'none',
                    }}
                  >
                    {isActive && (
                      <svg
                        className="w-4 h-4"
                        style={{ color: '#0A0A0A' }}
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth="2.5"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M12 3v1m0 16v1m-8-9H3m18 0h-1m-2.636-6.364l-.707.707M6.343 17.657l-.707.707m12.728 0l-.707-.707M6.343 6.343l-.707-.707"
                        />
                      </svg>
                    )}
                    {isPast && (
                      <svg
                        className="w-3 h-3"
                        style={{ color: '#0A0A0A' }}
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth="3"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                    )}
                  </div>
                </div>

                {/* Label */}
                <div className="text-center">
                  <p
                    className="text-[10px] font-medium"
                    style={{
                      color: isActive ? phase.color : isPast ? phase.color + '90' : '#6B7280',
                    }}
                  >
                    {phase.label}
                  </p>
                  <p className="text-[8px] text-text-muted/40">{phase.subtitle}</p>
                </div>
              </div>
            )
          })}
        </div>

        {/* Current position label */}
        <div
          className="text-center rounded-xl px-4 py-3"
          style={{
            backgroundColor: currentPhase.color + '10',
            border: `1px solid ${currentPhase.color}25`,
          }}
        >
          <p className="text-xs text-text-muted">
            You are in{' '}
            <span className="font-medium" style={{ color: currentPhase.color }}>
              Month {currentPhase.month}: {currentPhase.label}
            </span>
          </p>
          <p className="text-[10px] text-text-muted/50 mt-1">
            Day {stats.daysWithCompass} of your journey
          </p>
        </div>
      </div>

      {/* ----------------------------------------------------------------- */}
      {/* Sacred Metrics                                                     */}
      {/* ----------------------------------------------------------------- */}
      <div
        className="rounded-2xl p-5 space-y-4"
        style={{
          backgroundColor: '#111111',
          border: '1px solid #2A2A2A',
        }}
      >
        <h2 className="font-heritage text-sm text-gold-rich">Sacred Metrics</h2>

        <div className="grid grid-cols-2 gap-4">
          {[
            {
              value: stats.daysWithCompass,
              label: 'Days with your Compass',
              color: '#D4AF37',
            },
            {
              value: stats.journalEntries,
              label: 'Journal entries',
              color: '#D97706',
            },
            {
              value: stats.moodsTracked,
              label: 'Moods tracked',
              color: '#A67C52',
            },
            {
              value: stats.workshopsExplored,
              label: 'Workshops explored',
              color: '#802918',
            },
            {
              value: stats.laughterNotes,
              label: 'Laughter notes',
              color: '#D97706',
            },
          ].map((metric) => (
            <div
              key={metric.label}
              className="rounded-xl p-4 text-center"
              style={{
                backgroundColor: metric.color + '08',
                border: `1px solid ${metric.color}20`,
              }}
            >
              <p
                className="font-heritage text-3xl"
                style={{ color: metric.color }}
              >
                {metric.value}
              </p>
              <p className="text-[10px] text-text-muted mt-1">{metric.label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* ----------------------------------------------------------------- */}
      {/* Phase Wisdom                                                       */}
      {/* ----------------------------------------------------------------- */}
      <div
        className="rounded-2xl p-5 space-y-4"
        style={{
          backgroundColor: currentPhase.color + '08',
          border: `1px solid ${currentPhase.color}25`,
        }}
      >
        <h2 className="font-heritage text-sm" style={{ color: currentPhase.color }}>
          Phase Wisdom: {currentPhase.label}
        </h2>

        {/* Phase description */}
        {currentPhase.phase !== 'integration' && phaseConfig[currentPhase.phase] && (
          <p className="text-text-muted text-sm leading-relaxed">
            {phaseConfig[currentPhase.phase].description}
          </p>
        )}

        {currentPhase.phase === 'integration' && (
          <p className="text-text-muted text-sm leading-relaxed">
            Carrying forward. Weaving together what you have learned across identity,
            connection, resistance, and joy. You are not the same person who started this
            journey.
          </p>
        )}

        {/* Phase affirmation */}
        <div className="py-4 text-center">
          <div
            className="w-12 h-px mx-auto mb-4"
            style={{ backgroundColor: currentPhase.color + '60' }}
          />
          <p
            className="text-sm font-light italic leading-relaxed"
            style={{ color: currentPhase.color }}
          >
            {currentPhase.phase !== 'integration'
              ? `"${phaseAffirmations[currentPhase.phase]}"`
              : '"I carry forward what I have learned. I am grounded in my identity, connected to my people, strengthened by resistance, and sustained by joy."'}
          </p>
          <div
            className="w-12 h-px mx-auto mt-4"
            style={{ backgroundColor: currentPhase.color + '60' }}
          />
        </div>

        {/* Curated prompt */}
        {phasePrompt && (
          <div
            className="rounded-xl p-4 space-y-2"
            style={{
              backgroundColor: '#0A0A0A',
              border: `1px solid ${currentPhase.color}20`,
            }}
          >
            <p className="text-[10px] uppercase tracking-wider" style={{ color: currentPhase.color }}>
              Your focus this cycle
            </p>
            <p className="text-sm text-white/80 italic leading-relaxed">
              "{phasePrompt.text}"
            </p>
          </div>
        )}
      </div>

      {/* ----------------------------------------------------------------- */}
      {/* Milestones                                                         */}
      {/* ----------------------------------------------------------------- */}
      <div
        className="rounded-2xl p-5 space-y-4"
        style={{
          backgroundColor: '#111111',
          border: '1px solid #2A2A2A',
        }}
      >
        <h2 className="font-heritage text-sm text-gold-rich">Milestones</h2>

        {earnedMilestones.length === 0 && (
          <p className="text-sm text-text-muted/60 text-center py-4">
            Your milestones will appear here as you use the compass. No rush.
          </p>
        )}

        {/* Earned */}
        {earnedMilestones.length > 0 && (
          <div className="space-y-2">
            {earnedMilestones.map((m) => (
              <div
                key={m.id}
                className="flex items-start gap-3 rounded-xl p-3"
                style={{
                  backgroundColor: '#D4AF3710',
                  border: '1px solid #D4AF3720',
                }}
              >
                <div
                  className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0"
                  style={{ backgroundColor: '#D4AF3725' }}
                >
                  <svg
                    className="w-4 h-4 text-gold-rich"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z"
                    />
                  </svg>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-white font-medium">{m.label}</p>
                  <p className="text-[10px] text-text-muted/60 mt-0.5">
                    {m.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Unearned (subtle) */}
        {unearnedMilestones.length > 0 && (
          <div className="space-y-2">
            {earnedMilestones.length > 0 && (
              <p className="text-[10px] text-text-muted/40 uppercase tracking-wider pt-2">
                Still ahead
              </p>
            )}
            {unearnedMilestones.map((m) => (
              <div
                key={m.id}
                className="flex items-start gap-3 rounded-xl p-3"
                style={{
                  backgroundColor: '#ffffff04',
                  border: '1px solid #ffffff08',
                }}
              >
                <div
                  className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0"
                  style={{ backgroundColor: '#ffffff08' }}
                >
                  <svg
                    className="w-4 h-4 text-text-muted/30"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z"
                    />
                  </svg>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-text-muted/40">{m.label}</p>
                  <p className="text-[10px] text-text-muted/30 mt-0.5">
                    {m.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Footer note */}
      <div className="text-center py-4">
        <p className="text-[10px] text-text-muted/40 leading-relaxed">
          This is not a scorecard. There is no wrong pace.
          <br />
          The compass is here whenever you are.
        </p>
      </div>
    </div>
  )
}
