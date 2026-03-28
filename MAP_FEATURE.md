# Funcionalidad de Mapa de Visitantes

## Descripción

Se ha añadido una nueva funcionalidad que muestra un mapa interactivo con la ubicación aproximada del visitante. Esta característica permite a los usuarios ver su ubicación estimada en un mapa cuando visitan la página web.

## Características

- **Geolocalización automática por IP**: El mapa detecta automáticamente la ubicación aproximada del usuario mediante servicios de geolocalización por IP.
- **Mapa interactivo**: Los usuarios pueden hacer zoom, arrastrar y explorar el mapa.
- **Marcador de ubicación**: Un marcador muestra la posición exacta del usuario con coordenadas de latitud y longitud.
- **Popup informativo**: Al hacer clic en el marcador, se muestra un popup con la información de la ubicación.
- **Manejo de errores**: Si la consulta de ubicación por IP falla, se muestra un mensaje apropiado.
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
      Este mapa muestra tu ubicación aproximada basada en la dirección IP de tu conexión.
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
- **Proveedor de ubicación por IP**: Ajusta los endpoints de `fetch` (por ejemplo, `ipapi.co` e `ipwho.is`) para cambiar de proveedor o añadir fallback.

## Posición en la interfaz

El mapa se ha colocado estratégicamente en la parte inferior de la página, justo encima del reproductor de audio. Esta ubicación ofrece varias ventajas:

1. **No interfiere con la experiencia principal**: Los usuarios pueden explorar las estaciones de radio sin distracciones.
2. **Fácil acceso**: Está disponible cuando el usuario termina de explorar las estaciones.
3. **Integración con el flujo**: Se muestra después del contenido principal pero antes de los controles de reproducción.
4. **Diseño equilibrado**: Ayuda a distribuir visualmente los elementos en la página.

## Requisitos del navegador

- JavaScript habilitado.
- Conexión a Internet para cargar los tiles del mapa y consultar el servicio de ubicación por IP.

## Permisos

La aplicación no solicita permisos de ubicación del navegador. La posición se estima automáticamente mediante la IP pública del usuario.

## Limitaciones

- La precisión depende del proveedor de geolocalización por IP y puede variar según ISP/VPN/proxy.
- En algunos entornos, la IP puede resolverse a una ciudad o región cercana, no a una dirección exacta.
- Si el proveedor de IP no responde o es bloqueado, se mostrará un mensaje de error.

## Ejemplo de visualización

Cuando un usuario visita la página:

1. Se muestra un mensaje "Obteniendo tu ubicación aproximada por IP..." mientras se consulta el servicio.
2. Una vez obtenida la ubicación, se muestra el mapa centrado en la posición del usuario.
3. Un marcador indica la ubicación aproximada con coordenadas estimadas.
4. Si hay un error, se muestra un mensaje apropiado.

## Solución de problemas

- **El mapa no se muestra**: Verifica que la conexión a Internet esté activa y que no haya bloqueadores de contenido interfiriendo.
- **La ubicación es imprecisa**: Es normal en geolocalización por IP; prueba sin VPN/proxy o con otra red para mejorar la estimación.
- **Error de ubicación por IP**: Verifica conectividad saliente a los proveedores de IP y que no haya bloqueadores/redes corporativas filtrando esas APIs.

## Futuras mejoras

- Añadir la capacidad de buscar ubicaciones.
- Mostrar múltiples marcadores para diferentes estaciones de radio.
- Integrar con APIs de geocodificación para mostrar direcciones legibles.
- Añadir capas adicionales al mapa (tráfico, satélite, etc.).
