import { useEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { karthu } from '../data/karthu.js'

gsap.registerPlugin(ScrollTrigger)

const CANDLES = 5

/**
 * The birthday cake — a slim, elegant SVG on a black stage.
 * Tap candles to light them; when all five burn, a soft gold particle
 * celebration rises and the wish button appears. One click: they flicker out.
 */
export default function Cake() {
  const root = useRef(null)
  const [lit, setLit] = useState(0)
  const [wished, setWished] = useState(false)
  const sparkHost = useRef(null)
  const allLit = lit >= CANDLES

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from('.cake-stage', {
        opacity: 0,
        y: 60,
        duration: 1.8,
        ease: 'power2.out',
        scrollTrigger: { trigger: root.current, start: 'top 68%' },
      })
    }, root)
    return () => ctx.revert()
  }, [])

  const celebrate = () => {
    const host = sparkHost.current
    if (!host) return
    for (let i = 0; i < 26; i++) {
      const s = document.createElement('span')
      const size = 2 + Math.random() * 3
      const angle = Math.random() * Math.PI * 2
      const dist = 60 + Math.random() * 130
      s.style.cssText = `position:absolute;left:50%;top:38%;width:${size}px;height:${size}px;border-radius:50%;
        background:radial-gradient(circle,#fff6d8,#F5D76E 60%,rgba(212,175,55,0));opacity:0.9;
        transition:transform ${2 + Math.random()}s cubic-bezier(0.15,0.6,0.3,1),opacity ${2 + Math.random()}s ease;
        will-change:transform,opacity;`
      host.appendChild(s)
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          s.style.transform = `translate(${Math.cos(angle) * dist}px, ${-Math.abs(Math.sin(angle) * dist) - 30}px)`
          s.style.opacity = '0'
        })
      })
      setTimeout(() => s.remove(), 3600)
    }
  }

  const onWish = () => {
    setWished(true)
    // candles flicker out, gently
    gsap.to('.flame', { opacity: 0, scale: 0.3, duration: 1.6, stagger: 0.22, ease: 'power2.in' })
  }

  return (
    <section ref={root} className="relative py-[22vh] text-center">
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            'radial-gradient(ellipse 42% 34% at 50% 58%, rgba(220,188,96,0.09), transparent 70%)',
        }}
      />

      <div className="cake-stage relative z-10">
        <div className="label mb-3">the last light of the evening</div>
        <h2 className="script text-4xl sm:text-5xl text-gold-glow mb-14">{karthu.cakePrompt}</h2>

        <div ref={sparkHost} className="relative inline-block">
          <CakeSVG litCount={lit} wished={wished} onLight={(i) => setLit((v) => Math.max(v, i + 1))} />
        </div>

        <div className="mt-10 label">
          {wished ? '' : allLit ? karthu.cakeAfterAll : `${lit} / ${CANDLES} candles`}
        </div>

        {!allLit && !wished && (
          <p className="mt-3 text-xs tracking-widest text-gold-soft/70 uppercase">
            Light up by clicking the candles
          </p>
        )}

        {allLit && !wished && (
          <button onClick={onWish} className="btn-wish mt-8">
            {karthu.wishButton}
          </button>
        )}
        {wished && (
          <p className="font-serif italic text-2xl text-gold-glow mt-8">{karthu.wishDone}</p>
        )}
      </div>
    </section>
  )
}

function CakeSVG({ litCount, wished, onLight }) {
  return (
    <svg viewBox="0 0 320 300" className="w-[min(76vw,340px)]" role="img" aria-label="Birthday cake">
      <defs>
        <radialGradient id="flameGrad" cx="0.5" cy="0.35" r="0.75">
          <stop offset="0" stopColor="#fff7dd" />
          <stop offset="0.5" stopColor="#F5D76E" />
          <stop offset="1" stopColor="rgba(212,175,55,0)" />
        </radialGradient>
        <linearGradient id="goldTier" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#3a2f14" />
          <stop offset="0.5" stopColor="#14110a" />
          <stop offset="1" stopColor="#0a0906" />
        </linearGradient>
      </defs>

      {/* plate + soft pool of light */}
      <ellipse cx="160" cy="272" rx="120" ry="12" fill="#000" />
      <ellipse cx="160" cy="272" rx="120" ry="12" fill="#e8c878" opacity="0.05" />

      {/* tiers */}
      <rect x="70" y="216" width="180" height="52" rx="4" fill="url(#goldTier)" stroke="rgba(212,175,55,0.55)" strokeWidth="1.2" />
      <rect x="92" y="168" width="136" height="48" rx="4" fill="url(#goldTier)" stroke="rgba(212,175,55,0.4)" strokeWidth="1" />
      <rect x="112" y="128" width="96" height="40" rx="4" fill="url(#goldTier)" stroke="rgba(212,175,55,0.35)" strokeWidth="1" />

      {/* thin gold trims */}
      <line x1="70" y1="222" x2="250" y2="222" stroke="#D4AF37" strokeWidth="0.8" opacity="0.6" />
      <line x1="92" y1="174" x2="228" y2="174" stroke="#D4AF37" strokeWidth="0.8" opacity="0.5" />
      <line x1="112" y1="134" x2="208" y2="134" stroke="#D4AF37" strokeWidth="0.8" opacity="0.45" />

      {/* five candles, evenly spaced on top tier */}
      {[0, 1, 2, 3, 4].map((i) => {
        const x = 124 + i * 18
        const isLit = !wished && i < litCount
        return (
          <g key={i} onClick={() => onLight(i)} className="cursor-pointer">
            <rect x={x - 2.4} y="96" width="4.8" height="32" rx="1.6" fill="#F5D76E" opacity="0.85" />
            <rect x={x - 0.7} y="88" width="1.4" height="8" rx="0.7" fill="#caa94a" />
            {isLit && (
              <>
                <circle cx={x} cy="80" r="13" fill="url(#flameGrad)" className="flame" style={{ transformOrigin: `${x}px 88px`, animation: 'floaty 1.8s ease-in-out infinite' }} />
                <circle cx={x} cy="81" r="4.5" fill="#fffbe9" className="flame" />
              </>
            )}
            {/* invisible generous tap target */}
            <rect x={x - 12} y="70" width="24" height="60" fill="transparent" />
          </g>
        )
      })}

      {/* candle glow reflections on the cake when lit */}
      {(() => {
        const glows = Math.min(litCount, 5)
        return Array.from({ length: glows }).map((_, i) => (
          <ellipse key={i} cx={124 + i * 18} cy="128" rx="10" ry="3" fill="#e8c878" opacity={wished ? 0 : 0.12} />
        ))
      })()}
    </svg>
  )
}
