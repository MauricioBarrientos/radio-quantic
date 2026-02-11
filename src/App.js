import React, { useState, useEffect, useCallback, useRef } from 'react'
import stationsData from './mock/stations'
import RadioStationCard from './components/RadioStationCard'
import AdvancedPlayer from './components/AdvancedPlayer'
import DonacionButton from './components/DonacionButton'

const BASE_RETRY_INTERVAL = 3000 // 3 seconds base retry time
const MAX_RETRIES = 3

const App = () => {
  const [currentStation, setCurrentStation] = useState(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const audioRef = useRef(null)
  const isDarkMode = true
  const [showScroll, setShowScroll] = useState(false)
  const retryCountRef = useRef(0)
  const isRetryingRef = useRef(false) // Flag to prevent multiple retries

  // Use refs to keep track of current state in event handlers
  const currentStationRef = useRef(null)
  const isPlayingRef = useRef(false)

  // Update refs when state changes
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

    const audio = audioRef.current;

    const handleStreamEnded = () => {
      console.log('Stream ended. Attempting to reconnect...');
      if (currentStationRef.current && retryCountRef.current < MAX_RETRIES && !isRetryingRef.current) {
        isRetryingRef.current = true;
        retryCountRef.current += 1;
        // Exponential backoff: 3s, 6s, 12s
        const retryDelay = BASE_RETRY_INTERVAL * Math.pow(2, retryCountRef.current - 1);
        setTimeout(() => {
          if (currentStationRef.current && !isPlayingRef.current) {
            audio.src = currentStationRef.current.url;
            audio.load();
            audio.play().catch(e => {
              console.error("Error playing audio after retry:", e);
              isRetryingRef.current = false;
            });
            setIsPlaying(true);
            isRetryingRef.current = false;
          } else {
            isRetryingRef.current = false;
          }
        }, retryDelay);
      } else {
        console.log('Max retries reached or no current station. Stopping playback.');
        setIsPlaying(false);
        retryCountRef.current = 0;
        isRetryingRef.current = false;
      }
    };

    const handleStreamError = (e) => {
      console.error('Stream error:', e);
      // Check if it's a network error that might be recoverable
      const isNetworkError = e.target?.networkState === 3 || e.target?.readyState < 3;
      if (currentStationRef.current && retryCountRef.current < MAX_RETRIES && !isRetryingRef.current && isNetworkError) {
        isRetryingRef.current = true;
        retryCountRef.current += 1;
        // Exponential backoff: 3s, 6s, 12s
        const retryDelay = BASE_RETRY_INTERVAL * Math.pow(2, retryCountRef.current - 1);
        setTimeout(() => {
          if (currentStationRef.current && !isPlayingRef.current) {
            audio.src = currentStationRef.current.url;
            audio.load();
            audio.play().catch(e => {
              console.error("Error playing audio after error retry:", e);
              isRetryingRef.current = false;
            });
            setIsPlaying(true);
            isRetryingRef.current = false;
          } else {
            isRetryingRef.current = false;
          }
        }, retryDelay);
      } else {
        console.log('Max retries reached after error or no current station. Stopping playback.');
        setIsPlaying(false);
        retryCountRef.current = 0;
        isRetryingRef.current = false;
      }
    };

    audio.addEventListener('ended', handleStreamEnded);
    audio.addEventListener('error', handleStreamError);

    return () => {
      if (audioRef.current) {
        audioRef.current.pause()
        audioRef.current.src = ''
        audio.removeEventListener('ended', handleStreamEnded);
        audio.removeEventListener('error', handleStreamError);
      }
      // Reset the refs when component unmounts
      retryCountRef.current = 0;
      isRetryingRef.current = false;
    }
  }, []) // Empty dependency array since we're using refs

  useEffect(() => {
    document.body.className = isDarkMode ? 'dark-mode' : ''
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
    const handleContextMenu = (e) => {
      e.preventDefault()
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
          audioRef.current.play().catch(e => {
            console.error("Error playing audio:", e);
            setIsPlaying(false);
          });
          setIsPlaying(true)
        }
      } else {
        // Stop any ongoing retries when switching stations
        isRetryingRef.current = false;
        retryCountRef.current = 0;

        if (!audioRef.current) {
          audioRef.current = new Audio()
        }
        audioRef.current.pause()
        audioRef.current.src = station.url
        audioRef.current.load();
        audioRef.current.play().catch(e => {
          console.error("Error playing audio:", e);
          setIsPlaying(false);
        });
        setCurrentStation(station)
        setIsPlaying(true)
      }
    },
    [audioRef, currentStation, isPlaying]
  )

  const handlePlayPause = useCallback(() => {
    if (isPlaying) {
      audioRef.current.pause()
      setIsPlaying(false)
    } else if (currentStation) {
      audioRef.current.play().catch(e => {
        console.error("Error playing audio on play/pause:", e);
        setIsPlaying(false);
      });
      setIsPlaying(true)
    }
  }, [audioRef, currentStation, isPlaying])

  const scrollTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }


  return (
    <div className={`app ${isDarkMode ? 'dark-mode' : 'bg-gray-50'}`}>
      <div className="container mx-auto p-4 md:p-8">
        <header className="flex flex-col md:flex-row items-center justify-between w-full mb-4 gap-4">
          <h1 className="text-4xl font-bold">Radio Quantic</h1>
          <DonacionButton />
        </header>

        <main className="text-center">
          {stationsData.length > 0 ? (
            <div className="station-container">
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
            <div className="text-center py-16">
              <h2 className="text-2xl font-semibold text-gray-700 dark:text-gray-300">
                No se encontraron estaciones
              </h2>
              <p className="text-gray-500 dark:text-gray-400 mt-2">
                Intenta con otra búsqueda.
              </p>
            </div>
          )}
        </main>
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