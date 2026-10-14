# Plantilla: CONTEXTO-PRESENTACION.md

Guardar en la carpeta de la presentación dentro del proyecto. Actualizar después de cada publicación que cambie el orden, el contenido o las reglas.

```markdown
# Presentación «NOMBRE» — contexto para editar

> Grupo · materia · fecha de la exposición
> Fuente de verdad del contenido: RUTA AL DOCUMENTO
> Última actualización: FECHA

## 1. Piezas
| Pieza | Dónde | Formato |
|---|---|---|
| Deck (N slides) | URL del artifact (o carpeta HTML y su URL, si hubo que incrustar una app) | Artifact Slides de claude.ai / deck HTML |
| Copia imprimible | URL del artifact «· para imprimir» (solo si el PDF del deck salió mal) | Artifact Slides estático |
| Design system | URL | Instalado como project/ds/CARPETA/tokens.json |
| Teaser | carpeta del proyecto HyperFrames | renders/video.mp4 |

Impresión: PDF verificado en la versión N / copia imprimible regenerada en la versión N (comando para regenerarla).

## 2. Deck — estructura
Orden actual (versión N):
| Sección | Slides (id) — * = animación en loop |
|---|---|

Reparto de oradores: Orador 1 → diapos A–B (m:ss) · …

### Slides retiradas
| Slide | Retirada | Respaldo | Qué tenía |
|---|---|---|---|

### Plantilla de slide
Eyebrow, título, logo arriba a la derecha, isotipo de fondo, pie con número escrito a mano.

### Estilo (tokens de la marca)
Colores con su significado, tipografía, escala.

### Assets subidos (blob ids)
| Archivo | src |
|---|---|

### Cómo editar el deck
Reglas del formato, embeds opacos, sin reduced-motion, renumerar los pies, releer antes de publicar.

## 3. Pendientes
- [ ] Instalar la fuente de marca en la notebook que presenta
- [ ] Ensayo cronometrado
- [ ] Probar la impresión (PDF del artifact o `?print` del HTML) y revisar cada slide animada
- [ ] Plan B: PDF del deck y video local
```
