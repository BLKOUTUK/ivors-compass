import { useState, useEffect, useMemo, useRef, useCallback } from 'react'
import { useSearchParams } from 'react-router-dom'
import { PrivacyLock } from '../components/ui'
import {
  chapters,
  courseExercises,
  getChapter,
  getExercisesForChapter,
  EXERCISES_PER_CHAPTER,
  type Exercise,
  type ChapterId,
  type GuidedExercise,
  type FreeExercise,
} from '../data/journalCourse'
import { howToGuides, guideForType, type HowToGuide } from '../data/howToGuides'

// ----------------------------------------------------------------------------
// Types & storage
// ----------------------------------------------------------------------------

interface CourseEntry {
  exerciseId: string
  text: string
  audioData?: string
  moodArrival?: number // 1-5 at start of exercise
  createdAt: string
}

const ENTRIES_KEY = 'ivors-compass-course-entries'
const PROGRESS_KEY = 'ivors-compass-course-progress'

function loadEntries(): CourseEntry[] {
  try {
    const raw = localStorage.getItem(ENTRIES_KEY)
    return raw ? (JSON.parse(raw) as CourseEntry[]) : []
  } catch {
    return []
  }
}

function saveEntries(entries: CourseEntry[]) {
  try {
    localStorage.setItem(ENTRIES_KEY, JSON.stringify(entries))
  } catch {
    /* quota exceeded — handled silently */
  }
}

interface Progress {
  currentExerciseId: string
  completedIds: string[]
}

function loadProgress(): Progress {
  try {
    const raw = localStorage.getItem(PROGRESS_KEY)
    if (raw) return JSON.parse(raw) as Progress
  } catch {
    /* empty */
  }
  return { currentExerciseId: courseExercises[0].id, completedIds: [] }
}

function saveProgress(progress: Progress) {
  try {
    localStorage.setItem(PROGRESS_KEY, JSON.stringify(progress))
  } catch {
    /* empty */
  }
}

// ----------------------------------------------------------------------------
// Speech recognition (Web Speech API, where supported)
// ----------------------------------------------------------------------------

interface SpeechRecognitionEvent {
  results: SpeechRecognitionResultList
  resultIndex: number
}

interface SpeechRecognitionInstance extends EventTarget {
  lang: string
  continuous: boolean
  interimResults: boolean
  start: () => void
  stop: () => void
  onresult: ((event: SpeechRecognitionEvent) => void) | null
  onerror: ((event: Event) => void) | null
  onend: (() => void) | null
}

function getSpeechRecognitionCtor(): (new () => SpeechRecognitionInstance) | null {
  if (typeof window === 'undefined') return null
  const w = window as unknown as {
    SpeechRecognition?: new () => SpeechRecognitionInstance
    webkitSpeechRecognition?: new () => SpeechRecognitionInstance
  }
  return (w.SpeechRecognition ?? w.webkitSpeechRecognition ?? null) as
    | (new () => SpeechRecognitionInstance)
    | null
}

// ----------------------------------------------------------------------------
// Mood options (matching the existing mood tracker)
// ----------------------------------------------------------------------------

const MOOD_OPTIONS = [
  { level: 1, label: 'Hollow', emoji: '○', color: '#6B7280' },
  { level: 2, label: 'Quiet', emoji: '◐', color: '#A67C52' },
  { level: 3, label: 'Holding', emoji: '●', color: '#D4AF37' },
  { level: 4, label: 'Warm', emoji: '◉', color: '#D97706' },
  { level: 5, label: 'Radiant', emoji: '★', color: '#F59E0B' },
] as const

// ----------------------------------------------------------------------------
// Main component
// ----------------------------------------------------------------------------

type View = 'welcome' | 'chapter-intro' | 'exercise' | 'chapter-review' | 'complete' | 'archive' | 'howto-list' | 'howto-detail'

