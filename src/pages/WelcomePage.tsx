import { useState, useEffect, useCallback, useRef } from 'react'
import { useNavigate } from 'react-router-dom'

export const WELCOME_KEY = 'ivors-compass-welcomed'
export const USER_NAME_KEY = 'ivors-compass-user-name'
export const CADENCE_KEY = 'ivors-compass-reminder-cadence'
export const INTRO_AUDIO_KEY = 'ivors-compass-voice-intro'

const PHASES = [
  { name: 'Identity', color: '#C8B89A', angle: 0, desc: 'Know who you are' },
  { name: 'Connection', color: '#2A9D8F', angle: 90, desc: 'Find your people' },
  { name: 'Resistance', color: '#D4261A', angle: 180, desc: 'Stand your ground' },
  { name: 'Joy', color: '#E6A020', angle: 270, desc: 'Celebrate your light' },
]

const CADENCE_OPTIONS = [
  { value: 'daily', label: 'Every morning', desc: 'A gentle nudge to start the day' },
  { value: 'few', label: 'A few times a week', desc: 'Space to breathe between visits' },
  { value: 'new', label: 'When something new arrives', desc: 'New meditations, community moments' },
  { value: 'none', label: "I'll find my own way", desc: 'No reminders — the compass waits' },
] as const

type Step = 'spin' | 'settle' | 'ivor' | 'directions' | 'name' | 'community' | 'cadence' | 'begin'

const STEP_SEQUENCE: Step[] = ['spin', 'settle', 'ivor', 'directions', 'name', 'community', 'cadence', 'begin']
const DOT_STEPS: Step[] = ['settle', 'ivor', 'directions', 'name', 'community', 'cadence', 'begin']

