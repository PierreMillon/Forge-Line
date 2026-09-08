#!/usr/bin/env python3
"""Génère, pour un croquis donné : un vrai fichier .svg (silhouette noire
pleine + traits verts, sur fond noir avec la grille isométrique de points),
et une image de comparaison côte à côte avec l'original."""
import sys
import os
import numpy as np
import cairosvg
from PIL import Image
from shapely.geometry import LineString
from shapely.ops import unary_union

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from extract_hough import extract


def silhouette_path(kept_coords, x0, y0, contour_radius=16):
    """Un seul contour ("ballon qu'on dégonfle" autour du dessin) — mais un
    léger défaut d'arrondi au recalage sur la grille peut laisser deux
    arêtes censées partager un sommet à quelques pixels l'une de l'autre
    (ex. cheval de Troie : dos/pattes trop loin du corps pour se souder à
    un petit rayon). Ne JAMAIS garder que le plus gros morceau si le
    résultat se coupe en plusieurs polygones — dessiner tous les
    morceaux, sinon des bouts entiers du dessin (pattes, dos) restent
    sans remplissage alors qu'ils font bien partie de la même forme.
    """
    lines = [LineString([p1, p2]) for _, (p1, p2) in kept_coords]
    merged = unary_union([ln.buffer(contour_radius, cap_style=1, join_style=1) for ln in lines])
    polys = list(merged.geoms) if merged.geom_type == 'MultiPolygon' else [merged]
    path_parts = []
    for poly in polys:
        pts = list(poly.simplify(3).exterior.coords)
        path_parts.append('M ' + ' L '.join(f'{px-x0:.1f},{py-y0:.1f}' for px, py in pts) + ' Z')
    return ' '.join(path_parts)


def build_svg(kept_coords, basis, bbox, out_svg, contour_radius=16, grid_step=None):
    O, u, v = basis
    x0, y0, x1, y1 = bbox
    w, h = x1 - x0, y1 - y0

    # silhouette : on "gonfle" chaque segment de trait puis on fusionne le
    # tout — exactement l'idée de la corde tendue autour du dessin
    contour_path = silhouette_path(kept_coords, x0, y0, contour_radius=contour_radius)

    # grille de points isométrique (même pas que le croquis d'origine)
    dots = []
    if grid_step is None:
        grid_step = u, v
    uu, vv = grid_step
    for i in range(-3, 30):
        for j in range(-3, 30):
            px = O[0] + i * uu[0] + j * vv[0]
            py = O[1] + i * uu[1] + j * vv[1]
            if x0 - 40 <= px <= x1 + 40 and y0 - 40 <= py <= y1 + 40:
                dots.append((px - x0, py - y0))

    parts = [f'<svg xmlns="http://www.w3.org/2000/svg" width="{w:.0f}" height="{h:.0f}" viewBox="0 0 {w:.0f} {h:.0f}">']
    parts.append(f'<rect x="0" y="0" width="{w:.0f}" height="{h:.0f}" fill="#020a04"/>')
    for px, py in dots:
        parts.append(f'<circle cx="{px:.1f}" cy="{py:.1f}" r="2.2" fill="#3a3a3a"/>')
    # silhouette pleine : bloque la grille derrière, posée AVANT les traits
    parts.append(f'<path d="{contour_path}" fill="#000000" stroke="none"/>')
    for _, (p1, p2) in kept_coords:
        parts.append(f'<line x1="{p1[0]-x0:.1f}" y1="{p1[1]-y0:.1f}" x2="{p2[0]-x0:.1f}" y2="{p2[1]-y0:.1f}" '
                      f'stroke="#46ff82" stroke-width="3" stroke-linecap="round"/>')
    parts.append('</svg>')
    svg_text = '\n'.join(parts)
    with open(out_svg, 'w') as f:
        f.write(svg_text)
    return svg_text


def compare(image_path, out_prefix, contour_radius=16, **extract_kwargs):
    res = extract(image_path, out_prefix, verbose=True, **extract_kwargs)
    kept = res['kept']
    O, u, v = res['basis']

    xs = [p[0] for _, (p1, p2) in kept for p in (p1, p2)]
    ys = [p[1] for _, (p1, p2) in kept for p in (p1, p2)]
    pad = 40
    bbox = (min(xs) - pad, min(ys) - pad, max(xs) + pad, max(ys) + pad)

    svg_path = f'{out_prefix}.svg'
    build_svg(kept, (O, u, v), bbox, svg_path, contour_radius=contour_radius)
    png_path = f'{out_prefix}-svg.png'
    cairosvg.svg2png(url=svg_path, write_to=png_path)

    orig = Image.open(image_path).convert('RGB')
    ocrop = orig.crop((max(0, int(bbox[0])), max(0, int(bbox[1])),
                        min(orig.width, int(bbox[2])), min(orig.height, int(bbox[3]))))
    rendered = Image.open(png_path).convert('RGB')
    # même hauteur pour les deux côté à côte
    target_h = 700
    def resize_h(img, th):
        r = th / img.height
        return img.resize((int(img.width * r), th))
    ocrop_r = resize_h(ocrop, target_h)
    rendered_r = resize_h(rendered, target_h)
    gap = 20
    combo = Image.new('RGB', (ocrop_r.width + gap + rendered_r.width, target_h + 40), (10, 10, 10))
    combo.paste(ocrop_r, (0, 40))
    combo.paste(rendered_r, (ocrop_r.width + gap, 40))
    combo.save(f'{out_prefix}-compare.png')
    print(f'  -> {svg_path}, {out_prefix}-compare.png')
    return res


if __name__ == '__main__':
    image_path, out_prefix = sys.argv[1], sys.argv[2]
    extra = {}
    for a in sys.argv[3:]:
        k, val = a.split('=')
        extra[k] = float(val) if '.' in val else int(val)
    compare(image_path, out_prefix, **extra)