export default function JournalPageV2() {
  const [searchParams] = useSearchParams()
  const [entries, setEntries] = useState<CourseEntry[]>(loadEntries)
  const [progress, setProgress] = useState<Progress>(loadProgress)
  const [view, setView] = useState<View>(() => {
    // If a specific exercise is requested via ?exercise=
    const exId = searchParams.get('exercise')
    if (exId && courseExercises.some((e) => e.id === exId)) return 'exercise'
    // If user has no entries and no progress, show welcome
    const existing = loadEntries()
    const prog = loadProgress()
    if (existing.length === 0 && prog.completedIds.length === 0) return 'welcome'
    return 'exercise'
  })
  const [activeExerciseId, setActiveExerciseId] = useState<string>(() => {
    const exId = searchParams.get('exercise')
    if (exId && courseExercises.some((e) => e.id === exId)) return exId
    return loadProgress().currentExerciseId
  })
  const [viewingGuide, setViewingGuide] = useState<HowToGuide | null>(null)
  const [chapterIntroId, setChapterIntroId] = useState<ChapterId | null>(null)

  // Save progress whenever it changes
  useEffect(() => {
    saveProgress(progress)
  }, [progress])

  // ---- Chapter + exercise helpers ----
  const activeExercise = useMemo<Exercise | null>(
    () => courseExercises.find((e) => e.id === activeExerciseId) ?? null,
    [activeExerciseId],
  )
  const activeChapter = activeExercise ? getChapter(activeExercise.chapter) ?? null : null
  // ---- Navigation ----
  const openExercise = useCallback((exerciseId: string) => {
    setActiveExerciseId(exerciseId)
    setView('exercise')
  }, [])

  const openChapter = useCallback((chapterId: ChapterId) => {
    setChapterIntroId(chapterId)
    setView('chapter-intro')
  }, [])

  const startChapter = useCallback((chapterId: ChapterId) => {
    const first = getExercisesForChapter(chapterId)[0]
    if (first) {
      openExercise(first.id)
    }
  }, [openExercise])

  const completeExercise = useCallback(
    (exerciseId: string, entry: CourseEntry) => {
      const newEntries = [...entries.filter((e) => e.exerciseId !== exerciseId), entry]
      setEntries(newEntries)
      saveEntries(newEntries)

      // Mark as completed + advance
      const alreadyCompleted = progress.completedIds.includes(exerciseId)
      const newCompleted = alreadyCompleted
        ? progress.completedIds
        : [...progress.completedIds, exerciseId]

      const nextIndex = courseExercises.findIndex((e) => e.id === exerciseId) + 1
      const nextExercise = courseExercises[nextIndex]

      if (!nextExercise) {
        // Course complete
        setProgress({ currentExerciseId: exerciseId, completedIds: newCompleted })
        setView('complete')
        return
      }

      // If this was the last exercise of a chapter, show chapter review first
      const currentChapter = courseExercises[nextIndex - 1].chapter
      const nextChapterDifferent = nextExercise.chapter !== currentChapter
      if (nextChapterDifferent) {
        setProgress({ currentExerciseId: nextExercise.id, completedIds: newCompleted })
        // Jump to chapter-review landing for the completed chapter
        setActiveExerciseId(exerciseId)
        setView('chapter-review')
        return
      }

      setProgress({ currentExerciseId: nextExercise.id, completedIds: newCompleted })
      setActiveExerciseId(nextExercise.id)
      setView('exercise')
    },
    [entries, progress],
  )

  // ---- Render ----
  return (
    <div className="space-y-5 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between gap-3">
        <button
          onClick={() => setView('exercise')}
          className="font-heritage text-2xl text-white title-underline text-left"
          style={{ '--accent-color': 'var(--color-gold)' } as React.CSSProperties}
        >
          Your Journal
        </button>
        <div className="flex gap-2">
          <button
            onClick={() => setView('archive')}
            className={`px-3 py-1.5 rounded-lg text-xs transition-colors ${
              view === 'archive' ? 'bg-gold-rich text-black font-medium' : 'bg-compass-dark text-text-muted'
            }`}
          >
            Your writing
          </button>
          <button
            onClick={() => setView('howto-list')}
            className={`px-3 py-1.5 rounded-lg text-xs transition-colors ${
              view === 'howto-list' || view === 'howto-detail' ? 'bg-gold-rich text-black font-medium' : 'bg-compass-dark text-text-muted'
            }`}
          >
            Guides
          </button>
        </div>
      </div>

      <PrivacyLock />

      {/* Progress bar */}
      {view !== 'welcome' && (
        <ProgressBar
          completedIds={progress.completedIds}
          currentChapter={activeExercise?.chapter ?? null}
        />
      )}

      {view === 'welcome' && <WelcomeScreen onBegin={() => openChapter('home')} />}

      {view === 'chapter-intro' && chapterIntroId && (
        <ChapterIntroScreen
          chapterId={chapterIntroId}
          onBegin={() => {
            startChapter(chapterIntroId)
            setChapterIntroId(null)
          }}
          onBack={() => setView('exercise')}
        />
      )}

      {view === 'exercise' && activeExercise && activeChapter && (
        <ExerciseView
          key={activeExercise.id}
          exercise={activeExercise}
          chapter={activeChapter}
          existingEntry={entries.find((e) => e.exerciseId === activeExercise.id)}
          onComplete={(entry) => completeExercise(activeExercise.id, entry)}
          onOpenGuide={(id) => {
            const g = howToGuides.find((guide) => guide.id === id)
            if (g) {
              setViewingGuide(g)
              setView('howto-detail')
            }
          }}
          onJumpToExercise={(id) => openExercise(id)}
          allChapters={chapters}
          completedIds={progress.completedIds}
        />
      )}

      {view === 'chapter-review' && activeExercise && (
        <ChapterReviewScreen
          chapter={getChapter(activeExercise.chapter)!}
          entries={entries.filter((e) => {
            const ex = courseExercises.find((c) => c.id === e.exerciseId)
            return ex?.chapter === activeExercise.chapter
          })}
          onContinue={() => {
            const nextId = progress.currentExerciseId
            setActiveExerciseId(nextId)
            setView('exercise')
          }}
        />
      )}

      {view === 'complete' && <CourseCompleteScreen entries={entries} />}

      {view === 'archive' && (
        <ArchiveView
          entries={entries}
          onOpen={(exerciseId) => openExercise(exerciseId)}
          onBack={() => setView('exercise')}
        />
      )}

      {view === 'howto-list' && (
        <HowToListView
          onOpen={(g) => {
            setViewingGuide(g)
            setView('howto-detail')
          }}
        />
      )}

      {view === 'howto-detail' && viewingGuide && (
        <HowToDetailView guide={viewingGuide} onBack={() => setView('howto-list')} />
      )}

      {/* Fallback: link back to classic journal if everything breaks */}
      {view === 'welcome' && (
        <div className="pt-8 text-center">
          <a
            href="/compass/journal?classic=1"
            className="text-[11px] text-text-muted/40 underline"
          >
            Use the classic journal
          </a>
        </div>
      )}
    </div>
  )
}

