import { Link } from 'react-router-dom'
import { meditations } from '../data/meditations'

const sections = [
  {
    to: '/compass/film',
    icon: '🎬',
    title: 'The Film',
    subtitle: "Watch Ivor's story",
    detail: '3 min • AI-animated',
    accent: 'border-gold/30 hover:border-gold/60',
  },
  {
    to: '/compass/meditation/1',
    icon: '📝',
    title: 'Heritage Meditations',
    subtitle: 'Six reflections on a life',
    detail: '6 writers • 6 chapters',
    accent: 'border-terracotta/30 hover:border-terracotta/60',
    browse: true,
  },
  {
    to: '/compass/poem',
    icon: '🎤',
    title: 'The Poem',
    subtitle: 'Keith Jarrett',
    detail: 'Listen • 3 min',
    accent: 'border-gold/30 hover:border-gold/60',
  },
  {
    to: '/compass/cards',
    icon: '🃏',
    title: 'Affirmation Cards',
    subtitle: 'Draw your daily card',
    detail: 'Deck of 30+',
    accent: 'border-terracotta/30 hover:border-terracotta/60',
  },
  {
    to: '/compass/mood',
    icon: '🌤',
    title: 'Mood Check-in',
    subtitle: 'How are you arriving today?',
    detail: 'Track patterns • Suggest journal phases',
    accent: 'border-gold/30 hover:border-gold/60',
  },
  {
    to: '/compass/workshops',
    icon: '🧭',
    title: 'Workshops',
    subtitle: 'Self-guided mini-journeys',
    detail: '6 workshops • Anxiety, Anger, Shame & more',
    accent: 'border-terracotta/30 hover:border-terracotta/60',
  },
  {
    to: '/compass/journal',
    icon: '📓',
    title: 'Your Journal',
    subtitle: 'Private. On your device.',
    detail: 'Never leaves your phone',
    accent: 'border-gold/30 hover:border-gold/60',
  },
  {
    to: '/compass/about',
    icon: 'ℹ️',
    title: 'About Ivor Cummings',
    subtitle: 'The gay father of Windrush',
    detail: '1913–1992',
    accent: 'border-compass-border hover:border-gold/40',
  },
]

export default function HomePage() {
  return (
    <div className="space-y-3 stagger">
      {/* Hero */}
      <div className="text-center py-6">
        <h1 className="font-heritage text-3xl text-white mb-2">Ivor's Compass</h1>
        <p className="text-gold-rich text-sm italic">Your compass. Your pace. Your story.</p>
      </div>

      {/* Section cards */}
      {sections.map((s) => (
        <Link
          key={s.to}
          to={s.to}
          className={`block bg-compass-dark border ${s.accent} rounded-xl p-5 transition-all active:scale-[0.98]`}
        >
          <div className="flex items-start gap-4">
            <span className="text-2xl mt-0.5">{s.icon}</span>
            <div className="flex-1 min-w-0">
              <h2 className="font-heritage text-lg text-white">{s.title}</h2>
              <p className="text-text-muted text-sm mt-0.5">{s.subtitle}</p>
              <p className="text-text-muted/50 text-xs mt-1">{s.detail}</p>
            </div>
            <svg className="w-5 h-5 text-text-muted/30 mt-1 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
            </svg>
          </div>
        </Link>
      ))}

      {/* Meditations list (expandable) */}
      <div className="bg-compass-dark border border-terracotta/20 rounded-xl p-5">
        <h3 className="font-heritage text-sm text-terracotta mb-3">Six Chapters of a Life</h3>
        <div className="space-y-2">
          {meditations.map((m) => (
            <Link
              key={m.id}
              to={`/compass/meditation/${m.id}`}
              className="flex items-center justify-between py-2 px-3 rounded-lg hover:bg-compass-black/50 transition-colors"
            >
              <div className="flex items-center gap-3">
                <span className="w-6 h-6 rounded-full bg-terracotta/20 text-terracotta text-xs flex items-center justify-center font-medium">
                  {m.id}
                </span>
                <span className="text-sm text-white">{m.title}</span>
              </div>
              <span className="text-xs text-text-muted/40">{m.phase ? m.phase : m.era}</span>
            </Link>
          ))}
        </div>
      </div>

      {/* Crisis support link */}
      <Link
        to="/compass/crisis"
        className="block bg-compass-dark border border-red-700/40 hover:border-red-600/60 rounded-xl p-5 transition-all active:scale-[0.98]"
      >
        <div className="flex items-start gap-4">
          <svg className="w-6 h-6 text-red-400 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
          </svg>
          <div className="flex-1 min-w-0">
            <h2 className="font-heritage text-lg text-white">Need Support?</h2>
            <p className="text-text-muted text-sm mt-0.5">Crisis helplines, grounding exercises, and care</p>
            <p className="text-red-400/60 text-xs mt-1">Get help now</p>
          </div>
          <svg className="w-5 h-5 text-text-muted/30 mt-1 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
          </svg>
        </div>
      </Link>
    </div>
  )
}
