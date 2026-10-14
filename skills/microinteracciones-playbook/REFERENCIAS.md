# Referencias: implementación de referencia

Piezas que conviene construir al arrancar el movimiento de un sitio nuevo. Salen de una implementación real en **Astro 5 + React 18 + Tailwind 3.4** (`tailwindcss-animate`, `tailwind-merge` 3, Embla 8, GSAP 3.15, Vitest), usada en producción. Aquí van especificaciones, no código: cada pieza dice qué hace y qué adaptar a otro stack. Los nombres de archivo y de clases son sugerencias.

## Piezas

### Tokens de movimiento (`tailwind.config.ts` o `@theme`)

- **Qué hace:** `transitionDuration`: `press` 100 ms, `fast` 150, `base` 200, `enter` 280, `exit` 200. `transitionTimingFunction`: `out-ui`, `in-out-ui`, `drawer` (mismos valores del SKILL). `scale`: `press` 0.97, `enter-from` 0.96. Keyframes y animaciones: `fade-in(-up/-down)`, `slide-in-right/bottom`, `shimmer` (1.5 s lineal), `ken-burns` (20 s, escala 1 a 1.05), `shake`, y los de Parte B que apliquen (dígitos que ruedan, brillo único, destello al cambiar un valor). Activa `future.hoverOnlyWhenSupported: true` y el plugin `tailwindcss-animate`.
- **Adaptar:** los valores sirven tal cual en cualquier stack. En Tailwind v4 pasan a variables `@theme` (`--ease-*`, `--duration-*`) en CSS en vez de `tailwind.config.ts` (sin verificar contra la versión exacta). `hoverOnlyWhenSupported` es de v3.x; en v4 el hover ya se limita a `(hover: hover)` por defecto (sin verificar). `ken-burns` es movimiento de Parte B: proponer, no imponer.

### CSS global (`global.css`)

- **Qué hace:** `:focus-visible` global (outline 2 px con el token `--ring`, offset 2 px). `.mostrar-en-hover`: oculto solo con `(hover: hover) and (pointer: fine)`, siempre visible en táctil. `html:focus-within { scroll-behavior: smooth }`. Reglas del reveal: `.revelar-cargando` oculta `main`/`footer` desde el primer frame; `.revelar-activo [data-revelar-observado]:not([data-visible])` pone `opacity: 0`; con `[data-visible]` corre `revelar-entrada` (700 ms, `out-ui`, `backwards`, `translate` de 24 px y no `transform`, para no pisar el press/hover). `.link-ui`: subrayado por `background-size` que crece desde la izquierda en 150 ms.
- **Adaptar:** `--ring` es el color de foco del tema. Los nombres `data-revelar*`, `.link-ui` y `.mostrar-en-hover` se pueden renombrar, pero hay que **conservar la regla de atar el `opacity:0` al atributo observado** (ver las reglas anti-bug del SKILL).

### Reveal al entrar (`revelarAlEntrar.ts`)

- **Qué hace:** `IntersectionObserver` (umbral 0.15) sobre candidatos dentro de `main, footer`; marca `data-revelar` + `data-revelar-observado`, pone/quita `data-visible` (se repite al volver), escalona 60 ms con tope de 5 escalones, excluye header, diálogos, `aria-hidden` y `[data-sin-revelar]`, y evita animar dos veces un hijo de otro ya animado. Un `MutationObserver` marca el contenido que llega tarde (islas, filtros, skeletons reemplazados). Con View Transition (`pagereveal`) muestra sin animar lo ya visible. Al terminar pone `revelar-activo` y saca `revelar-cargando` en `<html>`.
- **Adaptar:** la red de seguridad (si el script no corre en 3 s, todo queda visible) va **inline en el layout base**, no en este archivo. `pagereveal` es del flujo Astro + View Transitions; en Next o Vite usar el router propio (sin verificar el equivalente). Las listas de candidatos y raíces dependen de cada sitio. Sin dependencias externas.

### Conteo de cifras (`contarAlEntrar.ts`)

- **Qué hace:** `animarConteo` cuenta de 0 a N en 1 s con ease-out cúbico (`requestAnimationFrame`); `iniciarConteo` observa `[data-contar]` con umbral 0.5 y anima **una sola vez**. El servidor ya renderiza el valor final: sin JS queda correcto.
- **Adaptar:** parametrizar prefijo y sufijo (`+`, `%`). En React, mejor un componente con `useEffect`. Es movimiento de Parte B.

### Desmontaje animado (`useDesmontajeAnimado.ts`)

- **Qué hace:** hook para overlays **custom** (sin Radix). Estados `open` / `closing` / `closed`; desmonta en `animationend` del propio nodo o por timeout de seguridad (`duracionSalidaMs` + 50 ms); reabrir durante la salida la cancela; `desmontar()` cierra al instante para Escape. Se usa con `data-state` y `onAnimationEnd`.
- **Adaptar:** React puro, portable tal cual. **No usarlo con Radix `Dialog`/`Sheet`**, que ya resuelven la salida.

### Skeletons (`skeleton.tsx`)

- **Qué hace:** `Skeleton` (shimmer 1.5 s lineal con degradado sobre `bg-muted`, `aria-hidden`), `SkeletonCarga` (`role="status"` con texto solo para lectores de pantalla), un skeleton por tarjeta con la misma forma que la tarjeta real (imagen con su proporción, para que el layout no salte) y uno para paneles.
- **Adaptar:** depende de un helper `cn` (wrapper de `tailwind-merge`), de la animación `shimmer` de los tokens y de los colores del tema. Los skeletons de tarjeta se rehacen con la forma de las tarjetas de cada proyecto.

### Tests de reglas de movimiento (`reglasMovimiento.test.ts`)

- **Qué hace:** tests con Vitest que leen archivos: sin `transition-all` en `.tsx`/`.astro`; foco visible global; reduced-motion no apaga las microinteracciones de forma global; controles de hover visibles en táctil; `.link-ui` con `background-size`; scroll suave; y que la UI no use `motion-safe:`, `motion-reduce:` ni `prefers-reduced-motion`.
- **Adaptar:** rutas y extensiones según el stack. Las dos últimas reglas **codifican el estilo Expresivo**: en Equilibrado o Mínimo se invierten (exigir `motion-safe`). Si un área (por ejemplo un panel de administración) queda fuera del estilo, excluirla explícitamente en el test. Sin Vitest, portar a la herramienta de tests del proyecto.
