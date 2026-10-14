# Skills de Mateo

[![skills.sh](https://skills.sh/b/mateodiazvaldez/skills)](https://skills.sh/mateodiazvaldez/skills)

Skills de Claude Code que uso en mis proyectos.

## Instalar

```bash
# Todas las skills del repo
npx skills add mateodiazvaldez/skills

# Una sola
npx skills add mateodiazvaldez/skills -s <skill>

# Global (todos los proyectos)
npx skills add mateodiazvaldez/skills -s <skill> -g
```

## Skills

| Skill | Para qué | Cuándo se dispara | Instalar |
|---|---|---|---|
| [`microinteracciones-playbook`](skills/microinteracciones-playbook/SKILL.md) | Fija el flujo y mi estilo de movimiento por defecto (Expresivo, Equilibrado, Mínimo o Personalizado) y lo registra en `docs/MOTION.md`. No enseña a animar. | "agregá microinteracciones", "animá esta pantalla", "hacé que se sienta más vivo", "auditá el motion", "revisá las animaciones" | `npx skills add mateodiazvaldez/skills -s microinteracciones-playbook` |
| [`presentacion-viva`](skills/presentacion-viva/SKILL.md) | Arma, audita y mejora presentaciones como artifact Slides de claude.ai: poco texto, branding en cada slide, gráficos animados en loop. Usada en un deck real; sin evaluaciones formales. | Pedidos de presentación, deck, diapositivas, pitch o defensa de TPO; auditar, reordenar o animar slides; repartir oradores | `npx skills add mateodiazvaldez/skills -s presentacion-viva` |
| [`test-cases`](skills/test-cases/SKILL.md) | Auditoría de cobertura de tests automatizados más plan de test cases manuales (matriz de trazabilidad). v0.1.0 | "auditoría de tests", "qué tests faltan", "cobertura de tests", "generá los test cases", "QA audit" | `npx skills add mateodiazvaldez/skills -s test-cases` |
| [`auto-issue-resolver`](skills/auto-issue-resolver/SKILL.md) | Actualiza el repo, identifica issues de GitHub paralelizables, pide clarificaciones, presenta un plan y despacha subagentes antes de crear PRs. | Pedido de resolver issues abiertos en paralelo | `npx skills add mateodiazvaldez/skills -s auto-issue-resolver` |
| [`auto-pr-handler`](skills/auto-pr-handler/SKILL.md) | Revisa PRs abiertos, lee los code reviews, mergea los aprobados y despacha subagentes a corregir los que tienen cambios pedidos. | Pedido de gestionar o mergear PRs abiertos | `npx skills add mateodiazvaldez/skills -s auto-pr-handler` |
| [`auto-pr-review`](skills/auto-pr-review/SKILL.md) | Lanza un subagente por PR; cada uno corre `/code-review` y publica el resultado como comentario en GitHub. | Lista de números o URLs de PRs a revisar en paralelo | `npx skills add mateodiazvaldez/skills -s auto-pr-review` |
| [`md-to-latex`](skills/md-to-latex/SKILL.md) | Convierte Markdown a LaTeX respetando plantillas `.tex` de referencia. | "pasar a tex", "convertir a latex", "quiero el latex de este markdown" | `npx skills add mateodiazvaldez/skills -s md-to-latex` |

## Dependencias (de otro autor, no incluidas)

`microinteracciones-playbook` se apoya en las skills de [Emil Kowalski](https://github.com/emilkowalski/skills), que se instalan aparte:

```bash
npx skills add emilkowalski/skills -s animate improve-animations review-animations find-animation-opportunities emil-design-eng
```

`review-animations` tiene `disable-model-invocation`: la corro yo con `/review-animations`.

## Estructura

```
skills/<nombre>/SKILL.md      # frontmatter name + description
skills/<nombre>/*.md          # archivos de apoyo
```

## Licencia

MIT. Ver [LICENSE](LICENSE).
