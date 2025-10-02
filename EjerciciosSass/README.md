# Ejercicios de introducción a Sass

## Enunciados

### Ejercicio 1
Crea un parcial de definición de las variables para el color primario y secundario y utilizarlo para definir estilos para el body y los títulos h1 h2. Verifica que las variables se hayan aplicado correctamente.

### Ejercicio 2
Construye una hoja de estilos Sass para un sistema de mensajes de estado (como alertas de éxito, error o información) que sea modular, DRY (Don't Repeat Yourself) y fácil de mantener. Crea el estilo base en un parcial que no se compile por sí sólo, úsalos para definir estilos específicos para mensajes informativos, de error y de éxito. El color del fondo debe ser acorde con lo que representan. Además los enlaces dentro del mensaje de error deben estar en negrita. Comprueba que se transpila correctamente.

### Ejercicio 3
Crea dos mixins, uno que permita establecer la dirección de un contenedor flexbox y el otro que permita dar un tamaño específico en un elemento. Verifica que transpila y funciona correctamente sobre algún ejemplo.

### Ejercicio 4
Utiliza un bucle @for para generar 5 clases de espaciado llamadas margin-1 a .margin-5. Cada clase debe tener un margin que se incremente en 10px por cada iteración. Transpila el archivo y revisa el CSS generado.

## Desarrollo

Para cada ejercicio, se incluye el código fuente Sass (carpeta scss) y el código CSS (carpeta css) transpilado con la extensión Live Sass Compiler de Visual Studio Code.
 
### Ejercicio 1
- Se creó un archivo `variables.scss` con variables de color principales.
- Se aplicaron en `body` y encabezados (`h1`, `h2`).

### Ejercicio 2
- Se definió un estilo base `%alert` en `_alert-base.scss` con estilos base para alertas.
- Se extendió en clases `.alert--info`, `.alert--success` y `.alert--error`.

### Ejercicio 3
- Se implementaron dos **mixins**:
  - `flex-dir($dir)` para establecer flexbox con dirección variable.
  - `size($w, $h)` para asignar ancho y alto fácilmente.
- Se aplicaron en `.container` y `.box`.

### Ejercicio 4
- Se usó un **bucle @for** para generar automáticamente clases de márgenes (`.margin-1` hasta `.margin-5`), multiplicando por 10px cada nivel.