// ----------------------------------------------------------------------------
// Subcomponents
// ----------------------------------------------------------------------------

function ProgressBar({
  completedIds,
  currentChapter,
}: {
  completedIds: string[]
  currentChapter: ChapterId | null
}) {
  return (
    <div className="space-y-2">
      {/* Seven chapter bars in a row, each showing 10 segments */}
      <div className="flex gap-1.5">
        {chapters.map((ch) => {
          const chEx = courseExercises.filter((e) => e.chapter === ch.id)
          const done = chEx.filter((e) => completedIds.includes(e.id)).length
          const isActive = ch.id === currentChapter
          return (
            <div key={ch.id} className="flex-1 space-y-1">
              <div className="grid grid-cols-10 gap-[2px]">
                {chEx.map((ex) => {
                  const filled = completedIds.includes(ex.id)
                  return (
                    <div
                      key={ex.id}
                      className="h-2 rounded-sm transition-colors"
                      style={{
                        backgroundColor: filled
                          ? ch.colour
                          : isActive
                            ? ch.colour + '25'
                            : '#ffffff10',
                      }}
                    />
                  )
                })}
              </div>
              <div
                className="text-[9px] uppercase tracking-wider text-center transition-colors"
                style={{
                  color: isActive ? ch.colour : done === chEx.length ? ch.colour + 'aa' : '#6b7280',
                  fontWeight: isActive ? 600 : 400,
                }}
              >
                {ch.title}
              </div>
            </div>
          )
        })}
      </div>

      {/* Current-chapter status line */}
      {currentChapter && (() => {
        const ch = getChapter(currentChapter)
        if (!ch) return null
        const chEx = courseExercises.filter((e) => e.chapter === currentChapter)
        const done = chEx.filter((e) => completedIds.includes(e.id)).length
        const remaining = chEx.length - done
        return (
          <div className="text-[11px] text-text-muted text-center">
            {remaining === 0
              ? `${ch.title} complete`
              : `${remaining} ${remaining === 1 ? 'exercise' : 'exercises'} left in ${ch.title}`}
          </div>
        )
      })()}
    </div>
  )
}

