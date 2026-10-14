#!/usr/bin/env bash
# lighthouse-ab.sh
# Compara Lighthouse mobile entre un commit base y el estado actual, con corridas ALTERNADAS
# (base, actual, base, actual…) para separar ruido de la máquina de regresiones reales.
#
# Uso (desde la raíz del proyecto, con git y npm):
#   bash <ruta-skill>/scripts/lighthouse-ab.sh <ref-base> [corridas=2]
# Variables opcionales: BUILD_CMD (default "npm run build"), DIST (default "dist").
#
# Sirve cada build con un servidor estático de Node (no `npx serve`: en Windows deja procesos
# huérfanos al cortarlo) y limpia worktree y servidores al salir.
set -euo pipefail

BASE_REF="${1:?Uso: lighthouse-ab.sh <ref-base> [corridas]}"
RUNS="${2:-2}"
BUILD_CMD="${BUILD_CMD:-npm run build}"
DIST="${DIST:-dist}"
ROOT="$(pwd)"
TMP="$(mktemp -d)"
BASE_DIR="$TMP/base"
PIDS=()

cleanup() {
    for pid in "${PIDS[@]}"; do kill "$pid" 2>/dev/null || true; done
    git -C "$ROOT" worktree remove --force "$BASE_DIR" 2>/dev/null || true
    git -C "$ROOT" worktree prune
    rm -rf "$TMP"
}
trap cleanup EXIT

serve() { # serve <dir> <port>
    node -e '
const http = require("http"), fs = require("fs"), path = require("path");
const [root, port] = process.argv.slice(1);
const types = { ".html":"text/html", ".js":"text/javascript", ".css":"text/css", ".svg":"image/svg+xml",
  ".avif":"image/avif", ".webp":"image/webp", ".jpg":"image/jpeg", ".png":"image/png", ".woff2":"font/woff2" };
http.createServer((req, res) => {
  let file = path.join(root, decodeURIComponent(req.url.split("?")[0]));
  if (fs.existsSync(file) && fs.statSync(file).isDirectory()) file = path.join(file, "index.html");
  if (!fs.existsSync(file)) { res.writeHead(404); return res.end(); }
  res.writeHead(200, { "Content-Type": types[path.extname(file)] || "application/octet-stream" });
  fs.createReadStream(file).pipe(res);
}).listen(Number(port));' "$1" "$2" &
    PIDS+=("$!")
}

echo "▸ Build actual"
eval "$BUILD_CMD" >/dev/null
cp -r "$DIST" "$TMP/current"

echo "▸ Build base ($BASE_REF) en worktree"
git worktree add --detach "$BASE_DIR" "$BASE_REF" >/dev/null
cp -r node_modules "$BASE_DIR/"
(cd "$BASE_DIR" && eval "$BUILD_CMD" >/dev/null)

serve "$BASE_DIR/$DIST" 5101
serve "$TMP/current" 5102
sleep 2

printf "\n%-8s %-5s %5s %8s %8s %6s\n" "build" "run" "perf" "LCP" "SI" "CLS"
for i in $(seq 1 "$RUNS"); do
    for side in base:5101 actual:5102; do
        name="${side%%:*}"; port="${side##*:}"
        out="$TMP/lh-$name-$i.json"
        npx -y lighthouse "http://localhost:$port/" --quiet --chrome-flags="--headless=new" \
            --only-categories=performance --output=json --output-path="$out" >/dev/null 2>&1
        node -e '
const r = require(process.argv[1]), a = r.audits;
const row = [process.argv[2], process.argv[3], Math.round(r.categories.performance.score * 100),
  a["largest-contentful-paint"].displayValue, a["speed-index"].displayValue, a["cumulative-layout-shift"].displayValue];
console.log(row[0].padEnd(8), String(row[1]).padEnd(5), String(row[2]).padStart(5), row[3].padStart(8), row[4].padStart(8), row[5].padStart(6));' "$out" "$name" "$i"
    done
done
echo
echo "Si la base también varía entre corridas, la diferencia es ruido. Ver VERIFICACION.md §3."
