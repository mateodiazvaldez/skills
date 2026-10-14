---
name: test-cases
description: This skill should be used when the user asks to "audit tests", "auditoría de tests", "test case audit", "armá el plan de testing", "qué tests faltan", "cobertura de tests", "test coverage audit", "generá los test cases", "QA audit", or wants a combined automated-test coverage audit plus manual test case plan for a codebase, a module/feature, or an open PR. Builds on engineering:testing-strategy's pyramid/coverage guidance but produces a concrete artifact (RTM-style coverage matrix + manual test case table) instead of prose recommendations.
version: 0.1.0
---

# Test Cases — Auditoría de Testing + Plan

Genera tres cosas a partir del estado real del código (no de memoria ni de suposiciones):

1. **Auditoría de cobertura automática** — matriz tipo RTM (Requirements Traceability
   Matrix): qué existe, qué falta, qué está roto/skippeado, mapeado a requisito/feature/PR.
2. **Los tests obligatorios que faltan, escritos** — no una lista de lo que habría que
   escribir. Lo que protege un invariante declarado, un bug ya ocurrido o una regla de
   negocio con consecuencia real se cierra en la misma corrida. Los gaps opcionales (e2e
   redundante, snapshot visual, performance) quedan marcados como pendientes (Paso 3).
3. **Plan de test cases manuales** — la última capa: lo que queda después de escribir los
   automatizables (exploratoria, UX, casos que dependen de servicios externos reales), con
   formato de la industria (ID, pasos, resultado esperado, prioridad).

La auditoría y el plan manual se entregan en **un artifact HTML** (ver
`references/artifact-format.md`), no en texto de chat ni archivo suelto — es un entregable
para compartir/revisar. Los tests escritos van al repo como código, no al artifact.

No reemplaza `engineering:testing-strategy` (esa define qué tipo de test usar por
componente); esta skill **audita lo que ya existe contra esa estrategia** y arma el plan de
ejecución. Si el usuario pide diseñar una estrategia desde cero sin código existente, usar
`testing-strategy` en su lugar.

## Paso 0 — Determinar el scope (OBLIGATORIO preguntar si no es obvio)

Nunca asumir el scope. Hay tres modos y cambian todo lo que sigue:

| Modo | Cuándo aplica | Qué se audita |
|---|---|---|
| **Base completa** | Usuario pide auditoría de todo el proyecto/repo | Todo el árbol de tests vs. toda la superficie de código/specs |
| **Módulo/feature** | Usuario nombra un módulo, spec, o área ("el motor de pujas", "specs/105") | Solo ese módulo + sus dependencias directas |
| **PR / rama actual** | Hay un PR abierto contra la base, o el usuario dice "esta rama", "este PR" | Solo el diff del PR + regresión relevante (ver abajo) |

Señales para detectar el modo automáticamente (pero confirmar igual si hay ambigüedad):
- `git status` / rama actual con nombre `feat/`, `fix/`, etc. + un PR abierto (`gh pr view`
  sin argumentos) → sugiere modo PR.
- El usuario menciona un archivo de spec, carpeta, o feature puntual → modo módulo.
- El usuario dice "todo", "toda la suite", "auditoría completa", o no hay PR/branch de
  feature activa → modo base completa.

Si dos señales compiten (ej: hay PR abierto pero el usuario no lo mencionó), **preguntar con
AskUserQuestion** antes de escanear nada. Nunca ejecutar el escaneo completo "por las dudas"
cuando el modo correcto es PR — audita de más, tarda más, y el artifact queda inflado con
ruido que no es responsabilidad de ese PR.

### Modo PR — regla de regresión

En modo PR, el objetivo NO es testear todo el sistema. Es:
1. Todo lo que el diff toca o agrega (obligatorio).
2. Regresión: callers/consumidores del código tocado que puedan romperse — no toda la suite,
   solo lo que un `grep` de referencias al símbolo/endpoint/componente modificado revela.
3. Si al armar (1)+(2) aparece una duda genuina sobre si algo entra en scope (p. ej. un
   invariante de negocio que el PR toca tangencialmente), **preguntar al usuario**, no decidir
   scope por él cuando la ambigüedad es real.

## Paso 1 — Detectar el stack y ubicar los tests existentes

No asumir pytest/vitest de memoria: confirmar contra el repo actual.

1. Buscar manifiestos de build/test: `package.json` (scripts `test`, `test:coverage`),
   `pytest.ini`/`pyproject.toml`, `go.mod`, `Cargo.toml`, etc.
2. Ubicar directorios de test reales con Glob (`**/*.test.*`, `**/*.spec.*`, `tests/**`,
   `test_*.py`, `**/__tests__/**`).
3. Si el proyecto tiene un `CLAUDE.md`/`AGENTS.md` con comandos de test documentados,
   **usar esos comandos textuales**, no inventar flags.
