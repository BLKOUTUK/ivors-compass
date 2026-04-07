import { useState, useEffect, useCallback } from 'react'
import { Link } from 'react-router-dom'
import {
  workshops,
  PHASE_COLORS,
  PHASE_LABELS,
  DIFFICULTY_LABELS,
  type Workshop,
  type WorkshopStep,
} from '../data/workshops'
import { BreathingCircle } from '../components/ui'

// ---------------------------------------------------------------------------
// Local-storage keys
// ---------------------------------------------------------------------------

const PROGRESS_KEY = 'ivors-compass-workshop-progress'

interface WorkshopProgress {
  workshopId: string
  currentStep: number
  completed: boolean
  startedAt: string
  completedAt?: string
}

type ProgressMap = Record<string, WorkshopProgress>

// ---------------------------------------------------------------------------
// Persistence helpers
// ---------------------------------------------------------------------------

function loadProgress(): ProgressMap {
  try {
    const raw = localStorage.getItem(PROGRESS_KEY)
    return raw ? (JSON.parse(raw) as ProgressMap) : {}
  } catch {
    return {}
  }
}

function saveProgress(progress: ProgressMap): void {
  try {
    localStorage.setItem(PROGRESS_KEY, JSON.stringify(progress))
  } catch {
    /* storage full — degrade gracefully */
  }
}


// ---------------------------------------------------------------------------
// Step renderer
// ---------------------------------------------------------------------------

function StepContent({
  step,
  phaseColor,
}: {
  step: WorkshopStep
  phaseColor: string
}) {
  switch (step.type) {
    case 'text':
      return (
        <div className="space-y-3">
          <p className="text-text-muted leading-relaxed text-sm">
            {step.content}
          </p>
          {step.duration && (
            <p className="text-xs text-text-muted/50 italic">
              Take about {step.duration} with this.
            </p>
          )}
        </div>
      )

    case 'prompt':
      return (
        <div
          className="rounded-xl p-5 space-y-3"
          style={{
            backgroundColor: `${phaseColor}10`,
            border: `1px solid ${phaseColor}30`,
          }}
        >
          <div className="flex items-center gap-2 mb-2">
            <svg
              className="w-4 h-4"
              style={{ color: phaseColor }}
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth="1.5"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931z"
              />
            </svg>
            <span className="text-xs font-medium" style={{ color: phaseColor }}>
              Journal Prompt
            </span>
          </div>
          <p className="text-white text-sm leading-relaxed italic">
            "{step.content}"
          </p>
          <Link
            to={`/compass/journal?prompt=${encodeURIComponent(step.content)}`}
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs transition-colors"
            style={{
              backgroundColor: `${phaseColor}15`,
              color: phaseColor,
              border: `1px solid ${phaseColor}30`,
            }}
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
                d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931z"
              />
            </svg>
            Reflect in Journal
          </Link>
        </div>
      )

    case 'breathing':
      return (
        <div className="space-y-3">
          <p className="text-text-muted leading-relaxed text-sm">
            {step.content}
          </p>
          <BreathingCircle variant="interactive" phaseColor={phaseColor} />
        </div>
      )

    case 'body-scan':
      return (
        <div
          className="rounded-xl p-5 space-y-3"
          style={{
            backgroundColor: '#1A1A1A',
            border: '1px solid #2A2A2A',
          }}
        >
          <div className="flex items-center gap-2 mb-2">
            <svg
              className="w-4 h-4 text-text-muted"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth="1.5"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z"
              />
            </svg>
            <span className="text-xs font-medium text-text-muted">
              Body Scan
            </span>
          </div>
          <p className="text-text-muted leading-relaxed text-sm">
            {step.content}
          </p>
          {step.duration && (
            <p className="text-xs text-text-muted/50 italic">
              Spend about {step.duration} here.
            </p>
          )}
        </div>
      )

    case 'affirmation':
      return (
        <div className="py-8 text-center space-y-4">
          <div
            className="w-12 h-px mx-auto"
            style={{ backgroundColor: `${phaseColor}60` }}
          />
          <p
            className="text-xl font-light leading-relaxed italic"
            style={{ color: phaseColor }}
          >
            "{step.content}"
          </p>
          <div
            className="w-12 h-px mx-auto"
            style={{ backgroundColor: `${phaseColor}60` }}
          />
        </div>
      )
  }
}

// ---------------------------------------------------------------------------
// Workshop detail (step-by-step view)
// ---------------------------------------------------------------------------

