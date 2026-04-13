import React, {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
  useMemo,
  useCallback,
} from 'react'
import maplibregl from 'maplibre-gl'
import 'maplibre-gl/dist/maplibre-gl.css'
import { cn } from '../../lib/utils'
import PropTypes from 'prop-types'
import { Plus, Minus, Locate, Maximize, Loader2 } from 'lucide-react'

const defaultStyles = {
  dark: 'https://basemaps.cartocdn.com/gl/dark-matter-gl-style/style.json',
  light: 'https://basemaps.cartocdn.com/gl/positron-gl-style/style.json',
}

function getDocumentTheme() {
  if (typeof document === 'undefined') return null
  if (document.documentElement.classList.contains('dark')) return 'dark'
  if (document.documentElement.classList.contains('light')) return 'light'
  return null
}

function getSystemTheme() {
  if (typeof window === 'undefined') return 'light'
  return window.matchMedia('(prefers-color-scheme: dark)').matches
    ? 'dark'
    : 'light'
}

function useResolvedTheme(themeProp) {
  const [detectedTheme, setDetectedTheme] = useState(
    () => getDocumentTheme() ?? getSystemTheme()
  )

  useEffect(() => {
    if (themeProp) return

    const observer = new MutationObserver(() => {
      const docTheme = getDocumentTheme()
      if (docTheme) setDetectedTheme(docTheme)
    })
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class'],
    })

    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
    const handleSystemChange = (e) => {
      if (!getDocumentTheme()) {
        setDetectedTheme(e.matches ? 'dark' : 'light')
      }
    }
    mediaQuery.addEventListener('change', handleSystemChange)

    return () => {
      observer.disconnect()
      mediaQuery.removeEventListener('change', handleSystemChange)
    }
  }, [themeProp])

  return themeProp ?? detectedTheme
}

const MapContext = createContext(null)

function useMap() {
  const context = useContext(MapContext)
  if (!context) {
    throw new Error('useMap must be used within a Map component')
  }
  return context
}

function DefaultLoader() {
  return (
    <div className="absolute inset-0 flex items-center justify-center bg-black/20">
      <Loader2 className="h-8 w-8 animate-spin text-white" />
    </div>
  )
}

export function Map({
  children,
  className,
  theme: themeProp,
  styles,
  projection,
  viewport,
  onViewportChange,
  loading = false,
  ...props
}) {
  const containerRef = useRef(null)
  const [mapInstance, setMapInstance] = useState(null)
  const [isLoaded, setIsLoaded] = useState(false)
  const [isStyleLoaded, setIsStyleLoaded] = useState(false)
  const currentStyleRef = useRef(null)
  const styleTimeoutRef = useRef(null)

  const resolvedTheme = useResolvedTheme(themeProp)
  const onViewportChangeRef = useRef(onViewportChange)
  onViewportChangeRef.current = onViewportChange

  const mapStyles = useMemo(
    () => ({
      dark: styles?.dark ?? defaultStyles.dark,
      light: styles?.light ?? defaultStyles.light,
    }),
    [styles]
  )

  const clearStyleTimeout = useCallback(() => {
    if (styleTimeoutRef.current) {
      clearTimeout(styleTimeoutRef.current)
      styleTimeoutRef.current = null
    }
  }, [])

  // Initialize map
  useEffect(() => {
    if (!containerRef.current) return

    const initialStyle =
      resolvedTheme === 'dark' ? mapStyles.dark : mapStyles.light
    currentStyleRef.current = initialStyle

    const map = new maplibregl.Map({
      container: containerRef.current,
      style: initialStyle,
      renderWorldCopies: false,
      attributionControl: false,
      ...props,
      ...(viewport || {}),
    })

    const styleDataHandler = () => {
      clearStyleTimeout()
      styleTimeoutRef.current = setTimeout(() => {
        setIsStyleLoaded(true)
        if (projection) {
          map.setProjection(projection)
        }
      }, 100)
    }

    const loadHandler = () => {
      setIsLoaded(true)
      // Apply projection immediately on load if provided
      if (projection) {
        map.setProjection(projection)
      }
    }

    const handleMove = () => {
      if (viewport && onViewportChangeRef.current) {
        const center = map.getCenter()
        onViewportChangeRef.current({
          center: [center.lng, center.lat],
          zoom: map.getZoom(),
          bearing: map.getBearing(),
          pitch: map.getPitch(),
        })
      }
    }

    map.on('load', loadHandler)
    map.on('styledata', styleDataHandler)
    map.on('move', handleMove)

    setMapInstance(map)

    return () => {
      clearStyleTimeout()
      map.off('load', loadHandler)
      map.off('styledata', styleDataHandler)
      map.off('move', handleMove)
      map.remove()
      setIsLoaded(false)
      setIsStyleLoaded(false)
      setMapInstance(null)
    }
  }, [])

  // Handle style change on theme change
  useEffect(() => {
    if (!mapInstance || !resolvedTheme) return

    const newStyle = resolvedTheme === 'dark' ? mapStyles.dark : mapStyles.light
    if (currentStyleRef.current === newStyle) return

    clearStyleTimeout()
    currentStyleRef.current = newStyle
    setIsStyleLoaded(false)
    mapInstance.setStyle(newStyle, { diff: true })
  }, [mapInstance, resolvedTheme, mapStyles, clearStyleTimeout])

  const contextValue = useMemo(
    () => ({
      map: mapInstance,
      isLoaded: isLoaded && isStyleLoaded,
    }),
    [mapInstance, isLoaded, isStyleLoaded]
  )

  return (
    <div ref={containerRef} className={cn('relative h-full w-full', className)}>
      {(!isLoaded || loading) && <DefaultLoader />}
      {mapInstance && (
        <MapContext.Provider value={contextValue}>
          {children}
        </MapContext.Provider>
      )}
    </div>
  )
}