function WelcomeScreen({ onBegin }: { onBegin: () => void }) {
  return (
    <div className="space-y-6 py-8 text-center">
      <h2 className="font-heritage text-3xl text-white">Welcome</h2>
      <p className="text-text-muted max-w-md mx-auto leading-relaxed">
        A seven-chapter course through Ivor's life and your own. Seventy
        exercises — some guided, some open space for your own reflection,
        gratitude, intentions, and letters.
      </p>
      <p className="text-text-muted/70 text-sm max-w-md mx-auto leading-relaxed">
        Take as long as you need. There are no streaks. No catch-up. Start
        where you are and come back when you can.
      </p>
      <div className="pt-4">
        <button
          onClick={onBegin}
          className="px-8 py-3 rounded-xl bg-gold-rich text-black font-semibold hover:bg-gold transition-colors"
        >
          Begin Chapter 1 — HOME
        </button>
      </div>
    </div>
  )
}

function ChapterIntroScreen({
  chapterId,
  onBegin,
  onBack,
}: {
  chapterId: ChapterId
  onBegin: () => void
  onBack: () => void
}) {
  const chapter = getChapter(chapterId)
  if (!chapter) return null
  return (
    <div className="space-y-6 py-6">
      <div className="text-center space-y-2">
        <div className="text-xs text-text-muted uppercase tracking-wider">Chapter {chapter.order} of 7</div>
        <h2 className="font-heritage text-3xl" style={{ color: chapter.colour }}>
          {chapter.title}
        </h2>
        <div className="text-text-muted italic">{chapter.theme}</div>
      </div>

      <div
        className="p-5 rounded-xl border leading-relaxed text-text-muted text-sm"
        style={{ borderColor: chapter.colour + '40', backgroundColor: chapter.colour + '0a' }}
      >
        {chapter.story}
      </div>

      <div className="text-center space-y-3">
        <button
          onClick={onBegin}
          className="px-8 py-3 rounded-xl bg-gold-rich text-black font-semibold hover:bg-gold transition-colors"
        >
          Begin chapter
        </button>
        <div>
          <button onClick={onBack} className="text-xs text-text-muted/60 underline">
            Back
          </button>
        </div>
      </div>
    </div>
  )
}

