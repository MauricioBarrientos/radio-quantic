# Radio Quantic

Radio Quantic es una aplicación web de reproductor de radio en línea construida con React. Permite a los usuarios explorar y escuchar una lista predefinida de estaciones de radio por internet.

## Tecnologías Utilizadas

A continuación se detallan las principales tecnologías y herramientas utilizadas en el desarrollo de Radio Quantic:

### Lenguajes de Programación
*   **JavaScript**

### Frameworks
*   **React**: `^18.0.0`

### Librerías Principales
*   **Bootstrap**: `^5.3.6` (Para estilos y componentes UI)
*   **React DOM**: `^18.0.0` (Punto de entrada de React para el DOM)
*   **React Icons**: `^5.5.0` (Colección de iconos para la interfaz de usuario)

### Bases de Datos
Actualmente, la aplicación no utiliza una base de datos externa. Los datos de las estaciones de radio se gestionan de forma local en `src/mock/stations.js`.

### Herramientas de Build/Despliegue
*   **React Scripts**: `^5.0.1` (Scripts para iniciar, construir y probar aplicaciones React, parte de Create React App)
*   **Webpack**: `^5.99.8` (Empaquetador de módulos, utilizado internamente por React Scripts)
*   **ESLint**: `^8.57.1` (Herramienta de linting para identificar patrones problemáticos en el código JavaScript)
*   **Prettier**: `^3.6.2` (Formateador de código para mantener un estilo consistente)
*   **Husky**: `^9.1.7` (Herramienta para gestionar ganchos de Git, como pre-commit)
*   **Lint-Staged**: `^16.1.5` (Ejecuta linters en archivos staged de Git)

## Estructura del Proyecto

El proyecto sigue una estructura de componentes modular típica de React:

*   `src/App.js`: Componente principal que orquesta la aplicación.
*   `src/components/`: Contiene los componentes reutilizables de la UI (e.g., `RadioStationCard`, `AdvancedPlayer`).
*   `src/mock/stations.js`: Almacena los datos mock de las estaciones de radio.
*   `public/`: Archivos estáticos y `index.html`.

## Scripts Disponibles

En el directorio del proyecto, puedes ejecutar:

*   `npm start`: Ejecuta la aplicación en modo de desarrollo.
*   `npm run build`: Compila la aplicación para producción en la carpeta `build`.
*   `npm test`: Lanza el corredor de pruebas en modo de vigilancia interactivo.
*   `npm run lint`: Ejecuta ESLint para verificar problemas de código.
*   `npm run format`: Formatea el código usando Prettier.
