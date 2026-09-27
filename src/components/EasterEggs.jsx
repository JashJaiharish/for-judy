import { useEffect, useRef, useState } from 'react'
import { karthu } from '../data/karthu.js'

/**
 * Two tiny, quiet discoveries — not a game, just small smiles.
 * A white glove tucked by the gallery wall, and a gold star resting
 * near the cake. Clicking each reveals one short message.
 */
export default function EasterEggs() {
  const [found, setFound] = useState({ glove: false, star: false })

  const pop = (key) => {
    if (found[key]) return
    setFound((f) => ({ ...f, [key]: true }))
    setTimeout(() => setFound((f) => ({ ...f, [key]: false })), 3400)
  }

  return (
    <>
      {/* the glove — sits quietly after the photo wall */}
      <div className="relative z-20 flex justify-end max-w-6xl mx-auto px-8 -mt-[6vh] mb-[10vh]">
        <div className="relative">
          <button
            onClick={() => pop('glove')}
            aria-label="a small discovery"
            className="block opacity-40 hover:opacity-90 transition-opacity duration-700"
            style={{ rotate: '14deg' }}
          >
            <GloveSVG />
          </button>
          <Bubble show={found.glove} text={karthu.gloveMessage} />
        </div>
      </div>

      {/* the gold star — rests near the cake section (absolutely placed) */}
      <div className="relative z-20 max-w-6xl mx-auto px-8">
        <div className="relative h-0">
          <div className="absolute left-[12%] -top-[26vh]">
            <button
              onClick={() => pop('star')}
              aria-label="a tiny star"
              className="block opacity-50 hover:opacity-100 transition-opacity duration-700 floaty"
            >
              <StarSVG />
            </button>
            <Bubble show={found.star} text={karthu.starMessage} />
          </div>
        </div>
      </div>
    </>
  )
}

function Bubble({ show, text }) {
  return (
    <span
      className={`absolute left-1/2 -translate-x-1/2 top-full mt-3 whitespace-nowrap font-serif italic text-gold-glow text-lg transition-all duration-700 ${
        show ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2 pointer-events-none'
      }`}
    >
      {text}
    </span>
  )
}

function GloveSVG() {
  return (
    <svg viewBox="0 0 64 64" className="w-8 h-8" role="img" aria-hidden="true">
      <g fill="#f7f3e8" stroke="rgba(212,175,55,0.5)" strokeWidth="1.2">
        <path d="M22 8c-3 6-4 14-2 20 1 4 1 8-1 12-2 5 1 10 7 10 8 0 18-3 20-11 2-8-2-13-5-20-2-5-4-11-8-13-4-2-9 0-11 2z" />
        <path d="M22 50c2 3 5 5 9 5" fill="none" />
      </g>
    </svg>
  )
}

function StarSVG() {
  return (
    <svg viewBox="0 0 24 24" className="w-4 h-4" role="img" aria-hidden="true">
      <path
        d="M12 2l2.4 6.2L21 9l-5 4.2L17.5 20 12 16.4 6.5 20 8 13.2 3 9l6.6-.8z"
        fill="#F5D76E"
        style={{ filter: 'drop-shadow(0 0 4px rgba(245,215,110,0.7))' }}
      />
    </svg>
  )
}
