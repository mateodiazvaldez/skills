// Capturas de una app para los mockups, en tamaño de PC (1440×900 a 2x) o de celular (390×800 a 3x).
//
// Uso: node capturas_app.mjs <url-base> <carpeta-salida> <pc|movil> nombre=ruta [nombre=ruta ...] [--ocultar "selector css"]
//   Ej.: node capturas_app.mjs http://localhost:5173 capturas pc mis-apps=#/apps accesos=#/apps/turnos/accesos
//   --ocultar: elementos que no van en la captura (botones de desarrollo, banners de cookies).
// Correr desde una carpeta con `npm i playwright-core`. Usa Chrome (o CHROME_PATH, o el Chromium de Playwright).
// Si una pantalla necesita un estado (un diálogo abierto, un formulario), agregar el clic antes de la captura.
import { mkdirSync } from 'node:fs'
import { join } from 'node:path'
import { createRequire } from 'node:module'
import { pathToFileURL } from 'node:url'

const { chromium } = createRequire(pathToFileURL(process.cwd() + '/').href)('playwright-core')
async function launch() {
  if (process.env.CHROME_PATH) return chromium.launch({ executablePath: process.env.CHROME_PATH })
  try { return await chromium.launch({ channel: 'chrome' }) } catch { return chromium.launch() }
}

const PRESETS = {
  pc: { viewport: { width: 1440, height: 900 }, deviceScaleFactor: 2 },
  movil: { viewport: { width: 390, height: 800 }, deviceScaleFactor: 3, isMobile: true, hasTouch: true },
}
const args = process.argv.slice(2)
const hideAt = args.indexOf('--ocultar')
const hide = hideAt >= 0 ? args.splice(hideAt, 2)[1] : ''
const [baseUrl, out, preset, ...pairs] = args
if (!PRESETS[preset] || !pairs.length) { console.error('uso: node capturas_app.mjs <url-base> <carpeta> <pc|movil> nombre=ruta [...] [--ocultar "selector"]'); process.exit(1) }
mkdirSync(out, { recursive: true })

const browser = await launch()
const page = await (await browser.newContext({ ...PRESETS[preset], locale: 'es-AR' })).newPage()
for (const pair of pairs) {
  const [name, route] = pair.split(/=(.*)/s)
  // Git Bash convierte los argumentos que empiezan con / en rutas de Windows (/#1 → C:/Program Files/Git/#1)
  if (/^[A-Za-z]:[\\/]/.test(route)) { console.error(`${name}: la ruta «${route}» la convirtió Git Bash; usar MSYS_NO_PATHCONV=1 o rutas sin / inicial (#/apps)`); process.exit(1) }
  await page.goto(new URL(route, baseUrl).href, { waitUntil: 'networkidle' })
  if (hide) await page.addStyleTag({ content: `${hide}{display:none!important}` })
  await page.evaluate(() => document.fonts.ready)
  await page.waitForTimeout(1200)
  await page.screenshot({ path: join(out, `${name}.png`) })
  console.log(`${name}.png`)
}
await browser.close()
