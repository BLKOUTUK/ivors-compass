import { useState, useEffect, useCallback, useRef } from 'react'
import { useSearchParams } from 'react-router-dom'
import {
  journalPrompts,
  phaseConfig,
  phaseAffirmations,
  heritageChapters,
  type Phase,
  type PromptCategory,
  type JournalPrompt,
} from '../data/journalPrompts'

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface JournalEntry {
  id: string
  text: string
  prompt?: string
  phase?: string
  audioData?: string
  createdAt: string
}

type PhaseFilter = Phase | 'all' | 'heritage'
type TimeOfDay = 'morning' | 'evening'

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

const ENTRIES_KEY = 'ivors-compass-journal'
const MOOD_KEY = 'ivors-compass-mood'
const MAX_AUDIO_MS = 120_000 // 2 minutes

const PHASE_COLORS: Record<Phase, string> = {
  identity: '#B35A44',
  connection: '#A67C52',
  resistance: '#4A5568',
  joy: '#D97706',
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function getTimeOfDay(): TimeOfDay {
  return new Date().getHours() < 14 ? 'morning' : 'evening'
}

function detectCategory(tod: TimeOfDay): PromptCategory[] {
  return tod === 'morning' ? ['morning', 'deep'] : ['evening', 'deep']
}

function wordCount(s: string): number {
  return s.split(/\s+/).filter(Boolean).length
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  })
}

function formatDateGroup(iso: string): string {
  return new Date(iso).toLocaleDateString('en-GB', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })
}

function groupByDate(entries: JournalEntry[]): Record<string, JournalEntry[]> {
  const groups: Record<string, JournalEntry[]> = {}
  for (const entry of entries) {
    const key = entry.createdAt.split('T')[0]
    if (!groups[key]) groups[key] = []
    groups[key].push(entry)
  }
  return groups
}

function moodToPhase(value: number): Phase {
  if (value <= 25) return 'identity'
  if (value <= 50) return 'resistance'
  if (value <= 75) return 'connection'
  return 'joy'
}

function phaseLabel(p: Phase | null | undefined): string {
  if (!p) return 'Heritage'
  return phaseConfig[p].label
}

function phaseColor(p: Phase | null | undefined): string {
  if (!p) return '#D4AF37'
  return PHASE_COLORS[p]
}

// ---------------------------------------------------------------------------
// Speech Recognition type shim
// ---------------------------------------------------------------------------

interface SpeechRecognitionEvent {
  results: SpeechRecognitionResultList
  resultIndex: number
}

interface SpeechRecognitionInstance extends EventTarget {
  continuous: boolean
  interimResults: boolean
  lang: string
  start(): void
  stop(): void
  onresult: ((event: SpeechRecognitionEvent) => void) | null
  onerror: ((event: { error: string }) => void) | null
  onend: (() => void) | null
}

