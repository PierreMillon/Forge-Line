# Méthode de recopiage exact des croquis de référence

Trouvée et validée le 08/09/2026 avec Pierre, après plusieurs tentatives
manuelles ratées ("les traits sont extrêmement précis, pas d'équivoque,
donc t'as le droit à zéro approximation"). **À réutiliser telle quelle**
pour tout nouveau croquis de référence (Forge Line, mais aussi Knight
Wars / Bastion Orbit si besoin un jour) — ça évite des heures de lecture
de pixels à l'œil qui donnent des résultats faux ("le jour et la nuit"
avec l'original).

## Le problème

Pierre dessine ses croquis de référence dans une appli qui **aimante
chaque point sur une grille isométrique** (visible comme des petits
points gris sur l'image). Ses traits sont donc mathématiquement exacts —
mais une lecture de pixels à l'œil (même avec une grille de repérage
dessinée par-dessus) introduit des erreurs qui ne se voient qu'une fois
comparées de près à l'original.

## La méthode (3 scripts, dans ce dossier)

### 1. `extract_hough.py` — extraction pixel-exacte

```
python3 extract_hough.py <image.jpg> <prefixe_sortie> [clé=valeur ...]
```

Étapes :
1. **Détecte la grille de points** de l'image (plage de gris ~100-220,
   ni fond noir ni trait blanc) et calcule sa base exacte (deux vecteurs
   isométriques `u`, `v` + une origine `O`) par un **ajustement aux
   moindres carrés sur TOUS les points de grille à la fois** — pas une
   simple moyenne des voisins les plus proches, qui dérive d'environ
   30px une fois loin de l'origine (bug trouvé sur la caravane).
2. **Détecte les segments de trait** avec `cv2.HoughLinesP` (transformée
   de Hough probabiliste) — l'outil standard pour ce problème, pas une
   heuristique maison (recherché et confirmé sur internet, voir NOTES.md
   Partie 1 pour les sources).
3. **Recale chaque extrémité** de segment sur le nœud de grille le plus
   proche.
4. **Se vérifie tout seul contre l'image d'origine** avant de rien
   produire : toute arête dont le tracé ne suit pas réellement un pixel
   blanc de l'image (couverture < 85% par défaut) est rejetée
   automatiquement — plus besoin qu'un humain repère les "triangles
   inventés" entre deux sommets qui n'ont rien à voir. Rapporte aussi la
   "complétude" (fraction du dessin original couverte par une arête
   gardée) pour repérer les traits manqués.

Paramètres à ajuster si besoin (varient d'une image à l'autre) :
- `hough_threshold` (défaut 25, baisser à ~15 pour un dessin aux traits
  courts/fins qui n'atteint pas le seuil de vote par défaut)
- `min_len` (défaut 12, baisser à ~8 pour de petits segments)
- `max_gap`, `cov_thresh`, `min_count`

### 2. `make_svg_compare.py` — génère le SVG final + comparaison

```
python3 make_svg_compare.py <image.jpg> <prefixe_sortie>
```

Calcule la **silhouette** (un seul contour par dessin, méthode "corde
tendue" : chaque segment de trait est gonflé d'un rayon fixe puis toutes
les formes sont fusionnées — gère nativement les contours concaves,
pas besoin de les tracer à la main) via `shapely` (`buffer` + union).
Produit un vrai fichier `.svg` (grille de points + silhouette noire
pleine dessous + traits verts dessus) et une image de comparaison
côte à côte avec l'original.

### 3. `make_occlusion_test.py` — vérifie que la silhouette bloque bien la grille

```
python3 make_occlusion_test.py <image.jpg> <prefixe_sortie>
```

Pose le rendu (fond transparent cette fois) sur une grande grille de
points qui continue largement au-delà de la forme, pour prouver
visuellement que le polygone noir masque bien les points qui tombent
dessous et laisse voir ceux qui tombent à côté.

## Dépendances

`opencv-python-headless`, `scipy`, `shapely`, `cairosvg`, `Pillow`,
`numpy` — toutes installables via `pip install`, aucune n'est dans le
dépôt (à réinstaller si l'environnement change).

## Limite connue

Certains croquis (le cheval de la caravane, avant correctif du
17.42/17.43) semblaient "à main levée" avec un fort taux de rejet — en
réalité c'était systématiquement un bug côté extraction (grille pas
assez précise, seuils Hough par défaut trop stricts pour des traits
courts), jamais une vraie limite du dessin de Pierre. Si un croquis
semble résister, ajuster `hough_threshold`/`min_len` et refaire
l'ajustement aux moindres carrés avant de conclure qu'il n'est pas sur
la grille.
