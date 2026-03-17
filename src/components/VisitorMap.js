import React, { useState, useEffect } from 'react'
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'

// Fix for default marker icons in Leaflet with Webpack
delete L.Icon.Default.prototype._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
})

const VisitorMap = () => {
  const [position, setPosition] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const getLocation = () => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            setPosition([position.coords.latitude, position.coords.longitude])
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
      <div className="text-center py-4">
        <p className="text-gray-600 dark:text-gray-300 loading-text">
          <svg className="animate-spin -ml-1 mr-3 h-5 w-5 inline-block text-blue-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          Obteniendo tu ubicación...
        </p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="text-center py-4">
        <div className="bg-red-100 dark:bg-red-900/20 border border-red-400 dark:border-red-500 text-red-700 dark:text-red-300 px-4 py-3 rounded-lg max-w-md mx-auto" role="alert">
          <svg className="fill-current w-6 h-6 inline-block mr-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
          </svg>
          <span className="font-medium">Error de geolocalización:</span> {error}
        </div>
      </div>
    )
  }

  if (!position) {
    return (
      <div className="text-center py-4">
        <div className="bg-yellow-100 dark:bg-yellow-900/20 border border-yellow-400 dark:border-yellow-500 text-yellow-700 dark:text-yellow-300 px-4 py-3 rounded-lg max-w-md mx-auto" role="alert">
          <svg className="fill-current w-6 h-6 inline-block mr-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.21 3.03-1.742 3.03H4.42c-1.532 0-2.493-1.696-1.743-3.03l5.58-9.92zM10 13a1 1 0 11-2 0 1 1 0 012 0zm-1-4a1 1 0 00-1 1v2a1 1 0 102 0v-2a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
          <span className="font-medium">Ubicación no disponible:</span> No se pudo obtener tu ubicación.
        </div>
      </div>
    )
  }

  return (
    <div className="map-container w-full h-64 md:h-96 rounded-xl shadow-2xl mb-8 overflow-hidden border-2 border-blue-500 dark:border-blue-400">
      <MapContainer
        center={position}
        zoom={15}
        style={{ height: '100%', width: '100%' }}
        zoomControl={false}
        attributionControl={false}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        <Marker position={position}>
          <Popup className="custom-popup">
            <div className="popup-content">
              <h3 className="font-bold text-lg mb-2">📍 Tu ubicación actual</h3>
              <p className="text-sm">
                Latitud: <span className="font-mono">{position[0].toFixed(6)}</span><br />
                Longitud: <span className="font-mono">{position[1].toFixed(6)}</span>
              </p>
            </div>
          </Popup>
        </Marker>
      </MapContainer>
      <div className="map-attribution text-xs text-gray-500 dark:text-gray-400 text-center mt-2">
        © <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener noreferrer" className="hover:underline">OpenStreetMap</a> contributors
      </div>
    </div>
  )
}

export default VisitorMap