4. Correr la suite con reporte de cobertura si el comando lo soporta sin cambiar
   configuración (`pytest --cov`, `vitest run --coverage`, etc.). Si no corre limpio
   (falta DB, env vars), registrar eso como hallazgo en vez de fallar en silencio — es
   información real para el artifact ("485 tests skipped sin TEST_DATABASE_URL" es un
   hallazgo, no un error a ocultar).

## Paso 2 — Construir la matriz de cobertura automática

Ver `references/coverage-matrix.md` para el formato completo y ejemplos. Resumen:

- Una fila por **unidad de requisito/comportamiento** (no por archivo de test) — un
  requisito puede necesitar 3 tests (happy path, edge case, error) y eso se ve en la matriz,
  no se colapsa a una fila por archivo.
- Columnas mínimas: `ID`, `Requisito/Feature`, `Tipo` (unit/integration/e2e/contract),
  `Test(s) que lo cubre`, `Estado` (✅ implementado / ⚠️ parcial / ❌ falta / 🔴 roto o
  skippeado), `Prioridad` (crítico/alto/medio/bajo según impacto de negocio, no esfuerzo).
- La fuente del requisito depende del scope (Paso 0):
  - Base completa o módulo → usar specs (`specs/`, Spec-Kit) o `docs/features/` si el
    proyecto los tiene; si no, inferir de rutas de API/componentes públicos.
  - PR → usar la descripción del PR/issue vinculado + el diff mismo como fuente de verdad
    de qué comportamiento se agregó o cambió.
- Nunca inventar que un test existe. Si no se pudo confirmar por Grep/Glob que el archivo y
  el `test_` /`it(`/`describe(` referenciado existen, no listarlo como ✅.

## Paso 3 — Escribir los tests obligatorios (los opcionales quedan pendientes)

Un gap **obligatorio** detectado y no cerrado es trabajo a medias: el usuario pidió auditar
el testing, y entregarle una lista de lo que debería escribir deja el sistema igual de
desprotegido, con el trabajo devuelto a quien pidió la auditoría. Esos se escriben en esta
corrida, sin preguntar.

Un gap **opcional** es distinto: sube la confianza pero nadie se lo pierde hoy, y el proyecto
puede decidir legítimamente no pagarlo. Esos se marcan como pendientes en el artifact y no se
escriben salvo que el usuario los pida.

### Cómo clasificar cada gap

**Obligatorio** — cumple al menos una:

- Cubre un **invariante declarado** en una spec, ADR o documento de alcance que diga "cada
  uno necesita test". El proyecto ya se comprometió a tenerlo.
- Cubre un **bug que ya ocurrió** (en este PR, en producción, en un issue). Sin test de
  regresión vuelve.
- Cubre una **regla de negocio con consecuencia real**: dinero, permisos, integridad de
  datos, borrado, pérdida silenciosa de información.
- El **fixture no ejercita la forma real del dato** que el sistema produce hoy. Un test verde
  sobre una forma que ya no existe es peor que no tenerlo: da falsa confianza.
- Es de **contrato congelado** y el PR lo tocó.

**Opcional** — se marca pendiente, no se escribe:

- **E2E de flujos que ya tienen cobertura unitaria o de integración.** Son lentos, frágiles y
  caros de mantener; que falten es una decisión de estrategia, no un agujero.
- **Tests de UI/snapshot visual** que dependen de cómo se ve algo, no de qué hace.
- **Casos de borde improbables** sin impacto de negocio demostrable.
- **Performance / carga**, salvo que exista un presupuesto declarado que el PR pueda violar.
- Cobertura adicional de algo **ya cubierto** por otro test desde otro ángulo.

> **La excepción que importa:** un E2E es opcional *como categoría*, pero si es **la única
> forma de cubrir un invariante obligatorio** (porque el bug solo se manifiesta integrando
> capas reales), entonces ese E2E puntual es obligatorio. La categoría no gana sobre la
> consecuencia.

Ante duda genuina entre las dos columnas, clasificar como obligatorio y decirlo: es más
barato un test de más que un agujero que nadie vuelve a mirar.

### Lo que no se automatiza en ninguno de los dos casos

Va al plan manual (Paso 4), no a "pendiente": requiere un servicio externo real, mirar una
pantalla, configuración de infra fuera del repo (CORS, DNS, buckets), o es exploratorio
genuino sin resultado esperado definido de antemano.

### Reglas al escribir los obligatorios

- **TDD sobre el gap**: si el test cubre un bug o un invariante frágil, verificarlo en rojo
  primero (romper el código a propósito, correr, restaurar). Un test que nunca se vio fallar
  no prueba que proteja algo — eso es exactamente lo que dejó pasar los bugs que la auditoría
  encontró.
