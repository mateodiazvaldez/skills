# Formato del artifact — research y estructura

## Por qué HTML interactivo y no un documento estático

Research de industria (2026) converge en: las matrices de trazabilidad y coverage que
funcionan en la práctica son las que se pueden **filtrar y escanear rápido**, no las que se
leen de punta a punta. Fuentes: guías de RTM de TestRail/Kualitee/Testomat.io coinciden en
que el valor cae fuerte cuando la matriz es una tabla estática grande sin forma de aislar
"qué está en rojo" o "qué es crítico" de un vistazo. Un test plan/RTM que nadie puede filtrar
en 10 segundos se abre una vez y después se ignora — el problema clásico de "document rot"
en documentación de test (ver Devonair/testRigor: la causa no es falta de disciplina, es que
actualizar y *consultar* el documento no está integrado al flujo de trabajo).

Por eso el artifact HTML de esta skill no es un dashboard de BI (nada de gráficos
decorativos, nada de librerías de charting) — es una **tabla auditable con filtros
livianos**: buscar por texto, filtrar por Estado/Prioridad/Tipo, colapsar por módulo. Eso ya
cubre el 90% del valor que la industria busca en un RTM, con una fracción del esfuerzo de un
dashboard real.

## Estándares de referencia (y por qué no seguirlos al pie de la letra)

IEEE 829 es el origen del set de campos que todavía se usa (ID, pasos, resultado esperado),
pero fue formalmente reemplazado por ISO/IEC/IEEE 29119. Ninguno de los dos prescribe un
formato de *artifact interactivo* — son estándares de documento, pensados para PDFs
estáticos de una era donde "test plan" significaba un Word compartido por email. La skill
toma el **vocabulario y los campos** de esos estándares (siguen siendo el lenguaje común que
cualquier QA reconoce) pero los entrega en un formato que sí se usa en 2026: filtrable,
copiable, con estado visual inmediato (colores por Estado/Prioridad), no un documento de 40
páginas que se lee una vez y se archiva.

## Estructura del artifact

Antes de escribir el HTML: cargar la skill `artifact-design` (obligatorio, define título,
theming, tamaño, libs permitidas). Este documento no reemplaza esa skill, la complementa con
la estructura de contenido específica de una auditoría de testing.

1. **Header**
   - Título: nombre del proyecto/módulo + "Auditoría de Testing".
   - Línea de scope: `Base completa` / `Módulo: <nombre>` / `PR #<n>: <título>`.
   - Fecha de la corrida (para que quede claro que es una foto, no algo que se
     autoactualiza).

2. **Resumen ejecutivo** (arriba de todo, sin scroll)
   - 3-4 métricas simples como texto/números grandes, no gráficos: % implementado, cantidad
     🔴 roto/skippeado, cantidad ❌ crítico, cantidad de test cases manuales pendientes.
   - Lista corta (3-5 ítems) de los gaps más urgentes — lo que un lector apurado necesita ver
     sin filtrar nada.

3. **Tabs o secciones ancladas**: "Cobertura automática" | "Test cases manuales"
   - Cada tabla con: buscador de texto simple, filtro por Estado, filtro por Prioridad.
   - Filas coloreadas suavemente por Estado (verde ✅, ámbar ⚠️, rojo 🔴/❌) — usar color con
     ícono/texto igual, nunca color solo (accesibilidad).
   - Sticky header en la tabla si hay más de ~15 filas, para no perder las columnas al
     scrollear.

4. **Nada más.** No agregar sección de "tendencia histórica" ni gráficos de torta de
   cobertura — esta skill produce una foto puntual, no un dashboard con estado persistente.
   Si el usuario pide explícitamente seguimiento histórico entre corridas, es una extensión
   fuera del alcance de la v1 de esta skill: preguntar antes de improvisar una capability de
   almacenamiento (`artifact-capabilities`) que no fue pedida.

## Checklist antes de publicar

- [ ] Todas las filas ✅ fueron confirmadas con Grep/Glob real, ninguna asumida.
- [ ] El scope declarado en el header coincide con lo que realmente se auditó.
- [ ] Los filtros de texto/estado/prioridad funcionan (probarlos mentalmente con al menos un
      caso de cada estado antes de dar la auditoría por terminada).
- [ ] La tabla de manuales no duplica nada ya ✅ en la matriz automática.
- [ ] Se declaró explícitamente cualquier cosa "sin verificar" (❔) en vez de omitirla.
