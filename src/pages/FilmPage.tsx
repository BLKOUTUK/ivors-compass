export default function FilmPage() {
  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div className="text-center py-4">
        <p className="text-terracotta text-xs font-medium tracking-wider uppercase mb-2">
          Promotional Film
        </p>
        <h1 className="font-heritage text-3xl text-white mb-1">Ivor's Compass</h1>
        <p className="text-text-muted text-sm">3 minutes • AI-animated • 6 artist styles</p>
      </div>

      {/* Video player area */}
      <div className="relative aspect-video rounded-xl border-2 border-gold/20 bg-compass-dark overflow-hidden">
        {/* Placeholder until film is ready */}
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-gradient-to-br from-compass-card to-compass-black">
          {/* Decorative compass */}
          <svg viewBox="0 0 24 24" className="w-16 h-16 text-gold/20 mb-4" fill="none" stroke="currentColor" strokeWidth="0.75">
            <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" />
          </svg>
          <p className="text-gold/40 font-heritage text-lg">Coming Soon</p>
          <p className="text-text-muted/30 text-xs mt-2 max-w-xs text-center px-4">
            Six scenes from Ivor Cummings' life, each animated in the style of a
            different Black British queer artist
          </p>
        </div>

        {/* When video is available, replace with:
        <video
          controls
          className="w-full h-full object-cover"
          poster="/images/film-poster.jpg"
        >
          <source src="/video/ivors-compass.mp4" type="video/mp4" />
        </video>
        */}
      </div>

      {/* Scene breakdown */}
      <section className="space-y-3">
        <h2 className="font-heritage text-lg text-gold-rich">Six Scenes</h2>
        {[
          { num: 1, title: 'Hartlepool Origins', artist: 'Style of Ingrid Pollard', desc: 'A child between two worlds — Sierra Leone and northeast England' },
          { num: 2, title: 'Aggrey House', artist: 'Style of Isaac Julien', desc: 'Building community among London\'s colonial students' },
          { num: 3, title: 'The Colonial Office', artist: 'Style of Larry Achiampong', desc: 'Working within the machinery of empire' },
          { num: 4, title: 'Tilbury Docks', artist: 'Style of Ajamu X', desc: 'Welcoming the Windrush generation to England' },
          { num: 5, title: 'Queer Life', artist: 'Style of Rotimi Fani-Kayode', desc: 'Love and desire in a criminalised world' },
          { num: 6, title: 'Legacy', artist: 'Style of Joy Gregory', desc: 'A story lost and found again' },
        ].map(scene => (
          <div
            key={scene.num}
            className="bg-compass-dark border border-compass-border rounded-lg p-4 flex gap-4"
          >
            <span className="w-8 h-8 rounded-full bg-gold/10 text-gold text-sm flex items-center justify-center flex-shrink-0 font-medium">
              {scene.num}
            </span>
            <div>
              <h3 className="text-white text-sm font-medium">{scene.title}</h3>
              <p className="text-terracotta text-xs mt-0.5">{scene.artist}</p>
              <p className="text-text-muted/50 text-xs mt-1">{scene.desc}</p>
            </div>
          </div>
        ))}
      </section>

      {/* Credits */}
      <div className="bg-compass-card rounded-xl p-5 border border-compass-border text-center">
        <p className="text-text-muted/40 text-xs leading-relaxed">
          Film produced using AI image generation and Remotion video composition.
          Spoken word poem by Keith Jarrett.
          A BLKOUT Creative production for the SCT 150 Small Heritage Grant.
        </p>
      </div>
    </div>
  )
}
