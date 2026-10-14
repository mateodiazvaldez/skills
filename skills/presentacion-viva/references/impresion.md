# Imprimible siempre

El deck está vivo, pero siempre tiene que poder imprimirse o exportarse a PDF y quedar bien: para entregarlo, como plan B sin internet o para que el docente lo lea después. Se resuelve en tres capas: diseñar cada animación con un estado final, probar el export, y tener una salida de respaldo si el export falla.

## Contenido
1. Diseñar para imprimir
2. Artifact Slides: probar el PDF
3. Copia imprimible con capturas
4. Deck HTML: modo `?print`

## 1. Diseñar para imprimir

- **Cada animación tiene un estado final** que cuenta la idea completa, quieto. Es lo que se ve por defecto: los elementos están visibles en el CSS base y solo se ocultan mientras la animación corre (clase `anim` en el `body`). Si el exportador captura antes, o el JS no corre, se ve completo. `assets/embed-base.html` ya trae el patrón con `FINAL()`.
- **`window.PRINT`**: si está definido, la animación se queda en `FINAL()` y no arranca. Lo definen el modo `?print` del reproductor HTML y `scripts/capturar_finales.mjs`.
- **El cuadro final elige lo importante.** Cuando la animación alterna escenarios o reproduce un flujo, el estado final muestra el que importa:
  - Cálculo con escenarios: el de la meta, no el ilustrativo.
  - Chat con un agente: los 3 pedidos con sus respuestas.
  - Ficha que recorre un circuito: el recorrido completo dibujado.
  - Contadores: el valor final.
- **Nada que se entienda solo por el movimiento.** Si una idea depende de ver algo moverse (por ejemplo, el «ciclo viral»), el estado final la deja escrita o dibujada: una flecha, una etiqueta.
- **Video:** al imprimir se ve la portada (`src` del `<img data-video>`). Elegir una portada que diga algo, no un cuadro negro.
- **App en vivo** (solo HTML): darle una captura con `data-print-src`.
- **Fondos:** el deck usa fondos claros o de marca. En la copia imprimible se mantienen (el reproductor HTML fuerza `print-color-adjust: exact`).
- **Notas:** no se imprimen. Si el docente pide el guion, se exporta aparte desde los `<aside>`.

## 2. Artifact Slides: probar el PDF

El artifact exporta a PDF y PPTX desde su menú (Share › Export). Cómo captura las animaciones embebidas no está documentado: puede tomar el estado final, un cuadro cualquiera o nada. Por eso:

1. Una vez por deck, y de nuevo si se cambian animaciones, pedirle al usuario que exporte el PDF y revise cada slide animada. No hay forma de exportarlo desde la sesión.
2. Si todas se ven completas: anotarlo en el CONTEXTO («PDF verificado, versión N») y listo.
3. Si alguna sale vacía, cortada o a medio camino: hacer la copia imprimible (punto 3) para esas slides o para todo el deck.

En el exporte a PPTX las animaciones quedan como imagen estática; vale el mismo criterio.

## 3. Copia imprimible con capturas

Es un **segundo artifact Slides**, igual al deck pero con cada animación reemplazada por la imagen de su estado final, sin builds ni video. Se regenera después de cada cambio del deck, y la que se imprime es esa.

Requisitos: Node y `playwright-core` en una carpeta de trabajo (`npm i playwright-core`), y Chrome instalado o `npx playwright install chromium`. Para usar un Chrome concreto, definir `CHROME_PATH`. Los scripts se corren desde esa carpeta.

1. **Capturar** el estado final de cada animación, a 2x:
   ```bash
   node <skill>/scripts/capturar_finales.mjs <root-del-deck> capturas/
   ```
   - Renderiza cada `<x-embed>` solo, con `window.PRINT=1` y la fuente de marca (acá sí hay red), y guarda `capturas/<id>-<k>.png`.
   - Para animaciones viejas que no tienen `FINAL()`: `--ms 8000` espera a que termine la entrada.
   - Arma `capturas/hoja.html`, una hoja de contactos para revisar todas juntas. Abrirla o mostrársela al usuario.
2. **Subir las imágenes** como assets del artifact nuevo (`publish` con `asset: true`) y anotar el blob id de cada una en un `mapa.json`: `{"<slide>": ["<blob>"]}` (una entrada por embed, en orden).
3. **Armar las slides estáticas**:
   ```bash
   node <skill>/scripts/copia_imprimible.mjs <root-del-deck> copia/ mapa.json [--skip prototipo]
   ```
   Cambia cada embed por `<img>` con el mismo lugar y tamaño, quita `data-build-in` y `data-video`, y pasa las rutas `assets/<blob>.<ext>` del deck HTML a `/_blob/<blob>`. Escribe `copia/project/deck.json` y `copia/project/slides/`.
4. **Publicar** `copia/` como un artifact Slides nuevo («NOMBRE · para imprimir») e instalar el mismo design system.
5. Anotar en el CONTEXTO el link de la copia, su versión y el comando para regenerarla.

Si el deck original es HTML, los assets están en su carpeta `assets/`: hay que subirlos también al artifact de la copia, y si alguno cambió de contenido desde que se subió, darle un blob id nuevo.

## 4. Deck HTML: modo `?print`

El reproductor de `assets/web-deck/` imprime directo desde el navegador:

1. Abrir `index.html?print` (servido con `python -m http.server`).
2. El reproductor arma todas las slides una debajo de otra, con cada animación en su estado final (`window.PRINT=1`), el video como su portada, las apps incrustadas con su `data-print-src` y los builds visibles.
3. Cuando aparece «Listo para imprimir», Ctrl+P → «Guardar como PDF». El tamaño de página ya es 1920×1080, sin márgenes y con fondos.

Las animaciones viejas sin `FINAL()` **no** sirven en este modo: Chrome pausa los timers de los iframes que están fuera de pantalla, así que se imprimen a medio armar (probado: un BMC salió con los marcos y sin contenido). El reproductor avisa qué slides las tienen. Hay dos salidas: pasarlas al patrón de `assets/embed-base.html`, o capturarlas una por una con `capturar_finales.mjs --ms 8000` (cada una se renderiza visible) y usar esas imágenes.
