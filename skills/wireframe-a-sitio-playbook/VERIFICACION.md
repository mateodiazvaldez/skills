# Verificación

Cada fase se cierra con esto. Lo visual se verifica con **estilos computados**, no mirando el código.

## 1. Navegador (Playwright MCP o `browser_run_code_unsafe`)

Anchos: **1440, 1024, 768 y 390**. Antes de capturar, scrollear toda la página para disparar el lazy-load y los reveals.

```js
// Scroll completo + overflow horizontal + estados que se suelen romper
async () => {
  const wait = (ms) => new Promise((r) => setTimeout(r, ms));
  for (let y = 0; y < document.body.scrollHeight; y += 350) { scrollTo(0, y); await wait(110); }
  scrollTo(0, 0);
  document.documentElement.style.overflowX = "visible";
  const overflow = [...document.querySelectorAll("body *")]
    .filter((e) => e.getBoundingClientRect().right > innerWidth + 1)
    .slice(0, 8).map((e) => e.tagName + "." + String(e.className).slice(0, 60));
  document.documentElement.style.overflowX = "";
  return { overflow };
};
```

Con `browser_hover` sobre cada CTA, leer `getComputedStyle(el).backgroundColor`, `translate` y `boxShadow`. Un fondo `rgba(0, 0, 0, 0)` en hover delata un token inexistente.

Chequeos mínimos:
- **Sin overflow** horizontal en 390.
- **Header** en una sola fila en 1024 (`offsetHeight` igual al token de altura).
- **Touch targets** ≥ 44px (CTA, menú, dots).
- **Inputs** ≥ 16px de fuente (evita el zoom en iOS).
- **Scrollspy**, menú mobile y links desde páginas internas.

Chrome headless por CLI (`--screenshot`) **no baja de ~500px** de ancho: maqueta a 500 y recorta, así que parece overflow cuando no lo hay. Para mobile usar Playwright.

## 2. Robustez del contenido que se revela

Si el sitio oculta contenido hasta que lo revela un script, probar los dos fallos con contextos nuevos:

```js
async (page) => {
  const browser = page.context().browser();
  const hidden = (p) => p.$$eval("[data-reveal]", (els) => els.filter((e) => getComputedStyle(e).opacity === "0").length);

  const noJs = await browser.newContext({ javaScriptEnabled: false });
  const p1 = await noJs.newPage(); await p1.goto(URL);
  const sinJs = await hidden(p1); await noJs.close();               // debe ser 0

  const broken = await browser.newContext();
  const p2 = await broken.newPage();
  await p2.addInitScript(() => {                                     // rompe el observer del reveal
    const IO = window.IntersectionObserver;
    window.IntersectionObserver = class extends IO { observe() { throw new Error("blocked"); } };
  });
  await p2.goto(URL); await p2.waitForTimeout(3300);
  const scriptRoto = await hidden(p2); await broken.close();         // debe ser 0 (red de seguridad)
  return { sinJs, scriptRoto };
};
```

## 3. Lighthouse A/B

Una sola corrida **no** prueba una regresión. El ruido de la máquina mueve Performance ±4 y Speed Index más de 1 s.

1. Build del commit base en un `git worktree` (copiar `node_modules`), build actual, cada uno servido en su puerto.
2. **Corridas alternadas** base/actual/base/actual (`bash scripts/lighthouse-ab.sh <ref-base> <corridas>`).
3. Si hay diferencia, mirar `audits.metrics.details.items[0]` (`observedFirstPaint`, `observedSpeedIndex`) y `screenshot-thumbnails`. Si la base también empeora en la misma tanda, es ruido.
4. Para un CLS > 0, `audits["layout-shifts"].details.items` dice qué elemento se movió.

Metas: CLS 0, Accessibility 100, Performance que no baje respecto de la base en corridas alternadas.

## 4. Cierre

- `astro check` (o el type-check del stack) en 0 errores, build sin errores y tests en verde.
- **Apagar** los servidores (`npm run dev`, `serve`) y borrar los worktrees temporales (`git worktree remove`, `git worktree prune`).
