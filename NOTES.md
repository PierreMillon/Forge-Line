# Forge Line — notes de conception

Journal des décisions et des idées, dans l'ordre où elles arrivent.
**Règle : on met à jour, on ne supprime jamais.** Une idée faite reste
tracée (marquée faite) ; une idée mise de côté reste tracée (marquée
« plus tard ») ; rien ne doit se perdre au fil de la discussion.

Format condensé — l'idée, pas la formulation exacte.

## 📋 À faire (demandé, pas encore fait)

(vide pour l'instant — les deux items ci-dessous, seuls restants, ont
été faits en v17.24, voir plus bas)

## 💭 Idées à explorer plus tard (pas encore décidées)

- ~~**Bateau en vraie perspective isométrique**~~ → fait en v17.12
  (drawIsoBox, comme les tours, au lieu du sprite PNG à plat).

- **Plusieurs cartes** pour la suite (variété au-delà de la plage
  actuelle). Pas encore décidé à quoi elles ressemblent — question posée
  à nouveau en v17.24, réponse : garder en note pour l'instant.

- ~~**Décor sur la grille isométrique** : une route qui part du bas du
  château~~ → fait en v17.12 (chemin décoratif qui part du bord du
  château et sort de l'écran, suit les diagonales de la grille iso —
  purement visuel, sans virages vers une "ville" précise pour l'instant).

- ~~**Easter egg : le cheval de Troie**~~ → fait en v17.24, détail plus
  bas.

- **Principe directeur : éviter la froideur mécanique** (vaut aussi pour
  Bastion Orbit, noté dans son BACKLOG.md). Le défaut classique : ennemis
  trop prévisibles, tous à la même vitesse, qui attaquent chacun leur tour
  façon figurants de film de kung-fu. Voulu à la place : un bazar organique,
  humain, imprévisible. Méthode envisagée : pas une grosse IA d'un coup,
  mais plein de petites règles locales par ennemi qui interagissent entre
  elles et font émerger des comportements de groupe non programmés
  explicitement (exemple donné : "si je suis proche d'un collègue, +1
  attaque mais -1 vitesse"). Effet secondaire voulu, pas un bug à éviter :
  si le joueur reste passif, les ennemis pourraient s'accumuler (plusieurs
  bateaux) puis attaquer en masse d'un coup, plutôt qu'arriver au
  compte-goutte indéfiniment. Pas encore de règle concrète choisie — à
  développer par petites touches, une règle à la fois.

## ✅ Décisions prises

- **Rendu** : 2D isométrique, pas de vraie 3D — reste léger. Profondeur
  simulée par un tri des calques (objets plus bas à l'écran = plus proches,
  dessinés par-dessus).
- **Éclairage** : pas de lumière dynamique (coûteux en 3D réelle) — teintes
  fixes par face des pavés isométriques, façon éclairage figé.
- **Mouvement** : joueur/ennemis/projectiles en coordonnées libres (pixels
  écran), pas contraints à une grille. Le placement des tours réintroduit
  une grille, mais seulement pour ça (voir "En cours").
- **Ennemis** : spawn aléatoire en haut d'écran, descente verticale avec
  ondulation organique (pas un alignement sur la grille). Deux rôles :
  *rushers* (foncent vers la ligne du bas) et *attackers* (ciblent la tour
  la plus proche pour l'occuper/la détruire).
- **Vagues** : salves irrégulières (1, parfois 2-3 d'un coup), délai
  variable entre décisions, certains ennemis hésitent avant de s'avancer —
  effet "ils réfléchissent", pas un tapis roulant. Chaque vague est 20%
  plus forte que la précédente (PV ennemis, croissance exponentielle).
- **Tours** : pas de barre de vie séparée — leur hauteur EST leur vie,
  elles rétrécissent en encaissant et disparaissent à 0 (sans bruit).
  Obstacles solides : joueur et ennemis ne peuvent pas les traverser.
  Flash translucide bref quand elles encaissent un coup (pas une
  transparence permanente). Mêmes projectiles que le joueur, même rythme
  (1 tir/s).
- **Économie** : or gagné uniquement en tuant un ennemi (1 or/kill, pas de
  revenu passif, rien si l'ennemi atteint la ligne).
- **Son** : bruitages synthétisés en Web Audio API (aucun fichier) — tir
  sec, impact plus aigu/sourd, clank métallique à la construction, coup de
  marteau grave quand une tour encaisse, silence à la destruction.
  L'audio doit être débloqué au tout premier geste utilisateur (sinon
  muet toute la partie sur mobile).
- **Interface** : plein écran avec bandeau haut (menu ☰ en haut à gauche +
  numéro de version cliquable en haut à droite) et bandeau bas (stats).
  Le menu haut-gauche est prévu pour naviguer vers les autres jeux
  (Bastion Orbit) et pour des réglages debug.
- **Écran de défaite** : petite carte centrée (le jeu reste visible
  derrière, pas un voile plein écran). Bouton "regarder une pub pour
  continuer" (fonctionnel — pardonne les brèches — mais pas de vraie
  vidéo branchée) et bouton "recommencer à zéro".
- **Workflow** : discussion d'abord, prototype jouable en un seul fichier
  HTML, production seulement si le concept plaît — pour économiser les
  tokens. Chaque changement testé (Playwright si besoin) puis poussé sur
  GitHub Pages directement (pas de longue attente en review).
- **Grille de construction (v13, corrigée)** : la v11 avait remplacé la
  grille isométrique par une grille carrée invisible, sur la base d'un
  test d'espacement (mesuré tous les 60px) qui semblait irrégulier.
  Correction reçue : ce n'était pas voulu. Refait un test fin (tous les
  1px) qui a montré que l'irrégularité était un artefact du test grossier
  — la grille en losange fonctionne bien nativement (chaque case voisine
  touche la précédente par un bord complet, en zigzag vertical régulier,
  normal pour un quadrillage en losange). Grille isométrique restaurée.
- **Bug corrigé (v12)** : les ennemis "sautaient" visiblement au moment
  où ils commençaient à bouger (juste après l'apparition, ou après une
  hésitation). Cause : la position de départ ne correspondait pas à la
  formule utilisée pour le mouvement (ondulation gauche-droite), donc le
  premier calcul de position produisait un saut au lieu d'un glissement
  continu. Corrigé en calculant la position initiale avec la même
  formule — vérifié : saut nul.
- **Équilibrage (v12)** : vitesse des ennemis -20%, vitesse de tir des
  tours +20% (le joueur garde son propre rythme de tir).
- **Thème Vikings (v13)** : bande d'eau bleue tout en haut de la carte
  (la plage), bateau viking centré dessus — icône reprise à l'identique
  du sprite `boat-icon.png` du jeu Knight Wars (autre projet du
  portfolio). Les ennemis apparaissent groupés au pied du bateau plutôt
  que dispersés sur toute la largeur, comme s'ils en débarquaient. Le
  reste de la carte (sous la plage) reste le château fort à défendre.
- **Santé du joueur (v14)** : 10 paliers de couleur jaune → rouge (pas de
  rétrécissement), flash rouge bref à chaque coup encaissé au contact
  d'un ennemi (les ennemis visent le château, pas le joueur, mais le
  contact compte quand même). Chaque palier perdu retire 5% à la cadence
  de tir. Régénération dans une zone tampon marquée au sol près de la
  base (halo vert), +1 point toutes les 0,5s avec un "+1" flottant.
- **Bateau par vague + orientation (v15)** : la proue (pointe du sprite)
  pointe maintenant vers le bas/la plage (rotation de base + une légère
  inclinaison aléatoire, "posé à l'arrache"). Un nouveau bateau arrive à
  chaque vague, glisse depuis le large jusqu'à un point d'échouage tiré
  au sort (jamais toujours centré), et les ennemis de cette vague ne
  sortent qu'une fois le bateau échoué.
- **Joystick à vitesse analogique (v15)** : la vitesse de déplacement est
  maintenant proportionnelle à la distance entre le doigt et le centre du
  joystick (au lieu d'un tout-ou-rien au-delà de la zone morte). Le
  clavier reste à vitesse fixe (pas d'équivalent analogique).
- **Économie des pubs (v16)** : bouton "continuer"/"revivre" débloque une
  sauvegarde locale (`localStorage`, or + vague) rechargée au démarrage ;
  rien n'est jamais sauvegardé avant ce premier déblocage explicite. Entrée
  "Aide / FAQ" dans le menu, expliquant le pourquoi de la pub et le risque
  de perte si le cache est vidé. "Code bonus" dans ce panneau FAQ :
  recommence à zéro avec 100 or offerts, à tout moment (pas besoin d'avoir
  perdu). Rien ne force plus d'une pub par session de jeu.
- **IA à mémoire des ennemis (v16)** : la carte est découpée en 8 colonnes ;
  chaque mort/percée y est comptée, et les nouveaux ennemis tirent leur
  "colonne préférée" au sort, pondérée par ce qui a déjà réussi (mémoire
  collective statistique, pas un plan concerté). 30% du temps, ils imitent
  directement le dernier ennemi ayant atteint le château rapidement. Chaque
  ennemi a un "engagement" aléatoire (0 à 1) : les peu engagés changent de
  colonne préférée toutes les quelques secondes, les très engagés y restent
  fidèles. Les attaquants ciblent désormais la tour la plus proche de
  tomber parmi celles à portée, pas juste la plus proche géométriquement.
  Nouveau rôle "harceleur" : rôde près du joueur (si son score d'agressivité
  — construit sur ses tirs récents — est élevé) ou près de la tour la plus
  réparée, tout en continuant d'avancer lentement vers le château (l'objectif
  reste toujours le château, jamais seulement le joueur).
- **Écran de mort du joueur (v16)** : la santé peut désormais tomber
  jusqu'à zéro (auparavant elle ne faisait que virer au rouge sans jamais
  "tuer"). À la mort : écran distinct ("Tu es tombé au combat") avec
  "regarder une pub pour revivre" (santé pleine, courte invulnérabilité) ou
  "continuer à regarder" (mode spectateur — le joueur est gelé mais la
  partie continue sans lui jusqu'à la défaite normale par brèches, qui
  affiche alors un troisième écran final "Le château est tombé").
