---
name: presentacion-viva
description: Arma, audita y mejora presentaciones como artifact Slides de claude.ai con el design system del usuario, poco texto, branding en cada slide y gráficos animados que entran solos y quedan vivos en loop, sin clics, y que igual se imprimen bien. Usala siempre que el usuario pida una presentación, un deck, diapositivas, una ppt para exponer, un pitch o la defensa de un TPO o trabajo práctico, o cuando quiera auditar, reordenar, animar, acelerar o frenar animaciones, agregar o quitar slides, armar slides de respaldo, sumar capturas o mockups de PC y celular, un teaser en video, repartir oradores, preparar qué decir en una slide o imprimir/exportar el deck a PDF, aunque no diga "Slides" ni "artifact". También cuando haya que incrustar una app o demo en vivo, que obliga a pasar el deck a HTML.
---

# Presentación viva

> **Estado:** usada de punta a punta en un deck real (TPO Cellula, octubre 2026), incluida la variante HTML con una app incrustada. Todavía no tiene evaluaciones formales y el modo impresión del reproductor HTML solo se probó en ese deck. Si algo falla, avisale al usuario y anotalo.

Produce decks que se presentan solos: cada slide dice una idea con un gráfico que se mueve, el texto queda en las notas del orador, la marca está siempre presente y todo se puede imprimir. Todo lo que sigue son decisiones que el usuario tomó o corrigió armando el deck de Cellula.

## Lo que el usuario espera de un deck

1. **Redacción formal e impersonal en las slides.** Nada de voseo en títulos ni textos. La excepción es lo que muestra el producto (capturas, pedidos a un agente, mensajes de la app): ahí manda la voz de la marca.
2. **Poco texto.** Palabras clave, datos y características. Si algo necesita una oración, va a las notas. Los que presentan saben el contenido de memoria; la slide es para el público.
3. **Cada slide justificada.** Tiene que responder a una sección de la fuente de verdad (el TPO, el informe, el brief). Si no tiene sección ni función en el relato, sobra.
4. **Marca en todas las slides.** Logo arriba a la derecha, isotipo muy tenue de fondo, colores y tipografía del design system, pie con número.
5. **Gráficos en lugar de texto.** Una lista se convierte en diagrama, un número en contador, una comparación en mapa o barras.
6. **Gráficos vivos.** Entran solos, sin clics, y después siguen moviéndose en loop sin desaparecer (ver «La lógica de los valores»).
7. **Imprimible siempre.** Aunque el deck esté vivo, tiene que poder imprimirse o exportarse a PDF y quedar bien. Cada animación tiene un estado final que cuenta la idea completa y ese es su estado por defecto. Ver `references/impresion.md`.

Además:
- **Nunca inventar datos.** Si un escenario no está en la fuente, se marca «ilustrativo».
- **Gráficos a escala y sin sesgo.** Un indicador circular es para porcentajes; una meta absoluta (USD 1.000, menos de 5 s) va como número o como barra contra una escala. Una barra que siempre llena hasta su propia meta no dice nada. No elegir los ejes de un mapa justo donde el producto saca 5: un profesor lo lee como trampa.
- **Nombres de ejemplo neutros.** En capturas, mockups y demos, no usar nombres de compañeros, del docente ni de gente conocida del curso; si hay dudas, preguntar.
- **Sin slogans de relleno.** Un cierre que solo repite la visión no suma: mejor una síntesis con datos o ir directo a preguntas.
- **Sin variantes para `prefers-reduced-motion`.** El usuario quiere que el deck se vea igual en todos los equipos.

## Formato: artifact Slides, y HTML solo para incrustar una app

- **Artifact Slides de claude.ai: el formato normal.** Fotos, capturas y mockups de PC o celular, animaciones embebidas y video entran ahí. Todo vive en claude.ai, con editor visual y exportes a PDF y PPTX.
- **Deck HTML: solo si hay que incrustar una app o un prototipo en vivo.** El artifact no admite `<iframe>` y sus animaciones no reciben clics. En ese caso se abandona el artifact: el deck se exporta a una carpeta HTML estática (reproductor de `assets/web-deck/`) y se sube a cualquier hosting estático. Antes, presentar el tradeoff: se pierde el editor del artifact y el link de claude.ai. Si alcanza con mostrar la app, la alternativa es quedarse en el artifact con capturas, mockups o un video de la app. Todo el procedimiento está en `references/html.md`.

