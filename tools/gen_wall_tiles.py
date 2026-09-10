#!/usr/bin/env python3
# v17.67 — extrait les deux tronçons du nouveau mur du château depuis
# references/wall_stairs.svg (grille magnétique isométrique, même
# méthode que gen_snow_tower.py). Le SVG contient DEUX tronçons de mur
# (l'un avec un escalier d'accès au chemin de ronde, l'autre nu),
# séparés par un vide qui est l'emplacement de la porte — pas une
# redondance (erreur de lecture corrigée en v17.67, voir NOTES.md).
#
# Usage : python3 tools/gen_wall_tiles.py
# Écrit deux fichiers JS (WTILE_STAIRS_*/WTILE_PLAIN_*) prêts à coller
# dans index.html (juste avant drawWallTile()).
#
# Étapes :
# 1. Parser les <circle>/<line> du SVG (grille de points + traits
#    accrochés dessus), retrouver le pas de la vraie grille isométrique
#    30° (dy/(dx/2) = tan(30°)) et convertir chaque point en indices
#    entiers (u,v) de cette grille — les indices portent l'info, pas
#    les pixels d'origine.
# 2. Séparer les deux tronçons par analyse en composantes connexes
#    (union-find sur le graphe d'arêtes) : le SVG ne les distingue pas
#    explicitement, mais ils ne partagent aucune arête (le vide de la
#    porte les sépare complètement).
# 3. Reprojeter (u,v) → écran avec le ratio 2:1 du jeu (A=7.5, B=A/2)
#    au lieu du 30° d'origine — un simple changement d'unité qui ne
#    déforme rien, juste plus trapu, cohérent avec le reste du jeu.
# 4. Recentrer chaque tronçon sur son propre bord gauche (x=0) pour
#    que le pavage dans index.html (drawCastle) n'ait qu'à additionner
#    des multiples de WALL_TILE_W, aucune arithmétique de décalage à
#    refaire à la main.
# 5. Remplissage plein (silhouette noire) calculé avec
#    shapely.polygonize() sur l'ensemble des arêtes projetées — trouve
#    automatiquement toutes les faces fermées de la grille planaire,
#    sans la moindre interprétation manuelle.
#
# Vérifié (voir NOTES.md v17.67) : les deux tronçons pavés bout à bout
# (4 copies du tronçon nu) se recollent sans la moindre marche visible
# — un vrai motif répétable.

import re
import json
from collections import defaultdict
from shapely.geometry import LineString
from shapely.ops import polygonize, unary_union

SVG_PATH = "references/wall_stairs.svg"
A = 7.5  # échelle horizontale (px de jeu par unité de grille) — cohérente avec gen_snow_tower.py
B = A * 0.5  # ratio 2:1 du jeu (au lieu du 30° d'origine du croquis)


def parse_svg(path):
    txt = open(path).read()
    circles = []
    for m in re.finditer(r'<circle[^>]*cx="([-\d.]+)"[^>]*cy="([-\d.]+)"', txt):
        circles.append((float(m.group(1)), float(m.group(2))))
    lines = []
    for m in re.finditer(
        r'<line[^>]*x1="([-\d.]+)"[^>]*y1="([-\d.]+)"[^>]*x2="([-\d.]+)"[^>]*y2="([-\d.]+)"',
        txt,
    ):
        lines.append(tuple(float(g) for g in m.groups()))
    return circles, lines


def grid_step(circles):
    ys = sorted(set(round(c[1], 3) for c in circles))
    xs_row0 = sorted(set(round(c[0], 3) for c in circles if abs(c[1] - ys[0]) < 0.01))
    return xs_row0[1] - xs_row0[0], ys[1] - ys[0]  # dx, dy


def to_uv(x, y, x0, y0, dx, dy):
    umv = (x - x0) / (dx / 2)
    upv = (y - y0) / dy
    return round((umv + upv) / 2), round((upv - umv) / 2)


def connected_components(edges):
    parent = {}

    def find(p):
        while parent.get(p, p) != p:
            p = parent.get(p, p)
        return p

    def union(a, b):
        ra, rb = find(a), find(b)
        if ra != rb:
            parent[ra] = rb

    pts = set()
    for a, b in edges:
        pts.add(a)
        pts.add(b)
    for p in pts:
        parent[p] = p
    for a, b in edges:
        union(a, b)
    comp = defaultdict(list)
    for a, b in edges:
        comp[find(a)].append((a, b))
    return sorted(comp.items(), key=lambda kv: -len(kv[1]))


def gen(edges_uv, name, ground_uv):
    # ground_uv ancre Y (sol = 0, mur vers le haut = y négatif) — le
    # MÊME point pour les deux tronçons (le point le plus bas de tout
    # le mur, calculé une fois sur les deux composantes ensemble), pour
    # qu'ils partagent la même ligne de sol. X, lui, est local à chaque
    # tronçon (bord gauche = 0) pour que le pavage dans drawCastle()
    # n'ait qu'à additionner des multiples de WALL_TILE_W.
    gu, gv = ground_uv
    xs_proj = [(u - v) * A for u, v in {p for e in edges_uv for p in e}]
    x0 = min(xs_proj)

    def proj(u, v):
        return (u - v) * A - x0, (u + v - gu - gv) * B

    edges = [(proj(*a), proj(*b)) for a, b in edges_uv]
    lines = [LineString([a, b]) for a, b in edges if a != b]
    faces = list(polygonize(unary_union(lines)))

    def js_pt(p):
        return f"{{x:{round(p[0], 2)},y:{round(p[1], 2)}}}"

    out = [f"const {name.upper()}_EDGES = [\n"]
    for a, b in edges:
        out.append(f"  [{js_pt(a)}, {js_pt(b)}],\n")
    out.append(f"];\nconst {name.upper()}_FACES = [\n")
    for poly in faces:
        coords = list(poly.exterior.coords)[:-1]
        out.append("  [" + ", ".join(js_pt(p) for p in coords) + "],\n")
    out.append("];\n")
    path = f"tools/out_{name}.js"
    open(path, "w").write("".join(out))
    print(f"{name}: {len(edges)} arêtes, {len(faces)} faces -> {path}")


if __name__ == "__main__":
    circles, lines = parse_svg(SVG_PATH)
    dx, dy = grid_step(circles)
    x0, y0 = circles[0]
    edges_uv = []
    for x1, y1, x2, y2 in lines:
        p1 = to_uv(x1, y1, x0, y0, dx, dy)
        p2 = to_uv(x2, y2, x0, y0, dx, dy)
        if p1 != p2:
            edges_uv.append((p1, p2))

    comps = connected_components(edges_uv)
    print("composantes connexes:", [(len(es)) for _, es in comps])
    all_pts = {p for _, es in comps for e in es for p in e}
    ground_uv = max(all_pts, key=lambda p: p[1])  # même clé que gen_snow_tower.py (v seul, pas u+v)
    # la plus grande (escalier) et la 2e (nue) — vérifié une fois
    # visuellement (voir NOTES.md), stable tant que le SVG ne change pas
    gen(comps[0][1], "wtile_stairs", ground_uv)
    gen(comps[1][1], "wtile_plain", ground_uv)
