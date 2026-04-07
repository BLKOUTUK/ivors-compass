interface ImageBentoBoxProps {
  word: string
  colorHex: string
  imageSrc: string
  isActive: boolean
  onClick: () => void
  ariaLabel: string
}

export function ImageBentoBox({ word, colorHex, imageSrc, isActive, onClick, ariaLabel }: ImageBentoBoxProps) {
  return (
    <button
      type="button"
      data-image-box
      aria-pressed={isActive}
      aria-label={ariaLabel}
      onClick={onClick}
      className="relative overflow-hidden border border-gold/20 transition-all active:scale-[0.98] hover:border-gold/40 focus-visible:ring-2 focus-visible:ring-gold/60 focus-visible:ring-offset-2 focus-visible:ring-offset-compass-black w-full min-h-[120px]"
      style={{
        boxShadow: isActive ? `0 0 16px ${colorHex}` : '0 2px 16px rgba(0,0,0,0.4)',
        borderColor: isActive ? colorHex : undefined,
        '--box-color': colorHex,
      } as React.CSSProperties}
    >
      {/* Background image */}
      <img
        src={imageSrc}
        alt=""
        aria-hidden="true"
        className="absolute inset-0 w-full h-full object-cover"
      />

      {/* Colour overlay */}
      <div
        className="absolute inset-0"
        style={{
          backgroundColor: colorHex,
          mixBlendMode: 'multiply',
          opacity: isActive ? 0.7 : 0.5,
        }}
      />

      {/* Dark vignette for legibility */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/30" />

      {/* Word */}
      <div className="relative z-10 flex items-center justify-center h-full min-h-[120px] p-4">
        <span
          className={`font-bold-shell text-xl tracking-wide text-white transition-all duration-300 ${
            isActive ? 'opacity-100 scale-100 animate-word-reveal' : 'opacity-0 scale-75'
          }`}
        >
          {word}
        </span>
      </div>
    </button>
  )
}
