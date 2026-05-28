import { useState } from 'react'

interface Props {
  giftCodes: string[]
  gifterName: string
  baseUrl?: string
}

export default function GiftCodesPanel({ giftCodes, gifterName, baseUrl }: Props) {
  const origin = baseUrl ?? (typeof window !== 'undefined' ? window.location.origin : 'https://compass.blkoutuk.com')

  if (!giftCodes || giftCodes.length === 0) return null

  return (
    <div className="border-t border-compass-border pt-10 mt-10">
      <p className="text-gold text-[11px] font-semibold tracking-[0.3em] uppercase mb-4">
        Now pass it on
      </p>

      <h2 className="font-sans font-black uppercase leading-[0.95] tracking-tight text-3xl sm:text-4xl mb-3">
        Three codes to gift.
      </h2>

      <p className="font-serif italic text-base text-warm-white/85 mb-8 max-w-lg">
        send them to {giftCodes.length === 1 ? 'one person' : `${giftCodes.length} people`} you'd want to walk this with.
      </p>

      <div className="space-y-4">
        {giftCodes.map((code, i) => (
          <GiftCodeRow key={code} code={code} gifterName={gifterName} origin={origin} index={i + 1} />
        ))}
      </div>

      <p className="text-text-muted/70 text-[11px] tracking-wide leading-relaxed mt-8 max-w-lg italic">
        each code is single-use. once someone claims one, it's gone from your list.
      </p>
    </div>
  )
}

function GiftCodeRow({
  code,
  gifterName,
  origin,
  index,
}: {
  code: string
  gifterName: string
  origin: string
  index: number
}) {
  const [copied, setCopied] = useState(false)

  const url = `${origin}/claim/gift?code=${encodeURIComponent(code)}&from=${encodeURIComponent(gifterName)}`
  const message = `${gifterName} sent you Ivor's Compass — a wellness journal for Black queer men in the UK. Claim yours here: ${url}`

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(url)
      setCopied(true)
      setTimeout(() => setCopied(false), 2500)
    } catch {
      // fall through silently
    }
  }

  const handleShare = async () => {
    if (typeof navigator.share !== 'function') {
      handleCopy()
      return
    }
    try {
      await navigator.share({
        title: "Ivor's Compass",
        text: message,
        url,
      })
    } catch {
      // user cancelled or unsupported — non-blocking
    }
  }

  const whatsappHref = `https://wa.me/?text=${encodeURIComponent(message)}`
  const smsHref = `sms:?&body=${encodeURIComponent(message)}`
  const mailtoHref = `mailto:?subject=${encodeURIComponent("Ivor's Compass — a wellness journal")}&body=${encodeURIComponent(message)}`

  return (
    <div className="bg-blkout-purple border-2 border-gold p-5">
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="min-w-0 flex-1">
          <p className="text-gold text-[10px] font-semibold tracking-[0.3em] uppercase mb-1.5">
            Gift {index}
          </p>
          <p className="font-mono font-black text-xl sm:text-2xl tracking-[0.15em] text-gold leading-none break-all">
            {code}
          </p>
        </div>
        <button
          type="button"
          onClick={handleCopy}
          className="shrink-0 bg-warm-white text-compass-black font-black uppercase tracking-wider text-[11px] px-4 py-2.5 hover:bg-gold transition-colors"
          aria-label={`Copy gift code ${code} share link`}
        >
          {copied ? 'Copied ✓' : 'Copy link'}
        </button>
      </div>

      <div className="flex flex-wrap gap-2 mt-3 pt-3 border-t border-gold/30">
        {typeof navigator !== 'undefined' && typeof navigator.share === 'function' && (
          <button
            type="button"
            onClick={handleShare}
            className="text-warm-white text-[11px] font-semibold tracking-[0.15em] uppercase hover:text-gold transition-colors px-2 py-1"
          >
            Share →
          </button>
        )}
        <a
          href={whatsappHref}
          target="_blank"
          rel="noopener noreferrer"
          className="text-warm-white text-[11px] font-semibold tracking-[0.15em] uppercase hover:text-gold transition-colors px-2 py-1"
        >
          WhatsApp
        </a>
        <a
          href={smsHref}
          className="text-warm-white text-[11px] font-semibold tracking-[0.15em] uppercase hover:text-gold transition-colors px-2 py-1"
        >
          Messages
        </a>
        <a
          href={mailtoHref}
          className="text-warm-white text-[11px] font-semibold tracking-[0.15em] uppercase hover:text-gold transition-colors px-2 py-1"
        >
          Email
        </a>
      </div>
    </div>
  )
}
