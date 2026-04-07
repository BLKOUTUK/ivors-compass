import { useState, useEffect, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { phaseConfig, type Phase } from '../data/journalPrompts'
import { PrivacyLock } from '../components/ui'

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

type MoodLevel = 1 | 2 | 3 | 4 | 5

interface MoodEntry {
  date: string // ISO date string YYYY-MM-DD
  level: MoodLevel
  note: string
}

interface MoodOption {
  level: MoodLevel
  label: string
  description: string
  color: string // hex for inline styles (Tailwind 4 dynamic)
  colorMuted: string
  icon: React.ReactNode
}

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

const STORAGE_KEY = 'ivors-compass-mood-tracker'

/** Map mood levels to suggested journal phases */
const MOOD_PHASE_MAP: Record<MoodLevel, Phase> = {
  1: 'resistance',
  2: 'resistance',
  3: 'identity',
  4: 'joy',
  5: 'joy',
}

const MOOD_PHASE_REASON: Record<MoodLevel, string> = {
  1: 'Grounding prompts to help you hold steady',
  2: 'Boundary-setting and rest as resistance',
  3: 'Identity and connection reflections',
  4: 'Celebrate and name what feels good',
  5: 'Radical joy and future-dreaming',
}

/** Abstract SVG mood icons -- mature, not childish */
function CloudHeavy() {
  return (
    <svg viewBox="0 0 48 48" fill="none" className="w-10 h-10">
      <path
        d="M12 32c-3.3 0-6-2.7-6-6 0-2.8 1.9-5.1 4.5-5.8C11.3 16.1 15.2 13 20 13c4.2 0 7.8 2.4 9.5 5.9C30.2 18.3 31.1 18 32 18c3.3 0 6 2.7 6 6s-2.7 6-6 6H12z"
        fill="currentColor"
        opacity="0.7"
      />
      <path
        d="M16 36h16M18 40h12"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        opacity="0.4"
      />
    </svg>
  )
}

function CloudOvercast() {
  return (
    <svg viewBox="0 0 48 48" fill="none" className="w-10 h-10">
      <path
        d="M14 30c-2.8 0-5-2.2-5-5 0-2.3 1.6-4.3 3.8-4.8C13.4 16.6 16.8 14 21 14c3.5 0 6.5 2 8 4.9.5-.2 1.1-.4 1.7-.4 2.8 0 5 2.2 5 5s-2.2 5-5 5H14z"
        fill="currentColor"
        opacity="0.6"
      />
      <circle cx="32" cy="14" r="4" fill="currentColor" opacity="0.2" />
    </svg>
  )
}

function WaterCalm() {
  return (
    <svg viewBox="0 0 48 48" fill="none" className="w-10 h-10">
      <path
        d="M6 24c4-3 8 3 12 0s8 3 12 0 8 3 12 0"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        opacity="0.6"
      />
      <path
        d="M6 30c4-2 8 2 12 0s8 2 12 0 8 2 12 0"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        opacity="0.35"
      />
      <circle cx="24" cy="16" r="5" fill="currentColor" opacity="0.15" />
    </svg>
  )
}

function WarmLight() {
  return (
    <svg viewBox="0 0 48 48" fill="none" className="w-10 h-10">
      <circle cx="24" cy="22" r="8" fill="currentColor" opacity="0.5" />
      <path
        d="M24 8v4M24 32v4M12 22H8M40 22h-4M14.3 12.3l2.8 2.8M30.9 15.1l2.8-2.8M14.3 31.7l2.8-2.8M30.9 28.9l2.8 2.8"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        opacity="0.4"
      />
    </svg>
  )
}

function Radiance() {
  return (
    <svg viewBox="0 0 48 48" fill="none" className="w-10 h-10">
      <circle cx="24" cy="24" r="9" fill="currentColor" opacity="0.6" />
      <circle cx="24" cy="24" r="14" stroke="currentColor" strokeWidth="1.5" opacity="0.3" />
      <circle cx="24" cy="24" r="19" stroke="currentColor" strokeWidth="1" opacity="0.15" />
      <path
        d="M24 2v6M24 40v6M2 24h6M40 24h6M7.7 7.7l4.2 4.2M36.1 36.1l4.2 4.2M7.7 40.3l4.2-4.2M36.1 11.9l4.2-4.2"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        opacity="0.3"
      />
    </svg>
  )
}

const MOOD_OPTIONS: MoodOption[] = [
  {
    level: 1,
    label: 'Struggling',
    description: 'Heavy. Need grounding.',
    color: '#6B7280',
    colorMuted: '#6B728040',
    icon: <CloudHeavy />,
  },
  {
    level: 2,
    label: 'Low',
    description: 'Overcast. Getting through.',
    color: '#9CA3AF',
    colorMuted: '#9CA3AF40',
    icon: <CloudOvercast />,
  },
  {
    level: 3,
    label: 'Steady',
    description: 'Calm waters. Present.',
    color: '#A67C52',
    colorMuted: '#A67C5240',
    icon: <WaterCalm />,
  },
  {
    level: 4,
    label: 'Good',
    description: 'Warm. Grateful.',
    color: '#D4AF37',
    colorMuted: '#D4AF3740',
    icon: <WarmLight />,
  },
  {
    level: 5,
    label: 'Thriving',
    description: 'Radiant. Full.',
    color: '#D97706',
    colorMuted: '#D9770640',
    icon: <Radiance />,
  },
]

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function todayISO(): string {
  return new Date().toISOString().split('T')[0]
}

function loadEntries(): MoodEntry[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return []
    return JSON.parse(raw) as MoodEntry[]
  } catch {
    return []
  }
}

