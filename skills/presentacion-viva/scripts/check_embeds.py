"""Valida las slides de un deck antes de publicar o imprimir.

Uso:
  python check_embeds.py <root> [ids...]

<root> es la carpeta del deck: artifact Slides (project/slides/) o deck HTML (slides/).
Sin ids, revisa todas.
Errores (salida 1): más de una <section>, notas de más de 4000 caracteres,
embed de más de 16 KB, más de 8 embeds, body transparente, prefers-reduced-motion,
JS con error de sintaxis (si hay node instalado).
Avisos: tamaños de fuente menores a 24 px dentro de un embed, y animaciones sin
estado final (no leen window.PRINT): pueden imprimirse vacías o a medio camino.
"""
import pathlib, re, shutil, subprocess, sys, tempfile


def slides_dir(root):
    root = pathlib.Path(root)
    for c in (root / 'project' / 'slides', root / 'slides'):
        if c.is_dir():
            return c
    sys.exit(f'no encuentro slides/ en {root} ni en {root}/project')


def main():
    sys.stdout.reconfigure(encoding="utf-8"); sys.stderr.reconfigure(encoding="utf-8")  # consola de Windows
    root = slides_dir(sys.argv[1])
    ids = sys.argv[2:]
    files = [root / f'{i}.html' for i in ids] if ids else sorted(root.glob('*.html'))
    node = shutil.which('node')
    errs, warns = [], []
    tmp = pathlib.Path(tempfile.mkdtemp())
    for f in files:
        s = f.read_text(encoding='utf-8'); sid = f.stem
        if s.count('<section ') != 1: errs.append(f'{sid}: debe tener exactamente una <section>')
        aside = re.findall(r'<aside>(.*?)</aside>', s, re.S)
        if len(aside) > 1: errs.append(f'{sid}: más de un <aside>')
        if aside and len(aside[0]) > 4000: errs.append(f'{sid}: notas de {len(aside[0])} caracteres (máx. 4000)')
        embeds = re.findall(r'<x-embed[^>]*>(.*?)</x-embed>', s, re.S)
        if len(embeds) > 8: errs.append(f'{sid}: {len(embeds)} embeds (máx. 8)')
        for k, e in enumerate(embeds):
            n = len(e.encode('utf-8'))
            if n > 16384: errs.append(f'{sid}#{k}: embed de {n} bytes (máx. 16384)')
            if re.search(r'body\{[^}]*background:\s*transparent', e): errs.append(f'{sid}#{k}: body transparente (los embeds se ven opacos)')
            if 'prefers-reduced-motion' in e: errs.append(f'{sid}#{k}: usa prefers-reduced-motion (el usuario no lo quiere)')
            small = sorted({int(x) for x in re.findall(r'font-size:\s*(\d+)px', e) if int(x) < 24})
            if small: warns.append(f'{sid}#{k}: font-size menor a 24 px: {small}')
            if '<script' in e and 'PRINT' not in e:
                warns.append(f'{sid}#{k}: sin estado final (no lee window.PRINT); revisar cómo sale impresa')
            if node:
                for j, js in enumerate(re.findall(r'<script>(.*?)</script>', e, re.S)):
                    p = tmp / f'{sid}-{k}-{j}.js'; p.write_text(js, encoding='utf-8')
                    r = subprocess.run([node, '--check', str(p)], capture_output=True, text=True)
                    if r.returncode: errs.append(f'{sid}#{k}: error de sintaxis JS: {r.stderr.strip().splitlines()[-1] if r.stderr.strip() else "?"}')
    for w in warns: print('AVISO ', w)
    for e in errs: print('ERROR ', e)
    print(f'{len(files)} slides revisadas · {len(errs)} errores · {len(warns)} avisos' + ('' if node else ' · (sin node: no se revisó la sintaxis JS)'))
    sys.exit(1 if errs else 0)


if __name__ == '__main__':
    main()
