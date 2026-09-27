import { useState } from 'react'
import { useLenis } from './hooks/useLenis.js'
import Intro from './components/Intro.jsx'
import GoldDust from './components/GoldDust.jsx'
import Spotlight from './components/Spotlight.jsx'
import Hero from './components/Hero.jsx'
import PhotoWall from './components/PhotoWall.jsx'
import GalleryLetterImage from './components/GalleryLetterImage.jsx'
import EasterEggs from './components/EasterEggs.jsx'
import Letter from './components/Letter.jsx'
import StarAndReason from './components/StarAndReason.jsx'
import Cake from './components/Cake.jsx'
import Finale, { FinalVeil } from './components/Finale.jsx'
import GloveCursor from './components/GloveCursor.jsx'
import AudioPlayer from './components/AudioPlayer.jsx'
import LoadingScreen from './components/LoadingScreen.jsx'

export default function App() {
  useLenis()
  const [introDone, setIntroDone] = useState(false)
  const [loadingDone, setLoadingDone] = useState(false)
  const [veil, setVeil] = useState(false)

  // fade the world down when the last star area is near the very end
  const onFinaleEnd = () => setVeil(true)

  return (
    <div className="relative bg-black">
      <GloveCursor />
      <AudioPlayer active={introDone} />
      <GoldDust />
      <Spotlight />

      {/* page reveals only after intro and video loading complete */}
      <main
        className={`relative z-10 transition-opacity duration-[2200ms] ${
          loadingDone ? 'opacity-100' : 'opacity-0'
        }`}
      >
        <Hero />
        <PhotoWall />
        <EasterEggs />
        <GalleryLetterImage />
        <Letter />
        <StarAndReason />
        <Cake />
        <Finale onEnd={onFinaleEnd} />
      </main>

      <FinalVeil active={veil} />

      {!introDone && <Intro onDone={() => setIntroDone(true)} />}
      {introDone && !loadingDone && <LoadingScreen onDone={() => setLoadingDone(true)} />}

      {/* cinematic frame */}
      <div className="grain" aria-hidden="true" />
      <div className="vignette" aria-hidden="true" />
    </div>
  )
}