## La lógica de los valores

Es el patrón de animación que el usuario aprobó y pidió repetir en todo el deck:

1. **Entrada:** los elementos aparecen de a uno (de izquierda a derecha, o en el orden del relato), cada uno con un pequeño salto.
2. **Permanencia:** una vez que aparecieron, no se van.
3. **Loop vivo:** siguen moviéndose en ciclo: ola de saltos, latido, fichas que circulan, LEDs que titilan.
4. **Reinicio al mostrarse:** cuando la slide aparece, la entrada vuelve a correr desde cero, así el público nunca la ve a mitad de camino.
5. **Estado final por defecto:** mientras la animación no corre (PDF, impresión, miniatura), se ve el cuadro final completo.

Lo que el usuario rechazó: animaciones que se borran y arrancan de nuevo cada N segundos (parpadean), apariciones por clic, movimiento muy rápido que distrae y movimiento tan lento que parece congelado. Los tiempos calibrados están en `references/animaciones.md`.

## Flujo de trabajo

### 1. Contexto

- Si existe un `CONTEXTO-PRESENTACION.md` en la carpeta del proyecto, leerlo antes que nada: tiene los ids, los blob ids de las imágenes, las reglas y los pendientes.
- Identificar la **fuente de verdad** (TPO, informe, brief). Si es PDF o DOCX, convertirla con la skill `markitdown` antes de leerla.
- Confirmar el **design system**: el que indique la sesión o el usuario. Usar sus colores, su tipografía y su logo oficial, sin inventar una estética propia.
- Datos del brief: audiencia, duración objetivo, cantidad de oradores y fecha. Si falta alguno, asumir algo razonable, decirlo en una línea y seguir.

### 2. Guion justificado

Antes de armar slides, escribir una tabla con: slide, sección de la fuente que la justifica, idea en una frase y gráfico que la va a mostrar. Ordenar para que **ninguna slide use un concepto que todavía no se explicó** (el error que más se repitió: un modelo de innovación que citaba el canal y el cobro antes de presentarlos, un zoom del modelo de negocio que mencionaba un paywall todavía no explicado). Agrupar en secciones del relato. Ver `references/narrativa.md`.

### 3. Crear el deck

Usar la herramienta Artifact con el tipo Slides y seguir sus instrucciones: crear desde el tipo, instalar el design system (su `tokens.json`) y escribir `project/deck.json` más un archivo por slide. Plantilla de slide de contenido:

```html
<section id="ID" data-transition="fade" style="background:BG;color:TXT;font-family:'FUENTE', Arial, sans-serif;padding:128px 128px 160px;display:flex;flex-direction:column;gap:40px">
<img src="/_blob/ISOTIPO" alt="" style="position:absolute;left:1440px;top:560px;width:480px;height:520px;opacity:0.05;object-fit:contain">
<div style="display:flex;flex-direction:column;gap:12px">
<p style="font-size:24px;font-weight:700;color:ACENTO;text-transform:uppercase;letter-spacing:3px">EYEBROW</p>
<h2 style="font-size:64px;font-weight:800;line-height:1.08;color:TINTA">Título que introduce el tema</h2>
</div>
<!-- gráfico: nativo, mockup o <x-embed> fijado debajo del título -->
<img src="/_blob/LOGO" alt="Marca" style="position:absolute;left:1592px;top:52px;width:200px;height:58px;object-fit:contain">
<div style="position:absolute;left:128px;bottom:56px;width:1664px;display:flex;justify-content:space-between;align-items:center"><p style="font-size:24px;color:GRIS">Fuente o pie</p><p style="font-size:24px;font-weight:700;color:ACENTO">NN</p></div>
<aside>Notas del orador (tiempo sugerido). Guion, concepto de la materia y respuestas preparadas.</aside>
</section>
```

