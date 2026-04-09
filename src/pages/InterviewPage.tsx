import { useState, useRef, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { useInterview, type ChatMessage } from '../hooks/useInterview'
import { supabase } from '../lib/supabase'
import {
  ROUND1_INTRO,
  LOCKED_MESSAGE,
  COMPLETE_MESSAGE,
} from '../data/interviewPrompts'

// ─────────────────────────────────────────────────────────
// Question Counter — gold dots that dim as questions are used
// ─────────────────────────────────────────────────────────

function QuestionCounter({ used, total }: { used: number; total: number }) {
  return (
    <div className="flex items-center gap-1.5" aria-label={`${total - used} questions remaining`}>
      {Array.from({ length: total }).map((_, i) => (
        <div
          key={i}
          className={`w-2.5 h-2.5 rounded-full transition-all duration-500 ${
            i < used
              ? 'bg-compass-border scale-75'
              : 'bg-gold shadow-[0_0_6px_rgba(255,215,0,0.4)]'
          }`}
        />
      ))}
    </div>
  )
}

// ─────────────────────────────────────────────────────────
// Typing indicator
// ─────────────────────────────────────────────────────────

function TypingIndicator() {
  return (
    <div className="flex items-center gap-1 px-4 py-3">
      <div className="w-2 h-2 rounded-full bg-gold-dim animate-typing-dot" />
      <div className="w-2 h-2 rounded-full bg-gold-dim animate-typing-dot [animation-delay:0.2s]" />
      <div className="w-2 h-2 rounded-full bg-gold-dim animate-typing-dot [animation-delay:0.4s]" />
    </div>
  )
}

// ─────────────────────────────────────────────────────────
// Message bubble
// ─────────────────────────────────────────────────────────

function MessageBubble({ message }: { message: ChatMessage }) {
  if (message.role === 'system') {
    return (
      <div className="flex justify-center my-4 animate-fade-in">
        <div className="bg-gold/10 border border-gold/30 rounded-lg px-4 py-2 max-w-[85%]">
          <p className="text-gold text-sm text-center font-medium">{message.content}</p>
        </div>
      </div>
    )
  }

  const isUser = message.role === 'user'

  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'} mb-3 animate-fade-in`}>
      <div
        className={`max-w-[85%] rounded-2xl px-4 py-3 ${
          isUser
            ? 'bg-gold/15 border border-gold/30 rounded-br-sm'
            : 'bg-compass-card border border-compass-border rounded-bl-sm'
        }`}
      >
        <p className={`text-sm leading-relaxed whitespace-pre-wrap ${
          isUser ? 'text-gold' : 'text-warm-white'
        }`}>
          {message.content}
        </p>
      </div>
    </div>
  )
}

// ─────────────────────────────────────────────────────────
// Input bar
// ─────────────────────────────────────────────────────────

function InputBar({
  onSend,
  disabled,
  sending,
  placeholder,
}: {
  onSend: (text: string) => void
  disabled: boolean
  sending: boolean
  placeholder: string
}) {
  const [text, setText] = useState('')
  const inputRef = useRef<HTMLInputElement>(null)

  const handleSubmit = () => {
    if (!text.trim() || disabled || sending) return
    onSend(text.trim())
    setText('')
  }

  return (
    <div className="flex items-center gap-2 p-3 border-t border-compass-border bg-compass-dark/80 backdrop-blur-sm">
      <input
        ref={inputRef}
        type="text"
        value={text}
        onChange={e => setText(e.target.value)}
        onKeyDown={e => e.key === 'Enter' && handleSubmit()}
        placeholder={placeholder}
        disabled={disabled || sending}
        className="flex-1 bg-compass-card border border-compass-border rounded-full px-4 py-2.5 text-sm text-white placeholder:text-text-muted focus:outline-none focus:border-gold/50 disabled:opacity-40 transition-colors"
      />
      <button
        onClick={handleSubmit}
        disabled={!text.trim() || disabled || sending}
        className="w-10 h-10 flex items-center justify-center rounded-full bg-gold text-compass-black font-bold text-lg disabled:opacity-30 disabled:bg-compass-border active:scale-95 transition-all"
        aria-label="Send question"
      >
        &#x2191;
      </button>
    </div>
  )
}

