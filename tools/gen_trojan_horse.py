#!/usr/bin/env python3
# v17.75 — réextrait le cheval de Troie depuis references/cheval-de-troie.png
# (croquis de Pierre sur grille aimantée) et le reprojette dans le style 2:1
# du jeu, prêt à coller dans index.html.
#
# Pourquoi ce script existe : la version en jeu jusqu'en v17.74 avait des
# coordonnées tapées à la main (14 points ronds, 7 polylignes) qui ne
# ressemblaient pas au croquis une fois agrandies — Pierre : "remontre-moi
# le dessin du cheval de Troie, parce que j'ai un doute là... il faut que tu
# le redessines par rapport à la référence que je t'avais donnée". Le
# croquis, lui, est sur grille aimantée : il n'y a aucune raison
# d'approximer quoi que ce soit (cf. tools/README.md, "zéro approximation").
#
# Usage : python3 tools/gen_trojan_horse.py
# Écrit tools/out_trojan_horse.js (TROJAN_EDGES / TROJAN_SILHOUETTE).
#
# Étapes :
# 1. Recadre l'image pour enlever l'interface de l'appli de dessin (barre
#    d'état, outils, boutons PNG/SVG) — sinon Hough prend les icônes pour
#    des traits.
# 2. extract_hough.py (méthode validée, voir tools/README.md) : détecte la
#    grille isométrique par moindres carrés sur TOUS les points, détecte les
#    segments par transformée de Hough, recale chaque extrémité sur un nœud,
#    et rejette tout seul les arêtes qui ne suivent pas un vrai trait blanc.
#    Mesuré ici : 43 arêtes gardées, 7 rejetées, complétude 100% (aucun
#    trait du croquis manqué).
# 3. Dédoublonne les segments : Hough renvoie souvent une ligne entière ET
#    ses moitiés. Superposés, ils ne changent rien à une image opaque, mais
#    le trait du jeu est semi-transparent (PHOSPHOR_GREEN, alpha 0.92) —
#    deux traits l'un sur l'autre rendraient donc plus lumineux que les
#    autres, un artefact bien visible. On ne garde que les segments
#    maximaux (43 -> 29).
# 4. Reprojette (i,j) -> écran avec le ratio 2:1 du jeu (A=7.5, B=A/2) au
#    lieu du 30° d'origine — même convention que gen_snow_tower.py et
#    gen_wall_tiles.py, un simple changement d'unité qui ne déforme rien.
# 5. Normalise : centré horizontalement, pieds (y max) à 0 — pour que
#    drawTrojanHorseShape(cx, cy, ...) pose le cheval SUR le point donné,
#    comme drawEnemyShape le fait pour les autres ennemis.
# 6. Silhouette pleine par la méthode "corde tendue" validée (chaque trait
#    gonflé d'un rayon fixe puis union shapely) — indispensable ici :
#    polygonize seul ne trouve que 2 faces fermées, les pattes du croquis
#    étant dessinées en traits ouverts.

import json
import sys
import os

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from extract_hough import extract
from shapely.geometry import LineString
from shapely.ops import unary_union
from PIL import Image

REF = 'references/cheval-de-troie.png'
CROP_BOX = (0, 250, 923, 1750)  # enlève l'interface de l'appli (haut et bas)
A = 7.5           # échelle horizontale — même convention que les autres générateurs
B = A * 0.5       # ratio 2:1 du jeu (au lieu du 30° du croquis)
SIL_RADIUS = 2.2  # rayon de la "corde tendue", en unités natives


def collinear_contains(big, small):
    """`big` contient-il entièrement `small`, sur la même droite ?"""
    (ax, ay), (bx, by) = big
    (cx, cy), (dx, dy) = small
    if big == small:
        return False
    ux, uy = bx - ax, by - ay

    def cross(px, py):
        return ux * (py - ay) - uy * (px - ax)

    if cross(cx, cy) != 0 or cross(dx, dy) != 0:
        return False
    L = ux * ux + uy * uy

    def t(px, py):
        return ux * (px - ax) + uy * (py - ay)

    return 0 <= t(cx, cy) <= L and 0 <= t(dx, dy) <= L


def main():
    tmp_crop = '/tmp/trojan_crop.png'
    Image.open(REF).convert('RGB').crop(CROP_BOX).save(tmp_crop)

    r = extract(tmp_crop, '/tmp/trojan_extract', verbose=True)
    edges = [k for k, _ in r['kept']]
    if r['completeness'] < 0.95:
        raise SystemExit(f"complétude trop basse ({r['completeness']:.2f}) : des traits sont manqués")

    maximal = [e for e in edges if not any(collinear_contains(o, e) for o in edges)]
    print(f'  dédoublonnage (segments maximaux) : {len(edges)} -> {len(maximal)}')

    def proj(i, j):
        return ((i - j) * A, (i + j) * B)

    pts = [proj(*p) for e in maximal for p in e]
    xmin, xmax = min(p[0] for p in pts), max(p[0] for p in pts)
    ymax = max(p[1] for p in pts)
    cx = (xmin + xmax) / 2

    def norm(i, j):
        x, y = proj(i, j)
        return (round(x - cx, 2), round(y - ymax, 2))

    out_edges = [(norm(*a), norm(*b)) for a, b in maximal]
    native_w = xmax - xmin
    native_h = ymax - min(p[1] for p in pts)
    print(f'  natif : {native_w} x {native_h} (centré en x, pieds à y=0)')

    lines = [LineString([norm(*a), norm(*b)]) for a, b in maximal]
    sil = unary_union([l.buffer(SIL_RADIUS, cap_style=2, join_style=2) for l in lines])
    geoms = list(sil.geoms) if sil.geom_type == 'MultiPolygon' else [sil]
    # simplifie légèrement : le buffer produit beaucoup de points quasi
    # alignés, inutiles pour un remplissage plein
    polys = [list(g.simplify(0.15).exterior.coords)[:-1] for g in geoms]
    print(f'  silhouette : {len(polys)} morceau(x), {sum(len(p) for p in polys)} points')

    def js_pt(p):
        return f'{{x:{round(p[0], 2)},y:{round(p[1], 2)}}}'

    out = []
    out.append('// AUTO-GÉNÉRÉ par tools/gen_trojan_horse.py depuis\n')
    out.append('// references/cheval-de-troie.png — ne pas modifier à la main.\n')
    out.append(f'const TROJAN_NATIVE_W = {native_w};\n')
    out.append(f'const TROJAN_NATIVE_H = {native_h};\n')
    out.append('const TROJAN_EDGES = [\n')
    for a, b in out_edges:
        out.append(f'  [{js_pt(a)}, {js_pt(b)}],\n')
    out.append('];\n')
    out.append('const TROJAN_SILHOUETTE = [\n')
    for poly in polys:
        out.append('  [' + ', '.join(js_pt(p) for p in poly) + '],\n')
    out.append('];\n')

    path = 'tools/out_trojan_horse.js'
    open(path, 'w').write(''.join(out))
    print(f'  -> {path} ({len(out_edges)} arêtes)')


if __name__ == '__main__':
    main()