function ExerciseView({
  exercise,
  chapter,
  existingEntry,
  onComplete,
  onOpenGuide,
  onJumpToExercise,
  allChapters,
  completedIds,
}: {
  exercise: Exercise
  chapter: ReturnType<typeof getChapter>
  existingEntry?: CourseEntry
  onComplete: (entry: CourseEntry) => void
  onOpenGuide: (id: string) => void
  onJumpToExercise: (id: string) => void
  allChapters: typeof chapters
  completedIds: string[]
}) {
  if (!chapter) return null

  const [mood, setMood] = useState<number | null>(existingEntry?.moodArrival ?? null)
  const [showingMood, setShowingMood] = useState<boolean>(!existingEntry)
  const [text, setText] = useState<string>(existingEntry?.text ?? '')
  const [isRecording, setIsRecording] = useState(false)
  const recognitionRef = useRef<SpeechRecognitionInstance | null>(null)
  const [speechSupported] = useState<boolean>(() => getSpeechRecognitionCtor() !== null)
  const [showStoryRefresher, setShowStoryRefresher] = useState(false)

  const startVoice = useCallback(() => {
    const Ctor = getSpeechRecognitionCtor()
    if (!Ctor) return
    const rec = new Ctor()
    rec.lang = 'en-GB'
    rec.continuous = true
    rec.interimResults = true

    let finalText = text
    rec.onresult = (event) => {
      let interim = ''
      let finalPart = ''
      for (let i = event.resultIndex; i < event.results.length; i++) {
        const r = event.results[i]
        if (r.isFinal) finalPart += r[0].transcript
        else interim += r[0].transcript
      }
      if (finalPart) {
        finalText = (finalText + ' ' + finalPart).trim()
        setText(finalText)
      } else if (interim) {
        setText((finalText + ' ' + interim).trim())
      }
    }
    rec.onerror = () => setIsRecording(false)
    rec.onend = () => setIsRecording(false)

    rec.start()
    recognitionRef.current = rec
    setIsRecording(true)
  }, [text])

  const stopVoice = useCallback(() => {
    recognitionRef.current?.stop()
    setIsRecording(false)
  }, [])

  const handleSave = () => {
    if (!text.trim()) return
    const entry: CourseEntry = {
      exerciseId: exercise.id,
      text: text.trim(),
      moodArrival: mood ?? undefined,
      createdAt: existingEntry?.createdAt ?? new Date().toISOString(),
    }
    onComplete(entry)
  }

  const isGuided = exercise.type === 'guided'
  const guided = isGuided ? (exercise as GuidedExercise) : null
  const free = !isGuided ? (exercise as FreeExercise) : null
  const guide = free ? guideForType(free.type) : null

  const exercisesInChapter = courseExercises.filter((e) => e.chapter === exercise.chapter)
  const indexInChapter = exercisesInChapter.findIndex((e) => e.id === exercise.id)

  return (
    <div className="space-y-5">
      {/* Chapter header */}
      <div
        className="flex items-center justify-between px-4 py-3 rounded-xl border"
        style={{ borderColor: chapter.colour + '40', backgroundColor: chapter.colour + '0a' }}
      >
        <div>
          <div className="text-[11px] uppercase tracking-wider" style={{ color: chapter.colour }}>
            Chapter {chapter.order} — {chapter.theme}
          </div>
          <div className="font-heritage text-lg text-white">{chapter.title}</div>
        </div>
        <div className="text-xs text-text-muted">
          {indexInChapter + 1} / {EXERCISES_PER_CHAPTER}
        </div>
      </div>

      {/* Story refresher (collapsed by default, except on session 1) */}
      {(exercise.indexInChapter === 0 || showStoryRefresher) ? (
        <div
          className="p-4 rounded-xl border text-sm text-text-muted leading-relaxed"
          style={{ borderColor: chapter.colour + '30', backgroundColor: chapter.colour + '08' }}
        >
          {chapter.story}
          {exercise.indexInChapter !== 0 && (
            <button
              onClick={() => setShowStoryRefresher(false)}
              className="block mt-3 text-[11px] text-text-muted/60 underline"
            >
              Hide
            </button>
          )}
        </div>
      ) : (
        <button
          onClick={() => setShowStoryRefresher(true)}
          className="text-[11px] text-text-muted/60 underline"
        >
          Remind me about this chapter
        </button>
      )}

      {/* Mood check-in — "How are you arriving?" */}
      {showingMood && (
        <div className="p-4 rounded-xl bg-compass-card border border-compass-border space-y-3">
          <div className="text-sm text-white">How are you arriving?</div>
          <div className="flex gap-2 justify-between">
            {MOOD_OPTIONS.map((opt) => (
              <button
                key={opt.level}
                onClick={() => {
                  setMood(opt.level)
                  setTimeout(() => setShowingMood(false), 300)
                }}
                className={`flex-1 py-3 rounded-lg border transition-all text-center ${
                  mood === opt.level ? 'scale-105' : 'hover:scale-[1.02]'
                }`}
                style={{
                  borderColor: mood === opt.level ? opt.color : '#ffffff15',
                  backgroundColor: mood === opt.level ? opt.color + '25' : 'transparent',
                }}
              >
                <div className="text-lg" style={{ color: opt.color }}>
                  {opt.emoji}
                </div>
                <div className="text-[10px] text-text-muted mt-1">{opt.label}</div>
              </button>
            ))}
          </div>
          <button
            onClick={() => setShowingMood(false)}
            className="text-[11px] text-text-muted/60 underline"
          >
            Skip
          </button>
        </div>
      )}

      {/* Exercise content */}
      {!showingMood && (
        <>
          {/* Guided exercise */}
          {guided && (
            <div className="space-y-4">
              <div className="text-[11px] uppercase tracking-wider text-gold-rich">Guided</div>
              <p className="font-heritage text-xl text-white leading-relaxed">{guided.prompt}</p>

              {guided.starters && guided.starters.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {guided.starters.map((s) => (
                    <button
                      key={s}
                      onClick={() => {
                        if (!text.includes(s)) {
                          setText((prev) => (prev ? prev + '\n\n' + s + ' ' : s + ' '))
                        }
                      }}
                      className="px-3 py-1 rounded-full text-xs text-text-muted border border-compass-border hover:text-white hover:border-gold-rich/40 transition-colors"
                    >
                      {s}
                    </button>
                  ))}
                </div>
              )}

              {guided.followUps.length > 0 && (
                <details className="text-xs text-text-muted">
                  <summary className="cursor-pointer hover:text-white">Go deeper</summary>
                  <ul className="mt-2 space-y-1 pl-4">
                    {guided.followUps.map((f, i) => (
                      <li key={i} className="list-disc marker:text-gold-rich/40">
                        {f}
                      </li>
                    ))}
                  </ul>
                </details>
              )}
            </div>
          )}

          {/* Free exercise */}
          {free && guide && (
            <div className="space-y-4">
              <div className="flex items-baseline justify-between">
                <div className="text-[11px] uppercase tracking-wider text-gold-rich">{free.headline}</div>
                <button
                  onClick={() => onOpenGuide(guide.id)}
                  className="text-[11px] text-text-muted underline hover:text-white"
                >
                  How to
                </button>
              </div>
              <p className="text-base text-white leading-relaxed">{free.instruction}</p>
            </div>
          )}

          {/* Text area */}
          <div className="space-y-3">
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Start writing..."
              rows={10}
              className="w-full bg-compass-card border border-compass-border rounded-xl p-4 text-sm text-white placeholder:text-text-muted/40 focus:outline-none focus:border-gold-rich/60 transition-colors resize-none"
            />
            <div className="flex items-center justify-between">
              {speechSupported && (
                <button
                  onClick={isRecording ? stopVoice : startVoice}
                  className={`flex items-center gap-2 px-3 py-2 rounded-lg text-xs transition-colors ${
                    isRecording
                      ? 'bg-red-500/20 text-red-400 border border-red-500/40'
                      : 'bg-compass-dark text-text-muted border border-compass-border hover:text-white'
                  }`}
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"/>
                    <path d="M19 10v2a7 7 0 0 1-14 0v-2"/>
                    <line x1="12" y1="19" x2="12" y2="23"/>
                    <line x1="8" y1="23" x2="16" y2="23"/>
                  </svg>
                  {isRecording ? 'Stop' : 'Speak'}
                </button>
              )}
              <button
                onClick={handleSave}
                disabled={!text.trim()}
                className="px-6 py-2 rounded-lg bg-gold-rich text-black font-semibold text-sm disabled:opacity-30 disabled:cursor-not-allowed hover:bg-gold transition-colors"
              >
                {existingEntry ? 'Update' : 'Save and continue'}
              </button>
            </div>
          </div>
        </>
      )}

      {/* Navigation — previous completed exercises */}
      <details className="pt-4 text-xs text-text-muted">
        <summary className="cursor-pointer hover:text-white">Jump to another exercise</summary>
        <div className="mt-3 space-y-4">
          {allChapters.map((ch) => {
            const chEx = courseExercises.filter((e) => e.chapter === ch.id)
            return (
              <div key={ch.id}>
                <div className="text-[11px] uppercase tracking-wider mb-1" style={{ color: ch.colour }}>
                  {ch.title}
                </div>
                <div className="grid grid-cols-5 gap-1.5">
                  {chEx.map((ex) => {
                    const done = completedIds.includes(ex.id)
                    const isActive = ex.id === exercise.id
                    return (
                      <button
                        key={ex.id}
                        onClick={() => onJumpToExercise(ex.id)}
                        className="h-8 rounded text-[10px] font-medium transition-colors"
                        style={{
                          backgroundColor: isActive
                            ? ch.colour + '40'
                            : done
                              ? ch.colour + '15'
                              : '#ffffff06',
                          color: isActive ? ch.colour : done ? ch.colour : '#6b7280',
                          border: isActive ? `1px solid ${ch.colour}` : 'none',
                        }}
                      >
                        {ex.indexInChapter + 1}
                        {ex.type === 'guided' ? '' : '·'}
                      </button>
                    )
                  })}
                </div>
              </div>
            )
          })}
        </div>
      </details>
    </div>
  )
}