export function MapControls({
  position = 'bottom-right',
  showZoom = true,
  showLocate = false,
  showFullscreen = false,
  className,
  onLocate,
}) {
  const { map } = useMap()
  const [waitingForLocation, setWaitingForLocation] = useState(false)

  const handleZoomIn = useCallback(() => {
    map?.zoomTo(map.getZoom() + 1, { duration: 300 })
  }, [map])

  const handleZoomOut = useCallback(() => {
    map?.zoomTo(map.getZoom() - 1, { duration: 300 })
  }, [map])

  const handleLocate = useCallback(() => {
    setWaitingForLocation(true)
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const coords = {
            longitude: pos.coords.longitude,
            latitude: pos.coords.latitude,
          }
          map?.flyTo({
            center: [coords.longitude, coords.latitude],
            zoom: 14,
            duration: 1500,
          })
          onLocate?.(coords)
          setWaitingForLocation(false)
        },
        (error) => {
          console.error('Error getting location:', error)
          setWaitingForLocation(false)
        }
      )
    }
  }, [map, onLocate])

  const handleFullscreen = useCallback(() => {
    const container = map?.getContainer()
    if (!container) return

    if (document.fullscreenElement) {
      document.exitFullscreen()
    } else {
      container.requestFullscreen()
    }
  }, [map])

  const positionClasses = {
    'top-left': 'top-2 left-2',
    'top-right': 'top-2 right-2',
    'bottom-left': 'bottom-2 left-2',
    'bottom-right': 'bottom-10 right-2',
  }

  return (
    <div className={cn('absolute z-10', positionClasses[position], className)}>
      <div className="flex flex-col overflow-hidden rounded-lg border border-gray-200 bg-white shadow-md dark:border-gray-700 dark:bg-gray-800">
        {showZoom && (
          <>
            <button
              onClick={handleZoomIn}
              className="flex h-10 w-10 items-center justify-center text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700"
              title="Zoom in"
              aria-label="Zoom in"
            >
              <Plus className="h-5 w-5" />
            </button>
            <button
              onClick={handleZoomOut}
              className="flex h-10 w-10 items-center justify-center text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700"
              title="Zoom out"
              aria-label="Zoom out"
            >
              <Minus className="h-5 w-5" />
            </button>
          </>
        )}
        {showLocate && (
          <button
            onClick={handleLocate}
            disabled={waitingForLocation}
            className="flex h-10 w-10 items-center justify-center text-gray-600 hover:bg-gray-100 disabled:opacity-50 dark:text-gray-300 dark:hover:bg-gray-700"
            title="Locate"
            aria-label="Locate"
          >
            {waitingForLocation ? (
              <Loader2 className="h-5 w-5 animate-spin" />
            ) : (
              <Locate className="h-5 w-5" />
            )}
          </button>
        )}
        {showFullscreen && (
          <button
            onClick={handleFullscreen}
            className="flex h-10 w-10 items-center justify-center text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700"
            title="Toggle fullscreen"
            aria-label="Toggle fullscreen"
          >
            <Maximize className="h-5 w-5" />
          </button>
        )}
      </div>
    </div>
  )
}

