import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { karthu } from '../data/karthu.js'

gsap.registerPlugin(ScrollTrigger)

/**
 * The letter. A large, almost-empty black stage; a golden pool of light
 * grows as you arrive; the words surface line by line while the section
 * is pinned, like a slow handwritten confession.
 */
export default function Letter() {
  const root = useRef(null)
  const pool = useRef(null)

  const lines = karthu.letter.split('\n').filter((l) => l.trim().length > 0)

  useEffect(() => {
    const ctx = gsap.context(() => {
      // spotlight pool grows while pinned
      gsap.fromTo(
        pool.current,
        { opacity: 0, scale: 0.72 },
        {
          opacity: 1,
          scale: 1,
          ease: 'none',
          scrollTrigger: {
            trigger: root.current,
            start: 'top 70%',
            end: 'top 12%',
            scrub: 1.2,
          },
        }
      )

      // the pinned line-by-line reveal
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: root.current,
          start: 'top 12%',
          end: '+=180%',
          scrub: 0.8,
          pin: true,
          anticipatePin: 1,
        },
      })

      tl.from('.letter-line', { opacity: 0, y: 26, stagger: 0.9, duration: 1.1, ease: 'power2.out' })
      tl.from('.letter-sig', { opacity: 0, duration: 1.6, ease: 'power1.inOut' }, '+=1.4')
      tl.to({}, { duration: 1.2 }) // a breath before unpinning
    }, root)
    return () => ctx.revert()
  }, [lines.length])

  return (
    <section ref={root} className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* the growing spotlight pool */}
      <div
        ref={pool}
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            'radial-gradient(ellipse 46% 36% at 50% 50%, rgba(220,188,96,0.10), rgba(212,175,55,0.035) 48%, transparent 74%)',
        }}
      />

      <div className="relative z-10 max-w-3xl px-8 text-center">
        <div className="script text-5xl sm:text-6xl text-gold-glow mb-14">{karthu.name}...</div>

        <div className="font-serif text-2xl sm:text-3xl leading-relaxed text-cream/85 space-y-7">
          {lines.map((line) => (
            <p key={line} className="letter-line">
              {line}
            </p>
          ))}
        </div>

        <div className="letter-sig hairline w-48 mx-auto my-12 opacity-60" />
        <p className="letter-sig script text-3xl sm:text-4xl text-gold-glow">
          {karthu.letterSignature}
        </p>
      </div>
    </section>
  )
}
