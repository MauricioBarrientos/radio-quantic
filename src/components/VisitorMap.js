import React, { useState, useEffect } from 'react'
import { Map, MapControls, MapMarker } from './ui/map'
import { Card } from './ui/card'

const IP_GEO_SERVICES = [
  {
    url: 'https://ipapi.co/json/',
    extract: (data) => ({
      latitude: Number(data?.latitude),
      longitude: Number(data?.longitude),
    }),
  },
  {
    url: 'https://ipwho.is/',
    extract: (data) => ({
      latitude: Number(data?.latitude),
      longitude: Number(data?.longitude),
    }),
  },
]

const VisitorMap = () => {
  const [position, setPosition] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const getLocationByIp = async () => {
      try {
        for (const service of IP_GEO_SERVICES) {
          const controller = new AbortController()
          const timeoutId = setTimeout(() => controller.abort(), 8000)

          try {
            const response = await fetch(service.url, {
              signal: controller.signal,
            })

            if (!response.ok) {
              continue
            }

            const data = await response.json()
            const coords = service.extract(data)
            const hasValidCoords =
              Number.isFinite(coords.latitude) &&
              Number.isFinite(coords.longitude)

            if (hasValidCoords) {
              setPosition([coords.longitude, coords.latitude])
              setError(null)
              return
            }
          } catch {
            // Try next provider.
          } finally {
            clearTimeout(timeoutId)
          }
        }

        setError('No se pudo obtener tu ubicación aproximada por IP.')
      } finally {
        setLoading(false)
      }
    }

    getLocationByIp()
  }, [])

  if (loading) {
    return (
      <Card className="flex h-64 items-center justify-center md:h-96">
        <p className="flex items-center gap-2 text-gray-600 dark:text-gray-300">
          <svg
            className="h-5 w-5 animate-spin text-blue-500"
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
          Obteniendo tu ubicación aproximada por IP...
        </p>
      </Card>
    )
  }

  if (error) {
    return (
      <Card className="flex h-64 items-center justify-center p-6 md:h-96">
        <div className="max-w-md rounded-lg border border-red-400 bg-red-100 px-4 py-3 text-center text-red-700 dark:border-red-500 dark:bg-red-900/20 dark:text-red-300">
          <svg
            className="mr-2 inline-block h-6 w-6 fill-current"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
          >
            <path
              fillRule="evenodd"
              d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
              clipRule="evenodd"
            />
          </svg>
          <span className="font-medium">Error de ubicación por IP:</span>{' '}
          {error}
        </div>
      </Card>
    )
  }

  if (!position) {
    return (
      <Card className="flex h-64 items-center justify-center p-6 md:h-96">
        <div className="max-w-md rounded-lg border border-yellow-400 bg-yellow-100 px-4 py-3 text-center text-yellow-700 dark:border-yellow-500 dark:bg-yellow-900/20 dark:text-yellow-300">
          <svg
            className="mr-2 inline-block h-6 w-6 fill-current"
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
          pudo obtener tu ubicación aproximada.
        </div>
      </Card>
    )
  }

  return (
    <Card className="h-96 overflow-hidden border-2 border-blue-500 p-0 shadow-2xl dark:border-blue-400 md:h-[600px]">
      <Map center={[0, 20]} zoom={1.5}>
        <MapControls position="bottom-right" />
        <MapMarker longitude={position[0]} latitude={position[1]}>
          <div className="relative">
            <div className="absolute h-3 w-3 animate-ping rounded-full bg-green-500"></div>
            <div className="relative h-3 w-3 rounded-full bg-green-500"></div>
          </div>
        </MapMarker>
      </Map>
      <div className="bg-gray-50 py-2 text-center text-xs text-gray-500 dark:bg-gray-800 dark:text-gray-400">
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
