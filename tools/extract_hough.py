#!/usr/bin/env python3
"""Workflow validé (bateau) : détecte la grille isométrique du croquis à
partir des points gris, détecte les segments de trait par transformée de
Hough (cv2.HoughLinesP), recale chaque extrémité sur le nœud de grille le
plus proche, PUIS SE VÉRIFIE TOUT SEUL contre l'image d'origine avant de
rien produire : toute arête dont le tracé rouge ne suit pas réellement un
trait blanc (couverture < seuil) est rejetée automatiquement. Rapporte
aussi le residu de blanc non couvert (segments potentiellement manqués),
pour se relancer avec des seuils Hough plus permissifs si besoin — pas
besoin d'un humain pour repérer les triangles inventés.

Usage : python3 extract_hough.py <image.jpg/png> <sortie_prefix> [clé=valeur ...]
"""
import sys
import numpy as np
import cv2
from PIL import Image, ImageDraw
from scipy import ndimage
from scipy.spatial import cKDTree


def detect_grid_basis(gray, nn_max=None):
    dot_mask = (gray > 100) & (gray < 220)
    dot_mask2 = ndimage.binary_dilation(dot_mask, iterations=2)
    lbl, n = ndimage.label(dot_mask2)
    coms = ndimage.center_of_mass(dot_mask, lbl, range(1, n + 1))
    sizes = ndimage.sum(dot_mask, lbl, range(1, n + 1))
    pts = np.array([(x, y) for (y, x), s in zip(coms, sizes) if s > 3])
    if len(pts) < 10:
        raise RuntimeError(f"pas assez de points de grille détectés ({len(pts)})")
    tree = cKDTree(pts)
    dists, idx = tree.query(pts, k=7)
    if nn_max is None:
        # le pas de grille varie d'une image à l'autre (zoom différent au
        # moment du dessin) — on le déduit ici au lieu de le figer, à
        # partir de la distance au plus proche voisin la plus fréquente
        nn = dists[:, 1]
        nn_max = np.median(nn) * 1.25
    vecs_pos, vecs_neg, vecs_vert = [], [], []
    for i in range(len(pts)):
        for k in range(1, 7):
            if dists[i, k] > nn_max:
                continue
            v = pts[idx[i, k]] - pts[i]
            if abs(v[0]) < 8 and v[1] > 0:
                vecs_vert.append(v)
            elif v[0] > 20 and v[1] > 0:
                vecs_pos.append(v)
            elif v[0] < -20 and v[1] > 0:
                vecs_neg.append(v)
    if not vecs_pos or not vecs_neg:
        raise RuntimeError("grille non détectée (pas de voisins diagonaux clairs)")
    u = np.mean(vecs_pos, axis=0)
    v = np.mean(vecs_neg, axis=0)
    o_idx = np.argmin(pts[:, 0] + pts[:, 1])
    O = pts[o_idx]

    # raffinement : la moyenne des voisins les plus proches dérive
    # légèrement loin de l'origine (erreur d'environ 30px mesurée sur la
    # caravane) — un ajustement aux moindres carrés sur TOUS les points de
    # grille à la fois (pas seulement les paires voisines) élimine cette
    # dérive. pts ≈ O + i*u + j*v, on résout O/u/v qui collent le mieux à
    # l'ensemble des points une fois leurs indices (i,j) arrondis.
    A = np.array([[u[0], v[0]], [u[1], v[1]]])
    Ainv = np.linalg.inv(A)
    ij = (Ainv @ (pts - O).T).T
    ij_round = np.round(ij)
    M = np.column_stack([np.ones(len(pts)), ij_round[:, 0], ij_round[:, 1]])
    sol_x, *_ = np.linalg.lstsq(M, pts[:, 0], rcond=None)
    sol_y, *_ = np.linalg.lstsq(M, pts[:, 1], rcond=None)
    O = np.array([sol_x[0], sol_y[0]])
    u = np.array([sol_x[1], sol_y[1]])
    v = np.array([sol_x[2], sol_y[2]])

    return O, u, v, pts


def make_snap(O, u, v):
    A = np.array([[u[0], v[0]], [u[1], v[1]]])
    Ainv = np.linalg.inv(A)

    def snap(x, y):
        ij = Ainv @ np.array([x - O[0], y - O[1]])
        i, j = round(ij[0]), round(ij[1])
        sx = O[0] + i * u[0] + j * v[0]
        sy = O[1] + i * u[1] + j * v[1]
        return (i, j), (sx, sy)

    return snap


def edge_coverage(white, p1, p2, tol=3):
    """Fraction de p1->p2 (échantillonnée) qui tombe sur un pixel blanc de
    l'image d'ORIGINE (pas du rendu) — mesure si CE tracé rouge correspond
    vraiment à un trait dessiné, pas une invention entre deux sommets."""
    h, w = white.shape
    d = np.hypot(p2[0] - p1[0], p2[1] - p1[1])
    n = max(10, int(d / 2))
    xs = np.linspace(p1[0], p2[0], n)
    ys = np.linspace(p1[1], p2[1], n)
    hit = 0
    for x, y in zip(xs, ys):
        xi, yi = int(round(x)), int(round(y))
        found = False
        for ddx in range(-tol, tol + 1):
            for ddy in range(-tol, tol + 1):
                xx, yy = xi + ddx, yi + ddy
                if 0 <= yy < h and 0 <= xx < w and white[yy, xx]:
                    found = True
                    break
            if found:
                break
        if found:
            hit += 1
    return hit / n


