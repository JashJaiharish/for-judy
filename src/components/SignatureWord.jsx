import { useEffect, useId, useRef } from 'react'
import gsap from 'gsap'

/**
 * SignatureWord — the "written by a golden pen" effect.
 *
 * 1. A decorative flourish path draws itself (SVG stroke-dashoffset),
 *    like the pen's entry stroke.
 * 2. The script text sits beneath a soft-edged wipe mask: a growing
 *    rectangle whose right edge is the "wet glow" of the pen — the
 *    reveal ACCUMULATES, so letters stay written once passed.
 * 3. A small glowing pen dot tracks the writing front.
 * 4. Optional underline sweeps in after the word completes.
 */
export default function SignatureWord({
  text,
  vbW = 1200,
  vbH = 300,
  fontSize = 170,
  flourish = 'M 40 210 C 180 120, 260 250, 420 170 S 760 90, 900 190 S 1060 240, 1150 150',
  duration = 3,
  delay = 0,
  bloom = true,
  underline = false,
  onComplete,
}) {
  const root = useRef(null)
  const flourishPath = useRef(null)
  const wipeRect = useRef(null)
  const pen = useRef(null)
  const line = useRef(null)
  const uid = useId().replace(/[^a-zA-Z0-9]/g, '')
  const maskId = `wipe-${uid}`
  const gradId = `grad-${uid}`
  const goldId = `gold-${uid}`

  useEffect(() => {
    const el = root.current
    if (!el) return undefined

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ delay, onComplete: () => onComplete?.() })

      // 1 — flourish draws itself
      if (flourishPath.current) {
        const len = flourishPath.current.getTotalLength?.() ?? 1200
        gsap.set(flourishPath.current, { strokeDasharray: len, strokeDashoffset: len })
        tl.to(
          flourishPath.current,
          { strokeDashoffset: 0, duration: duration * 0.55, ease: 'power1.inOut' },
          0
        )
      }

      // 2 — the pen writes: the wipe rect grows left → right (accumulating)
      const sweep = { x: 0 }
      tl.to(
        sweep,
        {
          x: vbW + 60,
          duration,
          ease: 'power1.inOut',
          onUpdate: () => {
            if (wipeRect.current) wipeRect.current.setAttribute('width', Math.max(0, sweep.x))
            if (pen.current) {
              pen.current.style.left = `${(sweep.x / vbW) * 100}%`
              pen.current.style.top = `${46 + Math.sin(sweep.x / 90) * 5}%`
            }
          },
        },
        duration * 0.18
      )

      // pen dot fades in, then out
      if (bloom && pen.current) {
        tl.fromTo(pen.current, { opacity: 0 }, { opacity: 1, duration: 0.5 }, duration * 0.18)
        tl.to(pen.current, { opacity: 0, duration: 0.7 }, duration * 1.1)
      }

      // 3 — underline sweep
      if (underline && line.current) {
        tl.fromTo(
          line.current,
          { scaleX: 0, opacity: 0.9 },
          { scaleX: 1, opacity: 1, duration: 0.9, ease: 'power2.out' },
          duration * 0.94
        )
      }
    }, el)

    return () => ctx.revert()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [text])

  return (
    <div ref={root} className="relative w-full">
      <svg
        viewBox={`0 0 ${vbW} ${vbH}`}
        className="w-full h-auto overflow-visible"
        aria-label={text}
        role="img"
      >
        <defs>
          {/* soft right edge for the accumulating wipe */}
          <linearGradient id={gradId} x1="0" y1="0" x2="1" y2="0">
            <stop offset="0" stopColor="white" />
            <stop offset="0.86" stopColor="white" />
            <stop offset="1" stopColor="#777" />
          </linearGradient>
          <mask id={maskId}>
            <rect x="0" y="0" width={vbW} height={vbH} fill="black" />
            <rect ref={wipeRect} x="0" y="0" width="0" height={vbH} fill={`url(#${gradId})`} />
          </mask>
          {/* gold gradient for the lettering */}
          <linearGradient id={goldId} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#F5D76E" />
            <stop offset="0.55" stopColor="#D4AF37" />
            <stop offset="1" stopColor="#9c7c22" />
          </linearGradient>
          <filter id={`blur-${uid}`} x="-30%" y="-30%" width="160%" height="160%">
            <feGaussianBlur stdDeviation="6" />
          </filter>
        </defs>

        {/* written lettering: soft glow underneath + crisp gold on top */}
        <g mask={`url(#${maskId})`}>
          <text
            x={vbW / 2}
            y={vbH * 0.62}
            textAnchor="middle"
            fontFamily="'Great Vibes', cursive"
            fontSize={fontSize}
            fill="#D4AF37"
            filter={`url(#blur-${uid})`}
            opacity="0.85"
          >
            {text}
          </text>
          <text
            x={vbW / 2}
            y={vbH * 0.62}
            textAnchor="middle"
            fontFamily="'Great Vibes', cursive"
            fontSize={fontSize}
            fill={`url(#${goldId})`}
          >
            {text}
          </text>
        </g>

        {/* decorative flourish stroke */}
        <path
          ref={flourishPath}
          d={flourish}
          fill="none"
          stroke="#D4AF37"
          strokeWidth="2.2"
          strokeLinecap="round"
          opacity="0.65"
        />

        {/* underline */}
        {underline && (
          <line
            ref={line}
            x1={vbW * 0.18}
            y1={vbH * 0.82}
            x2={vbW * 0.82}
            y2={vbH * 0.82}
            stroke="#D4AF37"
            strokeWidth="1.6"
            opacity="0.8"
            style={{ transformOrigin: 'center', transformBox: 'fill-box' }}
          />
        )}
      </svg>

      {/* the golden pen glow (DOM, tracks the write) */}
      {bloom && (
        <div
          ref={pen}
          className="absolute w-3 h-3 rounded-full pointer-events-none"
          style={{
            left: '0%',
            top: '46%',
            background: 'radial-gradient(circle, #fff7dd 0%, #F5D76E 45%, rgba(212,175,55,0) 75%)',
            boxShadow: '0 0 18px 6px rgba(245,215,110,0.55)',
            opacity: 0,
          }}
        />
      )}
    </div>
  )
}
