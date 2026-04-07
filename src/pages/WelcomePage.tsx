import { useState, useEffect, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'

const WELCOME_KEY = 'ivors-compass-welcomed'

const PHASES = [
  { name: 'Identity', color: '#C8B89A', angle: 0, desc: 'Know who you are' },
  { name: 'Connection', color: '#2A9D8F', angle: 90, desc: 'Find your people' },
  { name: 'Resistance', color: '#D4261A', angle: 180, desc: 'Stand your ground' },
  { name: 'Joy', color: '#E6A020', angle: 270, desc: 'Celebrate your light' },
]

type Step = 'spin' | 'settle' | 'ivor' | 'directions' | 'begin'

export default function WelcomePage() {
  const navigate = useNavigate()
  const [step, setStep] = useState<Step>('spin')
  const [compassAngle, setCompassAngle] = useState(0)
  const [settling, setSettling] = useState(false)

  // Compass spin — fast at first, then decelerate and settle
  useEffect(() => {
    if (step !== 'spin') return

    let angle = 0
    let speed = 12 // degrees per frame
    let frame: number

    const spin = () => {
      angle += speed
      setCompassAngle(angle % 360)

      // After ~2 seconds of fast spin, begin decelerating
      if (angle > 720) {
        speed *= 0.97
      }

      if (speed < 0.3) {
        // Settle on a direction
        setSettling(true)
        setStep('settle')
        return
      }

      frame = requestAnimationFrame(spin)
    }

    frame = requestAnimationFrame(spin)
    return () => cancelAnimationFrame(frame)
  }, [step])

  // Auto-advance from settle → ivor
  useEffect(() => {
    if (step !== 'settle') return
    const t = setTimeout(() => setStep('ivor'), 2000)
    return () => clearTimeout(t)
  }, [step])

  const advance = useCallback(() => {
    const sequence: Step[] = ['spin', 'settle', 'ivor', 'directions', 'begin']
    const idx = sequence.indexOf(step)
    if (idx < sequence.length - 1) {
      setStep(sequence[idx + 1])
    }
  }, [step])

  const complete = () => {
    try {
      localStorage.setItem(WELCOME_KEY, 'true')
    } catch {}
    navigate('/compass', { replace: true })
  }

  return (
    <div
      className="min-h-screen bg-compass-black flex flex-col items-center justify-center relative overflow-hidden"
      onClick={step === 'ivor' || step === 'directions' ? advance : undefined}
    >
      {/* Radial glow — always present, pulses on settle */}
      <div
        className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full pointer-events-none transition-opacity duration-1000 ${
          settling ? 'opacity-100' : 'opacity-30'
        }`}
        style={{
          background:
            'radial-gradient(circle, rgba(212,175,55,0.12) 0%, rgba(212,175,55,0.04) 40%, transparent 70%)',
        }}
      />

      {/* ── Step 1 & 2: Compass Spinning / Settling ── */}
      {(step === 'spin' || step === 'settle') && (
        <div className="flex flex-col items-center justify-center gap-8 relative z-10">
          {/* Compass star */}
          <div className="relative w-40 h-40">
            <div
              className={`absolute inset-0 transition-all ${
                step === 'settle' ? 'duration-1000 ease-out' : ''
              }`}
              style={{ transform: `rotate(${compassAngle}deg)` }}
            >
              <svg viewBox="0 0 120 120" fill="none" className="w-full h-full">
                {/* Outer ring */}
                <circle cx="60" cy="60" r="56" stroke="#d4af37" strokeWidth="0.5" opacity="0.3" />
                {/* Cardinal ticks */}
                {[0, 90, 180, 270].map((a) => (
                  <line
                    key={a}
                    x1="60"
                    y1="8"
                    x2="60"
                    y2="16"
                    stroke="#d4af37"
                    strokeWidth="1.5"
                    opacity="0.6"
                    transform={`rotate(${a} 60 60)`}
                  />
                ))}
                {/* Compass star */}
                <path
                  d="M60 10L67 42L98 38L72 56L85 86L60 66L35 86L48 56L22 38L53 42Z"
                  fill="none"
                  stroke="#d4af37"
                  strokeWidth="1.5"
                  opacity="0.9"
                />
                {/* Inner diamond */}
                <path
                  d="M60 30L70 60L60 90L50 60Z"
                  fill="rgba(212,175,55,0.15)"
                  stroke="#d4af37"
                  strokeWidth="1"
                />
                {/* North pointer */}
                <path
                  d="M60 10L64 40L60 35L56 40Z"
                  fill="#d4af37"
                  opacity="0.8"
                />
              </svg>
            </div>
            {/* Centre dot */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div
                className={`w-3 h-3 rounded-full bg-gold transition-all duration-1000 ${
                  step === 'settle' ? 'shadow-[0_0_20px_rgba(212,175,55,0.6)]' : ''
                }`}
              />
            </div>
          </div>

          {/* Text */}
          <div
            className={`text-center transition-opacity duration-1000 ${
              step === 'settle' ? 'opacity-100' : 'opacity-0'
            }`}
          >
            <p className="font-heritage italic text-gold text-xl">
              Every journey needs a guide
            </p>
          </div>
        </div>
      )}

      {/* ── Step 3: Ivor Emerges ── */}
      {step === 'ivor' && (
        <div className="flex flex-col items-center justify-center gap-8 px-8 relative z-10 animate-fade-in">
          {/* Portrait */}
          <div className="relative w-56 h-72 overflow-hidden">
            <div className="absolute inset-0 border border-gold/30" />
            <img
              src="/images/ivor-1974.jpg"
              alt="Ivor Cummings"
              className="w-full h-full object-cover object-top"
              style={{
                maskImage: 'linear-gradient(to bottom, black 70%, transparent 100%)',
                WebkitMaskImage: 'linear-gradient(to bottom, black 70%, transparent 100%)',
              }}
            />
            {/* Gold corner accents */}
            <div className="absolute top-0 left-0 w-6 h-6 border-t-2 border-l-2 border-gold/60" />
            <div className="absolute top-0 right-0 w-6 h-6 border-t-2 border-r-2 border-gold/60" />
          </div>

          <div className="text-center max-w-xs">
            <h2 className="font-bold-shell text-2xl text-gold-gradient mb-3">
              Meet Ivor Cummings
            </h2>
            <p className="font-heritage italic text-warm-white/70 text-base leading-relaxed">
              A man who navigated identity, resistance, connection, and joy —
              and left a compass for those who follow.
            </p>
          </div>

          <button
            onClick={(e) => {
              e.stopPropagation()
              advance()
            }}
            className="mt-4 px-10 py-3.5 bg-white text-compass-black font-semibold text-base rounded-full transition-all active:scale-[0.97]"
          >
            Continue
          </button>
        </div>
      )}

      {/* ── Step 4: Four Directions ── */}
      {step === 'directions' && (
        <div className="flex flex-col items-center justify-center gap-6 px-8 relative z-10 animate-fade-in">
          {/* Compass rose with four phases */}
          <div className="relative w-64 h-64">
            {/* Centre compass */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-16 h-16 border border-gold/40 rotate-45 flex items-center justify-center">
                <div className="w-10 h-10 border border-gold/30 rotate-0 flex items-center justify-center">
                  <div className="w-3 h-3 rounded-full bg-gold animate-pulse-gold" />
                </div>
              </div>
            </div>

            {/* Phase labels at cardinal positions */}
            {PHASES.map((phase, i) => {
              const positions = [
                { top: '0', left: '50%', transform: 'translateX(-50%)' },       // N
                { top: '50%', right: '0', transform: 'translateY(-50%)' },      // E
                { bottom: '0', left: '50%', transform: 'translateX(-50%)' },    // S
                { top: '50%', left: '0', transform: 'translateY(-50%)' },       // W
              ]
              return (
                <div
                  key={phase.name}
                  className="absolute text-center animate-fade-in"
                  style={{
                    ...positions[i],
                    animationDelay: `${i * 0.15}s`,
                  }}
                >
                  <p
                    className="font-bold-shell text-sm tracking-wider"
                    style={{ color: phase.color }}
                  >
                    {phase.name}
                  </p>
                  <p className="text-warm-white/50 text-xs font-heritage italic mt-0.5">
                    {phase.desc}
                  </p>
                </div>
              )
            })}

            {/* Connecting lines */}
            <svg className="absolute inset-0 w-full h-full" viewBox="0 0 256 256">
              <line x1="128" y1="40" x2="128" y2="216" stroke="#d4af37" strokeWidth="0.5" opacity="0.2" />
              <line x1="40" y1="128" x2="216" y2="128" stroke="#d4af37" strokeWidth="0.5" opacity="0.2" />
            </svg>
          </div>

          <div className="text-center max-w-xs mt-4">
            <h2 className="font-bold-shell text-xl text-gold-gradient mb-3">
              Four Directions
            </h2>
            <p className="font-heritage italic text-warm-white/70 text-sm leading-relaxed">
              Morning and evening, the compass points to different reflections.
              Your mood guides the direction.
            </p>
          </div>

          <button
            onClick={(e) => {
              e.stopPropagation()
              advance()
            }}
            className="mt-4 px-10 py-3.5 bg-white text-compass-black font-semibold text-base rounded-full transition-all active:scale-[0.97]"
          >
            Continue
          </button>
        </div>
      )}

      {/* ── Step 5: Begin ── */}
      {step === 'begin' && (
        <div className="flex flex-col items-center justify-center gap-8 px-8 relative z-10 animate-fade-in">
          {/* Gentle compass */}
          <div className="relative w-24 h-24 animate-gentle-float">
            <svg viewBox="0 0 64 64" fill="none" className="w-full h-full">
              <path
                d="M32 6L37.09 22.26L54 23.77L41.5 34.64L45.82 51.52L32 42.27L18.18 51.52L22.5 34.64L10 23.77L26.91 22.26L32 6Z"
                stroke="#d4af37"
                strokeWidth="1"
                fill="rgba(212,175,55,0.08)"
              />
            </svg>
          </div>

          <div className="text-center max-w-xs">
            <h2 className="font-heritage italic text-gold text-2xl mb-3">
              The compass is yours
            </h2>
            <p className="text-warm-white/60 text-sm leading-relaxed">
              Journal. Reflect. Listen. Draw a card.
              <br />
              Let Ivor's story illuminate your own.
            </p>
          </div>

          <button
            onClick={complete}
            className="mt-6 px-12 py-4 bg-white text-compass-black font-bold text-lg rounded-full transition-all active:scale-[0.97] shadow-[0_0_30px_rgba(212,175,55,0.2)]"
          >
            Begin
          </button>
        </div>
      )}

      {/* Step indicator dots */}
      {step !== 'spin' && (
        <div className="absolute bottom-12 left-1/2 -translate-x-1/2 flex gap-2">
          {(['settle', 'ivor', 'directions', 'begin'] as Step[]).map((s) => (
            <div
              key={s}
              className={`w-1.5 h-1.5 rounded-full transition-all duration-500 ${
                s === step ? 'bg-gold w-4' : 'bg-gold/30'
              }`}
            />
          ))}
        </div>
      )}
    </div>
  )
}
