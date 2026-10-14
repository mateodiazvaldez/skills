#!/usr/bin/env node
/**
 * og-image.mjs
 * Genera la imagen para redes (Open Graph) 1200×630 en JPG con el sistema visual del sitio:
 * fondo, logo centrado, una barra de swatches de marca opcional y una franja al pie.
 * Sin botones dibujados (no se pueden clickear). JPG porque WhatsApp/Facebook/LinkedIn no muestran AVIF.
 *
 * Uso (desde la raíz del proyecto, que debe tener `sharp` instalado; Astro y Next lo traen):
 *   node <ruta-skill>/scripts/og-image.mjs --logo src/assets/logo.svg --out public/og-image.jpg \
 *     [--bg "#F5F5F5"] [--swatches "#0097B2,#D6247F,#FFE347,#002776"] [--footer "#002776"] \
 *     [--logo-width 820] [--logo-pad-left 0]
 *
 * --logo-pad-left: margen interno izquierdo del SVG (en unidades del viewBox) para alinear la barra
 * con el primer trazo del logo. Si el SVG no tiene margen, dejar 0.
 */
import { createRequire } from "node:module";
import fs from "node:fs";
import path from "node:path";

const args = Object.fromEntries(
    process.argv.slice(2).reduce((pairs, arg, i, all) => {
        if (arg.startsWith("--")) pairs.push([arg.slice(2), all[i + 1]]);
        return pairs;
    }, []),
);

if (!args.logo || !args.out) {
    console.error("Faltan --logo y --out. Ver el encabezado del script.");
    process.exit(1);
}

const require = createRequire(path.join(process.cwd(), "package.json"));
const sharp = require("sharp");

const W = 1200, H = 630;
const bg = args.bg ?? "#F5F5F5";
const swatches = args.swatches ? args.swatches.split(",") : [];
const footer = args.footer;
const logoW = Number(args["logo-width"] ?? 820);

const logoSvg = fs.readFileSync(args.logo);
const { width: viewBoxW = logoW } = await sharp(logoSvg).metadata();
const logo = await sharp(logoSvg, { density: 600 }).resize({ width: logoW }).png().toBuffer();
const { height: logoH } = await sharp(logo).metadata();

const left = Math.round((W - logoW) / 2);
const top = Math.round((H - logoH) / 2) + (swatches.length ? 10 : 0);
const padLeft = Math.round((Number(args["logo-pad-left"] ?? 0) * logoW) / viewBoxW);
const sq = 26, gap = 10;

const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}">
  <rect width="100%" height="100%" fill="${bg}"/>
  ${swatches
      .map((c, i) => `<rect x="${left + padLeft + i * (sq + gap)}" y="${top - sq - 34}" width="${sq}" height="${sq}" rx="4" fill="${c}"/>`)
      .join("")}
  ${footer ? `<rect y="${H - 18}" width="100%" height="18" fill="${footer}"/>` : ""}
</svg>`;

await sharp(Buffer.from(svg))
    .composite([{ input: logo, left, top }])
    .jpeg({ quality: 88, mozjpeg: true })
    .toFile(args.out);

console.log(`OK ${args.out} (${W}×${H})`);
