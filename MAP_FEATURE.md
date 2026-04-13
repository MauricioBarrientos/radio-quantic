# Funcionalidad Del Mapa

## Descripción

La aplicación incluye un mapa interactivo que muestra la ubicación aproximada
del visitante a partir de servicios de geolocalización por IP. No solicita
permisos de ubicación del navegador.

## Qué hace hoy

- Consulta proveedores de geolocalización por IP con fallback.
- Muestra estados de carga, error y ausencia de ubicación.
- Renderiza un mapa mundial con controles de zoom.
- Coloca un marcador animado en la ubicación estimada del usuario.
- Muestra la atribución de OpenStreetMap en el pie del mapa.

## Implementación actual

- `src/components/VisitorMap.js`: consulta de ubicación y renderizado del estado
  visible.
- `src/components/ui/map.jsx`: wrapper interno sobre MapLibre GL.
- `src/components/ui/card.jsx`: contenedor visual reutilizable para los estados
  del mapa.

## Tecnologías usadas

- `maplibre-gl`
- `lucide-react`
- Tailwind CSS

## Consideraciones

- La precisión depende del proveedor de geolocalización por IP y puede variar
  según ISP, VPN o proxy.
- Si el proveedor no responde o la red bloquea la consulta, el mapa muestra un
  estado de error.
- El mapa no guarda coordenadas ni envía datos a un backend propio.

## Posición en la interfaz

El mapa se muestra al final de la página principal, debajo de la grilla de
emisoras y encima del reproductor fijo.
