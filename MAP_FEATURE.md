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

El componente `VisitorMap` se integra en el componente principal `App.js` y se muestra en la parte inferior de la página, justo encima del reproductor de audio.

```jsx
import VisitorMap from './components/VisitorMap'

// En el JSX
<section className="mt-12 mb-8">
  <div className="text-center mb-6">
    <h2 className="text-3xl font-bold mb-2 flex items-center justify-center gap-3">
      <svg className="w-8 h-8 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path>
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path>
      </svg>
      Tu ubicación actual
    </h2>
    <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
      Este mapa muestra tu ubicación aproximada basada en la geolocalización de tu dispositivo.
    </p>
  </div>
  <VisitorMap />
</section>
```

## Mejoras de diseño

El mapa ha sido mejorado con las siguientes características de diseño:

### Estilo visual mejorado
- **Borde azul**: Un borde azul llamativo alrededor del mapa para destacarlo.
- **Sombra profunda**: Efecto de sombra `shadow-2xl` para dar profundidad.
- **Esquinas redondeadas**: Bordes redondeados `rounded-xl` para un aspecto moderno.
- **Animación de entrada**: El mapa se desliza suavemente desde abajo al cargar.

### Popup personalizado
- **Diseño mejorado**: Popup con título destacado y formato de código para las coordenadas.
- **Borde temático**: Borde azul que coincide con el tema de la aplicación.
- **Compatibilidad con modo oscuro**: Colores adaptados para ambos temas.

### Estados de carga y error
- **Indicador de carga**: Animación de spinner con texto pulsante.
- **Mensajes de error**: Alertas estilizadas con iconos para diferentes tipos de errores.
- **Feedback visual**: Colores distintos para errores (rojo) y advertencias (amarillo).

### Diseño responsive
- **Altura adaptable**: `h-64` en móviles y `h-96` en escritorio.
- **Ancho completo**: Se adapta al contenedor padre.
- **Título descriptivo**: Sección con icono y descripción sobre la funcionalidad.

## Personalización

### Estilos

Los estilos del mapa se pueden personalizar en el archivo `src/styles.css`. Actualmente incluye:

```css
/* Map Container Styles */
.map-container {
  @apply bg-gray-200 dark:bg-gray-800;
}

.map-container .leaflet-container {
  @apply rounded-xl;
}

.map-container .leaflet-popup-content-wrapper {
  @apply bg-white dark:bg-gray-800 border-2 border-blue-500 dark:border-blue-400;
}

.map-container .leaflet-popup-content {
  @apply text-gray-800 dark:text-gray-200 p-4;
}

.map-container .leaflet-popup-tip {
  @apply bg-white dark:bg-gray-800;
}

/* Custom popup styles */
.custom-popup .leaflet-popup-content {
  margin: 0;
  padding: 0;
}

.popup-content {
  padding: 1rem;
}

.popup-content h3 {
  color: #2563eb;
  margin-bottom: 0.5rem;
}

.dark-mode .popup-content h3 {
  color: #60a5fa;
}
```

### Configuración del mapa

En el componente `VisitorMap.js`, puedes ajustar:

- **Nivel de zoom inicial**: Cambia el valor `zoom` en el componente `MapContainer`.
- **Proveedor de tiles**: Modifica la URL en el componente `TileLayer` para usar diferentes proveedores de mapas.
- **Opciones de geolocalización**: Ajusta los parámetros en `navigator.geolocation.getCurrentPosition()`.

## Posición en la interfaz

El mapa se ha colocado estratégicamente en la parte inferior de la página, justo encima del reproductor de audio. Esta ubicación ofrece varias ventajas:

1. **No interfiere con la experiencia principal**: Los usuarios pueden explorar las estaciones de radio sin distracciones.
2. **Fácil acceso**: Está disponible cuando el usuario termina de explorar las estaciones.
3. **Integración con el flujo**: Se muestra después del contenido principal pero antes de los controles de reproducción.
4. **Diseño equilibrado**: Ayuda a distribuir visualmente los elementos en la página.

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
