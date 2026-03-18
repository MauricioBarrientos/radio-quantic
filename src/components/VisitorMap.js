import React, { useState, useEffect } from 'react'
import { Map, MapControls, MapMarker } from './ui/map'
import { Card } from './ui/card'

const VisitorMap = () => {
  const [position, setPosition] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const getLocation = () => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            setPosition([position.coords.longitude, position.coords.latitude])
            setLoading(false)
          },
          (error) => {
            setError(error.message)
            setLoading(false)
          },
          { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
        )
      } else {
        setError('Geolocalización no soportada por este navegador.')
        setLoading(false)
      }
    }

    getLocation()
  }, [])

  if (loading) {
    return (
      <Card className="h-64 md:h-96 flex items-center justify-center">
        <p className="text-gray-600 dark:text-gray-300 flex items-center gap-2">
          <svg
            className="animate-spin h-5 w-5 text-blue-500"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            ></circle>
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            ></path>
          </svg>
          Obteniendo tu ubicación...
        </p>
      </Card>
    )
  }

  if (error) {
    return (
      <Card className="h-64 md:h-96 flex items-center justify-center p-6">
        <div className="bg-red-100 dark:bg-red-900/20 border border-red-400 dark:border-red-500 text-red-700 dark:text-red-300 px-4 py-3 rounded-lg max-w-md text-center">
          <svg
            className="fill-current w-6 h-6 inline-block mr-2"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
          >
            <path
              fillRule="evenodd"
              d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
              clipRule="evenodd"
            />
          </svg>
          <span className="font-medium">Error de geolocalización:</span> {error}
        </div>
      </Card>
    )
  }

  if (!position) {
    return (
      <Card className="h-64 md:h-96 flex items-center justify-center p-6">
        <div className="bg-yellow-100 dark:bg-yellow-900/20 border border-yellow-400 dark:border-yellow-500 text-yellow-700 dark:text-yellow-300 px-4 py-3 rounded-lg max-w-md text-center">
          <svg
            className="fill-current w-6 h-6 inline-block mr-2"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
          >
            <path
              fillRule="evenodd"
              d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.21 3.03-1.742 3.03H4.42c-1.532 0-2.493-1.696-1.743-3.03l5.58-9.92zM10 13a1 1 0 11-2 0 1 1 0 012 0zm-1-4a1 1 0 00-1 1v2a1 1 0 102 0v-2a1 1 0 00-1-1z"
              clipRule="evenodd"
            />
          </svg>
          <span className="font-medium">Ubicación no disponible:</span> No se
          pudo obtener tu ubicación.
        </div>
      </Card>
    )
  }

  return (
    <Card className="h-96 md:h-[600px] p-0 overflow-hidden border-2 border-blue-500 dark:border-blue-400 shadow-2xl">
      <Map center={[0, 20]} zoom={1.5}>
        <MapControls showLocate position="bottom-right" />
        {position && (
          <MapMarker longitude={position[0]} latitude={position[1]}>
            <div className="relative">
              <div className="w-3 h-3 bg-green-500 rounded-full animate-ping absolute"></div>
              <div className="w-3 h-3 bg-green-500 rounded-full relative"></div>
            </div>
          </MapMarker>
        )}
      </Map>
      <div className="text-xs text-gray-500 dark:text-gray-400 text-center py-2 bg-gray-50 dark:bg-gray-800">
        ©{' '}
        <a
          href="https://www.openstreetmap.org/copyright"
          target="_blank"
          rel="noopener noreferrer"
          className="hover:underline"
        >
          OpenStreetMap
        </a>{' '}
        contributors
      </div>
    </Card>
  )
}

export default VisitorMap
