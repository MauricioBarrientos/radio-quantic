import React, { useState, useEffect, useCallback, useRef } from 'react'
import stationsData from './mock/stations'
import RadioStationCard from './components/RadioStationCard'
import AdvancedPlayer from './components/AdvancedPlayer'
import VisitorMap from './components/VisitorMap'

const BASE_RETRY_INTERVAL = 3000
const MAX_RETRIES = 3

const App = () => {
  const [currentStation, setCurrentStation] = useState(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [showScroll, setShowScroll] = useState(false)
  const audioRef = useRef(null)
  const retryCountRef = useRef(0)
  const isRetryingRef = useRef(false)
  const currentStationRef = useRef(null)
  const isPlayingRef = useRef(false)
  const isDarkMode = true

  useEffect(() => {
    currentStationRef.current = currentStation
  }, [currentStation])

  useEffect(() => {
    isPlayingRef.current = isPlaying
  }, [isPlaying])

  useEffect(() => {
    if (!audioRef.current) {
      audioRef.current = new Audio()
    }

    const audio = audioRef.current

    const retryPlayback = (label) => {
      if (
        !currentStationRef.current ||
        retryCountRef.current >= MAX_RETRIES ||
        isRetryingRef.current
      ) {
        console.log(`${label}. Stopping playback.`)
        setIsPlaying(false)
        retryCountRef.current = 0
        isRetryingRef.current = false
        return
      }

      isRetryingRef.current = true
      retryCountRef.current += 1

      const retryDelay =
        BASE_RETRY_INTERVAL * Math.pow(2, retryCountRef.current - 1)

      setTimeout(() => {
        if (currentStationRef.current && !isPlayingRef.current) {
          audio.src = currentStationRef.current.url
          audio.load()
          audio.play().catch((error) => {
            console.error('Error replaying audio stream:', error)
            isRetryingRef.current = false
          })
          setIsPlaying(true)
        }

        isRetryingRef.current = false
      }, retryDelay)
    }

    const handleStreamEnded = () => {
      console.log('Stream ended. Attempting to reconnect...')
      retryPlayback('Max retries reached or no current station')
    }

    const handleStreamError = (event) => {
      console.error('Stream error:', event)

      const isNetworkError =
        event.target?.networkState === 3 || event.target?.readyState < 3

      if (isNetworkError) {
        retryPlayback('Max retries reached after error or no current station')
        return
      }

      setIsPlaying(false)
      retryCountRef.current = 0
      isRetryingRef.current = false
    }

    audio.addEventListener('ended', handleStreamEnded)
    audio.addEventListener('error', handleStreamError)

    return () => {
      if (audioRef.current) {
        audioRef.current.pause()
        audioRef.current.src = ''
        audio.removeEventListener('ended', handleStreamEnded)
        audio.removeEventListener('error', handleStreamError)
      }

      retryCountRef.current = 0
      isRetryingRef.current = false
    }
  }, [])

  useEffect(() => {
    document.body.className = isDarkMode ? 'dark-mode' : ''
    document.documentElement.classList.toggle('dark', isDarkMode)
    document.documentElement.classList.toggle('light', !isDarkMode)
  }, [isDarkMode])

  useEffect(() => {
    const checkScrollTop = () => {
      if (!showScroll && window.pageYOffset > 300) {
        setShowScroll(true)
      } else if (showScroll && window.pageYOffset <= 300) {
        setShowScroll(false)
      }
    }

    window.addEventListener('scroll', checkScrollTop)
    return () => {
      window.removeEventListener('scroll', checkScrollTop)
    }
  }, [showScroll])

  useEffect(() => {
    const handleContextMenu = (event) => {
      event.preventDefault()
    }

    document.addEventListener('contextmenu', handleContextMenu)
    return () => {
      document.removeEventListener('contextmenu', handleContextMenu)
    }
  }, [])

  const handlePlayStation = useCallback(
    (station) => {
      if (currentStation?.id === station.id) {
        if (isPlaying) {
          audioRef.current.pause()
          setIsPlaying(false)
        } else {
          audioRef.current.play().catch((error) => {
            console.error('Error playing audio:', error)
            setIsPlaying(false)
          })
          setIsPlaying(true)
        }
        return
      }

      isRetryingRef.current = false
      retryCountRef.current = 0

      if (!audioRef.current) {
        audioRef.current = new Audio()
      }

      audioRef.current.pause()
      audioRef.current.src = station.url
      audioRef.current.load()
      audioRef.current.play().catch((error) => {
        console.error('Error playing audio:', error)
        setIsPlaying(false)
      })

      setCurrentStation(station)
      setIsPlaying(true)
    },
    [currentStation, isPlaying]
  )

  const handlePlayPause = useCallback(() => {
    if (isPlaying) {
      audioRef.current.pause()
      setIsPlaying(false)
      return
    }

    if (currentStation) {
      audioRef.current.play().catch((error) => {
        console.error('Error playing audio on play/pause:', error)
        setIsPlaying(false)
      })
      setIsPlaying(true)
    }
  }, [currentStation, isPlaying])

  const scrollTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const scrollToStations = () => {
    document
      .getElementById('stations-grid')
      ?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  return (
    <div className={`app ${isDarkMode ? 'dark-mode' : 'bg-gray-50'}`}>
      <div className="container mx-auto p-4 md:p-8">
        <header className="hero-header mb-10 overflow-hidden rounded-[2rem] border border-white/10">
          <div className="hero-header__glow hero-header__glow--cyan" />
          <div className="hero-header__glow hero-header__glow--blue" />
          <div className="hero-header__grid">
            <div className="hero-header__copy">
              <p className="hero-header__eyebrow">Curated online radio</p>
              <h1 className="hero-header__title">Radio Quantic</h1>
              <p className="hero-header__subtitle">
                Frecuencias seleccionadas para descubrir electrónica, soul,
                dub y estaciones que merecen quedarse sonando.
              </p>
              <div className="hero-header__actions">
                <button
                  type="button"
                  onClick={scrollToStations}
                  className="hero-header__cta"
                >
                  Explorar estaciones
                </button>
                <div className="hero-header__meta">
                  <span className="hero-header__meta-value">
                    {stationsData.length}
                  </span>
                  <span className="hero-header__meta-label">
                    estaciones seleccionadas
                  </span>
                </div>
              </div>
            </div>

            <div className="hero-header__panel" aria-hidden="true">
              <div className="hero-header__badge">
                <span className="hero-header__badge-dot" />
                Signal live
              </div>
              <div className="hero-header__visual">
                <div className="hero-header__dial">
                  <span className="hero-header__dial-ring hero-header__dial-ring--outer" />
                  <span className="hero-header__dial-ring hero-header__dial-ring--inner" />
                  <span className="hero-header__dial-core">RQ</span>
                </div>
                <div className="hero-header__bars">
                  <span className="hero-header__bar hero-header__bar--1" />
                  <span className="hero-header__bar hero-header__bar--2" />
                  <span className="hero-header__bar hero-header__bar--3" />
                  <span className="hero-header__bar hero-header__bar--4" />
                  <span className="hero-header__bar hero-header__bar--5" />
                </div>
              </div>
              <p className="hero-header__panel-copy">
                Sintoniza sin ruido ni relleno.
              </p>
            </div>
          </div>
        </header>

        <main className="text-center">
          {stationsData.length > 0 ? (
            <div id="stations-grid" className="station-container">
              {stationsData.map((station) => (
                <RadioStationCard
                  key={station.id}
                  station={station}
                  isPlaying={isPlaying && currentStation?.id === station.id}
                  onPlay={handlePlayStation}
                />
              ))}
            </div>
          ) : (
            <div className="py-16 text-center">
              <h2 className="text-2xl font-semibold text-gray-700 dark:text-gray-300">
                No se encontraron estaciones
              </h2>
              <p className="mt-2 text-gray-500 dark:text-gray-400">
                Intenta con otra búsqueda.
              </p>
            </div>
          )}
        </main>

        <section className="mb-8 mt-12">
          <VisitorMap />
        </section>

        <footer className="mb-24 rounded-2xl border border-white/10 bg-white/5 px-6 py-8 text-center backdrop-blur-sm">
          <p className="text-xs uppercase tracking-[0.3em] text-cyan-300/80">
            Radio Quantic
          </p>
          <p className="mt-3 text-lg text-gray-100 md:text-xl">
            Let the right frequency find you exactly when you need it most.{' '}
            {'<3'}
          </p>
          <p className="mt-2 text-sm text-gray-400">
            Thanks to every station sharing its signal and spirit with this
            space.
          </p>
        </footer>
      </div>

      <AdvancedPlayer
        currentStation={currentStation}
        isPlaying={isPlaying}
        onPlayPause={handlePlayPause}
        audioRef={audioRef}
      />

      {showScroll && (
        <button
          onClick={scrollTop}
          className={`scroll-to-top-button ${showScroll ? 'show' : ''}`}
          aria-label="Volver arriba"
        >
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="currentColor"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M12 8l-6 6 1.41 1.41L12 10.83l4.59 4.58L18 14z" />
          </svg>
        </button>
      )}
    </div>
  )
}

export default App
