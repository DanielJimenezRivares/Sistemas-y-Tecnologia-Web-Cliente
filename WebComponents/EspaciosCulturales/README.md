## Documentación APIs

Esta sección resume los endpoints disponibles en la API.
Se detallan método, ruta, parámetros/entrada y forma de respuesta (salida) de forma simple.

### Rutas de `espacios`

Todos los endpoints de esta sección están montados bajo `/espacios`.

- GET `/espacios/`
  - Descripción: Lista espacios culturales, con filtrado y paginación básica.
  - Query parameters (opcionales):
    - `tipo` (string): filtra por tipo (ej. `museo`, `teatro`, `biblioteca`, ...).
    - `q` (string): búsqueda libre que compara nombre y dirección.
    - `start` (int): índice inicial (0-based) de la página.
    - `end` (int): índice final de la página.
  - Respuesta (200):
    - JSON con la forma: `{ total, start, end, count, data: [ ... ] }`.
    - Cada elemento en `data` tiene: `{ id, nombre, direccion, horario, telefono, web, tipos }`.
  - Errores:
    - 400 si `tipo` no es válido.

  - Nota: si no se indica `start`/`end`, la API devuelve hasta 20 ítems por defecto.

- GET `/espacios/ids`
  - Descripción: Devuelve una lista con todos los IDs de los espacios disponibles.
  - Respuesta (200): `{ total, ids: ["id1", "id2", ...] }`.

- GET `/espacios/espacio/:id`
  - Descripción: Devuelve los datos mapeados de un espacio por su ID.
  - Parámetros:
    - `:id` en la ruta (también soporta `?id=` en query).
  - Respuesta (200): un objeto con `{ id, nombre, direccion, horario, telefono, web, tipos }`.
  - Errores:
    - 400 si falta `id`.
    - 404 si no se encuentra el espacio.

#### Tipos admitidos
Los tipos válidos que acepta el filtro `tipo` son:

archivo, auditorio, biblioteca, centro_cultural, centro_interpretacion, centro_docente, cine, galeria_arte, museo, sala_conciertos, sala_exposiciones, sala_polivalente, teatro

### Rutas de `valoraciones`

Todos los endpoints de esta sección están montados bajo `/valoraciones`.

- POST `/valoraciones`
  - Descripción: Añade una valoración para un `espacio_cultural_id` y la persiste en `data/valoraciones.json`.
  - Body (JSON) (campos):
    - `espacio_cultural_id` (string|number) - obligatorio
    - `rating` (int 0-5) - obligatorio
    - `review` (string) - opcional
    - `timestamp` (ISO string) - opcional (si no se indica se calcula automáticamente)
    - `username` (string) - opcional (si no se indica, "Anonymous")
  - Respuesta (201) ejemplo:
    ```json
    {
      "id": "123",
      "overall": 4.5,
      "count": 10,
      "lastReview": {
        "rating": 5,
        "review": "Muy interesante",
        "username": "Ana",
        "timestamp": "2025-10-23T12:34:56.789Z"
      },
      "message": "rating stored"
    }
    ```
  - Errores (400) para validación (falta `espacio_cultural_id` o `rating` no entero entre 0 y 5).

- GET `/valoraciones/rating/:id`
  - Descripción: Obtiene el rating agregado (overall) y el recuento de valoraciones para un id.
  - Parámetros: `:id` o `?id=` en query.
  - Respuesta (200): `{ id: "123", overall: 4.2, count: 5 }`.
  - Si no existe registro para ese id devuelve `{ id, overall: 0, count: 0 }`.
  - 400 si falta `id`.

- GET `/valoraciones/reviews/:id?`
  - Descripción: Lista las valoraciones (reviews) de un espacio por id, paginadas y ordenadas por fecha (más recientes primero).
  - Parámetros:
    - `:id` opcional en ruta (también soporta `?id=` en query).
    - Query opcionales: `start`, `end` para paginación (por defecto 20 ítems).
  - Respuesta (200):
    - `{ id, total, start, end, count, data: [ { rating, review, username, timestamp }, ... ] }`
  - Si no hay valoraciones devuelve `total: 0` y `data: []`.

### Nota
- El servidor por defecto arranca en el puerto 3000 (ver `src/server.js`).


