import { useEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { karthu } from '../data/karthu.js'

gsap.registerPlugin(ScrollTrigger)

/**
 * The gallery wall — portrait photographs hanging from thin strings,
 * each swaying in an invisible breeze. Hover: it leans toward you and
 * the spotlight finds it. Click: it fills the screen with its caption.
 *
 * Layout is intentionally NOT a grid: every frame gets a hand-placed
 * position, size, rotation and string length (see LAYOUT below).
 * Mobile becomes a vertical hanging sequence via CSS.
 */

/* hand-tuned placements: [left%, stringH px, rotate deg, width px, zIndex] */
const LAYOUT = [
  { left: 6, string: 30, rotate: -5, width: 200, z: 2 },
  { left: 30, string: 96, rotate: 3.5, width: 230, z: 1 },
  { left: 58, string: 14, rotate: -2.5, width: 205, z: 2 },
  { left: 79, string: 74, rotate: 5, width: 190, z: 1 },
  { left: 18, string: 210, rotate: 4, width: 210, z: 1 },
  { left: 66, string: 238, rotate: -4, width: 220, z: 2 },
]

export default function PhotoWall() {
  const root = useRef(null)
  const [open, setOpen] = useState(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from('.wall-frame', {
        opacity: 0,
        y: 90,
        duration: 1.6,
        stagger: 0.16,
        ease: 'power2.out',
        scrollTrigger: { trigger: root.current, start: 'top 70%' },
      })
    }, root)
    return () => ctx.revert()
  }, [])

  const photos = karthu.photos.slice(0, LAYOUT.length)

  return (
    <section ref={root} className="relative py-[16vh]">
      <div className="text-center mb-[8vh]">
        <div className="label">hanging memories</div>
        <h2 className="script text-4xl sm:text-5xl text-gold-glow mt-4">the gallery of you</h2>
      </div>

      {/* the wall */}
      <div className="relative hidden md:block h-[130vh] max-w-6xl mx-auto">
        {/* ceiling rail */}
        <div className="absolute top-0 left-[4%] right-[4%] hairline" />

        {photos.map((p, i) => (
          <HangingPhoto
            key={p.image}
            photo={p}
            layout={LAYOUT[i]}
            onClick={() => setOpen(i)}
          />
        ))}
      </div>

      {/* mobile: vertical hanging sequence */}
      <div className="md:hidden flex flex-col items-center gap-24 px-6">
        {photos.map((p, i) => (
          <HangingPhoto
            key={p.image}
            photo={p}
            layout={{ left: 0, string: 40 + (i % 3) * 26, rotate: (i % 2 ? 1 : -1) * (2.5 + i), width: 240, z: 1 }}
            onClick={() => setOpen(i)}
          />
        ))}
      </div>

      {open !== null && photos[open] && (
        <Lightbox photo={photos[open]} onClose={() => setOpen(null)} />
      )}
    </section>
  )
}

function HangingPhoto({ photo, layout, onClick }) {
  const ref = useRef(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return undefined
    const reduced = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches
    if (reduced) return undefined

    // gentle breeze: each frame sways with its own phase
    const tl = gsap.timeline({ repeat: -1, yoyo: true })
    tl.to(el, { rotation: layout.rotate + 1.6, duration: 3 + Math.random(), ease: 'sine.inOut' })
      .to(el, { rotation: layout.rotate - 1.6, duration: 3 + Math.random(), ease: 'sine.inOut' })
    tl.progress(Math.random())

    return () => {
      tl.kill()
    }
  }, [layout])

  const onEnter = () => {
    gsap.to(ref.current, {
      scale: 1.05,
      rotate: 0,
      duration: 0.7,
      ease: 'power2.out',
      overwrite: 'auto',
    })
  }
  const onLeave = () => {
    gsap.to(ref.current, {
      scale: 1,
      rotate: layout.rotate,
      duration: 1.1,
      ease: 'power2.out',
      overwrite: 'auto',
    })
  }

  return (
    <div
      className="md:absolute"
      style={{
        left: `${layout.left}%`,
        top: 0,
        zIndex: layout.z,
      }}
    >
      {/* the string */}
      <div
        className="mx-auto w-px"
        style={{
          height: layout.string,
          background: 'linear-gradient(180deg, rgba(212,175,55,0.55), rgba(212,175,55,0.25))',
        }}
      />
      <button
        ref={ref}
        onClick={onClick}
        onMouseEnter={onEnter}
        onMouseLeave={onLeave}
        className="wall-frame photo-frame block p-3 pb-5 text-left transition-shadow duration-700 hover:shadow-[0_40px_90px_-20px_rgba(0,0,0,0.95),0_0_50px_rgba(212,175,55,0.18)]"
        style={{ width: layout.width, rotate: `${layout.rotate}deg` }}
        aria-label={photo.caption}
      >
        <div className="overflow-hidden bg-black">
          <img
            src={photo.image}
            alt={photo.caption}
            loading="lazy"
            className="w-full aspect-[3/4] object-cover"
          />
        </div>
        <div className="mt-3 font-serif italic text-center text-cream/55 text-sm px-1">
          {photo.caption}
        </div>
      </button>
    </div>
  )
}

function Lightbox({ photo, onClose }) {
  useEffect(() => {
    const onKey = (e) => e.key === 'Escape' && onClose()
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onClose])

  return (
    <div
      className="fixed inset-0 z-[80] flex items-center justify-center bg-black/92 p-6 cursor-pointer"
      onClick={onClose}
    >
      <div
        className="photo-frame p-4 pb-7 max-w-sm w-full"
        style={{ animation: 'floaty 6s ease-in-out infinite' }}
        onClick={(e) => e.stopPropagation()}
      >
        <img src={photo.image} alt={photo.caption} className="w-full aspect-[3/4] object-cover" />
        <p className="font-serif italic text-center text-gold-glow text-xl mt-5">
          {photo.caption}
        </p>
      </div>
      <button className="absolute bottom-10 label" onClick={onClose}>
        close
      </button>
    </div>
  )
}
