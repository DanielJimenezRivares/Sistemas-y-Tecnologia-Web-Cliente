# Herramientas

Práctica consistente en utilizar herramientas para la generación de proyectos, automatización de tareas, etc. con Gulp y Parcel

## Ejercicio 1

Este ejercicio se basa en utilizar Gulp para automatizar tareas comunes de front-end (compilar SCSS, minificar CSS/JS, optimizar imágenes y recarga automática durante el desarrollo).

Para ello, se ha partido del layout utilizado en la práctica de Introducción a Sass, al que se han añadido varias imágenes y un archivo JavaScript que genera párrafos aleatorios consumiendo la API [Random Word API](https://random-word-api.herokuapp.com).

### Estructura

Estructura del directorio `Ejercicio 1`:

```
Ejercicio 1/
├─ scss/ (Código Sass fuente)
├─ img/
│  ├─ logo.png
│  ├─ product.svg
│  ├─ testimonial.svg
|  └─ dist/ (imagenes optimizadas por gulp)
├─ js/
│  └─ loremIpsum.js
|  └─ dist/ (js minificado por gulp)
├─ css/ (css generado y minificado por Gulp)
├─ gulpfile.js
├─ package.json (creado con npm init)
└─ index.html
```

### Configuración de Gulp

#### Dependencias Utilizadas
- `gulp`: Sistema de automatización de tareas
- `gulp-sass` y `sass`: Compilación de archivos Sass a CSS
- `gulp-clean-css`: Minificación de archivos CSS
- `gulp-sourcemaps`: Generación de sourcemaps para depuración de Sass y JS
- `gulp-imagemin`: Optimización de imágenes (PNG, SVG)
- `gulp-terser`: Minificación y optimización de JavaScript
- `gulp-rename`: Renombrado de archivos con sufijo .min
- `rimraf`: Limpieza de directorios destino
- `browser-sync`: Servidor de desarrollo con recarga automática

#### Tareas de Gulp Configuradas

##### Estilos (Sass)
```javascript
exports.styles = styles;
```
- Compila Sass a CSS
- Genera sourcemaps
- Minifica el CSS resultante
- Añade sufijo .min
- Recarga el navegador automáticamente

##### JavaScript
```javascript
exports.scripts = scripts;
```
- Minifica archivos JavaScript
- Genera sourcemaps
- Añade sufijo .min
- Recarga el navegador automáticamente

##### Imágenes
```javascript
exports.images = images;
```
- Optimiza imágenes PNG y SVG
- Configuración específica para:
  - PNG: Nivel de optimización 5
  - SVG: Preserva viewBox y IDs
- Añade sufijo .min

##### Observación de Cambios
```javascript
exports.watch = watch;
```
- Vigila cambios en:
  - Archivos Sass
  - Archivos JavaScript
  - Imágenes
  - HTML
- Ejecuta las tareas correspondientes automáticamente
- Actualiza el navegador en tiempo real

#### Comandos Disponibles
- `gulp`: Ejecuta la construcción completa y inicia el modo observador
- `gulp build`: Construye todos los assets (estilos, scripts e imágenes)
- `gulp styles`: Procesa solo los estilos
- `gulp scripts`: Procesa solo los archivos JavaScript
- `gulp images`: Procesa solo las imágenes
- `gulp watch`: Inicia el modo observador

## Ejercicio 2 - Parcel + gh-pages

Este ejercicio usa el empaquetador Parcel para construir los assets y `gh-pages` para desplegar la carpeta generada en GitHub Pages.

Página desplegada en: https://danieljimenezrivares.github.io/Sistemas-y-Tecnologia-Web-Cliente/Herramientas/Ejercicio%202/

### ¿Qué hace Parcel?
- Compila Sass referenciados a CSS y los minifica
- Minifica archivos JavaScript referenciados
- Genera sourcemaps
- Optimiza imágenes referenciadas

### Scripts disponibles
- `npm run dev` — ejecuta: `parcel serve --dist-dir dist ./index.html` (servidor de desarrollo, carpeta de salida `dist`)
- `npm run build` — ejecuta: `parcel build --dist-dir build --public-url /repo-name/ ./index.html` (construye en la carpeta `build` y ajusta `public-url` para servir desde `/repo-name/`)
- `npm run deploy` — ejecuta: `gh-pages -d build --dest <subfolder-path>` (publica el contenido de la carpeta local `build` en la rama gh-pages de tu repositorio, colocándolo dentro de la subcarpeta `<subfolder-path>`)