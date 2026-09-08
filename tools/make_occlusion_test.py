#!/usr/bin/env python3
"""Vérification demandée : poser le rendu (silhouette noire + traits verts,
fond transparent) sur une grande grille de points verte qui continue BIEN
au-delà de la forme, pour prouver que le polygone noir bouffe les points
qui tombent dessous et laisse voir ceux qui tombent à côté."""
import sys
import os
import numpy as np
import cairosvg
from PIL import Image
from shapely.geometry import LineString
from shapely.ops import unary_union

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from extract_hough import extract

BG = (2, 10, 4)
DOT = (60, 130, 80)
LINE = (70, 255, 130)


def build_transparent_svg(kept_coords, bbox, out_svg, contour_radius=16):
    x0, y0, x1, y1 = bbox
    w, h = x1 - x0, y1 - y0
    lines = [LineString([p1, p2]) for _, (p1, p2) in kept_coords]
    merged = unary_union([ln.buffer(contour_radius, cap_style=1, join_style=1) for ln in lines])
    if merged.geom_type == 'MultiPolygon':
        merged = max(merged.geoms, key=lambda g: g.area)
    contour_pts = list(merged.simplify(3).exterior.coords)
    contour_path = 'M ' + ' L '.join(f'{px-x0:.1f},{py-y0:.1f}' for px, py in contour_pts) + ' Z'

    parts = [f'<svg xmlns="http://www.w3.org/2000/svg" width="{w:.0f}" height="{h:.0f}" viewBox="0 0 {w:.0f} {h:.0f}">']
    # AUCUN rectangle de fond : le canevas reste transparent, seule la
    # silhouette est opaque (noire), pour se poser sur la grille du dessous
    parts.append(f'<path d="{contour_path}" fill="#000000" stroke="none"/>')
    for _, (p1, p2) in kept_coords:
        parts.append(f'<line x1="{p1[0]-x0:.1f}" y1="{p1[1]-y0:.1f}" x2="{p2[0]-x0:.1f}" y2="{p2[1]-y0:.1f}" '
                      f'stroke="#46ff82" stroke-width="3" stroke-linecap="round"/>')
    parts.append('</svg>')
    svg_text = '\n'.join(parts)
    with open(out_svg, 'w') as f:
        f.write(svg_text)
    return svg_text


def big_grid_canvas(O, u, v, size=(1800, 1200), margin_cells=6):
    W, H = size
    img = Image.new('RGBA', (W, H), BG + (255,))
    from PIL import ImageDraw
    d = ImageDraw.Draw(img)
    for i in range(-margin_cells, 40):
        for j in range(-margin_cells, 40):
            px = O[0] + i * u[0] + j * v[0]
            py = O[1] + i * u[1] + j * v[1]
            if 0 <= px <= W and 0 <= py <= H:
                d.ellipse([px - 3, py - 3, px + 3, py + 3], fill=DOT + (255,))
    return img


def occlusion_test(image_path, out_prefix, contour_radius=16, offset=(150, 150), **extract_kwargs):
    res = extract(image_path, out_prefix + '-occ', verbose=False, **extract_kwargs)
    kept = res['kept']
    O, u, v = res['basis']

    xs = [p[0] for _, (p1, p2) in kept for p in (p1, p2)]
    ys = [p[1] for _, (p1, p2) in kept for p in (p1, p2)]
    pad = 20
    bbox = (min(xs) - pad, min(ys) - pad, max(xs) + pad, max(ys) + pad)

    svg_path = f'{out_prefix}-transparent.svg'
    build_transparent_svg(kept, bbox, svg_path, contour_radius=contour_radius)
    shape_png = f'{out_prefix}-transparent.png'
    cairosvg.svg2png(url=svg_path, write_to=shape_png)
    shape_img = Image.open(shape_png).convert('RGBA')

    # la grande grille utilise la MÊME base (O,u,v) que le dessin d'origine,
    # décalée pour que la pose colle exactement aux points déjà utilisés
    ox, oy = offset
    O_canvas = np.array([O[0] - bbox[0] + ox, O[1] - bbox[1] + oy])
    canvas = big_grid_canvas(O_canvas, u, v, size=(int(shape_img.width + 2 * ox), int(shape_img.height + 2 * oy)))
    canvas.alpha_composite(shape_img, dest=(ox, oy))
    canvas.convert('RGB').save(f'{out_prefix}-occlusion-test.png')
    print(f'{image_path}: -> {out_prefix}-occlusion-test.png')


if __name__ == '__main__':
    image_path, out_prefix = sys.argv[1], sys.argv[2]
    extra = {}
    for a in sys.argv[3:]:
        k, val = a.split('=')
        extra[k] = float(val) if '.' in val else int(val)
    occlusion_test(image_path, out_prefix, **extra)
