---
name: guia-paso-a-paso
description: Arma guías y tutoriales paso a paso "anti bobos" como artifact de claude.ai, anonimizados y con datos configurables. Hace una versión completa para el técnico y otra repartida entre técnico y cliente, con la parte del cliente descargable para imprimir. Usala cuando el usuario pida un tutorial, una guía, un instructivo, un paso a paso o un manual para un cliente, o cuando pase la transcripción de un video tutorial o sus notas para convertirlas en guía, aunque no diga "artifact" ni "imprimible". También para corregir, ampliar o reimprimir una guía hecha con este formato.
---

# Guía paso a paso

> **Estado:** salió de una guía real (correo con dominio propio con Cloudflare Email Routing y Gmail, octubre 2026). El usuario la probó de punta a punta y la corrigió cinco veces. Esas correcciones son las reglas de abajo. La guía terminada está en `plantillas/correo-dominio-cloudflare-gmail.html`, en la raíz del repo. Todavía no tiene evaluaciones formales.

Produce una guía que alguien sin conocimientos técnicos puede seguir sola, con el papel en la mano, sin preguntar nada. Todo lo que sigue son decisiones que el usuario tomó o corrigió.

## Lo que el usuario espera de una guía

1. **Agnóstica a la persona.** Ningún dato real de la fuente (correos, dominios, nombres, cuentas) queda en la guía. Todo dato variable es un marcador configurable (`tudominio.com`, `tucuenta@gmail.com`, `Nombre del negocio`) que el usuario completa arriba de la página.
2. **Anti bobos.** Explícita en cada paso: dónde empezar, dónde está cada botón, qué pasa después y qué hacer si no pasa. Ver «Reglas anti bobos».
3. **Dos tutoriales cuando hay un cliente.** El tutorial 1 es para cuando el usuario hace todo él solo, con acceso a todas las cuentas. El tutorial 2 reparte el trabajo: qué hace el usuario (técnico) y qué hace el cliente en sus propias cuentas. Si no hay cliente, solo el tutorial 1.
4. **La parte del cliente se imprime.** El usuario la imprime y se la da al cliente, o va hasta donde está y aplica el tutorial 1. Por eso la guía del cliente tiene que funcionar sola, en papel.
5. **Configurable.** Los datos cargados arriba reemplazan los marcadores en toda la página, también en el archivo para imprimir.

## Tono

- **Voseo rioplatense**, directo, oraciones cortas.
- **Tutorial 1 y parte del técnico:** le habla al usuario de vos.
- **Guía del cliente:** habla el equipo, en primera persona del plural: «Te hemos dejado listo el dominio», «avisanos», «te vamos a mandar un correo». **Nunca «tu técnico».**
- En la guía del cliente no hay jerga. Términos como SMTP o MX aparecen solo si son el nombre literal de un campo que tiene que completar.
- Los botones se nombran como los ve la persona: un panel que solo existe en inglés (Cloudflare) va en inglés, y Google o Gmail en español. Al pie de la página se aclara que los textos pueden variar según el idioma de la cuenta.

## Reglas anti bobos

Cada paso tiene esta forma. Los componentes están en `assets/base.html`.

1. **«Empezá en» primero.** La URL directa a esa pantalla, escrita completa con `https://` para que se pueda tipear desde el papel, o la pantalla exacta en la que terminó el paso anterior. Nunca una ruta que arranque en el medio («Ver todos los ajustes → …» sin decir en qué página está ese botón).
2. **URL directa en lugar de «buscá».** Si la pantalla tiene un enlace directo (`myaccount.google.com/apppasswords`, `mail.google.com/mail/u/0/#settings/accounts`), se da ese enlace. No se le pide a nadie que busque una opción en un buscador interno.
3. **Si el enlace directo tiene trampa, también va el camino largo.** Ejemplo: `u/0` abre la primera cuenta con sesión iniciada. Se agrega «Si se abrió otra cuenta: engranaje → Ver todos los ajustes → pestaña…».
4. **Cada clic dice dónde, qué y cómo se ve.** Ubicación (arriba a la derecha, columna izquierda, debajo de X), tipo (botón azul, enlace, casilla, opción redonda, desplegable) y el texto exacto del control.
5. **Separar controles parecidos.** «Crear filtro es texto, al lado del botón azul Buscar; no hagas clic en Buscar».
6. **Campos que la app completa mal.** Se dice qué pone la app, qué tiene que quedar y cómo borrarlo (clic, Ctrl+A, borrar).
7. **Atajos explicados.** Ctrl+T (pestaña nueva), Ctrl+C / Ctrl+V, F5, y cómo copiar de una pestaña a otra.
8. **Resultado esperado** al final de cada paso, para que la persona sepa que lo hizo bien.
9. **«Si no ves…» en cada lugar donde alguien se traba.** Ventana emergente bloqueada por el navegador, ventana que quedó detrás, cuenta equivocada, correo que no llega (revisar Spam, esperar, F5), opción que no aparece porque faltó un paso anterior (decir cuál).
10. **Secretos de un solo uso** (contraseñas de aplicación, tokens, códigos):
    - avisar **antes** de que aparezcan: «No hagas clic en Listo todavía»;
    - dejar la pestaña abierta o pegarlo en un bloc de notas temporal;
    - decir en qué paso se usa y cuándo cerrar la pestaña y borrar la nota;
    - nunca pedirle al cliente que comparta contraseñas, tampoco con nosotros. Por eso existe el tutorial 2.
11. **Una cuenta, siempre la misma.** Si en el navegador puede haber varias cuentas abiertas, avisar que hay que mirar la foto de arriba a la derecha en cada pantalla.
12. **Advertencias que la fuente no menciona y rompen cosas** van en «Antes de empezar». Ejemplo: activar Email Routing reemplaza los registros MX existentes y deja sin correo a un dominio que ya lo tenía.