// ─────────────────────────────────────────────────────────
// Lock screen
// ─────────────────────────────────────────────────────────

function LockScreen({ onUnlock, error }: { onUnlock: (code: string) => void; error: string | null }) {
  const [code, setCode] = useState('')

  return (
    <div className="p-4 border-t border-gold/30 bg-compass-dark/80 backdrop-blur-sm space-y-3">
      <div className="bg-gold/10 border border-gold/30 rounded-xl p-4">
        <p className="text-gold font-heritage text-base leading-relaxed">{LOCKED_MESSAGE}</p>
      </div>
      <div className="flex items-center gap-2">
        <input
          type="text"
          value={code}
          onChange={e => setCode(e.target.value.toUpperCase())}
          onKeyDown={e => e.key === 'Enter' && code && onUnlock(code)}
          placeholder="Unlock code"
          className="flex-1 bg-compass-card border border-compass-border rounded-full px-4 py-2.5 text-sm text-gold placeholder:text-text-muted focus:outline-none focus:border-gold/50 tracking-widest text-center uppercase"
        />
        <button
          onClick={() => code && onUnlock(code)}
          disabled={!code}
          className="px-4 py-2.5 rounded-full bg-gold text-compass-black font-semibold text-sm disabled:opacity-30 active:scale-95 transition-all"
        >
          Unlock
        </button>
      </div>
      {error && <p className="text-red-400 text-xs text-center">{error}</p>}
    </div>
  )
}

// ─────────────────────────────────────────────────────────
// Audio recorder hook
// ─────────────────────────────────────────────────────────

function useAudioRecorder(maxSeconds = 30) {
  const [recording, setRecording] = useState(false)
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null)
  const [audioUrl, setAudioUrl] = useState<string | null>(null)
  const [seconds, setSeconds] = useState(0)
  const [error, setError] = useState<string | null>(null)
  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const chunksRef = useRef<Blob[]>([])
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null)

  const start = async () => {
    setError(null)
    setAudioBlob(null)
    setAudioUrl(null)
    setSeconds(0)
    chunksRef.current = []

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      const mr = new MediaRecorder(stream, { mimeType: 'audio/webm;codecs=opus' })

      mr.ondataavailable = (e) => {
        if (e.data.size > 0) chunksRef.current.push(e.data)
      }

      mr.onstop = () => {
        stream.getTracks().forEach(t => t.stop())
        const blob = new Blob(chunksRef.current, { type: 'audio/webm' })
        setAudioBlob(blob)
        setAudioUrl(URL.createObjectURL(blob))
        if (timerRef.current) clearInterval(timerRef.current)
      }

      mr.start(250)
      mediaRecorderRef.current = mr
      setRecording(true)

      // Timer + auto-stop
      timerRef.current = setInterval(() => {
        setSeconds(prev => {
          if (prev >= maxSeconds - 1) {
            mr.stop()
            setRecording(false)
            if (timerRef.current) clearInterval(timerRef.current)
            return maxSeconds
          }
          return prev + 1
        })
      }, 1000)
    } catch {
      setError('Microphone access needed to record')
    }
  }

  const stop = () => {
    if (mediaRecorderRef.current?.state === 'recording') {
      mediaRecorderRef.current.stop()
      setRecording(false)
    }
  }

  const discard = () => {
    setAudioBlob(null)
    if (audioUrl) URL.revokeObjectURL(audioUrl)
    setAudioUrl(null)
    setSeconds(0)
  }

  return { recording, audioBlob, audioUrl, seconds, maxSeconds, error, start, stop, discard }
}

// ─────────────────────────────────────────────────────────
// Complete screen — two-step: panel capture → evaluation + audio
// ─────────────────────────────────────────────────────────

type CaptureStep = 'panel' | 'reflect' | 'done'

