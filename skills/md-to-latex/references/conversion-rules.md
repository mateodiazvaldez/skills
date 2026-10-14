# Reglas de Conversión: Markdown → LaTeX

Referencia para la Fase 3 del skill `md-to-latex`.

---

## Estructura del documento (sin plantilla)

Cuando no hay plantilla, usar esta estructura base:

```latex
\documentclass[11pt, a4paper]{article}
\usepackage[T1]{fontenc}
\usepackage[utf8]{inputenc}
\usepackage[spanish]{babel}
\usepackage[top=2cm, bottom=2cm, left=2.5cm, right=2.5cm]{geometry}
\usepackage{fancyhdr}
\usepackage{longtable}
\usepackage{booktabs}
\usepackage{array}
\usepackage{float}
\usepackage{hyperref}
\usepackage{graphicx}
\usepackage{xcolor}

\begin{document}

% Contenido...

\end{document}
```

---

## Encabezados

| Markdown | LaTeX |
|---|---|
| `# Título` | `\section{Título}` |
| `## Título` | `\subsection{Título}` |
| `### Título` | `\subsubsection{Título}` |
| `#### Título` | `\paragraph{Título}` |

Limpiar backslashes escapados: `## 1\. Título` → `\subsection{1. Título}`

---

## Énfasis de texto

| Markdown | LaTeX |
|---|---|
| `**texto**` | `\textbf{texto}` |
| `*texto*` | `\textit{texto}` |
| `***texto***` | `\textbf{\textit{texto}}` |
| `` `código` `` | `\texttt{código}` |
| `~~tachado~~` | `\sout{texto}` (requiere `ulem`) |

---

## Tablas

### Elección de entorno

| Situación | Entorno |
|---|---|
| Tabla puede superar una página | `longtable` |
| Tabla corta (claramente ≤ 1 página) | `tabular` dentro de `\begin{table}[H]` |
| Duda → usar | `longtable` |

### Anchos de columna

El ancho imprimible en A4 con márgenes de 2.5 cm a cada lado es **~16 cm**.
Los anchos de columna deben sumar **~15.5–16 cm** (los separadores `|` ocupan el resto).

Tipos de columna:
```latex
% Texto largo → raggedright con ancho explícito
>{\raggedright\arraybackslash}p{4cm}

% Texto corto centrado
>{\centering\arraybackslash}p{2cm}

% ID / código / negrita centrada
>{\centering\arraybackslash\bfseries}p{1.2cm}

% Monoespaciado
>{\ttfamily\raggedright\arraybackslash}p{3.5cm}
```

**Nunca usar** `l`, `r`, `c` sin `p{Xcm}` en columnas con texto variable — producen
desbordamiento. Solo son aceptables para columnas garantizadas como muy cortas (ej: un número de una cifra).

### Estructura longtable (siempre incluir `\endfirsthead` y `\endhead`)

```latex
\begin{longtable}{|>{\raggedright\arraybackslash}p{3cm}|>{\raggedright\arraybackslash}p{12.5cm}|}
    \hline
    \textbf{Col 1} & \textbf{Col 2} \\ \hline
    \endfirsthead
    \hline
    \textbf{Col 1} & \textbf{Col 2} \\ \hline
    \endhead
    %
    Dato 1 & Dato 2 \\ \hline
\end{longtable}
```

### Tamaño de fuente para tablas

| Situación | Comando |
|---|---|
| Tabla muy densa (≥ 5 columnas o contenido denso) | `\footnotesize` antes del entorno |
| Tabla normal | `\small` antes del entorno |
| Siempre después de `\end{longtable}` | `\normalsize` |

---

## Listas

```latex
% Desordenada
\begin{itemize}
  \item texto
  \item texto con \textbf{negrita}
\end{itemize}

% Ordenada
\begin{enumerate}
  \item texto
\end{enumerate}

% Lista anidada
\begin{itemize}
  \item elemento principal
  \begin{itemize}
    \item subelemento
  \end{itemize}
\end{itemize}

% Lista de definición / descripción
\begin{description}
  \item[\textbf{Clave:}] Descripción del concepto
\end{description}
```

---

## Bloques de código

```latex
% Bloque de código inline en Markdown: `código`
\texttt{código}

% Bloque delimitado (``` ... ```) → usar verbatim o listings
\begin{verbatim}
código multilínea
tal como aparece
\end{verbatim}

% Si hay resaltado de sintaxis (```python, ```js, etc.)
% Usar el entorno verbatim con un comentario indicando el lenguaje:
% Esta es una buena alternativa simple sin requerir el paquete listings
\begin{verbatim}
# código Python
def ejemplo():
    return True
\end{verbatim}
```

> Si el usuario tiene el paquete `listings` o `minted` en la plantilla, usarlos.
> De lo contrario, `verbatim` es suficiente y siempre funciona.