function ChapterReviewScreen({
  chapter,
  entries,
  onContinue,
}: {
  chapter: ReturnType<typeof getChapter>
  entries: CourseEntry[]
  onContinue: () => void
}) {
  if (!chapter) return null
  const moodsInChapter = entries.map((e) => e.moodArrival).filter((m): m is number => m != null)
  const avgMood = moodsInChapter.length > 0
    ? moodsInChapter.reduce((a, b) => a + b, 0) / moodsInChapter.length
    : null

  return (
    <div className="space-y-6 py-6">
      <div className="text-center space-y-2">
        <div className="text-xs text-text-muted uppercase tracking-wider">Chapter complete</div>
        <h2 className="font-heritage text-3xl" style={{ color: chapter.colour }}>
          {chapter.title}
        </h2>
        <div className="text-text-muted italic">{chapter.theme}</div>
      </div>

      <div
        className="p-6 rounded-xl border text-center"
        style={{ borderColor: chapter.colour + '60', backgroundColor: chapter.colour + '10' }}
      >
        <div className="text-[11px] uppercase tracking-wider text-text-muted mb-3">Affirmation</div>
        <p className="font-heritage text-xl leading-relaxed" style={{ color: chapter.colour }}>
          {chapter.affirmation}
        </p>
      </div>

      {avgMood !== null && (
        <div className="p-4 rounded-xl bg-compass-card border border-compass-border space-y-2">
          <div className="text-xs text-text-muted">How you arrived across this chapter</div>
          <div className="flex items-center gap-2">
            {moodsInChapter.map((m, i) => {
              const opt = MOOD_OPTIONS[m - 1]
              return (
                <div
                  key={i}
                  className="w-8 h-8 rounded-full flex items-center justify-center text-sm"
                  style={{ backgroundColor: opt.color + '25', color: opt.color }}
                  title={opt.label}
                >
                  {opt.emoji}
                </div>
              )
            })}
          </div>
        </div>
      )}

      {entries.length > 0 && (
        <div className="space-y-3">
          <div className="text-xs text-text-muted uppercase tracking-wider">Your writing in this chapter</div>
          {entries
            .sort((a, b) => a.createdAt.localeCompare(b.createdAt))
            .map((e) => (
              <div
                key={e.exerciseId}
                className="p-3 rounded-lg bg-compass-card border border-compass-border text-sm text-text-muted whitespace-pre-wrap leading-relaxed"
              >
                {e.text.slice(0, 280)}
                {e.text.length > 280 && '…'}
              </div>
            ))}
        </div>
      )}

      <div className="text-center pt-2">
        <button
          onClick={onContinue}
          className="px-8 py-3 rounded-xl bg-gold-rich text-black font-semibold hover:bg-gold transition-colors"
        >
          Continue to next chapter
        </button>
      </div>
    </div>
  )
}

