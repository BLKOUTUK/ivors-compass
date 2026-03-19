const timeline = [
  {
    era: '1913',
    title: 'Born in West Hartlepool',
    text: 'Ivor Gustavus Cummings is born to a Sierra Leonean father and an English mother in the industrial northeast of England. Through Sierra Leonean kinship networks, he is a distant cousin of the celebrated Croydon-born composer Samuel Coleridge-Taylor.',
  },
  {
    era: '1920s',
    title: 'Croydon Childhood',
    text: 'The family settles in Addiscombe, Croydon. Ivor attends Whitgift School. Jessie Walmisley Coleridge-Taylor — the composer\'s widow — befriends the young Ivor, connecting him to Croydon\'s musical heritage.',
  },
  {
    era: '1930s',
    title: 'Aggrey House',
    text: 'In London, Ivor becomes part of the Black intellectual community at Aggrey House, Bloomsbury — a hostel and social centre for colonial students. He builds the networks of care and connection that will define his life\'s work.',
  },
  {
    era: '1940s',
    title: 'The Colonial Office',
    text: 'Ivor becomes the first Black official in the Colonial Office. Working within the institution that administers the British Empire, he advocates for the welfare of colonial students and workers in Britain.',
  },
  {
    era: '1948',
    title: 'Tilbury Docks',
    text: 'On 22 June, the HMT Empire Windrush docks at Tilbury carrying 492 passengers from the Caribbean. Ivor Cummings is there in his official capacity — one of the first people the Windrush generation sees on English soil.',
  },
  {
    era: '1950s–70s',
    title: 'Queer Life',
    text: 'Ivor lives as a proudly gay man in an era when homosexuality is criminalised. Too queer for Windrush narratives, too Black for LGBTQ+ histories — he exists at an intersection neither community fully acknowledges.',
  },
  {
    era: '1992',
    title: 'Death and Silence',
    text: 'Ivor Cummings dies. For more than thirty years, his story falls through the gaps of history — forgotten by the narratives that should have claimed him.',
  },
  {
    era: '2010–12',
    title: 'Recovery',
    text: 'Historian Stephen Bourne recovers Ivor\'s story through painstaking research in the National Archives. He writes Ivor\'s biography for the Oxford Dictionary of National Biography (2012) and includes his story in Mother Country (2010).',
  },
  {
    era: '2019',
    title: '"The Gay Father of Windrush"',
    text: 'Nicholas Boston, writing in The Independent on 25 June, describes Ivor as "the gay father of the Windrush generation" — a phrase that captures both the care he extended to new arrivals and the queerness that history chose to forget.',
  },
  {
    era: '2026',
    title: 'Ivor\'s Compass',
    text: 'This project — supported by Croydon Council and the National Lottery Heritage Fund through the Samuel Coleridge-Taylor 150 Small Heritage Grant — reclaims Ivor\'s story as a compass for reflection, healing, and community connection.',
  },
]

export default function AboutPage() {
  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div className="text-center py-4">
        <h1 className="font-heritage text-3xl text-white mb-2">Ivor Cummings</h1>
        <p className="text-gold-rich text-sm">1913–1992</p>
        <p className="text-text-muted text-xs mt-1 italic">
          "The gay father of the Windrush generation"
        </p>
        <p className="text-text-muted/40 text-[10px] mt-0.5">— Nicholas Boston, The Independent, 2019</p>
      </div>

      {/* Portrait placeholder */}
      <div className="aspect-[3/4] max-w-[200px] mx-auto rounded-xl bg-gradient-to-b from-compass-card to-compass-dark border border-gold/20 flex items-center justify-center">
        <div className="text-center p-4">
          <p className="text-text-muted/20 text-xs">Portrait</p>
          <p className="text-text-muted/10 text-[10px] mt-1">Historical image pending</p>
        </div>
      </div>

      {/* Intro */}
      <div className="bg-compass-dark border border-gold/20 rounded-xl p-6">
        <p className="text-text-muted text-sm leading-relaxed">
          Ivor Gustavus Cummings OBE was a Black British civil servant, community leader,
          and proudly gay man. He was the first Black official in the Colonial Office, stood
          on Tilbury Docks to welcome the Windrush generation in 1948, and was a distant
          cousin of the Croydon-born composer Samuel Coleridge-Taylor. His story was lost
          for over thirty years before being recovered by historian Stephen Bourne.
        </p>
      </div>

      {/* Timeline */}
      <section>
        <h2 className="font-heritage text-lg text-gold-rich mb-6">Timeline</h2>
        <div className="relative">
          {/* Vertical line */}
          <div className="absolute left-[39px] top-0 bottom-0 w-px bg-gradient-to-b from-gold/30 via-gold/10 to-transparent" />

          <div className="space-y-6">
            {timeline.map((entry, i) => (
              <div key={i} className="flex gap-4">
                {/* Year badge */}
                <div className="flex-shrink-0 w-20 text-right">
                  <span className="text-gold-rich text-xs font-medium">{entry.era}</span>
                </div>

                {/* Dot */}
                <div className="flex-shrink-0 relative">
                  <div className="w-2 h-2 rounded-full bg-gold/60 mt-1.5" />
                </div>

                {/* Content */}
                <div className="flex-1 pb-2">
                  <h3 className="text-white text-sm font-medium">{entry.title}</h3>
                  <p className="text-text-muted/60 text-xs leading-relaxed mt-1">
                    {entry.text}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Croydon connection */}
      <section className="bg-compass-card border border-terracotta/20 rounded-xl p-6">
        <h2 className="font-heritage text-lg text-terracotta mb-3">The Croydon Connection</h2>
        <p className="text-text-muted text-sm leading-relaxed">
          Ivor's connection to Croydon runs deep. He grew up in Addiscombe and attended
          Whitgift School — the same borough that was home to Samuel Coleridge-Taylor, the
          celebrated Black British composer. Through Sierra Leonean kinship, Ivor was
          Coleridge-Taylor's distant cousin. This project is part of the Samuel
          Coleridge-Taylor 150 celebrations, honouring the heritage that connects these
          two remarkable Croydonians across a century.
        </p>
      </section>

      {/* Further reading */}
      <section>
        <h2 className="font-heritage text-lg text-gold-rich mb-4">Further Reading</h2>
        <div className="space-y-3">
          {[
            {
              title: 'Mother Country: Britain\'s Black Community on the Home Front 1939–45',
              author: 'Stephen Bourne (2010)',
              desc: 'Includes Ivor\'s story in the context of wartime Black Britain',
            },
            {
              title: 'Oxford Dictionary of National Biography',
              author: 'Stephen Bourne (2012)',
              desc: 'Ivor Cummings\' official biographical entry',
            },
            {
              title: '"The gay father of the Windrush generation"',
              author: 'Nicholas Boston, The Independent (25 June 2019)',
              desc: 'The article that gave Ivor his title',
            },
            {
              title: 'Safest Spot in Town',
              author: 'Keith Jarrett, BBC Four Queers (2017)',
              desc: 'Set on the night of the Café de Paris bombing — the world Ivor moved through',
            },
          ].map((book, i) => (
            <div key={i} className="bg-compass-dark border border-compass-border rounded-lg p-4">
              <h3 className="text-white text-sm font-medium">{book.title}</h3>
              <p className="text-gold-rich/60 text-xs mt-0.5">{book.author}</p>
              <p className="text-text-muted/40 text-xs mt-1">{book.desc}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}
