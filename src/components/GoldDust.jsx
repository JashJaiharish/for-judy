import { useEffect, useRef } from 'react'
import { prefersReducedMotion } from '../utils/utils.js'

/**
 * Golden dust: a fixed, full-screen canvas of slow-drifting gold particles.
 * Subtle brightness lift near the cursor (parallax glow, not a spotlight).
 */
export default function GoldDust() {
  const canvasRef = useRef(null)

  useEffect(() => {
    if (prefersReducedMotion()) return undefined
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    let w, h, raf
    const dpr = Math.min(window.devicePixelRatio || 1, 2)

    const resize = () => {
      w = canvas.width = window.innerWidth * dpr
      h = canvas.height = window.innerHeight * dpr
      canvas.style.width = window.innerWidth + 'px'
      canvas.style.height = window.innerHeight + 'px'
    }
    resize()
    window.addEventListener('resize', resize)

    const N = Math.min(110, Math.floor(window.innerWidth / 12))
    const parts = []
    for (let i = 0; i < N; i++) {
      parts.push({
        x: Math.random() * w,
        y: Math.random() * h,
        r: (0.6 + Math.random() * 1.6) * dpr,
        vx: (Math.random() - 0.5) * 0.08 * dpr,
        vy: (-0.05 - Math.random() * 0.12) * dpr,
        a: 0.15 + Math.random() * 0.5,
        tw: Math.random() * Math.PI * 2,
      })
    }

    const mouse = { x: -9999, y: -9999 }
    const onMove = (e) => {
      mouse.x = e.clientX * dpr
      mouse.y = e.clientY * dpr
    }
    window.addEventListener('mousemove', onMove, { passive: true })

    const tick = () => {
      raf = requestAnimationFrame(tick)
      ctx.clearRect(0, 0, w, h)
      for (const p of parts) {
        p.x += p.vx
        p.y += p.vy
        p.tw += 0.01
        if (p.y < -10) { p.y = h + 10; p.x = Math.random() * w }
        if (p.x < -10) p.x = w + 10
        if (p.x > w + 10) p.x = -10
        // subtle brightening near the cursor
        const dx = p.x - mouse.x
        const dy = p.y - mouse.y
        const d2 = dx * dx + dy * dy
        const boost = d2 < (180 * dpr) ** 2 ? 0.35 * (1 - Math.sqrt(d2) / (180 * dpr)) : 0
        const alpha = Math.min(0.9, p.a + boost + Math.sin(p.tw) * 0.08)
        ctx.beginPath()
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(230, 199, 110, ${alpha})`
        ctx.shadowColor = 'rgba(212, 175, 55, 0.8)'
        ctx.shadowBlur = 6 * dpr * (0.4 + boost)
        ctx.fill()
      }
    }
    tick()

    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('resize', resize)
      window.removeEventListener('mousemove', onMove)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 z-10 pointer-events-none"
      aria-hidden="true"
    />
  )
}
