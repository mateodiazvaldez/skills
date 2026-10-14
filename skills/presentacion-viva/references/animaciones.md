# Animaciones vivas

## Contenido
1. Patrón base
2. Tiempos calibrados
3. Recetas por tipo de slide
4. Técnicas
5. Lo que no hay que hacer

## 1. Patrón base

Partir de `assets/embed-base.html`. La estructura es siempre la misma:

1. **Estado final por defecto (`FINAL()`)**: el CSS base deja todo visible, quieto y con los valores definitivos. Lo que entra animado solo se oculta mientras el `body` tiene la clase `anim`. Así se imprime y se exporta bien aunque la animación no corra (ver `references/impresion.md`).
2. **`window.PRINT`**: si está definido, se queda en `FINAL()` y no arranca nada.
3. **Registro de timers** (`_T`): para poder cortar todo y reiniciar.
4. **`BOOT()`**: agrega `anim`, deja todo en el estado inicial, programa la entrada y, al terminarla, arranca el loop.
5. **`IntersectionObserver`**: cuando la slide pasa de oculta a visible, llama a `_go()`, que limpia los timers y vuelve a correr `BOOT()`.
6. **Loop con estado estable:** el loop nunca vuelve a ocultar lo que ya entró. Solo agrega movimiento (saltos, latidos, fichas, destellos).

Las narrativas (un flujo con principio y fin, como un chat con el agente o un acceso que se revoca) pueden repetir la historia completa: es un relato, no un gráfico. Su `FINAL()` muestra el final de la historia completo: todos los mensajes, el recorrido dibujado, el escenario que importa.

## 2. Tiempos calibrados

Valores que el usuario aprobó después de pedir ajustes:

| Elemento | Valor |
|---|---|
| Aparición de un elemento con salto | 0,6–0,7 s, `cubic-bezier(.34,1.56,.64,1)` |
| Desfase entre elementos que entran | 0,3–0,45 s |
| Ola de saltos en loop (valores, panal) | ciclo de unos 3 s, desfase de 0,15–0,25 s, salto de 12–16 px |
| Ola en un gráfico decorativo de cierre (isotipo) | ciclo de 5 s, salto de unos 11 px |
| LEDs o destellos | 3 s, fundido suave (no parpadeo seco) |
| Fondo de panal que respira | 5–6 s, opacidad baja (de .05 a .2) |
| Ficha que viaja por un recorrido | 4 a 5 ms por px de recorrido |
| Contadores | 1,2–1,6 s con easing cúbico |
| Loop de una narrativa | 9–12 s |

Reglas: un ciclo de menos de 2 s distrae y uno de más de 7 s parece congelado. El fondo va más lento que el primer plano.

## 3. Recetas por tipo de slide

Cada una se usó en un deck real; adaptar los datos a la fuente.

| Slide | Gráfico |
|---|---|
| Problema | Tres etapas (crear → publicar → compartir); una ficha avanza y se frena donde está el dolor, y aparecen etiquetas de las fricciones. |
| Por qué ahora | Tarjeta nativa con la cita del mercado y, al lado, contador hasta la cifra y pictograma de 10 hexágonos con los que se llenan según el porcentaje; después saltan en ola. |
| Qué es / arquitectura | Nodos (agente, panel, app, invitados) alrededor de un hexágono central; una ficha recorre los casos (publicar, acceso permitido, acceso denegado en ámbar). |
| Alcance | Hexágono central con lo incluido adentro; lo excluido afuera, tachado, y en loop intenta entrar y rebota. |
| Misión, visión y valores | Tarjetas nativas para misión y visión; los valores como hexágonos con ícono que entran de izquierda a derecha y después saltan en ola. |
| Innovación (Doblin) | Los 10 tipos como panal, en 3 columnas; se encienden núcleo y apoyo, contador «6 de 10» y banner del diferencial que entra solo. |
| Segmento | Tarjeta del perfil con chips que entran con rebote; cadena Creador → Invitados → Inversor con un link que baja, aparecen avatares y crecen barras de ingreso. |
| Propuesta de valor | Frustraciones a la izquierda; cada una manda una ficha que cruza el hexágono de la marca (entra ámbar, sale verde) y aparece su aliviador; al final, la declaración. |
| TAM, SAM y SOM | Círculos anidados que crecen con contadores; después laten en cascada. |
| Modelo de cobro | Embudo de pasos (registro → invitar → prueba → pago) con barra de días y KR. |
| Business Model Canvas | Los 9 bloques se llenan en el orden de Osterwalder (1 → 9) con el contenido real; después circulan fichas verdes del cliente a ingresos y fichas ámbar de la operación a costos. |
| Zoom al motor | Tres cajas con flechas y una ficha que da la vuelta por un arco («ciclo viral»); la conclusión entra sola. |
| Hipótesis del MVP | La hipótesis se escribe sola, se abre en dos ramas (Uso / Pago) con barras hasta la meta, y un panal del MVP cuyo centro va alternando Construir → Medir → Aprender. |
| Capturas de pantalla | Imagen nativa (no entra en un embed) con anillos y hexágonos numerados que coinciden con las viñetas. |
| Revocación o seguridad | Panel con la acción a la izquierda y lo que ve el afectado a la derecha, con un cronómetro. |
| Conector o agente | Chat que tipea 3 pedidos y, a la derecha, el efecto en la plataforma. |
| Plan de prueba | Gantt con cursor que avanza y tarjetas de decisión al final. |
| Competencia | Mapa de posicionamiento (puntos que caen, el producto aterriza último, pulso de radar) y barras de totales; si preguntan, una slide de respaldo con la tabla completa, nativa. |
| KPI | Gauges que se llenan con contador y después saltan en ola. |
| De KPI a OKR | Un cálculo animado (por ejemplo 0,85³ ≈ 61 %) que alterna escenarios marcados como ilustrativos. |
| OKR | Barras que llenan hasta la meta; después cada KR salta y su marca destella. |
| Portada o pantalla de espera | Logo oficial dentro del embed sobre un panal que respira a pantalla completa, más tenue detrás del logo. |
| Preguntas | Isotipo vivo: el hexágono se dibuja, entran las pestañas y los servidores, las pestañas laten en ola y los LEDs titilan, con un halo de panal con máscara radial. |

