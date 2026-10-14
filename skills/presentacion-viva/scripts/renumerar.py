"""Reordena, inserta o quita slides de un deck y renumera los pies.

Uso:
  python renumerar.py <root> [--insert ID --after ID] [--remove ID] [--order a,b,c]

<root> es la carpeta del deck: la de un artifact Slides (contiene project/deck.json
y project/slides/) o la de un deck HTML (contiene deck.json y slides/).
Imprime el mapa `files` (JSON) listo para publicar el artifact, con `null` para las
slides quitadas. En un deck HTML el reproductor numera solo; igual se renumeran los
archivos para que la copia imprimible quede bien. No publica nada.
"""
import argparse, json, pathlib, re, sys

# Convención de la plantilla: el número de página es el último <p> del pie.
NUM = re.compile(r'(<p style="font-size:24px;font-weight:700;color:#[0-9A-Fa-f]{6}">)(\d{2})(</p></div>)')


def layout(root):
    """Devuelve (carpeta con deck.json, prefijo de rutas para `files`)."""
    root = pathlib.Path(root)
    if (root / 'project' / 'deck.json').exists():
        return root / 'project', 'project/'
    if (root / 'deck.json').exists():
        return root, ''
    sys.exit(f'no encuentro deck.json en {root} ni en {root}/project')


def main():
    sys.stdout.reconfigure(encoding="utf-8"); sys.stderr.reconfigure(encoding="utf-8")  # consola de Windows
    ap = argparse.ArgumentParser()
    ap.add_argument('root')
    ap.add_argument('--insert'); ap.add_argument('--after')
    ap.add_argument('--remove')
    ap.add_argument('--order', help='lista completa de ids separada por comas')
    a = ap.parse_args()

    base, pre = layout(a.root)
    deck_p = base / 'deck.json'
    d = json.loads(deck_p.read_text(encoding='utf-8'))
    order = d['order']
    files = {}

    if a.order:
        new = [x.strip() for x in a.order.split(',') if x.strip()]
        assert sorted(new) == sorted(order), 'el nuevo orden debe tener exactamente las mismas slides'
        order = new
    if a.insert:
        assert a.after in order, f'--after {a.after} no está en el orden'
        assert a.insert not in order, f'{a.insert} ya está en el orden'
        assert (base / 'slides' / f'{a.insert}.html').exists(), f'falta {pre}slides/{a.insert}.html'
        order.insert(order.index(a.after) + 1, a.insert)
        files[f'{pre}slides/{a.insert}.html'] = f'{pre}slides/{a.insert}.html'
    if a.remove:
        assert a.remove in order, f'{a.remove} no está en el orden'
        i = order.index(a.remove)
        nxt = order[i + 1] if i + 1 < len(order) else order[i - 1]
        order.remove(a.remove)
        if d.get('cover') == a.remove:
            d['cover'] = order[0]
        for sec in d.get('sections', {}).values():
            if sec.get('start') == a.remove:
                sec['start'] = nxt
        f = base / 'slides' / f'{a.remove}.html'
        if f.exists():
            f.unlink()
        files[f'{pre}slides/{a.remove}.html'] = None

    d['order'] = order
    deck_p.write_text(json.dumps(d, ensure_ascii=False, indent=2), encoding='utf-8', newline='\n')

    renum = []
    for i, sid in enumerate(order, 1):
        p = base / 'slides' / f'{sid}.html'
        s = p.read_text(encoding='utf-8')
        hits = NUM.findall(s)
        if not hits:
            continue
        if len(hits) > 1:
            print(f'aviso: {sid} tiene {len(hits)} números de pie; se renumeran todos', file=sys.stderr)
        t = NUM.sub(lambda m: m.group(1) + f'{i:02d}' + m.group(3), s)
        if t != s:
            p.write_text(t, encoding='utf-8', newline='\n')
            files[f'{pre}slides/{sid}.html'] = f'{pre}slides/{sid}.html'
            renum.append(f'{sid}→{i:02d}')

    print(f'{len(order)} slides · renumeradas: {", ".join(renum) or "ninguna"}', file=sys.stderr)
    print(f'file_path: {pre}deck.json', file=sys.stderr)
    print(json.dumps(files, ensure_ascii=False))


if __name__ == '__main__':
    main()