### 4. Gráficos vivos

Para cada slide, decidir qué muestra el gráfico y armarlo con una animación embebida (`<x-embed>`) siguiendo la lógica de los valores. Empezar desde `assets/embed-base.html`, que ya trae el estado final por defecto y el reinicio al mostrarse. Antes de escribir una animación, leer `references/animaciones.md` (recetas, tiempos y técnicas) y `references/slides-tecnico.md` (límites del formato). Las trampas que más costaron:

- **Los embeds se ven opacos (fondo blanco).** Pintar el `body` del color de la slide y dibujar dentro todo lo que ocupe su área. Nunca superponer un embed a elementos nativos esperando verlos por debajo.
- **No cargan fuentes ni imágenes.** Los íconos van en SVG inline y el logo, si hace falta, con el SVG oficial inline. Las fotos y capturas van nativas, fuera del embed.
- **16 KB por embed y texto de 24 px o más.**
- **Alinear al píxel:** si mezclar elementos nativos y animación no alinea, dibujar el bloque entero dentro de la animación.

Para capturas de pantalla de un producto, usar los marcos de PC y de celular de `references/mockups.md`.

### 5. Notas, tiempos y oradores

- Cada `<aside>` lleva el tiempo sugerido entre paréntesis («(45 s)») y un guion corto.
- Sumar los tiempos y compararlos con el objetivo. Si se pasa, proponer qué recortar.
- Repartir oradores en bloques consecutivos, cortando en los límites de sección y con tiempos parecidos. Entregarlo **como una tabla en el chat** (orador, diapos, tema, tiempo), sin armar una página aparte: el usuario la pasa al grupo tal cual.

### 6. Publicar y verificar

1. Releer `project/deck.json` (y cada slide a tocar) justo antes de editar. Alguien pudo guardar desde el editor.
2. Editar con scripts Python escritos con la herramienta de archivos (no con heredoc: las comillas rompen bash) y que validen cada reemplazo (`assert s.count(old) == 1`).
3. Si cambió el orden, se agregó o se quitó una slide: correr `scripts/renumerar.py`. Los números del pie están escritos a mano.
4. Correr `scripts/check_embeds.py`, que revisa tamaño, cantidad, fondo, `reduced-motion`, estado final y sintaxis JS de cada embed.
5. Publicar todo en **una** llamada (`url`, `root`, `file_path` y `files`). Para borrar un archivo: `"project/slides/ID.html": null`.
6. No hacer capturas ni verificaciones visuales salvo que el usuario lo pida: el tipo Slides lo indica así, y el usuario revisa en su pantalla y manda capturas.
7. **Una vez por deck, y antes de la exposición, probar la impresión:** pedirle al usuario que exporte el PDF del artifact y revise las slides animadas. Si alguna sale vacía o a medio camino, generar la copia imprimible (`references/impresion.md`).

### 7. Documentar

Mantener `CONTEXTO-PRESENTACION.md` al día con la plantilla de `references/contexto-template.md`: formato, orden actual, qué anima cada slide, estado de la impresión, reglas, blob ids, reparto y slides retiradas. Antes de borrar una slide, guardar su HTML en `respaldo-slides/` dentro del proyecto y documentar qué tenía y cómo restaurarla.

## Preparar al orador

Cuando el usuario pregunte «qué es cada cosa» o «qué digo en esta slide»:

1. Leer la sección de la fuente que justifica la slide, para usar definiciones, fórmulas, metas y responsables exactos, no de memoria.
2. Explicar cada elemento de la slide en lenguaje simple: qué es, cómo se calcula, por qué esa meta y cómo se conecta con el resto del deck.
3. Dar un guion hablado del largo del tiempo sugerido, más una frase de pase a la slide siguiente.
4. Anticipar las preguntas probables, con respuesta corta y su fuente. Incluir lo que la slide no muestra pero la fuente sí (por ejemplo, los KPI que no entraron).
5. Ofrecer actualizar el `<aside>` de esa slide con el guion nuevo.

