import { useEffect, useRef, useState } from 'react'
import { karthu } from '../data/karthu.js'

export default function LoadingScreen({ onDone }) {
  const videoRef = useRef(null)
  const [done, setDone] = useState(false)
  const videoSrc = karthu.loadingVideo || '/video/loading.mp4'

  const finishLoading = () => {
    if (done) return
    setDone(true)
    setTimeout(() => {
      onDone?.()
    }, 600) // smooth fade out
  }

  useEffect(() => {
    const video = videoRef.current
    if (video) {
      // Force immediate playback
      video.play().catch(() => {
        // Fallback if browser requires muted autoplay
        video.muted = true
        video.play().catch(() => {})
      })
    }

    // Safety fallback timer (15 seconds max if video hangs)
    const fallbackTimer = setTimeout(() => {
      finishLoading()
    }, 15000)

    return () => clearTimeout(fallbackTimer)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <div
      onClick={finishLoading}
      className={`fixed inset-0 z-50 flex items-center justify-center bg-black cursor-pointer transition-opacity duration-700 ${
        done ? 'opacity-0 pointer-events-none' : 'opacity-100'
      }`}
    >
      {/* 100% Edge-to-Edge Fullscreen Video */}
      <video
        ref={videoRef}
        src={videoSrc}
        autoPlay
        playsInline
        muted
        preload="auto"
        onEnded={finishLoading}
        onLoadedData={() => {
          if (videoRef.current) {
            videoRef.current.play().catch(() => {})
          }
        }}
        className="absolute inset-0 w-full h-full object-cover"
      />

      {/* Calligraphy Golden Loading Text at bottom center */}
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 z-20 text-center pointer-events-none">
        <p className="script text-4xl sm:text-5xl text-gold-glow pulse-soft drop-shadow-[0_4px_12px_rgba(0,0,0,0.8)]">
          Loading...
        </p>
      </div>

      {/* Subtle bottom skip hint */}
      <button
        onClick={(e) => {
          e.stopPropagation()
          finishLoading()
        }}
        className="absolute bottom-8 right-8 z-20 label text-cream/60 hover:text-gold transition-colors bg-black/40 px-3 py-1.5 rounded-full backdrop-blur-sm"
      >
        skip
      </button>
    </div>
  )
}
