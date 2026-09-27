import { useEffect, useRef } from 'react'

/**
 * Soft cinematic spotlight that trails the cursor.
 * A huge radial gradient, heavily blurred, mixed with `overlay` —
 * gentle enough to never distract.
 */
export default function Spotlight() {
  const ref = useRef(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return undefined
    if (window.matchMedia('(pointer: coarse)').matches) return undefined

    let x = window.innerWidth / 2
    let y = window.innerHeight / 3
    let tx = x
    let ty = y
    let raf

    const onMove = (e) => {
      tx = e.clientX
      ty = e.clientY
    }
    window.addEventListener('mousemove', onMove, { passive: true })

    const tick = () => {
      raf = requestAnimationFrame(tick)
      x += (tx - x) * 0.06
      y += (ty - y) * 0.06
      el.style.transform = `translate(${x}px, ${y}px) translate(-50%, -50%)`
    }
    tick()

    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('mousemove', onMove)
    }
  }, [])

  return (
    <div
      ref={ref}
      aria-hidden="true"
      className="fixed left-0 top-0 z-20 pointer-events-none"
      style={{
        width: 620,
        height: 620,
        borderRadius: '50%',
        background:
          'radial-gradient(circle, rgba(232,203,120,0.075) 0%, rgba(212,175,55,0.035) 38%, transparent 68%)',
        mixBlendMode: 'screen',
        willChange: 'transform',
      }}
    />
  )
}