## Cómo trabajar con el usuario

- **Preguntas con tradeoffs:** cada opción dice qué se gana y qué se paga, y la recomendada va primera. Es una regla global del usuario.
- **Cambios amplios** (revisar todo el deck, reordenar): primero una tabla con lo propuesto y por qué; aplicar recién con su «dale», en una sola publicación.
- **Cambios puntuales** («más lento», «sacá esto»): aplicar directo y contar en una tabla corta qué cambió.
- **Velocidades:** «un X % más lento» se aplica a todos los tiempos en proporción, incluidos los desfases de las olas. «Un punto medio» es el promedio de las dos versiones, parámetro por parámetro.
- **Interpretar el feedback:**

| Dice | Hacer |
|---|---|
| «floja», «muy básica» | Rediseñar con un gráfico propio del tema y la lógica de los valores |
| «no quiero clickear» | Quitar build-ins por clic; mover la aparición dentro de la animación |
| «distrae», «va muy rápido» | Ciclos más largos, amplitud menor, transiciones suaves |
| «no se lee bien» | Revisar contraste y si la animación tapa algo (embed opaco) |
| «medio pete», «relleno» | Proponer quitarla o convertirla en síntesis con datos |
| captura de un deck viejo | Verificar si el gráfico existe; si no, reconstruirlo solo con datos de la fuente |
| «quiero imprimirlo» | Probar el PDF; si falla, copia imprimible o `?print` en HTML |

- Responder en español rioplatense en el chat; las slides, en registro formal.

## Skills que esta skill usa

| Necesidad | Skill |
|---|---|
| Leer la fuente (PDF, DOCX, PPTX) | `markitdown` |
| Teaser en video para insertar en el deck | `hyperframes` → flujo `product-launch-video` (voz, música y efectos con `media-use`) |
| Elegir la forma de un gráfico de datos | `dataviz` |
| Exportar a PowerPoint editable | `pptx` (las animaciones quedan estáticas) |

El video se inserta en una slide como `<img src="/_blob/PORTADA" data-video="/_blob/CLIP" data-video-sound="on" …>`: MP4 H.264 de 20 MB o menos, subido antes como asset. Al imprimir se ve la portada.

## Referencias

- `references/slides-tecnico.md`: formato de slide, límites de los embeds, transiciones magic, archivos del deck, publicación. Leerla antes de la primera edición de una sesión.
- `references/animaciones.md`: patrón base, tiempos calibrados, recetas por tipo de slide y técnicas. Leerla antes de escribir o ajustar una animación.
- `references/impresion.md`: estado final, prueba del PDF, copia imprimible del artifact y modo `?print` del HTML. Leerla al diseñar animaciones y antes de exportar.
- `references/mockups.md`: marcos de PC y celular, capturas desde la app, marcadores y transiciones. Leerla cuando haya capturas o pantallas de un producto.
- `references/narrativa.md`: estructura del relato, auditoría de orden, notas, oradores y slides de respaldo. Leerla al armar o reordenar el guion.
- `references/html.md`: deck HTML para incrustar una app (exportar, reproductor, controles, presentador, slide con la app, hosting y trampas). Leerla solo si hace falta una app en vivo.
- `references/contexto-template.md`: plantilla del documento de contexto.
- `assets/embed-base.html`: esqueleto de animación con estado final por defecto y reinicio al mostrarse.
- `assets/web-deck/`: reproductor estático del deck HTML (con modo `?print`).
- `scripts/renumerar.py`: reordenar, insertar, quitar y renumerar pies (artifact o HTML).
- `scripts/check_embeds.py`: validar slides y embeds antes de publicar (artifact o HTML).
- `scripts/capturar_finales.mjs`, `scripts/copia_imprimible.mjs`: capturar el estado final de cada animación y armar la copia imprimible.
- `scripts/capturas_app.mjs`: capturas de una app en tamaño de PC o de celular para los mockups.
