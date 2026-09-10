#!/usr/bin/env python3
# v17.69 — extrait le mur ENTIER du château depuis references/wall_stairs.svg
# (grille magnétique isométrique, même méthode que gen_snow_tower.py).
#
# Historique de lecture de ce croquis (voir NOTES.md pour le détail) :
#   - v17.61 : un seul tronçon (escalier) extrait, collé sur l'ancien mur
#     procédural — lecture incomplète.
#   - v17.67 : les deux tronçons (escalier / nu) extraits séparément et
#     traités comme des TUILES à répéter côte à côte pour paver l'écran
#     — mauvaise interprétation, corrigée par Pierre : le croquis ne
#     montrait pas deux motifs répétables, mais bien le mur ENTIER,
#     dessiné une seule fois (tronçon avec l'escalier d'accès au chemin
#     de ronde + vide de la porte + tronçon nu, dans cet ordre).
#   - v17.69 (ce script) : les deux tronçons sont extraits puis fusionnés
#     en UNE seule composition (mêmes arêtes/faces, pas de séparation),
#     que index.html met à l'échelle en un seul bloc pour toucher les
#     deux bords de l'écran (drawWallWhole), au lieu de la paver.
#
# Usage : python3 tools/gen_wall_tiles.py
# Écrit tools/out_wall_whole.js, prêt à coller dans index.html (juste
# avant drawWallWhole()) sous les noms WALL_WHOLE_EDGES/WALL_WHOLE_FACES.
#
# Étapes :
# 1. Parser les <circle>/<line> du SVG (grille de points + traits
#    accrochés dessus), retrouver le pas de la vraie grille isométrique
#    30° (dy/(dx/2) = tan(30°)) et convertir chaque point en indices
#    entiers (u,v) de cette grille — les indices portent l'info, pas
#    les pixels d'origine.
# 2. Repérer les deux tronçons par analyse en composantes connexes
#    (union-find sur le graphe d'arêtes) — uniquement pour vérifier
#    qu'on a bien récupéré tout le mur (2 composantes, pas plus/moins),
#    PAS pour les séparer : les deux repartent dans le même repère.
# 3. Reprojeter (u,v) → écran avec le ratio 2:1 du jeu (A=7.5, B=A/2)
#    au lieu du 30° d'origine — un simple changement d'unité qui ne
#    déforme rien, juste plus trapu, cohérent avec le reste du jeu.
#    Un seul repère pour tout le mur : bord gauche du tronçon escalier
#    à x=0, sol commun (point le plus bas de tout le mur) à y=0 — donc
#    la porte (vide entre les deux tronçons) tombe naturellement au
#    centre de la composition, sans arithmétique de décalage à la main.
# 4. Remplissage plein (silhouette noire) calculé avec
#    shapely.polygonize() sur l'ensemble des arêtes projetées — trouve
#    automatiquement toutes les faces fermées de la grille planaire,
#    sans la moindre interprétation manuelle.
#
# Vérifié (voir NOTES.md v17.69) : largeur native 330px, hauteur native
# 63,75px, la porte tombe pile au centre (165 = 330/2) — rendu confirmé
# par un test Playwright autonome avant intégration dans index.html.

import re
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


def gen(all_edges_uv, name):
    # un seul repère pour toute la composition (v17.69, voir en-tête) :
    # bord gauche = x=0, sol commun (point le plus bas) = y=0 — la même
    # convention d'ancrage Y que gen_snow_tower.py (v seul, pas u+v)
    all_pts = {p for e in all_edges_uv for p in e}
    ground_uv = max(all_pts, key=lambda p: p[1])
    gu, gv = ground_uv
    xs_proj = [(u - v) * A for u, v in all_pts]
    x0 = min(xs_proj)

    def proj(u, v):
        return (u - v) * A - x0, (u + v - gu - gv) * B

    edges = [(proj(*a), proj(*b)) for a, b in all_edges_uv]
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
    xs = [p[0] for e in edges for p in e]
    ys = [p[1] for e in edges for p in e]
    print(f"{name}: {len(edges)} arêtes, {len(faces)} faces -> {path}")
    print(f"  largeur native: {max(xs) - min(xs)}, hauteur native: {max(ys) - min(ys)}")


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
    assert len(comps) == 2, "le mur doit avoir exactement 2 tronçons (escalier + nu)"
    gen(edges_uv, "wall_whole")
