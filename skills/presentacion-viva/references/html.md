# Deck HTML: cuando hay que incrustar una app

El formato normal es el artifact Slides. Se abandona solo cuando hay que **incrustar una app o un prototipo en vivo** dentro de una slide: el artifact no admite `<iframe>` y sus animaciones no tienen red ni reciben clics. El deck pasa a ser una carpeta HTML estática que se abre en local o se sube a cualquier hosting. Salió del deck del TPO Cellula (octubre 2026).

## Contenido
1. Antes de migrar
2. Exportar el deck del artifact
3. El reproductor (`assets/web-deck/`)
4. Controles de la presentación
5. Slide con la app incrustada
6. Imprimir
7. Probar y publicar
8. Trampas

## 1. Antes de migrar

Presentar el tradeoff y esperar el «dale»:

| Se gana | Se paga |
|---|---|
| La app real, usable, dentro de una slide | El artifact deja de ser la fuente de verdad: los cambios se hacen en la carpeta HTML |
| Clic para avanzar, barra, índice, ventana de presentador con notas y reloj | Se pierde el editor visual y el link de claude.ai |
| Las animaciones cargan la fuente de marca | Hay que elegir dónde publicarlo y mantenerlo |

**Alternativa sin migrar:** quedarse en el artifact con capturas o mockups (`references/mockups.md`) o un video de la app (`data-video`), y abrir la app en otra pestaña para la demo. Suele alcanzar.

## 2. Exportar el deck del artifact

1. Leer `project/deck.json` y todas las `project/slides/*.html` con `Artifact action:"read"` y `paths` (una sola llamada).
2. Bajar cada asset `/_blob/<id>` **de a uno**: `read` con `path: "<id>"` (32 hex). Con `paths` falla. La lista sale con `grep -oh '/_blob/[0-9a-f]*' slides/* | sort -u`.
3. Armar la carpeta: `deck.json`, `slides/`, `assets/` y copiar `assets/web-deck/` (index.html, player.js, player.css) de esta skill.
4. Reescribir las rutas de los assets (el archivo bajado ya trae la extensión):
   ```bash
   for f in assets/*; do b=$(basename "$f"); sed -i "s#/_blob/${b%.*}#assets/$b#g" slides/*; done
   grep -c '/_blob/' slides/* | grep -v ':0'   # tiene que quedar vacío
   ```
5. Copiar los colores de marca del `tokens.json` a las variables `:root` de `player.css`. Las fuentes y el título salen solos de `deck.json`.
6. Relevar qué usa el deck: `grep -oh '<x-[a-z]*' slides/* | sort | uniq -c`, y lo mismo con `data-build-in`, `data-transition`, `data-video` y `<table`. El reproductor cubre `x-embed`, video, tablas, builds `auto`, fade y magic (como fade). `x-connector`, `x-icon` y `x-shape` **no** están implementados: si aparecen fuera de un embed, reemplazarlos por SVG.
7. Hacer **antes** la prueba de impresión del artifact (`references/impresion.md`): si el PDF del artifact sale bien, queda como plan B.

## 3. El reproductor (`assets/web-deck/`)

Estático, sin build ni dependencias: lee `deck.json` y hace `fetch` de cada `slides/<id>.html`, así que necesita un servidor (en local: `python -m http.server 4321`).

- Escena de 1920×1080 escalada a la ventana, con los valores por defecto del formato Slides.
- `<x-embed>` → `<iframe sandbox="allow-scripts" srcdoc>` sin clics, con la fuente de marca inyectada.
- `<img data-video>` → `<video>` con la imagen como portada; un clic lo pausa.
- Monta solo la slide actual (las animaciones arrancan de cero al entrar) y hace un fundido de 0,4 s.
- **Número del pie automático** según `deck.json`: alcanza con editar `order`.
- `<aside>` = notas del orador (las muestra la ventana de presentador).

## 4. Controles de la presentación

| Control | Comportamiento |
|---|---|
| Clic en la slide | Avanza; en el tercio izquierdo, retrocede. Encima de un video, lo pausa |
| Deslizar (touch) | Horizontal de más de 60 px: siguiente o anterior |
| Barra flotante | Aparece al mover el mouse y se oculta a los 2,5 s con el cursor: anterior · «n / total» · siguiente · índice · presentador · pantalla completa |
| Índice (G) | Panel con las slides agrupadas por `sections`; Esc cierra |
| Teclado | → ↓ Espacio PgDn siguiente · ← ↑ PgUp anterior · Inicio/Fin · F pantalla completa · P presentador |
| URL | `#n` abre la slide n; `?print` abre el modo impresión |

