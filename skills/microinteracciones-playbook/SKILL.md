---
name: microinteracciones-playbook
description: Usar cuando el usuario pide agregar microinteracciones, animar una pantalla, hacer que un sitio se sienta más vivo, auditar el motion o revisar las animaciones, antes de escribir o criticar cualquier animación, transición o efecto de scroll en un proyecto web.
---

# Microinteracciones playbook

Fija el **flujo** y el **estilo de movimiento por defecto** del usuario para todos sus sitios. No enseña a animar: eso lo hacen las skills de Emil Kowalski (ver "Instalación base"). Si hay choque entre ambas, manda el estilo elegido en el proyecto.

## Paso 0: estilo del proyecto (una vez por proyecto)

1. Buscar `docs/MOTION.md` o una sección "Movimiento" en `CLAUDE.md`. Si existe: usar esos valores, **no preguntar** y pasar al Flujo.
2. Si no existe, preguntar con `AskUserQuestion` (una pregunta, 4 opciones, siempre con qué gana y qué paga cada una):

| Opción | Gana | Paga |
|---|---|---|
| **Expresivo (recomendado)**: preset de abajo | Entradas notorias, el sitio se siente vivo y premium | Más movimiento total; pantallas densas pueden cansar; ignora `prefers-reduced-motion` |
| **Equilibrado**: Emil puro (entradas ≤280 ms, 4-8 px, reveal una vez, `motion-safe`) | Rápido, sobrio, accesible por defecto | Las entradas casi no se perciben |
| **Mínimo**: solo press, hover, foco, skeletons y estados; sin entradas al scrollear | Cero riesgo de molestar, menos peso y mantenimiento | Sitio más plano |
| **Personalizado**: parte de Expresivo y se ajusta cada parámetro | Control total | Más decisiones y tiempo |

3. En la descripción de Expresivo incluir **siempre** esta nota: es un tradeoff de accesibilidad; usuarios con sensibilidad vestibular verán el movimiento aunque tengan activado "reducir movimiento". Si el sitio tiene movimiento pesado (parallax grande, loops, zooms amplios), avisar y proponer condicionar solo eso con `motion-safe:`.
4. Personalizado: preguntar parámetro por parámetro, cada uno con su default Expresivo y sus tradeoffs, en **dos rondas** (el límite de la herramienta es 4 preguntas por llamada): ronda 1 = distancia y duración de entrada, escalonado, ¿se repite al volver?, ¿respeta reduced-motion?; ronda 2 = ¿CSS nativo o GSAP?, ¿zoom/parallax en imágenes?
5. **Registrar la decisión** copiando `MOTION.template.md` a `docs/MOTION.md` del proyecto, con los valores concretos de todos los parámetros y la fecha. Ninguna sesión futura vuelve a preguntar ni a contradecirlo.

## Preset Expresivo (valores por defecto)

- **Entradas al scrollear:** fundido + traslación 24 px, 700 ms, escalonado 60 ms entre hermanos. Aparece al entrar al viewport, se va al salir y **vuelve a animarse al regresar** (no "una sola vez").
- **Respuesta:** press ≤100 ms con `scale 0.97`; hover y foco ≤150 ms; salidas ≤200 ms.
- **Curvas:** `out-ui` `cubic-bezier(0.23,1,0.32,1)`; `in-out-ui` `cubic-bezier(0.77,0,0.175,1)`; `drawer` `cubic-bezier(0.32,0.72,0,1)`. Nunca `ease-in` para entrar.
- **`prefers-reduced-motion`: no cambia nada.** Sin `motion-safe:`, sin reglas globales, sin `matchMedia`; los carruseles no se detienen. Motivo declarado por el autor: nada del sitio es pesado y, en su experiencia, el ajuste viene activo en Windows y apagaba todas las entradas. Es una decisión suya, no un hecho a defender.
- **Librerías:** CSS nativo + View Transitions (0 kB) primero. Antes de sumar una dependencia, medir peso gzip y justificar (referencia: motion/mini 4 kB, Motion 28-43 kB, GSAP 28-46 kB, dotLottie +496 kB wasm). GSAP/ScrollTrigger solo en la página que lo necesita, cargado ahí y con un test que lo fije.
- **Llamativas puntuales (Parte B):** View Transition de foto catálogo→ficha, conteo de cifras, dígitos que ruedan, brillo único en logros, zoom lento del hero. **Proponer, no imponer.**

