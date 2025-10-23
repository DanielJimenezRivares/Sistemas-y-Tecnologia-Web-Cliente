# Ciclo de Vida de un Web Component

Este proyecto implementa un contador simple como Web Component para demostrar y observar el ciclo de vida de los Web Components a través de mensajes en la consola del navegador.

## Descripción

El proyecto consiste en un contador que se puede mostrar/ocultar y cuyo valor se puede incrementar/decrementar. Su principal objetivo es ilustrar las diferentes etapas del ciclo de vida de un Web Component mediante mensajes en la consola.

### Funcionalidades

- Mostrar/ocultar el contador (adjuntar/separar del DOM)
- Incrementar/decrementar el valor del contador
- Visualización de mensajes en consola para cada etapa del ciclo de vida
- Estilo encapsulado usando Shadow DOM

## Ciclo de Vida Demostrado

El componente `ContadorSimple` implementa los siguientes callbacks del ciclo de vida:

1. **Constructor**: Llamado cuando se crea una instancia del componente
   - Inicializa el Shadow DOM
   - Clona la plantilla del contador
   - Mensaje: `[ContadorSimple] Creado (constructor)`

2. **connectedCallback**: Ejecutado cuando el componente se adjunta al DOM
   - Actualiza la visualización
   - Mensaje: `[ContadorSimple] Adjuntado al DOM (connectedCallback)`

3. **disconnectedCallback**: Ejecutado cuando el componente se separa del DOM
   - Mensaje: `[ContadorSimple] Separado del DOM (disconnectedCallback)`

4. **attributeChangedCallback**: Monitoriza cambios en el atributo "value"
   - Parámetros: nombre del atributo, valor anterior y nuevo valor
   - Mensaje: `[ContadorSimple] attributeChangedCallback → value: { oldValue, newValue }`

## Estructura del Proyecto

```
CicloVida/
├─ index.html      # Página principal con la plantilla del componente
├─ js/
│  └─ component.js # Implementación del Web Component
└─ scss/
   └─ style.scss   # Estilos de la página (no del componente)
```

## Características Técnicas

- **Shadow DOM**: Utiliza modo "closed" para encapsulamiento total
- **Template**: Define la estructura del contador en una plantilla HTML
- **Atributos Observados**: Monitoriza cambios en el atributo "value"
- **Métodos públicos**:
  - Métodos: `inc()`, `dec()`

## Cómo Probar

1. Usar los botones de control:
   - "Mostrar contador": Adjunta el componente al DOM
   - "Ocultar contador": Separa el componente del DOM
   - "Subir contador": Incrementa el valor
   - "Bajar contador": Decrementa el valor
3. Observar los mensajes en la consola que muestran cada etapa del ciclo de vida

## Tecnologías Utilizadas

- Web Components nativos
- Shadow DOM
- HTML Templates
- Parcel (bundler)