# Slides de claude.ai: lo técnico

Lo que hay que saber del tipo Slides para no romper un deck. Todo esto salió de errores reales.

## Contenido
1. Formato de slide
2. Animaciones embebidas (`<x-embed>`)
3. Apariciones y transiciones
4. Archivos del deck y publicación
5. Agregar, quitar y reordenar
6. Video, exportes y deck compartido

## 1. Formato de slide

- Un archivo `project/slides/<id>.html` por slide, con **una** `<section id="<id>">` de 1920×1080 y, como último hijo, un `<aside>` de notas (4000 caracteres como máximo; cualquiera que abra el deck puede leerlas).
- Estilos inline de un subconjunto cerrado: px y colores hex o rgb. No hay clases, `<style>`, `margin`, `z-index` ni `var()`. La tabla completa está en `artifact-type/reference/format.md` del deck.
- Texto de **24 px o más**, en todas partes (pies, celdas, etiquetas).
- `position:absolute` fija un hijo a la slide. Los hijos que van después se pintan encima.
- Tablas nativas: fondo solo en `<tr>` (no en celdas), `width:%` en todas las celdas de la primera fila y `<b>` para negrita dentro de un `<td>`.
- Un `<svg>` nativo no carga fuentes: los textos van como `<p>` encima, no como `<text>`.
- Íconos nativos: `<x-icon name>` con nombres de una lista fija (Lock, Key, Users, Chart, Star, Lightning, CheckCircle, Warning, etc.). No funcionan dentro de un embed.

## 2. Animaciones embebidas (`<x-embed>`)

```html
<x-embed style="position:absolute;left:128px;top:290px;width:1664px;height:620px"><!doctype html><html>…</html></x-embed>
```

- **Hijo directo de `<section>` y fijado** (left/top/width/height). Dentro de un `<div>` da error.
- **16 KB como máximo** por embed y **8 por slide**.
- **Se ve opaco.** En el navegador del usuario el iframe pinta fondo blanco y tapa lo que tiene debajo. Por eso:
  - El `body` lleva el fondo de la slide (por ejemplo `background:#F4F6F3`), nunca `transparent`.
  - Dibujar dentro todo lo que ocupe su área: marcos, cajas y flechas.
  - No superponerlo a cajas nativas esperando verlas. Si hacen falta nativas debajo (por la transición magic), quedan tapadas a propósito.
  - Un isotipo de fondo que cae debajo del embed queda cortado: sacarlo de esa slide o dibujarlo dentro.
- **Sin red:** no carga fuentes web ni imágenes (`/_blob/…` tampoco). Entonces:
  - Fuente: declarar `font-family:"Fuente de marca","Segoe UI",system-ui,sans-serif`. Se ve con la fuente de marca solo si está instalada en la notebook que presenta, así que queda como pendiente instalarla.
  - Íconos: SVG inline (paths estilo Lucide).
  - Logo: el SVG oficial inline, sin metadatos (unos 5 KB). Se puede usar su variante oficial blanca para fondos oscuros, pero no redibujar ni recolorear la marca de otra forma.
- **No recibe clics:** todo tiene que correr solo.
- Animaciones con JS, CSS y Web Animations: sin librerías externas.
- Antes de publicar, extraer cada `<script>` y pasarlo por `node --check` (`scripts/check_embeds.py` lo hace).
- **Estado final por defecto:** todo visible sin JS; ver `references/impresion.md`.
- **Alinear al píxel:** el layout nativo en flujo estima alturas, y una animación al lado de una tarjeta nativa puede quedar corrida (pasó en una slide con perfil y cadena de valor). Si dos bloques tienen que coincidir en bordes, fijar los dos con coordenadas exactas o dibujar el bloque entero dentro de una sola animación.

## 3. Apariciones y transiciones

- `data-build-in` en hijos fijados aparece **con clic**. El usuario no quiere clics: la aparición va dentro de la animación. Existe un modificador `auto` pero no está documentado qué hace exactamente; si se usa (por ejemplo, marcadores sobre una captura que solo puede ser imagen nativa), hay que pedir que se verifique en modo presentación.
- `data-build-in` en hijos **no** fijados no funciona.
- **Transición magic:** `data-transition="magic"` en la slide que sale, y el mismo `id` en el elemento fijado de las dos slides. Solo funciona entre slides **consecutivas**. Si la segunda slide se dibuja con un embed, dejar debajo las cajas nativas con sus ids para que la transición funcione.

## 4. Archivos del deck y publicación

- `project/deck.json`: `order` (ids en orden), `sections` (`{"sN": {"description", "start"}}`; la primera empieza en la primera slide), `cover` (id de la portada o miniatura), `faces` y `designSystems`. Hay que conservar todas las claves que no se tocan. El editor lo normaliza (agrega `attachments`, reordena claves), y eso no es un problema.
- **Releer antes de publicar** el índice y las slides a tocar. Si el resultado dice que hay una versión más nueva, comparar tamaños o contenidos para ver qué cambió y aplicar los cambios sobre esa versión.
- Las copias que trae la lectura quedan en `<scratchpad>/artifact-files/<id>/`, y esa carpeta sirve como `root`.
- Publicar en **una** llamada: `url`, `root`, `file_path` (un archivo cambiado, ruta absoluta) y `files` (el resto, `{"project/slides/x.html": "project/slides/x.html"}`). Solo el índice si cambia.
- Si el servidor rechaza la publicación porque alguien guardó en el medio, releer lo que indique el rechazo, rehacer el cambio y volver a publicar.
- Hacer las ediciones con Python validando cada reemplazo (`assert s.count(old) == 1`). Para cambios repetidos en muchas slides, un único script.

## 5. Agregar, quitar y reordenar

`scripts/renumerar.py <root> [--insert ID --after ID] [--remove ID] [--order a,b,c]` actualiza `order`, las secciones y la portada, renumera los pies e imprime el mapa `files` listo para publicar. Detecta solo si `<root>` es un artifact (`project/`) o un deck HTML.

- **Agregar:** escribir `project/slides/<id>.html` y después correr el script con `--insert`.
- **Quitar:** guardar primero el HTML en `respaldo-slides/` del proyecto y documentarlo en el CONTEXTO; después correr el script con `--remove`, que pone el archivo como `null` en `files`.
- **Pies:** el script busca `<p style="font-size:24px;font-weight:700;color:#XXXXXX">NN</p></div>`, que es la convención de la plantilla. Las slides sin número (portada, video, cierre) quedan igual.
- Si se borra la slide que es `cover` o el `start` de una sección, el script pasa ese rol a la slide siguiente.

## 6. Video, exportes y deck compartido

- **Video en una slide:** `<img src="/_blob/PORTADA" data-video="/_blob/CLIP" data-video-sound="on" alt="…" style="…">`. MP4 H.264 de 20 MB o menos, subido antes como asset (`publish` con `asset: true`). Arranca solo al entrar a la slide.
- **PDF y PPTX** congelan los embeds y no está documentado en qué instante: pueden salir completos, a medio camino o vacíos. Por eso cada animación arranca en su estado final, se prueba el PDF una vez por deck y, si falla, se arma la copia imprimible. Todo en `references/impresion.md`.
- **Deck compartido por link:** quien lo tenga abierto ve cada publicación al instante. Avisarlo antes de cambios grandes.
- **Historial:** cada publicación es una versión, y para volver atrás se usa el historial del artifact. Anotar en el CONTEXTO el número de versión de cada hito.