## Flujo (orden fijo)

a. Sin inventario: correr `find-animation-opportunities` e `improve-animations` (solo lectura) y armar el inventario Parte A (microinteracciones) / Parte B (llamativas), con prioridad P1-P3 por pantalla.
b. Contrato de tokens en el sistema del proyecto (Tailwind u otro): `duration-press|fast|base|enter|exit`, `ease-out-ui|in-out-ui|drawer`, `scale-press`, keyframes.
c. Fundaciones primero (tokens, `:focus-visible` global, `hoverOnlyWhenSupported`, primitivos de UI, skeletons); después pantallas por fases, con TDD y tests de reglas (0 `transition-all`).
d. **Invocar `animate` para CADA animación nueva**, sin excepción: ni una sola vez compartida para "botones y tarjetas", ni "de memoria" desde la spec. Fallo real: el asistente no la invocó hasta que se lo cuestionaron.
e. Cerrar pidiéndole al usuario que corra `/review-animations` (tiene `disable-model-invocation`: el asistente no puede correrla ni simular que la corrió). Si un hallazgo choca con el estilo elegido (por ejemplo "reveal una vez" o `motion-safe`), citar la decisión de `docs/MOTION.md` en vez de aplicarlo.
f. Si Emil recomienda algo que choca con el estilo elegido, avisar en una línea y seguir el estilo.

## Reglas anti-bug (valen para todos los estilos)

- El CSS que oculta (`opacity:0`) se ata al atributo que el script **realmente observa** (`data-revelar-observado`), nunca al declarativo (`data-revelar`). Si no, lo no observado queda invisible para siempre (bug real: fotos que quedaban invisibles).
- Todo lo que se oculta antes de revelarse necesita red de seguridad: sin JS, o si el script no corre en ~3 s, queda visible (ver `REFERENCIAS.md`, `revelarAlEntrar.ts`).
- Nunca `transition-all`. Solo animar transform, opacity y colores.
- No recortar obras de arte ni fotos de producto: animar el marco completo, sin clip-path, zoom >1 ni parallax dentro de `overflow-hidden`.
- Memoizar plugins de carrusel (una referencia nueva por render reinicializa Embla en bucle) e instanciar `Intl.DateTimeFormat` a nivel módulo.
- `tailwind-merge` puede pisar clases de color del componente padre: testear que el estado visual (por ejemplo "reloj rojo") realmente se aplica.
- No apilar mecanismos de overlay: Radix `Dialog`/`Sheet` ya traen focus trap y scroll lock.
- Las acciones de teclado no esperan animaciones; toda animación es interrumpible.

## Instalación base (se referencia, NO se copia: es de otro autor)

```bash
npx skills add emilkowalski/skills -s animate improve-animations review-animations find-animation-opportunities emil-design-eng
```

## Archivos de apoyo

- `MOTION.template.md`: lo que se genera en `docs/MOTION.md` de cada proyecto.
- `REFERENCIAS.md`: implementación de referencia (tokens, CSS global, reveal, conteo, desmontaje animado, skeletons y tests de reglas) y qué adaptar a cada stack.

## Errores comunes

- Elegir un estilo sin preguntar, o preguntar de nuevo cuando ya hay `docs/MOTION.md`.
- Aplicar `motion-safe:` o "reveal una vez" por inercia de Emil en un proyecto Expresivo.
- Implementar la animación sin invocar `animate`, o dar por cerrado el trabajo sin pedir `/review-animations`.