- **Correctif audio (v17)** : sur un appareil réel, le tout premier
  `resume()` de l'AudioContext ne semblait pas toujours aboutir avant que
  d'autres sons soient tentés — plus aucun son jusqu'à ce qu'un DEUXIÈME
  geste relance `resume()` avec succès (rapporté : "le son ne s'active que
  quand je construis"). Le déblocage à usage unique (`{once:true}`) est
  remplacé par une tentative répétée à chaque geste, jusqu'à ce que le
  contexte soit vraiment `running`.
- **Clignotement à santé critique (v17)** : le joueur clignote (alterne
  opacité pleine/30%, toutes les 150ms) quand sa santé tombe à 10% ou
  moins — alarme visuelle en plus du dégradé jaune→rouge existant.
- **Le joueur disparaît en mode spectateur (v17)** : une fois mort et le
  choix "continuer à regarder" fait, son pavé isométrique n'est plus
  dessiné du tout (il ne revient qu'après "revivre").
- **Bandeau de bonus (v17)**, remplace le double-tap pour construire :
  trois boutons achetables juste au-dessus du bandeau d'infos —
  (1) revenu passif : achat unique (15 or), +1 or/2s ensuite ;
  (2) dégâts du joueur : paliers de coût croissant, balle visiblement plus
  grosse à chaque palier (jusqu'à 5 paliers) — n'affecte que les tirs du
  joueur, pas ceux des tours ; (3) tour : construit une nouvelle tour si
  aucune n'est à portée, sinon renforce celle la plus proche (rajoute un
  "étage" — plus haute, PV max multipliés par le niveau, jusqu'à niveau 3).
  Un 4e bouton (tour à pouvoir spécial, 50 or) est une idée pour plus tard,
  pas encore fait. Décision prise en discussion : le tir automatique de
  base reste gratuit dès le départ (pas de risque de blocage à 0 or) — le
  bouton dégâts ne fait qu'améliorer, il ne débloque rien.
- **Correctif position de construction (v17)** : la tour posée sortait
  visuellement en bas à droite du joueur au lieu d'au-dessus (rapporté en
  jeu). Cause : dans cette grille en losange, avancer d'un seul cran sur
  un seul axe (gx ou gy) ne va jamais tout droit vers le haut à l'écran —
  chaque axe descend en plus de décaler horizontalement. Il faut reculer
  sur LES DEUX axes à la fois (gx-1 ET gy-1) pour que les décalages
  horizontaux s'annulent et n'obtenir qu'un déplacement vertical pur.
  Un léger décalage horizontal résiduel reste possible (jusqu'à une
  demi-case) : c'est le prix du calage sur la grille en losange, pas un
  bug — nécessaire pour que plusieurs tours posées bord à bord s'alignent
  en mur continu.
- **Élan résiduel du joystick (v17)** : un relâchement juste après un
  mouvement rapide ("coup sec") laisse le joueur glisser encore un peu,
  avec une atténuation forte (quelques cases, pas une glissade). Un
  relâchement normal (lent, ou tenu longtemps sans mouvement récent) ne
  déclenche rien.
- **Bouton "Recommencer une nouvelle partie" dans le menu (v17)** :
  accessible à tout moment, pas seulement depuis l'écran de fin.
- **Vitesse des ennemis divisée par deux (v17.1)** : demandé après coup
  ("plus lents, moitié de la vitesse actuelle"). Vient s'ajouter au -20%
  déjà appliqué en v12.
- **Tir manuel par défaut + bonus "tir auto" (v17.2)** : revirement sur le
  tir automatique — il n'est plus gratuit d'office. Par défaut, le joueur
  tire en tapant/cliquant (un simple tap, pas un glissement — fonctionne
  même joystick en main, via les évènements pointer plutôt que touch/click
  pour ne jamais tirer deux fois sur un seul geste). Le tir manuel reste
  gratuit dès le début (pour ne jamais bloquer l'économie à 0 or — discuté
  en amont). Un 4e bouton du bandeau ("🎯 Tir auto", 20 or) automatise
  ensuite le tir ; le bonus dégâts s'applique dans les deux modes.
- **Revenu passif à paliers (v17.2)** : le bonus "revenu auto" n'est plus
  un achat unique — paliers de coût croissant (base 15 or, +10/palier,
  jusqu'à 5), chaque niveau rajoute +1 or au montant gagné toutes les 2s.
- **Fausse erreur de pub, honnête (v17.2)** : au clic sur "Regarder une
  pub", un petit écran annonce que la vidéo n'a pas pu charger (erreur
  technique de notre côté) et que le bonus est accordé quand même — plus
  honnête qu'accorder le bonus en silence, vu qu'il n'y a pas de vraie
  pub branchée. Compteur de clics à ajouter plus tard (stats). Même
  traitement fait sur Knight Wars (bouton pub premium).
- **Deux cadences pour le tir manuel (v17.3, ajusté en v17.5)** : répéter
  le tap tire plus vite (cadence courte, plafond anti-spam à 20 taps/s
  soit 50ms — d'abord mis à 150ms, remonté sur demande), rester appuyé
  donne un rythme fixe plus lent (500ms). Le seuil entre les deux : un
  relâchement avant 250ms = un tap ; au-delà, bascule en maintien.
  Distinction par une vraie mesure du temps d'appui/relâchement, pas une
  estimation.
- **Vague 1 réduite à 2 ennemis (v17.4)** : au lieu de 5, pour une entrée
  en matière plus douce. Les vagues suivantes gardent leur progression
  habituelle (+3 par vague).
- **Plafond du tir manuel remonté à 20 taps/s (v17.5)**, 50ms au lieu de
  150ms.
- **Tir manuel pendant un déplacement au joystick (v17.6, ANNULÉ en
  v17.8)** : j'avais mal compris une demande et "corrigé" un comportement
  qui n'était pas un bug — j'avais fait en sorte qu'un doigt qui bouge le
  joystick (`joyEngagedThisTouch`) empêche le tir manuel de se déclencher.
  Précision reçue ensuite : c'est voulu que rester appuyé tire, qu'on soit
  en train de bouger ou pas — un seul doigt doit pouvoir déplacer ET tirer
  en même temps. Revenu en arrière (le drapeau `joyEngagedThisTouch` est
  retiré, plus utile) : maintenant, tenir le doigt appuyé tire à la
  cadence de maintien, indépendamment du déplacement.
- **Tir auto et tir manuel se cumulent (v17.6)** : avant, les deux
  partageaient le même minuteur de cadence et se bloquaient l'un l'autre
  une fois le tir auto acheté (tenir/taper en plus ne faisait plus rien).
  Chacun a maintenant son propre minuteur (`lastAutoShotAt` /
  `lastManualShotAt`) : rester appuyé ou taper en plus du tir auto ajoute
  vraiment des tirs supplémentaires, ça ne les remplace pas.
- **Portée illimitée + précision par la distance, joueur uniquement
  (v17.7)** : le joueur peut désormais viser n'importe quel ennemi, quelle
  que soit la distance (plus de plafond de portée). En contrepartie, la
  précision baisse avec l'éloignement : 100% en dessous d'un quart de
  l'ancienne portée de référence (200px), puis dégrade sur 10 paliers
  jusqu'à 20% (1 tir sur 5) à cette distance de référence et au-delà
  (jamais 0 — on peut toujours tirer très loin, juste peu fiable). Un tir
  raté part quand même, mais dévie nettement à côté (angle aléatoire,
  17-34°) — et peut, par hasard, toucher un autre ennemi croisé sur sa
  trajectoire déviée. Encourage à s'approcher sans l'imposer. Les tours
  gardent leur portée fixe et leur précision garantie (inchangé) — ce
  système ne concerne que le joueur.
- **Annulé le correctif v17.6 sur le tir pendant un déplacement (v17.8)** :
  malentendu de ma part, voir la note v17.6 mise à jour ci-dessus. Rester
  appuyé tire maintenant, qu'on bouge le joueur ou pas.
- **4 types d'ennemis + PV linéaires + vitesse fixe organique (v17.9)** :
  - PV : croissance LINÉAIRE par vague (+3, au lieu de ×1,2 exponentiel)
    — `BASE_ENEMY_HP + WAVE_HP_STEP×(vague-1)`, puis multiplié par le type.
  - Vitesse : plus de montée avec la vague. Chaque type a une vitesse de
    base fixe ; chaque ennemi varie individuellement autour d'elle par une
    oscillation organique (±30%, désynchronisée par ennemi) — "ils
    décident d'accélérer ou de ralentir", toujours sous un plafond fixe.
  - 4 types (couleur distincte chacun) : *base* (rouge, référence),
    *rapide-fragile* (bleu clair, ×2 vitesse, moitié PV), *rapide-costaud*
    (violet, ×2 vitesse, PV normal), *boss* (orange, moitié vitesse, ×4 PV,
    dessiné plus gros). Le boss est rare : apparaît une fois toutes les
    `BOSS_WAVE_INTERVAL` vagues (5 pour l'instant, à ajuster), jamais plus
    d'un par vague, et retire un ennemi simple de cette vague pour
    compenser (pas un pur ajout).
  - Répartition hors-boss : ~15% rapide-fragile, ~15% rapide-costaud, le
    reste en type de base.
- **Croissance du nombre d'ennemis par vague : +1 (v17.9)**, au lieu de +3
  — explicitement pour avoir plus de marge de réglage fin ("beaucoup
  beaucoup de variations pour gérer la difficulté").
- **Dégâts des ennemis sur les tours divisés par deux (v17.9)** : 0,2/frame
  pour un attaquant (0,4 avant), 0,075/frame pour les autres (0,15 avant).
- **Économie des tours rééquilibrée (v17.9)** : rapporté que construire une
  petite tour de plus rapportait plus de PV par or dépensé que renforcer
  une tour existante — l'inverse de ce qui était voulu. Corrigé : une tour
  neuve reste 10 or → 30 PV (3 PV/or) ; un renfort coûte maintenant le même
  prix (10 or, au lieu de 15/30 croissant) mais rapporte plus de PV (+40,
  supérieur aux 30 PV d'une tour neuve) → 4 PV/or à chaque palier,
  toujours plus rentable que multiplier les petites tours. Même principe
  appliqué aux dégâts des tours : petit bonus linéaire par palier (+6,
  soit la moitié des dégâts de base, par renfort) pour qu'une tour
  renforcée batte aussi en puissance de feu.
- **Réparation par session, 1 or (v17.10)** : réparer une tour (sans la
  renforcer) coûte maintenant 1 or, mais une seule fois par "session" —
  tant qu'on reste collé à la même tour, la réparation continue
  gratuitement jusqu'à ce qu'elle soit finie ou qu'on s'éloigne.
  S'éloigner puis revenir relance une session (donc recoûte 1 or) :
  encourage à rester sur place plutôt que faire des allers-retours.
  Renforcer une tour continue de la réparer entièrement d'un coup,
  gratuitement, peu importe les dégâts déjà là (déjà le cas avant,
  inchangé).

## 📜 Historique des versions (résumé)

- v1 : prototype initial (déplacement, tours, vagues)
- v2 : contrôles tactiles (joystick, double-tap), style beige
- v3 : plein écran, mouvement organique, projectiles en sphères
- v4 : tri des calques par profondeur
- v5 : déplacement libre plein écran (fin de la grille de placement d'origine)
- v6 : numéro de version cliquable, lien menu vers Bastion Orbit
- v7 : correctif d'un plantage bloquant dès le 1er ennemi
- v8 : nettoyage du menu
- v9 : vagues organiques, tours-murs (collision), or au kill, bruitages,
  écran de défaite repensé
- v10 : or/kill réduit à 1, correctif audio (débloqué au 1er geste)
- v11 : grille de construction (carrée — à revoir, voir 🚧 ci-dessus)
- v12 : correctif du saut visuel des ennemis au démarrage du mouvement,
  vitesse ennemis -20%, vitesse de tir des tours +20%
- v13 : grille isométrique restaurée (le carré était une fausse bonne
  idée), thème Vikings (bateau, plage)
- v14 : santé du joueur (couleur jaune → rouge, cadence de tir réduite,
  régénération en zone tampon)
- v15 : bateau par vague (proue vers le bas, position aléatoire, animation
  d'accostage), vitesse du joystick analogique
- v16 : économie des pubs (sauvegarde locale, FAQ, code bonus), IA des
  ennemis à mémoire (colonnes préférées, imitation, engagement variable,
  ciblage des tours faibles, rôle harceleur), écran de mort du joueur
  (revivre / spectateur / défaite finale)
- v17 : correctif audio (déblocage répété au lieu d'une seule fois),
  clignotement à santé critique, joueur invisible en spectateur, bandeau
  de bonus (revenu passif, dégâts, construire/renforcer une tour — retrait
  du double-tap), correctif de la position de construction (au-dessus du
  joueur, pas en bas à droite), élan résiduel du joystick, bouton
  "Recommencer" dans le menu
- v17.1 : vitesse des ennemis divisée par deux
- v17.2 : tir manuel par défaut (tap/clic) + bonus "tir auto" (4e bouton),
  revenu passif à paliers (au lieu d'un achat unique), fausse erreur de
  pub honnête avant d'accorder le bonus (même chose sur Knight Wars)
- v17.3 : deux cadences de tir manuel (tap répété = rapide, maintien = fixe
  et plus lent)
- v17.4 : vague 1 réduite à 2 ennemis (au lieu de 5)
- v17.5 : plafond du tir manuel remonté à 20 taps/s (50ms, au lieu de 150ms)
- v17.6 : tir manuel pendant un déplacement au joystick — ANNULÉ en v17.8
  (malentendu) ; tir auto et manuel se cumulent au lieu de se bloquer
- v17.7 : portée du joueur illimitée, précision dégradée par la distance
  (10 paliers, 100%→20%), tir raté qui dévie visiblement et peut toucher
  un autre ennemi par hasard
- v17.8 : annule le correctif v17.6 — rester appuyé tire même en bougeant
- v17.9 : 4 types d'ennemis (couleurs, PV/vitesse propres, boss rare tous
  les 5 vagues), PV en croissance linéaire (plus exponentielle), vitesse
  fixe par type + variation organique individuelle, +1 ennemi/vague (au
  lieu de +3), dégâts ennemis sur tours divisés par deux, renforcer une
  tour rendu plus rentable que construire à côté (PV et dégâts)
- v17.10 : réparer une tour coûte 1 or par session (gratuit tant qu'on
  reste, recoûte si on s'éloigne puis revient)
- v17.11 : progression infinie par formule, remplace les 3 systèmes à
  paliers plafonnés en dur (or passif, dégâts joueur, niveau de tour —
  voir discussion ci-dessous, désormais tranchée)

## Progression infinie par formule (v17.11 — remplace les plafonds de v17.9)

Discussion menée en 3 étapes explicitement demandées : 1) se comprendre,
2) concevoir, 3) coder — rien codé avant l'étape 3.

**Principe retenu** : au lieu de coder chaque palier à la main avec un
plafond en dur (ancien `TOWER_MAX_LEVEL`, `AUTO_GOLD_MAX_LEVEL`,
`DMG_MAX_LEVEL`), chaque bonus achetable a maintenant une formule qui
calcule son coût et sa puissance au palier n, sans limite — le palier
300 se calcule directement, pas besoin de l'avoir écrit à la main.

- Variable d'entrée : l'or dépensé sur ce bonus précis (confirmé par
  l'utilisateur via quiz, en comptant le nombre de paliers achetés plutôt
  que l'or cumulé littéral — équivalent puisque le coût par palier est
  fixe une fois le palier atteint).
- Coût du palier n = coût de base × 1,027^(n-1) (croissance géométrique,
  confirmée par quiz) — calé pour qu'environ 1 million d'or dépensé
  amène vers le palier 300, repère donné par l'utilisateur.
- Puissance au palier n = valeur de base × 1,05^(n-1) (courbe géométrique
  aussi, confirmée : "Géométrique, c'est parfait, fonce") — le rapport
  puissance/coût reste stable en début de jeu.

**Compromis assumé, pas encore explicitement discuté avec l'utilisateur
avant le codage** : en v17.9, la règle était "renforcer une tour existante
doit toujours être plus rentable que construire une petite tour à côté à
chaque palier". Avec deux croissances géométriques, cette règle-là ne
peut pas tenir indéfiniment à un rythme doux (elle exigerait que la
puissance grimpe à un rythme ≥100%/palier, ce qui serait absurde). Choix
fait : la puissance grimpe un peu plus vite que le coût (1,05 contre
1,027), donc l'écart entre renforcer et construire neuf grandit avec le
temps plutôt que d'être garanti dès le palier 1 — logique de jeu "idle"
(l'investissement soutenu finit par dominer) plutôt que garantie stricte
à chaque instant. Conséquence mesurée : au palier 300 (repère donné par
l'utilisateur), le coût n'a été multiplié que par environ 3000, mais la
puissance par environ 2,3 millions — très généreux en fin de partie
extrême, à surveiller si des joueurs poussent aussi loin.

Affichage : la hauteur visuelle d'une tour et le rayon du projectile du
joueur montent en sous-linéaire (log2 / racine carrée) pour ne pas sortir
de l'écran à très haut palier, même si les stats réelles montent plus
vite en dessous.

Vérifié avec Playwright : formules calculées directement pour les
paliers 1 et 300 (cohérentes avec le repère "1M or → palier 300"), achats
répétés (20×) sans jamais buter sur un plafond, tour renforcée 10 fois de
suite sans erreur JS, aucune erreur console.

## v17.12 : correctif audio iPhone, construction jamais bloquée, château = compteur de brèches visuel, décor isométrique

- **Correctif audio iPhone (interrupteur sonnerie/silence sur silence)** :
  rapporté "aucun son, jamais". Diagnostic confirmé par l'utilisateur
  (quiz) : iPhone, interrupteur sur silence. Cause connue et documentée
  (bug WebKit #237322) : la Web Audio API reste muette sur iOS Safari
  quand l'interrupteur physique est en mode silence, contrairement aux
  balises `<audio>` classiques. Correctif standard ("unmute-ios-audio") :
  jouer une fois un fichier `<audio>` silencieux au premier geste, ce qui
  débloque ensuite la Web Audio API même interrupteur sur silence.
  Sources : bugs.webkit.org/show_bug.cgi?id=237322,
  github.com/feross/unmute-ios-audio, github.com/swevans/unmute.
- **Construction de tour ne bloque plus jamais en silence** : si la case
  visée par défaut (juste au-dessus du joueur) est déjà prise par une
  tour existante, cherche automatiquement la case libre la plus proche
  (à gauche puis à droite, le plus court détour) et construit là au lieu
  de ne rien faire. Le joueur se décale tout seul sur le côté (la
  collision tour/joueur déjà existante s'en charge).
- **Château = compteur de brèches visuel** : remplace le texte
  "Brèches : x/10" (retiré du bandeau du bas) par le petit rectangle
  autrefois "zone de régénération verte" — maintenant un rectangle clair
  façon pierre avec bordure/créneaux "muraille", coupé en 10 tranches
  horizontales. Chaque brèche détruit une tranche en partant du haut ;
  la zone reste la zone de régénération de santé du joueur (même
  fonction, juste redessinée). Le numéro de vague migre dans le bandeau
  du haut, centré ; le bandeau du bas n'affiche plus que l'or.
- **Bateau et chemin en isométrique** : le bateau (ancien sprite PNG à
  plat, hérité de Knight Wars) est redessiné avec la même technique que
  les tours (drawIsoBox) + un mât/voile simple. Un petit chemin
  décoratif part du bord du château et sort de l'écran en suivant les
  diagonales de la grille isométrique (aucun effet de jeu, juste pour
  suggérer une carte plus grande autour).

Vérifié avec Playwright (iPhone 13 émulé, gestes tactiles réels via CDP) :
déblocage audio confirmé (état "running", fichier silencieux lu sans
erreur), 6 constructions à la suite sans chevauchement ni échec silencieux,
château/bateau/chemin dessinés sans erreur JS pendant 30s de jeu multi-
vagues, suite de régression complète (test-big, test-features,
test-autofire, test-cadence, test-joyfire, test-bonusbar) toujours verte.

## v17.13 : garantie économie des tours + tir auto en progression infinie

- **Renfort de tour toujours garanti plus rentable qu'une tour neuve**,
  demandé explicitement en revenant sur le compromis noté en v17.11 (qui
  laissait l'écart se creuser avec le temps sans le garantir dès le
  départ). Correctif mathématique : au lieu de faire grandir le PV TOTAL
  de façon géométrique depuis la base (30 PV), ce qui donne des gains
  minuscules aux premiers paliers (1,5 PV au palier 1, impossible à
  garder rentable sans coûts ridicules), c'est l'INCRÉMENT ajouté à
  chaque palier qui grandit géométriquement (5%/palier), en partant de
  40 PV au 1er renfort — repris tel quel de v17.9, déjà validé (40/10 or
  = 4 PV/or, mieux que les 3 PV/or d'une tour neuve). Comme l'incrément
  grandit plus vite (5%) que le coût du renfort (2,7%), le ratio ne fait
  QUE s'améliorer avec le niveau : 4 PV/or au palier 1, 4,8 au palier 10,
  36 au palier 100, 3007 au palier 300 — jamais en dessous de 4, garanti
  pour toujours, pas seulement en moyenne. Même traitement pour les
  dégâts des tours (incrément de 6, repris de v17.9).
- **Tir auto en progression infinie** : n'est plus un simple interrupteur
  acheté une fois (20 or) mais un palier de plus qu'on peut continuer à
  acheter pour augmenter le débit (intervalle entre deux tirs auto réduit
  de 5%/palier, jusqu'à un plancher de 80ms pour rester jouable).

Vérifié avec Playwright : ratio PV/or calculé aux paliers 1, 2, 3, 5, 10,
30, 100, 300 (toujours ≥ 4, jamais en dessous du seuil de 3 d'une tour
neuve), dégâts et intervalle de tir auto cohérents à plusieurs paliers,
suite de régression (bonusbar, autofire, cadence) toujours verte.

## v17.14 : ajustements sur croquis reçu (grille, château pleine largeur, chemin)

Trois corrections reçues sous forme d'un screenshot annoté (tracé au
doigt) plutôt que par description :
- **Grille de construction affichée par défaut** (`showGrid = true`)
  pour l'instant — pas encore de bouton dédié, juste le comportement
  par défaut inversé.
- **Château sur toute la largeur de l'écran** (rectangle `REGEN_ZONE`),
  au lieu d'un rectangle centré de 150px comme en v17.12 — repris du
  tracé (grand rectangle barré en bas, toute la largeur).
- **Chemin décoratif retracé** : part maintenant du bord du château vers
  le haut-gauche (au lieu de vers la droite hors-écran comme en v17.12),
  suivi du tracé à ~50% de précision comme demandé ("largement
  suffisant").

Vérifié avec Playwright + capture d'écran comparée visuellement au
croquis reçu : grille visible, château pleine largeur avec bordure
"muraille", chemin en zigzag vers le haut-gauche façon esquisse. Suite
de régression (audio, construction, château, bateau/chemin) toujours
verte, aucune erreur JS.

## v17.15 : château en créneaux + introduction progressive des types d'ennemis

- **Château : créneaux au lieu de tranches**, corrigé sur un retour direct
  après v17.14. Le mur reste entier (ne rétrécit plus en hauteur) ; ce
  sont 10 créneaux égaux et régulièrement espacés le long du bord haut
  qui font office de compteur de brèches visuel — un détruit par brèche,
  simplement, comme des dents qui manquent sur le mur.
- **Introduction progressive des types d'ennemis par vague**, en
  reprenant les repères donnés (type rapide/fragile dès vague 5, type
  rapide/costaud vers vague 10, boss repoussé vers vague 200 — voir
  discussion en quiz) : chaque type est à 0% avant sa vague de
  déblocage, puis grimpe doucement jusqu'à son taux plein sur quelques
  vagues (pas de rupture nette, confirmé en quiz). Le boss n'apparaît
  plus toutes les 5 vagues (bien trop fréquent pour un ennemi censé
  être rare) : première apparition vers la vague 200, puis revient de
  loin en loin (toutes les 30 vagues) — jamais plus d'un par vague.
  Explicitement demandé ensuite : cette règle doit être un PROGRAMME
  (formule simple, sans table figée) qui fonctionne à n'importe quelle
  vague, même très lointaine — pas un système qui "s'arrête" à un
  certain numéro de vague. C'est déjà le cas : `rampedRate()` et le
  modulo du boss sont des formules pures, valables à l'infini. La
  difficulté d'ensemble continue aussi de grimper indéfiniment via le
  nombre d'ennemis (+1/vague) et leurs PV (linéaire, +3/vague, déjà en
  place depuis v17.9) — le mélange de types se stabilise après quelques
  dizaines de vagues, mais ce n'est pas ce qui porte la difficulté
  infinie, c'est la variété plutôt que l'escalade.

Vérifié avec Playwright : distribution des types échantillonnée à
plusieurs vagues (0% avant déblocage, montée progressive confirmée,
100% des tirages "spéciaux" à boss à la vague 200 avec un seul boss
réellement spawné par vague dans la vraie boucle de jeu), créneaux
détruits visibles et correctement espacés sur capture d'écran (3 brèches
= 3 créneaux manquants à gauche), suite de régression complète toujours
verte, aucune erreur JS.

## 📥 Grosse vague de demandes (à trier) — reçues d'un coup, dictée vocale

Beaucoup de choses arrivées en rafale. Notées ici en premier pour ne rien
perdre, avant tri/implémentation. Certaines seront traitées tout de
suite (petites, claires), d'autres restent en discussion (grosses,
demandent des questions).

### Petites, claires → à faire vite

- ~~**Or par type d'ennemi tué**~~ → fait en v17.16 : base = 1 or,
  rapide/fragile = 2 or, rapide/costaud = 4 or, boss = 10 or
  (`ENEMY_TYPES[].goldReward`).
- ~~**Panneau historique de version transparent**~~ → fait en v17.16.
  Le vrai bug (pas juste de la transparence) : `#version-panel` est un
  enfant de `#topbar`, qui avait le même z-index (6) que `#bonusbar`/
  `#bottombar` mais apparaît avant eux dans le DOM — à z-index égal, le
  navigateur affiche l'élément le plus tardif dans le DOM au-dessus,
  donc les bandeaux du bas passaient devant le panneau quel que soit
  SON PROPRE z-index (10), puisque celui-ci ne compte que parmi les
  enfants de `#topbar`. Corrigé en montant le z-index de `#topbar` à 20
  (au-dessus de tout le reste). Ajouté aussi : `max-height` + `overflow-y:
  auto` pour pouvoir défiler jusqu'en bas d'une longue liste.
- ~~**Texte du FAQ à corriger**~~ → fait en v17.16 : retiré la mention
  d'hébergement (dit "pour soutenir le jeu" à la place), retiré la
  promesse fausse "jamais plus d'une pub par jour", et clarifié le
  positionnement pay-to-win (stratégie optimale = jamais besoin de payer
  ni de pub ; un petit bonus d'or existe pour repartir en cas de vrai
  blocage, sans condition de pub regardée).
- ~~**Tours plus rapides en montant de niveau**~~ → fait en v17.16 :
  cadence de tir des tours en progression infinie elle aussi (même taux
  que le reste, +5%/palier), avec un plancher (jamais plus de 4x la
  cadence de départ) — `towerShotInterval(t)`.
- ~~**Dégâts au château selon la taille/le type d'ennemi**~~ → fait en
  v17.18. Choix confirmé en quiz : proportionnel à la résistance du
  type. `ENEMY_TYPES[].breachDamage` : base = 1 créneau, rapide/fragile
  = 1, rapide/costaud = 2, boss = 3 (sur 10 créneaux au total).

### Indicateur "quelle tour va être renforcée" → fait en v17.16

Halo doré pulsé autour de la tour actuellement à portée d'upgrade
(même logique que `pickNearestTower` + `CONTACT_RANGE_PX` déjà utilisée
pour le bouton du bandeau).

### Bug signalé (vague 51, en spectateur) → 1er diagnostic ANNULÉ par l'utilisateur, cause réelle encore ouverte

Après la mort du joueur (choix "continuer à regarder"), 3 ennemis se
sont arrêtés en plein milieu de la carte, immobiles, jamais plus revenus
en mouvement — bloque la partie (le jeu ne peut plus se terminer tout
seul puisqu'ils n'avancent plus). Le joueur rappelle que le système de
collision n'est pas censé permettre à plusieurs ennemis d'être
exactement au même endroit — pour rappel côté notes internes : il
n'existe actuellement PAS de collision ennemi-contre-ennemi implémentée
(seulement joueur/tour et ennemi/tour) — la "collision souple entre
ennemis" reste dans le backlog ci-dessous, pas encore codée. Donc le
chevauchement visuel en lui-même n'était pas le bug.

**1er diagnostic (ANNULÉ) : hypothèse d'un siège de tour trop lent pour
se voir.** J'avais supposé qu'une tour très renforcée (v17.13) mettait
plusieurs minutes à tomber sous 3 attackers, donnant l'illusion d'un gel
— confirmé par simulation, mais l'utilisateur a corrigé : **il n'y avait
pas de tour du tout dans son cas**, juste 3 ennemis au même endroit,
immobiles. Cette hypothèse ne s'applique donc pas à ce qu'il a vu.

**Cause réelle : pas encore confirmée.** Piste la plus probable vu
l'absence de tour : un rôle non-attacker (rusher/harasser/drift) qui
finit, pour une raison à creuser, avec une vitesse quasi nulle — à
vérifier dans `driftTowardPreferred`/le rôle harasser (le calcul
`e.speed` dépend de `paceMult`, qui oscille mais ne devrait jamais
tomber à 0 ; à vérifier si un cas limite existe). Le simple
chevauchement (plusieurs ennemis à la même position) n'est lui pas un
bug en soi tant que la "collision souple entre ennemis" n'est pas codée
— reste à confirmer si les 3 ennemis étaient VRAIMENT immobiles
(vitesse nulle) ou juste très lents et superposés.

**Gardé quand même** : `SIEGE_GIVEUP_MS` (8 secondes, un attacker
abandonne une tour trop résistante après ce délai) reste une
amélioration légitime en soi (empêche un vrai siège interminable de
bloquer une vague), même si elle ne corrige pas le bug tel que
rapporté. Un attacker qui reste immobile au contact de la même tour
sans être parvenu à la détruire abandonne définitivement cette cible
après ce délai et repart en ligne droite vers le château (comme un
rusher, via `driftTowardPreferred`), quel que soit le niveau de la tour
visée. Garantit que la vague peut
toujours se terminer, peu importe à quel point une tour a été
renforcée. Vérifié par simulation : après ~8s de siège sans succès, les
ennemis marqués `siegeGaveUp` recommencent à avancer normalement vers
le bas de l'écran.

### Combat : 3 boutons séparés au lieu de 2 → fait en v17.17

- **Puissance** (dégâts par tir) — déjà là (bouton Dégâts), inchangé.
- **Cadence** — le bouton "Tir auto" est renommé "Cadence" (même
  mécanique qu'avant, juste un nom plus juste).
- **Précision** (nouveau bouton) : chaque palier referme 10% de l'écart
  restant vers 100% de précision (`precisionMissFactor`), sans jamais
  l'atteindre pile — vient réduire la chance de RATER déjà calculée par
  `hitChanceForDistance` (distance), pas la remplacer. Coût géométrique
  comme le reste (base 15 or, +2,7%/palier).
- **Bandeau de bonus** : réponse à "comment caser un 5e bouton" — un
  2e étage de boutons sous le premier ("on rajoute un étage de
  bouton"), pas un scroll ni une refonte. Le 1er étage garde ses 4
  boutons d'origine tels quels, le 2e étage accueille Précision (et les
  suivants, s'il y en a).

### Indicateur visuel "quelle tour va être renforcée" — doublon, déjà fait en v17.16

(Cette entrée était restée non barrée par erreur — même demande que
plus haut, déjà traitée : voir "Indicateur 'quelle tour va être
renforcée' → fait en v17.16".)

### Pipeline graphique 3D → isométrique (question posée par l'utilisateur)

L'utilisateur peut fournir un modèle 3D (Blender) ou un screenshot rendu
du modèle, et demande comment on pourrait le "vectoriser" pour l'intégrer
et avoir de meilleurs graphismes. Piste de réponse (pas encore discutée
en détail) : rendre le modèle depuis Blender avec une caméra orthographique
calée sur l'angle isométrique du jeu (le même ratio 2:1 que GRID_TW/GRID_TH),
exporter en PNG transparent, l'intégrer comme sprite (data URI, comme
l'était l'ancien bateau) plutôt que du vecteur pur (le rendu 3D préexporté
donne un bien meilleur résultat visuel qu'un tracé SVG à la main). À
creuser ensemble.

### 🔮 Grosses idées de gameplay (discussion nécessaire avant tout code)

- ~~**Effet de particules d'ambiance**~~ → fait en v17.21. 40 particules
  de 3 tailles (1/4/9px), dérivent en diagonale (vx:vy = 2:1, ratio de
  la grille GRID_TW/GRID_TH), recyclées quand elles sortent de l'écran —
  purement décoratif, par-dessus tout le reste.

- ~~**Mort d'un ennemi → croix qui monte au ciel**~~ → fait en v17.21,
  avec le nuage de fumée (ci-dessous), un seul effet combiné.

- ~~**Nuage de fumée noire à la mort**~~ → fait en v17.21. Nuage gris
  qui grandit et se dissipe (300ms), puis une croix sort du même point
  et monte en s'effaçant (700ms) — `spawnDeathEffect`/`drawDeathEffect`.

- ~~**Effet de morale/contagion à la mort**~~ → fait en v17.21 (partie
  mécanique) puis v17.24 (partie "apprentissage", détail plus bas :
  `clusterRisk` dans le système de mémoire à colonnes).

- ~~**Ennemis affaiblis qui fuient vers le bateau**~~ → fait en v17.21,
  avec une différence assumée : fuient toujours vers le bateau (zone en
  haut de l'écran), pas "hors-écran gauche/droite" comme alternative —
  simplifié pour une 1re version. Sous 25% de PV, chance de fuir à
  chaque frame (pas systématique) ; une fois au bateau, guérit la moitié
  du manquant, une seule fois dans sa vie (`healUsedAtBoat`), puis
  reprend son rôle normal.

- ~~**Cimetière quand une tour est détruite**~~ → fait en v17.21. Une
  croix apparaît à l'emplacement (`towerGraves`), bloque la
  reconstruction exactement dessus (le système de case de secours de
  v17.12 trouve un emplacement voisin à la place, comme pour une tour
  déjà là). Se retire automatiquement à la fin de la vague, ou si le
  joueur reste dessus 1,5s (`GRAVE_PRAY_MS`) — bulle avec une petite
  croix au-dessus de sa tête pendant la prière, progression visible.

- ~~**Easter egg des marchands**~~ → fait en v17.20 (idée développée en
  détail, LA plus grosse) :
  - Condition de déclenchement : si aucun ennemi n'est passé par une
    case du chemin décoratif depuis au moins une vague, ET que le
    joueur reste sur le chemin 5 secondes, une caravane de marchands
    apparaît et avance vers le château en suivant le chemin (une grosse
    bille suivie de 3 petites, façon chenille).
  - Récompense si elle arrive au château : 20% de ce que la vague
    actuelle aurait rapporté si tous les ennemis avaient été tués,
    affiché en animation de chiffres.
  - Les marchands ont une barre de vie. S'ils arrivent intacts (jamais
    touchés), ils se transforment en 4 soldats à notre service (taille
    uniforme, on oublie la différence grosse bille/petites billes) —
    chaque soldat a la moitié de la force du joueur. S'ils sont juste
    blessés (pas tués) en route, ils rebroussent chemin vers le bateau
    pour se soigner (voir "ennemis qui fuient" ci-dessus — même
    mécanique de soin à 50% de la vie manquante, une fois dans leur
    vie) et retentent leur chance ensuite. S'ils meurent avant
    d'arriver, ils meurent, point final — pas de seconde chance.
  - Nombre de marchands par caravane : aléatoire, entre 1 et 8.
  - Les 4 soldats obtenus ont un comportement autonome piloté par une
    "jauge de moral" (nom de code à définir) : parfois ils restent
    cachés dans le château sans bouger, parfois ils partent sur le
    chemin, parfois ils se battent, parfois ils restent à côté du
    joueur, parfois ils se cachent derrière un mur/une tour, parfois
    ils vont se soigner au bateau. Ils sont autonomes et peuvent mourir
    s'ils ne sont pas "défendus" (pas vraiment des vrais soldats).
  - Progression des soldats : s'ils survivent à une vague, ils gagnent
    de l'expérience automatiquement (prennent moins de risques, se
    soignent tout seuls, restent près du joueur, se cachent derrière
    les murs, développent des stratégies) — un système de grade sans
    plafond (comme le reste du jeu). Survivre à 20 vagues doit les
    rendre "vraiment beaux" (forts).
  - **Tranché en quiz** : comportement piloté par un choix aléatoire
    pondéré (pas un score de moral calculé), pondération qui favorise
    les comportements prudents (soin, cachette) à mesure que le grade
    monte. Pas de plafond de puissance à terme — un vétéran peut un
    jour dépasser la force du joueur, assumé.
  - Effet recherché : sentiment de compagnie, des alliés qui se
    battent avec nous, qui "expérimentent" et développent mémoire et
    apprentissage comme les ennemis.
  - **Implémentation (v17.20)** : le chemin est "sali" quand un ennemi
    passe à moins de 26px d'un point du tracé (`PATH_TOUCH_RADIUS`),
    suivi vague par vague (`pathClearWaveStreak`) ; le joueur doit être
    à moins de 26px du chemin pendant 5s d'affilée pour déclencher.
    Récompense en or = approximation grossière `enemiesThisWave × 1,5`
    (moyenne pondérée des récompenses par type), documentée comme
    approximative — donnée à la première arrivée (blessée ou non) de la
    caravane au château. La conversion en 4 soldats est réservée au
    premier marchand qui arrive JAMAIS touché (`everWounded`, un
    drapeau à vie, pas remis à zéro par le soin) — un marchand blessé
    qui revient sain après un soin ne peut plus jamais convertir, il
    continue juste à faire l'aller-retour. Soldats : dégâts et PV
    calculés par les mêmes formules `Math.pow(UPGRADE_POWER_GROWTH,
    grade)` que le reste du jeu (grade++ à chaque vague survécue, sans
    plafond), comportement choisi par tirage pondéré parmi 4 options
    (combattre/garder/cacher/soigner) re-tiré toutes les ~3-4,5s, le
    poids de prudence grimpe avec le grade. Choix simplifiés
    volontairement pour une 1re version : les 4 soldats sont toujours de
    taille uniforme (pas de distinction grosse/petite bille reprise), le
    "retour au bateau" pour se soigner (marchands et soldats) vise en
    fait le bout du chemin plutôt que la position exacte et mobile du
    bateau — approximation visuelle, pas fonctionnellement gênante.

- ~~**Mécanique de la Forge**~~ → fait en v17.19 (nom du jeu = Forge
  Line, le mot "forge" enfin exploité littéralement). Zone délimitée en
  bas à droite du château (`FORGE_ZONE`), visible sur la carte même
  avant construction (case grisée avec ⚒️) pour savoir où aller. Il faut
  être PHYSIQUEMENT dans la zone pour agir dessus (contrairement au
  bandeau, inaccessible à distance) :
  - Construction : 100 or, une fois (`forgeBuilt`).
  - Une fois construite, la zone devient chaude (fond brun, bordure
    orange façon braise) et propose "Tours d'élite" : un multiplicateur
    global sur TOUTES les tours (PV et dégâts), en progression infinie
    comme le reste (`forgeEliteLevel`, base 40 or).
  - Système à part, EN PLUS du bandeau de bonus actuel (tranché en
    quiz) — le bandeau (Revenu auto/Puissance/Cadence/Précision/
    Construire) n'a pas bougé.
  - Le multiplicateur s'applique aux DEUX termes de la formule des
    tours (base ET incrément) à parts égales, donc la garantie
    "renfort toujours plus rentable qu'une tour neuve" (v17.13) tient
    toujours, à n'importe quel niveau de Forge — vérifié par calcul
    (ratio identique avant/après achat de plusieurs paliers).
  - `t.maxHp` recalculé en direct chaque frame (pas mis en cache) :
    acheter un palier de Forge relève tout de suite le plafond de
    TOUTES les tours déjà posées, pas seulement des futures.

Pas encore trié ni implémenté au moment de cette note, sauf les points
listés "petites, claires" et "dégâts au château" qui ont été attaqués
dans la foulée (voir v17.18).

## v17.16 : or par type, correctifs UI, tours plus rapides, correctif siège infini

Voir la section "Grosse vague de demandes" ci-dessus pour le détail
complet de chaque point traité et de ceux qui restent ouverts. Résumé :
or variable par type d'ennemi tué (1/2/4/10), panneau de version
vraiment opaque et scrollable (vrai bug de z-index diagnostiqué, pas
juste de la transparence), FAQ plus honnête sur les pubs/achats, tours
qui tirent plus vite en montant de niveau, halo doré sur la tour ciblée
par un upgrade, et correctif du "siège infini" (un attacker abandonne
après 8s s'il n'arrive pas à bout de sa cible, pour que la vague puisse
toujours se terminer même contre une tour très renforcée).

Vérifié avec Playwright : suite de régression complète toujours verte,
simulation dédiée du scénario de siège (tour niveau 60, 3 attackers)
confirmant le diagnostic ET l'efficacité du correctif, panneau de
version vérifié scrollable et opaque par capture d'écran avant/après.

## v17.17 : bouton Précision, correctif du diagnostic vague 51, retour utilisateur intégré

- **Bouton Précision** ajouté (3e dimension du combat, avec Puissance
  et Cadence — "Tir auto" renommé "Cadence"). Progression infinie comme
  le reste, referme 10% de l'écart restant vers 100% par palier, sans
  jamais l'atteindre. Le bandeau de bonus passe à 2 étages pour
  l'accueillir, sur demande explicite ("on rajoute un étage de
  bouton") plutôt qu'un scroll ou une refonte.
- **Correction honnête du diagnostic vague 51** (v17.16) : l'utilisateur
  a signalé que mon hypothèse de "siège de tour trop lent" était fausse
  pour son cas précis — il n'y avait pas de tour du tout, juste 3
  ennemis superposés et immobiles. Annulé dans les notes (pas
  supprimé) ; la cause réelle reste à confirmer, piste la plus probable
  notée pour la prochaine fois. Le correctif `SIEGE_GIVEUP_MS` reste en
  place (amélioration légitime indépendamment de ce bug précis).

Vérifié avec Playwright : formule de précision cohérente à plusieurs
paliers (0%, 10%, 41%, 88%, ~99,997% de l'écart refermé), bouton
désactivé sans assez d'or puis achat confirmé, bandeau à 2 lignes
vérifié par capture d'écran, suite de régression complète toujours
verte, aucune erreur JS.

## v17.19 : la Forge (système de compétences à part, en plus du bandeau)

Premier système "additionnel" au jeu (jusqu'ici tout passait par le
bandeau de bonus) : une zone délimitée près du château qu'il faut
rejoindre physiquement pour agir dessus. Construction (100 or, une
fois) puis "Tours d'élite" (multiplicateur global sur toutes les
tours, progression infinie). Détail complet dans la section
"Grosse vague de demandes" ci-dessus.

Vérifié avec Playwright : bouton désactivé hors zone ("Va à la
Forge"), désactivé sans assez d'or dans la zone, construction
confirmée (or déduit, état persistant), achat de "Tours d'élite"
confirmé sur plusieurs paliers avec la garantie renfort/neuf toujours
intacte (ratio identique avant/après), rendu visuel vérifié par
capture d'écran (zone grisée avant construction, braise orange après),
suite de régression complète toujours verte, aucune erreur JS.

## v17.20 : l'easter egg des marchands (caravane, soldats, grade sans plafond)

Plus gros morceau du backlog, implémenté en une passe après le quiz sur
l'IA des soldats et le plafond de puissance. Détail complet dans la
section "Grosse vague de demandes" ci-dessus. Résumé : chemin "sali" par
le passage d'ennemis, suivi vague par vague ; 5s d'immobilité sur un
chemin resté propre depuis 1 vague déclenche une caravane (1-8
marchands) ; dégâts de contact, retraite-soin-retentative pour les
blessés, mort définitive s'ils tombent à 0 PV ; récompense en or à la
première arrivée, conversion en 4 soldats réservée à un marchand jamais
touché ; soldats avec IA à tirage pondéré (poids de prudence croissant
avec le grade) et progression de grade sans plafond, cohérente avec le
reste du système de progression infinie du jeu.

Vérifié avec Playwright : condition de déclenchement (chemin sale
bloque, joueur qui ressort du chemin relance le minuteur), cycle complet
blessure→retraite→soin (une fois)→nouvelle tentative, conversion en
soldats réservée à un marchand jamais touché (testé isolément avec un
marchand neuf), récompense en or vérifiée au montant attendu, soldats
fonctionnels sur 600 frames simulées (aucun crash, dégâts qui montent
avec le grade), rendu vérifié par capture d'écran (caravane le long du
chemin avec barres de vie, 4 soldats verts autour du joueur), suite de
régression complète + 30s de jeu multi-vagues sans surveillance
toujours vertes, aucune erreur JS.

## v17.21 : particules, mort (fumée/croix), morale de groupe, fuite/soin, cimetière des tours

Reste de la liste "atmosphère" traité en une passe. Détail complet dans
la section "Grosse vague de demandes" ci-dessus.

**Bug trouvé et corrigé au passage, sans lien avec l'atmosphère** : les
numéros de version type "17.20"/"17.10" s'affichaient "17.2"/"17.1" —
en JS, `17.20` et `17.10` sont des NOMBRES, et `17.20 === 17.2`
(le zéro final disparaît). Pire : ça faisait entrer en collision
l'affichage de deux entrées bien réelles et différentes (la vraie
v17.2 de "tir manuel par défaut" et la v17.20 des marchands
s'affichaient identiquement "v17.2"). Corrigé en stockant ces
numéros-là comme des CHAÎNES ("17.20", "17.10") plutôt que des
nombres — seuls ceux avec un zéro final étaient concernés.

Vérifié avec Playwright : particules qui dérivent et se recyclent aux
bords, effet de mort confirmé sur simulation directe (fumée → croix),
contagion vérifiée (PV du voisin qui baisse), cycle fuite → soin
confirmé sur simulation longue, cimetière vérifié de bout en bout
(tombe créée, construction bloquée exactement dessus mais pas à côté,
prière qui fonctionne, tombe retirée), affichage de version vérifié
("v17.21" au lieu de "v17.2"), suite de régression complète + capture
d'écran de tous les nouveaux éléments, aucune erreur JS.

## v17.22 : parfois 2-3 bateaux par vague, musique de fond + bouton mute, simulateur de difficulté

**Bateaux multiples.** La plupart des vagues n'ont toujours qu'un seul
bateau, mais désormais parfois deux (17%) et rarement trois (3%) —
tirage pondéré à chaque nouvelle vague. Chaque bateau s'échoue et
débarque ses ennemis indépendamment ; chaque ennemi qui spawn choisit
au hasard l'un des bateaux déjà échoués de la vague comme point de
départ (pas toujours le même). La condition "au moins un bateau
échoué avant de spawner" s'applique à l'ensemble (`boats.some(b =>
b.landed)`), pas à un seul bateau fixe.

**Musique de fond.** Ajout du morceau fourni par l'utilisateur
(`assets/ambience.ogg`, ~6,8 Mo, ambiance pluie/nuit). Servi comme
fichier séparé plutôt qu'encodé en base64 dans la page : ça aurait
ajouté ~9 Mo au fichier HTML unique (décision historique "un seul
fichier, pas de dépendances externes" — voir plus haut) pour un
morceau qui n'a pas besoin d'être présent tant que le menu n'est pas
ouvert. C'est un vrai écart à cette règle, assumé : le jeu n'est plus
strictement mono-fichier depuis cette version. À garder en tête si un
jour le site est dupliqué/archivé ailleurs — il faut aussi copier
`assets/`.
Volume modéré (0,35) pour ne pas couvrir les bruitages synthétisés.
Démarrage sur le premier geste utilisateur (comme le reste de
l'audio, contrainte des navigateurs). Bouton "Couper la musique" /
"Remettre la musique" dans le menu, état mémorisé en localStorage.
**Licence** : confirmée par l'utilisateur — licence libre, utilisation
autorisée sans attribution obligatoire. Sujet clos, pas de ligne de
crédit à ajouter.

**Simulateur de difficulté (`simulate.mjs`).** Nouvel outil, hors
page de jeu, pour tester des dizaines de parties sans dépenser des
milliers de tokens à jouer à la main : un seul navigateur headless,
toutes les parties tournent en boucle synchrone dans la page avec des
timestamps synthétiques (aucune attente réelle, aucune capture
d'écran). Deux stratégies simulées : "solo" (ne construit jamais,
tir manuel en continu) et "towers" (construit une tour dès que
possible puis alterne renfort/dégâts). Voir l'en-tête du fichier pour
l'usage.

Deux bugs trouvés et corrigés **dans l'outil de test lui-même** (pas
dans le jeu) pendant sa mise au point :
- la boucle `requestAnimationFrame` native de la page continuait de
  tourner en parallèle de nos appels manuels à `update()` avec des
  timestamps synthétiques — deux horloges (temps réel vs. simulé) qui
  se marchaient dessus, corrompant l'état sur les parties longues
  (vagues bloquées, jusqu'à un crash de rendu observé : rayon négatif
  passé à `arc()`). Corrigé en neutralisant `requestAnimationFrame`
  dès le chargement de la page (`page.addInitScript`).
- `endWave` n'était mis à jour qu'en cas de mort (brèche ou santé à
  0) ; une partie qui atteignait la limite de frames sans mourir
  rapportait "vague 1" quel que soit son avancement réel. Corrigé en
  reportant la vague courante dans ce cas.

Résultat obtenu une fois l'outil fiable (8-10 essais par stratégie,
45000 frames ≈ 750s de jeu simulé) : la stratégie "solo" (aucun achat,
tir manuel continu façon joueur qui tape vite) échoue de façon très
régulière entre les vagues 16 et 22 ; la stratégie "towers" (une tour
+ dégâts en boucle) va nettement plus loin, vagues 31 à 46+.
**Écart avec l'objectif énoncé** (tour obligatoire dès la vague ~3
sans investissement) : le bot "solo" simulé tape en continu à un
rythme irréaliste (~20 tirs/s, cadence limitée seulement par le
cooldown anti-spam) qu'aucun joueur humain ne soutient réellement —
ça le rend artificiellement fort. Plutôt que de rééquilibrer les
courbes de PV/vague à l'aveugle sur la base d'un bot non représentatif
d'un vrai joueur (risque réel de rendre le jeu trop dur pour de vrais
joueurs plus lents), le choix a été de ne PAS toucher aux constantes
de difficulté cette fois-ci, et de documenter la mesure ici : à
reprendre avec un bot au rythme de tir plus réaliste (ou des données
de vrais joueurs) avant de trancher.

Vérifié avec Playwright : distribution 1/2/3 bateaux confirmée proche
des poids attendus (~80/17/3%) sur un grand nombre de vagues,
`#bg-music`/bouton mute testés (lecture démarre au premier geste,
bascule pause/lecture, libellé à jour, persistance localStorage après
rechargement), suite de régression complète (construction/renfort,
tir manuel/auto, cadence, forge, marchands, atmosphère, panneau de
version, progression infinie) toujours verte, aucune erreur JS.

## v17.23 : courbe de difficulté resserrée (tour nécessaire dès la vague ~3)

Suite directe de la mesure v17.22 : le simulateur donnait un signal
biaisé (bot à 20 tirs/s, irréaliste). Ajout d'un paramètre
`--manualIntervalMs` à `simulate.mjs` pour rejouer la mesure à un
rythme de tap humain plausible (testé entre 250 et 450ms, soit
2-4 tirs/s). Résultat à ce rythme, AVANT retouche : le solo survivait
jusqu'à la vague 7-11 selon le rythme choisi — loin de l'objectif
"vague 3". Question posée à l'utilisateur (resserrer fort / modéré /
ne rien changer) : réponse "resserrer fort, viser vague 3".

**Ce qui a été retouché :**
- `WAVE_HP_STEP` : 3 → 6 PV/vague (toujours linéaire, juste 2x plus
  raide). Testé seul d'abord : quasi aucun effet sur le point de
  rupture (le goulet d'étranglement n'est pas la résistance d'un
  ennemi mais LE NOMBRE d'ennemis à traiter un par un avant qu'ils
  n'atteignent le château).
- Nombre d'ennemis par vague : **pas** un simple pas permanent plus
  fort (testé, mais un pas de +6 à +8/vague appliqué pour toujours
  aurait fait exploser la population d'ennemis en fin de partie — à la
  vague 300 par exemple, ça donnait ~2400 ennemis dans une seule vague
  au lieu de ~300). À la place : une "ruée" resserrée sur les 8
  premières vagues seulement (`EARLY_RUSH_WAVES`, `EARLY_RUSH_STEP` =
  +8 ennemis/vague pendant la ruée), qui rejoint ensuite SANS À-COUP le
  rythme de croisière d'origine (`WAVE_ENEMY_COUNT_STEP` = +1/vague,
  inchangé) — le calcul se fait maintenant par une fonction
  `enemiesForWave(w)` plutôt qu'un `+=` cumulatif, pour que ce
  recollage soit exact. Effet à long terme : un décalage fixe et
  modeste (+49 ennemis/vague, pour toujours) au lieu d'un facteur qui
  grandit indéfiniment — vérifié par calcul direct aux vagues 50, 100,
  200, 300, 500 (voir script de test), aucune explosion.

**Résultat mesuré** (10 essais/stratégie, 300ms/tir, 60000 frames) :
solo échoue désormais vagues 3-4 (moyenne 3,9, minimum 3 — jamais avant
la vague 3, jamais après la vague 4) ; "towers" (une seule tour fixe,
bot volontairement simple) va de la vague 4 à 9, parfois plus loin. Le
bot "towers" reste un plancher, pas un plafond : un vrai joueur qui
bouge, vise mieux et construit plusieurs tours ira sensiblement plus
loin — pas mesuré ici faute d'un bot multi-tours, à garder en tête si
le calibrage doit être affiné encore.

Vérifié avec Playwright : suite de régression complète (construction/
renfort, tir manuel/auto, cadence, forge, marchands, atmosphère,
panneau de version, progression infinie, distribution des types
d'ennemis) toujours verte, aucune erreur JS. Densité d'ennemis en fin
de partie vérifiée directement (vagues 50 à 500) : pas d'explosion.

## v17.24 : ennemis "niveau 1" toujours 1 coup, cheval de Troie, apprentissage de la morale, bateau + collision

Grosse passe, quatre décisions tranchées par quiz puis tout implémenté
d'un coup ("fais tout, le reste pose question").

**Ennemis de base toujours 1 balle = 1 mort.** Précision demandée après
v17.23 : la difficulté ne doit JAMAIS venir de PV qui montent sur le
type de base ("niveau 1"), seulement du NOMBRE d'ennemis, puis de
l'arrivée de types plus forts. Nouveau champ `type.scalesWithWave`
(false pour `base`, true pour les autres) : le type de base reste figé
à `BASE_ENEMY_HP` pour toujours, les autres types montent en PV avec la
vague comme avant — ce sont eux qui doivent se "sentir" plus forts en
avançant.

Conséquence mesurée : geler les PV du type de base rendait le solo
bien plus résistant qu'avant (chaque tir devient un kill garanti,
aucun gâché) — le calibrage v17.23 (vague ~3) ne tenait plus, mesuré à
nouveau autour de la vague 7. **Découverte en retunant** : augmenter le
NOMBRE total d'ennemis par vague seul ne suffit pas — ça allonge juste
la vague (plus d'ennemis à traiter), sans forcément augmenter le
risque de brèche, parce que la CADENCE d'arrivée (`pickNextSpawnDelay`)
est indépendante du total et n'avait pas bougé. Le vrai levier de
pression, c'est la cadence. Solution : pendant les 8 premières vagues,
spawn 2x plus vite (constante dupliquée en dur dans
`pickNextSpawnDelay`, appelée avant que `EARLY_RUSH_WAVES` n'existe
encore au chargement de la page — ordre du script), combiné à
`EARLY_RUSH_STEP` recalibré (11, contre 8 en v17.23). Résultat retesté
: solo échoue de nouveau vagues 3-4 (moyenne 3,5, jamais avant la
vague 3), tour = vagues 3-6.

**Cheval de Troie (easter egg).** Rester trop longtemps dans l'eau
(au-dessus de la plage) déclenche un avertissement (3s) puis fait
sortir un cheval de Troie du bateau (6s), qui descend vers le château
comme un ennemi normal (implémenté comme une entrée de `enemies` avec
`isTrojan:true`, réutilise tout le pipeline existant — ciblage,
collision, dessin — plutôt qu'un système à part). Tranché avec
l'utilisateur : s'il atteint le château, défaite immédiate
(`breachDamage:10`, fait sauter directement le seuil des 10 brèches,
modal dédiée "Le cheval de Troie a atteint le château") ; s'il est
détruit à temps, **3 ENNEMIS** (`fast_tough`, pas des alliés — décision
explicite de l'utilisateur, à l'inverse de ma proposition par défaut)
en descendent et doivent être combattus normalement. Peut se
reproduire, avec 15 vagues de recharge après chaque déclenchement (pas
un piège répétitif à chaque fois qu'on traîne un peu dans l'eau).

**Apprentissage de la morale de groupe.** Partie qui manquait depuis
v17.21 : `columnStats` gagne un champ `clusterRisk`, incrémenté
spécifiquement quand une mort est elle-même le fruit d'un effet
domino de la contagion de morale (`e.tookMoraleDamage`), pas une mort
au combat normal — distinct des `deaths` déjà comptés. `pickPreferredX()`
pénalise les colonnes à `clusterRisk` élevé, donc les ennemis
(nouveaux spawns ET rerolls des indécis) évitent de plus en plus les
endroits où se regrouper a coûté cher — l'apprentissage recherché,
sans plafond ni décote (comme le reste de la mémoire à colonnes, jamais
remise à zéro en cours de partie). **Bug trouvé au passage** :
`resetGame()` reconstruisait `columnStats` à la main avec l'ancienne
forme (sans `clusterRisk`) — après un reset, tous les poids de
`pickPreferredX()` seraient devenus `NaN`. Corrigé.

**Bateau : mémoire d'accostage + passagers visibles.** L'accostage
choisit sa position à 70% via `pickPreferredX()` (la même mémoire de
colonnes que les ennemis, favorise les zones qui ont "payé") et à 30%
au hasard, au lieu de purement aléatoire. Les ennemis de la vague sont
désormais décidés D'UN COUP à l'arrivée du bateau (`buildWaveEnemyQueue`,
appelle `pickEnemyType()` en boucle — garde tous ses effets de bord
habituels, boss unique par vague compris) et répartis entre les
bateaux (`assignBoatPassengers`), affichés en petits points colorés
massés sur le pont pendant qu'il glisse puis tant qu'ils n'ont pas
débarqué (`drawBoatPassengers`, plafonné à 10 points affichés + "+N").
`spawnEnemy` consomme en priorité les passagers du bateau choisi
plutôt que de retirer un type au hasard — l'ennemi qui débarque est
exactement celui qu'on voyait sur le pont. Renommage : l'appel initial
`spawnBoat` devient `startWaveBoats` (spawnBoat + assignBoatPassengers),
utilisé aux 3 points d'entrée (vague 1 au chargement, chaque nouvelle
vague, resetGame) — l'appel du tout premier bateau a dû être déplacé
plus bas dans le script (après `pickEnemyType`/`pickPreferredX`, qui
n'existent pas encore tout en haut du fichier au chargement).

**Collision souple entre ennemis débarqués.** `resolveEnemyCollisions()`,
appelée une fois par frame après le nettoyage des morts : pousse
doucement les paires trop proches (moins de `ENEMY_MIN_DIST` avec 40%
de chevauchement toléré avant correction), correction partielle
(25%/frame, pas instantanée) pour rester souple et pas une paroi
rigide — demandé explicitement. Les ennemis en fuite (`fleeing`) sont
exclus (laissés traverser). Plafonnée à 150 ennemis simultanés
(O(n²) — au-delà, très rare, le chevauchement redevient juste visuel
comme avant cette version, sans coût de calcul).

Vérifié avec Playwright : type de base confirmé 1 coup à la vague 50,
type qui monte confirmé (306 PV à la vague 50), passagers du bateau
correctement assignés et consommés (0 restant après écoulement complet
de la vague), forme de `columnStats` correcte (`clusterRisk` présent),
collision qui pousse bien deux ennemis superposés, cheval de Troie
déclenché après immersion prolongée, entité bien dans `enemies`,
destruction confirmée : 3 ennemis (`fast_tough`) ajoutés, AUCUN allié
(`soldiers.length` inchangé), référence nettoyée après. Suite de
régression complète (construction/renfort, tir manuel/auto, cadence,
forge, marchands, atmosphère, panneau de version, progression infinie,
distribution des types, musique/mute) toujours verte, aucune erreur JS.
Densité d'ennemis en fin de partie revérifiée (vagues 50-500) : pas
d'explosion malgré le nouveau décalage de la ruée.

## v17.25 : marchands plus lents + amortis, fréquence des caravanes, tours 2x plus chères, zone hors construction

**Marchands.** Vitesse divisée par 3 (`MERCHANT_SPEED_IDX` 0,03 → 0,01)
— précision de l'utilisateur : les marchands seulement, pas les soldats
qu'ils peuvent devenir (déjà le cas avant cette version : `updateSoldiers`
a son propre système de déplacement, complètement indépendant du
`pathIdx` des marchands — rien à changer de ce côté). Mouvement amorti
(demandé) : une vitesse réelle (`m.speed`) qui se rapproche
progressivement d'une vitesse cible plutôt qu'un saut direct — la cible
elle-même se réduit à l'approche du point d'arrêt (château ou demi-tour
du retour), donnant un ralentissement naturel en plus du démarrage
progressif. Comme la logique recalcule "combien reste-t-il avant le
prochain arrêt" à chaque frame selon le sens de marche courant, un
changement de direction (blessé → repart, guéri → retente) redémarre
naturellement en douceur sans code séparé.

**Fréquence des caravanes.** Peut se déclencher dès la vague 1 (avant
cette version : impossible, la condition exigeait 1 vague ENTIÈRE de
chemin propre AVANT la première tentative — bloquait tout jusqu'à la
vague 2 minimum, ce que l'utilisateur ne voulait pas). Remplacé par une
condition plus simple : chemin pas encore sali CETTE vague
(`pathDisturbedThisWave`). En échange, un garde-fou de fréquence
explicite ajouté (demandé) : jamais deux caravanes à moins de
`CARAVAN_MIN_WAVE_GAP` (2) vagues d'écart — au moins une vague complète
de pause entre deux.

**Tours deux fois plus chères.** `TOWER_BUILD_COST` et `TOWER_UPGRADE_COST`
doublés ensemble (10 → 20 chacun) plutôt que juste la construction :
un commentaire du code documentait déjà que l'égalité des deux prix de
départ est voulue (garantie "renfort ≥ neuf" de v17.13) — les doubler
par le même facteur préserve exactement ce ratio, vérifié par calcul.

**Zone hors construction (eau + sable).** Nouvelle bande de sable
jaune, purement visuelle, entre l'eau et la moitié de l'écran
(`noBuildY()`, fonction plutôt que constante — recalculée à chaque
redimensionnement). Construire une tour y est désormais bloqué, ainsi
que dans l'eau elle-même — qui, jusqu'à cette version, n'avait EN FAIT
aucune restriction de construction (le joueur peut physiquement s'y
tenir, `MARGIN` le permet). `tryBuild()` refuse silencieusement
(comme le cas déjà existant "aucune case libre à proximité") si la
case choisie tombe dans cette zone.

Vérifié avec Playwright : coûts de tour doublés confirmés, construction
refusée dans l'eau ET dans le sable (or non dépensé), autorisée en
dessous de la ligne, vitesse des marchands confirmée réduite avec
montée en vitesse progressive (jamais un saut direct à la cible),
caravane déclenchable dès la vague 1, blocage confirmé à 1 vague
d'écart, autorisation confirmée à 2 vagues d'écart. Bug trouvé dans un
script de test (pas dans le jeu) : un marchand construit à la main sans
le nouveau champ `speed` faisait planter `posOnPath` (NaN) — corrigé
dans le script. Suite de régression complète toujours verte, aucune
erreur JS.

## v17.26 : bug des marchands au point d'apparition corrigé, ennemis +20% plus rapides, attente de groupe

**Bug corrigé (signalé par l'utilisateur) : caravane qui se déclenche
sans que le joueur ait marché sur le chemin.** Cause réelle : le
chemin décoratif démarre pile au point d'apparition du joueur (calculé
depuis `REGEN_ZONE.y`, à quelques pixels de là où `resetGame` place le
joueur) — rester complètement immobile après le début d'une partie
comptait déjà comme "sur le chemin" (distance ~10px, largement sous
`PATH_TOUCH_RADIUS`), et déclenchait une caravane après 5s sans que le
joueur ait rien fait. Confirmé par test direct : à l'apparition,
`nearestPathIndex` renvoie l'indice 1 (sur 17) à 10px. Corrigé en
exigeant en plus d'être au moins à `MERCHANT_MIN_PATH_IDX` (3) crans du
départ du chemin, pas seulement "à moins de 26px du premier point".

**Vitesse des ennemis +20%.** `ENEMY_BASE_SPEED` : 0,55 → 0,66 px/frame.
S'applique à tous les types (proportionnel via `speedMult`) et au
cheval de Troie (qui réutilise la même constante).

**Attente de groupe près de l'eau.** Idée de l'utilisateur : certains
ennemis peuvent "décider" d'attendre en groupe avant d'attaquer
ensemble, plutôt que d'avancer en ordre dispersé. Implémenté en
détournant le `waitFrames` déjà existant (hésitation avant de
s'avancer) : 15% des ennemis (`groupWait`) tirent une attente bien plus
longue (jusqu'à `GROUP_WAIT_MAX_FRAMES`, ~6,7s) au lieu de la courte
hésitation habituelle. Chaque frame passée à attendre, un ennemi en
`groupWait` compte ses voisins en `groupWait` également en attente dans
un rayon (`GROUP_WAIT_RADIUS`) — dès que `GROUP_WAIT_MIN_COUNT` (3, lui
compris) sont réunis, TOUS ceux du rassemblement sont relâchés
d'un coup et reprennent leur rôle normal en même temps (une ruée
commune). Filet de sécurité : si le groupe ne se forme jamais, l'attente
s'épuise normalement et l'ennemi part seul — jamais de blocage de
vague. Coût de calcul contenu naturellement : seuls les ennemis en
attente de groupe scrutent leurs voisins (pas tous les ennemis), et
l'attente a un plafond dans le temps.

**Constat mesuré, pas retouché** : avec le coût des tours doublé
(v17.25) ET les ennemis 20% plus rapides (v17.26) cumulés, le
simulateur montre que la stratégie "tour" ne dépasse presque plus la
stratégie solo (vagues 3-4 dans les deux cas, contre un net avantage
avant ces deux changements). Ce sont deux demandes explicites et
précises de l'utilisateur, pas retouchées de mon propre chef — mesure
remontée pour information, à trancher si besoin.

Vérifié avec Playwright : vitesse confirmée (0,66), caravane qui NE se
déclenche PLUS en restant immobile à l'apparition (testé sur 400
frames), caravane qui se déclenche toujours normalement plus loin sur
le chemin, groupe de 3 ennemis en attente relâché ensemble à la même
frame confirmé, ennemi seul en attente qui continue de décompter
normalement (pas de relâchement prématuré). Suite de régression
complète toujours verte, aucune erreur JS.

## v17.27 : 2e compétence de la Forge — les soldats peuvent réparer les tours

Demandé : ajouter en Forge une option achetable pour permettre aux
soldats de réparer les tours. Nouveau bouton dans le bandeau
("Réparateurs", 🔧), même contrainte que "Tours d'élite" (utilisable
seulement physiquement dans la zone de la Forge, et seulement une fois
la Forge construite) — mais achat UNIQUE (60 or), pas une progression
infinie comme "Tours d'élite" : soit acquis, soit pas.

Une fois achetée, `soldiersCanRepair` débloque un 5e comportement pour
les soldats (en plus de fight/guard/hide/heal) : `'repair'`, choisi par
le même tirage pondéré que les autres, mais SEULEMENT proposé si au
moins une tour est endommagée (sinon jamais tiré, pas de comportement
"repair" qui ne fait rien). Le soldat va vers la tour la plus abîmée
(pas la plus proche — recalculé chaque frame, peut changer de cible si
une autre devient plus urgente entre-temps) et la répare gratuitement
tant qu'il reste à portée de contact — gratuit contrairement à la
réparation du joueur (qui coûte de l'or), cohérent avec le fait que les
soldats sont des unités autonomes, pas une action du joueur.

Vérifié avec Playwright : bouton correctement bloqué hors zone / avant
construction de la Forge, achat qui déduit l'or et bascule
`soldiersCanRepair`, libellé "Acquis ✓" après achat (bouton
définitivement désactivé, pas de rachat possible), `pickSoldierBehavior`
qui ne renvoie jamais 'repair' sans l'achat (500 tirages), qui peut le
renvoyer une fois acheté ET une tour endommagée présente, comportement
`updateSoldiers` qui se dirige vers la tour la PLUS abîmée (pas la plus
proche, testé avec deux tours à PV différents) et la répare sans
toucher à l'autre. Capture d'écran du bandeau (3 boutons sur la 2e
ligne, mise en page correcte). Suite de régression complète toujours
verte, aucune erreur JS.

## v17.28 : Mode Phosphore (style validé sur Bastion Orbit, adapté ici)

**Contexte, important pour comprendre le choix technique** : demandé
initialement comme "copier le style de Bastion Orbit et l'appliquer à
Forge Line". Deux mauvaises pistes essayées côté Bastion Orbit avant de
trouver la bonne (voir son propre historique) : une scène reconstruite
dans un cadre de moniteur inventé, puis un filtre CSS posé sur le rendu
habituel (restait "semi-réaliste" juste repeint en vert). La bonne
approche, reprise ici à l'identique : les fonctions de dessin
elles-mêmes changent de comportement selon `phosphorMode` — mêmes
coordonnées, même état de jeu réel, mais des CONTOURS verts sans
dégradé/remplissage, comme un vrai écran vectoriel n'aurait jamais eu
d'éclairage par face. Pas un filtre, pas une reconstruction.

**Ce qui bascule** : `drawIsoBox` (donc tours, bateau, joueur — tout ce
qui passe par cette fonction partagée), `drawCastle` (mur + créneaux),
`drawForge` (contour + petit repère en trait plutôt que l'émoji ⚒️,
qui casse le monochrome), `drawPath` (ligne fine au lieu de la bande
épaisse), le fond eau/sable (lignes de démarcation au lieu de zones
colorées, fond noir déjà posé par le canvas), les cercles
ennemis/marchands/soldats/projectiles (contour vert au lieu du
dégradé). Le HUD complet (topbar/bottombar/bonusbar/menu/panneaux)
bascule aussi en vert sur noir, police Share Tech Mono, via une classe
`body.phosphor`. Scanlines CRT en overlay (`#scanlines`, CSS
`repeating-linear-gradient` + `mix-blend-mode:multiply`).

**Nouvelle forme de tour** (dessin de référence fourni par
l'utilisateur, recodée en canvas — tranché en quiz : recréer en trait
plutôt qu'utiliser les images exportées telles quelles, pour rester
dynamique avec le niveau/la taille d'écran) : une fente verticale
(meurtrière) et une porte en arc sur le corps existant, plus un petit
cube au sommet dont la taille grossit avec le niveau de la tour —
confirmé en quiz : c'est un indicateur visuel de renfort, pas un simple
chapeau décoratif.

Activé par défaut (`phosphorMode = true`), persistant en localStorage
(`fl_phosphor`), toggle dans le menu.

**Pas encore fait, sujet encore ouvert** : les formes géométriques
spécifiques par élément (forge détaillée, mur du château en zigzag,
bateau, caravane des marchands, cheval de Troie, ennemis avec une
complexité croissante selon la difficulté) ont été fournies en dessins
de référence mais pas encore toutes adaptées — seule la tour a été
traitée pour l'instant (comme demandé explicitement, une chose à la
fois). Les ennemis/marchands/soldats/projectiles utilisent pour
l'instant un simple cercle en contour vert, pas les formes
géométriques spécifiques dessinées.

Vérifié avec Playwright : toggle testé dans les deux sens (phosphore
actif/inactif), capture d'écran des deux modes, suite de régression
complète toujours verte, aucune erreur JS. Pas encore poussé en
production — l'utilisateur doit valider le style avant qu'on décide.

## v17.29 : formes spécifiques par élément (dessins de référence), contact souple avec les tours

**Suite du Mode Phosphore** — les dessins de référence restants
(forge, mur du château, bateau, caravane des marchands, cheval de
Troie, ennemis selon la difficulté) adaptés d'un coup ("fonce tout,
ne t'arrête pas") :

- **Ennemis** : complexité de la forme selon le type
  (`drawEnemyShape`, `ENEMY_COMPLEXITY`) — losange simple pour les
  types faibles (base, rapide/fragile), cube avec croix sur la face du
  dessus pour le type intermédiaire (rapide/costaud), cube avec
  treillis dense sur les 3 faces pour les plus forts (boss). Mapping
  raisonnable sur les 4 dessins fournis, pas de correspondance 1:1
  précisée par l'utilisateur.
- **Cheval de Troie** : silhouette dédiée (`drawTrojanHorseShape`,
  quelques segments droits anguleux — tête, encolure, dos, 3 pattes),
  plutôt que le cube générique des autres ennemis — assez important
  comme entité nommée pour mériter sa propre forme.
- **Mur du château** : chaque créneau devient une dent pointue ("^")
  au lieu d'un rectangle plat — mis côte à côte, ça lit comme le
  zigzag du dessin. Toujours 10 créneaux individuellement
  destructibles (mécanique inchangée).
- **Forge** : petite ziggourat à 3 étages avec une flèche/cheminée au
  sommet, à la place du glyphe marteau, à l'échelle de `FORGE_ZONE`.
- **Bateau** : lignes de planches diagonales sur la face du dessus de
  la coque (5 lignes parallèles entre les bords du losange), en plus
  du mât/voile déjà en trait.
- **Marchands** : simplifiés en petit chariot (boîte + 2 roues) plutôt
  que la silhouette complète chariot+cheval du dessin — pas lisible en
  aussi petit et répété pour chaque marchand d'une caravane (jusqu'à
  8).

**Contact souple avec les tours** (question posée par l'utilisateur :
"et les contacts souples entre ennemis et objets ?") — le contact
joueur/ennemi ↔ tour (`resolveTowerCollision`) était resté une paroi
RIGIDE (téléportation instantanée sur le bord au premier contact),
contrairement à la collision ennemi-ennemi (v17.24, déjà souple).
Corrigé avec le même principe : un peu de chevauchement toléré
(`OBJECT_OVERLAP_ALLOWED`), correction partielle par frame
(`OBJECT_COLLISION_PUSH`, plus rapide que l'ennemi-ennemi pour rester
réactif face à un vrai obstacle solide).

Vérifié avec Playwright : scène combinée (2 tours à niveaux
différents, 3 types d'ennemis, marchand, cheval de Troie) capturée en
écran, chaque forme confirmée visuellement distincte et correcte,
aucune erreur JS. Bateau vérifié séparément (planches + mât/voile).
Suite de régression complète toujours verte. Pas encore poussé en
production.

## v17.30 : audit qualité (sans code), puis correctifs demandés

Audit à froid demandé par l'utilisateur ("lance un AUDIT uniquement —
ne code rien") : lecture du fichier entier (3045 lignes / 170 877
octets), recherche de TODO/FIXME/console.*, recensement des boucles
`for (const ... of enemies/towers)` pour repérer des motifs O(n²), et
vérification des tableaux dynamiques (`enemies`, `particles`,
`floatingTexts`, `deathEffects`, `projectiles`) — tous correctement
filtrés/vidés, pas de fuite mémoire. Aucun bug fonctionnel trouvé.
Rapport livré, feu vert reçu ("Vas-y alors") pour les deux correctifs
identifiés comme valables :

- **`preload="auto"` → `preload="none"`** sur `<audio id="bg-music">` :
  le fichier `assets/ambience.ogg` fait 6,77 Mo et était mis en
  tampon en entier dès l'ouverture de la page, avant tout geste de
  l'utilisateur — alors que le jeu attend déjà un geste utilisateur
  (`tryUnlockAudio()`) pour démarrer le son. Gain de chargement
  initial, aucun changement de comportement audio perçu.
- **Garde-fou sur le scan `groupWait`** (ligne ~2281) : la boucle qui
  compte les ennemis en attente groupée autour de chacun n'avait pas
  le même plafond que `resolveEnemyCollisions`
  (`ENEMY_COLLISION_MAX_COUNT = 150`) — ajouté la même condition
  (`enemies.length <= ENEMY_COLLISION_MAX_COUNT`), avec repli sur le
  comportement d'attente individuelle existant si jamais dépassé (le
  filet de sécurité `GROUP_WAIT_MAX_FRAMES` reste actif). Aucun impact
  en jeu normal (le nombre d'ennemis simultanés n'approche jamais ce
  plafond) — purement préventif.

Refactoring structurel (fichier monolithique, duplication des
branches `phosphorMode`) jugé **pas nécessaire pour l'instant** dans
le rapport — pas touché.

Vérifié : `node --check` sur le script extrait, suite de tests
Playwright rejouée en HTTP (test-big, test-enemyprog jusqu'à la vague
230, test-boat-wave, test-forge, test-merchants, test-v1727) —
zéro erreur JS à chaque fois.

## v17.31 : corrections signalées en direct par Pierre (mode Phosphore + collision + joueur)

Grosse consigne dictée reçue via routine planifiée ("Forge Line —
corrections + uniformisation + difficulté"), Partie 1 (prioritaire).
Pendant que ce travail démarrait, Pierre a testé le jeu en direct et
signalé deux bugs visuels concrets dans le mode Phosphore déjà en
production (v17.28-30) :

- **"Les écritures doivent être vertes... là on a des noirs sur noir"**
  — `#over-card h2`/`p` (écran "Tu as perdu") et `#ad-error-card p`
  avaient leur propre `color:#3a3529` (beige foncé) jamais repris par
  la règle CSS groupée du mode Phosphore (qui ne fixe que le
  conteneur, pas ces enfants) — texte quasi invisible sur fond noir.
  Corrigé (règle CSS dédiée, `color:#3dff7a`).
- **"La croix de mort ennemis et tout doit être vert"** — audit complet
  de tous les `ctx.fillStyle`/`strokeStyle` non protégés par
  `phosphorMode` : trouvés et corrigés — la fumée+croix de mort d'un
  ennemi (`drawDeathEffect`), les points de passagers sur le bateau et
  le texte "+N" en surplus, les particules d'ambiance, la croix du
  cimetière des tours + la bulle de prière, le halo doré de
  surbrillance d'une tour, et les textes flottants (or gagné, dégâts)
  qui gardaient leur couleur d'origine au lieu du vert. Plus aucun
  élément ne devrait échapper au style en mode Phosphore.

Profité du même passage pour avancer sur la Partie 1 du plan (B et C,
qui ne nécessitent pas les dessins de référence — voir plus bas pour
pourquoi A attend) :

- **B. Collision vraiment souple entre ennemis** (signalé "n'importe
  quoi, tout le monde se superpose") — bug réel trouvé : la distance
  de collision était une constante fixe (16px) bien plus petite que le
  rayon visuel réel de plusieurs types (le cheval de Troie fait 18px à
  lui seul), ET la tolérance de chevauchement était énorme (40%), ET
  une seule passe de correction par frame ne suffisait pas sous
  pression continue. Résultat : chevauchement massif visible en
  permanence. Corrigé : nouvelle fonction `enemyRadius(e)` (même valeur
  que le dessin, donc cohérente), tolérance resserrée à 12% (léger
  effet "caoutchouc" volontaire, jamais une vraie superposition),
  poussée plus franche, deux passes de relaxation par frame. Vérifié
  par script : distance minimale entre ennemis après résolution toujours
  au-dessus du seuil attendu, plus aucune paire en dessous.
- **C. Joueur en faces opaques** (signalé "en fil de fer, on voit tout
  à travers comme un fantôme") — `drawIsoBox` a maintenant un paramètre
  `opaque` : remplit chaque face en noir plein avant de tracer le
  contour vert, au lieu de laisser voir au travers. Utilisé UNIQUEMENT
  pour le joueur (les tours/forge/bateau restent en fil de fer pur,
  c'est le style validé pour eux — Pierre n'a demandé le remplissage
  que pour le personnage joueur).

**A (dessins de référence) reste en attente** : le contexte de cette
session a été résumé/compacté depuis leur envoi — les images
elles-mêmes ne sont plus accessibles ici. Il faudra que Pierre les
renvoie pour redessiner forge/mur/bateau/caravane/cheval de Troie à
la lettre, comme demandé. Note pour la suite : E (agencement —
forge dans l'enceinte) et D (débarquement condensé + course rapide)
restent aussi à faire, pas encore commencés au moment de ce commit.

Vérifié : `node --check`, suite de tests Playwright rejouée en HTTP
(test-big, capture d'écran de l'écran de fin de partie confirmant le
texte vert, capture de scène avec ennemis + croix de mort confirmant
tout en vert et sans chevauchement) — zéro erreur JS.

## v17.32 : A — redessin à la lettre depuis les dessins de référence retrouvés

Les 7 dessins (tour, forge, mur, bateau, caravane, cheval de Troie,
complexité des ennemis) ont été retrouvés dans les données brutes de la
session (voir plus haut) et enregistrés dans `references/`. Chacun
relu attentivement en image avant de coder, pour redessiner à la lettre
comme demandé — pas d'improvisation. Ce qui a changé par rapport à la
première interprétation (approximative, faite sans revoir les images) :

- **Tour** : la porte n'est plus un arc + fente — c'est un triangle
  ouvert adossé à l'arête avant-droite du corps, comme sur le croquis.
  Le petit cube de renfort au sommet est conservé (confirmé "indicateur
  de niveau" par Pierre plus tôt).
- **Forge** : abandon complet de la ziggourat (trop éloignée du dessin,
  cause du "aplatie et méconnaissable"). Nouvelle structure : corps avec
  bandeau horizontal, toit en pavillon (4 pans qui convergent vers une
  cheminée), un poteau plus court sur le côté, un rebord qui dépasse —
  les 4 éléments visibles sur le croquis. Réutilise `drawIsoBox` pour
  rester cohérent avec le style du reste du décor.
- **Mur du château** : chaque créneau devient un vrai "pli" (ligne
  verticale du sommet jusqu'à la base, pas juste un triangle plat) pour
  la lecture "ruban plissé en 3D" du dessin — et le créneau au niveau où
  le chemin des marchands rejoint le mur est surélevé, comme le pic
  isolé au centre du croquis (lu comme une porte).
- **Bateau** : la voile triangulaire pleine est remplacée par un mât +
  petit fanion en losange, et des ornements (trait + losange) partent
  des pointes avant/arrière de la coque, fidèles au dessin — qui montre
  clairement ce motif "trait puis losange" répété à 3 endroits.
- **Marchands/caravane** : changement de fond, pas juste de forme —
  Pierre a précisé "ce sont des personnages, et DERRIÈRE eux un cheval
  tire un chariot, le chariot vient avec eux". Chaque marchand est
  maintenant une petite silhouette humaine (tête + corps + jambes) ; le
  chariot + cheval attelé (nouvelle fonction `drawCaravanCart`) n'est
  dessiné qu'UNE FOIS pour toute la caravane, positionné derrière le
  marchand le plus en arrière via `posOnPath`.
- **Cheval de Troie** : le corps devient un vrai pavé isométrique
  (torse en 3 faces, cohérent avec le style du reste) au lieu d'un
  contour plat ; tête/encolure anguleuse avec une petite crinière ;
  les 4 pattes ont désormais un coude (2 segments), comme le dessin.
- **Ennemis (complexité)** : le dessin montre 4 cubes distincts, pas 3
  — remappé en 4 paliers avec correspondance 1:1 sur les 4 types
  (base/fast_frail/fast_tough/boss) : cube nu, cube + croix sur la face
  du dessus, cube + croix sur les 3 faces ("fil de fer"), cube +
  treillis dense. Le cheval de Troie garde sa silhouette dédiée.

Vérifié : `node --check`, suite de régression complète rejouée en HTTP
(test-big, test-enemyprog jusqu'à la vague 230, test-boat-wave,
test-forge, test-merchants, test-v1727) — zéro erreur JS. Captures
d'écran de chaque forme (scène combinée, zoom tour/forge/mur/bateau)
comparées visuellement aux dessins d'origine avant de valider.

## v17.33 : E — agencement (forge dans l'enceinte) + D — débarquement condensé

**E.** La forge était positionnée AU-DESSUS du mur (entre le mur et le
champ de construction) — Pierre : "la forge doit être DANS l'enceinte
du château, aujourd'hui elle est au-dessus du mur". Repositionnée :
`FORGE_ZONE` occupe maintenant la bande la plus basse de l'écran
(collée au bord), et `REGEN_ZONE` (le mur) est recalculé juste devant
elle (`FORGE_ZONE.y - REGEN_ZONE.h - 12`). Ordre bas -> haut obtenu :
forge -> mur -> [zone de jeu] -> champ de construction -> plage -> eau,
conforme à la demande.

Bug trouvé en vérifiant : `resetGame()` repositionnait le joueur avec
une valeur fixe (`STAGE_H - 70`) calée sur l'ANCIENNE position du mur —
avec le nouvel agencement, ça faisait réapparaître le joueur DANS la
forge à chaque nouvelle partie au lieu de devant le mur. Corrigé pour se
caler sur `REGEN_ZONE.y - 16` comme le fait déjà `resizeCanvas()` (même
formule utilisée aux deux endroits, donc le joueur atterrit à la même
place cohérente).

**D.** Débarquement : "les ennemis arrivent sur le bateau très
condensés... puis descendent RAPIDEMENT... et là seulement s'organisent
et choisissent leur stratégie". Deux changements :
- Densité des passagers affichés sur le pont resserrée (5,5/4,5px
  d'écart au lieu de 7/6).
- Nouvelle phase `landingUntil` (550ms, `LANDING_DASH_MS`) à l'arrivée
  d'un ennemi : pendant cette fenêtre, il fonce tout droit vers la plage
  à vitesse ×2,4 (`LANDING_SPEED_MULT`), sans tenir compte de son rôle
  ni de l'attente de groupe — la décision de stratégie (attaquant,
  harceleur, attente de groupe...) ne démarre qu'une fois la course
  terminée, exactement l'ordre demandé. Le cheval de Troie et les
  soldats qui sortent de son ventre gardent `landingUntil: 0` (pas de
  course, ils ne débarquent pas d'un bateau).

**Point de vigilance noté pour la Partie 3 (difficulté)** : le test de
régression `test-boat-wave` (30s, aléatoire non figé) a affiché des
brèches assez variables d'un passage à l'autre (2 à 10) après ce
changement — la course d'arrivée donne aux ennemis une petite longueur
d'avance sur la défense en tout début de vague. Pas de quoi bloquer ce
commit (aucun test n'échoue, comportement voulu), mais à repasser au
simulateur de difficulté quand la Partie 3 démarrera, comme prévu par
la consigne ("toute nouvelle fonctionnalité doit relancer le
simulateur").

Vérifié : `node --check`, suite de régression rejouée en HTTP
(test-big, test-enemyprog jusqu'à la vague 230, test-boat-wave,
test-forge, test-merchants, test-v1727) — zéro erreur JS. Capture
d'écran confirmant l'ordre visuel forge/mur/champ/plage/eau et la
position du joueur corrigée (`REGEN_ZONE`/`FORGE_ZONE` lues et
comparées directement).

**Partie 1 terminée** (A, B, C, D, E tous faits). Passage à la Partie 2
(uniformisation) ensuite.

## v17.34 : Partie 2, point 1 — audio (volume musique/bruitages + coupure hors-focus)

Consigne (envoyée identique aux 3 jeux) : "musique ET bruitages
fonctionnels. Curseur(s) de volume accessibles depuis le menu, de 0 à
100%, pour la musique et pour les bruitages."

- Ancien bouton binaire "Couper la musique" retiré, remplacé par deux
  `<input type="range">` dans le menu (Musique / Bruitages), 0-100,
  mémorisés séparément (`fl_musicVolume`, `fl_sfxVolume`).
- Musique : le curseur mappe 0-100% sur 0-`MUSIC_VOLUME_MAX` (0,35,
  volume réel inchangé à fond — juste rendu réglable en dessous). 0%
  met en pause comme avant.
- Bruitages : `playTone`/`playNoiseBurst` (les deux générateurs de sons
  synthétisés, tout est généré, pas de fichier) multiplient leur gain
  par `sfxVolume/100` et ne jouent RIEN à 0% (pas juste inaudible —
  sort tôt, économise même le calcul).
- Au passage : implémenté une demande plus ancienne restée en attente
  ("quand on quitte l'application... tout le son doit se couper") —
  `visibilitychange` met en pause la musique et suspend l'AudioContext
  quand l'onglet passe en arrière-plan, reprend au retour (si le volume
  n'est pas à 0).

Vérifié par script (pas seulement visuel) : les deux sliders existent et
reflètent l'état initial ; les mettre à 0 coupe bien `bgMusic` (pause) et
`sfxShoot()` ne lève pas d'erreur et ne joue rien ; simuler
`document.hidden = true` + l'évènement met bien `bgMusic` en pause.
Suite de régression complète toujours verte.

**Reste Partie 2** : langue (auto-détection fr/en, anglais par défaut
sinon), section "Astuces".

## v17.35 : Partie 2, point 4 — lisibilité des mécaniques (jauges d'attente)

Consigne : "quand on se place à un endroit qui déclenche quelque chose
après une attente..., une petite horloge/jauge circulaire au-dessus du
personnage se remplit... Rien ne se passe en silence."

Une jauge circulaire existait déjà pour UN cas (la "prière" sur une
tombe de tour, `playerPrayingAt`/`GRAVE_PRAY_MS`) — généralisée en une
fonction `drawWaitGauge(px, py, progress)` réutilisable, puis appliquée
aux deux autres attentes sur place du jeu qui n'avaient encore aucun
retour visuel :
- le chemin des marchands (`playerOnPathSince`, `MERCHANT_STAND_MS`) ;
- l'eau du cheval de Troie (`playerInWaterSince`, `TROJAN_TRIGGER_MS`,
  masquée pendant le temps de recharge pour ne pas laisser une jauge
  figée à 100% qui induirait en erreur).

Les nombres flottants pour l'or gagné existaient déjà (pas besoin d'y
retoucher) — seul le "temps d'attente silencieux" manquait.

Vérifié : `node --check`, appel direct de `drawWaitGauge` en Playwright
(RAF figé pour capturer une frame stable) confirmant le rendu — pastille
circulaire remplie à ~70%, contour vert/fond noir en mode Phosphore.
Suite de régression complète toujours verte.

## v17.36 : correctifs de fidélité aux dessins de référence

Pierre, en repassant sur le jeu en direct : "les dessins sont pas bons,
tu dois suivre scrupuleusement et exactement les traits que j'ai
donnée." Demandé si un export SVG des 7 croquis serait possible (pour
des coordonnées exactes plutôt qu'une lecture visuelle du raster) —
répondu explicitement de retravailler sur les images déjà fournies.
Chaque dessin relu en détail, en comptant sur la grille de points
visible, pour identifier les écarts structurels avec ce qui avait été
codé en v17.32 :

- **Tour** : la porte était accrochée à l'arête DROITE (E) du corps,
  avec le battant qui dépassait au-delà — en relisant le croquis, elle
  est accrochée à l'arête AVANT-CENTRE (S, la plus proche du joueur),
  avec le battant qui reste À L'INTÉRIEUR de la largeur du corps. Corrigé.
- **Bateau** : la coque était un simple pavé à 4 coins (comme les
  tours) — le croquis montre une silhouette bien plus allongée, avec la
  proue ET la poupe coupées par un court biseau (pas des pointes
  nettes) plutôt qu'un losange à 4 sommets. Remplacé `drawIsoBox` par
  une nouvelle fonction dédiée `drawBoatHullPhosphor` (hexagone allongé
  biseauté), mât/ornements réancrés dessus.
- **Mur du château** : deux erreurs trouvées. (1) Les créneaux étaient
  des dents ISOLÉES avec des espaces vides entre elles — le croquis
  montre un RUBAN CONTINU, chaque pic touchant la vallée du suivant,
  sans aucun espace. (2) Une seule chute verticale par créneau (au pic)
  — le croquis en a une à CHAQUE sommet, pic ET vallée. (3) La "porte"
  n'était qu'un créneau plus haut au milieu du ruban continu — le
  croquis montre une vraie OUVERTURE (deux pics voisins qui convergent
  vers un sommet commun, sans mur ni chute verticale entre eux, un
  vrai passage). Toute la fonction de dessin des créneaux réécrite.
- **Caravane (chariot)** : dessiné comme un petit pavé plein — le
  croquis montre une caisse OUVERTE (juste le rebord + les chutes
  verticales, ni dessus ni côtés remplis), plus large que profonde, et
  un cheval à la topologie précise (encolure/tête/museau depuis un
  point d'attelage, garrot séparé avec 2 pattes arrière, 1 patte avant
  depuis le point d'attelage). Fonction `drawCaravanCart` réécrite pour
  suivre cette topologie exacte.
- **Cheval de Troie** : la crinière était positionnée près de
  l'encolure — en relisant le croquis, le petit bouquet de traits est
  du côté ARRIÈRE (dos/croupe), pas contre la tête. Repositionnée.
- **Ennemis (complexité)** : revérifié les 4 paliers face aux 5 cubes du
  croquis (2 des 5 sont le même palier "simple", juste dessiné à 2
  échelles) — le mapping 4 paliers déjà en place (v17.32) s'est confirmé
  correct, pas de changement nécessaire ici.
- **Forge** : revérifiée aussi, structure déjà fidèle (cheminée, toit en
  pavillon, corps à bandeau, poteau, rebord) — juste le rebord légèrement
  rabaissé pour mieux coller à sa hauteur sur le croquis.

**Limite assumée, dite explicitement à Pierre** : sans export vectoriel
(refusé — travail demandé directement sur les JPG/PNG), la lecture
reste une estimation visuelle sur la grille de points, pas une
extraction exacte au pixel près. Le travail ci-dessus corrige les
écarts structurels identifiés avec confiance (topologie, proportions
générales, position des éléments) — pas une garantie de coïncidence
pixel-parfaite avec le tracé d'origine.

Vérifié : `node --check`, captures Playwright de chaque forme corrigée
comparées aux dessins d'origine, suite de régression complète toujours
verte.
