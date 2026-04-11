import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { compassCodesRemaining, logAnalytics } from '../lib/supabase'

const EVENT_DATE = 'SUN 12 APR · 3–6PM · STANLEY ARTS · SOUTH NORWOOD'

export default function LandingPage() {
  const [remaining, setRemaining] = useState<number | null>(null)

  useEffect(() => {
    logAnalytics(null, 'landing_view')
    compassCodesRemaining().then(setRemaining)
  }, [])

  const soldOut = remaining !== null && remaining <= 0
  const claimed = remaining !== null ? 100 - remaining : 0
  const progress = remaining !== null ? Math.min(100, (claimed / 100) * 100) : 0

  return (
    <div className="min-h-screen bg-compass-black text-warm-white font-sans">
      {/* ═══════════════════════════════════════════════════════════════
          HERO — triptych foundation (archive → restored → avatar)
                   the story arc of "making shared heritage personal"
          ═══════════════════════════════════════════════════════════════ */}
      <section className="relative overflow-hidden border-t-4 border-b-4 border-gold">
        {/* Triptych foundation — warm duotone */}
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: "url('/images/ivor-triptych.jpg')",
            opacity: 0.28,
          }}
          aria-hidden
        />
        {/* Purple-to-black wash */}
        <div
          className="absolute inset-0"
          style={{
            background:
              'linear-gradient(180deg, rgba(74,25,66,0.7) 0%, rgba(26,26,46,0.88) 55%, #1a1a2e 100%)',
          }}
          aria-hidden
        />

        <div className="relative z-10 max-w-5xl mx-auto px-6 pt-24 pb-20">
          <p className="text-gold text-[11px] sm:text-xs font-semibold tracking-[0.3em] uppercase mb-8">
            Croydon Heritage · Black Queer Wellness
          </p>

          <h1 className="font-sans font-black uppercase leading-[0.88] tracking-tight text-[15vw] sm:text-7xl md:text-8xl mb-4">
            Ivor's
            <br />
            <span className="text-gold">Compass</span>
          </h1>

          {/* Disruption — italic lowercase breaking through the shell */}
          <p className="font-serif italic text-xl sm:text-2xl text-warm-white/85 mt-6 mb-12 max-w-xl">
            making shared heritage personal.
          </p>

          <div className="h-px w-24 bg-gold mb-8" aria-hidden />

          <p className="text-base sm:text-lg leading-relaxed text-warm-white/90 max-w-xl mb-10">
            A digital wellness journal built around the hidden history of Black
            queer Britain. Heritage meditations, an affirmation deck, a
            commissioned art installation, and a private space to write,
            reflect and return to.
          </p>

          <div className="flex flex-wrap gap-4 items-center">
            {soldOut ? (
              <Link
                to="/waitlist?source=sold_out"
                className="inline-block bg-blkout-red hover:bg-red-700 text-white font-black uppercase tracking-wider text-sm px-8 py-5 transition-colors"
              >
                Join the Summer waitlist →
              </Link>
            ) : (
              <Link
                to="/claim"
                className="inline-block bg-blkout-red hover:bg-red-700 text-white font-black uppercase tracking-wider text-sm px-8 py-5 transition-colors shadow-[6px_6px_0_0_#d4af37]"
              >
                Claim your free code →
              </Link>
            )}
            <Link
              to="/unlock"
              className="text-warm-white/70 hover:text-gold text-sm underline underline-offset-4 transition-colors"
            >
              Already have a code?
            </Link>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════
          TRIPTYCH — the story arc, made literal
          ═══════════════════════════════════════════════════════════════ */}
      <section className="bg-compass-black">
        <div className="max-w-6xl mx-auto px-6 py-16">
          <p className="text-gold text-[11px] font-semibold tracking-[0.3em] uppercase mb-4 text-center">
            Ivor Cummings · 1913–1992
          </p>
          <h2 className="font-sans font-black uppercase tracking-tight text-3xl sm:text-4xl leading-[0.95] mb-10 text-center">
            From archive to <span className="text-gold">living presence.</span>
          </h2>

          <div className="grid grid-cols-3 gap-2 sm:gap-3 border-2 border-gold/60">
            <figure className="relative">
              <img
                src="/images/ivor-archive.jpg"
                alt="Ivor Cummings, 1974 — the archive remnant"
                className="w-full h-full object-cover grayscale-[20%]"
                loading="lazy"
              />
              <figcaption className="absolute bottom-0 left-0 right-0 bg-compass-black/80 px-3 py-2 text-gold text-[10px] tracking-[0.2em] uppercase">
                1974 · archive
              </figcaption>
            </figure>
            <figure className="relative">
              <img
                src="/images/ivor-restored.jpg"
                alt="Ivor Cummings at his desk — restored from press archive"
                className="w-full h-full object-cover grayscale-[20%]"
                loading="lazy"
              />
              <figcaption className="absolute bottom-0 left-0 right-0 bg-compass-black/80 px-3 py-2 text-gold text-[10px] tracking-[0.2em] uppercase">
                1940s · restored
              </figcaption>
            </figure>
            <figure className="relative">
              <img
                src="/images/ivor-avatar.jpg"
                alt="Ivor as a living avatar — spirit, not likeness"
                className="w-full h-full object-cover grayscale-[20%]"
                loading="lazy"
              />
              <figcaption className="absolute bottom-0 left-0 right-0 bg-compass-black/80 px-3 py-2 text-gold text-[10px] tracking-[0.2em] uppercase">
                Today · avatar
              </figcaption>
            </figure>
          </div>

          <p className="text-text-muted text-sm italic text-center mt-6 max-w-2xl mx-auto leading-relaxed">
            Ivor Cummings was the Colonial Office welfare officer who met the
            Empire Windrush in 1948. Most pictures of him are grainy, few, or
            locked behind permissions. So we restored what we could find — and
            for the moments where no photograph exists, we built an avatar in
            his spirit, not his likeness.
          </p>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════
          SCARCITY — bold command with live counter
          ═══════════════════════════════════════════════════════════════ */}
      <section className="bg-blkout-purple border-b-4 border-gold">
        <div className="max-w-5xl mx-auto px-6 py-14">
          <p className="text-gold text-[11px] font-semibold tracking-[0.3em] uppercase mb-4">
            The pivot
          </p>
          <h2 className="font-sans font-black uppercase tracking-tight text-3xl sm:text-5xl leading-[0.95] mb-6">
            The print cards
            <br />
            <span className="text-gold">didn't arrive in time.</span>
          </h2>
          <p className="text-warm-white/90 text-lg leading-relaxed max-w-2xl mb-10">
            So we're releasing all 100 access codes here instead. Free. Digital.
            For Croydon residents and anyone visiting from across South London.
            First-come, first-served.
          </p>

          {/* Live counter — bold, not hidden */}
          <div className="border-4 border-gold bg-compass-black/50 p-6 sm:p-8 max-w-2xl">
            <div className="flex items-baseline justify-between mb-4">
              <span className="text-gold text-[11px] font-semibold tracking-[0.25em] uppercase">
                {soldOut ? 'All claimed' : 'Remaining'}
              </span>
              <span className="text-gold text-[11px] font-semibold tracking-[0.25em] uppercase">
                {claimed} / 100
              </span>
            </div>
            <div
              className="font-sans font-black text-6xl sm:text-7xl text-gold leading-none mb-5"
              aria-live="polite"
            >
              {remaining === null ? '—' : remaining}
            </div>
            {/* Progress bar — no rounding */}
            <div className="h-2 bg-compass-border mb-6" aria-hidden>
              <div
                className="h-full bg-gold transition-all duration-500"
                style={{ width: `${progress}%` }}
              />
            </div>
            {soldOut ? (
              <Link
                to="/waitlist?source=sold_out"
                className="block w-full bg-blkout-red hover:bg-red-700 text-white text-center font-black uppercase tracking-wider text-sm py-5 transition-colors"
              >
                Join the Summer waitlist →
              </Link>
            ) : (
              <Link
                to="/claim"
                className="block w-full bg-blkout-red hover:bg-red-700 text-white text-center font-black uppercase tracking-wider text-sm py-5 transition-colors"
              >
                Claim your code →
              </Link>
            )}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════
          FOR / BY — the tender break in the shell
          ═══════════════════════════════════════════════════════════════ */}
      <section className="bg-compass-black border-b border-gold/30">
        <div className="max-w-5xl mx-auto px-6 py-20">
          <div className="grid sm:grid-cols-12 gap-8 items-start">
            <div className="sm:col-span-5">
              <p className="text-gold text-[11px] font-semibold tracking-[0.3em] uppercase mb-4">
                Who it's from
              </p>
              <h2 className="font-sans font-black uppercase leading-[0.9] text-4xl sm:text-5xl tracking-tight">
                By Black
                <br />
                queer men.
              </h2>
            </div>
            <div className="sm:col-span-7">
              <p className="font-serif italic text-xl sm:text-2xl text-warm-white/90 leading-relaxed mb-6">
                For Black queer men, and everyone who'll use it with care.
              </p>
              <p className="text-warm-white/80 text-base leading-relaxed mb-4">
                Shaped by four writers, a dual-layer Nugent &amp; Douglas art
                installation, and the archive of Ivor Cummings — the 1940s
                Colonial Office welfare officer our AI companion is named
                after.
              </p>
              <p className="text-text-muted text-sm leading-relaxed">
                We're not policing the door. We are naming who this is rooted in.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════
          WHAT'S INSIDE — em-dash list, no bullets
          ═══════════════════════════════════════════════════════════════ */}
      <section className="bg-compass-dark">
        <div className="max-w-5xl mx-auto px-6 py-20">
          <p className="text-gold text-[11px] font-semibold tracking-[0.3em] uppercase mb-4">
            What's inside
          </p>
          <h2 className="font-sans font-black uppercase tracking-tight text-4xl sm:text-5xl leading-[0.95] mb-12">
            Five ways
            <br />
            <span className="text-gold">to return.</span>
          </h2>

          <dl className="space-y-8 max-w-3xl">
            <InsideItem
              title="Five heritage meditations"
              body="Commissioned pieces and first-hand reflections that turn shared history into something you can sit with."
            />
            <InsideItem
              title="32-card affirmation deck"
              body="Pulled daily. Rooted in Black queer lineages, not generic self-help."
            />
            <InsideItem
              title="Dual-layer art installation"
              body="A Nugent &amp; Douglas inspired piece that reveals different layers under different coloured light."
            />
            <InsideItem
              title="Private journal"
              body="Entries stay on your device. We never see them. We never sell them."
            />
            <InsideItem
              title="Community soundscape"
              body="An ambient audio layer you can play while you write."
            />
          </dl>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════
          WAITLIST ALT — secondary path
          ═══════════════════════════════════════════════════════════════ */}
      <section className="bg-blkout-purple/40 border-t border-b border-gold/30">
        <div className="max-w-5xl mx-auto px-6 py-16">
          <div className="grid sm:grid-cols-12 gap-8 items-center">
            <div className="sm:col-span-8">
              <p className="text-gold text-[11px] font-semibold tracking-[0.3em] uppercase mb-4">
                Summer release
              </p>
              <h2 className="font-sans font-black uppercase tracking-tight text-3xl sm:text-4xl leading-[0.95] mb-4">
                Not Croydon.
                <br />
                <span className="text-gold">Or missed out?</span>
              </h2>
              <p className="text-warm-white/85 leading-relaxed">
                We're releasing Ivor's Compass wider this Summer, with a print
                edition of the journal. Lock in{' '}
                <span className="text-gold font-semibold">50% off digital</span>{' '}
                and{' '}
                <span className="text-gold font-semibold">
                  20% off the print journal
                </span>
                .
              </p>
            </div>
            <div className="sm:col-span-4">
              <Link
                to="/waitlist?source=opt_in"
                className="block w-full text-center border-2 border-gold hover:bg-gold hover:text-compass-black text-gold font-black uppercase tracking-wider text-sm py-5 transition-colors"
              >
                Join the waitlist →
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════
          EVENT + FUNDER FOOTER
          ═══════════════════════════════════════════════════════════════ */}
      <footer className="bg-compass-black border-t-4 border-gold">
        <div className="max-w-5xl mx-auto px-6 py-16">
          <p className="text-gold text-[11px] font-semibold tracking-[0.3em] uppercase mb-3">
            Launching at
          </p>
          <p className="font-sans font-black uppercase tracking-tight text-xl sm:text-2xl mb-10">
            {EVENT_DATE}
          </p>

          <div className="flex flex-wrap items-center gap-6 text-text-muted text-[11px] tracking-[0.2em] uppercase border-t border-compass-border pt-8">
            <span>Supported by</span>
            <span className="text-warm-white/80">Croydon Council</span>
            <span className="text-gold">—</span>
            <span className="text-warm-white/80">
              National Lottery Heritage Fund
            </span>
          </div>

          <div className="mt-10 flex items-center gap-4">
            <img
              src="/images/blkout-logo.png"
              alt="BLKOUT"
              className="w-10 h-10 opacity-80"
              style={{ filter: 'brightness(2)' }}
            />
            <div>
              <p className="text-warm-white/90 text-sm font-semibold">
                A BLKOUT project
              </p>
              <p className="text-text-muted text-[11px] tracking-widest uppercase">
                Community-owned by Black queer men ·{' '}
                <a href="https://blkoutuk.com" className="hover:text-gold">
                  blkoutuk.com
                </a>
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}

function InsideItem({ title, body }: { title: string; body: string }) {
  return (
    <div className="grid grid-cols-[auto_1fr] gap-6 items-start">
      <span
        className="text-gold font-black text-2xl leading-none select-none pt-1"
        aria-hidden
      >
        —
      </span>
      <div>
        <dt className="font-sans font-black uppercase tracking-wider text-warm-white text-lg mb-1">
          {title}
        </dt>
        <dd className="text-text-muted text-base leading-relaxed">{body}</dd>
      </div>
    </div>
  )
}
