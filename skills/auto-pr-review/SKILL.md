---
name: auto-pr-review
description: Lanza un subagente por cada PR indicado, cada uno ejecuta /code-review y publica el resultado como comentario en el PR de GitHub. Usar cuando el usuario pasa una lista de números o URLs de PRs para revisar en paralelo.
argument-hint: "<PR#1> <PR#2> ... (números o URLs de PR de GitHub)"
---

# /auto-pr-review

Dado una lista de PRs, lanza un subagente **por cada PR en paralelo**. Cada subagente:
1. Obtiene el diff del PR via `gh pr diff <número>`
2. Revisa el código (seguridad, rendimiento, correctitud, mantenibilidad)
3. Publica el review como comentario en el PR via `gh pr comment`

## Qué hacer al invocar este skill

Parseá los argumentos (`$1`) para extraer la lista de PRs. Cada token que sea un número entero o una URL de PR de GitHub es un PR a revisar.

Para **cada PR**, lanzá un subagente con el Agent tool **en el mismo mensaje** (en paralelo). No esperes la respuesta de un subagente antes de lanzar el siguiente.

### Prompt para cada subagente

Usá exactamente este prompt, sustituyendo `PR_NUMBER` con el número de PR:

---

Sos un agente de code review para el PR #PR_NUMBER. Seguí estos pasos en orden:

**Paso 1 — Invocar la skill de code-review:**

Usá el Skill tool con estos parámetros:
- `skill`: `"code-review"`
- `args`: `"PR #PR_NUMBER"`

La skill se encarga de obtener el diff y producir el review completo. Esperá su resultado — ese texto es el review que vas a publicar.

**Paso 2 — Publicar el resultado como comentario en el PR:**

Tomá el texto de output de la skill y publicalo con:

```
gh pr comment PR_NUMBER --body "<OUTPUT DE LA SKILL>"
```

Si `gh pr comment` falla, reintentalo una vez. Si sigue fallando, reportá el error.

Retorná el URL del comentario publicado cuando termines.

---

### Después de lanzar todos los subagentes

Esperá los resultados y mostrá un resumen:

```
## Auto PR Review completado

| PR | Veredicto | Comentario |
|----|-----------|------------|
| #46 | Request Changes | [link] |
| #50 | Approve | [link] |
```

Si algún subagente falló, indicalo en la tabla.
