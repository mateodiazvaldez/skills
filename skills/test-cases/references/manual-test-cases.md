# Test cases manuales — formato y criterio

La última capa de testing: lo que un humano (o una automatización ad-hoc tipo Playwright
puntual) ejecuta porque automatizarlo en CI todavía no compensa el costo, o porque el caso
depende de juicio humano (¿se ve bien esto?, ¿el flujo se siente natural?).

## Formato estándar de la industria

Campos mínimos (derivados del set clásico IEEE 829, adaptado — ver `artifact-format.md`
para por qué no seguir 829 al pie de la letra hoy):

| Campo | Qué va |
|---|---|
| `ID` | `TC-<módulo>-<n>` |
| `Título` | Una línea, verbo + objeto: "Verificar que puja bajo el mínimo se rechaza con mensaje claro" |
| `Precondiciones` | Estado necesario antes de ejecutar (usuario logueado, subasta activa, etc.) |
| `Pasos` | Lista numerada, cada paso una acción concreta y verificable |
| `Resultado esperado` | Qué debe observarse — específico, no "funciona bien" |
| `Prioridad` | Crítico / Alto / Medio / Bajo (riesgo de negocio × probabilidad de romperse en silencio) |
| `Tipo` | Manual puro / Manual asistido (script ad-hoc, no en CI) |
| `Vínculo` | ID de requisito de la matriz de cobertura, o issue/PR |

## Ejemplo

```
TC-BANNERS-03
Título: Banner con foto retrato no debe verse "corrido" respecto al panel de texto
Precondiciones: Al menos 1 banner activo con foto de aspecto retrato (no 16:9)
Pasos:
  1. Ir a la home en viewport desktop (≥1280px)
  2. Localizar el banner activo con foto retrato
  3. Comparar el borde del panel de imagen contra el panel de texto adyacente
Resultado esperado: El panel de imagen tiene marco propio visible (bg-brand-ink-800,
  border-brand-ink-700) que lo separa del fondo del article; la foto no se percibe
  descentrada aunque tenga barras vacías por object-contain.
Prioridad: Medio
Tipo: Manual (verificación visual)
Vínculo: fix #484
```

## Criterio: qué entra como manual y qué no

Un caso va a la tabla manual solo si aplica al menos una de estas condiciones:

1. **Juicio visual/UX** que un assert no captura bien (alineación, "se siente lento",
   jerarquía visual) — candidato a snapshot/visual regression a futuro, pero hoy es manual.
2. **Dependencia de servicio externo real** difícil/caro de mockear de forma fiel (pasarela
   de pago real, proveedor de email en producción, hardware).
3. **Exploratorio** — no hay un caso fijo todavía, se está buscando comportamiento
   inesperado en un flujo nuevo o de alto riesgo.
4. **Automatizarlo ahora no compensa** — flujo que cambia de forma tan frecuente que el
   costo de mantenimiento del test automatizado supera el valor (raro, justificar si se usa
   esta razón).

Si un caso NO cumple ninguna de estas y solo está en manual "porque no se escribió el test
automatizado todavía", **no es un test case manual real** — es un gap de automatización y
va en la matriz de cobertura como ❌, no acá. Mezclar ambos devalúa la tabla manual: deja de
ser "lo que elegimos no automatizar" y pasa a ser "deuda técnica disfrazada de plan".

## Priorización

Ordenar la tabla por:
1. Prioridad (Crítico primero).
2. Dentro de cada prioridad, lo que toca dinero/autenticación/integridad de datos antes que
   UI cosmética.

No ordenar por orden de descubrimiento ni alfabético — el artifact se lee de arriba hacia
abajo y lo primero que ve el usuario debe ser lo que más importa ejecutar.

## Cuándo NO generar un test case manual

- Si el Paso 2 (matriz de cobertura) ya marcó el requisito como ✅ con buena cobertura de
  comportamiento (no solo de línea) — sería trabajo duplicado.
- Si es un detalle de implementación sin superficie observable por el usuario (un helper
  interno sin efecto visible) — eso se cubre con unit test, no manual.