def white_completeness(white, kept_coords, tol=4, sample_every=4):
    """Fraction des pixels blancs de l'image d'origine qui sont à moins de
    `tol` px d'une arête retenue — un residu bas signale du blanc non
    couvert (trait probablement manqué par Hough)."""
    ys, xs = np.where(white)
    ys, xs = ys[::sample_every], xs[::sample_every]
    if len(xs) == 0:
        return 1.0, np.array([]), np.array([])
    covered = np.zeros(len(xs), dtype=bool)
    for p1, p2 in kept_coords:
        d = np.hypot(p2[0] - p1[0], p2[1] - p1[1])
        n = max(10, int(d / 2))
        lx = np.linspace(p1[0], p2[0], n)
        ly = np.linspace(p1[1], p2[1], n)
        for lxi, lyi in zip(lx, ly):
            close = (np.abs(xs - lxi) <= tol) & (np.abs(ys - lyi) <= tol)
            covered |= close
    frac = covered.mean()
    return frac, xs[~covered], ys[~covered]


def extract(image_path, out_prefix, hough_threshold=25, min_len=12, max_gap=8,
            white_thresh=200, min_count=1, cov_thresh=0.85, verbose=True):
    gray = cv2.imread(image_path, cv2.IMREAD_GRAYSCALE)
    white = gray > white_thresh
    O, u, v, dot_pts = detect_grid_basis(gray.astype(float))
    snap = make_snap(O, u, v)

    _, binary = cv2.threshold(gray, white_thresh, 255, cv2.THRESH_BINARY)
    lines = cv2.HoughLinesP(binary, rho=1, theta=np.pi / 360,
                             threshold=hough_threshold, minLineLength=min_len,
                             maxLineGap=max_gap)
    if lines is None:
        raise RuntimeError("aucun segment détecté (Hough) — seuils trop stricts")
    lines = lines.reshape(-1, 4)

    from collections import Counter
    counter = Counter()
    coords = {}
    for (x1, y1, x2, y2) in lines:
        (i1, j1), p1 = snap(x1, y1)
        (i2, j2), p2 = snap(x2, y2)
        if (i1, j1) == (i2, j2):
            continue
        key = tuple(sorted([(i1, j1), (i2, j2)]))
        counter[key] += 1
        coords[key] = (p1, p2)

    candidates = [(k, c) for k, c in counter.items() if c >= min_count]

    # auto-vérification : rejette toute arête dont le tracé ne suit pas
    # vraiment un trait blanc de l'image d'origine
    kept, rejected = [], []
    for key, c in candidates:
        p1, p2 = coords[key]
        cov = edge_coverage(white, p1, p2)
        if cov >= cov_thresh:
            kept.append((key, c, cov))
        else:
            rejected.append((key, c, cov))

    completeness, miss_x, miss_y = white_completeness(white, [coords[k] for k, c, cov in kept])

    if verbose:
        print(f'{image_path}: grille u={u}, v={v}')
        print(f'  {len(candidates)} arêtes candidates -> {len(kept)} gardées, {len(rejected)} rejetées (couverture < {cov_thresh})')
        for key, c, cov in rejected:
            print(f'    REJETÉE cov={cov:.2f} count={c} {coords[key]}')
        print(f'  complétude (blanc couvert par une arête gardée) : {completeness*100:.1f}%')
        if completeness < 0.9:
            print(f'  ATTENTION : {len(miss_x)} points blancs (échantillonnés) non couverts — des traits sont peut-être manqués.')

    img = Image.open(image_path).convert('RGB')
    d = ImageDraw.Draw(img)
    for key, c, cov in kept:
        p1, p2 = coords[key]
        d.line([p1, p2], fill=(255, 0, 0), width=3)
    # marque en jaune les zones de blanc non couvertes, pour diagnostic visuel
    for x, y in zip(miss_x, miss_y):
        d.ellipse([x - 2, y - 2, x + 2, y + 2], fill=(255, 255, 0))
    img.save(f'{out_prefix}-overlay.png')

    W, H = Image.open(image_path).size
    clean = Image.new('RGB', (W, H), (2, 10, 4))
    dc = ImageDraw.Draw(clean)
    for key, c, cov in kept:
        p1, p2 = coords[key]
        dc.line([p1, p2], fill=(70, 255, 130), width=3)
    clean.save(f'{out_prefix}-clean.png')

    return {
        'kept': [(k, coords[k]) for k, c, cov in kept],
        'rejected': rejected,
        'completeness': completeness,
        'basis': (O, u, v),
    }


if __name__ == '__main__':
    image_path, out_prefix = sys.argv[1], sys.argv[2]
    extra = {}
    for a in sys.argv[3:]:
        k, val = a.split('=')
        extra[k] = float(val) if '.' in val else int(val)
    extract(image_path, out_prefix, **extra)
