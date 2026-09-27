import { useEffect, useRef } from 'react'
import Lenis from 'lenis'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

let activeLenis = null
export const getLenis = () => activeLenis
export const lockScroll = (locked) => {
  document.documentElement.classList.toggle('locked', locked)
  if (activeLenis) locked ? activeLenis.stop() : activeLenis.start()
}

/**
 * Lenis smooth scrolling, synced to GSAP's ticker and bound to ScrollTrigger.
 */
export function useLenis() {
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.7,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
    })
    activeLenis = lenis

    lenis.on('scroll', ScrollTrigger.update)
    const ticker = (time) => lenis.raf(time * 1000)
    gsap.ticker.add(ticker)
    gsap.ticker.lagSmoothing(0)

    return () => {
      gsap.ticker.remove(ticker)
      lenis.destroy()
      if (activeLenis === lenis) activeLenis = null
    }
  }, [])
}