function CompleteScreen({ tableId }: { tableId: number }) {
  const [step, setStep] = useState<CaptureStep>('panel')

  // Panel fields
  const [caption, setCaption] = useState('')
  const [speechBubble, setSpeechBubble] = useState('')
  const [sceneDescription, setSceneDescription] = useState('')
  const [photoFile, setPhotoFile] = useState<File | null>(null)
  const [photoPreview, setPhotoPreview] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Evaluation fields
  const [surprisedBy, setSurprisedBy] = useState('')
  const [personalConnection, setPersonalConnection] = useState('')

  // Audio
  const audio = useAudioRecorder(30)

  // Generated comic panel image
  const [generatedImage, setGeneratedImage] = useState<string | null>(null)
  const [imageGenerating, setImageGenerating] = useState(false)

  // Shared
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const IVOR_API = import.meta.env.VITE_IVOR_API_URL || 'https://ivor.blkoutuk.cloud'

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    setPhotoFile(file)
    const reader = new FileReader()
    reader.onload = () => setPhotoPreview(reader.result as string)
    reader.readAsDataURL(file)
  }

  // Upload a file to Supabase Storage, return public URL
  async function uploadFile(bucket: string, path: string, file: Blob, contentType: string): Promise<string | null> {
    const { error } = await supabase.storage.from(bucket).upload(path, file, { contentType })
    if (error) {
      console.error(`Upload error (${bucket}/${path}):`, error)
      return null
    }
    const { data } = supabase.storage.from(bucket).getPublicUrl(path)
    return data.publicUrl
  }

  // Step 1: save panel
  const handlePanelSubmit = async () => {
    if (submitting) return
    setSubmitting(true)
    setError(null)

    try {
      let photoUrl: string | null = null
      if (photoFile) {
        const ext = photoFile.name.split('.').pop() || 'jpg'
        photoUrl = await uploadFile(
          'interview-panels',
          `table-${tableId}/panel-${Date.now()}.${ext}`,
          photoFile,
          photoFile.type
        )
      }

      const { data: inserted, error: insertError } = await supabase
        .from('interview_panels')
        .insert({
          table_id: tableId,
          panel_photo_url: photoUrl,
          caption: caption.trim() || null,
          speech_bubble: speechBubble.trim() || null,
          scene_description: sceneDescription.trim() || null,
        })
        .select('id')
        .single()

      if (insertError) throw insertError
      const panelId = inserted?.id

      // Kick off image generation in the background — don't block the step transition
      setImageGenerating(true)
      fetch(`${IVOR_API}/api/interview/generate-panel`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          tableId,
          sceneDescription: sceneDescription.trim(),
          caption: caption.trim(),
          speechBubble: speechBubble.trim(),
          direction: (() => {
            const dirs = ['', 'HOME', 'NIGHT', 'FIRE', 'THRESHOLD', 'SHADOW', 'SILENCE', 'RETURN']
            return dirs[tableId] || 'HOME'
          })(),
        }),
      })
        .then(r => r.ok ? r.json() : null)
        .then(async (data) => {
          if (data?.imageUrl) {
            setGeneratedImage(data.imageUrl)
            // Persist the generated image to Supabase Storage
            if (panelId) {
              try {
                const res = await fetch(data.imageUrl)
                const blob = await res.blob()
                const path = `table-${tableId}/generated-${panelId}.png`
                const { error: upErr } = await supabase.storage
                  .from('interview-panels')
                  .upload(path, blob, { contentType: 'image/png' })
                if (!upErr) {
                  const { data: urlData } = supabase.storage.from('interview-panels').getPublicUrl(path)
                  await supabase
                    .from('interview_panels')
                    .update({ generated_image_url: urlData.publicUrl })
                    .eq('id', panelId)
                }
              } catch { /* Non-critical — image still shown inline */ }
            }
          }
        })
        .catch(() => { /* Non-critical — image is a bonus */ })
        .finally(() => setImageGenerating(false))

      setStep('reflect')
    } catch (err) {
      console.error('Panel submit error:', err)
      setError('Could not save. Try again.')
    } finally {
      setSubmitting(false)
    }
  }

  // Step 2: save evaluation + audio
  const handleReflectSubmit = async () => {
    if (submitting) return
    setSubmitting(true)
    setError(null)

    try {
      let audioUploadUrl: string | null = null
      if (audio.audioBlob) {
        audioUploadUrl = await uploadFile(
          'interview-panels',
          `table-${tableId}/audio-${Date.now()}.webm`,
          audio.audioBlob,
          'audio/webm'
        )
      }

      const { error: insertError } = await supabase
        .from('interview_responses')
        .insert({
          table_id: tableId,
          surprised_by: surprisedBy.trim() || null,
          personal_connection: personalConnection.trim() || null,
          audio_url: audioUploadUrl,
        })

      if (insertError) throw insertError
      setStep('done')
    } catch (err) {
      console.error('Reflection submit error:', err)
      setError('Could not save. Try again.')
    } finally {
      setSubmitting(false)
    }
  }

  const inputClass = 'w-full bg-compass-card border border-compass-border rounded-lg px-3 py-2.5 text-sm text-white placeholder:text-text-muted focus:outline-none focus:border-gold/50 transition-colors'

  // ── Done ──
  if (step === 'done') {
    return (
      <div className="border-t border-gold/30 bg-compass-dark/80 backdrop-blur-sm overflow-y-auto max-h-[70dvh]">
        <div className="p-4 space-y-4 animate-fade-in">
          {/* Generated comic panel */}
          {generatedImage ? (
            <div className="rounded-xl overflow-hidden border-2 border-gold/40 shadow-[0_0_20px_rgba(255,215,0,0.15)]">
              <img src={generatedImage} alt="Your comic panel" className="w-full" />
            </div>
          ) : imageGenerating ? (
            <div className="rounded-xl border-2 border-dashed border-gold/30 h-44 flex flex-col items-center justify-center gap-2">
              <div className="w-6 h-6 border-2 border-gold border-t-transparent rounded-full animate-spin" />
              <p className="text-gold-dim text-xs">Drawing your panel...</p>
            </div>
          ) : null}

          <div className="bg-gold/10 border border-gold/30 rounded-xl p-5 text-center space-y-4">
            <p className="text-gold font-heritage text-lg">Your panel is being drawn</p>
            <p className="text-text-muted text-sm leading-relaxed">
              While the AI creates your comic panel, go downstairs to the installation.
              Walk through Ivor's life under coloured light. Record what stays with you.
            </p>
            <a
              href="/compass/record"
              className="inline-flex items-center gap-2 px-4 py-2 bg-gold/10 border border-gold/30 text-gold text-sm rounded-lg"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"/><path d="M19 10v2a7 7 0 0 1-14 0v-2"/></svg>
              Record at the installation
            </a>
            <div className="pt-2 border-t border-gold/20">
              <p className="text-text-muted/50 text-xs mb-2">When you return:</p>
              <a
                href="/compass/life-of-ivor"
                className="inline-flex items-center gap-2 text-gold-rich text-sm hover:underline"
              >
                View the graphic novel →
              </a>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // ── Step 2: Reflection + Audio ──
  if (step === 'reflect') {
    return (
      <div className="border-t border-gold/30 bg-compass-dark/80 backdrop-blur-sm overflow-y-auto max-h-[70dvh]">
        <div className="p-4 pb-2">
          <div className="bg-gold/10 border border-gold/30 rounded-xl p-4 mb-4 animate-fade-in">
            <p className="text-gold font-heritage text-base leading-relaxed">
              One more thing. Before you go — tell us what stayed with you.
            </p>
          </div>
        </div>

        <div className="px-4 pb-6 space-y-4">
          {/* What surprised you */}
          <div className="space-y-1.5">
            <label className="text-xs text-text-muted uppercase tracking-wider">
              What surprised you about Ivor's story?
            </label>
            <textarea
              value={surprisedBy}
              onChange={e => setSurprisedBy(e.target.value)}
              placeholder="I didn't know that..."
              rows={2}
              className={inputClass + ' resize-none'}
            />
          </div>

          {/* Personal connection */}
          <div className="space-y-1.5">
            <label className="text-xs text-text-muted uppercase tracking-wider">
              How does his story connect to yours?
            </label>
            <textarea
              value={personalConnection}
              onChange={e => setPersonalConnection(e.target.value)}
              placeholder="It made me think about..."
              rows={2}
              className={inputClass + ' resize-none'}
            />
          </div>

          {/* Audio recorder */}
          <div className="space-y-2">
            <label className="text-xs text-text-muted uppercase tracking-wider">
              Record a message <span className="normal-case tracking-normal text-text-muted/60">— read your caption, or say anything you want Ivor to hear (30 sec)</span>
            </label>

            {audio.audioUrl ? (
              /* Playback */
              <div className="space-y-2">
                <audio src={audio.audioUrl} controls className="w-full h-10" />
                <button
                  onClick={audio.discard}
                  className="text-text-muted/60 text-xs underline"
                >
                  Record again
                </button>
              </div>
            ) : audio.recording ? (
              /* Recording */
              <button
                onClick={audio.stop}
                className="w-full h-20 rounded-xl border-2 border-red-500/60 bg-red-500/10 flex flex-col items-center justify-center gap-1 active:scale-[0.98] transition-all"
              >
                <div className="w-4 h-4 rounded-full bg-red-500 animate-pulse" />
                <span className="text-red-400 text-sm font-medium">
                  Recording — {audio.seconds}s / {audio.maxSeconds}s
                </span>
                <span className="text-text-muted text-xs">Tap to stop</span>
              </button>
            ) : (
              /* Ready to record */
              <button
                onClick={audio.start}
                className="w-full h-20 rounded-xl border-2 border-dashed border-compass-border flex flex-col items-center justify-center gap-2 active:border-gold/50 transition-colors"
              >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#D4AF37" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"/>
                  <path d="M19 10v2a7 7 0 0 1-14 0v-2"/>
                  <line x1="12" y1="19" x2="12" y2="23"/>
                  <line x1="8" y1="23" x2="16" y2="23"/>
                </svg>
                <span className="text-text-muted text-xs">Tap to record</span>
              </button>
            )}

            {audio.error && <p className="text-red-400/80 text-xs">{audio.error}</p>}
          </div>

          {/* Submit */}
          <button
            onClick={handleReflectSubmit}
            disabled={submitting || (!surprisedBy && !personalConnection && !audio.audioBlob)}
            className="w-full py-3 rounded-xl bg-gold text-compass-black font-semibold text-sm disabled:opacity-30 active:scale-[0.98] transition-all"
          >
            {submitting ? 'Saving...' : 'Save reflection'}
          </button>

          {error && <p className="text-red-400 text-xs text-center">{error}</p>}

          <p className="text-center">
            <button onClick={() => setStep('done')} className="text-text-muted/50 text-xs underline">
              Skip
            </button>
          </p>
        </div>
      </div>
    )
  }

  // ── Step 1: Panel capture ──
  return (
    <div className="border-t border-gold/30 bg-compass-dark/80 backdrop-blur-sm overflow-y-auto max-h-[70dvh]">
      <div className="p-4 pb-2">
        <div className="bg-gold/10 border border-gold/30 rounded-xl p-4 mb-4">
          <p className="text-gold font-heritage text-base leading-relaxed">{COMPLETE_MESSAGE}</p>
        </div>
      </div>

      <div className="px-4 pb-6 space-y-4">
        {/* Photo upload */}
        <div className="space-y-2">
          <label className="text-xs text-text-muted uppercase tracking-wider">
            Photograph your panel
          </label>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            capture="environment"
            onChange={handlePhotoChange}
            className="hidden"
          />
          {photoPreview ? (
            <button
              onClick={() => fileInputRef.current?.click()}
              className="w-full rounded-lg overflow-hidden border border-gold/30 relative group"
            >
              <img src={photoPreview} alt="Panel photo" className="w-full h-40 object-cover" />
              <div className="absolute inset-0 bg-black/50 opacity-0 group-active:opacity-100 flex items-center justify-center transition-opacity">
                <span className="text-gold text-sm">Retake</span>
              </div>
            </button>
          ) : (
            <button
              onClick={() => fileInputRef.current?.click()}
              className="w-full h-28 rounded-lg border-2 border-dashed border-compass-border flex flex-col items-center justify-center gap-2 active:border-gold/50 transition-colors"
            >
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#D4AF37" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
                <circle cx="8.5" cy="8.5" r="1.5"/>
                <polyline points="21 15 16 10 5 21"/>
              </svg>
              <span className="text-text-muted text-xs">Tap to photograph your A3 panel</span>
            </button>
          )}
        </div>

        {/* Caption */}
        <div className="space-y-1.5">
          <label className="text-xs text-text-muted uppercase tracking-wider">
            Caption <span className="normal-case tracking-normal text-text-muted/60">— the narrator's voice, max 2 sentences</span>
          </label>
          <textarea
            value={caption}
            onChange={e => setCaption(e.target.value)}
            placeholder="He was born between two worlds..."
            rows={2}
            className={inputClass + ' resize-none'}
          />
        </div>

        {/* Speech/thought bubble */}
        <div className="space-y-1.5">
          <label className="text-xs text-text-muted uppercase tracking-wider">
            Speech or thought bubble <span className="normal-case tracking-normal text-text-muted/60">— what someone says or thinks</span>
          </label>
          <input
            type="text"
            value={speechBubble}
            onChange={e => setSpeechBubble(e.target.value)}
            placeholder='"You must not disparage your father."'
            className={inputClass}
          />
        </div>

        {/* Scene description */}
        <div className="space-y-1.5">
          <label className="text-xs text-text-muted uppercase tracking-wider">
            The scene <span className="normal-case tracking-normal text-text-muted/60">— describe the atmosphere, objects, lighting. Don't name Ivor — describe the world around him</span>
          </label>
          <input
            type="text"
            value={sceneDescription}
            onChange={e => setSceneDescription(e.target.value)}
            placeholder="A figure in sharp shadows, dwarfed by glowing file cabinets marked 'Caribbean Affairs'"
            className={inputClass}
          />
        </div>

        {/* Submit */}
        <button
          onClick={handlePanelSubmit}
          disabled={submitting || (!caption && !speechBubble && !sceneDescription && !photoFile)}
          className="w-full py-3 rounded-xl bg-gold text-compass-black font-semibold text-sm disabled:opacity-30 active:scale-[0.98] transition-all"
        >
          {submitting ? 'Saving...' : 'Save panel'}
        </button>

        {error && <p className="text-red-400 text-xs text-center">{error}</p>}

        <p className="text-center">
          <button onClick={() => setStep('reflect')} className="text-text-muted/50 text-xs underline">
            Skip — capture later
          </button>
        </p>
      </div>
    </div>
  )
}

// ─────────────────────────────────────────────────────────
// Main page
// ─────────────────────────────────────────────────────────

export default function InterviewPage() {
  const { tableId: tableIdParam } = useParams<{ tableId: string }>()
  const tableId = Number(tableIdParam)
  const [started, setStarted] = useState(false)

  const {
    messages,
    questionCount,
    maxQuestions,
    phase,
    loading,
    sending,
    error,
    config,
    sendQuestion,
    submitUnlockCode,
    questionsRemaining,
  } = useInterview(tableId)

  const messagesEndRef = useRef<HTMLDivElement>(null)

  // Auto-scroll to latest message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, sending])

  // If session already has messages, skip cover page
  useEffect(() => {
    if (messages.length > 0) setStarted(true)
  }, [messages])

  // Invalid table
  if (!config) {
    return (
      <div className="h-dvh bg-compass-black flex items-center justify-center p-6">
        <div className="text-center space-y-4">
          <p className="text-gold font-heritage text-xl">Table not found</p>
          <p className="text-text-muted text-sm">Valid tables: 1–7</p>
          <Link to="/" className="text-gold-dim text-sm underline">Return</Link>
        </div>
      </div>
    )
  }

  // Loading
  if (loading) {
    return (
      <div className="h-dvh bg-compass-black flex items-center justify-center">
        <div className="text-center space-y-3">
          <div className="w-8 h-8 border-2 border-gold border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-text-muted text-sm">Opening the archive...</p>
        </div>
      </div>
    )
  }

  // Cover page
  if (!started) {
    return (
      <div className="h-dvh bg-compass-black flex flex-col">
        {/* Promo image — top half */}
        <div className="relative flex-1 min-h-0">
          <img
            src="/images/promo-poster.jpg"
            alt="Ivor's Compass — heritage installation"
            className="w-full h-full object-cover"
          />
          {/* Gradient overlay for text legibility */}
          <div className="absolute inset-0 bg-gradient-to-t from-compass-black via-compass-black/40 to-transparent" />

          {/* BLKOUT logo top-left */}
          <div className="absolute top-4 left-4">
            <img src="/images/blkout-logo.png" alt="BLKOUT" className="h-8 opacity-90" />
          </div>
        </div>

        {/* Content — bottom half */}
        <div className="shrink-0 px-5 pb-6 pt-4 space-y-4 -mt-16 relative z-10">
          {/* Direction badge */}
          <div className="flex items-center gap-2">
            <div
              className="w-2.5 h-2.5 rounded-full"
              style={{ backgroundColor: config.colour }}
            />
            <span
              className="text-xs font-bold tracking-[0.3em] uppercase"
              style={{ color: config.colour }}
            >
              {config.direction}
            </span>
          </div>

          {/* Compass prompt */}
          <p className="font-heritage text-gold text-xl leading-snug italic">
            {config.compassPrompt}
          </p>

          {/* Instructions */}
          <div className="space-y-2 text-sm text-text-muted leading-relaxed">
            <p>
              A research assistant has loaded a chatbot with fragments of a man's life.
              Your table shares <span className="text-gold">5 questions</span>.
              Choose carefully — the archive has gaps.
            </p>
            <p>
              Discuss with your table what to ask. One person types.
              Everyone discovers.
            </p>
          </div>

          {/* Begin button */}
          <button
            onClick={() => setStarted(true)}
            className="w-full py-3.5 rounded-xl bg-gold text-compass-black font-semibold text-base active:scale-[0.98] transition-all"
          >
            Begin interview
          </button>

          {/* Sponsor acknowledgement */}
          <div className="flex items-center justify-center gap-3 pt-2">
            <span className="text-[10px] text-text-muted/50">Funded by</span>
            <span className="text-[10px] text-text-muted/60">Croydon Council</span>
            <span className="text-[10px] text-text-muted/60">|</span>
            <span className="text-[10px] text-text-muted/60">National Lottery Heritage Fund</span>
          </div>
          <p className="text-[9px] text-text-muted/60 text-center">
            Samuel Coleridge-Taylor 150 Small Heritage Grant
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="h-dvh flex flex-col bg-compass-black">
      {/* Header */}
      <header className="shrink-0 border-b border-gold/20 bg-compass-black/95 backdrop-blur-sm">
        <div className="px-4 pt-4 pb-3 space-y-2">
          {/* Top row: logo + counter */}
          <div className="flex items-center justify-between">
            <span className="text-text-muted text-xs tracking-widest uppercase">
              Ivor's Compass
            </span>
            <QuestionCounter used={questionCount} total={maxQuestions} />
          </div>

          {/* Compass direction + prompt */}
          <div className="space-y-1">
            <p
              className="text-xs font-bold tracking-[0.3em] uppercase"
              style={{ color: config.colour }}
            >
              {config.direction}
            </p>
            <p className="font-heritage text-gold text-lg leading-snug italic">
              {config.compassPrompt}
            </p>
          </div>

          {/* Questions remaining */}
          <p className="text-text-muted text-xs">
            {phase === 'complete'
              ? 'Interview complete'
              : phase === 'locked'
                ? 'Locked — waiting for facilitator'
                : `${questionsRemaining} question${questionsRemaining !== 1 ? 's' : ''} remaining`}
          </p>
        </div>
      </header>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-3 py-4">
        {/* Intro text */}
        {messages.length === 0 && (
          <div className="mb-6 animate-fade-in">
            <div className="bg-compass-card/50 border border-compass-border rounded-xl p-4">
              <p className="text-text-muted text-sm leading-relaxed">{ROUND1_INTRO}</p>
            </div>
          </div>
        )}

        {/* Conversation */}
        {messages.map((msg, i) => (
          <MessageBubble key={i} message={msg} />
        ))}

        {/* Typing indicator */}
        {sending && <TypingIndicator />}

        {/* Error */}
        {error && !sending && (
          <div className="flex justify-center my-2">
            <p className="text-red-400/80 text-xs">{error}</p>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Bottom area: input / lock / complete */}
      {phase === 'round1' || phase === 'round2' ? (
        <InputBar
          onSend={sendQuestion}
          disabled={questionCount >= maxQuestions}
          sending={sending}
          placeholder={
            phase === 'round2'
              ? 'Ask about what\'s missing...'
              : 'Ask Ivor a question...'
          }
        />
      ) : phase === 'locked' ? (
        <LockScreen onUnlock={submitUnlockCode} error={error} />
      ) : (
        <CompleteScreen tableId={tableId} />
      )}
    </div>
  )
}