function CourseCompleteScreen({ entries }: { entries: CourseEntry[] }) {
  return (
    <div className="space-y-6 py-10 text-center">
      <div className="text-xs text-text-muted uppercase tracking-wider">Course complete</div>
      <h2 className="font-heritage text-3xl text-gold-rich">You walked the whole thing</h2>
      <p className="text-text-muted max-w-md mx-auto leading-relaxed">
        Seven chapters. Seventy exercises. Your writing is here — private,
        stored on this device, yours.
      </p>
      <p className="text-text-muted/60 text-sm max-w-md mx-auto">
        {entries.length} entries saved.
      </p>
      <div className="pt-4 text-sm text-text-muted">
        Use "Your writing" above to revisit any entry.
      </div>
    </div>
  )
}

function ArchiveView({
  entries,
  onOpen,
  onBack,
}: {
  entries: CourseEntry[]
  onOpen: (exerciseId: string) => void
  onBack: () => void
}) {
  if (entries.length === 0) {
    return (
      <div className="space-y-4 py-8 text-center">
        <p className="text-text-muted">You haven't written anything yet.</p>
        <button onClick={onBack} className="text-xs text-gold-rich underline">
          Back to the course
        </button>
      </div>
    )
  }
  const byChapter: Record<string, CourseEntry[]> = {}
  for (const e of entries) {
    const ex = courseExercises.find((c) => c.id === e.exerciseId)
    if (!ex) continue
    if (!byChapter[ex.chapter]) byChapter[ex.chapter] = []
    byChapter[ex.chapter].push(e)
  }
  return (
    <div className="space-y-5">
      {chapters.map((ch) => {
        const chapterEntries = byChapter[ch.id]
        if (!chapterEntries || chapterEntries.length === 0) return null
        return (
          <div key={ch.id} className="space-y-2">
            <div className="text-[11px] uppercase tracking-wider" style={{ color: ch.colour }}>
              {ch.title} — {ch.theme}
            </div>
            {chapterEntries.map((e) => {
              const ex = courseExercises.find((c) => c.id === e.exerciseId)
              return (
                <button
                  key={e.exerciseId}
                  onClick={() => onOpen(e.exerciseId)}
                  className="w-full text-left p-3 rounded-lg bg-compass-card border border-compass-border hover:border-gold-rich/40 transition-colors"
                >
                  <div className="text-[11px] text-text-muted mb-1">
                    Exercise {(ex?.indexInChapter ?? 0) + 1}
                  </div>
                  <div className="text-sm text-text-muted line-clamp-2">
                    {e.text}
                  </div>
                </button>
              )
            })}
          </div>
        )
      })}
    </div>
  )
}