function WorkshopDetail({
  workshop,
  progress,
  onBack,
  onStepChange,
  onComplete,
}: {
  workshop: Workshop
  progress: WorkshopProgress | undefined
  onBack: () => void
  onStepChange: (workshopId: string, step: number) => void
  onComplete: (workshopId: string) => void
}) {
  const [currentStep, setCurrentStep] = useState(progress?.currentStep ?? 0)
  const phaseColor = PHASE_COLORS[workshop.phase]
  const totalSteps = workshop.steps.length
  const isLastStep = currentStep >= totalSteps - 1
  const isCompleted = progress?.completed ?? false

  const goToStep = useCallback(
    (step: number) => {
      setCurrentStep(step)
      onStepChange(workshop.id, step)
    },
    [workshop.id, onStepChange],
  )

  const handleNext = useCallback(() => {
    if (isLastStep) {
      onComplete(workshop.id)
    } else {
      goToStep(currentStep + 1)
    }
  }, [isLastStep, currentStep, workshop.id, onComplete, goToStep])

  const handlePrev = useCallback(() => {
    if (currentStep > 0) goToStep(currentStep - 1)
  }, [currentStep, goToStep])

  const step = workshop.steps[currentStep]

  return (
    <div className="animate-fade-in space-y-6">
      {/* Back button */}
      <button
        onClick={onBack}
        className="text-sm text-text-muted hover:text-gold transition-colors"
      >
        ← All workshops
      </button>

      {/* Header */}
      <div>
        <div className="flex items-center gap-2 mb-2">
          <span
            className="text-xs px-2 py-0.5 rounded-full"
            style={{
              backgroundColor: `${phaseColor}20`,
              color: phaseColor,
            }}
          >
            {PHASE_LABELS[workshop.phase]}
          </span>
          <span className="text-xs text-text-muted">
            {workshop.duration}
          </span>
        </div>
        <h1 className="font-bold-shell text-2xl text-white">{workshop.title}</h1>
      </div>

      {/* Progress bar */}
      <div className="space-y-2">
        <div className="flex gap-1">
          {workshop.steps.map((_, i) => (
            <button
              key={i}
              onClick={() => goToStep(i)}
              className="flex-1 h-1.5 rounded-full transition-colors"
              style={{
                backgroundColor:
                  i <= currentStep ? phaseColor : `${phaseColor}20`,
              }}
              aria-label={`Go to step ${i + 1}`}
            />
          ))}
        </div>
        <p className="text-xs text-text-muted">
          Step {currentStep + 1} of {totalSteps}
          {step.type !== 'text' && (
            <span className="ml-2 capitalize" style={{ color: `${phaseColor}90` }}>
              {step.type === 'body-scan' ? 'body scan' : step.type}
            </span>
          )}
        </p>
      </div>

      {/* Step content */}
      <div className="min-h-[200px]">
        <StepContent step={step} phaseColor={phaseColor} />
      </div>

      {/* Navigation */}
      <div className="flex items-center justify-between pt-4 border-t border-compass-border">
        <button
          onClick={handlePrev}
          disabled={currentStep === 0}
          className="px-4 py-2 text-sm text-text-muted hover:text-white transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
        >
          ← Previous
        </button>

        <button
          onClick={handleNext}
          className="px-5 py-2 rounded-lg text-sm font-medium transition-colors"
          style={{
            backgroundColor: isLastStep && !isCompleted ? phaseColor : `${phaseColor}20`,
            color: isLastStep && !isCompleted ? '#0A0A0A' : phaseColor,
            border: `1px solid ${phaseColor}40`,
          }}
        >
          {isLastStep
            ? isCompleted
              ? 'Completed'
              : 'Complete workshop'
            : 'Next →'}
        </button>
      </div>

      {isCompleted && (
        <div
          className="text-center py-4 rounded-xl"
          style={{
            backgroundColor: `${phaseColor}10`,
            border: `1px solid ${phaseColor}20`,
          }}
        >
          <p className="text-sm" style={{ color: phaseColor }}>
            You have completed this workshop. You can revisit any step above.
          </p>
        </div>
      )}
    </div>
  )
}

// ---------------------------------------------------------------------------
// Workshop card (library view)
// ---------------------------------------------------------------------------

function WorkshopCard({
  workshop,
  progress,
  onClick,
}: {
  workshop: Workshop
  progress: WorkshopProgress | undefined
  onClick: () => void
}) {
  const phaseColor = PHASE_COLORS[workshop.phase]
  const isStarted = !!progress && !progress.completed
  const isCompleted = progress?.completed ?? false

  return (
    <button
      onClick={onClick}
      className="w-full text-left bg-compass-dark rounded-xl overflow-hidden transition-all active:scale-[0.98]"
      style={{
        border: `1px solid ${phaseColor}30`,
      }}
    >
      {/* Soft gradient cover */}
      <div
        className="h-24 relative"
        style={{
          background: `linear-gradient(135deg, ${phaseColor}15, ${phaseColor}05, transparent)`,
        }}
      >
        <span className="absolute top-4 left-4 text-3xl opacity-80">
          {workshop.icon}
        </span>
        {isCompleted && (
          <span className="absolute top-3 right-3 text-xs px-2 py-0.5 rounded-full bg-compass-black/60 text-gold-rich">
            Completed
          </span>
        )}
        {isStarted && (
          <span className="absolute top-3 right-3 text-xs px-2 py-0.5 rounded-full bg-compass-black/60 text-text-muted">
            In progress
          </span>
        )}
      </div>

      {/* Content */}
      <div className="p-4 space-y-2">
        <h3 className="font-heritage text-lg text-white">
          {workshop.title}
        </h3>
        <p className="text-text-muted text-xs leading-relaxed line-clamp-2">
          {workshop.description}
        </p>

        {/* Badges */}
        <div className="flex items-center gap-2 pt-1">
          <span
            className="text-[10px] px-2 py-0.5 rounded-full"
            style={{
              backgroundColor: `${phaseColor}20`,
              color: phaseColor,
            }}
          >
            {PHASE_LABELS[workshop.phase]}
          </span>
          <span className="text-[10px] px-2 py-0.5 rounded-full bg-compass-card text-text-muted">
            {DIFFICULTY_LABELS[workshop.difficulty]}
          </span>
          <span className="text-[10px] text-text-muted/50 ml-auto">
            {workshop.duration}
          </span>
        </div>

        {/* Progress indicator */}
        {isStarted && progress && (
          <div className="flex gap-0.5 pt-1">
            {workshop.steps.map((_, i) => (
              <div
                key={i}
                className="flex-1 h-1 rounded-full"
                style={{
                  backgroundColor:
                    i <= progress.currentStep ? phaseColor : `${phaseColor}15`,
                }}
              />
            ))}
          </div>
        )}
      </div>
    </button>
  )
}

