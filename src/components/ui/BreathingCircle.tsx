import { useState, useEffect, useCallback } from 'react'

type BreathPhase = 'inhale' | 'hold' | 'exhale'

const BREATH_PHASES: { phase: BreathPhase; duration: number; label: string; seconds: number }[] = [
  { phase: 'inhale', duration: 4000, label: 'Breathe in', seconds: 4 },
  { phase: 'hold', duration: 7000, label: 'Hold', seconds: 7 },
  { phase: 'exhale', duration: 8000, label: 'Breathe out', seconds: 8 },
]

const TOTAL_CYCLE = BREATH_PHASES.reduce((sum, p) => sum + p.duration, 0)

// ---------------------------------------------------------------------------
// Auto-play variant (CrisisPage style) — rAF-driven, always running
// ---------------------------------------------------------------------------

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

function AutoBreathingCircle() {
  const { phase, label, progress } = useBreathingCycle()

  let scale: number
  let glowIntensity: number
  if (phase === 'inhale') {
    scale = 1 + progress * 0.5
    glowIntensity = 0.1 + progress * 0.4
  } else if (phase === 'hold') {
    scale = 1.5
    glowIntensity = 0.5
  } else {
    scale = 1.5 - progress * 0.5
    glowIntensity = 0.5 - progress * 0.4
  }

  const tealGlow = `0 0 ${20 + glowIntensity * 40}px rgba(42,157,143,${glowIntensity}), 0 0 ${40 + glowIntensity * 60}px rgba(42,157,143,${glowIntensity * 0.5})`

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="relative w-32 h-32 flex items-center justify-center" role="img" aria-label={label}>
        <div
          className="absolute inset-0 rounded-full transition-none"
          style={{
            transform: `scale(${scale})`,
            background: `radial-gradient(circle, rgba(42,157,143,${0.1 + glowIntensity * 0.15}) 0%, transparent 70%)`,
          }}
        />
        <div
          className="w-24 h-24 rounded-full border-2 border-blkout-teal/40 transition-none flex items-center justify-center"
          style={{
            transform: `scale(${scale})`,
            backgroundColor:
              phase === 'inhale'
                ? `rgba(42,157,143,${0.05 + progress * 0.12})`
                : phase === 'hold'
                  ? 'rgba(42,157,143,0.17)'
                  : `rgba(42,157,143,${0.17 - progress * 0.12})`,
            boxShadow: tealGlow,
          }}
        >
          <span className="text-blkout-teal/80 text-xs font-medium select-none" aria-live="polite">{label}</span>
        </div>
      </div>
      <p className="text-text-muted/50 text-[11px]">
        4 seconds in &middot; 7 seconds hold &middot; 8 seconds out
      </p>
    </div>
  )
}

// ---------------------------------------------------------------------------
// Interactive variant (WorkshopsPage style) — timer-driven, user-triggered
// ---------------------------------------------------------------------------

function InteractiveBreathingCircle({ phaseColor }: { phaseColor: string }) {
  const [phase, setPhase] = useState<BreathPhase>('inhale')
  const [seconds, setSeconds] = useState(4)
  const [running, setRunning] = useState(false)
  const [cycles, setCycles] = useState(0)

  useEffect(() => {
    if (!running) return
    if (cycles >= 4) {
      setRunning(false)
      return
    }

    const timer = setInterval(() => {
      setSeconds((prev) => {
        if (prev <= 1) {
          if (phase === 'inhale') {
            setPhase('hold')
            return 7
          }
          if (phase === 'hold') {
            setPhase('exhale')
            return 8
          }
          setCycles((c) => c + 1)
          setPhase('inhale')
          return 4
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [running, phase, cycles])

  const start = useCallback(() => {
    setPhase('inhale')
    setSeconds(4)
    setCycles(0)
    setRunning(true)
  }, [])

  const scaleMap = { inhale: 'scale-125', hold: 'scale-125', exhale: 'scale-75' }
  const labelMap = { inhale: 'Breathe in', hold: 'Hold', exhale: 'Breathe out' }

  return (
    <div className="flex flex-col items-center gap-6 py-6">
      <div
        className={`w-32 h-32 rounded-full flex items-center justify-center transition-transform duration-1000 ease-in-out ${running ? scaleMap[phase] : 'scale-100'}`}
        style={{
          backgroundColor: `${phaseColor}20`,
          border: `2px solid ${phaseColor}60`,
        }}
        role="img"
        aria-label={running ? labelMap[phase] : cycles >= 4 ? 'Breathing exercise complete' : 'Breathing exercise ready'}
      >
        {running ? (
          <div className="text-center">
            <p className="text-2xl font-light text-white" aria-live="polite">{seconds}</p>
            <p className="text-xs text-text-muted mt-1">{labelMap[phase]}</p>
          </div>
        ) : (
          <p className="text-xs text-text-muted">
            {cycles >= 4 ? 'Complete' : 'Ready'}
          </p>
        )}
      </div>

      {!running && cycles < 4 && (
        <button
          onClick={start}
          className="px-5 py-2 rounded-lg text-sm font-medium transition-colors focus-visible:ring-2 focus-visible:ring-gold/60 focus-visible:ring-offset-2 focus-visible:ring-offset-compass-black"
          style={{
            backgroundColor: `${phaseColor}20`,
            color: phaseColor,
            border: `1px solid ${phaseColor}40`,
          }}
        >
          {cycles === 0 ? 'Begin breathing' : 'Restart'}
        </button>
      )}

      {cycles >= 4 && (
        <p className="text-text-muted text-xs text-center">
          4 cycles complete — well done.
        </p>
      )}
    </div>
  )
}

// ---------------------------------------------------------------------------
// Unified export
// ---------------------------------------------------------------------------

export interface BreathingCircleProps {
  variant?: 'auto' | 'interactive'
  phaseColor?: string
}

export function BreathingCircle({ variant = 'auto', phaseColor = '#D4AF37' }: BreathingCircleProps) {
  if (variant === 'interactive') {
    return <InteractiveBreathingCircle phaseColor={phaseColor} />
  }
  return <AutoBreathingCircle />
}