- **No debilitar lo que ya existe.** Si un test viejo estorba, se corrige lo que asevera, no
  se relaja ni se borra.
- **Seguir el estilo del repo**: mismos helpers, fixtures y convenciones de nombre que los
  tests vecinos. Un test que no se parece a los demás no se mantiene.
- **Correr lo que se escribió** y reportar el número real. Si la suite no corre limpio (falta
  DB, env), eso es un hallazgo del Paso 1, no una excusa para dar por bueno el test.

### Los pendientes van al artifact con su costo

Cada gap opcional se lista con qué cubriría, por qué se dejó afuera y qué haría falta para
cerrarlo (montar infraestructura de e2e, un fixture de datos, credenciales de CI). El usuario
tiene que poder decidir con eso a la vista, no descubrir después que "pendiente" significaba
"nadie lo miró".

Si un gap **obligatorio** no se pudo cerrar en la corrida (excede el scope, necesita una
decisión de producto, depende de algo que no existe todavía), **decirlo explícitamente en el
artifact y en el chat**, marcado como obligatorio-sin-cerrar. Nunca degradarlo a opcional
para que la auditoría cierre limpia.

## Paso 4 — Construir el plan de test cases manuales

Ver `references/manual-test-cases.md` para el formato completo. Resumen:

- Son la **última capa**: lo que no está (o no vale la pena todavía) automatizado —
  exploratorio, visual/UX, flujos cross-sistema difíciles de mockear, casos que dependen de
  servicios externos reales.
- Formato de industria por caso: `ID`, `Título`, `Precondiciones`, `Pasos` (numerados,
  accionables), `Resultado esperado`, `Prioridad`, `Tipo` (manual puro / manual con
  automatización asistida, ej. Playwright ad-hoc), `Vínculo` (requisito/PR/issue).
- No generar un test case manual para algo que Paso 2 marcó ✅ ni para algo que el Paso 3
  acaba de automatizar — sería trabajo duplicado. Los manuales llenan lo que queda.
- Priorizar por **riesgo de negocio × probabilidad de romperse silenciosamente**, no por
  orden de aparición en el código. Rutas de pago/pujas/auth van primero.

## Paso 5 — Armar y publicar el artifact

Usar el **Artifact tool** (`artifact-design` skill primero, es obligatorio antes de escribir
HTML). Ver `references/artifact-format.md` para estructura de secciones, tabs sugeridos y
qué evitar (no reinventar un dashboard con gráficos innecesarios — es una tabla de auditoría,
no un BI).

Estructura mínima del artifact:
1. Header con scope auditado (base / módulo X / PR #N) y fecha.
2. Resumen ejecutivo: % cobertura por estado, cantidad de tests rotos/skippeados, top 3
   gaps críticos.
3. Tab/sección "Cobertura automática" — la matriz del Paso 2, con los gaps ya cerrados en
   el Paso 3 marcados como tales (qué test los cubre ahora).
4. Tab/sección "Test cases manuales" — la tabla del Paso 4.
5. Nada de datos inventados: si una celda no se pudo verificar, se marca explícitamente
   como "sin verificar", nunca se omite ni se asume en verde.

Al terminar, decir en el chat qué modo de scope se usó y por qué (una línea), y el link del
artifact.

## Errores a evitar

- **Entregar un gap obligatorio como lista en vez de escribir el test.** Es el error más
  caro de todos: el artifact queda lindo, el sistema queda igual de desprotegido, y el
  trabajo recae en el usuario que justamente pidió que se auditara.
- **El error opuesto:** escribir e2e y tests opcionales que nadie pidió, inflando el diff y
  la suite. Esos se marcan pendientes con su costo y los decide el usuario.
- Auditar toda la base cuando el pedido real era sobre un PR (ruido, tarda más, y diluye lo
  que sí importa para ese PR).
- Marcar algo como cubierto sin haber confirmado el test con Grep/Glob real.
- Generar test cases manuales para cosas ya bien cubiertas por automatizados.
- Producir el artifact en Markdown plano cuando el valor está en poder filtrar/escanear
  rápido una tabla grande — usar HTML interactivo salvo que el usuario pida explícitamente
  un archivo versionable en el repo.
- Callar cuando la suite no corre limpio (falta de env, DB, etc.) — eso es en sí mismo un
  hallazgo de la auditoría.

## Recursos

- **`references/coverage-matrix.md`** — formato completo de la matriz de cobertura (RTM),
  columnas, ejemplos, cómo tratar tests parciales/flaky.
- **`references/manual-test-cases.md`** — formato completo de test case manual, ejemplos,
  cómo priorizar, cuándo un caso "manual" debería en realidad ser automatizado.
- **`references/artifact-format.md`** — estructura del artifact HTML, qué research de
  industria lo respalda, qué evitar (sobre-diseño, gráficos decorativos).
