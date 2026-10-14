# Matriz de cobertura automática (RTM adaptada)

Basado en el patrón estándar de Requirements Traceability Matrix (RTM) usado en la
industria: mapear requisito → test(s) → estado, con trazabilidad bidireccional (todo
requisito tiene test asociado o gap explícito; todo test mapea a un requisito real, no a
"porque sí").

## Columnas

| Columna | Qué va | Notas |
|---|---|---|
| `ID` | `REQ-<módulo>-<n>` o el ID de spec/issue si existe | Reusar IDs de Spec-Kit (`specs/105-...`) o de issues de GitHub cuando el proyecto ya los tiene — no inventar un esquema paralelo |
| `Requisito / Comportamiento` | Descripción corta y verificable, no el nombre del archivo | "Reset de seña post-cierre para usuarios SenaObligatoria", no "test_cierres_service.py" |
| `Tipo` | unit / integration / e2e / contract | Según la pirámide de `testing-strategy` |
| `Test(s) que lo cubre` | Ruta de archivo + nombre de test, verificado con Grep/Glob | Si cubre parcialmente, listar cuál test y qué le falta en la celda de Estado |
| `Estado` | ✅ implementado / ⚠️ parcial / ❌ falta / 🔴 roto o skippeado / ❔ sin verificar | Nunca ✅ sin haber confirmado el test en el repo |
| `Prioridad` | Crítico / Alto / Medio / Bajo | Por impacto de negocio si falla en producción, no por esfuerzo de implementarlo |
| `Origen` | spec / issue / PR / inferido de código | De dónde salió el requisito — trazabilidad hacia atrás |

## Granularidad: una fila por comportamiento, no por archivo

Un archivo de test suele cubrir varios comportamientos (happy path, edge case, error). Cada
uno es su propia fila. Esto es lo que hace la matriz útil para detectar gaps reales: un
archivo con 1 test "pasa" a simple vista pero puede estar cubriendo solo el happy path y
dejando el edge case como gap invisible si se audita por archivo en vez de por comportamiento.

Ejemplo (proyecto con backend Python + frontend TS, pero el patrón es genérico):

| ID | Requisito | Tipo | Test(s) | Estado | Prioridad | Origen |
|---|---|---|---|---|---|---|
| REQ-PUJAS-01 | Puja rechazada si monto ≤ precio actual | unit | `test_pujas.py::test_rechaza_monto_menor` | ✅ | Crítico | spec 040 |
| REQ-PUJAS-02 | Puja proxy respeta techo de oferta sobre | unit | `test_pujas.py::test_proxy_respeta_techo` | ✅ | Crítico | spec 040 |
| REQ-PUJAS-03 | Puja proxy con techo agotado usa precio_actual_efectivo | integration | — | ❌ | Crítico | issue #622 |
| REQ-PUJAS-04 | WebSocket notifica nueva puja en <200ms | e2e | `test_ws_latency.py::test_notif_latency` | 🔴 skippeado (falta TEST_DATABASE_URL) | Alto | spec 023 |

## Tratamiento de casos especiales

- **Tests flaky/skippeados**: nunca se cuentan como ✅. Van en 🔴 con la razón exacta del
  skip (leer el `@pytest.mark.skip(reason=...)` o el `it.skip`, no adivinar).
- **Cobertura de línea alta pero sin asserts fuertes** (tests que solo instancian sin
  verificar comportamiento): marcar ⚠️ parcial aunque la herramienta de cobertura los cuente
  como cubiertos — cobertura de línea no es cobertura de comportamiento.
- **Requisitos sin test y sin plan de automatizar pronto**: no forzarlos a ❌ solamente; si
  el motivo es que se decidió testearlo manual (ver `manual-test-cases.md`), marcar como
  `➡️ manual` con referencia al ID del test case manual correspondiente, para que la matriz
  no muestre un falso gap.
- **Modo PR**: agregar columna `Diff` (sí/no) para distinguir requisitos que el PR toca
  directamente de los que entran por regresión. Ayuda al reviewer a priorizar qué revisar
  primero.

## Resumen ejecutivo (para el header del artifact)

Calcular, no estimar a ojo:
- % ✅ implementado sobre total de filas.
- Cantidad en 🔴 (roto/skippeado) — esto es lo más urgente, más urgente que los ❌ nuevos.
- Top gaps por Prioridad = Crítico y Estado = ❌, ordenados primero.
