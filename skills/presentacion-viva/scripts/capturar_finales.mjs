// Captura el estado final de cada animación (<x-embed>) de un deck, a 2x, para la copia imprimible.
//
// Uso: node capturar_finales.mjs <root-del-deck> <carpeta-salida> [id1,id2,...] [--ms N]
//   <root-del-deck>: artifact Slides (contiene project/deck.json) o deck HTML (contiene deck.json).
//   --ms N: espera antes de capturar (1500 por defecto). Para animaciones viejas sin FINAL(), usar 8000.
// Correr desde una carpeta con `npm i playwright-core`. Usa Chrome (o CHROME_PATH, o el Chromium de Playwright).
// Salida: <id>-<k>.png por embed y hoja.html para revisarlas todas juntas.
import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'node:fs'
import { join } from 'node:path'
import { createRequire } from 'node:module'
import { pathToFileURL } from 'node:url'

const { chromium } = createRequire(pathToFileURL(process.cwd() + '/').href)('playwright-core')
async function launch() {
  if (process.env.CHROME_PATH) return chromium.launch({ executablePath: process.env.CHROME_PATH })
  try { return await chromium.launch({ channel: 'chrome' }) } catch { return chromium.launch() }
}

const args = process.argv.slice(2)
const msAt = args.indexOf('--ms')
const ms = msAt >= 0 ? +args.splice(msAt, 2)[1] : 1500
const [root, out, only] = args
if (!root || !out) { console.error('uso: node capturar_finales.mjs <root-del-deck> <carpeta-salida> [ids] [--ms N]'); process.exit(1) }

const base = existsSync(join(root, 'project', 'deck.json')) ? join(root, 'project') : root
const deck = JSON.parse(readFileSync(join(base, 'deck.json'), 'utf8'))
// acá sí hay red: se inyecta la fuente de marca, y window.PRINT deja cada animación en su estado final
const head = Object.values(deck.faces ?? {}).map(f => f.href ? `<link rel="stylesheet" href="${f.href}">` : '').join('') + '<script>window.PRINT=1</script>'
mkdirSync(out, { recursive: true })

const browser = await launch()
const shots = []
for (const id of only ? only.split(',') : deck.order) {
  const html = readFileSync(join(base, 'slides', `${id}.html`), 'utf8')
  const embeds = [...html.matchAll(/<x-embed style="([^"]*)">([\s\S]*?)<\/x-embed>/g)]
  for (const [k, [, style, doc]] of embeds.entries()) {
    const w = +style.match(/width:\s*(\d+)px/)[1], h = +style.match(/height:\s*(\d+)px/)[1]
    const page = await browser.newPage({ viewport: { width: w, height: h }, deviceScaleFactor: 2 })
    await page.setContent(doc.replace(/<head>/i, '<head>' + head), { waitUntil: 'load' })
    await page.evaluate(() => document.fonts.ready)
    await page.waitForTimeout(ms)
    const file = `${id}-${k}.png`
    await page.screenshot({ path: join(out, file) })
    await page.close()
    shots.push({ id, k, file, w, h })
    console.log(file)
  }
}
await browser.close()

writeFileSync(join(out, 'hoja.html'), '<!doctype html><meta charset="utf-8"><title>Estados finales</title>' +
  '<style>body{margin:0;padding:16px;background:#ddd;font:14px system-ui,sans-serif;display:grid;grid-template-columns:repeat(auto-fill,minmax(560px,1fr));gap:16px}' +
  'figure{margin:0;background:#fff;padding:8px}img{width:100%;display:block;border:1px solid #bbb}figcaption{padding-top:6px}</style>' +
  shots.map(s => `<figure><img src="${s.file}" alt=""><figcaption>${s.id} · embed ${s.k} · ${s.w}×${s.h}</figcaption></figure>`).join(''))
console.log(`${shots.length} capturas · hoja de contactos: ${join(out, 'hoja.html')}`)