export default function WelcomePage() {
  const navigate = useNavigate()
  const [step, setStep] = useState<Step>('spin')
  const [compassAngle, setCompassAngle] = useState(0)
  const [settling, setSettling] = useState(false)
  const [userName, setUserName] = useState('')
  const [cadence, setCadence] = useState<string>('few')

  // Voice intro recording
  const [isRecording, setIsRecording] = useState(false)
  const [introAudio, setIntroAudio] = useState<string | null>(null)
  const [recordingTime, setRecordingTime] = useState(0)
  const [aivorText, setAivorText] = useState('')
  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const chunksRef = useRef<Blob[]>([])
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null)

  const MAX_INTRO_SECONDS = 30

  const AIVOR_MESSAGE = userName.trim()
    ? `Welcome, ${userName.trim()}. I'm Ivor — or at least, the part of me that lives on in this compass. I'd love to hear your voice. Record a short introduction — who you are, what brought you here. When you join the HUB, this is how your accountability partner will first meet you.`
    : `Welcome. I'm Ivor — or at least, the part of me that lives on in this compass. I'd love to hear your voice. Record a short introduction — who you are, what brought you here. When you join the HUB, this is how your accountability partner will first meet you.`

  // Typewriter effect for AIvor's message
  useEffect(() => {
    if (step !== 'community') { setAivorText(''); return }
    let i = 0
    setAivorText('')
    const interval = setInterval(() => {
      i++
      setAivorText(AIVOR_MESSAGE.slice(0, i))
      if (i >= AIVOR_MESSAGE.length) clearInterval(interval)
    }, 28)
    return () => clearInterval(interval)
  }, [step, AIVOR_MESSAGE])

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      const recorder = new MediaRecorder(stream, { mimeType: 'audio/webm' })
      chunksRef.current = []

      recorder.ondataavailable = (e) => { if (e.data.size > 0) chunksRef.current.push(e.data) }
      recorder.onstop = () => {
        stream.getTracks().forEach((t) => t.stop())
        const blob = new Blob(chunksRef.current, { type: 'audio/webm' })
        const reader = new FileReader()
        reader.onloadend = () => setIntroAudio(reader.result as string)
        reader.readAsDataURL(blob)
      }

      recorder.start()
      mediaRecorderRef.current = recorder
      setIsRecording(true)
      setRecordingTime(0)

      timerRef.current = setInterval(() => {
        setRecordingTime((t) => {
          if (t + 1 >= MAX_INTRO_SECONDS) {
            mediaRecorderRef.current?.stop()
            setIsRecording(false)
            if (timerRef.current) clearInterval(timerRef.current)
            return MAX_INTRO_SECONDS
          }
          return t + 1
        })
      }, 1000)
    } catch {
      // Mic permission denied — user can skip
    }
  }

  const stopRecording = () => {
    mediaRecorderRef.current?.stop()
    setIsRecording(false)
    if (timerRef.current) clearInterval(timerRef.current)
  }

  // ── Compass spin physics ──
  useEffect(() => {
    if (step !== 'spin') return

    let angle = 0
    let speed = 12
    let frame: number

    const spin = () => {
      angle += speed
      setCompassAngle(angle % 360)

      if (angle > 720) speed *= 0.97
      if (speed < 0.3) {
        setSettling(true)
        setStep('settle')
        return
      }

      frame = requestAnimationFrame(spin)
    }

    frame = requestAnimationFrame(spin)
    return () => cancelAnimationFrame(frame)
  }, [step])

  // Auto-advance settle → ivor
  useEffect(() => {
    if (step !== 'settle') return
    const t = setTimeout(() => setStep('ivor'), 2000)
    return () => clearTimeout(t)
  }, [step])

  const advance = useCallback(() => {
    const idx = STEP_SEQUENCE.indexOf(step)
    if (idx < STEP_SEQUENCE.length - 1) {
      setStep(STEP_SEQUENCE[idx + 1])
    }
  }, [step])

  const complete = () => {
    try {
      localStorage.setItem(WELCOME_KEY, 'true')
      if (userName.trim()) {
        localStorage.setItem(USER_NAME_KEY, userName.trim())
      }
      localStorage.setItem(CADENCE_KEY, cadence)
      if (introAudio) {
        localStorage.setItem(INTRO_AUDIO_KEY, introAudio)
      }
    } catch {}
    navigate('/compass', { replace: true })
  }

  // ── Shared button component ──
  const PillButton = ({ onClick, children, glow }: { onClick: (e: React.MouseEvent) => void; children: React.ReactNode; glow?: boolean }) => (
    <button
      onClick={(e) => { e.stopPropagation(); onClick(e) }}
      className={`mt-4 px-10 py-3.5 bg-white text-compass-black font-semibold text-base rounded-full transition-all active:scale-[0.97] ${
        glow ? 'shadow-[0_0_30px_rgba(212,175,55,0.2)]' : ''
      }`}
    >
      {children}
    </button>
  )

  return (
    <div
      className="min-h-screen bg-compass-black flex flex-col items-center justify-center relative overflow-hidden"
      onClick={step === 'ivor' || step === 'directions' ? advance : undefined}
    >
      {/* Radial glow */}
      <div
        className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full pointer-events-none transition-opacity duration-1000 ${
          settling ? 'opacity-100' : 'opacity-30'
        }`}
        style={{
          background: 'radial-gradient(circle, rgba(212,175,55,0.12) 0%, rgba(212,175,55,0.04) 40%, transparent 70%)',
        }}
      />

      {/* ────────────────────────────────────────────────────────────────────── */}
      {/* Step 1 & 2: Compass Spinning / Settling                              */}
      {/* ────────────────────────────────────────────────────────────────────── */}
      {(step === 'spin' || step === 'settle') && (
        <div className="flex flex-col items-center justify-center gap-8 relative z-10">
          <div className="relative w-40 h-40">
            <div
              className={`absolute inset-0 transition-all ${step === 'settle' ? 'duration-1000 ease-out' : ''}`}
              style={{ transform: `rotate(${compassAngle}deg)` }}
            >
              <svg viewBox="0 0 120 120" fill="none" className="w-full h-full">
                <circle cx="60" cy="60" r="56" stroke="#d4af37" strokeWidth="0.5" opacity="0.3" />
                {[0, 90, 180, 270].map((a) => (
                  <line key={a} x1="60" y1="8" x2="60" y2="16" stroke="#d4af37" strokeWidth="1.5" opacity="0.6" transform={`rotate(${a} 60 60)`} />
                ))}
                <path d="M60 10L67 42L98 38L72 56L85 86L60 66L35 86L48 56L22 38L53 42Z" fill="none" stroke="#d4af37" strokeWidth="1.5" opacity="0.9" />
                <path d="M60 30L70 60L60 90L50 60Z" fill="rgba(212,175,55,0.15)" stroke="#d4af37" strokeWidth="1" />
                <path d="M60 10L64 40L60 35L56 40Z" fill="#d4af37" opacity="0.8" />
              </svg>
            </div>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className={`w-3 h-3 rounded-full bg-gold transition-all duration-1000 ${step === 'settle' ? 'shadow-[0_0_20px_rgba(212,175,55,0.6)]' : ''}`} />
            </div>
          </div>

          <div className={`text-center transition-opacity duration-1000 ${step === 'settle' ? 'opacity-100' : 'opacity-0'}`}>
            <p className="font-heritage italic text-gold text-xl">Every journey needs a guide</p>
          </div>
        </div>
      )}

      {/* ────────────────────────────────────────────────────────────────────── */}
      {/* Step 3: Ivor Emerges                                                  */}
      {/* ────────────────────────────────────────────────────────────────────── */}
      {step === 'ivor' && (
        <div className="flex flex-col items-center justify-center gap-8 px-8 relative z-10 animate-fade-in">
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
            <div className="absolute top-0 left-0 w-6 h-6 border-t-2 border-l-2 border-gold/60" />
            <div className="absolute top-0 right-0 w-6 h-6 border-t-2 border-r-2 border-gold/60" />
          </div>

          <div className="text-center max-w-xs">
            <h2 className="font-bold-shell text-2xl text-gold-gradient mb-3">Meet Ivor Cummings</h2>
            <p className="font-heritage italic text-warm-white/70 text-base leading-relaxed">
              A man who navigated identity, resistance, connection, and joy — and left a compass for those who follow.
            </p>
          </div>

          <PillButton onClick={advance}>Continue</PillButton>
        </div>
      )}

      {/* ────────────────────────────────────────────────────────────────────── */}
      {/* Step 4: Four Directions                                               */}
      {/* ────────────────────────────────────────────────────────────────────── */}
      {step === 'directions' && (
        <div className="flex flex-col items-center justify-center gap-6 px-8 relative z-10 animate-fade-in">
          <div className="relative w-64 h-64">
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-16 h-16 border border-gold/40 rotate-45 flex items-center justify-center">
                <div className="w-10 h-10 border border-gold/30 rotate-0 flex items-center justify-center">
                  <div className="w-3 h-3 rounded-full bg-gold animate-pulse-gold" />
                </div>
              </div>
            </div>

            {PHASES.map((phase, i) => {
              const positions = [
                { top: '0', left: '50%', transform: 'translateX(-50%)' },
                { top: '50%', right: '0', transform: 'translateY(-50%)' },
                { bottom: '0', left: '50%', transform: 'translateX(-50%)' },
                { top: '50%', left: '0', transform: 'translateY(-50%)' },
              ]
              return (
                <div key={phase.name} className="absolute text-center animate-fade-in" style={{ ...positions[i], animationDelay: `${i * 0.15}s` }}>
                  <p className="font-bold-shell text-sm tracking-wider" style={{ color: phase.color }}>{phase.name}</p>
                  <p className="text-warm-white/50 text-xs font-heritage italic mt-0.5">{phase.desc}</p>
                </div>
              )
            })}

            <svg className="absolute inset-0 w-full h-full" viewBox="0 0 256 256">
              <line x1="128" y1="40" x2="128" y2="216" stroke="#d4af37" strokeWidth="0.5" opacity="0.2" />
              <line x1="40" y1="128" x2="216" y2="128" stroke="#d4af37" strokeWidth="0.5" opacity="0.2" />
            </svg>
          </div>

          <div className="text-center max-w-xs mt-4">
            <h2 className="font-bold-shell text-xl text-gold-gradient mb-3">Four Directions</h2>
            <p className="font-heritage italic text-warm-white/70 text-sm leading-relaxed">
              Morning and evening, the compass points to different reflections. Your mood guides the direction.
            </p>
          </div>

          <PillButton onClick={advance}>Continue</PillButton>
        </div>
      )}

      {/* ────────────────────────────────────────────────────────────────────── */}
      {/* Step 5: What should we call you?                                      */}
      {/* ────────────────────────────────────────────────────────────────────── */}
      {step === 'name' && (
        <div className="flex flex-col items-center justify-center gap-8 px-8 relative z-10 animate-fade-in">
          {/* Mic icon — introduce voice as part of identity */}
          <div className="w-16 h-16 rounded-full border border-gold/30 flex items-center justify-center">
            <svg viewBox="0 0 24 24" className="w-7 h-7 text-gold" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 18.75a6 6 0 006-6v-1.5m-6 7.5a6 6 0 01-6-6v-1.5m6 7.5v3.75m-3.75 0h7.5M12 15.75a3 3 0 01-3-3V4.5a3 3 0 116 0v8.25a3 3 0 01-3 3z" />
            </svg>
          </div>

          <div className="text-center max-w-xs">
            <h2 className="font-bold-shell text-2xl text-gold-gradient mb-3">
              What should we call you?
            </h2>
            <p className="font-heritage italic text-warm-white/60 text-sm leading-relaxed">
              Your name stays on your device. We use it to greet you — and you can journal by voice, not just text.
            </p>
          </div>

          <input
            type="text"
            value={userName}
            onChange={(e) => setUserName(e.target.value)}
            placeholder="Your first name"
            maxLength={30}
            className="w-full max-w-xs text-center text-lg bg-compass-dark border border-compass-border px-4 py-4 text-white placeholder-text-muted/60 focus:outline-none focus:border-gold/60 focus:shadow-[0_2px_0_0_#d4af37] transition-all rounded-none"
            autoFocus
            autoComplete="given-name"
          />

          <PillButton onClick={advance}>
            {userName.trim() ? 'Continue' : 'Skip for now'}
          </PillButton>
        </div>
      )}

      {/* ────────────────────────────────────────────────────────────────────── */}
      {/* Step 6: AIvor invites voice introduction + community care              */}
      {/* ────────────────────────────────────────────────────────────────────── */}
      {step === 'community' && (
        <div className="flex flex-col items-center justify-center gap-5 px-8 relative z-10 animate-fade-in max-w-sm mx-auto">
          {/* AIvor speech bubble */}
          <div className="w-full">
            <div className="flex items-start gap-3 mb-4">
              {/* AIvor avatar */}
              <div className="flex-shrink-0 w-10 h-10 rounded-full overflow-hidden border border-gold/40">
                <img
                  src="/images/ivor-1974.jpg"
                  alt="AIvor"
                  className="w-full h-full object-cover object-top"
                />
              </div>
              <div>
                <p className="text-gold text-xs font-bold-shell tracking-wider mb-1">AIVOR</p>
                <p className="font-heritage italic text-warm-white/80 text-sm leading-relaxed min-h-[5rem]">
                  {aivorText}
                  {aivorText.length < AIVOR_MESSAGE.length && (
                    <span className="inline-block w-0.5 h-4 bg-gold/60 ml-0.5 animate-pulse-gold" />
                  )}
                </p>
              </div>
            </div>
          </div>

          {/* Recording interface */}
          <div className="w-full flex flex-col items-center gap-4">
            {!introAudio ? (
              <>
                {/* Record button */}
                <button
                  onClick={isRecording ? stopRecording : startRecording}
                  className={`w-20 h-20 rounded-full flex items-center justify-center transition-all ${
                    isRecording
                      ? 'bg-blkout-red/20 border-2 border-blkout-red shadow-[0_0_20px_rgba(212,38,26,0.3)]'
                      : 'bg-compass-dark border-2 border-gold/40 hover:border-gold/70'
                  }`}
                >
                  {isRecording ? (
                    <div className="w-6 h-6 rounded-sm bg-blkout-red" />
                  ) : (
                    <svg viewBox="0 0 24 24" className="w-8 h-8 text-gold" fill="none" stroke="currentColor" strokeWidth="1.5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 18.75a6 6 0 006-6v-1.5m-6 7.5a6 6 0 01-6-6v-1.5m6 7.5v3.75m-3.75 0h7.5M12 15.75a3 3 0 01-3-3V4.5a3 3 0 116 0v8.25a3 3 0 01-3 3z" />
                    </svg>
                  )}
                </button>

                {isRecording && (
                  <div className="flex items-center gap-2 text-sm">
                    <div className="w-2 h-2 rounded-full bg-blkout-red animate-pulse" />
                    <span className="text-warm-white/70 font-mono text-xs">
                      {recordingTime}s / {MAX_INTRO_SECONDS}s
                    </span>
                  </div>
                )}

                {!isRecording && (
                  <p className="text-text-muted text-xs">
                    Tap to record — up to {MAX_INTRO_SECONDS} seconds
                  </p>
                )}
              </>
            ) : (
              <>
                {/* Playback */}
                <div className="w-full bg-compass-dark border border-gold/30 p-4 flex flex-col items-center gap-3">
                  <div className="flex items-center gap-2 text-gold text-xs">
                    <svg viewBox="0 0 24 24" className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="1.5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75l3 3m0 0l3-3m-3 3v-7.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span className="font-medium">Voice intro recorded</span>
                  </div>
                  <audio src={introAudio} controls className="w-full h-8 opacity-70" />
                  <button
                    onClick={() => { setIntroAudio(null); setRecordingTime(0) }}
                    className="text-text-muted text-xs hover:text-warm-white/60 transition-colors"
                  >
                    Re-record
                  </button>
                </div>
              </>
            )}
          </div>

          {/* Community CTA */}
          <div className="w-full space-y-3 mt-2">
            <p className="text-center text-warm-white/50 text-xs font-heritage italic">
              Self-care is community care. Join the HUB to find your accountability partner — a friend you're yet to meet.
            </p>
            <a
              href="https://blkoutuk.com/join"
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => { /* advance after clicking, don't block navigation */ setTimeout(advance, 300) }}
              className="block w-full py-3.5 bg-blkout-teal text-white text-center font-semibold text-sm rounded-full transition-all active:scale-[0.97]"
            >
              Join the HUB
            </a>
            <button
              onClick={(e) => { e.stopPropagation(); advance() }}
              className="block w-full py-2.5 text-warm-white/40 text-center text-xs transition-colors hover:text-warm-white/60"
            >
              I'll join later
            </button>
          </div>
        </div>
      )}

      {/* ────────────────────────────────────────────────────────────────────── */}
      {/* Step 7: How often should the compass call you back?                   */}
      {/* ────────────────────────────────────────────────────────────────────── */}
      {step === 'cadence' && (
        <div className="flex flex-col items-center justify-center gap-6 px-8 relative z-10 animate-fade-in">
          {/* Bell icon */}
          <div className="w-16 h-16 rounded-full border border-gold/30 flex items-center justify-center">
            <svg viewBox="0 0 24 24" className="w-7 h-7 text-gold" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0" />
            </svg>
          </div>

          <div className="text-center max-w-xs">
            <h2 className="font-bold-shell text-xl text-gold-gradient mb-2">
              When should the compass call?
            </h2>
            <p className="font-heritage italic text-warm-white/60 text-xs">
              You can change this anytime
            </p>
          </div>

          <div className="w-full max-w-xs space-y-2">
            {CADENCE_OPTIONS.map((opt) => (
              <button
                key={opt.value}
                onClick={() => setCadence(opt.value)}
                className={`w-full text-left px-5 py-3.5 border transition-all ${
                  cadence === opt.value
                    ? 'border-gold/60 bg-gold/10'
                    : 'border-compass-border bg-compass-dark hover:border-compass-border/80'
                }`}
              >
                <p className={`text-sm font-medium ${cadence === opt.value ? 'text-gold' : 'text-warm-white/80'}`}>
                  {opt.label}
                </p>
                <p className="text-xs text-text-muted mt-0.5">{opt.desc}</p>
              </button>
            ))}
          </div>

          <PillButton onClick={advance}>Continue</PillButton>
        </div>
      )}

      {/* ────────────────────────────────────────────────────────────────────── */}
      {/* Step 8: Begin — personalised                                          */}
      {/* ────────────────────────────────────────────────────────────────────── */}
      {step === 'begin' && (
        <div className="flex flex-col items-center justify-center gap-8 px-8 relative z-10 animate-fade-in">
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
              {userName.trim() ? `The compass is yours, ${userName.trim()}` : 'The compass is yours'}
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
          {DOT_STEPS.map((s) => (
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