// ---------------------------------------------------------------------------
// Main page
// ---------------------------------------------------------------------------

export default function WorkshopsPage() {
  const [progress, setProgress] = useState<ProgressMap>(loadProgress)
  const [activeWorkshopId, setActiveWorkshopId] = useState<string | null>(null)

  // Persist on every change
  useEffect(() => {
    saveProgress(progress)
  }, [progress])

  const handleOpenWorkshop = useCallback(
    (workshopId: string) => {
      setActiveWorkshopId(workshopId)
      // Mark as started if not already
      setProgress((prev) => {
        if (prev[workshopId]) return prev
        return {
          ...prev,
          [workshopId]: {
            workshopId,
            currentStep: 0,
            completed: false,
            startedAt: new Date().toISOString(),
          },
        }
      })
    },
    [],
  )

  const handleStepChange = useCallback(
    (workshopId: string, step: number) => {
      setProgress((prev) => ({
        ...prev,
        [workshopId]: {
          ...prev[workshopId],
          workshopId,
          currentStep: step,
          completed: prev[workshopId]?.completed ?? false,
          startedAt: prev[workshopId]?.startedAt ?? new Date().toISOString(),
        },
      }))
    },
    [],
  )

  const handleComplete = useCallback((workshopId: string) => {
    setProgress((prev) => ({
      ...prev,
      [workshopId]: {
        ...prev[workshopId],
        workshopId,
        completed: true,
        completedAt: new Date().toISOString(),
        startedAt: prev[workshopId]?.startedAt ?? new Date().toISOString(),
        currentStep: prev[workshopId]?.currentStep ?? 0,
      },
    }))
  }, [])

  // Find in-progress workshops
  const inProgressWorkshops = workshops.filter(
    (w) => progress[w.id] && !progress[w.id].completed,
  )

  // Active workshop detail view
  if (activeWorkshopId) {
    const workshop = workshops.find((w) => w.id === activeWorkshopId)
    if (!workshop) {
      setActiveWorkshopId(null)
      return null
    }
    return (
      <WorkshopDetail
        workshop={workshop}
        progress={progress[workshop.id]}
        onBack={() => setActiveWorkshopId(null)}
        onStepChange={handleStepChange}
        onComplete={handleComplete}
      />
    )
  }

  // Library view
  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div>
        <h1 className="font-bold-shell text-2xl text-white">Workshops</h1>
        <p className="text-text-muted text-sm mt-1">
          Self-guided journeys through specific challenges. Your pace, your time.
        </p>
      </div>

      {/* Continue banner */}
      {inProgressWorkshops.length > 0 && (
        <div className="space-y-2">
          <h2 className="text-xs font-medium text-gold-rich uppercase tracking-wider">
            Continue where you left off
          </h2>
          {inProgressWorkshops.map((w) => {
            const p = progress[w.id]
            const phaseColor = PHASE_COLORS[w.phase]
            return (
              <button
                key={w.id}
                onClick={() => setActiveWorkshopId(w.id)}
                className="w-full flex items-center gap-3 p-3 rounded-xl transition-all active:scale-[0.98]"
                style={{
                  backgroundColor: `${phaseColor}10`,
                  border: `1px solid ${phaseColor}25`,
                }}
              >
                <span className="text-xl">{w.icon}</span>
                <div className="flex-1 min-w-0 text-left">
                  <p className="text-sm text-white font-medium truncate">
                    {w.title}
                  </p>
                  <p className="text-xs text-text-muted">
                    Step {(p.currentStep ?? 0) + 1} of {w.steps.length}
                  </p>
                </div>
                <svg
                  className="w-4 h-4 text-text-muted/60 flex-shrink-0"
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
              </button>
            )
          })}
        </div>
      )}

      {/* Workshop cards grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {workshops.map((workshop) => (
          <WorkshopCard
            key={workshop.id}
            workshop={workshop}
            progress={progress[workshop.id]}
            onClick={() => handleOpenWorkshop(workshop.id)}
          />
        ))}
      </div>
    </div>
  )
}
