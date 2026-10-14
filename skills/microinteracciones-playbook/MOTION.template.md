# Movimiento

> Decisión de estilo registrada por la skill `microinteracciones-playbook`.
> Ninguna sesión futura debe volver a preguntarla ni contradecirla. Para cambiarla, editar este archivo con el usuario.

- **Estilo elegido:** {Expresivo | Equilibrado | Mínimo | Personalizado}
- **Fecha:** {AAAA-MM-DD}
- **Elegido por:** {nombre o usuario}

## Parámetros

| Parámetro | Valor | Nota |
|---|---|---|
| Entradas al scrollear | {sí / no} | Mínimo = no |
| Traslación de entrada | {24 px} | |
| Duración de entrada | {700 ms} | |
| Escalonado entre hermanos | {60 ms, máx. 5 escalones} | |
| ¿Se repite al volver? | {sí / no} | Expresivo = sí |
| Press | {≤100 ms, scale 0.97} | |
| Hover y foco | {≤150 ms} | |
| Salidas | {≤200 ms} | |
| Curva de entrada y respuesta (`out-ui`) | `cubic-bezier(0.23,1,0.32,1)` | |
| Curva de elementos ya en pantalla (`in-out-ui`) | `cubic-bezier(0.77,0,0.175,1)` | |
| Curva de drawers y sheets (`drawer`) | `cubic-bezier(0.32,0.72,0,1)` | |
| `prefers-reduced-motion` | {no cambia nada / `motion-safe` / solo se condiciona lo pesado} | Ver justificación abajo |
| Librería | {CSS nativo + View Transitions / GSAP en {página} / otra} | Peso gzip medido: {kB} |
| Zoom o parallax en imágenes | {no / sí en {dónde}} | Nunca dentro de `overflow-hidden` con fotos de producto u obras |

## Referencia de los otros estilos

| Parámetro | Expresivo | Equilibrado | Mínimo |
|---|---|---|---|
| Entradas | 24 px, 700 ms, escalonado 60 ms, se repiten | ≤280 ms, 4-8 px, una vez | ninguna |
| Press / hover / salidas | ≤100 / ≤150 / ≤200 ms | igual | igual |
| Reduced-motion | no cambia nada | `motion-safe` | `motion-safe` en lo poco que se mueva |
| Librería | CSS nativo primero | CSS nativo | CSS nativo |

## Justificación de reduced-motion

{Si es "no cambia nada": decisión del autor porque nada del sitio es pesado y el ajuste viene activo por defecto en Windows. Tradeoff de accesibilidad aceptado: usuarios con sensibilidad vestibular verán el movimiento. Movimiento pesado a condicionar con `motion-safe:`: {lista o "ninguno"}.}

## Tokens de movimiento (contrato)

`duration-press|fast|base|enter|exit`, `ease-out-ui|in-out-ui|drawer`, `scale-press`, keyframes: {ubicación en el proyecto, por ejemplo `tailwind.config.ts`}.

## Reglas que fijan esta decisión

- {Test o regla que lo hace cumplir, por ejemplo "0 `transition-all`", "sin `prefers-reduced-motion` en la UI de usuario"}
- Si `/review-animations` o Emil recomiendan algo que choca con lo de arriba, prevalece este archivo.

## Excepciones y avisos

- {Movimiento pesado detectado y cómo se condiciona, o "ninguno"}
