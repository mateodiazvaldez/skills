---
name: wireframe-a-sitio-playbook
description: Usar cuando hay un wireframe o un sitio básico que ya tiene el copy y las fotos definidos y hay que llevarlo a un sitio premium, moderno y accesible sin cambiar ese contenido; también cuando piden "pasá este wireframe a sitio", "hacelo premium", "modernizá o puli la web" o "auditá el branding del sitio".
---

# Wireframe a sitio: playbook

Fija el **orden**, las **puertas de decisión** y el oficio que no vive en otras skills para convertir un wireframe con contenido cerrado en un sitio premium. No enseña diseño ni animación: delega en `impeccable`, `redesign-existing-projects`, `web-design-guidelines` y `microinteracciones-playbook`.

**Regla madre:** el copy y las fotos del wireframe son la entrada fija. Se cambia cómo se presentan, nunca qué dicen ni qué muestran.

## Cuándo no usarla

- No hay copy ni fotos todavía: primero hay que definir contenido.
- Se pide reestructurar la información o reescribir textos: eso es otro trabajo; reportarlo, no hacerlo acá.

## Paso −1: entrada

- Wireframe en **código** (o sitio básico): seguir al Paso 0.
- Wireframe en **Figma o imagen**: implementarlo **fiel** primero (misma estructura, copy y fotos, sin decisiones de diseño). Con link de Figma: `figma:figma-design-to-code`.

## Paso 0: contexto (una vez por proyecto)

1. `CLAUDE.md`: si no existe, `init`. Si existe, buscar la sección "Fases" (`FASES.template.md`); si está, retomar desde la fase pendiente y **no repetir preguntas**.
2. Preguntar **una vez** dónde viven los archivos de agentes (`CLAUDE.md`, `PRODUCT.md`, `DESIGN.md`, `.claude/`): dentro del repo o en una carpeta padre fuera de él.
3. `impeccable teach` → `PRODUCT.md` (público, objetivo, personalidad, anti-referencias). `impeccable document` → `DESIGN.md`.
4. Copiar `FASES.template.md` al `CLAUDE.md` del proyecto.

## Fases (en orden; cada una cierra con su puerta)

| Fase | Qué cambia | Skills | Sale con |
|---|---|---|---|
| **1. Pulido** | Tokens (radios, sombras teñidas, ritmo de secciones, tipografía fluida), estados, foco, targets, bugs. Estructura intacta. | `redesign-existing-projects` + `impeccable audit`/`polish` + `web-design-guidelines` | Puntaje de auditoría antes/después |
| **1.5. Re-layout** | Composición libre por sección, mismo contenido y mismo orden. | `impeccable` (brand, layout, bolder) | 3 decisiones tomadas por el usuario |
| **2. Marca** | Coherencia de mensaje y de activos de marca. | `impeccable critique` con `PRODUCT.md`/`DESIGN.md` | Lista de arreglos aprobados |
| **3. Motion** | Microinteracciones y entradas. | `microinteracciones-playbook` (manda su `docs/MOTION.md`) | Test de reglas en verde |

**Puerta de cada fase:** verificación de `VERIFICACION.md` (navegador + Lighthouse sin regresión real, CLS 0), `astro check`/build sin errores y commit de punto de restauración. **Push solo si el usuario lo pide.**

### Fase 1.5: las tres preguntas

Con `AskUserQuestion`, vista previa ASCII y tradeoffs en cada opción: **tipo de hero** (split con foto enmarcada / full-bleed / actual pulido), **color y header** (header claro + pie oscuro / mantener superficies de marca), **patrón de la sección principal** (bento, lista numerada, carrusel mejorado). Recomendar una opción, no imponer.

Hilo visual: buscar un **referente físico del rubro** (una imprenta → barra de control de color CMYK sobre cada título; un estudio de arquitectura → cotas). Usarlo poco. Si se ve como adorno genérico (marcas de corte alrededor de una foto, por ejemplo), sacarlo.

### Fase 2: checklist de marca

- El eslogan del logo, el `<title>` y el H1 dicen lo mismo.
- Cada CTA está escrito para su sección (hero ≠ servicios ≠ header ≠ formulario); no un CTA único para todo.
- La **primera foto del hero** muestra el rubro real (producción, producto), nunca equipamiento genérico.
- Imagen para redes en **JPG** con el sistema actual, sin botones falsos (ver `IMAGENES-Y-FUENTES.md`; script `node scripts/og-image.mjs`).
- Nada que no se pueda afirmar hoy (certificaciones vencidas, premios viejos): un interruptor en `src/config.ts` que oculte la sección, sus links y las frases que lo mencionan.
- Links de navegación absolutos (`/#seccion`) para que funcionen desde páginas internas.

Problemas de copy o de fotos (fotos chicas, mensajes débiles) se **reportan** como pendientes para el cliente; se tocan solo con OK explícito o por un tema legal.

## Reglas transversales

- Toda pregunta al usuario lleva tradeoffs por opción.
- Tokens antes que componentes; borrar los componentes que quedan sin uso.
- Verificar con estilos computados, no a ojo: Tailwind v4 ignora sin avisar las clases con tokens inexistentes (`TAILWIND-V4.md`).
- Sin tests en el proyecto: un test de reglas con `node:test`, sin dependencias.
- Apagar todo servidor de preview que se levante.

## Errores comunes

| Error | En su lugar |
|---|---|
| Rediseñar textos o cambiar fotos "porque quedaban mejor" | Reportarlo como pendiente |
| Declarar una regresión de Lighthouse con una sola corrida | Corridas alternadas base/actual (`bash scripts/lighthouse-ab.sh`) |
| Foto del hero borrosa | `sizes` según la proporción con `object-cover` (`IMAGENES-Y-FUENTES.md`) |
| CLS por el cambio de fuente | Fallbacks con métricas ajustadas + `preload` |
| Imagen para redes en AVIF | JPG 1200×630 |
| Adornos genéricos alrededor de fotos | Referente físico del rubro o nada |

## Archivos de apoyo

- `VERIFICACION.md`: navegador, robustez sin JS y Lighthouse A/B.
- `IMAGENES-Y-FUENTES.md`: `sizes`, calidad LCP, carruseles, fuentes, imagen para redes.
- `TAILWIND-V4.md`: trampas de v4.
- `FASES.template.md`: estado de fases y decisiones para el `CLAUDE.md` del proyecto.
- `scripts/og-image.mjs`, `scripts/lighthouse-ab.sh`.
