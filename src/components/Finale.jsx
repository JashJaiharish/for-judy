import { useEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import SignatureWord from './SignatureWord.jsx'
import { karthu } from '../data/karthu.js'

gsap.registerPlugin(ScrollTrigger)

/**
 * The final scene. The performer glides across a lone spotlight,
 * fades… her name writes itself, then the last messages, one by one —
 * and finally everything fades to a single golden star that whispers
 * "I love you."
 */
export default function Finale({ onEnd }) {
  const root = useRef(null)
  const star = useRef(null)
  const [whisper, setWhisper] = useState(false)
  const [love, setLove] = useState(false)

  useEffect(() => {
    const ctx = gsap.context(() => {
      // messages appear faster
      gsap.from('.final-msg', {
        opacity: 0,
        y: 20,
        stagger: 0.4,
        duration: 0.8,
        ease: 'power2.out',
        scrollTrigger: { trigger: '.final-stack', start: 'top 76%' },
      })

      // the last star blooms faster
      gsap.fromTo(
        star.current,
        { opacity: 0, scale: 0.4 },
        {
          opacity: 1,
          scale: 1,
          duration: 1.2,
          ease: 'power2.out',
          scrollTrigger: { trigger: '.final-star-zone', start: 'top 85%' },
          onComplete: () => setWhisper(true),
        }
      )
    }, root)
    return () => ctx.revert()
  }, [])

  useEffect(() => {
    if (!whisper) return undefined
    const t = setTimeout(() => setLove(true), 300)
    const t2 = setTimeout(() => onEnd?.(), 2500)
    return () => {
      clearTimeout(t)
      clearTimeout(t2)
    }
  }, [whisper, onEnd])

  return (
    <section ref={root} className="relative pb-[26vh]">
      {/* centered looping GIF with clean spacing */}
      {karthu.finaleGif ? (
        <div className="relative flex items-center justify-center pt-6 pb-2 mb-8">
          <img
            src={karthu.finaleGif}
            alt="Finale GIF"
            className="w-[min(65vw,340px)] h-auto object-contain block mx-auto"
          />
        </div>
      ) : (
        <div className="pt-12" />
      )}

      {/* final messages */}
      <div className="final-stack relative z-10 text-center px-6 mt-6">
        <div className="w-[min(80vw,520px)] mx-auto">
          <SignatureWord text={karthu.name} duration={2.4} fontSize={180} bloom={false} />
        </div>
        {karthu.finalMessages.slice(1).map((m) => (
          <p key={m} className="final-msg font-serif text-2xl sm:text-3xl text-gold-glow mt-9">
            {m}
          </p>
        ))}
        <p className="final-msg font-serif italic text-lg text-cream/60 mt-12 max-w-md mx-auto leading-relaxed">
          {karthu.finalWhisper}
        </p>
      </div>

      {/* the last star */}
      <div className="final-star-zone relative h-[64vh] flex items-center justify-center mt-[14vh]">
        <div
          ref={star}
          className="w-3 h-3 rounded-full"
          style={{
            background: 'radial-gradient(circle, #fff7dd 0%, #F5D76E 45%, rgba(212,175,55,0) 78%)',
            boxShadow: '0 0 22px 7px rgba(245,215,110,0.4)',
            opacity: 0,
            animation: 'floaty 5s ease-in-out infinite',
          }}
        />
        <p
          className="absolute font-serif italic text-lg text-cream/70 transition-opacity duration-[800ms]"
          style={{ opacity: love ? 0.9 : 0, top: 'calc(50% + 40px)' }}
        >
          {karthu.finalLove}
        </p>
      </div>
    </section>
  )
}

// soft fade-to-black finale layer (kept subtle; the star remains visible)
export function FinalVeil({ active }) {
  return (
    <div
      aria-hidden="true"
      className="fixed inset-0 z-30 pointer-events-none transition-opacity duration-[4000ms]"
      style={{
        opacity: active ? 0.35 : 0,
        background: 'radial-gradient(ellipse at 50% 55%, transparent 8%, rgba(0,0,0,0.9) 52%)',
      }}
    />
  )
}
