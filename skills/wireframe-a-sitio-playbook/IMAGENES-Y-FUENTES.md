# Imágenes y fuentes

## `sizes` con `object-cover`

Cuando una foto más ancha que su marco se muestra con `object-cover`, el navegador la escala **por altura**: el ancho renderizado es `alto del marco × proporción de la foto`, no el ancho del marco. Si `sizes` declara el ancho del marco, el navegador baja una versión demasiado chica y la agranda 1,5–2× (borrosa).

```ts
// Astro: un sizes por foto, según su proporción y la del marco
const FRAME_RATIO_MOBILE = 16 / 9;  // marco en mobile
const FRAME_RATIO_DESKTOP = 5 / 4;  // marco en desktop
const sizesFor = (image: ImageMetadata) => {
  const ratio = image.width / image.height;
  const mobile = Math.max(1, ratio / FRAME_RATIO_MOBILE);
  const desktop = Math.max(1, ratio / FRAME_RATIO_DESKTOP);
  return [
    `(max-width: 768px) ${Math.ceil(92 * mobile)}vw`,
    `(max-width: 1200px) ${Math.ceil(45 * desktop)}vw`,
    `${Math.ceil(540 * desktop)}px`,           // ancho máximo del marco en px
  ].join(", ");
};
```

Verificar en el navegador: `renderedWidth × devicePixelRatio / img.naturalWidth` ≤ 1.

- Fotos panorámicas: marco 16:9 en mobile (bajan menos bytes y recortan menos).
- Si el `.avif` del proyecto ya viene recomprimido (pesa muy poco para su resolución), usar el JPG/PNG original como fuente: el pipeline de imágenes vuelve a exportar AVIF.
- Calidad: ~65 en la imagen LCP y ~75 en las diferidas. Medir con Lighthouse A/B antes de subirla.
- Carrusel del hero: la primera foto con `fetchpriority="high"` y las demás en un `<template>` que se inyecta **3 s después de `load`**, para no competir con la carga inicial.
- La primera foto es la primera impresión: tiene que mostrar el rubro real.

## Fuentes sin CLS

Si el texto está **arriba** de un elemento grande (en mobile, el H1 sobre la foto), el cambio de fuente lo empuja. Solución: una fuente de respaldo con las métricas de la web font, más `preload` de la fuente del H1.

```css
@font-face {
  font-family: 'Montserrat Fallback';
  src: local('Arial');
  ascent-override: 84.95%;
  descent-override: 22.03%;
  line-gap-override: 0%;
  size-adjust: 113.93%;
}
/* --font-display: 'Montserrat', 'Montserrat Fallback', system-ui, sans-serif; */
```

Valores para otras fuentes: los publica `@capsizecss/metrics` (o los genera `next/font` / `fontaine`). Copiarlos, no inventarlos.

```html
<link rel="preload" href="/fonts/Display-Bold.woff2" as="font" type="font/woff2" crossorigin />
```

## Imagen para redes (Open Graph)

- **JPG 1200×630.** WhatsApp, Facebook y LinkedIn no muestran AVIF (y WebP es irregular).
- Con el sistema visual actual: fondo, logo y el detalle de marca. **Sin botones dibujados**: no se pueden clickear.
- Generarla con `node scripts/og-image.mjs` (usa `sharp`, que suele venir instalado con Astro o Next).
- `og:image` con URL absoluta (el `site` del framework tiene que ser el dominio de producción).