export function MapMarker({
  longitude,
  latitude,
  children,
  onClick,
  onMouseEnter,
  onMouseLeave,
  draggable = false,
  ...markerOptions
}) {
  const { map } = useMap()
  const elementRef = useRef(null)
  const markerRef = useRef(null)
  const callbacksRef = useRef({ onClick, onMouseEnter, onMouseLeave })
  callbacksRef.current = { onClick, onMouseEnter, onMouseLeave }

  useEffect(() => {
    if (!map || !elementRef.current) return

    const markerInstance = new maplibregl.Marker({
      ...markerOptions,
      element: elementRef.current,
      draggable,
    }).setLngLat([longitude, latitude])

    markerRef.current = markerInstance
    markerInstance.addTo(map)

    return () => {
      markerInstance.remove()
    }
  }, [map, draggable, markerOptions])

  useEffect(() => {
    if (markerRef.current) {
      markerRef.current.setLngLat([longitude, latitude])
    }
  }, [longitude, latitude])

  useEffect(() => {
    if (!elementRef.current) return

    const handleClick = (e) => callbacksRef.current.onClick?.(e)
    const handleMouseEnter = (e) => callbacksRef.current.onMouseEnter?.(e)
    const handleMouseLeave = (e) => callbacksRef.current.onMouseLeave?.(e)

    elementRef.current.addEventListener('click', handleClick)
    elementRef.current.addEventListener('mouseenter', handleMouseEnter)
    elementRef.current.addEventListener('mouseleave', handleMouseLeave)

    return () => {
      elementRef.current?.removeEventListener('click', handleClick)
      elementRef.current?.removeEventListener('mouseenter', handleMouseEnter)
      elementRef.current?.removeEventListener('mouseleave', handleMouseLeave)
    }
  }, [])

  return (
    <div ref={elementRef} className="flex items-center justify-center">
      {children || (
        <div className="flex h-4 w-4 items-center justify-center rounded-full bg-blue-500">
          <svg
            width="12"
            height="12"
            viewBox="0 0 12 12"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <circle cx="6" cy="6" r="6" fill="white" />
            <circle cx="6" cy="6" r="3" fill="#3B82F6" />
          </svg>
        </div>
      )}
    </div>
  )
}

export { useMap }
export default Map

Map.propTypes = {
  children: PropTypes.node,
  className: PropTypes.string,
  theme: PropTypes.oneOf(['light', 'dark']),
  styles: PropTypes.shape({
    light: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
    dark: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
  }),
  projection: PropTypes.object,
  viewport: PropTypes.shape({
    center: PropTypes.arrayOf(PropTypes.number),
    zoom: PropTypes.number,
    bearing: PropTypes.number,
    pitch: PropTypes.number,
  }),
  onViewportChange: PropTypes.func,
  loading: PropTypes.bool,
}

MapControls.propTypes = {
  position: PropTypes.oneOf([
    'top-left',
    'top-right',
    'bottom-left',
    'bottom-right',
  ]),
  showZoom: PropTypes.bool,
  showLocate: PropTypes.bool,
  showFullscreen: PropTypes.bool,
  className: PropTypes.string,
  onLocate: PropTypes.func,
}

MapMarker.propTypes = {
  longitude: PropTypes.number.isRequired,
  latitude: PropTypes.number.isRequired,
  children: PropTypes.node,
  onClick: PropTypes.func,
  onMouseEnter: PropTypes.func,
  onMouseLeave: PropTypes.func,
  draggable: PropTypes.bool,
}