function getSpeechRecognition(): (new () => SpeechRecognitionInstance) | null {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const w = window as any
  return (w.SpeechRecognition ?? w.webkitSpeechRecognition ?? null) as
    | (new () => SpeechRecognitionInstance)
    | null
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export default function JournalPage() {
  const [searchParams] = useSearchParams()
  const urlPrompt = searchParams.get('prompt')

  // --- Core state ---
  const [view, setView] = useState<'write' | 'history'>('write')
  const [entries, setEntries] = useState<JournalEntry[]>([])
  const [text, setText] = useState('')
  const [saved, setSaved] = useState(false)

  // --- Mood / phase state ---
  const [showMoodCheckin, setShowMoodCheckin] = useState(!urlPrompt)
  const [moodValue, setMoodValue] = useState(50)
  const [activePhase, setActivePhase] = useState<Phase | null>(null)

  // --- Filter state ---
  const [phaseFilter, setPhaseFilter] = useState<PhaseFilter>('all')
  const [timeOfDay, setTimeOfDay] = useState<TimeOfDay>(getTimeOfDay)

  // --- Prompt state ---
  const [selectedPrompt, setSelectedPrompt] = useState<JournalPrompt | null>(null)
  const [showFollowUps, setShowFollowUps] = useState(false)
  const [expandedPromptId, setExpandedPromptId] = useState<number | null>(null)

  // --- Voice input (Speech Recognition) ---
  const [isListening, setIsListening] = useState(false)
  const recognitionRef = useRef<SpeechRecognitionInstance | null>(null)

  // --- Audio recording (MediaRecorder) ---
  const [isRecording, setIsRecording] = useState(false)
  const [recordingSeconds, setRecordingSeconds] = useState(0)
  const [audioData, setAudioData] = useState<string | null>(null)
  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const audioChunksRef = useRef<Blob[]>([])
  const recordingTimerRef = useRef<ReturnType<typeof setInterval> | null>(null)

  // --- Load entries ---
  useEffect(() => {
    try {
      const stored = localStorage.getItem(ENTRIES_KEY)
      if (stored) setEntries(JSON.parse(stored) as JournalEntry[])
    } catch { /* empty */ }

    // Check if mood was already done today
    try {
      const moodStored = localStorage.getItem(MOOD_KEY)
      if (moodStored) {
        const parsed = JSON.parse(moodStored) as { date: string; value: number }
        if (parsed.date === new Date().toISOString().split('T')[0]) {
          setShowMoodCheckin(false)
          setActivePhase(moodToPhase(parsed.value))
          setMoodValue(parsed.value)
        }
      }
    } catch { /* empty */ }
  }, [])

  // --- If URL prompt, select it or create a virtual one ---
  useEffect(() => {
    if (urlPrompt) {
      setShowMoodCheckin(false)
      const found = journalPrompts.find((p) => p.text === urlPrompt)
      if (found) {
        setSelectedPrompt(found)
        if (found.phase) setActivePhase(found.phase)
      } else {
        setSelectedPrompt({
          id: 0,
          text: urlPrompt,
          category: 'deep',
          phase: null,
          followUps: [],
          intendedOutcome: '',
          heritageChapter: null,
          archetype: 'elder',
        })
      }
    }
  }, [urlPrompt])

  // ---------------------------------------------------------------------------
  // Filtered prompts
  // ---------------------------------------------------------------------------

  const filteredPrompts = journalPrompts.filter((p) => {
    // Phase filter
    if (phaseFilter === 'heritage') {
      return p.phase === null
    }
    if (phaseFilter !== 'all' && p.phase !== phaseFilter) {
      return false
    }
    // Time of day filter (unless heritage or deep-only)
    const categories = detectCategory(timeOfDay)
    if (p.phase !== null && !categories.includes(p.category)) {
      return false
    }
    return true
  })

  // ---------------------------------------------------------------------------
  // Save / delete / export
  // ---------------------------------------------------------------------------

  const saveEntry = useCallback(() => {
    if (!text.trim() && !audioData) return

    const entry: JournalEntry = {
      id: Date.now().toString(),
      text: text.trim(),
      prompt: selectedPrompt?.text,
      phase: selectedPrompt?.phase ?? undefined,
      audioData: audioData ?? undefined,
      createdAt: new Date().toISOString(),
    }

    const updated = [entry, ...entries]
    setEntries(updated)
    try {
      localStorage.setItem(ENTRIES_KEY, JSON.stringify(updated))
    } catch { /* empty */ }

    setText('')
    setAudioData(null)
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }, [text, selectedPrompt, entries, audioData])

  const deleteEntry = (id: string) => {
    const updated = entries.filter((e) => e.id !== id)
    setEntries(updated)
    try {
      localStorage.setItem(ENTRIES_KEY, JSON.stringify(updated))
    } catch { /* empty */ }
  }

  const exportEntries = () => {
    if (entries.length === 0) return

    const content = entries
      .map((e) => {
        const date = formatDateGroup(e.createdAt)
        const phasePart = e.phase ? ` [${phaseLabel(e.phase as Phase)}]` : ''
        const audioPart = e.audioData ? '\n[Audio note attached]\n' : ''
        return `${date}${phasePart}\n${e.prompt ? `Prompt: ${e.prompt}\n` : ''}\n${e.text}${audioPart}\n\n---\n`
      })
      .join('\n')

    const blob = new Blob(
      [`Ivor's Compass — Journal\n${'='.repeat(30)}\n\n${content}`],
      { type: 'text/plain' },
    )
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `ivors-compass-journal-${new Date().toISOString().split('T')[0]}.txt`
    a.click()
    URL.revokeObjectURL(url)
  }

  const clearAll = () => {
    if (confirm('Delete all journal entries? This cannot be undone.')) {
      setEntries([])
      try {
        localStorage.removeItem(ENTRIES_KEY)
      } catch { /* empty */ }
    }
  }

  // ---------------------------------------------------------------------------
  // Mood check-in
  // ---------------------------------------------------------------------------

  const completeMoodCheckin = () => {
    const phase = moodToPhase(moodValue)
    setActivePhase(phase)
    setPhaseFilter(phase)
    setShowMoodCheckin(false)
    try {
      localStorage.setItem(
        MOOD_KEY,
        JSON.stringify({ date: new Date().toISOString().split('T')[0], value: moodValue }),
      )
    } catch { /* empty */ }
  }

  const skipMoodCheckin = () => {
    setShowMoodCheckin(false)
  }

  // ---------------------------------------------------------------------------
  // Speech Recognition (voice-to-text)
  // ---------------------------------------------------------------------------

  const toggleListening = useCallback(() => {
    if (isListening && recognitionRef.current) {
      recognitionRef.current.stop()
      setIsListening(false)
      return
    }

    const SRClass = getSpeechRecognition()
    if (!SRClass) return

    const recognition = new SRClass()
    recognition.continuous = true
    recognition.interimResults = false
    recognition.lang = 'en-GB'

    recognition.onresult = (event: SpeechRecognitionEvent) => {
      let transcript = ''
      for (let i = event.resultIndex; i < event.results.length; i++) {
        if (event.results[i].isFinal) {
          transcript += event.results[i][0].transcript
        }
      }
      if (transcript) {
        setText((prev) => (prev ? prev + ' ' + transcript : transcript))
      }
    }

    recognition.onerror = () => {
      setIsListening(false)
    }

    recognition.onend = () => {
      setIsListening(false)
    }

    recognitionRef.current = recognition
    recognition.start()
    setIsListening(true)
  }, [isListening])

  const hasSpeechRecognition = typeof window !== 'undefined' && !!getSpeechRecognition()

  // ---------------------------------------------------------------------------
  // Audio Recording (MediaRecorder)
  // ---------------------------------------------------------------------------

  const startRecording = useCallback(async () => {
    if (!navigator.mediaDevices?.getUserMedia) return

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      const recorder = new MediaRecorder(stream)
      audioChunksRef.current = []

      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) audioChunksRef.current.push(e.data)
      }

      recorder.onstop = () => {
        const blob = new Blob(audioChunksRef.current, { type: 'audio/webm' })
        const reader = new FileReader()
        reader.onloadend = () => {
          if (typeof reader.result === 'string') {
            setAudioData(reader.result)
          }
        }
        reader.readAsDataURL(blob)

        // Stop all tracks
        stream.getTracks().forEach((t) => t.stop())
      }

      mediaRecorderRef.current = recorder
      recorder.start()
      setIsRecording(true)
      setRecordingSeconds(0)

      // Timer
      recordingTimerRef.current = setInterval(() => {
        setRecordingSeconds((s) => {
          if (s >= MAX_AUDIO_MS / 1000 - 1) {
            stopRecording()
            return s
          }
          return s + 1
        })
      }, 1000)
    } catch {
      // Permission denied or not available
    }
  }, [])

  const stopRecording = useCallback(() => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      mediaRecorderRef.current.stop()
    }
    if (recordingTimerRef.current) {
      clearInterval(recordingTimerRef.current)
      recordingTimerRef.current = null
    }
    setIsRecording(false)
  }, [])

  const removeAudio = () => {
    setAudioData(null)
    setRecordingSeconds(0)
  }

  const hasMediaRecorder =
    typeof navigator !== 'undefined' && !!navigator.mediaDevices?.getUserMedia

  // ---------------------------------------------------------------------------
  // Phase-adaptive background gradient
  // ---------------------------------------------------------------------------

  const bgGradient = activePhase
    ? `linear-gradient(180deg, ${PHASE_COLORS[activePhase]}08 0%, transparent 40%)`
    : undefined

  // ---------------------------------------------------------------------------
  // Render: Mood Check-in
  // ---------------------------------------------------------------------------

  if (showMoodCheckin) {
    const suggestedPhase = moodToPhase(moodValue)
    const suggestedColor = PHASE_COLORS[suggestedPhase]

    return (
      <div className="space-y-8 animate-fade-in py-4">
        <div className="text-center">
          <h1 className="font-heritage text-2xl text-white mb-2">Radiance Check-in</h1>
          <p className="text-text-muted text-sm">How are you feeling right now?</p>
        </div>

        <div className="bg-compass-card border border-compass-border rounded-xl p-6 space-y-6">
          {/* Labels */}
          <div className="flex justify-between text-xs text-text-muted/60">
            <span>Low Energy / Need Grounding</span>
            <span>High Energy / Ready to Celebrate</span>
          </div>

          {/* Slider */}
          <div className="relative">
            <input
              type="range"
              min={0}
              max={100}
              value={moodValue}
              onChange={(e) => setMoodValue(parseInt(e.target.value, 10))}
              className="w-full h-2 rounded-lg appearance-none cursor-pointer"
              style={{
                background: `linear-gradient(to right, ${PHASE_COLORS.identity}, ${PHASE_COLORS.resistance}, ${PHASE_COLORS.connection}, ${PHASE_COLORS.joy})`,
                accentColor: suggestedColor,
              }}
            />
          </div>

          {/* Phase suggestion */}
          <div
            className="text-center p-4 rounded-lg border"
            style={{
              borderColor: suggestedColor + '40',
              backgroundColor: suggestedColor + '10',
            }}
          >
            <p className="text-xs text-text-muted/60 mb-1">Suggested phase</p>
            <p className="text-sm font-medium text-white">
              {phaseConfig[suggestedPhase].label}
            </p>
            <p className="text-xs text-text-muted mt-1">
              {phaseConfig[suggestedPhase].description}
            </p>
          </div>

          {/* Affirmation preview */}
          <p
            className="text-sm italic leading-relaxed text-center"
            style={{ color: suggestedColor + 'CC' }}
          >
            "{phaseAffirmations[suggestedPhase]}"
          </p>
        </div>

        <div className="flex flex-col gap-3">
          <button
            onClick={completeMoodCheckin}
            className="w-full py-3 rounded-lg font-semibold text-sm text-black transition-colors"
            style={{ backgroundColor: suggestedColor }}
          >
            Begin with {phaseConfig[suggestedPhase].label}
          </button>
          <button
            onClick={skipMoodCheckin}
            className="w-full py-2 text-text-muted/40 text-xs hover:text-text-muted transition-colors"
          >
            Skip — I know what I want to write about
          </button>
        </div>
      </div>
    )
  }

  // ---------------------------------------------------------------------------
  // Render: Main journal
  // ---------------------------------------------------------------------------

  return (
    <div className="space-y-5 animate-fade-in" style={{ backgroundImage: bgGradient }}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="font-heritage text-2xl text-white">Your Journal</h1>
        <div className="flex gap-2">
          <button
            onClick={() => setView('write')}
            className={`px-3 py-1.5 rounded-lg text-xs transition-colors ${
              view === 'write'
                ? 'bg-gold-rich text-black font-medium'
                : 'bg-compass-dark text-text-muted'
            }`}
          >
            Write
          </button>
          <button
            onClick={() => setView('history')}
            className={`px-3 py-1.5 rounded-lg text-xs transition-colors ${
              view === 'history'
                ? 'bg-gold-rich text-black font-medium'
                : 'bg-compass-dark text-text-muted'
            }`}
          >
            History ({entries.length})
          </button>
        </div>
      </div>

      {/* Privacy badge */}
      <div className="flex items-center gap-2 text-text-muted/30 text-[10px]">
        <svg
          className="w-3 h-3"
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
        Private — stored only on this device, never sent anywhere
        {(audioData || isRecording) && ' (recordings too)'}
      </div>

      {view === 'write' ? (
        <div className="space-y-4">
          {/* --- Phase tabs --- */}
          {!selectedPrompt && (
            <>
              <div className="flex flex-wrap gap-1.5">
                {(
                  [
                    { key: 'all' as const, label: 'All' },
                    { key: 'identity' as const, label: 'Identity' },
                    { key: 'connection' as const, label: 'Connection' },
                    { key: 'resistance' as const, label: 'Resistance' },
                    { key: 'joy' as const, label: 'Joy' },
                    { key: 'heritage' as const, label: 'Heritage' },
                  ] as const
                ).map(({ key, label }) => {
                  const isActive = phaseFilter === key
                  const color =
                    key === 'all'
                      ? '#D4AF37'
                      : key === 'heritage'
                        ? '#D4AF37'
                        : PHASE_COLORS[key]

                  return (
                    <button
                      key={key}
                      onClick={() => setPhaseFilter(key)}
                      className="px-3 py-1.5 rounded-full text-xs transition-colors"
                      style={
                        isActive
                          ? { backgroundColor: color + '25', color, borderColor: color + '40', borderWidth: 1 }
                          : { backgroundColor: 'transparent', color: '#9CA3AF', borderColor: '#2A2A2A', borderWidth: 1 }
                      }
                    >
                      {label}
                    </button>
                  )
                })}
              </div>

              {/* Morning / Evening toggle */}
              <div className="flex items-center gap-3">
                <span className="text-text-muted/40 text-xs">Showing:</span>
                <button
                  onClick={() => setTimeOfDay('morning')}
                  className={`text-xs px-2.5 py-1 rounded transition-colors ${
                    timeOfDay === 'morning'
                      ? 'bg-gold-rich/15 text-gold-rich'
                      : 'text-text-muted/40 hover:text-text-muted'
                  }`}
                >
                  Morning
                </button>
                <button
                  onClick={() => setTimeOfDay('evening')}
                  className={`text-xs px-2.5 py-1 rounded transition-colors ${
                    timeOfDay === 'evening'
                      ? 'bg-gold-rich/15 text-gold-rich'
                      : 'text-text-muted/40 hover:text-text-muted'
                  }`}
                >
                  Evening
                </button>
              </div>
            </>
          )}

          {/* --- Prompt cards (browsing) --- */}
          {!selectedPrompt && (
            <div className="space-y-3">
              {filteredPrompts.length === 0 ? (
                <p className="text-text-muted/40 text-sm text-center py-8">
                  No prompts match this filter. Try another phase or time of day.
                </p>
              ) : (
                filteredPrompts.map((prompt) => {
                  const color = phaseColor(prompt.phase)
                  const isExpanded = expandedPromptId === prompt.id

                  return (
                    <div
                      key={prompt.id}
                      className="bg-compass-card border rounded-xl p-4 transition-colors"
                      style={{ borderColor: color + '20' }}
                    >
                      {/* Phase badge + chapter */}
                      <div className="flex items-center gap-2 mb-2">
                        <span
                          className="text-[10px] px-2 py-0.5 rounded-full font-medium"
                          style={{ backgroundColor: color + '20', color }}
                        >
                          {phaseLabel(prompt.phase)}
                        </span>
                        {prompt.heritageChapter && (
                          <span className="text-[10px] text-text-muted/30">
                            Ch. {prompt.heritageChapter}: {heritageChapters[prompt.heritageChapter]}
                          </span>
                        )}
                      </div>

                      {/* Prompt text */}
                      <p className="text-white text-sm leading-relaxed mb-2">
                        {prompt.text}
                      </p>

                      {/* Intended outcome */}
                      <p className="text-text-muted/40 text-xs mb-3">{prompt.intendedOutcome}</p>

                      {/* Follow-ups (expandable) */}
                      {prompt.followUps.length > 0 && (
                        <>
                          <button
                            onClick={() => setExpandedPromptId(isExpanded ? null : prompt.id)}
                            className="text-xs text-text-muted/50 hover:text-text-muted transition-colors mb-2"
                          >
                            {isExpanded ? 'Hide' : 'Go deeper'} ({prompt.followUps.length})
                          </button>
                          {isExpanded && (
                            <div className="pl-3 border-l space-y-1.5 mb-3" style={{ borderColor: color + '20' }}>
                              {prompt.followUps.map((fu, i) => (
                                <p key={i} className="text-text-muted/50 text-xs italic leading-relaxed">
                                  {fu}
                                </p>
                              ))}
                            </div>
                          )}
                        </>
                      )}

                      {/* Write button */}
                      <button
                        onClick={() => {
                          setSelectedPrompt(prompt)
                          setShowFollowUps(false)
                          if (prompt.phase) setActivePhase(prompt.phase)
                        }}
                        className="text-xs font-medium transition-colors"
                        style={{ color }}
                      >
                        Write on this prompt
                      </button>
                    </div>
                  )
                })
              )}
            </div>
          )}

          {/* --- Writing area (prompt selected) --- */}
          {selectedPrompt && (
            <div className="space-y-4">
              {/* Active prompt */}
              <div
                className="bg-compass-card border rounded-xl p-5"
                style={{ borderColor: phaseColor(selectedPrompt.phase) + '30' }}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1">
                    {/* Phase + chapter context */}
                    <div className="flex items-center gap-2 mb-2">
                      <span
                        className="text-[10px] px-2 py-0.5 rounded-full font-medium"
                        style={{
                          backgroundColor: phaseColor(selectedPrompt.phase) + '20',
                          color: phaseColor(selectedPrompt.phase),
                        }}
                      >
                        {phaseLabel(selectedPrompt.phase)}
                      </span>
                      {selectedPrompt.heritageChapter && (
                        <span className="text-[10px] text-text-muted/30">
                          Ch. {selectedPrompt.heritageChapter}
                        </span>
                      )}
                    </div>

                    <p
                      className="text-sm leading-relaxed italic"
                      style={{ color: phaseColor(selectedPrompt.phase) + 'CC' }}
                    >
                      "{selectedPrompt.text}"
                    </p>

                    {/* Intended outcome */}
                    {selectedPrompt.intendedOutcome && (
                      <p className="text-text-muted/30 text-xs mt-2">
                        {selectedPrompt.intendedOutcome}
                      </p>
                    )}
                  </div>

                  {/* Back to prompts */}
                  {!urlPrompt && (
                    <button
                      onClick={() => {
                        setSelectedPrompt(null)
                        setShowFollowUps(false)
                      }}
                      className="text-text-muted/30 hover:text-text-muted transition-colors flex-shrink-0"
                      aria-label="Choose a different prompt"
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
                          d="M6 18L18 6M6 6l12 12"
                        />
                      </svg>
                    </button>
                  )}
                </div>

                {/* Follow-up questions */}
                {selectedPrompt.followUps.length > 0 && (
                  <div className="mt-3">
                    <button
                      onClick={() => setShowFollowUps(!showFollowUps)}
                      className="text-xs text-text-muted/40 hover:text-text-muted transition-colors"
                    >
                      {showFollowUps ? 'Hide follow-ups' : 'Go deeper'}
                    </button>
                    {showFollowUps && (
                      <div
                        className="mt-2 pl-3 border-l space-y-1.5"
                        style={{ borderColor: phaseColor(selectedPrompt.phase) + '20' }}
                      >
                        {selectedPrompt.followUps.map((fu, i) => (
                          <p
                            key={i}
                            className="text-text-muted/50 text-xs italic leading-relaxed"
                          >
                            {fu}
                          </p>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Textarea + voice controls */}
              <div className="relative">
                <textarea
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  placeholder="Write freely. This is your space."
                  className="w-full min-h-[250px] bg-compass-dark border border-compass-border rounded-xl p-5 pr-12 text-white text-sm leading-relaxed placeholder-text-muted/20 resize-none focus:outline-none transition-colors"
                  style={{
                    borderColor: text.length > 0 ? phaseColor(selectedPrompt.phase) + '30' : undefined,
                  }}
                />

                {/* Voice input button */}
                {hasSpeechRecognition && (
                  <button
                    onClick={toggleListening}
                    className={`absolute top-3 right-3 p-2 rounded-lg transition-all ${
                      isListening
                        ? 'bg-red-500/20 text-red-400'
                        : 'text-text-muted/30 hover:text-text-muted/60'
                    }`}
                    aria-label={isListening ? 'Stop voice input' : 'Start voice input'}
                    title={isListening ? 'Stop voice input' : 'Speak to write'}
                  >
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M12 18.75a6 6 0 006-6v-1.5m-6 7.5a6 6 0 01-6-6v-1.5m6 7.5v3.75m-3.75 0h7.5M12 15.75a3 3 0 01-3-3V4.5a3 3 0 116 0v8.25a3 3 0 01-3 3z"
                      />
                    </svg>
                    {isListening && (
                      <span className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 bg-red-400 rounded-full animate-pulse-gold" />
                    )}
                  </button>
                )}
              </div>

              {/* Listening indicator */}
              {isListening && (
                <p className="text-red-400/60 text-xs flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 bg-red-400 rounded-full animate-pulse-gold" />
                  Listening — speak now
                </p>
              )}

              {/* Audio recording controls */}
              {hasMediaRecorder && (
                <div className="flex items-center gap-3">
                  {!isRecording && !audioData && (
                    <button
                      onClick={startRecording}
                      className="flex items-center gap-2 text-xs text-text-muted/40 hover:text-text-muted transition-colors"
                    >
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M19.114 5.636a9 9 0 010 12.728M16.463 8.288a5.25 5.25 0 010 7.424M6.75 8.25l4.72-4.72a.75.75 0 011.28.53v15.88a.75.75 0 01-1.28.53l-4.72-4.72H4.51c-.88 0-1.704-.507-1.938-1.354A9.01 9.01 0 012.25 12c0-.83.112-1.633.322-2.396C2.806 8.756 3.63 8.25 4.51 8.25H6.75z"
                        />
                      </svg>
                      Record audio note (max 2 min)
                    </button>
                  )}

                  {isRecording && (
                    <div className="flex items-center gap-3">
                      <button
                        onClick={stopRecording}
                        className="flex items-center gap-2 text-xs text-red-400 hover:text-red-300 transition-colors"
                      >
                        <span className="w-3 h-3 bg-red-400 rounded-sm" />
                        Stop recording
                      </button>
                      <span className="text-text-muted/40 text-xs tabular-nums">
                        {Math.floor(recordingSeconds / 60)}:{(recordingSeconds % 60).toString().padStart(2, '0')}
                        {' / 2:00'}
                      </span>
                    </div>
                  )}

                  {audioData && !isRecording && (
                    <div className="flex items-center gap-3 w-full">
                      <audio src={audioData} controls className="h-8 flex-1" style={{ maxWidth: '100%' }} />
                      <button
                        onClick={removeAudio}
                        className="text-text-muted/30 hover:text-red-400 transition-colors text-xs flex-shrink-0"
                      >
                        Remove
                      </button>
                    </div>
                  )}
                </div>
              )}

              {/* Speech recognition not supported notice */}
              {!hasSpeechRecognition && !hasMediaRecorder && (
                <p className="text-text-muted/20 text-xs">
                  Voice input not supported in this browser.
                </p>
              )}

              {/* Word count + save */}
              <div className="flex items-center justify-between">
                <span className="text-text-muted/20 text-xs">
                  {text.length > 0 ? `${wordCount(text)} words` : ''}
                </span>
                <button
                  onClick={saveEntry}
                  disabled={!text.trim() && !audioData}
                  className="px-5 py-2.5 text-black font-semibold text-sm rounded-lg transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                  style={{
                    backgroundColor: saved ? '#22c55e' : (phaseColor(selectedPrompt.phase)),
                  }}
                >
                  {saved ? 'Saved' : 'Save Entry'}
                </button>
              </div>
            </div>
          )}
        </div>
      ) : (
        /* --- History view --- */
        <div className="space-y-4">
          {entries.length === 0 ? (
            <div className="text-center py-16">
              <p className="text-text-muted/40 text-sm">No entries yet</p>
              <button
                onClick={() => setView('write')}
                className="text-gold-rich text-sm mt-2"
              >
                Start writing
              </button>
            </div>
          ) : (
            <>
              {Object.entries(groupByDate(entries)).map(([dateKey, dayEntries]) => (
                <div key={dateKey} className="space-y-3">
                  {/* Date group header */}
                  <h3 className="text-text-muted/40 text-xs font-medium pt-2">
                    {formatDateGroup(dayEntries[0].createdAt)}
                  </h3>

                  {dayEntries.map((entry) => {
                    const entryColor = entry.phase
                      ? PHASE_COLORS[entry.phase as Phase] ?? '#D4AF37'
                      : '#D4AF37'

                    return (
                      <div
                        key={entry.id}
                        className="bg-compass-dark border border-compass-border rounded-xl p-5"
                      >
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center gap-2">
                            <span className="text-text-muted/40 text-xs">
                              {formatDate(entry.createdAt)}
                            </span>
                            {entry.phase && (
                              <span
                                className="text-[10px] px-2 py-0.5 rounded-full"
                                style={{
                                  backgroundColor: entryColor + '20',
                                  color: entryColor,
                                }}
                              >
                                {phaseLabel(entry.phase as Phase)}
                              </span>
                            )}
                          </div>
                          <button
                            onClick={() => deleteEntry(entry.id)}
                            className="text-text-muted/20 hover:text-red-400 transition-colors text-xs"
                          >
                            Delete
                          </button>
                        </div>

                        {entry.prompt && (
                          <p
                            className="text-xs italic mb-2"
                            style={{ color: entryColor + '66' }}
                          >
                            "{entry.prompt}"
                          </p>
                        )}

                        {entry.text && (
                          <p className="text-text-muted text-sm leading-relaxed whitespace-pre-wrap">
                            {entry.text}
                          </p>
                        )}

                        {/* Audio playback */}
                        {entry.audioData && (
                          <div className="mt-3 pt-3 border-t border-compass-border">
                            <p className="text-text-muted/30 text-[10px] mb-1.5">Audio note</p>
                            <audio src={entry.audioData} controls className="h-8 w-full" />
                          </div>
                        )}
                      </div>
                    )
                  })}
                </div>
              ))}

              {/* Export / Clear */}
              <div className="flex items-center justify-between pt-4 border-t border-compass-border">
                <button
                  onClick={exportEntries}
                  className="text-gold-rich text-xs hover:text-gold transition-colors flex items-center gap-1.5"
                >
                  <svg
                    className="w-3.5 h-3.5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth="1.5"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3"
                    />
                  </svg>
                  Export as text file
                </button>
                <button
                  onClick={clearAll}
                  className="text-text-muted/30 text-xs hover:text-red-400 transition-colors"
                >
                  Delete all
                </button>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  )
}
