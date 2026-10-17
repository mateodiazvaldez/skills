# Plantillas

Artifacts terminados que sirven de punto de partida. No se instalan con `npx skills add`: se copian a mano.

| Plantilla | Qué es | Hecha con |
|---|---|---|
| [`correo-dominio-cloudflare-gmail.html`](correo-dominio-cloudflare-gmail.html) | Guía para recibir y enviar correo con dominio propio, gratis, con Cloudflare Email Routing y Gmail. Trae el tutorial completo, el reparto técnico + cliente y la guía del cliente descargable para imprimir. | [`guia-paso-a-paso`](../skills/guia-paso-a-paso/SKILL.md) |

## Cómo usar una plantilla

1. Copiá el archivo y cambiá el contenido.
2. Publicalo como artifact de claude.ai. Si tiene botón de descarga, publicalo con `capabilities: {downloads: true}`.
3. Los archivos no tienen `<!doctype>`, `<html>` ni `<body>` porque el artifact los agrega al publicar. Para abrirlos sueltos en el navegador funcionan igual, salvo el botón de descarga, que solo anda dentro de claude.ai.