## Estructura

### Tutorial 1: configuración completa

1. Intro: para cuándo sirve y cuánto tarda.
2. **Antes de empezar:** requisitos y advertencias.
3. **Fases**, con pasos numerados del 1 en adelante sin cortar la numeración entre fases.
4. **Si algo falla:** síntoma → causa y arreglo, señalando el paso.
5. **Lista de verificación** con casillas.

### Tutorial 2: técnico + cliente

1. **Orden de trabajo:** la secuencia con chips Técnico / Cliente. Marca las dependencias que bloquean («el cliente no puede confirmar X hasta que vos hagas Y»).
2. **Tu parte (T1, T2…):** T1 es siempre «Pedir los datos al cliente», en una tabla que incluye las preguntas que pueden frenar todo. Los pasos que ya están en el tutorial 1 se remiten («Hacé los pasos 1 a 3 del tutorial 1») en vez de repetirse. Incluye avisarle al cliente cuando le toca y el paso de prueba final.
3. **Guía para el cliente (C1, C2…)**, completa y autónoma, sin remitir al tutorial 1:
   - título con su dirección o su dato principal;
   - intro en primera del plural («Te hemos dejado…»);
   - recuadro con sus datos;
   - **Antes de empezar:** usar computadora y no el celular, tener el teléfono a mano para códigos, saber su contraseña, qué es la barra de direcciones, revisar que la cuenta sea la suya;
   - nota «Tus contraseñas son tuyas»;
   - pasos con el mismo nivel de detalle que el tutorial 1 o más, cada uno con «avisanos» donde se pueda trabar;
   - cierre con cómo usarlo en el día a día.

Si no está claro qué parte hace cada uno, preguntarlo antes de armar el tutorial 2.

## Construcción

- **Partir de `assets/base.html`.** Copiarlo y reemplazar el contenido de ejemplo. Ya trae los tokens de color (claro y oscuro), las tipografías, las pestañas, los campos configurables, los componentes de paso, la guía del cliente y el botón de descarga. No rediseñar desde cero.
- **Componentes:** `.start` (Empezá en), `.do` (lista de acciones), `.result` (Resultado), `.path` (aclaraciones y «Si no ves…»), `.note` (advertencia, ámbar) y `.note.info` (dato útil), tablas Campo → Qué hacer, `.ui` (texto exacto de un control), `.role.tec` / `.role.cli`, `.step.client` (pasos del cliente en violeta).
- **Datos configurables:** cada campo es un `<input data-f="clave" placeholder="valor de ejemplo">`. El placeholder es el valor por defecto. Cada mención en el texto va en `<span class="ph" data-k="clave">valor de ejemplo</span>`. Los datos que se arman combinando otros (alias + dominio = dirección) van en la función `derivados()` del script.
- **Imprimir:** un artifact no puede abrir la ventana de impresión (`window.print()` no hace nada). El botón «Descargar guía para imprimir» usa la capacidad `downloads`: arma un HTML aparte con solo `#cliente`, en tema claro, que se imprime solo al abrirse y desde el que también se puede guardar como PDF. Publicar con `capabilities: {downloads: true}`. Antes de tocar ese código, cargar la skill `artifact-capabilities`.
- **Publicar** con la herramienta Artifact. Antes, cargar la skill `artifact-design` si el entorno la tiene. Título corto y específico (ej. «Correo con dominio propio»).
- **Botón «Mostrar solo la guía del cliente»:** queda, sirve para leerla con el cliente en pantalla.

## Flujo de trabajo

1. **Leer la fuente** (transcripción, notas, capturas). Sacar pasos, valores exactos, errores comunes y advertencias del autor.
2. **Anonimizar.** Listar todos los datos reales de la fuente y asignar a cada uno un marcador y un campo configurable.
3. **Verificar lo que cambia.** URLs, nombres de menús y pantallas pueden haber cambiado desde que se grabó el video. Si hay dudas, buscarlo antes de escribirlo. Si no se pudo verificar algo, decirlo al entregar.
4. **Definir roles.** ¿Hay cliente? ¿Qué cuentas tiene cada uno? Preguntar si no está claro.
5. **Armar** desde `assets/base.html`, primero el tutorial 1 y después el 2.
6. **Revisar antes de publicar:**
   - correr `node --check` sobre el script;
   - buscar en el archivo los datos reales de la fuente: no tiene que quedar ninguno;
   - leer cada paso preguntándose «¿sabe en qué página está?», «¿sabe dónde está el botón?», «¿qué hace si no aparece?».
7. **Publicar y entregar** en pocas líneas: qué tiene cada pestaña y qué agregaste que la fuente no tenía (advertencias, alternativas).

## Correcciones del usuario (no repetir)

| Lo que estaba mal | Cómo quedó |
|---|---|
| «Buscá "app" en la barra de búsqueda de la cuenta» | URL directa `https://myaccount.google.com/apppasswords` |
| La contraseña de aplicación se copiaba y se cerraba la ventana | «No hagas clic en Listo todavía», pestaña abierta o nota temporal, borrar al terminar |
| Pasos que empezaban por «Ver todos los ajustes → …» | Cada paso arranca con «Empezá en» y una URL o pantalla concreta |
| La guía del cliente decía «tu técnico» | Primera del plural: «te hemos dejado», «avisanos» |
| No había forma de imprimir solo la parte del cliente | Botón de descarga con autoimpresión (capacidad `downloads`) |

Una falsa alarma que conviene prever: al probar, el usuario creyó que la respuesta salía desde el Gmail personal. Por eso los pasos de prueba piden mirar el campo «De» antes de enviar y explican cómo cambiarlo.
