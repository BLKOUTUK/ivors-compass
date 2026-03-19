import { useState, useEffect, useCallback } from 'react'
import { useSearchParams } from 'react-router-dom'

interface JournalEntry {
  id: string
  text: string
  prompt?: string
  createdAt: string
}

const ENTRIES_KEY = 'ivors-compass-journal'

const defaultPrompts = [
  'What is on your mind today?',
  'What would you like to release?',
  'What are you grateful for right now?',
  'Where do you feel most yourself?',
  'What would you say to your younger self?',
  'What does freedom feel like in your body?',
]

export default function JournalPage() {
  const [searchParams] = useSearchParams()
  const urlPrompt = searchParams.get('prompt')

  const [view, setView] = useState<'write' | 'history'>('write')
  const [entries, setEntries] = useState<JournalEntry[]>([])
  const [text, setText] = useState('')
  const [currentPrompt, setCurrentPrompt] = useState(
    urlPrompt || defaultPrompts[Math.floor(Math.random() * defaultPrompts.length)]
  )
  const [saved, setSaved] = useState(false)

  // Load entries
  useEffect(() => {
    try {
      const stored = localStorage.getItem(ENTRIES_KEY)
      if (stored) setEntries(JSON.parse(stored))
    } catch {}
  }, [])

  const saveEntry = useCallback(() => {
    if (!text.trim()) return

    const entry: JournalEntry = {
      id: Date.now().toString(),
      text: text.trim(),
      prompt: currentPrompt,
      createdAt: new Date().toISOString(),
    }

    const updated = [entry, ...entries]
    setEntries(updated)
    try { localStorage.setItem(ENTRIES_KEY, JSON.stringify(updated)) } catch {}

    setText('')
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }, [text, currentPrompt, entries])

  const deleteEntry = (id: string) => {
    const updated = entries.filter(e => e.id !== id)
    setEntries(updated)
    try { localStorage.setItem(ENTRIES_KEY, JSON.stringify(updated)) } catch {}
  }

  const exportEntries = () => {
    if (entries.length === 0) return

    const content = entries.map(e => {
      const date = new Date(e.createdAt).toLocaleDateString('en-GB', {
        weekday: 'long', day: 'numeric', month: 'long', year: 'numeric'
      })
      return `${date}\n${e.prompt ? `Prompt: ${e.prompt}\n` : ''}\n${e.text}\n\n---\n`
    }).join('\n')

    const blob = new Blob([`Ivor's Compass — Journal\n${'='.repeat(30)}\n\n${content}`], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `ivors-compass-journal-${new Date().toISOString().split('T')[0]}.txt`
    a.click()
    URL.revokeObjectURL(url)
  }

  const clearAll = () => {
    if (confirm('Delete all journal entries? This cannot be undone.')) {
      setEntries([])
      try { localStorage.removeItem(ENTRIES_KEY) } catch {}
    }
  }

  const newPrompt = () => {
    setCurrentPrompt(defaultPrompts[Math.floor(Math.random() * defaultPrompts.length)])
  }

  const formatDate = (iso: string) => {
    return new Date(iso).toLocaleDateString('en-GB', {
      day: 'numeric', month: 'short', year: 'numeric',
    })
  }

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="font-heritage text-2xl text-white">Your Journal</h1>
        <div className="flex gap-2">
          <button
            onClick={() => setView('write')}
            className={`px-3 py-1.5 rounded-lg text-xs transition-colors ${view === 'write' ? 'bg-gold-rich text-black font-medium' : 'bg-compass-dark text-text-muted'}`}
          >
            Write
          </button>
          <button
            onClick={() => setView('history')}
            className={`px-3 py-1.5 rounded-lg text-xs transition-colors ${view === 'history' ? 'bg-gold-rich text-black font-medium' : 'bg-compass-dark text-text-muted'}`}
          >
            History ({entries.length})
          </button>
        </div>
      </div>

      {/* Privacy badge */}
      <div className="flex items-center gap-2 text-text-muted/30 text-[10px]">
        <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
        </svg>
        Private — stored only on this device, never sent anywhere
      </div>

      {view === 'write' ? (
        <div className="space-y-4">
          {/* Prompt */}
          <div className="bg-compass-card border border-gold/20 rounded-xl p-5">
            <div className="flex items-start justify-between gap-3">
              <p className="text-gold/80 text-sm leading-relaxed italic flex-1">
                "{currentPrompt}"
              </p>
              {!urlPrompt && (
                <button
                  onClick={newPrompt}
                  className="text-text-muted/30 hover:text-gold/60 transition-colors flex-shrink-0"
                  aria-label="New prompt"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182" />
                  </svg>
                </button>
              )}
            </div>
          </div>

          {/* Writing area */}
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Write freely. This is your space."
            className="w-full min-h-[300px] bg-compass-dark border border-compass-border rounded-xl p-5 text-white text-sm leading-relaxed placeholder-text-muted/20 resize-none focus:outline-none focus:border-gold/30 transition-colors"
          />

          {/* Actions */}
          <div className="flex items-center justify-between">
            <span className="text-text-muted/20 text-xs">
              {text.length > 0 ? `${text.split(/\s+/).filter(Boolean).length} words` : ''}
            </span>
            <button
              onClick={saveEntry}
              disabled={!text.trim()}
              className="px-5 py-2.5 bg-gold-rich hover:bg-gold text-black font-semibold text-sm rounded-lg transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
            >
              {saved ? 'Saved' : 'Save Entry'}
            </button>
          </div>
        </div>
      ) : (
        /* History view */
        <div className="space-y-4">
          {entries.length === 0 ? (
            <div className="text-center py-16">
              <p className="text-text-muted/40 text-sm">No entries yet</p>
              <button
                onClick={() => setView('write')}
                className="text-gold-rich text-sm mt-2"
              >
                Start writing
              </button>
            </div>
          ) : (
            <>
              {entries.map(entry => (
                <div key={entry.id} className="bg-compass-dark border border-compass-border rounded-xl p-5">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-text-muted/40 text-xs">{formatDate(entry.createdAt)}</span>
                    <button
                      onClick={() => deleteEntry(entry.id)}
                      className="text-text-muted/20 hover:text-red-400 transition-colors text-xs"
                    >
                      Delete
                    </button>
                  </div>
                  {entry.prompt && (
                    <p className="text-gold/40 text-xs italic mb-2">"{entry.prompt}"</p>
                  )}
                  <p className="text-text-muted text-sm leading-relaxed whitespace-pre-wrap">
                    {entry.text}
                  </p>
                </div>
              ))}

              {/* Export / Clear */}
              <div className="flex items-center justify-between pt-4 border-t border-compass-border">
                <button
                  onClick={exportEntries}
                  className="text-gold-rich text-xs hover:text-gold transition-colors flex items-center gap-1.5"
                >
                  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
                  </svg>
                  Export as text file
                </button>
                <button
                  onClick={clearAll}
                  className="text-text-muted/30 text-xs hover:text-red-400 transition-colors"
                >
                  Delete all
                </button>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  )
}
