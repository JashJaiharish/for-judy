import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import SignatureWord from './SignatureWord.jsx'
import { karthu } from '../data/karthu.js'

gsap.registerPlugin(ScrollTrigger)

/**
 * The hero: a pure typographic stage — her name in gold script,
 * a few quiet words, and all the black space around them.
 */
export default function Hero() {
  const root = useRef(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from('.hero-fade', {
        opacity: 0,
        y: 34,
        duration: 1.6,
        stagger: 0.35,
        ease: 'power2.out',
        scrollTrigger: { trigger: root.current, start: 'top 62%' },
      })
    }, root)
    return () => ctx.revert()
  }, [])

  return (
    <section ref={root} className="relative min-h-screen flex items-center justify-center">
      {/* soft center spotlight pool */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            'radial-gradient(ellipse 52% 42% at 50% 46%, rgba(220,188,96,0.07), transparent 70%)',
        }}
      />

      <div className="relative z-10 text-center px-6 max-w-3xl mx-auto">
        <div className="hero-fade label mb-8">The one &amp; only show</div>

        <div className="w-[min(84vw,520px)] mx-auto">
          <SignatureWord
            text={karthu.name}
            duration={2.4}
            fontSize={190}
            underline
            bloom={false}
          />
        </div>

        <p className="hero-fade font-serif text-2xl sm:text-3xl text-gold-glow mt-10">
          {karthu.heroMessage}
        </p>

        <div className="hero-fade hairline w-40 my-9 mx-auto" />

        <p className="hero-fade font-serif italic text-lg sm:text-xl text-cream/70 leading-relaxed">
          {karthu.heroLines[0]}
          <br />
          {karthu.heroLines[1]}
          <br />
          {karthu.heroLines[2]}
        </p>
      </div>
    </section>
  )
}