function HowToListView({ onOpen }: { onOpen: (g: HowToGuide) => void }) {
  return (
    <div className="space-y-4">
      <p className="text-sm text-text-muted">
        Short guides you can come back to whenever you need them.
      </p>
      {howToGuides.map((g) => (
        <button
          key={g.id}
          onClick={() => onOpen(g)}
          className="w-full text-left p-4 rounded-xl bg-compass-card border border-compass-border hover:border-gold-rich/40 transition-colors"
        >
          <div className="font-heritage text-lg text-white">{g.title}</div>
          <div className="text-xs text-text-muted mt-1">{g.tagline}</div>
        </button>
      ))}
    </div>
  )
}

function HowToDetailView({ guide, onBack }: { guide: HowToGuide; onBack: () => void }) {
  return (
    <div className="space-y-5">
      <button onClick={onBack} className="text-xs text-text-muted underline">
        ← Back to guides
      </button>
      <h2 className="font-heritage text-2xl text-white">{guide.title}</h2>
      <div className="text-xs text-text-muted italic">{guide.tagline}</div>
      <div
        className="text-sm text-text-muted leading-relaxed space-y-3 prose-compass"
        dangerouslySetInnerHTML={{
          __html: renderGuideMarkdown(guide.body),
        }}
      />
    </div>
  )
}

/** Very small markdown renderer — paragraphs, bold, italic, bullets. */
function renderGuideMarkdown(md: string): string {
  const lines = md.split('\n')
  const out: string[] = []
  let inList = false
  for (const line of lines) {
    const trimmed = line.trim()
    if (trimmed.startsWith('- ')) {
      if (!inList) {
        out.push('<ul class="list-disc pl-5 space-y-1 text-text-muted">')
        inList = true
      }
      out.push('<li>' + inlineFormat(trimmed.slice(2)) + '</li>')
    } else {
      if (inList) {
        out.push('</ul>')
        inList = false
      }
      if (trimmed === '') {
        out.push('')
      } else {
        out.push('<p>' + inlineFormat(trimmed) + '</p>')
      }
    }
  }
  if (inList) out.push('</ul>')
  return out.join('\n')
}

function inlineFormat(text: string): string {
  // Bold **x**
  text = text.replace(/\*\*([^*]+)\*\*/g, '<strong class="text-white">$1</strong>')
  // Italic *x*
  text = text.replace(/\*([^*]+)\*/g, '<em class="italic text-text-muted">$1</em>')
  return text
}