function saveEntries(entries: MoodEntry[]): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(entries))
}

function getOptionForLevel(level: MoodLevel): MoodOption {
  return MOOD_OPTIONS[level - 1]
}

function daysAgo(n: number): string {
  const d = new Date()
  d.setDate(d.getDate() - n)
  return d.toISOString().split('T')[0]
}

function weekdayShort(isoDate: string): string {
  return new Date(isoDate + 'T12:00:00').toLocaleDateString('en-GB', { weekday: 'short' })
}


// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export default function MoodTrackerPage() {
  const [entries, setEntries] = useState<MoodEntry[]>(loadEntries)
  const [selectedLevel, setSelectedLevel] = useState<MoodLevel | null>(null)
  const [note, setNote] = useState('')
  const [justSaved, setJustSaved] = useState(false)
  const [view, setView] = useState<'checkin' | 'trends'>('checkin')

  // Check if today already logged
  const todayEntry = useMemo(
    () => entries.find((e) => e.date === todayISO()),
    [entries],
  )

  // On mount, if today exists, show it selected
  useEffect(() => {
    if (todayEntry) {
      setSelectedLevel(todayEntry.level)
      setNote(todayEntry.note)
    }
  }, [todayEntry])

  // -- Save handler --
  function handleSave() {
    if (!selectedLevel) return

    const entry: MoodEntry = {
      date: todayISO(),
      level: selectedLevel,
      note: note.trim(),
    }

    const updated = entries.filter((e) => e.date !== todayISO())
    updated.unshift(entry)
    updated.sort((a, b) => b.date.localeCompare(a.date))

    setEntries(updated)
    saveEntries(updated)
    setJustSaved(true)
    setTimeout(() => setJustSaved(false), 2500)
  }

  // -- Computed trends --
  const last7Days = useMemo(() => {
    const days: Array<{ date: string; entry: MoodEntry | undefined }> = []
    for (let i = 6; i >= 0; i--) {
      const date = daysAgo(i)
      days.push({ date, entry: entries.find((e) => e.date === date) })
    }
    return days
  }, [entries])

  const last30Days = useMemo(() => {
    const cutoff = daysAgo(29)
    return entries.filter((e) => e.date >= cutoff)
  }, [entries])

  const moodCounts = useMemo(() => {
    const counts: Record<MoodLevel, number> = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 }
    for (const e of last30Days) {
      counts[e.level]++
    }
    return counts
  }, [last30Days])

  const weekMostCommon = useMemo(() => {
    const weekEntries = last7Days.filter((d) => d.entry).map((d) => d.entry!)
    if (weekEntries.length === 0) return null
    const counts: Record<MoodLevel, number> = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 }
    for (const e of weekEntries) counts[e.level]++
    let maxLevel: MoodLevel = 3
    let maxCount = 0
    for (const [lvl, cnt] of Object.entries(counts)) {
      if (cnt > maxCount) {
        maxCount = cnt
        maxLevel = Number(lvl) as MoodLevel
      }
    }
    return getOptionForLevel(maxLevel)
  }, [last7Days])

  // -- Phase suggestion --
  const suggestedPhase = selectedLevel ? MOOD_PHASE_MAP[selectedLevel] : null
  const phaseInfo = suggestedPhase ? phaseConfig[suggestedPhase] : null
  const phaseReason = selectedLevel ? MOOD_PHASE_REASON[selectedLevel] : null

  // -------------------------------------------------------------------------
  // Render
  // -------------------------------------------------------------------------

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center py-4">
        <h1 className="font-heritage text-2xl text-white mb-1">Mood Check-in</h1>
        <p className="text-text-muted text-sm">How are you arriving today?</p>
      </div>

      {/* View toggle */}
      <div className="flex gap-2 bg-compass-dark rounded-lg p-1">
        <button
          onClick={() => setView('checkin')}
          className="flex-1 py-2 text-sm rounded-md transition-colors"
          style={{
            backgroundColor: view === 'checkin' ? '#D4AF3720' : 'transparent',
            color: view === 'checkin' ? '#D4AF37' : '#9CA3AF',
          }}
        >
          Today
        </button>
        <button
          onClick={() => setView('trends')}
          className="flex-1 py-2 text-sm rounded-md transition-colors"
          style={{
            backgroundColor: view === 'trends' ? '#D4AF3720' : 'transparent',
            color: view === 'trends' ? '#D4AF37' : '#9CA3AF',
          }}
        >
          Trends
        </button>
      </div>

      {view === 'checkin' ? (
        <>
          {/* Mood selection */}
          <div className="space-y-3">
            {MOOD_OPTIONS.map((option) => {
              const isSelected = selectedLevel === option.level
              return (
                <button
                  key={option.level}
                  onClick={() => {
                    setSelectedLevel(option.level)
                    setJustSaved(false)
                  }}
                  className="w-full text-left rounded-xl p-4 transition-all active:scale-[0.98]"
                  style={{
                    backgroundColor: isSelected ? option.colorMuted : '#1A1A1A',
                    borderWidth: '1px',
                    borderStyle: 'solid',
                    borderColor: isSelected ? option.color + '80' : '#ffffff10',
                  }}
                >
                  <div className="flex items-center gap-4">
                    <div style={{ color: isSelected ? option.color : '#6B7280' }}>
                      {option.icon}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p
                        className="font-heritage text-base"
                        style={{ color: isSelected ? option.color : '#D1D5DB' }}
                      >
                        {option.label}
                      </p>
                      <p className="text-xs mt-0.5" style={{ color: '#9CA3AF' }}>
                        {option.description}
                      </p>
                    </div>
                    {isSelected && (
                      <div
                        className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0"
                        style={{ backgroundColor: option.color }}
                      >
                        <svg className="w-3 h-3 text-compass-black" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                    )}
                  </div>
                </button>
              )
            })}
          </div>

          {/* Optional note */}
          {selectedLevel && (
            <div className="space-y-2">
              <label className="text-sm text-text-muted block">
                What's behind this feeling?{' '}
                <span className="text-text-muted/50">(optional)</span>
              </label>
              <textarea
                value={note}
                onChange={(e) => {
                  setNote(e.target.value)
                  setJustSaved(false)
                }}
                placeholder="A few words, if you want..."
                maxLength={280}
                rows={3}
                className="w-full bg-compass-dark border border-compass-border rounded-lg px-4 py-3 text-sm text-white placeholder-text-muted/40 focus:outline-none focus:border-gold/40 resize-none"
              />
              <p className="text-xs text-text-muted/40 text-right">{note.length}/280</p>
            </div>
          )}

          {/* Save button */}
          {selectedLevel && (
            <button
              onClick={handleSave}
              className="w-full py-3 rounded-xl font-heritage text-sm transition-all active:scale-[0.98]"
              style={{
                backgroundColor: justSaved ? '#059669' : '#D4AF37',
                color: '#0A0A0A',
              }}
            >
              {justSaved
                ? 'Saved'
                : todayEntry
                  ? 'Update today'
                  : 'Log mood'}
            </button>
          )}

          {/* Phase suggestion */}
          {selectedLevel && phaseInfo && suggestedPhase && (
            <div
              className="rounded-xl p-5 space-y-3"
              style={{
                backgroundColor: phaseInfo.color + '15',
                borderWidth: '1px',
                borderStyle: 'solid',
                borderColor: phaseInfo.color + '30',
              }}
            >
              <div className="flex items-start gap-3">
                <div
                  className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5"
                  style={{ backgroundColor: phaseInfo.color + '30' }}
                >
                  <svg
                    className="w-4 h-4"
                    style={{ color: phaseInfo.color }}
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M13 7l5 5m0 0l-5 5m5-5H6"
                    />
                  </svg>
                </div>
                <div>
                  <p className="text-sm text-white font-medium">
                    Try the{' '}
                    <span style={{ color: phaseInfo.color }}>{phaseInfo.label}</span>{' '}
                    journal phase
                  </p>
                  <p className="text-xs mt-1" style={{ color: '#9CA3AF' }}>
                    {phaseReason}
                  </p>
                </div>
              </div>
              <Link
                to={`/compass/journal?prompt=${encodeURIComponent(phaseInfo.description)}`}
                className="block text-center py-2.5 rounded-lg text-sm font-medium transition-all active:scale-[0.98]"
                style={{
                  backgroundColor: phaseInfo.color + '25',
                  color: phaseInfo.color,
                  borderWidth: '1px',
                  borderStyle: 'solid',
                  borderColor: phaseInfo.color + '40',
                }}
              >
                Open journal with {phaseInfo.label.toLowerCase()} prompts
              </Link>
            </div>
          )}

          {/* Quick link to trends */}
          {entries.length > 0 && (
            <button
              onClick={() => setView('trends')}
              className="w-full py-3 rounded-xl border text-sm text-text-muted hover:text-gold transition-colors"
              style={{
                borderColor: '#ffffff15',
                backgroundColor: 'transparent',
              }}
            >
              View your trends
            </button>
          )}
        </>
      ) : (
        /* --------------------------------------------------------------- */
        /* TRENDS VIEW                                                      */
        /* --------------------------------------------------------------- */
        <div className="space-y-6">
          {/* Last 7 days visual row */}
          <div className="bg-compass-dark rounded-xl p-5 space-y-4">
            <h2 className="font-heritage text-sm text-gold-rich">Last 7 days</h2>
            <div className="flex justify-between gap-1">
              {last7Days.map(({ date, entry }) => {
                const opt = entry ? getOptionForLevel(entry.level) : null
                return (
                  <div key={date} className="flex flex-col items-center gap-2 flex-1">
                    <div
                      className="w-full aspect-square rounded-lg flex items-center justify-center"
                      style={{
                        backgroundColor: opt ? opt.colorMuted : '#ffffff08',
                        borderWidth: '1px',
                        borderStyle: 'solid',
                        borderColor: opt ? opt.color + '40' : '#ffffff08',
                      }}
                    >
                      {opt ? (
                        <div style={{ color: opt.color }} className="scale-75">
                          {opt.icon}
                        </div>
                      ) : (
                        <div
                          className="w-2 h-2 rounded-full"
                          style={{ backgroundColor: '#ffffff15' }}
                        />
                      )}
                    </div>
                    <span className="text-[10px] text-text-muted/60">
                      {weekdayShort(date)}
                    </span>
                  </div>
                )
              })}
            </div>

            {/* Weekly insight */}
            {weekMostCommon && (
              <div
                className="rounded-lg px-4 py-3 text-center"
                style={{ backgroundColor: '#ffffff08' }}
              >
                <p className="text-xs text-text-muted">
                  Most common mood this week:{' '}
                  <span style={{ color: weekMostCommon.color }} className="font-medium">
                    {weekMostCommon.label}
                  </span>
                </p>
              </div>
            )}
          </div>

          {/* 30-day summary */}
          <div className="bg-compass-dark rounded-xl p-5 space-y-4">
            <h2 className="font-heritage text-sm text-gold-rich">Last 30 days</h2>
            {last30Days.length === 0 ? (
              <p className="text-sm text-text-muted/60 text-center py-4">
                No entries yet. Start logging to see your patterns.
              </p>
            ) : (
              <div className="space-y-3">
                {MOOD_OPTIONS.map((opt) => {
                  const count = moodCounts[opt.level]
                  const maxCount = Math.max(...Object.values(moodCounts), 1)
                  const pct = (count / maxCount) * 100
                  return (
                    <div key={opt.level} className="flex items-center gap-3">
                      <div
                        className="w-6 flex-shrink-0"
                        style={{ color: count > 0 ? opt.color : '#4B5563' }}
                      >
                        <div className="scale-50 origin-center">{opt.icon}</div>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-1">
                          <span
                            className="text-xs"
                            style={{ color: count > 0 ? opt.color : '#6B7280' }}
                          >
                            {opt.label}
                          </span>
                          <span className="text-xs text-text-muted/40">
                            {count} {count === 1 ? 'day' : 'days'}
                          </span>
                        </div>
                        <div
                          className="h-1.5 rounded-full overflow-hidden"
                          style={{ backgroundColor: '#ffffff08' }}
                        >
                          <div
                            className="h-full rounded-full transition-all duration-500"
                            style={{
                              width: `${pct}%`,
                              backgroundColor: count > 0 ? opt.color : 'transparent',
                              opacity: 0.7,
                            }}
                          />
                        </div>
                      </div>
                    </div>
                  )
                })}
                <p className="text-xs text-text-muted/40 text-center pt-2">
                  {last30Days.length} of 30 days tracked
                </p>
              </div>
            )}
          </div>

          {/* Recent entries with notes */}
          {entries.filter((e) => e.note).length > 0 && (
            <div className="bg-compass-dark rounded-xl p-5 space-y-3">
              <h2 className="font-heritage text-sm text-gold-rich">Recent reflections</h2>
              {entries
                .filter((e) => e.note)
                .slice(0, 5)
                .map((entry) => {
                  const opt = getOptionForLevel(entry.level)
                  return (
                    <div
                      key={entry.date}
                      className="flex gap-3 py-2"
                      style={{ borderBottom: '1px solid #ffffff08' }}
                    >
                      <div style={{ color: opt.color }} className="scale-75 flex-shrink-0 mt-0.5">
                        {opt.icon}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs text-text-muted/50">
                          {new Date(entry.date + 'T12:00:00').toLocaleDateString('en-GB', {
                            weekday: 'short',
                            day: 'numeric',
                            month: 'short',
                          })}
                        </p>
                        <p className="text-sm text-white/80 mt-0.5">{entry.note}</p>
                      </div>
                    </div>
                  )
                })}
            </div>
          )}
        </div>
      )}

      {/* Privacy badge */}
      <div className="flex items-center justify-center py-4">
        <PrivacyLock />
      </div>
    </div>
  )
}
