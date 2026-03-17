# Funcionalidad de Mapa de Visitantes

## Descripción

Se ha añadido una nueva funcionalidad que muestra un mapa interactivo con la geolocalización del visitante. Esta característica permite a los usuarios ver su ubicación actual en un mapa cuando visitan la página web.

## Características

- **Geolocalización automática**: El mapa detecta automáticamente la ubicación del usuario utilizando la API de geolocalización del navegador.
- **Mapa interactivo**: Los usuarios pueden hacer zoom, arrastrar y explorar el mapa.
- **Marcador de ubicación**: Un marcador muestra la posición exacta del usuario con coordenadas de latitud y longitud.
- **Popup informativo**: Al hacer clic en el marcador, se muestra un popup con la información de la ubicación.
- **Manejo de errores**: Si la geolocalización falla o no está soportada, se muestra un mensaje apropiado.
- **Diseño responsive**: El mapa se adapta a diferentes tamaños de pantalla.
- **Compatibilidad con modo oscuro**: El mapa y sus elementos se adaptan al tema oscuro de la aplicación.

## Tecnologías utilizadas

- **Leaflet**: Biblioteca de código abierto para mapas interactivos.
- **React-Leaflet**: Envoltorio de React para Leaflet.
- **OpenStreetMap**: Proveedor de tiles de mapa de código abierto.

## Implementación

### Componentes

- **VisitorMap.js**: Componente principal que maneja la geolocalización y renderiza el mapa.

### Dependencias

```json
{
  "leaflet": "^1.9.4",
  "react-leaflet": "^4.2.1"
}
```

### Uso

El componente `VisitorMap` se integra en el componente principal `App.js` y se muestra en la parte superior de la página, justo debajo del encabezado.

```jsx
import VisitorMap from './components/VisitorMap'

// En el JSX
<section className="mb-8">
  <h2 className="text-2xl font-semibold mb-4 text-center">Tu ubicación</h2>
  <VisitorMap />
</section>
```

## Personalización

### Estilos

Los estilos del mapa se pueden personalizar en el archivo `src/styles.css`. Actualmente incluye:

```css
/* Map Container Styles */
.map-container {
  @apply bg-gray-200 dark:bg-gray-800;
}

.map-container .leaflet-container {
  @apply rounded-lg;
}

.map-container .leaflet-popup-content-wrapper {
  @apply bg-white dark:bg-gray-700;
}

.map-container .leaflet-popup-content {
  @apply text-gray-800 dark:text-gray-200;
}

.map-container .leaflet-popup-tip {
  @apply bg-white dark:bg-gray-700;
}
```

### Configuración del mapa

En el componente `VisitorMap.js`, puedes ajustar:

- **Nivel de zoom inicial**: Cambia el valor `zoom` en el componente `MapContainer`.
- **Proveedor de tiles**: Modifica la URL en el componente `TileLayer` para usar diferentes proveedores de mapas.
- **Opciones de geolocalización**: Ajusta los parámetros en `navigator.geolocation.getCurrentPosition()`.

## Requisitos del navegador

- Soporte para la API de geolocalización.
- JavaScript habilitado.
- Conexión a Internet para cargar los tiles del mapa.

## Permisos

La aplicación solicitará permiso al usuario para acceder a su ubicación. Este permiso debe ser concedido para que el mapa muestre la ubicación correcta.

## Limitaciones

- La precisión de la geolocalización depende del dispositivo y la conexión del usuario.
- En algunos entornos (como HTTPS local o sirames), la geolocalización puede no funcionar correctamente.
- Los usuarios pueden denegar el permiso de ubicación, en cuyo caso se mostrará un mensaje de error.

## Ejemplo de visualización

Cuando un usuario visita la página:

1. Se muestra un mensaje "Obteniendo tu ubicación..." mientras se carga la geolocalización.
2. Una vez obtenida la ubicación, se muestra el mapa centrado en la posición del usuario.
3. Un marcador indica la ubicación exacta con un popup que muestra las coordenadas.
4. Si hay un error, se muestra un mensaje apropiado.

## Solución de problemas

- **El mapa no se muestra**: Verifica que la conexión a Internet esté activa y que no haya bloqueadores de contenido interfiriendo.
- **La ubicación es incorrecta**: Asegúrate de que los servicios de ubicación estén habilitados en el dispositivo y que el navegador tenga permiso para acceder a ellos.
- **Error de geolocalización**: Algunos navegadores pueden requerir que el sitio se sirva sobre HTTPS para que la geolocalización funcione correctamente.

## Futuras mejoras

- Añadir la capacidad de buscar ubicaciones.
- Mostrar múltiples marcadores para diferentes estaciones de radio.
- Integrar con APIs de geocodificación para mostrar direcciones legibles.
- Añadir capas adicionales al mapa (tráfico, satélite, etc.).
