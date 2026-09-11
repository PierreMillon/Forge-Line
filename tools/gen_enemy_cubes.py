#!/usr/bin/env python3
# v17.76 — extrait les motifs de cube des ennemis depuis
# references/ennemis-complexite.png (croquis de Pierre sur grille aimantée)
# et les reprojette dans le style 2:1 du jeu.
#
# Pourquoi : drawEnemyShape était ENTIÈREMENT procédural (cube par formules
# + treillis généré en grille 3x3 régulière). Or le croquis contient un
# motif de treillis très précis, en éventails de diagonales, qui n'a rien
# d'une grille — et l'audit qui a suivi le cheval de Troie (v17.75) a
# montré que c'était le dernier dessin du jeu encore approximé alors qu'une
# référence existait.
#
# Ce que contient vraiment le croquis (vérifié par extraction, 5 cubes) :
#   - 3 cubes NUS, dessinés à trois tailles différentes (9 arêtes chacun)
#   - 1 cube à UNE diagonale sur la face du dessus (10 arêtes)
#   - 1 cube à CROIX (les deux diagonales de la face du dessus, 10 arêtes)
#   - 1 cube TREILLIS dense (50 arêtes maximales)
# Soit exactement les 4 paliers du jeu : la lecture faite en v17.42 était
# donc juste, seul le TREILLIS était faux (grille régulière générée au lieu
# du motif en éventails du croquis).
#
# Piège de comptage rencontré en chemin (d'où une conclusion d'abord
# erronée de ma part) : le cube à CROIX a 10 arêtes comme celui à une
# seule diagonale, pas 11. Sa diagonale N-S est exactement alignée avec
# l'arête verticale interne du cube (centre -> sommet bas) : Hough les
# fusionne en un seul long trait sommet HAUT -> sommet BAS, qui ABSORBE
# l'arête interne au lieu de s'y ajouter. Compter les arêtes ne suffit
# donc pas à distinguer les deux cubes — il faut tester la présence de ce
# long trait vertical.
#
# Usage : python3 tools/gen_enemy_cubes.py
# Écrit tools/out_enemy_cubes.js (ENEMY_CUBE_MOTIFS).

import sys, os, json
from collections import defaultdict

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from extract_hough import extract
from PIL import Image

REF = 'references/ennemis-complexite.png'
CROP_BOX = (0, 250, 923, 1750)   # enlève l'interface de l'appli de dessin
A, B = 7.5, 3.75                 # ratio 2:1 du jeu, même convention que les autres générateurs


def collinear_contains(big, small):
    (ax, ay), (bx, by) = big
    (cx, cy), (dx, dy) = small
    if big == small:
        return False
    ux, uy = bx - ax, by - ay
    cr = lambda px, py: ux * (py - ay) - uy * (px - ax)
    if cr(cx, cy) or cr(dx, dy):
        return False
    L = ux * ux + uy * uy
    t = lambda px, py: ux * (px - ax) + uy * (py - ay)
    return 0 <= t(cx, cy) <= L and 0 <= t(dx, dy) <= L


def components(edges):
    parent = {}
    def find(p):
        while parent.setdefault(p, p) != p:
            parent[p] = parent[parent[p]]; p = parent[p]
        return p
    def union(a, b):
        ra, rb = find(a), find(b)
        if ra != rb: parent[ra] = rb
    for a, b in edges:
        union(a, b)
    comp = defaultdict(list)
    for a, b in edges:
        comp[find(a)].append((a, b))
    return list(comp.values())


def normalise(es):
    """cube ramené à une largeur de 2 (donc x dans [-1,1]), sommet bas à y=0.
    Toutes les tailles du croquis se superposent ainsi exactement."""
    maximal = [e for e in es if not any(collinear_contains(o, e) for o in es)]
    pts = [((i - j) * A, (i + j) * B) for e in maximal for (i, j) in e]
    xs = [p[0] for p in pts]; ys = [p[1] for p in pts]
    w = max(xs) - min(xs); cx = (min(xs) + max(xs)) / 2; ymax = max(ys)
    def n(i, j):
        x, y = (i - j) * A, (i + j) * B
        return (round((x - cx) / (w / 2), 4), round((y - ymax) / (w / 2), 4))
    return maximal, [(n(*a), n(*b)) for a, b in maximal]


def main():
    tmp = '/tmp/enemy_crop.png'
    Image.open(REF).convert('RGB').crop(CROP_BOX).save(tmp)
    r = extract(tmp, '/tmp/enemy_extract', verbose=True)
    if r['completeness'] < 0.95:
        raise SystemExit(f"complétude trop basse ({r['completeness']:.2f})")

    comps = components([k for k, _ in r['kept']])
    normed = [(es, *normalise(es)) for es in comps]
    normed.sort(key=lambda t: -len(t[1]))

    lattice = normed[0]
    nines = [t for t in normed if len(t[1]) == 9]
    tens = [t for t in normed if len(t[1]) == 10]
    if not nines or len(tens) != 2:
        raise SystemExit(f'croquis inattendu : {[len(t[1]) for t in normed]}')
    # cube nu de référence : le plus grand des cubes nus (géométrie la plus propre)
    plain = max(nines, key=lambda t: len(t[0]))

    # Classement des deux cubes à diagonale. Piège rencontré : on ne peut PAS
    # les distinguer en cherchant "l'arête en trop par rapport au cube nu".
    # La diagonale N-S de la face du dessus est exactement alignée avec
    # l'arête verticale interne du cube (centre -> sommet bas) : Hough voit
    # donc un seul long trait du sommet HAUT au sommet BAS, qui absorbe
    # l'arête interne au lieu de s'y ajouter. On teste plutôt la présence de
    # la diagonale HORIZONTALE (coin gauche -> coin droit de la face du
    # dessus), qui est sans ambiguïté.
    FULL_NS = ((0.0, -2.0), (0.0, 0.0))   # sommet haut -> sommet bas : diagonale N-S fusionnée
    diags = []
    for t in tens:
        has_ns = any(tuple(sorted(e)) == tuple(sorted(FULL_NS)) for e in t[2])
        diags.append(('cross' if has_ns else 'one', t[2]))
    if {d[0] for d in diags} != {'one', 'cross'}:
        raise SystemExit(f'cubes à diagonale non distincts : {[d[0] for d in diags]}')

    motifs = {
        'plain':   plain[2],
        'diag':    dict(diags)['one'],
        'cross':   dict(diags)['cross'],
        'lattice': lattice[2],
    }
    for k, v in motifs.items():
        print(f'  {k}: {len(v)} arêtes')

    js_pt = lambda p: f'{{x:{p[0]},y:{p[1]}}}'
    out = ['// AUTO-GÉNÉRÉ par tools/gen_enemy_cubes.py depuis\n',
           '// references/ennemis-complexite.png — ne pas modifier à la main.\n',
           '// Cubes normalisés : largeur 2 (x de -1 à 1), sommet bas à y=0.\n',
           'const ENEMY_CUBE_MOTIFS = {\n']
    for k in ('plain', 'diag', 'cross', 'lattice'):
        out.append(f'  {k}: [\n')
        for a, b in motifs[k]:
            out.append(f'    [{js_pt(a)}, {js_pt(b)}],\n')
        out.append('  ],\n')
    out.append('};\n')
    open('tools/out_enemy_cubes.js', 'w').write(''.join(out))
    print('  -> tools/out_enemy_cubes.js')


if __name__ == '__main__':
    main()
