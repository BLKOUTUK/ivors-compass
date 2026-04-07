import { useState, useRef } from 'react'

export default function PoemPage() {
  const [isPlaying, setIsPlaying] = useState(false)
  const [progress, setProgress] = useState(0)
  const audioRef = useRef<HTMLAudioElement>(null)

  const togglePlay = () => {
    if (!audioRef.current) return
    if (isPlaying) {
      audioRef.current.pause()
    } else {
      audioRef.current.play().catch(() => {
        // Audio not available yet
      })
    }
    setIsPlaying(!isPlaying)
  }

  const handleTimeUpdate = () => {
    if (!audioRef.current) return
    const pct = (audioRef.current.currentTime / audioRef.current.duration) * 100
    setProgress(isNaN(pct) ? 0 : pct)
  }

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div className="text-center py-4">
        <p className="text-terracotta text-xs font-medium tracking-wider uppercase mb-2">
          Spoken Word
        </p>
        <h1 className="font-bold-shell text-3xl text-white mb-1">The Poem</h1>
        <p className="text-gold-rich text-sm">Keith Jarrett</p>
        <p className="text-text-muted/60 text-xs mt-1">Former UK Poetry Slam Champion</p>
      </div>

      {/* Audio player */}
      <div className="bg-compass-dark border border-gold/20 rounded-2xl p-8">
        <audio
          ref={audioRef}
          onTimeUpdate={handleTimeUpdate}
          onEnded={() => { setIsPlaying(false); setProgress(0) }}
          preload="metadata"
        >
          {/* Audio source will be added when recording is available */}
          {/* <source src="/audio/poem.mp3" type="audio/mpeg" /> */}
        </audio>

        {/* Play button */}
        <div className="flex flex-col items-center">
          <button
            onClick={togglePlay}
            className="w-20 h-20 rounded-full border-2 border-gold/40 hover:border-gold flex items-center justify-center transition-colors group"
            aria-label={isPlaying ? 'Pause' : 'Play'}
          >
            {isPlaying ? (
              <svg className="w-8 h-8 text-gold" fill="currentColor" viewBox="0 0 24 24">
                <path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z" />
              </svg>
            ) : (
              <svg className="w-8 h-8 text-gold/60 group-hover:text-gold transition-colors ml-1" fill="currentColor" viewBox="0 0 24 24">
                <path d="M8 5v14l11-7z" />
              </svg>
            )}
          </button>

          {/* Progress bar */}
          <div className="w-full mt-6 h-1 bg-compass-border rounded-full overflow-hidden">
            <div
              className="h-full bg-gold-rich rounded-full transition-all duration-200"
              style={{ width: `${progress}%` }}
            />
          </div>

          {/* Waveform decoration */}
          <div className="flex items-end gap-[3px] mt-4 h-8">
            {Array.from({ length: 40 }).map((_, i) => (
              <div
                key={i}
                className={`w-[2px] bg-gold/30 rounded-full ${isPlaying ? 'animate-pulse-gold' : ''}`}
                style={{
                  height: `${Math.sin(i * 0.5) * 50 + 50}%`,
                  animationDelay: `${i * 0.05}s`,
                }}
              />
            ))}
          </div>

          <p className="text-text-muted/60 text-xs mt-4">
            {audioRef.current?.src ? '~3 minutes' : 'Audio coming soon — recording in progress'}
          </p>
        </div>
      </div>

      {/* Poem text */}
      <section className="bg-compass-card border border-compass-border rounded-xl p-6">
        <h2 className="font-heritage text-lg text-gold-rich mb-4">Text</h2>
        <div className="text-text-muted text-sm leading-loose italic space-y-4">
          <p>The poem text will appear here once Keith Jarrett's commission is complete.</p>
          <p className="text-text-muted/60">
            Keith Jarrett is a former UK Poetry Slam Champion. His BBC Four film{' '}
            <em>Safest Spot in Town</em> (2017) — part of Mark Gatiss's <em>Queers</em> series
            — is set on the night of the Café de Paris bombing, 8 March 1941. The same world
            Ivor Cummings moved through.
          </p>
        </div>
      </section>

      {/* Context */}
      <div className="bg-compass-dark rounded-xl p-5 border border-compass-border">
        <p className="text-text-muted/50 text-xs leading-relaxed">
          This poem was commissioned as part of Ivor's Compass — a heritage wellness project
          supported by Croydon Council and the National Lottery Heritage Fund through the
          Samuel Coleridge-Taylor 150 Small Heritage Grant.
        </p>
      </div>
    </div>
  )
}
