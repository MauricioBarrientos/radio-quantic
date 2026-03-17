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
        <p className="text-gray-600 dark:text-gray-300">Obteniendo tu ubicación...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="text-center py-4">
        <p className="text-red-500 dark:text-red-400">Error: {error}</p>
      </div>
    )
  }

  if (!position) {
    return (
      <div className="text-center py-4">
        <p className="text-gray-600 dark:text-gray-300">No se pudo obtener la ubicación.</p>
      </div>
    )
  }

  return (
    <div className="map-container w-full h-64 md:h-96 rounded-lg shadow-lg mb-8">
      <MapContainer
        center={position}
        zoom={13}
        style={{ height: '100%', width: '100%' }}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        <Marker position={position}>
          <Popup>
            Estás aquí. <br /> Latitud: {position[0].toFixed(6)}, Longitud: {position[1].toFixed(6)}
          </Popup>
        </Marker>
      </MapContainer>
    </div>
  )
}

export default VisitorMap
