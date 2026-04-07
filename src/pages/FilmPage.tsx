import { useRef, useState } from 'react'

// ---------------------------------------------------------------------------
// AudioPlayer — minimal, heritage-styled
// ---------------------------------------------------------------------------

function AudioPlayer({ src, title }: { src: string; title: string }) {
  const ref = useRef<HTMLAudioElement>(null)
  const [playing, setPlaying] = useState(false)
  const [progress, setProgress] = useState(0)
  const [duration, setDuration] = useState(0)

  function toggle() {
    if (!ref.current) return
    if (playing) {
      ref.current.pause()
    } else {
      ref.current.play()
    }
    setPlaying(!playing)
  }

  function onTimeUpdate() {
    if (!ref.current) return
    setProgress(ref.current.currentTime)
  }

  function onLoadedMetadata() {
    if (!ref.current) return
    setDuration(ref.current.duration)
  }

  function onEnded() {
    setPlaying(false)
    setProgress(0)
  }

  function seek(e: React.MouseEvent<HTMLDivElement>) {
    if (!ref.current || !duration) return
    const rect = e.currentTarget.getBoundingClientRect()
    const pct = (e.clientX - rect.left) / rect.width
    ref.current.currentTime = pct * duration
  }

  function formatTime(s: number): string {
    const m = Math.floor(s / 60)
    const sec = Math.floor(s % 60)
    return `${m}:${sec.toString().padStart(2, '0')}`
  }

  const pct = duration > 0 ? (progress / duration) * 100 : 0

  return (
    <div className="bg-compass-dark border border-gold/20 rounded-xl p-6 space-y-4">
      <audio
        ref={ref}
        src={src}
        preload="metadata"
        onTimeUpdate={onTimeUpdate}
        onLoadedMetadata={onLoadedMetadata}
        onEnded={onEnded}
      />

      <div className="text-center">
        <h2 className="font-heritage text-lg text-white">{title}</h2>
        <p className="text-text-muted/50 text-xs mt-1">Audio introduction</p>
      </div>

      {/* Play button */}
      <div className="flex justify-center">
        <button
          onClick={toggle}
          className="w-16 h-16 rounded-full border-2 border-gold/40 flex items-center justify-center transition-all hover:border-gold/70 hover:shadow-[0_0_24px_rgba(212,175,55,0.2)] active:scale-95"
          style={{ backgroundColor: playing ? '#D4AF3715' : 'transparent' }}
        >
          {playing ? (
            <svg className="w-6 h-6 text-gold" fill="currentColor" viewBox="0 0 24 24">
              <path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z" />
            </svg>
          ) : (
            <svg className="w-6 h-6 text-gold ml-1" fill="currentColor" viewBox="0 0 24 24">
              <path d="M8 5v14l11-7z" />
            </svg>
          )}
        </button>
      </div>

      {/* Progress bar */}
      <div className="space-y-1">
        <div
          className="h-1.5 rounded-full bg-compass-border cursor-pointer"
          onClick={seek}
        >
          <div
            className="h-full rounded-full transition-all duration-200"
            style={{ width: `${pct}%`, backgroundColor: '#D4AF37' }}
          />
        </div>
        <div className="flex justify-between text-[10px] text-text-muted/60">
          <span>{formatTime(progress)}</span>
          <span>{duration > 0 ? formatTime(duration) : '--:--'}</span>
        </div>
      </div>
    </div>
  )
}

// ---------------------------------------------------------------------------
// FilmPage
// ---------------------------------------------------------------------------

export default function FilmPage() {
  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div className="text-center py-4">
        <h1 className="font-bold-shell text-3xl text-white mb-1">Meet Ivor</h1>
        <p className="text-text-muted text-sm">
          The gay father of the Windrush generation
        </p>
      </div>

      {/* Archive portrait */}
      <figure className="rounded-xl overflow-hidden border border-gold/20">
        <img
          src="/images/ivor-1974.jpg"
          alt="Ivor Cummings interviewed for the BBC documentary The Black Man in Britain 1550-1950, 1974"
          className="w-full h-auto block"
          loading="eager"
        />
        <figcaption className="bg-compass-dark px-4 py-3 text-text-muted/50 text-xs italic text-center">
          BBC, <em>The Black Man in Britain 1550&ndash;1950</em>, 1974
        </figcaption>
      </figure>

      {/* Audio intro */}
      <AudioPlayer src="/audio/meet-ivor.mp3" title="Meet Ivor Cummings" />

      {/* Context */}
      <div className="bg-compass-card border border-compass-border rounded-xl p-6">
        <p className="text-text-muted text-sm leading-relaxed">
          Ivor Gustavus Cummings OBE (1913&ndash;1992) was the first Black official in the
          Colonial Office, stood on Tilbury Docks to welcome the Windrush generation in 1948,
          and lived as a proudly gay man across every chapter of his life. His story fell through
          the gaps of history for over thirty years &mdash; too queer for Windrush narratives,
          too Black for LGBTQ+ histories &mdash; until historians including Stephen Bourne and
          Nicholas Boston recovered it.
        </p>
        <p className="text-text-muted text-sm leading-relaxed mt-4">
          This journal is built around six chapters of his life. Each one connects his
          experience to yours &mdash; through guided reflection, journaling prompts, and
          affirmations designed for Black queer men.
        </p>
      </div>

      {/* Video section — placeholder until YouTube links are ready */}
      <section className="space-y-3">
        <h2 className="font-heritage text-lg text-gold-rich">Video</h2>

        <div
          id="video-container"
          className="relative aspect-video rounded-xl border border-gold/20 bg-compass-dark overflow-hidden"
        >
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <svg viewBox="0 0 24 24" className="w-12 h-12 text-gold/20 mb-3" fill="none" stroke="currentColor" strokeWidth="0.75">
              <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" />
            </svg>
            <p className="text-gold/40 font-heritage text-sm">Video coming soon</p>
            <p className="text-text-muted/60 text-xs mt-1">Being uploaded to YouTube</p>
          </div>
        </div>
      </section>

      {/* Credits */}
      <div className="bg-compass-card rounded-xl p-5 border border-compass-border text-center">
        <p className="text-text-muted/60 text-xs leading-relaxed">
          Audio and video generated using Google NotebookLM from research sources
          including Stephen Bourne, Nicholas Boston, and the National Archives.
          <br />
          A BLKOUT Creative production for the SCT 150 Small Heritage Grant.
        </p>
      </div>
    </div>
  )
}
