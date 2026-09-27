import { useEffect, useRef, useState } from 'react'
import { karthu } from '../data/karthu.js'

export default function AudioPlayer({ active }) {
  const audioRef = useRef(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [hasError, setHasError] = useState(false)

  const musicSrc = karthu.music || ''

  useEffect(() => {
    if (!active || !musicSrc || !audioRef.current) return

    // Attempt autoplay when intro finishes (after user tap/click interaction)
    const playAudio = async () => {
      try {
        await audioRef.current.play()
        setIsPlaying(true)
        setHasError(false)
      } catch (err) {
        console.warn('Autoplay prevented or audio source missing:', err)
        setIsPlaying(false)
        setHasError(true)
      }
    }

    playAudio()
  }, [active, musicSrc])

  const togglePlay = () => {
    if (!audioRef.current) return
    if (isPlaying) {
      audioRef.current.pause()
      setIsPlaying(false)
    } else {
      audioRef.current
        .play()
        .then(() => {
          setIsPlaying(true)
          setHasError(false)
        })
        .catch(() => setHasError(true))
    }
  }

  return <audio ref={audioRef} src={musicSrc} loop preload="auto" />
}
