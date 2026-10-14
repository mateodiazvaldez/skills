# Manejo de Plantillas LaTeX

Referencia para la Fase 2 del skill `md-to-latex`.

---

## Principio fundamental

La plantilla define el "envoltorio" del documento. El contenido del Markdown va adentro.
**Nunca inventés ni simplificués el prólogo** — copialo de la plantilla y adaptá solo
los valores que son específicos del nuevo documento.

---

## Qué extraer de la plantilla

### 1. Clase de documento y opciones

```latex
% Copiar exactamente, incluyendo todas las opciones
\documentclass[11pt, a4paper]{article}
```

### 2. Bloque de paquetes

Copiar **todos** los `\usepackage`, en el mismo orden. El usuario los puso por una razón:
algunos pueden tener dependencias de orden o configuraciones implícitas.

```latex
% Ejemplo: copiar todo el bloque tal como está
\usepackage[T1]{fontenc}
\usepackage[utf8]{inputenc}
\usepackage[spanish]{babel}
% ... etc.
```

### 3. Configuración de página y fuentes

```latex
% Márgenes
\geometry{top=2.5cm, bottom=2.5cm, left=2cm, right=2cm}

% Fuentes (si usa fontspec u otro paquete de fuentes)
\setmainfont{...}
\setsansfont{...}

% Colores personalizados
\definecolor{MiColor}{RGB}{0, 102, 204}
```

### 4. Macros y comandos personalizados

Copiar **todos** sin excepción. Incluso si no aparecen en el Markdown, pueden ser usados
en el prólogo o en configuraciones.

```latex
\newcommand{\mi_macro}[1]{\textbf{\color{MiColor}#1}}
\renewcommand{\arraystretch}{1.3}
```

### 5. Configuración de encabezado y pie (fancyhdr)

Copiar la configuración de `fancyhdr` completa. Si el número de hito, materia, o fecha
aparece en el encabezado/pie, actualizarlos para el nuevo documento.

```latex
\pagestyle{fancy}
\fancyhf{}
\fancyhead[L]{\textbf{Materia}}
\fancyhead[R]{Hito N}           % ← actualizar N
\fancyfoot[C]{\thepage}
```

### 6. Carátula / página de título

La carátula es el elemento más personalizable. Copiá la estructura exacta y actualizá
los campos del nuevo documento:

| Campo | Qué actualizar |
|---|---|
| Título / nombre del trabajo | Según el `# Encabezado` del Markdown |
| Número de hito o entrega | Según corresponda |
| Fecha | Fecha actual o la indicada en el Markdown |
| Subtítulo / descripción | Según el Markdown |
| Autores / matrícula | Solo si el usuario los proporciona |
| Logo / imagen | Mantener igual que en la plantilla |

Si no tenés información para un campo (ej: fecha), dejá el valor de la plantilla o
poné un comentario `% COMPLETAR: fecha de entrega`.

---

## Estructura del documento final con plantilla

```latex
% ─── PRÓLOGO (copiado de la plantilla, adaptado) ───────────────────────────
\documentclass[...]{...}
% paquetes
% colores, fuentes, márgenes
% macros
% configuración fancyhdr
% ────────────────────────────────────────────────────────────────────────────

\begin{document}

% ─── CARÁTULA (estructura de la plantilla, campos adaptados) ────────────────
\begin{titlepage}
  ...
\end{titlepage}
% ────────────────────────────────────────────────────────────────────────────

\newpage
\tableofcontents  % solo si el documento tiene ≥ 5 secciones o si la plantilla lo tenía
\newpage

% ─── CONTENIDO (convertido desde el Markdown) ───────────────────────────────
\section{...}
...
% ────────────────────────────────────────────────────────────────────────────

% ─── REPORTE DE CONVERSIÓN ──────────────────────────────────────────────────
%% ... (ver SKILL.md)
% ────────────────────────────────────────────────────────────────────────────

\end{document}
```

---

## Casos especiales

### La plantilla tiene TOC y el nuevo doc es más corto

Mantener el `\tableofcontents` de todas formas — si el documento compilado queda raro,
el usuario puede decidir quitarlo. No tomés esa decisión vos.

### La plantilla usa paquetes poco comunes

No los elimines. Si un paquete claramente choca con otro (error de compilación esperado),
agregá un comentario explicando la situación en el Reporte de cambios.

### La plantilla tiene secciones de contenido fijas

Por ejemplo, una página de "Declaración de autoría" o similar. Copiala tal como está
en la plantilla. Si el Markdown no la menciona, igual incluirla (el usuario la puso
en la plantilla a propósito).

### El Markdown tiene una sección que no existe en la plantilla

Convertirla normalmente. La plantilla dicta el formato, no el contenido.
