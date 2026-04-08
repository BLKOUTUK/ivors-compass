import { useParams, Link } from 'react-router-dom'
import { meditations } from '../data/meditations'
import { Divider } from '../components/ui'

export default function MeditationPage() {
  const { id } = useParams()
  const index = parseInt(id || '1', 10) - 1
  const meditation = meditations[index]

  if (!meditation) {
    return (
      <div className="text-center py-20">
        <p className="text-text-muted">Meditation not found</p>
        <Link to="/compass" className="text-gold-rich text-sm mt-4 inline-block">← Back home</Link>
      </div>
    )
  }

  const prev = index > 0 ? meditations[index - 1] : null
  const next = index < meditations.length - 1 ? meditations[index + 1] : null

  const chapterLabel = meditation.phase
    ? `${meditation.phase} · ${meditation.phaseEnergy}`
    : index === 0 ? 'Introduction' : 'Conclusion'

  return (
    <article className="space-y-8 animate-fade-in">
      {/* Hero image */}
      <figure className="rounded-xl overflow-hidden border border-gold/20">
        <img
          src={meditation.image}
          alt={meditation.imageAlt}
          className="w-full h-auto block"
          loading="eager"
        />
      </figure>

      {/* Graphic novel link — Chapter 1 only */}
      {meditation.id === 1 && (
        <Link
          to="/compass/life-of-ivor"
          className="flex items-center gap-3 px-4 py-3 bg-gold/10 border border-gold/30 rounded-lg hover:bg-gold/20 transition-colors"
        >
          <svg className="w-5 h-5 text-gold shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" />
          </svg>
          <div>
            <p className="text-gold text-sm font-medium">The Life of Ivor</p>
            <p className="text-text-muted/60 text-xs">Community-generated graphic novel</p>
          </div>
        </Link>
      )}

      {/* Title */}
      <div>
        <p className="text-terracotta text-xs font-medium tracking-wider uppercase mb-1">
          Chapter {meditation.id} of 6 · {chapterLabel}
        </p>
        <h1 className="font-bold-shell text-3xl text-white title-underline" style={{ '--accent-color': 'var(--color-task-learning)' } as React.CSSProperties}>{meditation.title}</h1>
        <p className="text-gold-rich text-sm mt-1">{meditation.era}</p>
      </div>

      {/* Historical context */}
      <section className="space-y-4">
        <h2 className="font-heritage text-lg text-gold-rich">Historical Context</h2>
        {meditation.historicalContext.map((p, i) => (
          <p key={i} className="text-text-muted leading-relaxed text-sm">
            {p}
          </p>
        ))}
      </section>

      {/* Divider */}
      <Divider />

      {/* Essay — disruption gradient */}
      <section className="gradient-disruption border border-compass-border rounded-xl p-6">
        {meditation.meditationAuthor && (
          <h2 className="font-heritage text-lg text-white mb-4">
            {meditation.meditationAuthor}
          </h2>
        )}
        <div className="space-y-4">
          {meditation.meditationText.map((p, i) => (
            <p key={i} className="text-text-muted leading-relaxed text-sm">
              {p}
            </p>
          ))}
        </div>
        {meditation.meditationAuthorBio && (
          <p className="text-text-muted/50 text-xs mt-6 pt-4 border-t border-compass-border italic">
            {meditation.meditationAuthorBio}
          </p>
        )}
      </section>

      {/* Journal prompt */}
      <section className="bg-compass-card border border-gold/20 rounded-xl p-6">
        <h2 className="font-heritage text-sm text-gold-rich mb-3">Reflect</h2>
        <p className="text-gold/80 text-sm leading-relaxed italic mb-4">
          "{meditation.journalPrompt}"
        </p>

        {meditation.followUpQuestions.length > 0 && (
          <div className="space-y-2 mb-4 pl-4 border-l border-gold/10">
            {meditation.followUpQuestions.map((q, i) => (
              <p key={i} className="text-text-muted/70 text-xs leading-relaxed italic">
                {q}
              </p>
            ))}
          </div>
        )}

        <Link
          to={`/compass/journal?prompt=${encodeURIComponent(meditation.journalPrompt)}`}
          className="mt-2 inline-flex items-center gap-2 px-4 py-2 bg-gold-rich/10 border border-gold-rich/30 text-gold-rich text-sm rounded-lg hover:bg-gold-rich/20 transition-colors"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931z" />
          </svg>
          Reflect in Journal
        </Link>
      </section>

      {/* Navigation */}
      <nav className="flex items-center justify-between pt-4 border-t border-compass-border">
        {prev ? (
          <Link to={`/compass/meditation/${prev.id}`} className="text-sm text-text-muted hover:text-gold transition-colors">
            ← {prev.title}
          </Link>
        ) : <span />}
        {next ? (
          <Link to={`/compass/meditation/${next.id}`} className="text-sm text-text-muted hover:text-gold transition-colors">
            {next.title} →
          </Link>
        ) : (
          <Link to="/compass" className="text-sm text-gold-rich hover:text-gold transition-colors">
            Return home →
          </Link>
        )}
      </nav>
    </article>
  )
}