## 4. Técnicas

- **Hexágono:** `clip-path:polygon(50% 0,100% 25%,100% 75%,50% 100%,0 75%,0 25%)`. Para el contorno, un div con el color de borde y otro adentro con el color de fondo, 3 px más chico.
- **Panal:** grilla con filas desplazadas medio hexágono; cada celda con `animation-delay` según `(fila+columna)×0,15–0,2 s` para lograr una ola diagonal.
- **Repetir una animación CSS:** quitar la clase, forzar un reflow (`el.offsetWidth`) y volver a ponerla.
- **No volver a disparar la entrada:** después de la entrada, pasar a una clase de estado estable (`st`) y aplicar el salto sobre ella (`st hop`), así no se repite el `pop`.
- **Recorridos:** `el.animate()` con keyframes de `transform: translate()` y `offset` proporcional al largo de cada tramo. Se puede animar `background` en la mitad para cambiar el color (ámbar → verde).
- **Dibujar un trazo SVG:** `pathLength="1"`, `stroke-dasharray:1`, `stroke-dashoffset` de 1 a 0 con una transición.
- **Fundido radial de un fondo:** `mask-image` con dos gradientes (un agujero alrededor del objeto principal y una elipse que se desvanece hacia los bordes) y `mask-composite:intersect` (`-webkit-mask-composite:source-in`).
- **Texto que se escribe solo:** un timeout por carácter (28–45 ms) y un cursor `<i>` que desaparece al final.
- **Contador:** `requestAnimationFrame` con easing `1-(1-p)^3` y `toLocaleString('es-AR')` para la coma decimal.
- **SVG con transform:** no aplicar transform CSS a un `<g>` que ya tiene atributo `transform` (lo reemplaza). Animar un hijo o usar opacidad.
- **Colores con significado** (los del design system): verde = activo o correcto; ámbar = en curso, atención o acceso denegado; rojo solo para acciones destructivas.

## 5. Lo que no hay que hacer

- Usar `setInterval(run, N)` donde `run` borra todo y vuelve a empezar: parpadea.
- Poner apariciones por clic.
- Ocultar elementos en el CSS base (`opacity:0` fuera de `.anim`): si la animación no corre, la slide se imprime vacía.
- Usar `@media (prefers-reduced-motion)`: el usuario lo pidió explícitamente.
- Dejar bordes rectos visibles en un fondo animado: fundirlo o encuadrarlo.
- Superponer el embed a elementos nativos.
- Usar textos de menos de 24 px o fuentes sin respaldo.
- Hacer un gráfico que sesga la lectura (ejes elegidos para ganar) o inventar datos.
- Usar un indicador circular para algo que no es un porcentaje (USD 1.000, menos de 5 s): queda siempre lleno y no dice nada. Mostrarlo como número grande o como barra contra una escala con la meta marcada.
- Llenar una barra exactamente hasta su propia meta: el público ve siempre «100 %». Si no hay dato real, mostrar la escala completa y marcar dónde está la meta.
