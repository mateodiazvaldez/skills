// Arma la copia imprimible de un deck: cada <x-embed> pasa a ser la imagen de su estado final,
// sin builds ni video. El resultado se publica como un artifact Slides nuevo.
//
// Uso: node copia_imprimible.mjs <root-del-deck> <carpeta-salida> <mapa.json> [--skip id1,id2]
//   <root-del-deck>: artifact Slides (project/deck.json) o deck HTML (deck.json).
//   mapa.json: {"<slide>": ["<blob id del embed 0>", ...]} con los blob ids de las capturas ya subidas
//              (un string alcanza si la slide tiene un solo embed).
//   --skip: slides que no van en la copia (por ejemplo, la de la app en vivo).
// Salida: <carpeta-salida>/project/deck.json y project/slides/*.html.
import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'node:fs'
import { join } from 'node:path'

const args = process.argv.slice(2)
const skipAt = args.indexOf('--skip')
const skip = skipAt >= 0 ? args.splice(skipAt, 2)[1].split(',') : []
const [root, out, mapFile] = args
if (!root || !out || !mapFile) { console.error('uso: node copia_imprimible.mjs <root-del-deck> <carpeta-salida> <mapa.json> [--skip ids]'); process.exit(1) }

const base = existsSync(join(root, 'project', 'deck.json')) ? join(root, 'project') : root
const deck = JSON.parse(readFileSync(join(base, 'deck.json'), 'utf8'))
const map = JSON.parse(readFileSync(mapFile, 'utf8'))
const order = deck.order.filter(id => !skip.includes(id))
mkdirSync(join(out, 'project', 'slides'), { recursive: true })

const problems = []
for (const id of order) {
  let html = readFileSync(join(base, 'slides', `${id}.html`), 'utf8').replace(/\r\n/g, '\n')
  const title = html.match(/<h[12][^>]*>([^<]*)</)?.[1]?.trim() ?? id
  const blobs = [].concat(map[id] ?? [])
  let k = 0
  html = html.replace(/<x-embed style="([^"]*)">[\s\S]*?<\/x-embed>/g, (_, style) => {
    const blob = blobs[k++]
    if (!blob) { problems.push(`${id}: falta la imagen del embed ${k - 1} en el mapa`); return '' }
    return `<img src="/_blob/${blob}" alt="Gráfico: ${title}" style="${style};object-fit:contain">`
  })
  if (blobs.length > k) problems.push(`${id}: el mapa tiene ${blobs.length} imágenes y la slide ${k} embeds`)
  html = html
    .replace(/ data-build-in="[^"]*"/g, '')          // todo visible desde el principio
    .replace(/ data-video(-sound)?="[^"]*"/g, '')    // el video queda como su portada
    .replace(/(["(])assets\/([0-9a-f]{32})\.\w+/g, '$1/_blob/$2') // assets de un deck HTML → blobs del artifact
  if (/<iframe/.test(html)) problems.push(`${id}: tiene un <iframe> (app en vivo): pasarla con --skip o cambiarla por una captura`)
  writeFileSync(join(out, 'project', 'slides', `${id}.html`), html)
}

// la copia es un artifact nuevo: índice propio, sin las slides salteadas
const next = id => deck.order.slice(deck.order.indexOf(id)).find(x => order.includes(x)) ?? order.at(-1)
const copy = { ...deck, order, title: `${deck.title ?? 'Presentación'} · para imprimir`, createdOnFiles: { v: 1, at: new Date().toISOString() } }
if (copy.cover && !order.includes(copy.cover)) copy.cover = order[0]
for (const s of Object.values(copy.sections ?? {})) if (!order.includes(s.start)) s.start = next(s.start)
writeFileSync(join(out, 'project', 'deck.json'), JSON.stringify(copy, null, 2))

problems.forEach(p => console.error('PROBLEMA ', p))
console.log(`${order.length} slides en ${join(out, 'project')}`)
process.exit(problems.length ? 1 : 0)
