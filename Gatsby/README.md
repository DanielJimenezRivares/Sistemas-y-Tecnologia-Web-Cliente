# Práctica Gatsby — Espacios Culturales (JAMSTACK)

Máster en Ingeniería Informática — Sistemas y Tecnologías Web: Cliente  
**Objetivo:** prototipo de sitio web estático con Gatsby (arquitectura **JAMSTACK**) para publicar **noticias** y **valoraciones** de espacios culturales, integrando datos desde una **API** en la capa de datos (GraphQL).

---

## 1. Descripción del proyecto

Este proyecto implementa:

- **Página principal** (`/`): layout con varias “cartas”/componentes (micro frontends) como:
  - Tablón de últimas noticias
  - Tablón de últimas valoraciones
  - Buscador de espacios
- **Páginas de detalle por espacio** (`/espacios/:id`): creadas automáticamente con `createPages` en `gatsby-node.js`.
  - Columna izquierda: **ficha del espacio** (imagen, nombre, dirección, tipo, teléfono, web, horario…)
  - Columna derecha:
    - Arriba: **TablónNoticiasEspacio** con las **últimas 5 noticias** (datos estáticos via GraphQL).
    - Abajo: **TablónValoracionesEspacio** con las **últimas 20 valoraciones** (datos dinámicos via API) y un formulario para publicar reseña (POST + refresco).

El diseño sigue el enfoque de “micro frontend” con React.

---

## 2. Instalación (monorepo con workspaces)

Desde la **raíz** del repositorio:

```bash
npm install
```

---

## 3. Ejecución en desarrollo

```bash
npm start
```

La página estará disponible en localhost:8000

---

## 4. Build y preview

### 4.1 Desplegqar la API

```bash
npm -w api start
```

### 4.2. Build

```bash
npm -w web run build
```

### 4.3. Servir build

```bash
npm -w web run serve
```

La página estará disponible en localhost:9000

## 5. Arquitectura de datos (API → GraphQL)

Gatsby integra datos de múltiples fuentes en una capa de datos unificada y los expone por GraphQL.

En este proyecto:
- sourceNodes obtiene espacios y noticias desde la API y crea nodos (EspacioCultural, Noticia).
- GraphiQL permite explorar el schema durante develop.
- Las páginas/plantillas consumen datos con queries GraphQL.

## 6. Páginas automáticas (createPages)

Se generan páginas para cada espacio en:

- `gatsby-node.js` → `exports.createPages`
- Template: `src/templates/espacio.js`

Rutas generadas:
- `/espacios/1/`
- `/espacios/2/`
…
- `/espacios/:id/`

## 7. Layout reutilizable con children
El proyecto incluye un Layout reutilizable que envuelve todas las páginas:

- Header (clicable para volver a `/`)
- Contenido (`children`)
- Footer

## 8. Estilos e imágenes

- Estilos con Sass y CSS Modules (*.module.scss)
- Se aprovechan estilos base reutilizables (panel, card-shell) para consistencia.
- Inclusión de imagen en la home mediante plugins/componentes de Gatsby (gatsby-plugin-image, StaticImage).

## 9. Estructura del proyecto (resumen)

- `src/pages/` → páginas (`index.js`, `404.js`)
- `src/templates/` → template de espacio (`espacio.js`)
- `src/components/` → componentes reutilizables (layout, tablones, ficha espacio, etc.)
- `gatsby-node.js` → `sourceNodes` + `createPages`