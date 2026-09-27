import { useEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import SignatureWord from './SignatureWord.jsx'
import { karthu } from '../data/karthu.js'
import { lockScroll } from '../hooks/useLenis.js'

/**
 * The opening scene: blackness → a tiny golden light → the lead-in line
 * fades in → "Karthu" is written by a glowing golden pen (with underline
 * sweep) → a soft spotlight sweeps the stage → then it WAITS.
 *
 * The page unlocks only when she taps / clicks — "tap to enter".
 *
 * Considerate details:
 *  - a returning visit in the same session plays a shorter cut
 *  - `?fast` compresses the ceremony (handy for previews & testing)
 */
const SEEN_KEY = 'karthu-seen-session'

function getSpeed() {
  if (typeof window === 'undefined') return 1
  const params = new URLSearchParams(window.location.search)
  if (params.has('fast')) return 0.25
  try {
    return sessionStorage.getItem(SEEN_KEY) ? 0.55 : 1
  } catch {
    return 1
  }
}

export default function Intro({ onDone }) {
  const root = useRef(null)
  const spark = useRef(null)
  const sweepRef = useRef(null)
  const [stage, setStage] = useState(0) // 0 spark, 1 writing, 2 lead-in, 3 name done, 4 waiting-for-tap
  const [done, setDone] = useState(false)
  const SPEED = useRef(getSpeed()).current

  const finish = () => {
    setDone(true)
    lockScroll(false)
    try {
      sessionStorage.setItem(SEEN_KEY, '1')
    } catch {
      /* private mode */
    }
    onDone?.()
  }

  useEffect(() => {
    lockScroll(true)
    window.scrollTo(0, 0)
    const ctx = gsap.context(() => {
      const tl = gsap
        .timeline()
        .fromTo(
          spark.current,
          { opacity: 0, scale: 0.2 },
          { opacity: 1, scale: 1, duration: 1.6, ease: 'power2.out' }
        )
        .to(spark.current, {
          scale: 1.35,
          opacity: 0.85,
          duration: 1.2,
          yoyo: true,
          repeat: 1,
          ease: 'sine.inOut',
        })
        .to(spark.current, { opacity: 0, scale: 2.4, duration: 1, ease: 'power2.in' }, '+=0.1')
        .add(() => setStage(1), '-=0.3')
      tl.timeScale(1 / SPEED)
    }, root)
    return () => ctx.revert()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // the beat-by-beat script
  useEffect(() => {
    if (stage !== 1) return undefined
    // the pen writes her name; the lead-in line appears just before it starts
    const t = setTimeout(() => setStage(2), 400 * SPEED)
    return () => clearTimeout(t)
  }, [stage, SPEED])

  // a small beat after the name finishes → then we wait for her tap
  useEffect(() => {
    if (stage !== 3) return undefined
    const t = setTimeout(() => setStage(4), 700 * SPEED)
    return () => clearTimeout(t)
  }, [stage, SPEED])

  // the spotlight sweep plays once as she arrives at "tap to enter"
  useEffect(() => {
    if (stage !== 4) return undefined
    const ctx = gsap.context(() => {
      gsap
        .timeline({ timeScale: 1 / SPEED })
        .fromTo(sweepRef.current, { opacity: 0 }, { opacity: 1, duration: 0.8 }, 0.2)
        .to(sweepRef.current, { left: '110%', duration: 3.4, ease: 'power1.inOut' }, 0.2)
        .to(sweepRef.current, { opacity: 0, duration: 0.9 }, 2.9)
    }, root)
    return () => ctx.revert()
  }, [stage, SPEED])

  const reduced =
    typeof window !== 'undefined' &&
    window.matchMedia?.('(prefers-reduced-motion: reduce)').matches

  // reduced motion: skip straight to the waiting state (still one tap to enter)
  useEffect(() => {
    if (reduced) setStage(4)
    return undefined
  }, [reduced])

  return (
    <div
      ref={root}
      aria-hidden={done}
      onPointerDown={(e) => {
        e.stopPropagation()
        if (!done && stage >= 4) finish()
      }}
      className={`fixed inset-0 z-50 flex items-center justify-center bg-black transition-all duration-[1600ms] ${
        done ? 'opacity-0 pointer-events-none' : 'opacity-100'
      }`}
    >
      {/* the tiny golden light */}
      <div
        ref={spark}
        className="absolute w-4 h-4 rounded-full"
        style={{
          background: 'radial-gradient(circle, #fff7dd 0%, #F5D76E 40%, rgba(212,175,55,0) 75%)',
          boxShadow: '0 0 24px 8px rgba(245,215,110,0.5)',
          opacity: 0,
        }}
      />

      {/* central spotlight that slowly blooms behind the words */}
      <div
        className="absolute inset-0 pointer-events-none transition-opacity duration-[3000ms]"
        style={{
          background:
            'radial-gradient(ellipse 62% 46% at 50% 46%, rgba(220,188,96,0.10), rgba(212,175,55,0.04) 45%, transparent 72%)',
          opacity: stage >= 1 ? 1 : 0,
        }}
      />

      {/* sweeping stage spotlight (left → right) */}
      <div
        ref={sweepRef}
        className="absolute top-0 bottom-0 pointer-events-none"
        style={{
          left: '-30%',
          width: '46vw',
          background:
            'linear-gradient(90deg, transparent, rgba(232,203,120,0.07) 45%, rgba(245,215,110,0.10) 50%, rgba(232,203,120,0.07) 55%, transparent)',
          opacity: 0,
          filter: 'blur(2px)',
        }}
      />

      {/* the words */}
      <div className="relative w-[min(86vw,760px)] px-6 text-center">
        {/* lead-in line, first */}
        <div
          className="label mb-2 transition-opacity duration-1000"
          style={{ opacity: stage >= 2 ? 1 : 0 }}
        >
          {karthu.introLead}
        </div>

        {/* her name, written by the golden pen */}
        {stage >= 1 && (
          <SignatureWord
            text={karthu.name}
            underline
            duration={3.1 * SPEED}
            fontSize={200}
            delay={0.9 * SPEED}
            onComplete={() => setStage((s) => (s < 3 ? 3 : s))}
          />
        )}

        {/* centered tap-to-enter hint — the page waits here for her tap */}
        <div
          className="mt-12 transition-opacity duration-1000"
          style={{ opacity: stage >= 4 ? 1 : 0 }}
        >
          <span className="label pulse-soft inline-block" style={{ opacity: 0.8 }}>
            tap to enter
          </span>
        </div>
      </div>
    </div>
  )
}