---

## Placeholders para contenido no convertible

Cuando un elemento no puede representarse directamente en LaTeX, generá un placeholder
y registralo en el **Reporte de cambios** al final del archivo.

### Imágenes en base64

Las referencias del tipo `![alt](data:image/png;base64,XXXXX...)` se convierten así:

```latex
% [IMAGEN] nombre_descriptivo.png → descripción de qué muestra la imagen
\begin{figure}[H]
    \centering
    \includegraphics[width=0.9\linewidth]{nombre_descriptivo.png}
    \caption{Descripción visible en el PDF}
    \label{fig:nombre_descriptivo}
\end{figure}
```

El nombre de archivo debe derivarse del contexto (alt text, caption, o posición en el doc).
Si hay varias imágenes sin nombre claro: `imagen_1.png`, `imagen_2.png`, etc.

### Imágenes side-by-side (múltiples en un bloque)

```latex
\begin{figure}[H]
    \centering
    \begin{minipage}{0.48\textwidth}
        \centering
        % [IMAGEN] imagen_a.png → descripción A
        \includegraphics[width=\linewidth]{imagen_a.png}
        \caption{Descripción A}
    \end{minipage}\hfill
    \begin{minipage}{0.48\textwidth}
        \centering
        % [IMAGEN] imagen_b.png → descripción B
        \includegraphics[width=\linewidth]{imagen_b.png}
        \caption{Descripción B}
    \end{minipage}
\end{figure}
```

### HTML inline

El HTML inline dentro del Markdown (ej: `<div>`, `<span>`, `<br>`, `<table>`) debe ignorarse
o convertirse semánticamente:

| HTML | LaTeX |
|---|---|
| `<br>` / `<br/>` | `\\` o nuevo párrafo (`\par`) |
| `<b>texto</b>` | `\textbf{texto}` |
| `<i>texto</i>` | `\textit{texto}` |
| `<code>texto</code>` | `\texttt{texto}` |
| `<hr>` | `\bigskip\noindent\rule{\linewidth}{0.4pt}\bigskip` |
| `<div>`, `<span>`, etc. | Ignorar las etiquetas, conservar el contenido de texto |
| `<table>` compleja | Convertir manualmente a `longtable` o `tabular` |

Si hay un bloque HTML complejo que no se puede convertir manualmente:
```latex
% [HTML-NO-CONVERTIDO] → descripción del contenido que estaba aquí
% El usuario debe reemplazar este comentario con el LaTeX equivalente.
```

---

## Caracteres especiales

Escapar **antes** de escribir el contenido en el `.tex`. Dentro de celdas de tabla,
`&` es el separador de columna (no lo escapés dentro del separador, pero sí en texto de celda).

| Carácter | LaTeX |
|---|---|
| `&` (en texto) | `\&` |
| `%` | `\%` |
| `$` | `\$` |
| `#` | `\#` |
| `_` (fuera de math) | `\_` |
| `^` (fuera de math) | `\^{}` |
| `~` | `\textasciitilde` |
| `\` | `\textbackslash` |
| `{` `}` | `\{` `\}` |
| `→` | `$\rightarrow$` |
| `←` | `$\leftarrow$` |
| `↔` | `$\leftrightarrow$` |
| `–` (guión en) | `--` |
| `—` (guión em) | `---` |
| `«texto»` | `«texto»` (con `utf8`) o `\guillemotleft texto\guillemotright` |
| `…` | `\ldots` |

---

## Links y URLs

```latex
% Texto con link → usar \href
\href{https://ejemplo.com}{Texto del link}

% URL sin texto → usar \url
\url{https://ejemplo.com}
```

Requiere el paquete `hyperref`.

---

## Citas y blockquotes

```latex
% > texto en Markdown
\begin{quote}
Texto citado aquí.
\end{quote}
```

---

## Bibliografía (estilo APA con sangría francesa)

```latex
\begingroup
\setlength{\parindent}{0pt}
\setlength{\parskip}{0.5em}
\setlength{\hangindent}{1.27cm}
\setlength{\hangafter}{1}

Apellido, N. (Año). \href{URL}{\textit{Título}}. \textit{Fuente}.

Apellido, N. \& Apellido2, N. (Año). \textit{Título del libro}. Editorial.

\endgroup
```

---

## Separadores horizontales

`---` en Markdown → generalmente omitir. Si se necesita separación visual:
```latex
\bigskip
```

---

## Notas al pie

```latex
% [^1]: texto en Markdown
Texto principal\footnote{Texto de la nota al pie.}
```

---

## Tablas de contenido / índice

Si el `.md` tiene un índice manual o si el documento es largo (> 5 secciones), agregar:
```latex
\tableofcontents
\newpage
```
Después del prólogo y antes del primer `\section`.
