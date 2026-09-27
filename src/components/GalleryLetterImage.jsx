import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { karthu } from '../data/karthu.js'

gsap.registerPlugin(ScrollTrigger)

export default function GalleryLetterImage() {
  const root = useRef(null)
  const imageSrc = karthu.galleryLetterImage || ''

  useEffect(() => {
    if (!imageSrc || !root.current) return undefined
    const ctx = gsap.context(() => {
      gsap.from(root.current, {
        opacity: 0,
        y: 40,
        duration: 1.6,
        ease: 'power2.out',
        scrollTrigger: { trigger: root.current, start: 'top 75%' },
      })
    }, root)
    return () => ctx.revert()
  }, [imageSrc])

  if (!imageSrc) return null

  return (
    <section ref={root} className="relative z-20 min-h-[50vh] py-20 flex justify-center items-center bg-black">
      <div className="w-[min(50vw,240px)] mx-auto text-center">
        <img
          src={imageSrc}
          alt="Memory between gallery and letter"
          loading="lazy"
          className="w-full h-auto block mx-auto object-contain"
        />
      </div>
    </section>
  )
}
