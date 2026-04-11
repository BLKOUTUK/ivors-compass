import { useRef, useState } from 'react'
import { supabase } from '../lib/supabase'

const MAX_SECONDS = 60

type Category = 'installation' | 'feedback'

interface Props {
  category: Category
  /** Optional — capture identity for evaluation/attribution */
  collectIdentity?: boolean
  /** Confirmation text shown after successful save */
  confirmMessage?: string
}

export default function EventRecorder({
  category,
  collectIdentity = false,
  confirmMessage,
}: Props) {
  const [recording, setRecording] = useState(false)
  const [seconds, setSeconds] = useState(0)
  const [audioUrl, setAudioUrl] = useState<string | null>(null)
  const [submitted, setSubmitted] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const [firstName, setFirstName] = useState('')
  const [email, setEmail] = useState('')

  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const chunksRef = useRef<Blob[]>([])
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const blobRef = useRef<Blob | null>(null)

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
        stream.getTracks().forEach((t) => t.stop())
        const blob = new Blob(chunksRef.current, { type: 'audio/webm' })
        blobRef.current = blob
        setAudioUrl(URL.createObjectURL(blob))
        if (timerRef.current) clearInterval(timerRef.current)
      }

      mr.start(250)
      mediaRecorderRef.current = mr
      setRecording(true)

      timerRef.current = setInterval(() => {
        setSeconds((prev) => {
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
      setError('Microphone access needed. Check your browser permissions.')
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
      const path = `${category}/recording-${Date.now()}.webm`
      const { error: uploadError } = await supabase.storage
        .from('interview-panels')
        .upload(path, blobRef.current, { contentType: 'audio/webm' })

      if (uploadError) throw uploadError

      const { data } = supabase.storage
        .from('interview-panels')
        .getPublicUrl(path)

      // Feedback goes into its own table with optional identity.
      // Installation stays in soundscape_recordings — anonymous by design.
      const insertError = category === 'feedback'
        ? (await supabase.from('compass_feedback_recordings').insert({
            audio_url: data.publicUrl,
            first_name: firstName.trim() || null,
            email: email.trim().toLowerCase() || null,
            metadata: { duration_seconds: seconds },
          })).error
        : (await supabase.from('soundscape_recordings').insert({
            category,
            audio_url: data.publicUrl,
          })).error

      if (insertError) throw insertError

      setSubmitted(true)
    } catch (err) {
      console.error(err)
      setError('Could not save. Try again.')
    } finally {
      setSubmitting(false)
    }
  }

  if (submitted) {
    return (
      <div className="border-4 border-gold bg-compass-dark p-8 text-center">
        <p className="text-gold text-[11px] font-semibold tracking-[0.3em] uppercase mb-4">
          Recorded
        </p>
        <p className="font-serif italic text-xl text-warm-white/90 mb-6">
          {confirmMessage ?? 'your voice is in the archive now.'}
        </p>
        <button
          onClick={() => {
            setSubmitted(false)
            discard()
            setFirstName('')
            setEmail('')
          }}
          className="text-text-muted hover:text-gold text-xs font-semibold tracking-[0.2em] uppercase transition-colors underline underline-offset-4"
        >
          Record another
        </button>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Identity — only if they want a direct response */}
      {collectIdentity && !audioUrl && (
        <div className="space-y-4">
          <p className="text-gold text-[11px] font-semibold tracking-[0.25em] uppercase">
            Only if you want a direct response
          </p>
          <RecorderField
            id="er-name"
            label="First name"
            value={firstName}
            onChange={setFirstName}
            placeholder="Your first name"
            autoComplete="given-name"
          />
          <RecorderField
            id="er-email"
            label="Email"
            type="email"
            value={email}
            onChange={setEmail}
            placeholder="you@example.com"
            autoComplete="email"
          />
          <p className="text-text-muted/70 text-[11px] italic leading-relaxed">
            Leave both blank to stay anonymous. We'll only write back if you
            fill in an email.
          </p>
        </div>
      )}

      {/* Recorder */}
      <div className="flex flex-col items-center gap-4 pt-2">
        {audioUrl ? (
          <div className="w-full max-w-sm space-y-4">
            <audio src={audioUrl} controls className="w-full" />
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={discard}
                disabled={submitting}
                className="border-2 border-compass-border hover:border-gold/60 text-text-muted hover:text-warm-white font-black uppercase tracking-wider text-xs py-4 transition-colors disabled:opacity-50"
              >
                Discard
              </button>
              <button
                onClick={submit}
                disabled={submitting}
                className="bg-blkout-red hover:bg-red-700 text-white font-black uppercase tracking-wider text-xs py-4 transition-colors disabled:opacity-50"
              >
                {submitting ? 'Saving…' : 'Save'}
              </button>
            </div>
          </div>
        ) : recording ? (
          <button
            onClick={stop}
            className="w-40 h-40 border-4 border-blkout-red bg-blkout-red/10 flex flex-col items-center justify-center gap-2 active:scale-95 transition-all"
            aria-label="Stop recording"
          >
            <div className="w-8 h-8 bg-blkout-red animate-pulse" />
            <span className="text-blkout-red font-black text-2xl">
              {seconds}s
            </span>
            <span className="text-warm-white/70 text-[11px] font-semibold tracking-[0.2em] uppercase">
              Tap to stop
            </span>
          </button>
        ) : (
          <button
            onClick={start}
            className="w-40 h-40 border-4 border-dashed border-gold/60 hover:border-gold flex flex-col items-center justify-center gap-3 active:border-gold transition-colors"
            aria-label="Start recording"
          >
            <svg
              width="44"
              height="44"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#d4af37"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z" />
              <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
              <line x1="12" y1="19" x2="12" y2="23" />
              <line x1="8" y1="23" x2="16" y2="23" />
            </svg>
            <span className="text-gold font-black text-[11px] tracking-[0.2em] uppercase">
              Tap to record
            </span>
            <span className="text-text-muted text-[10px]">up to 60s</span>
          </button>
        )}
      </div>

      {error && (
        <p
          className="text-blkout-red text-sm font-semibold tracking-wide text-center"
          role="alert"
        >
          {error}
        </p>
      )}
    </div>
  )
}

function RecorderField({
  id,
  label,
  value,
  onChange,
  placeholder,
  type = 'text',
  autoComplete,
}: {
  id: string
  label: string
  value: string
  onChange: (v: string) => void
  placeholder?: string
  type?: string
  autoComplete?: string
}) {
  return (
    <div>
      <label
        htmlFor={id}
        className="block text-gold text-[11px] font-semibold tracking-[0.2em] uppercase mb-2"
      >
        {label}
      </label>
      <input
        id={id}
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        autoComplete={autoComplete}
        className="w-full bg-compass-dark border-2 border-compass-border px-4 py-3 text-warm-white text-base font-medium placeholder-text-muted/50 focus:outline-none focus:border-gold transition-colors"
      />
    </div>
  )
}
