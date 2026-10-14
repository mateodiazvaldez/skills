---
name: md-to-latex
description: |
  Convierte documentos Markdown (.md) a LaTeX (.tex) generando el archivo directamente.
  Usá esta skill cuando el usuario quiera pasar, convertir, transformar, traspasar o migrar
  un archivo Markdown (.md) a LaTeX (.tex), o cuando mencione "convertir a latex", "pasar
  a tex", "quiero el latex de este markdown", o pida generar un .tex a partir de un .md.
  La skill respeta plantillas .tex de referencia si son proporcionadas (copiando prólogo,
  encabezados, pies de página, fuentes, márgenes y macros), y preserva el contenido
  íntegramente. También aplica para convertir partes de documentos Markdown a LaTeX.
---

# Skill: Markdown → LaTeX

Convierte documentos Markdown a archivos `.tex` listos para compilar, respetando plantillas
si se proporcionan y preservando el contenido al 100%.

---

## Proceso (3 fases obligatorias)

### FASE 1 — Relevamiento inicial

Antes de escribir una sola línea de LaTeX, recolectá la siguiente información:

**1. Archivos de entrada:**
- El archivo `.md` a convertir (obligatorio).
- Una plantilla `.tex` de referencia (opcional). Si el usuario no la mencionó explícitamente,
  **no buscarla por tu cuenta**: la plantilla es algo que el usuario provee conscientemente.

**2. Nombre de salida:**
- Guardarlo en la misma carpeta que el `.md`, con el mismo nombre base y extensión `.tex`.
- Si el usuario quiere un nombre distinto, usarlo.

**3. Lectura completa del Markdown:**
- Leé el `.md` completo antes de empezar a convertir. No conviertas por secciones sin haber
  visto el documento entero, para poder decidir qué entornos LaTeX usar en cada caso.

---

### FASE 2 — Análisis de plantilla (solo si fue proporcionada)

Si el usuario proporcionó una plantilla `.tex`, leela completa y extraé los siguientes elementos.
Ver `references/template-handling.md` para instrucciones detalladas.

**Elementos a extraer y reutilizar:**
- `\documentclass` con todas sus opciones
- Bloque de paquetes (`\usepackage`)
- Definiciones de colores, fuentes, márgenes (`\geometry`, `\setmainfont`, etc.)
- Macros y comandos personalizados (`\newcommand`, `\renewcommand`, etc.)
- Configuración de `fancyhdr` (encabezado y pie de página)
- Carátula / página de título (adaptar los campos al nuevo documento: título, fecha, etc.)
- Cualquier otra configuración del prólogo

**Regla fundamental de plantillas:** Copiá el prólogo de la plantilla tal como está,
adaptando solo los campos que correspondan al nuevo documento (título, número de hito,
fecha, autores, etc.). No simplifiques ni omitas paquetes o comandos aunque creas que no
se usan — el usuario los puso por una razón.

---

### FASE 3 — Conversión

Convertí **todo** el contenido del Markdown sin omitir ni resumir nada.
Ver `references/conversion-rules.md` para las reglas de conversión detalladas.

**Principios clave:**

- **Fidelidad total del contenido**: Cada párrafo, cada fila de tabla, cada ítem de lista
  debe aparecer en el `.tex` con la redacción exacta del original. Si necesitás reformatear
  algo por razones técnicas (ej: una tabla excesivamente ancha), dejá el contenido intacto
  y documentá el cambio en el **Reporte de cambios**.

- **Placeholders para contenido no convertible**: Imágenes en base64, HTML inline,
  o cualquier elemento que no se puede representar directamente en LaTeX debe convertirse
  en un placeholder comentado. Ver `references/conversion-rules.md` sección "Placeholders".

- **Caracteres especiales**: Escapar siempre antes de escribir celdas o párrafos.

---

### FASE 4 — Verificación y entrega

Antes de dar por convertido y guardar el formato final de `.tex`, **siempre debés verificar visualmente el PDF generado** y revisar logs:

#### Verificación visual y compilación
- [ ] Creá una carpeta llamada `test` (si no existe) en el directorio de destino.
- [ ] Compilá el archivo `.tex` a PDF indicando la carpeta de salida (ej: `run_command` con `pdflatex -output-directory=test archivo.tex`) para evitar ensuciar la carpeta con archivos auxiliares (`.aux`, `.log`, etc.).
- [ ] Revisá los logs en busca de advertencias tipo "Overfull \hbox" en las tablas.
- [ ] Es **PAGO OBLIGATORIO** verificar si las áreas tabulares se salen de los márgenes previstos. Validá que la sumatoria de las celdas `p{Xcm}` sea menor al recuadro completo del texto (en A4 con márgenes de 2.5cm, equivale a 16cm brutos, de los cuales restan ~0.4cm de tabcolsep de padding sumado por cada columna extra. Suma recomendada para tablas es de `14.5cm`).
- [ ] Si las tablas o estructuras rompen el PDF o se cruzan con el límite de página, reducí los tamaños y compilalo hasta corregirlo.

#### Integridad de contenido
- [ ] Cantidad de secciones en `.tex` == cantidad en `.md`
- [ ] Cada tabla tiene exactamente las mismas filas que en el `.md`
- [ ] Ningún ítem de lista fue omitido
- [ ] Todas las referencias/bibliografía están incluidas

#### Calidad LaTeX
- [ ] El archivo empieza con `\documentclass` y termina con `\end{document}`
- [ ] Todas las tablas tienen anchos explícitos (`p{Xcm}`) que sumen ~16–17 cm
- [ ] Los `\begin{longtable}` tienen `\endfirsthead` y `\endhead`
- [ ] Los caracteres especiales están escapados fuera de los separadores de tabla

#### Consistencia con plantilla (si hubo plantilla)
- [ ] Prólogo idéntico a la plantilla (adaptando solo campos del nuevo documento)
- [ ] Macros y comandos personalizados presentes
- [ ] Encabezado y pie de página iguales a la plantilla

Si algún ítem falla → corregirlo antes de guardar.

---

## Reporte de cambios

Al **final del archivo `.tex`**, agregá un bloque de comentarios con el siguiente formato:

```latex
%% ============================================================
%% REPORTE DE CONVERSIÓN MD → LaTeX
%% ============================================================
%%
%% PLACEHOLDERS UTILIZADOS:
%%   - [IMAGEN] hito2_imagen1.png  → Diagrama de flujo del sistema
%%   - [IMAGEN] hito2_imagen2.png  → Captura de pantalla del panel de control
%%
%% CAMBIOS RESPECTO AL MARKDOWN ORIGINAL:
%%   - Sección 3.2, tabla "Comparación de algoritmos": las columnas "Descripción"
%%     y "Ventajas" se fusionaron en una columna "Descripción / Ventajas" para
%%     que la tabla entre dentro de los márgenes de la página.
%%
%% ELEMENTOS OMITIDOS / NO CONVERTIBLES:
%%   - Ninguno
%%
%% ============================================================
```

Si no hubo cambios en alguna categoría, escribí `Ninguno`.
Si no se usaron placeholders, escribí `Ninguno`.

---

## Archivos de referencia

- `references/conversion-rules.md` → Reglas de conversión para cada elemento Markdown
- `references/template-handling.md` → Cómo analizar y reutilizar una plantilla `.tex`