**Ventana de presentador** (P): `?presenter` en otra ventana, con posición, notas, slide siguiente, reloj (R lo reinicia) y botones grandes. Se sincroniza en los dos sentidos por `BroadcastChannel`, así se maneja el deck desde la notebook mientras el proyector muestra la escena.

## 5. Slide con la app incrustada

Una slide común con un `<iframe>` nativo sin `sandbox`, fijado lo más grande posible (por ejemplo `left:64px; top:120px; width:1792px; height:920px`), con `data-print-src="assets/captura-app.png"` para la impresión.

- **Mientras el foco está en la app, los clics y las teclas van a la app.** Avisarlo en las notas: para seguir, usar la barra o la ventana de presentador.
- **Que el control remoto siga funcionando:** la app reenvía PgUp/PgDn al deck.
  - App en el **mismo origen** que el deck: `top.dispatchEvent(new KeyboardEvent('keydown', { key: e.key }))` en un `keydown` con captura.
  - App en **otro origen**: `parent.postMessage('deck:next' | 'deck:prev', '*')`, que el reproductor ya escucha.
- **Mismo origen**, que además evita problemas de cookies y de iframes: servir la app dentro de la carpeta del deck (compilarla con la ruta base `/demo/`) o con un rewrite o proxy del hosting que mande `/demo/*` a la app.
- **Navegador simulado:** si la demo abre cosas en otra ventana (login con OAuth, «abrir mi app», vista del invitado), envolverla en una página `demo.html` con pestañas propias, donde cada apertura es una pestaña dentro de la slide, más un botón «Reiniciar demo» que borra sus datos.
- La app no tiene que mandar `X-Frame-Options: DENY` ni un `frame-ancestors` restrictivo.
- Plan B sin internet, en las notas: volver a las slides de mockups o al video.

## 6. Imprimir

`index.html?print` arma todas las slides como páginas de 1920×1080, con las animaciones en su estado final, el video como portada y la app como su `data-print-src`. Cuando dice «Listo para imprimir»: Ctrl+P → «Guardar como PDF». Ver `references/impresion.md`.

## 7. Probar y publicar

- En esta variante **sí** se verifica en el navegador: servidor local, recorrer las slides, probar clic, barra, índice, presentador, la slide de la app y `?print`.
- **Hosting:** cualquier hosting estático sirve (GitHub Pages, Netlify, Vercel, Cloudflare Pages, el de la facultad). Preguntar cuál tiene el usuario. Solo hace falta algo más si la app tiene que quedar en el mismo origen (rewrite o proxy) o si el repo es privado.
- Después de publicar, verificar `/`, `deck.json`, una slide y el video con `curl -s -o /dev/null -w "%{http_code}"`, y que el JS publicado tenga el último cambio.

## 8. Trampas

- **Capturas del navegador integrado:** los iframes `srcdoc` se pintan con retraso en capturas en lote. Una animación que parece vacía suele estar bien: sacar otra captura suelta antes de corregir.
- **Clics de prueba sobre un iframe escalado** fallan en la herramienta del navegador: probar en zonas nativas (el título) o con `javascript_tool`.
- **Cambiar solo el `#n`** no recarga la página: el reproductor escucha `hashchange`.
- **Espacio sobre un botón con foco** lo vuelve a activar: los botones evitan el foco al hacer clic (`mousedown` → `preventDefault`).
- **Rutas en Git Bash:** variables con rutas que empiezan con `/` (por ejemplo `VITE_BASE=/demo/`) se convierten en rutas de Windows. Anteponer `MSYS_NO_PATHCONV=1`.
- **Rewrites y barra final:** en algunos hostings, un rewrite de `/demo/:path*` no cubre `/demo/` y da 404. Mapear `/demo/` (y cada subcarpeta con su barra) a su `index.html`.
- **CLIs que preguntan:** si un CLI de hosting se queda esperando una respuesta, correrlo sin interacción (`--yes`, `< /dev/null`) y revisar el resultado después.
- **Hooks de `markitdown`** bloquean leer `.html` con Read, `cat` o `head`. Para el markup exacto usar `grep`/`sed -n` o un script, y avisar que se saltea markitdown por la excepción de precisión.
