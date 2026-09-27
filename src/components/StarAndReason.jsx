import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import PerformerSilhouette from './silhouette/PerformerSilhouette.jsx'
import { karthu } from '../data/karthu.js'

gsap.registerPlugin(ScrollTrigger)

/**
 * THE STAR and THE REASON FOR THE SHOW —
 * the performer on one side, her portrait on the other, a single
 * golden line between them. Quiet, symmetric, romantic.
 */
export default function StarAndReason() {
  const root = useRef(null)
  const photoImage = karthu.starImage || karthu.photos[1]?.image || karthu.photos[0]?.image
  const photoCaption = karthu.photos[1]?.caption || karthu.photos[0]?.caption || 'The Star'

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from('.star-side', {
        opacity: 0,
        x: -46,
        duration: 1.7,
        ease: 'power2.out',
        scrollTrigger: { trigger: root.current, start: 'top 66%' },
      })
      gsap.from('.reason-side', {
        opacity: 0,
        x: 46,
        duration: 1.7,
        ease: 'power2.out',
        scrollTrigger: { trigger: root.current, start: 'top 66%' },
      })
      gsap.from('.star-line', {
        scaleY: 0,
        duration: 1.8,
        ease: 'power2.inOut',
        scrollTrigger: { trigger: root.current, start: 'top 58%' },
      })
      gsap.from('.star-label', {
        opacity: 0,
        y: 18,
        stagger: 0.5,
        duration: 1.2,
        ease: 'power2.out',
        scrollTrigger: { trigger: root.current, start: 'top 52%' },
      })
    }, root)
    return () => ctx.revert()
  }, [])

  return (
    <section ref={root} className="relative py-[20vh]">
      <div className="max-w-5xl mx-auto px-6 flex flex-col md:flex-row items-center justify-center gap-14 md:gap-8">
        {/* THE STAR */}
        <div className="star-side flex flex-col items-center">
          <PerformerSilhouette variant="pose" className="w-[min(56vw,250px)]" glow={false} />
        </div>

        {/* the golden line */}
        <div className="relative flex flex-col items-center py-2">
          <div className="star-label label mb-40 md:mb-64">{karthu.starLabel}</div>
          <div
            className="star-line w-px bg-gradient-to-b from-goldbright/70 via-gold/40 to-gold/10"
            style={{ height: 'clamp(180px, 34vh, 320px)', transformOrigin: 'top' }}
          />
          <div className="star-label label mt-6 md:mt-8 text-gold/70 text-center max-w-[220px] leading-loose">
            {karthu.reasonLabel}
          </div>
        </div>

        {/* THE REASON — her portrait */}
        <div className="reason-side flex flex-col items-center">
          <div className="photo-frame p-3 pb-5 w-[min(60vw,250px)]" style={{ rotate: '2deg' }}>
            <img
              src={photoImage}
              alt={photoCaption}
              loading="lazy"
              className="w-full aspect-[3/4] object-cover"
            />
          </div>
        </div>
      </div>
    </section>
  )
}
