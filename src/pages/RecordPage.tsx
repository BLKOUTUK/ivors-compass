import { useState, useRef } from 'react'
import { supabase } from '../lib/supabase'

export default function RecordPage() {
  const [recording, setRecording] = useState(false)
  const [seconds, setSeconds] = useState(0)
  const [audioUrl, setAudioUrl] = useState<string | null>(null)
  const [submitted, setSubmitted] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [panelNumber, setPanelNumber] = useState<number | null>(null)

  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const chunksRef = useRef<Blob[]>([])
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const blobRef = useRef<Blob | null>(null)

  const MAX_SECONDS = 30

  const start = async () => {
    setError(null)
    setAudioUrl(null)
    blobRef.current = null
    chunksRef.current = []
    setSeconds(0)

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      const mr = new MediaRecorder(stream, { mimeType: 'audio/webm;codecs=opus' })

      mr.ondataavailable = (e) => {
        if (e.data.size > 0) chunksRef.current.push(e.data)
      }

      mr.onstop = () => {
        stream.getTracks().forEach(t => t.stop())
        const blob = new Blob(chunksRef.current, { type: 'audio/webm' })
        blobRef.current = blob
        setAudioUrl(URL.createObjectURL(blob))
        if (timerRef.current) clearInterval(timerRef.current)
      }

      mr.start(250)
      mediaRecorderRef.current = mr
      setRecording(true)

      timerRef.current = setInterval(() => {
        setSeconds(prev => {
          if (prev >= MAX_SECONDS - 1) {
            mr.stop()
            setRecording(false)
            if (timerRef.current) clearInterval(timerRef.current)
            return MAX_SECONDS
          }
          return prev + 1
        })
      }, 1000)
    } catch {
      setError('Microphone access needed')
    }
  }

  const stop = () => {
    if (mediaRecorderRef.current?.state === 'recording') {
      mediaRecorderRef.current.stop()
      setRecording(false)
    }
  }

  const discard = () => {
    blobRef.current = null
    if (audioUrl) URL.revokeObjectURL(audioUrl)
    setAudioUrl(null)
    setSeconds(0)
  }

  const submit = async () => {
    if (!blobRef.current || submitting) return
    setSubmitting(true)
    setError(null)

    try {
      const path = `soundscape/recording-${Date.now()}.webm`
      const { error: uploadError } = await supabase.storage
        .from('interview-panels')
        .upload(path, blobRef.current, { contentType: 'audio/webm' })

      if (uploadError) throw uploadError

      const { data } = supabase.storage.from('interview-panels').getPublicUrl(path)

      await supabase.from('soundscape_recordings').insert({
        panel_number: panelNumber,
        audio_url: data.publicUrl,
      })

      setSubmitted(true)
    } catch {
      setError('Could not save. Try again.')
    } finally {
      setSubmitting(false)
    }
  }

  if (submitted) {
    return (
      <div className="animate-fade-in flex flex-col items-center justify-center py-20 text-center space-y-4">
        <div className="w-12 h-12 rounded-full bg-gold/20 flex items-center justify-center">
          <svg className="w-6 h-6 text-gold" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <p className="text-gold font-heritage text-lg">Recorded</p>
        <p className="text-text-muted text-sm">Your voice is part of the soundscape now.</p>
        <button
          onClick={() => { setSubmitted(false); discard() }}
          className="text-text-muted/50 text-xs underline mt-4"
        >
          Record another
        </button>
      </div>
    )
  }

  return (
    <div className="animate-fade-in flex flex-col items-center py-12 space-y-8">
      {/* Header */}
      <div className="text-center space-y-2">
        <h1 className="font-bold-shell text-xl text-white">Record</h1>
        <p className="text-text-muted text-sm max-w-xs leading-relaxed">
          Stand in front of a panel. Say what you see, what you feel, what stays with you.
        </p>
      </div>

      {/* Panel selector */}
      <div className="flex gap-2">
        {[1, 2, 3, 4, 5, 6, 7].map(n => (
          <button
            key={n}
            onClick={() => setPanelNumber(panelNumber === n ? null : n)}
            className={`w-9 h-9 rounded-full text-sm font-medium transition-colors ${
              panelNumber === n
                ? 'bg-gold text-compass-black'
                : 'bg-compass-dark border border-compass-border text-text-muted'
            }`}
          >
            {n}
          </button>
        ))}
      </div>
      <p className="text-text-muted/40 text-xs -mt-4">
        {panelNumber ? `Panel ${panelNumber}` : 'Which panel are you near? (optional)'}
      </p>

      {/* Mic button */}
      {audioUrl ? (
        <div className="space-y-4 w-full max-w-xs">
          <audio src={audioUrl} controls className="w-full h-10" />
          <div className="flex gap-3">
            <button
              onClick={discard}
              className="flex-1 py-2.5 rounded-lg border border-compass-border text-text-muted text-sm"
            >
              Discard
            </button>
            <button
              onClick={submit}
              disabled={submitting}
              className="flex-1 py-2.5 rounded-lg bg-gold text-compass-black font-semibold text-sm disabled:opacity-30"
            >
              {submitting ? 'Saving...' : 'Save'}
            </button>
          </div>
        </div>
      ) : recording ? (
        <button
          onClick={stop}
          className="w-32 h-32 rounded-full border-4 border-red-500/60 bg-red-500/10 flex flex-col items-center justify-center gap-2 active:scale-95 transition-all"
        >
          <div className="w-6 h-6 rounded-full bg-red-500 animate-pulse" />
          <span className="text-red-400 text-sm font-medium">{seconds}s</span>
          <span className="text-text-muted text-[10px]">Tap to stop</span>
        </button>
      ) : (
        <button
          onClick={start}
          className="w-32 h-32 rounded-full border-4 border-dashed border-gold/30 flex flex-col items-center justify-center gap-3 active:border-gold/60 transition-colors"
        >
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#D4AF37" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"/>
            <path d="M19 10v2a7 7 0 0 1-14 0v-2"/>
            <line x1="12" y1="19" x2="12" y2="23"/>
            <line x1="8" y1="23" x2="16" y2="23"/>
          </svg>
          <span className="text-text-muted text-xs">Tap to record</span>
        </button>
      )}

      {error && <p className="text-red-400 text-xs">{error}</p>}

      {/* Consent note */}
      <p className="text-text-muted/30 text-[10px] text-center max-w-xs leading-relaxed">
        Your recording may be used in the Ivor's Compass app and project materials.
      </p>
    </div>
  )
}
