import { useState, useEffect, useCallback } from 'react'
import { affirmations, phaseColours, type AffirmationCard } from '../data/affirmations'

const DRAWN_KEY = 'ivors-compass-drawn-today'
const FAVOURITES_KEY = 'ivors-compass-favourites'

function getTodayKey() {
  return new Date().toISOString().split('T')[0]
}

function getDailyCard(): AffirmationCard {
  const today = getTodayKey()
  // Deterministic "random" based on date
  const seed = today.split('-').reduce((a, b) => a + parseInt(b), 0)
  return affirmations[seed % affirmations.length]
}

export default function CardsPage() {
  const [view, setView] = useState<'draw' | 'browse'>('draw')
  const [currentCard, setCurrentCard] = useState<AffirmationCard | null>(null)
  const [isFlipped, setIsFlipped] = useState(false)
  const [hasDrawnToday, setHasDrawnToday] = useState(false)
  const [favourites, setFavourites] = useState<number[]>([])
  const [filterPhase, setFilterPhase] = useState<string | null>(null)

  useEffect(() => {
    try {
      const drawn = localStorage.getItem(DRAWN_KEY)
      if (drawn === getTodayKey()) {
        setHasDrawnToday(true)
        setCurrentCard(getDailyCard())
        setIsFlipped(true)
      }
      const favs = localStorage.getItem(FAVOURITES_KEY)
      if (favs) setFavourites(JSON.parse(favs))
    } catch {}
  }, [])

  const drawCard = useCallback(() => {
    setIsFlipped(false)
    const card = getDailyCard()
    setTimeout(() => {
      setCurrentCard(card)
      setIsFlipped(true)
      setHasDrawnToday(true)
      try { localStorage.setItem(DRAWN_KEY, getTodayKey()) } catch {}
    }, 300)
  }, [])

  const toggleFavourite = (id: number) => {
    setFavourites(prev => {
      const next = prev.includes(id) ? prev.filter(f => f !== id) : [...prev, id]
      try { localStorage.setItem(FAVOURITES_KEY, JSON.stringify(next)) } catch {}
      return next
    })
  }

  const filteredCards = filterPhase
    ? affirmations.filter(c => c.phase === filterPhase)
    : affirmations

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Tabs */}
      <div className="flex gap-2">
        <button
          onClick={() => setView('draw')}
          className={`px-4 py-2 rounded-lg text-sm transition-colors ${view === 'draw' ? 'bg-gold-rich text-black font-medium' : 'bg-compass-dark text-text-muted'}`}
        >
          Draw a Card
        </button>
        <button
          onClick={() => setView('browse')}
          className={`px-4 py-2 rounded-lg text-sm transition-colors ${view === 'browse' ? 'bg-gold-rich text-black font-medium' : 'bg-compass-dark text-text-muted'}`}
        >
          Browse All
        </button>
      </div>

      {view === 'draw' ? (
        <div className="flex flex-col items-center py-8">
          {/* Card */}
          <div className="card-flip w-72 h-96 mx-auto">
            <div className={`card-flip-inner w-full h-full ${isFlipped ? 'flipped' : ''}`}>
              {/* Front — face down */}
              <div className="card-face absolute inset-0 bg-gradient-to-br from-terracotta to-terracotta-dark rounded-2xl border-2 border-gold/30 flex items-center justify-center shadow-2xl">
                <div className="text-center">
                  <svg viewBox="0 0 24 24" className="w-12 h-12 text-gold/60 mx-auto mb-3" fill="none" stroke="currentColor" strokeWidth="1">
                    <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" />
                  </svg>
                  <p className="font-heritage text-gold/60 text-sm">Ivor's Compass</p>
                </div>
              </div>

              {/* Back — revealed */}
              <div className="card-back absolute inset-0 bg-compass-dark rounded-2xl border-2 border-gold/40 flex items-center justify-center p-8 shadow-2xl archival-texture overflow-hidden">
                {currentCard && (
                  <div className="text-center space-y-6">
                    <p className="text-white text-lg leading-relaxed font-light italic">
                      "{currentCard.text}"
                    </p>
                    <span className={`inline-block text-xs px-3 py-1 rounded-full ${phaseColours[currentCard.phase].bg}/20 ${phaseColours[currentCard.phase].text}`}>
                      {phaseColours[currentCard.phase].label}
                    </span>
                    <button
                      onClick={(e) => { e.stopPropagation(); toggleFavourite(currentCard.id) }}
                      className="block mx-auto text-gold/60 hover:text-gold transition-colors"
                      aria-label={favourites.includes(currentCard.id) ? 'Remove from favourites' : 'Save to favourites'}
                    >
                      <svg className="w-6 h-6" fill={favourites.includes(currentCard.id) ? 'currentColor' : 'none'} viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
                      </svg>
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Draw button */}
          <button
            onClick={drawCard}
            disabled={hasDrawnToday}
            className="mt-8 px-6 py-3 bg-gold-rich hover:bg-gold text-black font-semibold rounded-lg transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
          >
            {hasDrawnToday ? 'Come back tomorrow for a new card' : 'Draw your card'}
          </button>

          {hasDrawnToday && (
            <p className="text-text-muted/60 text-xs mt-3">
              Sit with today's card. Let it work on you.
            </p>
          )}
        </div>
      ) : (
        /* Browse view */
        <div className="space-y-4">
          {/* Phase filters */}
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setFilterPhase(null)}
              className={`px-3 py-1 rounded-full text-xs transition-colors ${!filterPhase ? 'bg-white/10 text-white' : 'bg-compass-dark text-text-muted'}`}
            >
              All ({affirmations.length})
            </button>
            {Object.entries(phaseColours).map(([phase, c]) => (
              <button
                key={phase}
                onClick={() => setFilterPhase(phase)}
                className={`px-3 py-1 rounded-full text-xs transition-colors ${filterPhase === phase ? `${c.bg}/30 ${c.text}` : 'bg-compass-dark text-text-muted'}`}
              >
                {c.label}
              </button>
            ))}
            {favourites.length > 0 && (
              <button
                onClick={() => setFilterPhase('favourites')}
                className={`px-3 py-1 rounded-full text-xs transition-colors ${filterPhase === 'favourites' ? 'bg-gold/20 text-gold' : 'bg-compass-dark text-text-muted'}`}
              >
                Saved ({favourites.length})
              </button>
            )}
          </div>

          {/* Cards grid */}
          <div className="space-y-3">
            {(filterPhase === 'favourites'
              ? affirmations.filter(c => favourites.includes(c.id))
              : filteredCards
            ).map(card => (
              <div
                key={card.id}
                className={`bg-compass-dark border ${phaseColours[card.phase].border}/20 rounded-xl p-5 relative`}
              >
                <p className="text-white text-sm leading-relaxed italic pr-8">
                  "{card.text}"
                </p>
                <div className="flex items-center justify-between mt-3">
                  <span className={`text-xs ${phaseColours[card.phase].text}/60`}>
                    {phaseColours[card.phase].label}
                  </span>
                  <button
                    onClick={() => toggleFavourite(card.id)}
                    className="text-gold/40 hover:text-gold transition-colors"
                  >
                    <svg className="w-4 h-4" fill={favourites.includes(card.id) ? 'currentColor' : 'none'} viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
                    </svg>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
