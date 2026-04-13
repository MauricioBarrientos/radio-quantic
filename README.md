# Radio Quantic

Radio Quantic es una aplicación web para escuchar radios online. La interfaz
presenta una grilla de emisoras curadas, permite reproducir streams en vivo con
un reproductor fijo y muestra la ubicación aproximada del visitante en un mapa.

## Stack

- React 18
- `react-app-rewired` sobre Create React App
- Tailwind CSS para utilidades de estilo
- Bootstrap para estilos base cargados globalmente
- MapLibre GL para el mapa interactivo
- ESLint + Prettier para calidad de código

## Estructura principal

- `src/App.js`: coordina la pantalla principal, el estado de reproducción y los
  reintentos de conexión del stream.
- `src/mock/stations.js`: catálogo estático de emisoras.
- `src/components/RadioStationCard.js`: tarjeta de cada emisora.
- `src/components/AdvancedPlayer.js`: reproductor inferior fijo.
- `src/components/VisitorMap.js`: mapa y estados de geolocalización.
- `src/components/ui/`: primitivas reutilizables para tarjeta y mapa.
- `public/`: archivos públicos como `index.html`, favicon y política de
  privacidad.

## Scripts

- `npm start`: levanta el entorno de desarrollo.
- `npm run dev`: alias de `npm start`.
- `npm run build`: genera el build de producción en `build/`.
- `npm run test`: ejecuta el runner de pruebas de CRA.
- `npm run lint`: revisa el código con ESLint.
- `npm run format`: formatea el proyecto con Prettier.

## Comportamiento actual

- Las emisoras se cargan desde datos locales; no hay backend ni base de datos.
- El audio se reproduce con `HTMLAudioElement`.
- Si un stream falla por red, la app intenta reconectar hasta 3 veces con
  backoff exponencial.
- El mapa solicita permiso de geolocalización y marca la posición del usuario
  cuando el navegador lo permite.

## Notas de mantenimiento

- El proyecto no usa service workers.
- La lista de dependencias está ajustada al código activo del repositorio.
- Si agregas nuevas emisoras, el cambio se hace en `src/mock/stations.js`.
