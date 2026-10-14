---
name: auto-issue-resolver
description: Actualiza el repo local, identifica issues de GitHub paralelizables, hace preguntas de clarificación, presenta un plan limpio para aprobar y despacha subagentes en paralelo para resolverlos antes de crear PRs.
---

# Auto Issue Resolver

Usá esta skill cuando el usuario pida "procesar issues en paralelo", "actualizar repo y resolver issues", o mencione automatizar la resolución de issues con subagentes (ej. "haz lo de las issues en paralelo").

## Workflow

### Fase 1 — Limpiar, actualizar y analizar (ejecutar antes de preguntar nada)

1. Detectar la rama por defecto (`gh repo view --json defaultBranchRef -q .defaultBranchRef.name`, en adelante `<base>`), y ejecutar `git fetch origin` y `git pull origin <base>`.
2. Ejecutar `git worktree prune` para eliminar worktrees muertos.
3. Verificar ramas locales sin pushear (`git log --branches --not --remotes`). Si es seguro, limpiar ramas mergeadas.
4. Asegurarse de estar en `<base>` limpio.
5. Obtener la lista completa de issues abiertos: `gh issue list --limit 100`.
6. Leer los detalles de cada issue: `gh issue view <n>`.
7. Clasificar **todos** los issues abiertos en dos grupos:
   - **Paralelizables**: tocan archivos/módulos distintos y no tienen dependencias entre sí → van todos al plan.
   - **No paralelizables**: dependen de otro issue del mismo batch, o tocan los mismos archivos centrales (ej. schema, layout global) → listarlos aparte con la razón, para resolverlos en una pasada posterior.

   No hay límite de issues paralelizables — si hay 10 issues independientes, se lanzan 10 subagentes.

### Fase 2 — Preguntas de clarificación

Una vez identificados los issues candidatos, formular **todas** las preguntas de clarificación necesarias en un solo bloque y **detenerse a esperar respuesta**. No mostrar el plan todavía.

Ejemplos de preguntas útiles:
- ¿Hay algún issue que querés excluir o priorizar?
- ¿Hay restricciones de rama o convenciones de nombre para los PRs?
- ¿Algún issue tiene dependencias de otros que no sean obvias desde el código?
- ¿Querés que los PRs se creen como draft?

**STOP — terminar el turno aquí y esperar las respuestas del usuario.**

### Fase 3 — Plan limpio + aprobación

Con las respuestas del usuario incorporadas, presentar el plan final sin preguntas pendientes:

- **Issues a resolver en este batch**: todos los paralelizables, con su número, título, archivos que tocan y nombre de rama propuesto.
- **Issues excluidos de este batch**: listados con la razón (dependencia, conflicto de archivos, etc.) para encarar en una segunda pasada.

Esperar que el usuario apruebe el plan. NO continuar hasta la aprobación.

### Fase 4 — Despachar subagentes (post-aprobación)

Lanzar un subagente por issue en un worktree Git aislado. Cada subagente debe:
- Resolver su issue específico siguiendo las convenciones del proyecto.
- Hacer commit localmente con mensaje descriptivo.
- **Prohibido hacer `git push` o crear Pull Requests** — eso lo hace el orquestador.
- Reportar el nombre de la rama/worktree al finalizar.

Lanzar todos los subagentes en paralelo y esperar que todos terminen.

### Fase 5 — Crear Pull Requests

Una vez que todos los subagentes hayan commiteado exitosamente:

1. Pushear cada rama: `git push origin <rama-worktree>:<rama-remota-limpia>`
2. Crear un PR por issue:
   ```
   gh pr create --head <rama-remota> --base <base> --title "Fix: ..." --body "Resuelve #X"
   ```
3. Informar al usuario con las URLs de cada PR.
