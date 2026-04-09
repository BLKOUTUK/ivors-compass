import { useState } from 'react'

// ---------------------------------------------------------------------------
// Data export
// ---------------------------------------------------------------------------

const JOURNAL_KEY = 'ivors-compass-journal'
const MOOD_KEY = 'ivors-compass-mood-tracker'
const LAUGHTER_KEY = 'ivors-compass-laughter'

interface JournalExport {
  id: string
  text: string
  prompt?: string
  phase?: string
  audioData?: string
  createdAt: string
}

interface MoodExport {
  date: string
  level: number
  note: string
}

interface LaughterExport {
  text: string
  date: string
}

const MOOD_LABELS: Record<number, string> = {
  1: 'Struggling',
  2: 'Low',
  3: 'Steady',
  4: 'Good',
  5: 'Thriving',
}

function formatExportDate(iso: string): string {
  try {
    return new Date(iso).toLocaleDateString('en-GB', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    })
  } catch {
    return iso
  }
}

function buildExportText(): string {
  const lines: string[] = []
  const divider = '─'.repeat(60)

  lines.push("IVOR'S COMPASS — YOUR JOURNAL")
  lines.push('Exported ' + formatExportDate(new Date().toISOString()))
  lines.push('This is yours. It never left your device until you chose to save it.')
  lines.push('')
  lines.push(divider)

  // Journal entries
  let journalEntries: JournalExport[] = []
  try {
    const raw = localStorage.getItem(JOURNAL_KEY)
    if (raw) journalEntries = JSON.parse(raw) as JournalExport[]
  } catch { /* empty */ }

  if (journalEntries.length > 0) {
    lines.push('')
    lines.push('JOURNAL ENTRIES')
    lines.push(divider)

    const sorted = [...journalEntries].sort(
      (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
    )

    for (const entry of sorted) {
      lines.push('')
      lines.push(formatExportDate(entry.createdAt))
      if (entry.phase) lines.push('Phase: ' + entry.phase)
      if (entry.prompt) lines.push('Prompt: ' + entry.prompt)
      lines.push('')
      if (entry.text) {
        lines.push(entry.text)
      }
      if (entry.audioData) {
        lines.push('[Voice recording attached — use the Download voice notes button to export audio]')
      }
      lines.push('')
      lines.push(divider)
    }
  }

  // Mood check-ins
  let moodEntries: MoodExport[] = []
  try {
    const raw = localStorage.getItem(MOOD_KEY)
    if (raw) moodEntries = JSON.parse(raw) as MoodExport[]
  } catch { /* empty */ }

  if (moodEntries.length > 0) {
    lines.push('')
    lines.push('MOOD CHECK-INS')
    lines.push(divider)

    const sorted = [...moodEntries].sort(
      (a, b) => a.date.localeCompare(b.date),
    )

    for (const entry of sorted) {
      const label = MOOD_LABELS[entry.level] || String(entry.level)
      lines.push('')
      lines.push(formatExportDate(entry.date + 'T12:00:00') + ' — ' + label)
      if (entry.note) lines.push(entry.note)
    }
    lines.push('')
    lines.push(divider)
  }

  // Laughter notes
  let laughterNotes: LaughterExport[] = []
  try {
    const raw = localStorage.getItem(LAUGHTER_KEY)
    if (raw) laughterNotes = JSON.parse(raw) as LaughterExport[]
  } catch { /* empty */ }

  if (laughterNotes.length > 0) {
    lines.push('')
    lines.push('LAUGHTER NOTES')
    lines.push(divider)

    const sorted = [...laughterNotes].sort(
      (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime(),
    )

    for (const note of sorted) {
      lines.push('')
      lines.push(formatExportDate(note.date))
      lines.push(note.text)
    }
    lines.push('')
    lines.push(divider)
  }

  // Empty state
  if (journalEntries.length === 0 && moodEntries.length === 0 && laughterNotes.length === 0) {
    lines.push('')
    lines.push('No entries yet. When you write, check in, or capture a laugh,')
    lines.push('you can come back here to download everything.')
  }

  lines.push('')
  lines.push('BLKOUT Creative Ltd · Community Benefit Society · FCA Registered')
  lines.push('blkoutuk.com')

  return lines.join('\n')
}

function downloadExport() {
  const text = buildExportText()
  const blob = new Blob([text], { type: 'text/plain;charset=utf-8' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = 'ivors-compass-journal.txt'
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
}

function dataURLtoBlob(dataURL: string): Blob | null {
  try {
    const [header, base64] = dataURL.split(',')
    const match = header.match(/data:([^;]+)/)
    const mime = match ? match[1] : 'audio/webm'
    const binary = atob(base64)
    const bytes = new Uint8Array(binary.length)
    for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i)
    return new Blob([bytes], { type: mime })
  } catch {
    return null
  }
}

function extFromMime(mime: string): string {
  if (mime.includes('webm')) return 'webm'
  if (mime.includes('ogg')) return 'ogg'
  if (mime.includes('mp4')) return 'm4a'
  if (mime.includes('mpeg')) return 'mp3'
  if (mime.includes('wav')) return 'wav'
  return 'webm'
}

function countVoiceNotes(): number {
  try {
    const raw = localStorage.getItem(JOURNAL_KEY)
    if (!raw) return 0
    const entries = JSON.parse(raw) as JournalExport[]
    return entries.filter((e) => e.audioData).length
  } catch {
    return 0
  }
}

function downloadVoiceNotes(): number {
  let entries: JournalExport[] = []
  try {
    const raw = localStorage.getItem(JOURNAL_KEY)
    if (raw) entries = JSON.parse(raw) as JournalExport[]
  } catch { /* empty */ }

  const withAudio = entries
    .filter((e) => e.audioData)
    .sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime())

  let downloaded = 0
  withAudio.forEach((entry, i) => {
    const blob = dataURLtoBlob(entry.audioData!)
    if (!blob) return
    const ext = extFromMime(blob.type)
    const date = entry.createdAt.split('T')[0]
    const filename = `ivors-compass-voice-${date}-${String(i + 1).padStart(2, '0')}.${ext}`
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = filename
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    setTimeout(() => URL.revokeObjectURL(url), 1000)
    downloaded++
  })

  return downloaded
}

// ---------------------------------------------------------------------------
// ExportButton component
// ---------------------------------------------------------------------------

function ExportButton() {
  const [textDone, setTextDone] = useState(false)
  const [audioDone, setAudioDone] = useState<number | null>(null)
  const voiceCount = countVoiceNotes()

  function handleText() {
    downloadExport()
    setTextDone(true)
    setTimeout(() => setTextDone(false), 3000)
  }

  function handleAudio() {
    const n = downloadVoiceNotes()
    setAudioDone(n)
    setTimeout(() => setAudioDone(null), 4000)
  }

  return (
    <div className="flex flex-wrap gap-3">
      <button
        onClick={handleText}
        className="inline-flex items-center gap-2 px-4 py-2 bg-gold-rich/10 border border-gold-rich/30 text-gold-rich text-sm rounded-lg hover:bg-gold-rich/20 transition-colors active:scale-[0.98]"
      >
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
          <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
        </svg>
        {textDone ? 'Downloaded' : 'Download written journal'}
      </button>

      {voiceCount > 0 && (
        <button
          onClick={handleAudio}
          className="inline-flex items-center gap-2 px-4 py-2 bg-terracotta/10 border border-terracotta/30 text-terracotta text-sm rounded-lg hover:bg-terracotta/20 transition-colors active:scale-[0.98]"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 18.75a6 6 0 006-6v-1.5m-6 7.5a6 6 0 01-6-6v-1.5m6 7.5v3.75m-3.75 0h7.5M12 15.75a3 3 0 01-3-3V4.5a3 3 0 116 0v8.25a3 3 0 01-3 3z" />
          </svg>
          {audioDone !== null
            ? `Downloaded ${audioDone} recording${audioDone === 1 ? '' : 's'}`
            : `Download voice notes (${voiceCount})`}
        </button>
      )}
    </div>
  )
}

// ---------------------------------------------------------------------------
// Timeline data
// ---------------------------------------------------------------------------

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
        <h1 className="font-bold-shell text-3xl text-white mb-2 title-underline" style={{ '--accent-color': 'var(--color-task-learning)' } as React.CSSProperties}>Ivor Cummings</h1>
        <p className="text-gold-rich text-sm">1913–1992</p>
        <p className="text-text-muted text-xs mt-1 italic">
          "The gay father of the Windrush generation"
        </p>
        <p className="text-text-muted/60 text-[10px] mt-0.5">— Nicholas Boston, The Independent, 2019</p>
      </div>

      {/* Portrait */}
      <figure className="max-w-[260px] mx-auto">
        <div className="rounded-xl overflow-hidden border border-gold/20">
          <img
            src="/images/ivor-1974.jpg"
            alt="Ivor Cummings, BBC interview 1974"
            className="w-full h-auto block"
            loading="lazy"
          />
        </div>
        <figcaption className="text-text-muted/60 text-[10px] italic text-center mt-2">
          BBC, <em>The Black Man in Britain 1550&ndash;1950</em>, 1974
        </figcaption>
      </figure>

      {/* Intro */}
      <div className="bg-compass-dark border border-gold/20 rounded-xl p-6 archival-texture overflow-hidden">
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

      {/* AIvor */}
      <section className="bg-compass-dark border border-gold/20 rounded-xl p-6">
        <h2 className="font-heritage text-lg text-gold-rich mb-3">Talk to AIvor</h2>
        <p className="text-text-muted text-sm leading-relaxed mb-4">
          AIvor is BLKOUT's AI assistant — named after Ivor Cummings himself. He can help you
          explore Black queer heritage, find community events, and connect with resources.
          Like his namesake, AIvor is here to welcome you and help you find your way.
        </p>
        <a
          href="https://blkoutuk.com?chat=open"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 px-4 py-2 bg-gold-rich/10 border border-gold-rich/30 text-gold-rich text-sm rounded-lg hover:bg-gold-rich/20 transition-colors"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M8.625 12a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H8.25m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H12m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0h-.375M21 12c0 4.556-4.03 8.25-9 8.25a9.764 9.764 0 01-2.555-.337A5.972 5.972 0 015.41 20.97a5.969 5.969 0 01-.474-.065 4.48 4.48 0 00.978-2.025c.09-.457-.133-.901-.467-1.226C3.93 16.178 3 14.189 3 12c0-4.556 4.03-8.25 9-8.25s9 3.694 9 8.25z" />
          </svg>
          Chat with AIvor on blkoutuk.com
        </a>
      </section>

      {/* Your Data */}
      <section className="bg-compass-dark border border-gold/20 rounded-xl p-6">
        <h2 className="font-heritage text-lg text-white mb-3">Your Data</h2>
        <p className="text-text-muted text-sm leading-relaxed mb-4">
          Everything you write in this journal stays on your device. Nothing is sent to a server.
          Download a copy whenever you want — it's yours to keep, even if you stop using the app.
        </p>
        <ExportButton />
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
              <p className="text-text-muted/60 text-xs mt-1">{book.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Acknowledgements */}
      <section className="space-y-4">
        <h2 className="font-bold-shell text-lg text-white title-underline" style={{ '--accent-color': 'var(--color-gold)' } as React.CSSProperties}>Acknowledgements</h2>
        <div className="space-y-3 text-text-muted text-sm leading-relaxed">
          <p>
            This project would not exist without <span className="text-white">Stephen Bourne</span>, whose research in the National Archives recovered Ivor's story from decades of silence.
          </p>
          <p>
            With thanks to <span className="text-white">Arnold Awoonor-Gordon</span>, who knew Ivor personally in Freetown and shared his memories so generously — giving us the voice and warmth that no archive could hold.
          </p>
          <p className="text-text-muted/50 text-xs pt-2">
            Ivor's Compass is supported by Croydon Council and the National Lottery Heritage Fund through the Samuel Coleridge-Taylor 150 Small Heritage Grant. Produced by BLKOUT Creative Ltd.
          </p>
        </div>
      </section>
    </div>
  )
}
