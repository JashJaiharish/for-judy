import { useEffect, useState } from 'react'

export default function GloveCursor() {
  const [pos, setPos] = useState({ x: -100, y: -100 })
  const [isHovered, setIsHovered] = useState(false)
  const [isClicked, setIsClicked] = useState(false)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    // Hide on touch devices
    if (window.matchMedia?.('(pointer: coarse)').matches) {
      return undefined
    }

    const onMouseMove = (e) => {
      setPos({ x: e.clientX, y: e.clientY })
      if (!isVisible) setIsVisible(true)

      // Check if hovering over clickable elements
      const target = e.target
      const isInteractive =
        target.closest('a, button, input, textarea, select, [role="button"], .photo-frame, .btn-wish, .cursor-pointer') !== null
      setIsHovered(isInteractive)
    }

    const onMouseDown = () => setIsClicked(true)
    const onMouseUp = () => setIsClicked(false)
    const onMouseLeave = () => setIsVisible(false)
    const onMouseEnter = () => setIsVisible(true)

    window.addEventListener('mousemove', onMouseMove)
    window.addEventListener('mousedown', onMouseDown)
    window.addEventListener('mouseup', onMouseUp)
    document.addEventListener('mouseleave', onMouseLeave)
    document.addEventListener('mouseenter', onMouseEnter)

    return () => {
      window.removeEventListener('mousemove', onMouseMove)
      window.removeEventListener('mousedown', onMouseDown)
      window.removeEventListener('mouseup', onMouseUp)
      document.removeEventListener('mouseleave', onMouseLeave)
      document.removeEventListener('mouseenter', onMouseEnter)
    }
  }, [isVisible])

  if (!isVisible) return null

  return (
    <div
      className="fixed top-0 left-0 pointer-events-none z-[9999] transition-transform duration-75 ease-out"
      style={{
        transform: `translate3d(${pos.x - 12}px, ${pos.y - 2}px, 0) scale(${
          isClicked ? 0.88 : isHovered ? 1.2 : 1
        })`,
      }}
    >
      {/* Golden glow bloom behind the sequin glove cursor */}
      <div
        className="absolute inset-0 rounded-full blur-md transition-opacity duration-300"
        style={{
          background: 'radial-gradient(circle, rgba(245,215,110,0.6) 0%, rgba(212,175,55,0.2) 60%, transparent 100%)',
          transform: 'scale(1.4)',
          opacity: isHovered ? 0.9 : 0.5,
        }}
      />
      <img
        src="./glove-cursor.png"
        alt="Glove Cursor"
        className="w-10 h-auto drop-shadow-[0_0_8px_rgba(245,215,110,0.5)] select-none"
      />
    </div>
  )
}
