import { Link } from 'react-router-dom'
import { useLifeOfIvor, type ChapterPage } from '../hooks/useLifeOfIvor'
import { Divider } from '../components/ui'

// ─────────────────────────────────────────────────────────
// Participant slot — empty
// ─────────────────────────────────────────────────────────

function EmptySlot({ chapter }: { chapter: ChapterPage }) {
  return (
    <div
      className="aspect-[16/10] rounded-xl border-2 border-dashed flex flex-col items-center justify-center gap-3 p-6 text-center archival-texture"
      style={{ borderColor: chapter.beat.colour + '60' }}
    >
      <div
        className="w-3 h-3 rounded-full animate-pulse"
        style={{ backgroundColor: chapter.beat.colour }}
      />
      <p className="font-heritage text-gold/80 text-sm italic leading-relaxed max-w-xs">
        "{chapter.beat.compassPrompt}"
      </p>
      <p className="text-text-muted/40 text-xs">
        Waiting for Table {chapter.beat.tableId}...
      </p>
    </div>
  )
}

// ─────────────────────────────────────────────────────────
// Participant slot — filled
// ─────────────────────────────────────────────────────────

function FilledSlot({ chapter }: { chapter: ChapterPage }) {
  const panel = chapter.panel!
  return (
    <div className="space-y-3">
      <div className="rounded-xl overflow-hidden border-2 border-gold/40 shadow-[0_0_20px_rgba(255,215,0,0.15)]">
        <img
          src={panel.generated_image_url!}
          alt={panel.scene_description || 'Community-generated panel'}
          className="w-full h-auto block"
        />
      </div>
      {panel.caption && (
        <div className="border-l-3 border-gold/60 pl-4 py-2" style={{ borderLeftWidth: 3, borderLeftColor: chapter.beat.colour }}>
          <p className="font-heritage text-warm-white/90 text-sm italic leading-relaxed">
            {panel.caption}
          </p>
        </div>
      )}
      {panel.speech_bubble && (
        <div className="bg-warm-white/5 border border-warm-white/10 rounded-lg px-4 py-3 relative">
          <p className="text-warm-white text-sm leading-relaxed">
            "{panel.speech_bubble}"
          </p>
        </div>
      )}
    </div>
  )
}

// ─────────────────────────────────────────────────────────
// AI page
// ─────────────────────────────────────────────────────────

function AIPage({ chapter }: { chapter: ChapterPage }) {
  const imagePath = `/images/comic/page-${chapter.beat.page}.png`
  return (
    <div className="space-y-3">
      <div className="rounded-xl overflow-hidden border border-gold/20">
        <img
          src={imagePath}
          alt={chapter.beat.scene}
          className="w-full h-auto block"
          loading="lazy"
          onError={(e) => {
            // Hide if image not yet generated
            (e.target as HTMLImageElement).style.display = 'none'
          }}
        />
      </div>
      {chapter.beat.caption && chapter.beat.page !== 1 && (
        <div className="border-l-3 pl-4 py-2" style={{ borderLeftWidth: 3, borderLeftColor: chapter.beat.colour }}>
          <p className="font-heritage text-warm-white/90 text-sm italic leading-relaxed">
            {chapter.beat.caption}
          </p>
        </div>
      )}
      {chapter.beat.dialogue && chapter.beat.page !== 1 && (
        <div className="bg-warm-white/5 border border-warm-white/10 rounded-lg px-4 py-3">
          <p className="text-warm-white text-sm leading-relaxed">
            "{chapter.beat.dialogue}"
          </p>
        </div>
      )}
    </div>
  )
}

// ─────────────────────────────────────────────────────────
// Photo page (finale)
// ─────────────────────────────────────────────────────────

function PhotoPage({ photoUrl }: { photoUrl: string | null }) {
  if (!photoUrl) {
    return (
      <div className="aspect-video rounded-xl border-2 border-dashed border-gold/30 flex flex-col items-center justify-center gap-3 p-6 text-center">
        <p className="text-text-muted/50 text-sm">The final page will be a photograph from today.</p>
      </div>
    )
  }

  return (
    <div className="rounded-xl overflow-hidden border-2 border-gold/40">
      <img src={photoUrl} alt="The workshop — Stanley Arts, 12 April 2026" className="w-full h-auto block" />
    </div>
  )
}

// ─────────────────────────────────────────────────────────
// Direction badge
// ─────────────────────────────────────────────────────────

function DirectionBadge({ chapter }: { chapter: ChapterPage }) {
  if (!chapter.beat.direction) return null
  return (
    <div className="flex items-center gap-2 mb-2">
      <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: chapter.beat.colour }} />
      <span
        className="text-xs font-bold tracking-[0.3em] uppercase"
        style={{ color: chapter.beat.colour }}
      >
        {chapter.beat.direction}
      </span>
    </div>
  )
}

// ─────────────────────────────────────────────────────────
// Main page
// ─────────────────────────────────────────────────────────

export default function LifeOfIvorPage() {
  const { chapters, loading, filledCount, totalSlots, workshopPhoto } = useLifeOfIvor()

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="w-8 h-8 border-2 border-gold border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  return (
    <article className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="text-center space-y-3 py-4">
        <h1 className="font-bold-shell text-2xl text-white title-underline inline-block" style={{ '--accent-color': '#D4AF37' } as React.CSSProperties}>
          The Life of Ivor
        </h1>
        <p className="font-heritage text-gold/70 text-sm italic">
          A community-generated graphic novel
        </p>
        <p className="text-text-muted/50 text-xs">
          {filledCount} of {totalSlots} community panels
        </p>
      </div>

      {/* Pages */}
      <div className="space-y-10 stagger">
        {chapters.map((chapter) => (
          <section key={chapter.beat.page} className="space-y-2">
            {/* Era label for participant pages */}
            {chapter.beat.type === 'participant' && (
              <>
                <DirectionBadge chapter={chapter} />
                <p className="text-text-muted/40 text-xs">{chapter.beat.era}</p>
              </>
            )}

            {/* Render based on type */}
            {chapter.beat.type === 'ai' && <AIPage chapter={chapter} />}
            {chapter.beat.type === 'participant' && (
              chapter.panel?.generated_image_url
                ? <FilledSlot chapter={chapter} />
                : <EmptySlot chapter={chapter} />
            )}
            {chapter.beat.type === 'photo' && (
              <PhotoPage photoUrl={workshopPhoto} />
            )}

            {/* Era label for AI pages */}
            {chapter.beat.type === 'ai' && chapter.beat.page !== 1 && (
              <p className="text-text-muted/30 text-[10px] text-right">{chapter.beat.era}</p>
            )}
          </section>
        ))}
      </div>

      <Divider />

      {/* CTA */}
      <div className="bg-compass-card border border-gold/20 rounded-xl p-6 text-center space-y-4">
        <p className="font-heritage text-gold/80 text-sm italic leading-relaxed">
          Ivor's story continues. The meditations go deeper. The journal is yours.
        </p>
        <Link
          to="/compass"
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-gold-rich/10 border border-gold-rich/30 text-gold-rich text-sm rounded-lg hover:bg-gold-rich/20 transition-colors"
        >
          Enter the journal
        </Link>
      </div>
    </article>
  )
}
