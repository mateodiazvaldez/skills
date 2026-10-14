# Mockups de PC y celular

La mayoría de las presentaciones no los necesita. Cuando hay un producto con pantallas (una app, un sitio, un prototipo), una captura dentro de un marco de dispositivo explica más que cualquier texto. Todo esto funciona en el artifact Slides, con elementos nativos: las fotos y capturas no entran en un `<x-embed>` porque no carga imágenes. En el deck HTML funciona igual.

## Contenido
1. Capturas
2. Marco de PC (ventana de navegador)
3. Marco de celular
4. PC y celular juntos
5. Señalar partes de la pantalla
6. Varias pantallas seguidas
7. Datos de ejemplo

## 1. Capturas

| Dispositivo | Viewport de captura | Escala | Se muestra en la slide |
|---|---|---|---|
| PC | 1440×900 | 2x | 1152×720 (16:10) |
| Celular | 390×800 | 3x | 328×672 (debajo de una barra de estado de 40 px) |

- Sacarlas desde la app con `scripts/capturas_app.mjs` (Playwright): mismo tamaño siempre, fuentes cargadas, sin botones flotantes de desarrollo. Así, cuando cambia algo de la app (por ejemplo, los nombres de ejemplo), se regeneran todas iguales.
  ```bash
  node <skill>/scripts/capturas_app.mjs http://localhost:5173 capturas/ pc mis-apps=#/apps accesos=#/apps/turnos/accesos
  node <skill>/scripts/capturas_app.mjs http://localhost:5173 capturas/ movil inicio=./ --ocultar ".dev-fab"
  ```
- En Git Bash, anteponer `MSYS_NO_PATHCONV=1` o escribir las rutas sin `/` inicial (`#/apps`): si no, `/#/apps` se convierte en una ruta de Windows. El script lo detecta y corta.
- Si la pantalla necesita un estado (un diálogo abierto, un formulario a medio llenar), extender el script con el clic o la acción antes de la captura.
- Si no hay app, usar las imágenes que dé el usuario o las del design system. Nunca inventar una interfaz que el producto no tiene.
- Subirlas como assets del artifact (`publish` con `asset: true`) y usar el `url` que devuelve en `<img src>`.

## 2. Marco de PC (ventana de navegador)

Barra con tres puntos neutros y la URL, y la captura debajo. Los puntos van en gris, no en rojo, amarillo y verde, para no meter colores ajenos a la marca.

```html
<div id="mock" style="position:absolute;left:640px;top:170px;width:1152px;height:770px;display:flex;flex-direction:column;background:#FFFFFF;border:1px solid #DCE3DD;border-radius:16px;box-shadow:0px 24px 64px rgba(31,74,42,0.16);overflow:hidden">
<div style="height:48px;display:flex;flex-direction:row;align-items:center;gap:10px;padding:0px 18px;background:#EEF1EE">
<div style="width:14px;height:14px;border-radius:50%;background:#C9D1CB"></div>
<div style="width:14px;height:14px;border-radius:50%;background:#C9D1CB"></div>
<div style="width:14px;height:14px;border-radius:50%;background:#C9D1CB"></div>
<p style="font-size:24px;line-height:1.3;color:#56605A;background:#FFFFFF;border-radius:999px;padding:0px 20px">app.producto.com/mis-apps</p>
</div>
<img src="/_blob/CAPTURA_PC" alt="Pantalla Mis apps: …" style="width:1152px;height:720px;object-fit:cover">
</div>
```

A la izquierda del marco quedan unos 460 px para el título y 3 viñetas cortas.

## 3. Marco de celular

Bisel oscuro, pantalla con esquinas redondeadas, isla arriba y barra de estado pintada encima de la captura.

```html
<div id="mock-movil" style="position:absolute;left:1380px;top:170px;width:356px;height:740px;background:#1B2620;border-radius:56px;padding:14px;box-shadow:0px 24px 64px rgba(31,74,42,0.16)">
<div style="position:relative;width:328px;height:712px;border-radius:44px;overflow:hidden;background:#FFFFFF">
<div style="height:40px;display:flex;flex-direction:row;align-items:center;justify-content:space-between;padding:0px 28px;background:#FFFFFF"><p style="font-size:24px;font-weight:700;color:#1B2620">9:41</p></div>
<img src="/_blob/CAPTURA_MOVIL" alt="Pantalla de inicio en el celular: …" style="width:328px;height:672px;object-fit:cover">
<div style="position:absolute;left:114px;top:10px;width:100px;height:28px;border-radius:14px;background:#1B2620"></div>
</div>
</div>
```

Pintar la barra de estado del mismo color que el encabezado de la app, así parece una sola pantalla.

## 4. PC y celular juntos

Para mostrar que el producto se adapta, el marco de PC más chico (por ejemplo 960×642, con la captura en 960×600) y el celular adelante, abajo a la derecha, superpuesto unos 120 px. El celular va después en el HTML, así queda por encima. El título dice qué se adapta, no «responsive».

## 5. Señalar partes de la pantalla

- Anillos (div con `border:3px solid` del acento, sin fondo) sobre la zona y un hexágono numerado al costado, con el mismo número que la viñeta. Así se recorre la pantalla mientras se habla.
- Para ubicarlos, medir sobre la captura. La escala es el ancho mostrado dividido por el ancho de la captura (1152/2880 = 0,4 en PC), más el desplazamiento del marco.
- Que aparezcan solos (`data-build-in` con `auto`) no está verificado en el artifact: si se usa, pedir que se pruebe en modo presentación. Lo seguro es que estén siempre visibles, que además es lo que se imprime.
- En el deck HTML los build `auto` sí corren solos.

## 6. Varias pantallas seguidas

- Una slide por pantalla, con el marco en el mismo lugar y el mismo `id` en las dos slides, más `data-transition="magic"` en la primera. Así el marco queda quieto y solo cambia la captura.
- Contar una historia con un hilo: la persona del ejemplo pasa por las pantallas (Mis apps → Accesos → quitar acceso). Las notas lo anticipan: «en la slide siguiente se le quita el acceso».
- Pie: «Datos de ejemplo».

## 7. Datos de ejemplo

- Nombres neutros que no coincidan con compañeros, el docente ni gente del curso. Si el usuario no da nombres, preguntar o usar nombres comunes y avisarlo.
- Emails, URLs y montos verosímiles y coherentes entre todas las capturas y el video.
- Si se cambia un nombre, cambiarlo en todos lados: capturas (regenerarlas), animaciones, notas y video.
