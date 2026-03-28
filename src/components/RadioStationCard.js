import React from 'react'
import PropTypes from 'prop-types'

const RadioStationCard = React.memo(({ station, isPlaying, onPlay }) => {
  const handlePlayClick = (e) => {
    e.stopPropagation()
    onPlay(station)
  }

  return (
    <div
      className={`station-card rounded-xl flex flex-col items-center justify-between p-4 transition-all duration-300 cursor-pointer`}
      onClick={() => onPlay(station)}
      tabIndex={0}
      aria-label={`Seleccionar estación ${station.name}`}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') onPlay(station)
      }}
    >
      <div className="relative w-full flex justify-center items-center mb-4">
        <img
          src={station.cover}
          alt={station.name}
          className="radio-cover w-24 h-24 object-cover rounded-lg shadow-md transition-transform duration-300 hover:scale-105"
          loading="lazy"
        />
        {isPlaying && (
          <span
            className="absolute top-2 right-2 animate-pulse"
            aria-label="Reproduciendo"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="#2563eb">
              <circle cx="12" cy="12" r="8" />
            </svg>
          </span>
        )}
      </div>

      <div className="text-center mb-4">
        <h5 className="font-bold text-lg text-gray-200 truncate">
          {station.name}
        </h5>
        <p className="text-sm text-gray-400">{station.frequency}</p>
        <p className="text-xs text-gray-300 mt-1">{station.description}</p>
        <p className="text-[11px] uppercase tracking-[0.18em] text-gray-500 mt-3">
          Stream credits: official station broadcast
        </p>
      </div>

      <div className="flex items-center justify-center w-full">
        <button
          onClick={handlePlayClick}
          className={`btn-play w-full px-4 py-2 rounded-lg font-bold transition-colors duration-200 ${isPlaying ? 'bg-red-500 hover:bg-red-600' : 'bg-blue-500 hover:bg-blue-600'} text-white`}
          aria-label={
            isPlaying ? `Pausar ${station.name}` : `Escuchar ${station.name}`
          }
        >
          {isPlaying ? 'Pausar' : 'Escuchar'}
        </button>
      </div>
    </div>
  )
})

RadioStationCard.propTypes = {
  station: PropTypes.shape({
    id: PropTypes.number.isRequired,
    name: PropTypes.string.isRequired,
    frequency: PropTypes.string.isRequired,
    cover: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
  }).isRequired,
  isPlaying: PropTypes.bool.isRequired,
  onPlay: PropTypes.func.isRequired,
}

RadioStationCard.displayName = 'RadioStationCard'

export default RadioStationCard
