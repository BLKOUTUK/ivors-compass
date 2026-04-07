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
      {/* Hero image placeholder with archival texture */}
      <div className="aspect-video rounded-xl bg-gradient-to-br from-compass-card to-compass-dark border border-compass-border flex items-center justify-center relative overflow-hidden archival-texture">
        <div className="absolute inset-0 bg-gradient-to-t from-compass-black/80 to-transparent z-[2]" />
        <div className="relative z-10 text-center">
          <span className="text-6xl font-heritage text-gold/20">{meditation.id}</span>
        </div>
        <p className="absolute bottom-3 left-3 text-[10px] text-text-muted/60 italic z-[3]">{meditation.imageAlt}</p>
      </div>

      {/* Title */}
      <div>
        <p className="text-terracotta text-xs font-medium tracking-wider uppercase mb-1">
          Chapter {meditation.id} of 6 · {chapterLabel}
        </p>
        <h1 className="font-heritage text-3xl text-white">{meditation.title}</h1>
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

      {/* Essay */}
      <section className="bg-compass-dark border border-compass-border rounded-xl p-6">
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
