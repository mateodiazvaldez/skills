# Narrativa, tiempos y oradores

## Estructura del relato

Para un pitch o la defensa de un trabajo práctico de innovación, el orden que funcionó es el siguiente:

1. **Apertura:** pantalla de marca, teaser en video, problema, por qué ahora.
2. **Producto:** qué es y cómo funciona, alcance, identidad (misión, visión y valores).
3. **Cliente y mercado:** segmento, propuesta de valor (sigue al segmento porque usa sus frustraciones), TAM, SAM y SOM.
4. **Modelo de negocio:** cómo se cobra, el canvas, el motor de crecimiento.
5. **MVP:** hipótesis, pantallas, demo o prototipo, flujos clave, plan de prueba.
6. **Innovación y competencia:** tipos de innovación como síntesis (ya se explicó todo lo que nombra), matriz o mapa de competidores y tabla de respaldo.
7. **Métricas:** KPI, del KPI al OKR, OKR.
8. **Preguntas**, con la bibliografía.

La identidad (misión, visión y valores) va después del producto, no antes: una misión no se entiende sin saber qué es la cosa.

## Auditoría de orden

Recorrer el deck slide por slide y preguntar:

- **¿Usa un concepto que todavía no se explicó?** Si sí, mover la slide o la que explica el concepto.
- **¿Hay dos slides que cuentan lo mismo?** Diferenciarlas (una muestra el flujo general y la otra lo único de ese componente) o fusionarlas.
- **¿Las slides con transición magic quedan seguidas?**
- **¿Cada sección arranca donde cambia el tema?** Actualizar `sections` en `deck.json`.

Presentar el resultado como tabla (número, slide, bloque) marcando con flechas lo que se movió, explicar cada movimiento en una línea y aplicar después del «dale».

## Justificación de cada slide

Tabla de trabajo: slide → sección de la fuente → idea → gráfico. Las slides que no tienen sección (pantalla de marca, video, preguntas) se justifican por su función en el relato. Lo demás que no tiene sección es relleno.

## Notas del orador

- Formato: «Título (tiempo). Guion breve. Concepto de la materia (autor). Datos de respaldo.»
- Están escritas sin nombres de oradores, porque el reparto cambia.
- Incluyen lo que se dice mientras corre la animación («la animación muestra…»).
- La slide de preguntas lleva respuestas preparadas para las preguntas más probables.

## Tiempos y oradores

- Sumar los tiempos de las notas y compararlos con el objetivo. Si se pasa, proponer recortes concretos (fusionar slides, acortar el guion, mover detalle a una slide de respaldo).
- **Reparto:** bloques consecutivos, cortados en los límites de sección, con tiempos parecidos (diferencia de 45 s o menos). Un video sin locución cuenta en el tiempo de quien lo presenta. Una demo en vivo suma su minuto al bloque donde se inserta.
- Entregarlo como tabla (orador, diapos, tema, tiempo) y una fila final «Todos · Preguntas».
- Cuando se agrega o se quita una slide, actualizar los números de la tabla.

## Slides de respaldo

Cuando un gráfico resume datos que alguien puede pedir en detalle (una matriz con puntajes, por ejemplo), poner justo después una slide nativa y estática con la tabla completa. La nota del orador dice «pasarla rápido si nadie pregunta».

## Cierre

Una frase de visión que repite otra slide no cierra nada. Opciones, en orden de preferencia:

1. Síntesis: problema, mercado, diferencial y validación, con un dato cada uno.
2. Próximo paso concreto.
3. Ir directo a preguntas, con el logo presente.

## Slides retiradas

Antes de quitar una slide:

1. Copiar su HTML a `respaldo-slides/<id>.html` dentro del proyecto.
2. Documentarla en el CONTEXTO: fecha, versión del artifact, qué tenía y por qué se quitó.
3. Escribir los pasos para restaurarla (copiar el archivo, agregar el id en `order` y renumerar).
4. Avisar si la slide era el único lugar con un dato importante (por ejemplo, los nombres completos del grupo).
