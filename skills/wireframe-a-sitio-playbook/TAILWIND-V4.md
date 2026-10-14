# Trampas de Tailwind v4

| Trampa | Síntoma | Qué hacer |
|---|---|---|
| Clase con token inexistente (`hover:bg-(--color-que-no-existe)`, `ring-primary`, `font-montserrat` con mayúscula distinta) | Falla **sin aviso**: el hover deja el fondo transparente, el foco no se ve | Validar con `getComputedStyle` (ver `VERIFICACION.md`); grep de clases contra el `@theme` |
| `@theme` no tiene namespace de duración | `duration-press` no existe | Variables en `:root` + `@utility duration-press { transition-duration: var(--duration-press); }` |
| El namespace `--text-*` es **tamaño de fuente** | `text-primary` con `--text-primary: <color>` no pinta nada | Colores en `--color-*`, o usar `text-(--text-primary)` |
| `--spacing-*` genera utilidades de tamaño | `--spacing-header-h: 72px` → `h-header-h`, `py-*`, etc. | Útil para tokens de layout; nombrar sin choques |
| `hover:` ya va condicionado a `(hover: hover)` | No hace falta otra media query para táctiles | Solo en CSS plano agregar `@media (hover: hover) and (pointer: fine)` |
| `translate`/`scale` son propiedades separadas (no `transform`) | Una transición de reveal sobre `translate` pisa `hover:-translate-y-1` | Entradas con `@keyframes` y `animation-fill-mode: backwards`: al terminar, el elemento recupera su propio `translate` |
| Clases que solo aparecen en scripts externos | Un widget de terceros con clases de Tailwind no toma estilos | Tailwind solo genera las clases presentes en el código fuente; estilos inline en el widget |
| `canonical classes` del IDE (`rounded-[2px]` → `rounded-xs`, `aspect-[4/3]` → `aspect-4/3`) | Avisos del plugin | Usar la forma canónica |
