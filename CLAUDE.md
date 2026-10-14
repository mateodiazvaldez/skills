# Publicar skills en skills.sh

No hay registro manual ni aprobación. El proceso es:

## 1. Crear el repo en GitHub

El nombre del repo define la identidad de la skill: `tu-usuario/tu-repo`.

Estructura esperada (ver repos como `vercel-labs/skills`, `mattpocock/skills`):
- Archivo de skill con la definición (ej. `SKILL.md`)
- `README.md` explicando cómo usarla

## 2. Publicación automática

No hay que "subir" nada a skills.sh. La skill aparece en el leaderboard automáticamente cuando alguien la instala:

```bash
npx skills add tu-usuario/tu-repo
```

El CLI recolecta telemetría anónima de instalaciones, y eso alimenta el ranking.

## 3. Badge opcional

```markdown
[![skills.sh](https://skills.sh/b/tu-usuario/tu-repo)](https://skills.sh/tu-usuario/tu-repo)
```

## Referencias

- Repo fuente del CLI: https://github.com/vercel-labs/skills
- Leaderboard: https://www.skills.sh
- Docs: https://www.skills.sh/docs
