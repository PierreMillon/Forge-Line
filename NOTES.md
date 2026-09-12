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

- ~~**Plusieurs cartes** pour la suite (variété au-delà de la plage
  actuelle)~~ → **tranché par Pierre (2026-09-08)** : une 2ᵉ carte thème
  FORÊT — un fleuve à la place de la mer, débarquement par radeaux au
  lieu du bateau, décor forestier. À faire APRÈS les corrections,
  l'uniformisation et le réglage de difficulté (dernier chantier de la
  liste) ; la difficulté devra être re-vérifiée au simulateur sur cette
  carte aussi une fois construite. Pas encore commencé au moment de
  cette note.

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
donne un bien meilleur résultat visuel qu'un tracé SVG à la main).

**Abandonné par Pierre (2026-09-08)** : on reste en vectoriel/procédural,
ce pipeline 3D→isométrique ne sera pas exploré.

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

## v17.38 : Partie 2, point 3 — section "Astuces"

Consigne : "explique de manière très claire, SANS mystère, TOUTES les
mécaniques du jeu, avec des exemples chiffrés (forces, gains, seuils,
timings)." Nom retenu par Pierre, commun aux 3 jeux : "Astuces".

L'ancien panneau "Aide / FAQ" (3 paragraphes sur les pubs/la
progression) est conservé tel quel en bas du panneau, sous un nouveau
contenu qui couvre chaque mécanique avec de vrais chiffres tirés des
constantes du jeu : combat (dégâts de base, précision par distance),
tours (coûts, portée), Forge (élite, réparateurs), revenu automatique,
vagues/types d'ennemis (taux d'apparition, vagues de déblocage),
marchands (durée d'attente, récompense), cheval de Troie (délais,
risque réel à la destruction), effet domino (rayon, dégâts), château
(10 créneaux, régénération). Bouton renommé "Aide / FAQ" -> "Astuces"
dans le menu.

**Règle de maintenance (demandée explicitement)** : tout commit qui
modifie une constante ou une mécanique de gameplay met à jour la
section correspondante dans le panneau Astuces (`#faq-panel` dans
`index.html`) DANS LE MÊME COMMIT — pas de mécanique qui se désynchronise
du texte qui l'explique. Si une future mécanique n'a pas encore de
section, en ajouter une plutôt que de la laisser non documentée.

Vérifié : `node --check`, suite de régression toujours verte.

## v17.39 : Partie 2, point 2 — langue (auto-détection fr/en)

Consigne, réponse tranchée par Pierre : "auto-détection de la langue
de l'appareil (fr/en…), anglais dans tous les autres cas — pas
d'anglais fixe."

- `detectLang()` lit `navigator.language` : `fr` si ça commence par
  "fr", sinon `en` (n'importe quelle autre langue -> anglais, comme
  demandé). Mémorisé dans `localStorage` (`fl_lang`) dès que
  l'utilisateur bascule manuellement via le nouveau lien "Langue :
  Français / Language: English" dans le menu.
- Dictionnaire `I18N = { fr: {...}, en: {...} }` (~45 clés) + fonction
  `t(clé)`. Les éléments HTML statiques portent un attribut
  `data-i18n="clé"` (menu, écran de fin de partie, erreur pub, section
  Astuces en entier) ; `applyLanguage()` les met à jour via
  `innerHTML` (autorise le `<strong>` dans les paragraphes Pubs). Les
  libellés dynamiques (boutons du bandeau de bonus, titres d'écran de
  fin de partie selon la cause, avertissement du cheval de Troie)
  passent tous par `t()` au lieu d'être écrits en dur.
- **Scope assumé** : le CHANGELOG (panneau version) reste en français —
  c'est un journal de développement, pas une mécanique de jeu vue au
  quotidien par un joueur anglophone. Décision de scope, pas un oubli.

Vérifié par script (Playwright, deux contextes avec `locale: 'en-US'`
et `locale: 'fr-FR'`) : le jeu s'ouvre bien en anglais par défaut sur
un appareil anglophone et en français sur un appareil francophone ;
bascule manuelle confirmée (mémorisée dans localStorage) ; libellés
dynamiques du bandeau de bonus et titre d'écran de fin de partie
confirmés traduits après bascule ; contenu complet de la section
Astuces confirmé traduit. Suite de régression complète toujours verte
(le test `test-forge` tourne d'ailleurs en anglais par défaut dans cet
environnement, confirmant au passage le bon comportement par défaut).

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

## v17.37 : extraction pixel-exacte des dessins (analyse d'image, plus fiable que l'œil)

Pierre, après avoir vu la comparaison en direct : "Trouve un moyen de
recopier de manière exacte." — plutôt que de continuer à estimer les
coordonnées à l'œil sur les images, installé Pillow/NumPy/SciPy et
écrit un script d'analyse d'image qui :
1. Détecte les petits points blancs marqués sur chaque dessin (les vrais
   sommets du tracé, visibles comme des points plus denses que les
   traits) par filtrage de densité locale + labellisation de composantes
   connexes — coordonnées pixel exactes, pas une estimation.
2. Détecte automatiquement les ARÊTES entre ces sommets : pour chaque
   paire de points, échantillonne le segment qui les relierait et
   vérifie que des pixels clairs sont bien présents tout du long — si
   oui, l'arête existe réellement sur le dessin.
3. Génère une image de vérification (le dessin original + les arêtes
   détectées superposées en rouge) pour confirmer visuellement, avant
   de coder quoi que ce soit, que l'extraction correspond bien au trait
   d'origine — Pierre a lui-même repéré que certains traits blancs
   n'étaient pas repassés en rouge sur un premier essai ("plus rigoureux
   il faut"), ce qui a permis d'affiner les seuils jusqu'à recouvrement
   quasi complet.

**Tour et mur du château : recouvrement à ~100 %** (tous les traits du
dessin confirmés retrouvés par l'algorithme, vérifié visuellement) —
converti en proportions exactes (fractions de TOWER_HW / de la hauteur)
et appliqué au code :
- Porte de la tour : forme à 4 points exacte (un repli sur le bord
  gauche avant de rejoindre le bord droit près du sommet), pas un
  simple triangle.
- Cube de renfort : son pic touche le coin N (virtuel) du corps
  principal à moins de 2px près sur le dessin — ancré exactement là.
- Créneaux du mur : la vallée fait 0,82× la hauteur d'un pic (pas 0,4×
  comme estimé à l'œil avant) — un zigzag bien plus doux que ce qui
  avait été codé. Le sommet de la porte culmine à 1,585× (pas 2,4×).

**Bateau, chariot de caravane, cheval de Troie** : tous les sommets
retrouvés avec précision, mais la détection automatique des arêtes
reste incomplète sur ces dessins (traits visiblement moins rectilignes
— dessinés à main levée plutôt qu'avec l'outil formes/lignes de
l'appli) — recouvrement partiel malgré plusieurs passes de réglage des
seuils. La structure déjà codée en v17.36 reste donc la meilleure
approximation disponible pour ces trois ; pas encore reconverti en
proportions pixel-exactes comme la tour et le mur. Prochaine étape si
Pierre veut pousser plus loin : affiner la détection d'arêtes pour ces
tracés à main levée (tolérance à la courbure plutôt qu'au segment
droit), ou lire les sommets un par un directement depuis l'image de
vérification (déjà quasi complète pour le cheval de Troie : 22
sommets tous localisés).

Vérifié : `node --check`, captures Playwright de la tour et du mur
après application, suite de régression complète toujours verte.

## Partie 3 : difficulté — a) modèle retenu (recherche web)

Consigne : "courte recherche web sur les analyses publiées de courbes
de difficulté... note le modèle retenu (dents de scie tension/
relâchement, pics puis répit, montée globale)."

Recherché : la thèse de Jenova Chen sur le *flow* (Csikszentmihalyi),
un article sur le motif "sawtooth" en pacing de difficulté, la
philosophie d'ascension de Slay the Spire, et la conception de Plants
vs Zombies (George Fan, GDC). Synthèse, modèle retenu pour Forge Line :

1. **Canal de flow (Chen/Csikszentmihalyi)** : l'expérience reste bonne
   tant que le défi suit la compétence du joueur qui grimpe — trop de
   défi pour la compétence = anxiété (frustration, "je me sens visé"),
   trop peu = ennui. Le principe directeur : ne jamais laisser le
   défi s'écarter durablement de la compétence qui progresse (upgrades
   achetés, habitude du joueur) — dans un sens ou dans l'autre.
2. **Dents de scie (sawtooth), pas une pente lisse** : dans une
   tendance globale montante, alterner petits pics de tension et
   moments de relâchement plutôt qu'une difficulté strictement
   croissante — ça évite l'anxiété continue ET l'ennui d'un plateau
   trop long. Concrètement pour Forge Line : une vague clairement plus
   dure de temps en temps (le boss à partir de la vague 200 en est déjà
   un exemple), suivie de vagues plus respirables juste après, pas une
   remontée en ligne droite vague après vague.
3. **Répit avant la pression (Plants vs Zombies)** : laisser le temps
   de s'installer avant que ça devienne sérieux — Forge Line applique
   déjà ce principe (vague 1 très légère, première tour "obligatoire"
   vers la vague 3, pas dès la vague 1).
4. **Leçon d'Ascension (Slay the Spire)** : le défaut à éviter par-dessus
   tout en réglant les constantes — un seul palier qui saute plus que
   la somme de tous les paliers précédents (la communauté cite le saut
   ascension 8→9, plus gros que 0→8 cumulé, comme LE contre-exemple).
   Règle appliquée ici : quand une constante change avec la vague, la
   variation d'un palier au suivant doit rester proportionnelle au
   reste de la courbe — jamais un pic isolé disproportionné.
5. **Repère Kingdom Rush / Bloons TD** : Kingdom Rush met la pression
   vite sur des cartes compactes (poursuivi ici via EARLY_RUSH_WAVES) ;
   Bloons TD montre l'écueil inverse — un rythme maîtrisé au début qui
   expose une mise à l'échelle trop faible en fin de partie. À vérifier
   au simulateur sur les vagues tardives (100 premières vagues, comme
   prévu par la consigne), pas seulement les premières.

**Traduction concrète pour Forge Line** (à vérifier/ajuster au
simulateur, étape b/c) : garder la montée globale déjà en place
(nombre d'ennemis, types plus forts progressifs), ajouter des paliers
de répit après les pics existants (vagues juste après un boss, par
exemple), et vérifier qu'aucune transition de constante ne crée un
saut disproportionné façon "ascension 9".

Sources : [Jenova Chen — Flow in Games (thèse)](https://www.jenovachen.com/flowingames/Flow_in_games_final.pdf), [GameDeveloper.com — Difficulty Curves](https://www.gamedeveloper.com/design/difficulty-curves), [Frostilyte — More games should handle difficulty like Slay the Spire](https://frostilyte.ca/2020/04/16/more-games-should-handle-difficulty-like-slay-the-spire/), [GameDeveloper.com — GDC 2012, 10 tutorial tips from George Fan (Plants vs Zombies)](https://www.gamedeveloper.com/design/gdc-2012-10-tutorial-tips-from-i-plants-vs-zombies-i-creator-george-fan), [TowerWard — Kingdom Rush vs Bloons TD 6](https://towerward.com/blog/kingdom-rush-vs-bloons-td-6).

## Partie 3 : difficulté — b) simulateur à 3 profils + c) premier réglage (résultats avant/après)

**b) Simulateur étendu** (`simulate.mjs`) : les anciennes politiques
'solo'/'towers' remplacées par les 3 profils demandés explicitement —
'naive' (tire par à-coups, ne construit jamais de tour, dépense au
hasard), 'correct' (construit une tour puis alterne renfort/dégâts —
reprend l'ancienne logique 'towers'), 'good' (étale jusqu'à 3 tours en
se déplaçant entre 3 points, investit systématiquement dans l'option
la moins chère parmi renfort/dégâts/revenu auto/précision). Mesure
aussi si la partie a atteint un repère de vague donné (100 par défaut,
"vagues infinies : mesure sur les 100 premières" comme demandé).

**c) Premier passage de réglage — résultat AVANT/APRÈS (20 parties par
profil, tir manuel à 250ms/tir, repère humain réaliste pas le plancher
anti-spam)** :

AVANT (constantes d'origine, +11 ennemis/vague pendant la ruée des 8
premières vagues) :
- naive : vague moyenne 3,2 (min 3, max 4)
- correct : vague moyenne 3,65 (min 3, max 4)
- good : vague moyenne 3,55 (min 3, max 5)
- **Constat** : tout le monde meurt vague 3-5, quasi AUCUNE différence
  entre bien jouer et ne rien faire — exactement le "je me sens visé"
  décrit par Pierre. Confirmé par les données, pas juste une impression.

APRÈS deux ajustements successifs, vérifiés au simulateur à chaque
fois :
1. Resserré EARLY_RUSH_STEP (11 -> 3) : vague moyenne remonte à 6,15 /
   6,75 / 6,65 (naive/correct/good) — mieux, mais différenciation par
   stratégie toujours trop faible.
2. Pierre a ensuite dicté directement les 4 premières vagues comme un
   vrai tutoriel : "vague 1 un ennemi, vague 2 deux et demie, vague 3
   trois et demi, vague 4 cinq et demi, après tu fais ce que tu veux."
   Codé en dur (`TUTORIAL_WAVE_COUNTS = [1,3,4,6]`, arrondi
   conventionnel des ".5"), le rythme "ruée" existant reprend à partir
   de la vague 5, raccordé sans à-coup. Résultat : vague moyenne 7,7 /
   8,25 / 8,4 (naive/correct/good).

**Ce qui reste à faire (pas encore résolu, dit clairement)** : même
après ces deux passages, TOUTES les parties finissent encore par
"breach" (10 brèches), jamais par mort du joueur, et la différence
entre les 3 profils reste modeste (7,7 à 8,4 vagues) — les bots
'correct'/'good' ne bougent quasiment pas sur la carte (ils restent
fixes ou se déplacent entre 3 points proches), donc une partie des
ennemis traverse sans doute hors de portée de la tour/du joueur,
peu importe la stratégie d'achat. Ça pointe vers un levier différent
de la seule cadence d'apparition : couverture de la carte par une
tour (portée, positionnement), ou le nombre de brèches tolérées (10),
plutôt que continuer à ajuster uniquement `enemiesForWave`. Pas encore
mesuré ni réglé — nécessite un prochain passage dédié plutôt que
deviner une troisième valeur sans données pour l'appuyer.

**Question ouverte pour Pierre** (les cibles demandent une clarification
avant de pouvoir viser précisément dessus) : les cibles en % de
victoire ("~55-65% normal, ~85% facile...") supposent des paliers de
difficulté sélectionnables — Forge Line n'en a pas, c'est un mode
continu sans fin. Est-ce que "normal" doit devenir un vrai réglage de
difficulté à ajouter (facile/normal/difficile/très difficile,
sélectionnable), ou est-ce que les % doivent plutôt se lire comme "%
de parties qui atteignent la vague X" pour un X à définir (ex: vague 20
= repère "normal") sur le mode actuel tel quel ?

Vérifié : `node --check`, suite de régression complète toujours verte
après chaque changement de constante.

## Partie 3 : correctif majeur du simulateur (mauvaise largeur d'écran)

Repéré en creusant pourquoi les 3 profils restaient presque identiques
(vague ~8 quelle que soit la stratégie) : `simulate.mjs` ouvrait la
page SANS préciser de viewport — Playwright utilise alors une largeur
de bureau (~1280px). Une tour (portée 160px) n'en couvre qu'un quart :
la plupart des ennemis marchaient hors de portée quoi qu'on achète,
ce qui écrasait toute différence entre bien jouer et ne rien faire.
Corrigé : viewport mobile (420×800, comme l'iPhone 16 de Pierre) —
c'est la largeur d'écran RÉELLE que voit un joueur, pas une largeur de
bureau qui n'existe pour personne sur ce jeu (pensé mobile-first).

Résultat après correctif (15 parties, tir manuel 250ms) : vague
moyenne 34,3 (naive) / 24,3 (correct) / 32,7 (good) — bien plus sain
que les ~8 vagues mesurées avant. Repère "% encore en vie" à la vague
25 : 80% (naive), 40% (correct), à confirmer pour "good".

**Anomalie repérée, pas encore résolue** : "naive" survit en moyenne
PLUS longtemps que "correct" (34,3 vs 24,3) — pas l'ordre attendu. Piste
: "correct" mise tout sur UNE tour puis la renforce en priorité
(uCost <= dCost*3), ce qui semble moins payant sur une carte étroite
que la dépense plus étalée (dégâts/cadence/précision) que "naive" fait
par hasard — signal que le jeu récompense déjà la diversification des
achats (cohérent avec la consigne "chaque mécanique doit rester
rentable"), mais la logique du bot "correct" doit être corrigée pour
que le classement naive < correct < good redevienne cohérent avant de
s'en servir pour caler les constantes plus finement.

Pierre, en référence de ressenti : "la difficulté de Bloons TD 5 est
parfaite." Recherché : sur Bloons TD 5, la difficulté vient d'un
budget de vies fixe par run (200/150/100 selon le mode) et d'un nombre
de manches croissant (50/65/85) — pas d'ennemis qui grimpent en PV à
l'infini sans limite de vies. Forge Line a déjà un budget fixe
équivalent (10 brèches), ce qui va dans le même sens ; la comparaison
confirme l'approche déjà en place plutôt que d'en suggérer une nouvelle.

**Reste à faire pour la suite** : corriger la logique du bot "correct"
(classement naive < correct < good), puis relancer le simulateur avec
plus d'essais et des repères 10/25/50/100 pour caler finement autour
des cibles de Pierre (pas de paliers sélectionnables — tranché — donc
ces repères de vague servent de proxy à "facile/normal/difficile/très
difficile").

Sources : [Bloons Wiki — Difficulty](https://bloons.fandom.com/wiki/Difficulty), [Bloons Wiki — Rounds (BTD5)](https://bloons.fandom.com/wiki/Rounds_(BTD5)).

## Partie 3 : correctif de la logique du bot "correct" + mesure sur budget de frames réaliste

Corrigé l'anomalie notée juste au-dessus : "correct" appliquait un
biais dur ("renforcer la tour si son coût ne dépasse pas 3x celui des
dégâts") au lieu de comparer les options à leur coût réel. Remplacé
par la même règle que "good" (l'option la moins chère d'abord parmi
renfort de tour / dégâts / revenu auto / précision), mais sans
déplacement — "correct" reste sur une seule tour, "good" peut s'étaler
sur 3 en se déplaçant, c'est ça qui les différencie maintenant, pas
une préférence arbitraire pour les tours.

Le budget de frames par défaut (60 000, ~1000s simulées) s'est révélé
trop court une fois le jeu vraiment plus jouable — beaucoup de parties
touchaient le plafond sans être mortes, faussant la mesure ("maxFrames"
au lieu de "breach" dans `reasonCounts`). Retesté avec 150 000 frames
(~2500s simulées) sur 8 parties par profil :

- naive : vague moyenne 34,25 (min 13, max 80) — 25% encore en vie à
  la vague 25, 25% à la vague 50
- correct : vague moyenne 30 (min 18, max 79) — 37,5% à la vague 25,
  12,5% à la vague 50
- **good : vague moyenne 42,75 (min 21, max 79) — 62,5% à la vague 25,
  37,5% à la vague 50**

Le classement attendu (good nettement au-dessus) est maintenant net.
naive/correct restent proches (échantillon de 8 encore bruité —
écart-type 19 à 27 vagues) : signal que le déplacement/l'étalement des
tours pèse plus lourd que le simple ordre de priorité d'achat, cohérent
avec le repère Bloons TD 5 de Pierre (un budget de vies fixe qu'on
gère par la couverture de la carte, pas juste la puissance achetée).

**Où ça en est, honnêtement** : la vague 25 comme repère "normal" donne
~37,5% pour un joueur correct (cible de Pierre : 55-65%) et la vague 50
comme "difficile" donne ~12,5% (cible : 30-40%) — dans la bonne
direction mais encore en dessous des cibles, avec un échantillon trop
petit (8 parties) pour trancher finement. Le jeu est passé d'"impossible
quelle que soit la stratégie" à "differencié et globalement dans
l'esprit visé" en une session — la dernière étape (élargir l'échantillon,
ajuster 1-2 constantes de plus pour remonter vers 55-65%/30-40%) demande
un prochain passage dédié plutôt que deviner une valeur de plus sans
assez de données pour la confirmer.

Vérifié : `node --check` (aucun changement au jeu dans ce passage, que
`simulate.mjs`), suite de régression déjà verte avant ce commit
(logique de simulation seule, pas de risque de régression jeu).

## v17.41 — Mode Phosphore devient le seul style visuel

Pierre a signalé que les formes redessinées d'après ses croquis
n'apparaissaient pas en jeu ("j'ai toujours les vieux dessins tout
pourri"). Cause trouvée : tout le travail de redessin de cette session
(tour, forge, mur, bateau, caravane, cheval de Troie, ennemis) n'a
JAMAIS touché le mode couleur normal — seul le Mode Phosphore (branches
`if (phosphorMode){...} else {...}`) a reçu ces formes. Le mode couleur
gardait donc indéfiniment les anciennes formes basiques (cercles,
boîtes colorées), et le réglage du mode restait mémorisé par appareil
(localStorage `fl_phosphor`) — un ancien choix de mode couleur sur le
téléphone de Pierre bloquait la mise à jour même après un rechargement.

Question posée à Pierre (AskUserQuestion) : garder les deux modes (en
recopiant aussi les formes exactes dans le mode couleur, deux fois plus
de code à maintenir) ou n'en garder qu'un seul. Réponse : un seul mode,
supprimer le mode couleur.

Fait : bouton "Mode Phosphore" retiré du menu (HTML + i18n fr/en),
`phosphorMode` devient une constante (`true`) au lieu d'une variable
lue/écrite dans localStorage, écouteur de clic supprimé. Les branches
internes `if (phosphorMode) {...} else {...}` du rendu restent en
l'état — les réécrire toutes aurait été un chantier disproportionné
pour le bénéfice (l'`else` est juste du code mort inoffensif tant que
`phosphorMode` vaut toujours `true`). Nettoyage cosmétique possible
plus tard si besoin.

CHANGELOG remonté à v17.41 (oublié au commit précédent — Pierre n'avait
alors aucun moyen fiable de vérifier qu'il était sur la bonne version).

Vérifié : Playwright headless (mobile viewport), v17.41 affichée,
classe `phosphor` toujours active, bouton absent, aucune erreur JS,
menu complet et fonctionnel.

## v17.42 — Les formes ne correspondaient TOUJOURS pas (correctifs réels)

Après le v17.41, Pierre a rechargé et confirmé : "les formes ne
correspondent pas du tout". Plutôt que de re-questionner, comparaison
directe et systématique : rendu de chaque forme isolée en jeu
(fonctions de dessin appelées directement via Playwright, RAF gelé)
contre les 7 images de référence dans `references/`. Quatre vrais bugs
trouvés :

**1) Cube de renfort de la tour, 25% trop petit au niveau 1.** Les
fractions pixel-exactes mesurées en v17.37 (0.333/0.19/0.379) étaient
correctes pour un cube de référence à `capScale=1`, mais la formule
`capScale = Math.min(1.6, 0.6 + level*0.15)` valait 0.75 au niveau 1
(le niveau que voit tout le monde par défaut) — le cube de renfort
était donc systématiquement rendu 25% plus petit que sa vraie taille,
quasi invisible à l'échelle du jeu. Corrigé : `capScale = Math.min(1.6,
1 + (level-1)*0.15)`, donc exactement 1 (taille de référence) au
niveau 1, grandissant ensuite avec les renforts.

**2) Paliers de complexité des ennemis, mauvais motifs.** Remesuré sur
`ennemis-complexite.png` (5 cubes dessinés, pas une simple rampe) : les
4 motifs RÉELLEMENT distincts sont — plan (0), UN SEUL trait diagonal
sur la face du dessus (1), croix COMPLÈTE sur la face du dessus
uniquement (2), treillis dense sur les 3 faces (3). L'ancien code
faisait déjà une croix complète au palier 1 (donc un palier de moins
que voulu) et inventait une "croix sur les 3 faces" au palier 2 qui
n'existe pas sur le dessin. Corrigé pour suivre exactement les 4 motifs
observés.

**3) Cheval de la caravane, illisible.** Topologie correcte dans le
code (tête relevée, dos, 4 pattes) mais les coordonnées numériques
étaient si resserrées que plusieurs traits se chevauchaient quasiment
— rendu comme un gribouillis à peine reconnaissable comme un cheval, au
lieu du profil allongé du croquis. Coordonnées réétalées (mêmes
proportions relatives, juste plus de distance entre les points) pour
que tête/dos/4 pattes soient enfin visuellement distincts. Pas
re-mesuré pixel-exact (le croquis est à main levée, comme le bateau/la
caravane l'étaient déjà) — amélioration de lisibilité, pas prétention
à l'exactitude pixel.

**4) Cheval de Troie, complètement à côté (le plus gros écart).**
L'ancien dessin (torse en pavé isométrique + 4 pattes à deux segments)
ne ressemblait pas du tout au croquis. En remesurant `cheval-de-
troie.png` (dessin à traits droits, donc a priori mesurable
précisément comme la tour/le mur) : c'est en réalité une silhouette
ANGULEUSE ET ALLONGÉE vue de côté — oreille dressée à gauche, dos en
zigzag à plusieurs bosses qui s'étire loin vers la droite jusqu'à une
pointe de queue, pattes anguleuses à différents points le long du
corps. Repointé entièrement à partir de coordonnées mesurées sur
l'image (grille pixel + lecture directe des sommets, une vingtaine de
points). Limite honnête : faute de temps pour driver le pipeline
d'extraction automatique (scipy) jusqu'au bout sur cette forme précise,
les coordonnées viennent d'une lecture manuelle soigneuse sur crops
zoomés avec grille, pas d'une extraction pixel-exacte vérifiée par
recouvrement rouge comme pour la tour/le mur en v17.37 — la silhouette
générale (tête/zigzag/queue/pattes) correspond nettement mieux qu'avant,
mais certains sommets peuvent être décalés de quelques pixels par
rapport au croquis.

**Bateau : vérifié aussi, écart mineur non corrigé.** Le croquis montre
4 ornements en losange reliés directement aux coins de la coque (pas de
mât central) ; le rendu actuel a un mât + fanion en haut et 2 losanges
seulement. Assez proche dans l'esprit (coque hexagonale à planches
correcte, losanges présents) pour ne pas être ce que Pierre a signalé
en premier — laissé tel quel pour ce passage, à reprendre si Pierre le
signale aussi.

Vérifié : `node --check`, rendu Playwright (RAF gelé, chaque forme
dessinée isolément + galerie complète), aucune erreur JS, comparaison
visuelle directe avec chacune des 7 images de référence.

## v17.43 — Le vrai problème : trop petit, pas "faux"

Pierre a envoyé une vraie capture d'écran (vague 8, en jeu) avec "Ben
regarde et dis-moi". Analyse méthodique de la capture, région par
région, en comparant chaque élément à sa position/fonction attendue :

- Forge (gros bloc en bas, juste au-dessus des boutons) : toit en
  pavillon + cheminée + poteau + étal, correctement positionnée sous le
  mur comme prévu (Partie E). Correspond raisonnablement au croquis.
- Tour construite par le joueur (au-dessus de la route, comme prévu) :
  bonnes proportions (porte + cube de renfort) mais MINUSCULE — à peine
  quelques pixels, illisible sans zoomer numériquement dessus.
- Marchand (petit personnage, cercle+jambes, barre de vie au-dessus) :
  comportement correct, pas un bug — juste pris pour "une table" à
  cause de la taille et du chevauchement avec la caravane et la tour
  au même endroit à cet instant précis de la partie.
- Cheval de Troie et caravane : les correctifs du v17.42 sont bien
  visibles en jeu, silhouettes nettement plus lisibles qu'avant.

Conclusion : la vague de correctifs v17.42 avait réglé les VRAIES
erreurs de tracé, mais le symptôme "ça ne correspond pas" venait aussi
d'un problème différent — l'échelle. `TOWER_HW`/`TOWER_HH`/
`TOWER_MAX_SH` donnaient une tour si petite que la porte (quelques px)
et le cube de renfort étaient réellement invisibles à l'œil nu sur un
téléphone, même avec des proportions par ailleurs correctes.

Corrigé : tour agrandie ×1,5 (`TOWER_HW` 10→15, `TOWER_HH` 5→7.5,
`TOWER_MAX_SH` 28→42). Purement visuel : `TOWER_SOLID_RADIUS` (collision
joueur/ennemis), `TOWER_RANGE_PX` (portée de tir) et tous les autres
réglages de jeu restent inchangés — vérifié qu'aucun autre endroit du
code ne référence `TOWER_HW`/`TOWER_HH`/`TOWER_MAX_SH` en dehors du
rendu (grep ciblé avant modification).

Forge non retouchée (déjà lisible à sa taille actuelle sur la capture
de Pierre comme dans mes propres tests isolés) — pas de changement
inutile.

Vérifié : `node --check`, rendu Playwright avant/après (capture native
420×800 sans zoom numérique) — porte et cube de renfort de la tour
clairement visibles à l'échelle réelle du jeu, aucune erreur JS.

## v17.44 — Nouvelle méthode de recopiage (voir tools/) + application

Pierre a validé une méthode bien plus rigoureuse que tout ce qui avait
été tenté jusque-là pour recopier ses croquis exactement : détection de
la grille isométrique par ajustement aux moindres carrés (élimine une
dérive d'environ 30px trouvée sur la caravane), détection des traits
par transformée de Hough (`cv2.HoughLinesP`, recherché sur internet à sa
demande — outil standard, pas une heuristique maison), recalage sur la
grille, et auto-vérification contre l'image d'origine (rejette tout
seul les arêtes qui ne suivent pas un vrai trait blanc). Confirmée
"parfait" sur bateau, cheval de Troie, tour, forge, mur, caisse+roues
de la caravane. Sauvegardée dans `tools/` (scripts + `tools/README.md`)
pour être réutilisée directement sur un futur croquis.

Deuxième étape demandée : que chaque forme ait UN SEUL contour fermé
("comme un ballon qu'on dégonfle autour de l'objet"), rempli en noir,
posé sous les traits verts — pour qu'aucune forme ne laisse voir des
choses en transparence derrière une fois en jeu. Calculé automatiquement
(shapely : chaque segment de trait est gonflé d'un rayon fixe puis
fusionné) pour 5 formes sur 6 sans problème. Le cheval de Troie a cassé
en plusieurs morceaux séparés (pattes/dos trop loin du torse pour se
souder au rayon utilisé) — Pierre a jugé que le résultat automatique ne
correspondait toujours pas à son intention même après correctif du
rayon, et a demandé d'utiliser DIRECTEMENT son propre tracé (un trait
vert dessiné à la main sur l'image de référence) comme contour de
vérité plutôt que mon calcul. Fait : détection du trait vert par
couleur, fermeture des petits trous de tracé à main levée (dilatation
25px), remplissage, extraction du contour exact — recalé sur la même
image que l'extraction Hough pour rester cohérent. Validé.

Appliqué au jeu (les 3 formes déjà pixel-exactes — tour/forge/mur —
n'avaient rien à changer, confirmées par la vérification automatique) :

- **Marchands** : la silhouette "petit bonhomme" du v17.32 ne plaisait
  pas à Pierre ("des petits bonhommes un peu bizarres") — retour à de
  simples billes vertes (comme avant le v17.32), qui accompagnent le
  chariot.
- **Bateau** : le mât + fanion n'existe PAS sur le croquis de référence
  (vérifié pixel-exact) — c'était inventé au v17.32. Retiré, remplacé
  par les 4 vrais ornements en losange (2 côté proue, 2 côté poupe, au
  lieu d'1 de chaque). Positions approximatives (pas de conversion
  unité-exacte faite depuis les coordonnées pixel extraites vers le
  repère local du code, faute de temps) — à affiner si Pierre le
  signale.

Non fait dans ce passage, noté pour plus tard : le cheval de la
caravane a déjà été réétalé pour la lisibilité au v17.42 mais pas
recalé sur les coordonnées exactes maintenant disponibles (extraction
Hough validée à 86% de complétude sur ce croquis) — amélioration
possible mais pas une erreur bloquante. Le système "un seul contour
noir plein par forme" n'est PAS encore intégré au rendu du jeu
(uniquement validé via les scripts de `tools/`) — Pierre a dit explicitement
que le moment de l'intégrer en jeu (et le réglage du zoom) viendrait
plus tard.

Vérifié : `node --check`, rendu Playwright (menu + jeu), aucune erreur
JS.

## v17.45 — Bateau et cheval de la caravane, même rigueur que le reste

Pierre a explicitement demandé le même traitement rigoureux (recopiage
pixel-exact, pas d'approximation) pour le bateau et le cheval de la
caravane, qui n'avaient reçu que des positions "au jugé" au v17.44/v17.42.

**Bateau** : `drawBoatHullPhosphor()` réécrite en 61 segments recopiés
directement du croquis (méthode Hough, voir `tools/`) — coque, planches
ET les 4 ornements en losange, tous dans la même fonction (plus besoin
d'`ornament()` séparé). Échelle calée sur `BOAT_HULL_HW=40` existant
(demi-largeur mesurée E-W du croquis = référence), origine au sommet de
la proue, décalage vertical calé pour repartir du même point d'ancrage
que l'ancien code (`cyTop = -32`).

**Cheval de la caravane** : les 20 segments du cheval isolés de
l'extraction Hough de `caravane-marchands.jpg` (filtre x>950 pour
exclure la caisse/roues déjà correctes), convertis en unités locales
(origine au point d'attelage A, échelle réglée à l'œil sur un rendu
Playwright pour rester cohérente avec le reste du dessin — pas de
mesure pixel-exacte de l'échelle globale, seule la TOPOLOGIE et les
proportions relatives sont garanties exactes).

Vérifié par rendu Playwright direct (comparaison visuelle avec le
rendu SVG déjà confirmé "parfait" par Pierre) : les deux correspondent
maintenant à la référence. `node --check`, aucune erreur JS.

## v17.46 — Lot de correctifs signalés en direct sur le jeu

Pierre a testé le jeu en direct après le v17.45 et signalé plusieurs
points d'un coup :

1. **Interface** : l'or ("Or : 0") rejoint le compteur de vagues en
   haut (nouveau `#wave-group` : 💰 or, bouton "passer la vague",
   "Vague N"), `#bottombar` (qui ne contenait plus que l'or) supprimée
   — le canvas récupère cet espace (CSS `--bottombar-h` retirée des
   calculs de `#stage`/`#joyzone`/`#bonusbar`).
2. **Bouton "passer la vague"** (nouveau, "comme dans l'autre jeu") :
   vide les ennemis restants, avance directement à la vague suivante,
   verse un bonus d'or (`waveValueEstimate()`, la même formule que la
   récompense normale des marchands).
3. **Bateau réduit de 30%** (`ctx.scale(0.7,0.7)` autour de
   `drawBoatHullPhosphor()` — purement visuel, les coordonnées internes
   restent les mêmes).
4. **Silhouette pleine intégrée en jeu pour le bateau** (premier objet
   à recevoir le traitement "fond noir qui bloque ce qu'il y a
   derrière", validé hors-jeu au tour précédent) — Pierre a remonté un
   vrai bug concret causé par son absence : la ligne de démarcation
   eau/plage se voyait À TRAVERS la coque. Contour calculé une fois
   par `shapely` (buffer 4px + union) à partir des mêmes 61 segments
   déjà en place, converti en chemin `ctx.fill()` fixe posé AVANT les
   traits verts. Les autres objets (tour, forge, mur, caravane, cheval
   de Troie) n'ont PAS encore ce traitement — à faire si Pierre le
   signale aussi dessus (même méthode, juste refaire le calcul pour
   chacun).
5. **Ennemis sur le pont, plus de plafond** : Pierre a rappelé
   explicitement (règle déjà énoncée en Partie 1D) que chaque ennemi en
   attente doit exister physiquement, pas de résumé "+N" au-delà de 10.
   `BOAT_PASSENGER_DISPLAY_MAX` retirée, tous les passagers sont
   dessinés, grille resserrée en conséquence.
6. **Zone constructible agrandie** : la ligne séparant zone
   constructible / zone interdite était à `STAGE_H/2` ; remontée à
   mi-chemin entre cette ligne et le début de l'eau (`WATER_H`), sur
   demande explicite ("monter la ligne de la moitié de l'espace" qui
   les séparait).
7. **Bug de sauvegarde au redémarrage** : `resetGame()` remettait bien
   `gold`/`wave` à zéro EN MÉMOIRE, mais n'écrivait jamais la
   sauvegarde locale (`saveProgress()` n'était appelée qu'entre deux
   vagues) — un rechargement de page après avoir "recommencé"
   ramenait l'ancien or via `loadProgress()` au chargement. Corrigé en
   appelant `saveProgress()` à la fin de `resetGame()`.

**Non traité dans ce commit, en attente** : cheval de Troie/tour/forge/
mur/caravane sans silhouette pleine encore (seul le bateau l'a) ;
funnel des ennemis vers la porte centrale du mur avant la brèche (la
porte est purement visuelle pour l'instant, aucune logique de
déplacement ne force les ennemis à converger vers son x) ; symétrie
miroir des bateaux (arrivée par la gauche ou la droite, débarquement
par l'avant du bateau) ; investigation en cours sur une régression
signalée par Pierre concernant le cheval de la caravane (voir échanges
— pas encore de cause identifiée avec certitude au moment de ce commit).

Vérifié : `node --check`, rendu Playwright (capture complète de
l'interface + zoom sur le bateau confirmant que la ligne de l'eau
s'arrête bien à la silhouette), aucune erreur JS.

## v17.47 — Régression du cheval de la caravane : cause racine trouvée et réglée

Pierre : "ça n'a rien à voir avec ce qu'on a fixé avec la méthode
rigoureuse... il y a un processus qui est cassé, remonte la source du
problème."

**Investigation** : ré-extraction fraîche (`extract_hough.py` relancé
sur `caravane-marchands.jpg`, mêmes paramètres) des 20 segments du
cheval → comparaison point par point avec les coordonnées déjà dans
`drawCaravanCart()`. **Identiques à 0,01 unité près.** Donc pas un bug
de coordonnées, pas un bug de transformation pixel→unités locales (le
repère `A` + l'échelle `k=12` déjà en place étaient corrects).

**Cause réelle** : le rendu "parfait" que Pierre avait validé
(`occ-caravane-occlusion-test.png`) incluait le **canton noir en
arrière-plan** (silhouette pleine) — mais ce traitement n'avait été
porté qu'au bateau (v17.46), jamais à la caravane. Le cheval en jeu
n'était donc que des traits verts nus, sans le fond qui donne sa
lisibilité et ses proportions apparentes correctes. D'où l'impression
que "ça n'a rien à voir", alors que le tracé lui-même n'avait jamais
bougé.

**Correctif** : silhouette calculée une fois hors-jeu par `shapely`
(buffer 3.5 + union, sur les 20 mêmes segments convertis en unités
locales) et posée en `ctx.fill()` noir avant les traits, exactement
comme pour le bateau. Comparé visuellement au rendu Playwright
zoomé : correspond maintenant à `occ-caravane-occlusion-test.png`.

La caisse de la caravane n'a PAS reçu ce traitement (elle utilise un
tracé "contour ouvert, pas de face pleine" confirmé séparément en
v17.36 sur demande explicite de Pierre — la retoucher n'était pas ce
qui était signalé ici, et son jeu de segments extrait est plus
ambigu — deux caisses ou caisse+roues mélangées selon l'extraction).

**Leçon pour la suite** : toute forme qui reçoit le traitement
"coordonnées exactes" doit AUSSI recevoir le traitement "silhouette
pleine" dans le même mouvement, pas en différé — sinon le rendu en
jeu ne correspond pas à ce qui a été validé hors-jeu même si le tracé
est identique.

Vérifié : `node --check`, rendu Playwright zoomé (`drawCaravanCart`
isolé, RAF gelé) comparé visuellement au rendu de référence validé.

**Curseurs musique/bruitage** : signalés comme ne répondant pas au
toucher. La logique JS de mise à jour du volume était déjà correcte
(revérifié). Correctif défensif côté CSS : hauteur explicite (28px) et
`touch-action:none` sur `.menu-slider-row input[type=range]`, pour que
le glissé tactile ne soit pas intercepté par un ancêtre (typiquement
le scroll de page). Pas de moyen de tester le tactile réel dans cet
environnement — à confirmer par Pierre sur son téléphone. **Limite
honnête** : un test avec un vrai glissé tactile simulé (CDP
`Input.dispatchTouchEvent`, contrairement à un simple `TouchEvent` JS
qui ne pilote pas le curseur natif) fonctionne aussi bien AVANT ce
correctif qu'après dans ce navigateur headless — la cause exacte du
bug sur le téléphone réel de Pierre n'a donc pas pu être reproduite
ni confirmée ici, seulement traitée par un correctif défensif standard
pour ce genre de symptôme.

## v17.47 (suite) — Funnel des ennemis vers la porte centrale

Pierre : "il faut qu'ils passent par la porte centrale et qu'ils
disparaissent en bas d'écran, c'est à ce moment-là que ça attaque la
vie du château."

Le second point était déjà en place (`e.y >= STAGE_H - 16` déclenche
déjà la perte de créneau, pas le passage du mur — vérifié en lisant le
code, rien à changer). Seul le premier point manquait : la porte était
purement visuelle, aucun ennemi n'était poussé vers son x.

**Implémentation** : dans les ~100px avant le mur (`REGEN_ZONE.y`), la
position x de chaque ennemi (hors ceux en train de débarquer, de fuir
soigner une blessure, en attente de groupe, ou en plein siège immobile
d'une tour) converge progressivement vers le centre de l'ouverture
(`REGEN_ZONE.x + REGEN_ZONE.w/2`, qui coïncide exactement avec le
centre géométrique de la porte dessinée dans `drawCastle`).

**Bug trouvé pendant la vérification** : la première version ne
touchait que `e.x` directement — mais la plupart des ennemis sont
déplacés par `driftTowardPreferred(e, now)`, qui RECALCULE `e.x` à
partir de `e.baseX` à chaque frame ; la correction sur `e.x` seul était
donc écrasée dès la frame suivante (convergence quasi nulle observée
en simulation). Corrigé en tirant aussi `e.baseX` vers la porte, en
plus de `e.x` pour un effet immédiat sur la frame en cours.

Vérifié : `node --check` + simulation Playwright (6 ennemis synthétiques
répartis sur toute la largeur, `update()` rejoué ~400 fois) — leurs x
convergent bien tous vers ~210 (le centre) en approchant du mur, alors
qu'ils partaient de x = 28 à 334.

**À partir de ce point, Pierre est parti se coucher et m'a laissé
travailler en autonomie sur tout le reste du backlog, en privilégiant
l'avancement au blocage ("il vaut mieux avancer... plus tard on
corrige"). La suite de ce fichier documente les décisions prises sans
validation préalable en direct — chacune reste réversible et signalée
comme telle.**

## v17.49 — Symétrie miroir des bateaux + débarquement par l'avant

Pierre : "on va faire une symétrie selon un axe vertical pour les
bateaux... ça donne un peu plus de vie comme s'il arrivait à droite ou
par la gauche... les amis ils descendent du bateau par l'avant du
bateau."

**Symétrie** : chaque bateau tire au hasard (50/50) un booléen
`mirrored` à sa création. `drawOneBoat()` ajoute `ctx.scale(-1,1)`
juste après la translation/rotation existantes quand `mirrored` est
vrai — retourne toute la coque (silhouette + traits) sans dupliquer le
dessin. La grille des passagers sur le pont n'a pas besoin d'être
retournée (grille symétrique par construction, un flip ne change rien
visuellement).

**Débarquement par l'avant** : jusqu'ici `spawnEnemy()` plaçait le
point d'arrivée sur la plage réparti SYMÉTRIQUEMENT des deux côtés du
centre du bateau (`(Math.random()-0.5) * BOAT_W * 0.85`). Remplacé par
un décalage toujours du même signe ("avant"), dont le signe suit
`sourceBoat.mirrored` — donc le côté "avant" change bien de côté d'un
bateau retourné à l'autre, comme demandé.

**Limite assumée** : identifier avec certitude quel côté du croquis
Hough est réellement "la proue" (avant) vs "la poupe" (arrière) sur
une coque en perspective isométrique n'était pas fiable à partir des
seules coordonnées de segments (l'axe de longueur du bateau est en
diagonale à l'écran, pas aligné sur un simple signe de x). Le côté
"avant" utilisé ici est donc une convention interne cohérente (toujours
le même signe pour un bateau donné, qui flip avec `mirrored`) plutôt
qu'une identification garantie de la proue réelle du dessin — l'effet
demandé (regroupement d'un même côté, qui change avec le
retournement) est bien là, mais si Pierre veut spécifiquement que ce
soit la proue au sens strict du dessin, ça reste à confirmer avec lui
et ajuster le signe si besoin (un seul endroit à changer :
`frontSign` dans `spawnEnemy()`).

Vérifié : `node --check`, simulation Playwright (deux bateaux, un
retourné un non, 20 débarquements simulés côté chacun) — les points
d'arrivée se regroupent bien nettement d'un seul côté par bateau, et
ce côté est bien inversé entre le bateau normal et le bateau retourné
(ex. ~115-135 à droite du centre pour le non-retourné, ~284-305 à
gauche du centre pour le retourné). Capture d'écran confirmant que la
coque retournée est visuellement un vrai miroir, sans déformation.

## v17.50 — Silhouette pleine sur tout ce qui restait (tour/forge/mur/cheval de Troie) + bug de l'or après une vraie défaite

**Tour** : `drawIsoBox()` avait déjà un paramètre `opaque` (remplit
chaque face en noir avant le contour), jusqu'ici réservé au joueur.
Passé à `true` pour le corps de la tour et son cube de renfort — pas
de nouveau calcul de silhouette nécessaire, le mécanisme existait déjà.

**Forge** : même chose pour les 4 `drawIsoBox()` (corps, cheminée,
poteau, rebord). Le toit en pavillon n'utilise pas `drawIsoBox`
(losange + pointe dessinés à la main) : remplis manuellement en noir
(le losange de base + les 4 pans triangulaires jusqu'au sommet) avant
les traits, même principe.

**Mur du château** : pas de `drawIsoBox` ici (ruban de créneaux en
lignes individuelles). Ajouté un premier passage qui rejoue exactement
la même géométrie que la boucle de traits existante (pics/vallées/
porte) pour empiler les points du haut du ruban dans un tableau, puis
remplit tout le mur (ruban + corps jusqu'à la base) en une seule fois
avant les traits verts. La porte n'est pas creusée dans ce
remplissage : elle n'a jamais été un vrai trou physique dans le mur
(juste une silhouette de toit différente, plus haute) — cohérent avec
le reste du rendu qui la traite déjà ainsi.

**Cheval de Troie** : PAS ré-extrait depuis le croquis (le tracé actuel
est celui que Pierre a confirmé "parfait" — le retoucher aurait été le
même risque de régression que celui réglé plus haut sur le cheval de
la caravane). Silhouette calculée directement à partir des SEGMENTS
DÉJÀ DANS LE CODE (`earTip`→`nose`, la ligne de dos en zigzag, etc.),
dans les mêmes unités (dx,dy) non mises à l'échelle que `P()`, avant
buffer+union par shapely. Résultat : 2 polygones (le corps+3 pattes
reliées, et la 4e patte isolée près de la queue qui ne touche aucun
autre trait) — les deux remplis, comme pour le cheval de la caravane
qui avait aussi un morceau séparé.

Vérifié pour les 4 : `node --check`, rendu Playwright avec grille de
points derrière (prouve que le noir bloque bien ce qu'il y a dessous,
même méthode que le test d'occlusion hors-jeu) + capture complète de
l'interface avec tour/forge/mur simultanément, aucune erreur JS.

**Bug de l'or après une vraie défaite** (signalé par Pierre : "l'argent
qui reste sur le compte est en fait directement transféré à la partie
suivante") — la dernière sauvegarde automatique (entre deux vagues)
gardait l'or accumulé même après une défaite DÉFINITIVE (château tombé
ou cheval de Troie non détruit, aucune option de continuer) : recharger
la page avant de cliquer "Recommencer" ramenait la partie avec tout
l'or, comme si de rien n'était. Corrigé : au moment précis où cette
défaite définitive est détectée, la sauvegarde est immédiatement
écrasée avec un état à zéro (or/vague), sans attendre le clic sur
"Recommencer" — l'affichage de fin de partie garde les vraies valeurs
en mémoire (le joueur voit toujours son score réel), seule la
sauvegarde PERSISTÉE est remise à zéro. Une défaite "santé" simple
(`playerDead` avec option de résurrection encore possible) n'est PAS
concernée : ce n'est pas une fin de partie définitive.

Vérifié par simulation Playwright : `gold=5000, wave=42, breaches=10,
playerHealth=0` → un seul appel à `update()` (le passage à
`playerDead=true` et la vérification des brèches se font dans le même
appel, avant le garde-fou de retour anticipé qui ne s'applique qu'au
DÉBUT de l'appel suivant) → sauvegarde locale confirmée à
`{gold:0, wave:1}` alors que `gold`/`wave` en mémoire restent à
5000/42 pour l'écran de fin.

## Reprise de l'anomalie du simulateur (naive < correct) — investiguée, pas résolue par une nouvelle constante

Repris le point laissé en suspens plus haut ("le bot 'correct' survit
moins longtemps que 'naive', ordre inattendu"). Relancé `simulate.mjs`
avec des budgets de frames réduits pour rester dans un temps
raisonnable (le run complet à 60000 frames × 15 essais avait fait
tourner un processus en fond ~1h30 plus tôt dans cette session, tué
sans résultat) :

- 20000 frames × 8 essais : naive=18,4 / correct=18,4 / good=18,5 —
  quasi identiques, mais `reason: maxFrames` pour LES TROIS (personne
  ne meurt dans cette fenêtre, donc ça ne mesure que "jusqu'où on
  avance en temps fixe", pas "combien de temps on survit").
- 45000 frames × 5 essais : naive=33,6 / correct=33,8 / good=33,6 —
  toujours `reason: maxFrames` pour les trois, toujours personne ne meurt.

**Constat honnête** : avec les correctifs faits PENDANT cette session
(le vrai bug de cumul de difficulté trouvé et réglé en tout début de
session, plus la correction des paliers de complexité des ennemis,
l'agrandissement de la tour, etc.), le jeu semble nettement plus
généreux qu'au moment où l'anomalie naive/correct avait été mesurée —
aucune des 3 stratégies ne meurt même en simulant l'équivalent de
~750s de jeu (45000 frames). L'ancienne mesure (34,3 vagues pour
naive, avec de VRAIES morts, contre seulement ~18000-45000 frames
sans aucune mort maintenant) n'est donc probablement plus comparable
telle quelle : l'anomalie a pu se résoudre EN MÊME TEMPS que les
autres correctifs, sans qu'on l'ait mesuré exprès.

**Pas de changement de constante fait ici** : rejouer à l'aveugle sur
des chiffres d'équilibrage (coût/portée/dégâts des tours, PV/nombre
d'ennemis) sans un run assez long pour voir de vraies morts, ET sans
le ressenti de Pierre en jouant vraiment, aurait plus de chances de
dérégler que d'améliorer quelque chose qui n'est peut-être déjà plus
cassé. **Reste à faire, proprement cette fois** : un run à 60000+
frames et assez d'essais (donc potentiellement long, à lancer en
tâche de fond avec un vrai budget de temps dédié plutôt qu'en
autonomie contrainte) pour confirmer si l'anomalie existe encore une
fois qu'on observe de vraies morts, avant de toucher à un seul chiffre
d'équilibrage.

## v17.51 — Revue exhaustive demandée par Pierre : forge fausse depuis longtemps, groupe de marchands enfin organique

Pierre : "vérifie de manière exhaustive... la forge, le mur du château
c'est n'importe quoi... le chemin par lequel arrivent les marchands
est devenu très simple... je t'ai déjà dit 5 fois de traiter les
collisions entre ennemis, élastiques, et le bateau qui arrive comme un
petit affichage de dés fixe."

**Forge : vraiment cassée, confirmé.** Comparée à `forge.jpg` avec la
méthode Hough (`extract_hough.py`, 62 segments, complétude 100%) : la
version en jeu (toit en pavillon générique + petit cube de cheminée,
v17.32) avait dérivé loin du croquis réel — cheminée bien plus haute
et étroite que dessinée, toit bien plus évasé, proportions corps/toit
largement inversées (le toit dominait visuellement un corps écrasé).
Une note antérieure (v17.36) affirmait à tort "structure déjà
fidèle" sans être repassée par la méthode rigoureuse. **Remplacée par
les 62 segments exacts** + silhouette calculée par shapely à partir
des mêmes segments, ancrée au même point (mx, baseY) que l'ancienne
version paramétrique. Comparaison visuelle avant/après confirmant que
seule cette v17.51 ressemble vraiment au croquis (l'ancienne, testée
en isolant le même code sur le commit précédent, avait EXACTEMENT les
mêmes proportions "toit énorme / corps minuscule" qu'en jeu — donc pas
une régression du remplissage noir, un vrai écart de tracé jamais
corrigé).

**Mur du château : revérifié avec la même méthode (72 segments,
complétude 100%)** — topologie confirmée fidèle (ruban continu,
porte = 2 pics voisins qui convergent vers un sommet commun sans
vallée ni chute verticale entre eux, exactement comme sur le
croquis). Tour aussi revérifiée (39 segments, complétude 100%,
comparaison visuelle quasi parfaite). Je n'ai pas trouvé de bug de
géométrie sur ces deux-là — hypothèse la plus probable pour le
ressenti "n'importe quoi" : dit dans la même phrase que la forge (qui,
elle, était vraiment cassée), ou une question de lisibilité à la
petite taille réelle sur téléphone plutôt qu'une forme fausse. Pas de
changement fait sur mur/tour faute d'avoir trouvé un écart réel — à
confirmer par Pierre en jouant si le ressenti persiste une fois la
forge corrigée.

**"Le chemin par lequel arrivent les marchands devenu très simple"** :
`buildPath()` (le chemin décoratif en pointillés) n'a pas été touché
cette session (vérifié par diff contre le commit d'avant-session,
aucune différence) — et il a toujours été un simple zigzag "à ~50% de
précision" par conception (voir son propre commentaire). Je pense que
Pierre parlait en réalité de la manière dont les marchands arrivent
(le groupe sur le bateau), pas de ce tracé décoratif — recoupé avec
son message suivant sur le "petit affichage de dés fixe", qui décrit
exactement l'ancien rendu en grille des passagers du bateau.

**Collisions entre ennemis élastiques : déjà en place, vérifié par
simulation** (`resolveEnemyCollisions()`, tolérance `ENEMY_OVERLAP_
ALLOWED=0.12`, converge exactement vers la distance minimale attendue
après quelques frames — testé avec 6 ennemis partant du même point).
Ce système existe et fonctionne pour les ennemis au sol.

**Le vrai trou, trouvé : les passagers sur le pont du bateau.**
`drawBoatPassengers()` plaçait chaque passager sur une grille
rangée/colonne parfaitement régulière — mécanique, façon dominos ou
dés, exactement ce que Pierre décrit et reproche. Remplacé par
`packBoatCluster()` : positions de départ en spirale dorée + 6 passes
de relaxation par répulsion (même principe "élastique" que la
collision au sol, tolérance de distance minimale du même ordre de
grandeur), calculé UNE FOIS par bateau (pas par frame, ils ne bougent
pas tant qu'ils attendent) et mis en cache sur `b.passengerLayout`.
Trié du centre vers les bords : comme les passagers restants sont
toujours les N premiers indices du tableau (le tableau `passengers`
perd son PREMIER élément à chaque débarquement via `.shift()`), les
points les plus excentrés (en fin de tableau layout) sont ceux qui
"disparaissent" en premier visuellement — le cœur du groupe reste
dense le plus longtemps, pas de trou qui s'ouvre n'importe où.

Vérifié pour tout : `node --check`, rendu Playwright zoomé de la forge
comparé au croquis, capture complète en jeu (tour+forge+mur), et
capture du bateau avec 20 puis 7 passagers confirmant un vrai amas
organique (cercles qui se touchent, pas une grille) qui reste compact
en se vidant plutôt que de laisser des trous.

**Revérifié après coup** : une fois débarqués sur la plage, le groupe
reste bien compact — simulation d'une vague de 25 ennemis (spawn +
`update()` rejoué ~250 frames) : les paires les plus proches se
stabilisent à ~13-14px d'écart, exactement la distance élastique
minimale attendue (`2×rayon×(1-0.12) ≈ 14.08px`). Le système au sol
s'applique bien à tout le monde dès l'arrivée, rien à ajouter là.

**Caisse de la caravane, revérifiée avec Hough (54 segments sur
l'image complète, reclassés à la main par voisinage de grille — le
recadrage automatique de la zone caisse seule a échoué, grille non
détectée sur le crop) pendant la revue exhaustive** : la topologie
déjà codée pour le rebord + les roues (rebord ouvert + 3 chutes
verticales W/S/E + 2 roues séparées) correspond bien au croquis.

**Découverte non traitée** : le croquis montre en plus un élément
que le code ne dessine PAS DU TOUT — un point en pointe (sommet à
(796,87) en pixels de l'image) relié par deux arêtes à deux points
"épaule" symétriques (un cran de grille de chaque côté), eux-mêmes
reliés au rebord de la caisse. Ça ressemble à une petite bâche/auvent
en pointe au-dessus de la caisse (façon chariot bâché), pas un simple
montant. Reconstruction géométrique faite à la main à partir des
coordonnées (pas d'extraction automatique propre isolée pour cette
zone, donc moins sûre que le traitement forge/tour/mur/bateau) —
**pas ajoutée au code** : structure jamais confirmée par un rendu
comparatif fiable, et Pierre n'a rien signalé de spécifique sur la
caisse cette session (contrairement à la forge, clairement cassée).
Ajouter cet élément sans une vérification aussi rigoureuse que les
autres formes serait le même genre d'erreur qui a causé la régression
du cheval de caravane plus tôt — préférence donnée à ne pas toucher
plutôt que deviner. À signaler à Pierre pour qu'il confirme s'il veut
qu'on aille plus loin là-dessus.

**Bateau, revérifié avec Hough** (61 segments, complétude 100%,
exactement le même compte que ce qui est déjà codé) : comparaison
visuelle côte à côte parfaitement identique au croquis — confirmé
inchangé, aucune régression.

**Scène complète à l'échelle réelle de jeu** (2 tours de niveaux
différents, bateau avec passagers, 5 ennemis, caravane, forge, mur)
capturée en une fois : tout reste lisible, aucun chevauchement
cassé, aucune erreur JS. Revue exhaustive demandée par Pierre
terminée pour cette passe — seule la forge avait un vrai écart de
tracé, corrigée ; mur/tour/bateau/caisse de caravane confirmés
fidèles au pixel près (sauf le petit détail du montant noté
ci-dessus, laissé de côté faute de signal clair que c'est un problème).

## v17.52 — Cheval de la caravane, round 2 : "recheck le cheval et chariot marchand c'est pas bon"

Pierre a revérifié après le v17.51 et signalé que ce n'était toujours
pas bon. Comparaison PIXEL PAR PIXEL du rendu en jeu (`drawCaravanCart`
isolé, zoomé) contre le rendu de référence validé
(`occ-caravane-occlusion-test.png`, celui que Pierre avait confirmé
"parfait") : différence nette repérée — dans le rendu validé, la
crinière/oreille (un simple zigzag fin sur le croquis) reste un FIN
CONTOUR, alors qu'en jeu elle apparaissait comme un bloc noir plein
soudé au corps.

**Cause racine (celle-ci, la vraie)** : la silhouette "corde tendue"
(shapely, buffer + union des segments) utilisait un rayon de 3.5 dans
nos unités locales. Mais l'outil qui a produit le rendu validé
(`make_occlusion_test.py`/`make_svg_compare.py`) utilise par défaut un
rayon de **16, exprimé en PIXELS DE L'IMAGE SOURCE** — une fois
converti dans nos unités locales (÷ k=12, l'échelle utilisée pour ce
cheval), ça fait environ **1.33, pas 3.5**. Un rayon 2.6× trop large
gonfle chaque trait fin jusqu'à ce qu'il touche ses voisins et se
fonde avec eux — exactement ce qui soudait la crinière au corps.

**Correctif** : contour recalculé avec le rayon exact de l'outil
(16/12 ≈ 1.33) et les mêmes réglages (`cap_style`/`join_style` ronds,
comme le script d'origine — pas carrés comme la première tentative).
Le résultat brut avait 611 points (les jointures rondes en génèrent
beaucoup) : simplifié (`shapely.simplify`, tolérance 0.06 — assez
petite pour ne visuellement rien changer, vérifié par comparaison
avant/après) à 83 points, intégré au code.

**Résultat vérifié par comparaison visuelle directe** (rendu Playwright
isolé du cheval, fond gris pour bien voir le noir, comparé côte à côte
à `occ-caravane-occlusion-test.png`) : correspondance quasi parfaite —
corps et patte avant pleins (plusieurs traits qui se recouvrent
vraiment à cet endroit, donc légitimement remplis), crinière/oreille et
les 2 autres pattes redevenues un fin contour, comme sur le rendu
validé par Pierre.

**Leçon pour la suite, à ne plus refaire** : quand on porte une
silhouette calculée par les outils hors-jeu vers le code du jeu, le
rayon de buffer doit être recopié EXACTEMENT (en tenant compte du
changement d'échelle pixels→unités locales), jamais réestimé à l'œil.
C'est la deuxième fois que ce cheval casse pour une histoire de
paramètre non recopié fidèlement (la première fois, c'était le fond
noir carrément absent) — signal qu'il faut être plus systématique :
noter le rayon exact utilisé à côté de CHAQUE silhouette dans le code
(fait ici, à généraliser si d'autres silhouettes sont retouchées).

**Pas encore vérifié** : le bateau et le cheval de Troie utilisent
aussi une silhouette par buffer (rayons 4 et 2.5 respectivement,
choisis à l'estime, pas recopiés d'un rayon validé) — mêmes symptômes
possibles, pas revérifiés cette fois faute de temps (le bateau a déjà
été confirmé visuellement bon par Pierre en jeu ceci dit, donc risque
plus faible). À vérifier si signalé.

Vérifié : `node --check`, comparaison visuelle directe contre le
rendu de référence validé.

**Suite : cheval de Troie inspecté aussi (par précaution).** Tenté de
comparer sa silhouette (buffer 2.5) au contour de référence sauvegardé
(`contour-cheval-de-troie.json`, dessiné à la main par Pierre) —
**impossible de reconstruire fidèlement la transformation pixels→
unités locales** utilisée à l'époque pour ce cheval précis (contexte
compacté, aucune donnée sauvegardée faisant le lien entre points
nommés `earTip/nose/...` et pixels de l'image ; tentative d'estimation
par bounding box a donné des échelles X/Y incohérentes — signe d'une
rotation ou d'un repère non aligné, pas fiable à deviner). Rendu actuel
inspecté visuellement à la place (zoom isolé) : silhouette CONNEXE et
cohérente, pas de "crinière soudée" ni de morceaux qui se détachent
bizarrement — contrairement au cheval de caravane, rien ici ne saute
aux yeux comme cassé. **Laissé tel quel** : deviner un rayon "plus
correct" sans pouvoir vérifier contre la référence serait le même
genre d'erreur non vérifiée qui a causé ces deux régressions — mieux
vaut ne pas toucher à quelque chose qui n'a pas été signalé et qui a
l'air correct, que de le "corriger" à l'aveugle. Si Pierre signale un
souci sur le cheval de Troie spécifiquement, il faudra soit qu'il
redonne un point de repère pixel↔local, soit repartir du contour
validé en le comparant œil pour œil avec lui en direct.

## v17.53 — Chariot de la caravane repris ENTIÈREMENT depuis zéro

Pierre, après le correctif v17.52 (rayon de silhouette) : "redessine
le cheval avec chariot des marchands depuis le début, c'est pas bon
le résultat." Plutôt qu'un 3e rapiéçage, tout repris à zéro sur
l'image source.

**Réextraction complète** de `caravane-marchands.jpg` (méthode Hough,
mêmes réglages que d'habitude) : 54 segments au total, complétude
86,4% (les ~14% manquants sont des doublons/artefacts de croisement,
déjà vérifiés visuellement sans trait réellement manquant). Séparés
en 3 composantes connexes automatiquement (pas à l'œil, pour éviter
l'erreur du round précédent) : caisse (26 segments), roue 1 (4),
roue 2 (4) — le cheval (20 segments) déjà validé en v17.47/17.52 n'a
pas bougé.

**Découverte qui corrige une fausse piste du round précédent** : dans
la revue exhaustive d'avant, j'avais noté un "point mystère" au-dessus
de la caisse, pensé comme une possible bâche/canopy. En reclassant
proprement par composantes connexes cette fois (au lieu d'un simple
seuil sur x), ce point est en fait le coin N (arrière-haut) de la
caisse elle-même — mal identifié la fois précédente. **La vraie
découverte** : la caisse n'est pas qu'un simple rebord fin comme codé
depuis le v17.36 — le croquis montre un **DOUBLE liseré**, l'épaisseur
visible des parois quand on regarde dans une caisse ouverte depuis le
dessus (un rebord extérieur + un rebord intérieur légèrement décalé,
reliés par de courtes arêtes à chaque coin visible). Jamais reproduit
avant. Confirmé par comparaison directe à un crop haute résolution du
croquis original.

**Reconstruction** : origine unique choisie pour toute la fonction —
le coin S (avant-bas) de la caisse, à la même échelle k=12 que le
cheval (donc plus besoin de convertir entre deux repères différents
comme avant). Caisse (26 segments) + 2 roues (4 chacune) recopiés en
coordonnées locales exactes. Silhouette de la caisse recalculée avec
le MÊME rayon exact que le cheval (16/12, cap/join ronds, leçon du
v17.52 appliquée dès le départ cette fois) — 30 points après
simplification. Point d'attelage du cheval (`A`) repositionné : son
décalage exact par rapport à la nouvelle origine a été mesuré
directement sur les pixels (17.32, -0.05) plutôt que réestimé —
cheval et harnais inchangés sinon (déjà corrects).

Vérifié à chaque étape avant d'intégrer (pas seulement à la fin,
contrairement aux rounds précédents) : rendu Python autonome de la
caisse seule comparé au crop original (identique), rendu Playwright
isolé du chariot complet (caisse+roues+cheval) après intégration,
capture de la scène complète en jeu. Tout correspond visuellement au
croquis — double liseré visible, roues non remplies (comme prévu),
cheval avec crinière fine et corps plein.

## Simulateur relancé en vrai (90 000 frames × 15 essais) — l'anomalie n'est plus reproductible, MAIS nouveau constat plus important

Résultat du run long promis à Pierre : **naive=55,4 / correct=55,1 /
good=55,4 vagues, `reason: maxFrames` pour LES 45 PARTIES SANS
EXCEPTION** — personne ne meurt, quelle que soit la stratégie, même
sur ~1500s de jeu simulé (25 minutes). `survivalPctAtWave` confirme :
100% encore en vie à la vague 50 pour les 3 profils.

**Ça règle l'anomalie** (naive ne "bat" plus correct, ils sont
identiques) **mais révèle un problème plus large** : le jeu semble
être devenu très généreux — au point qu'AUCUNE des 3 stratégies,
même "naive" (ne construit jamais de tour, dépense au hasard), ne
perd en 25 minutes. Pour référence, Pierre visait le ressenti de
Bloons TD5 ("parfait"), qui devient sensiblement plus difficile bien
avant la vague 55 en mode normal. Ce n'était pas le cas à l'ancienne
mesure (34,3 vagues avec de VRAIES morts pour naive) — quelque chose
a rendu le jeu beaucoup plus indulgent entre-temps, très probablement
un ou plusieurs des correctifs de CETTE session (le vrai bug de
cumul de difficulté trouvé et réglé en tout début de session est le
suspect n°1, mais pas isolé formellement).

**Pas de changement de constante fait ici non plus** — rééquilibrer
à l'aveugle sur un seul run (même long) risquerait de sur-corriger
dans l'autre sens sans le ressenti de Pierre en y jouant vraiment.
**Mais le signal est maintenant assez clair pour être remonté** :
si le jeu paraît "facile" en y jouant, ce n'est pas une impression,
c'est mesuré. Prochaine étape naturelle si Pierre confirme ce
ressenti en jouant : identifier PRÉCISÉMENT lequel des correctifs de
cette session a fait basculer la difficulté (comparer le simulateur
sur le commit d'avant-session vs maintenant, à budget de frames
égal), plutôt que de deviner quel chiffre remonter.

## v17.54 — Carte Forêt, phase 1 (Pierre : "fait tout donc")

Dernier chantier de la liste, jamais commencé. Repris en gardant le
risque au minimum : un THÈME purement visuel plutôt qu'une vraie
2e carte séparée (pas d'architecture multi-cartes dans le jeu
actuellement — en créer une aurait été un chantier à part entière,
risqué à deviner sans retour de Pierre en cours de route). La
logique de jeu (ennemis, vagues, économie, collisions, funnel vers
la porte, etc.) est STRICTEMENT identique dans les deux thèmes —
seul l'habillage change :

- **Bascule** : nouveau lien dans le menu ("Carte : Côte" / "Carte :
  Forêt"), mémorisée comme la langue (`fl_mapTheme`), 'coast' par
  défaut (ne change rien pour une partie déjà en cours).
- **Radeau** (`drawRaftPhosphor`) : remplace la coque du bateau en
  thème forêt. **Dessin original** — contrairement à tout le reste
  du jeu, aucun croquis de référence n'a été fourni pour un radeau ;
  géométrie simple assumée (6 rondins parallèles + 2 traverses),
  même empreinte que la coque (`BOAT_HULL_HW/HH`) pour rester à
  l'échelle sans toucher `drawOneBoat`. Assumé sciemment plus simple
  que la coque (pas d'ornements) — cohérent avec un radeau, mais pas
  "validé" au sens où l'entend le reste du jeu (pas de source à
  comparer). À affiner si Pierre veut un style précis.
- **Sapins** (`drawForestDecor`/`drawTreePhosphor`) : rangée
  d'arbres sur la rive opposée (au-delà de la ligne d'eau, zone déjà
  hors gameplay), positions en fractions de `STAGE_W` (pas de pixels
  en dur, reste cohérent à toute taille d'écran). Purement
  décoratif, aucune collision.

**Pas fait dans cette phase** (à faire si Pierre veut aller plus
loin) : renommer "eau/mer" en "rivière" dans les textes (aucun texte
UI visible ne mentionne "bateau"/"mer" directement, donc pas
urgent) ; variante forêt pour tour/mur/forge (laissés identiques —
une palissade en bois pourrait avoir plus de sens en forêt qu'une
tour de pierre, mais c'est un choix esthétique qui mérite le retour
de Pierre plutôt qu'une décision seule) ; sélection de carte au
démarrage d'une partie plutôt qu'un simple lien de menu.

Vérifié : `node --check`, rendu isolé du radeau (zoomé), rendu du
radeau intégré en jeu avec passagers, bascule testée par un vrai
clic (`dispatchEvent`) confirmant le changement de thème + la
sauvegarde localStorage, scène complète en thème forêt (tours+sapins
+radeau+forge+mur, rien de cassé), thème "coast" par défaut
revérifié sans régression, 4s de vraie boucle de jeu (RAF réel) en
thème forêt sans erreur JS.

## v17.55 — Mur : créneaux étirés au lieu de répétés (signalé par Pierre)

"La palissade... tu l'as écartée pour qu'elle touche les bords alors
qu'il fallait garder les proportions et compléter les murs jusqu'à ce
qu'ils aillent au bord."

**Cause** : `slot = w / CASTLE_SEGMENTS` — un créneau occupait
toujours 1/10 de la largeur d'écran, donc s'étirait ou se tassait
selon l'appareil, jamais aux vraies proportions.

**Mesure sur le croquis** (grille isométrique, lattice (i,j) via la
méthode Hough) : écartement pic-à-pic ≈144,2px, hauteur pic-vallée
≈41,6px = `merlonH_source * 0,82` (ratio déjà connu) → `merlonH_source
≈ 50,7px`. Ratio largeur/hauteur ≈ 2,84. Avec le `merlonH=8` déjà fixe
du jeu, ça donne un slot fixe de **23** (au lieu de ~40 pour un écran
mobile typique — les créneaux étaient donc ~1,75× trop larges).

**Correctif** : `slot` devient une constante (`CASTLE_SLOT=23`), le
nombre de créneaux (`segCount`) se calcule pour couvrir toute la
largeur (`Math.ceil(w/slot)`, jamais moins que 10) — sur un écran de
420px ça fait 19 créneaux au lieu de 10. Les 10 brèches restent le
repère de défaite totale : `destroyed` est maintenant une fraction
(`segCount * min(10,breaches)/10`) plutôt qu'un index fixe, donc à
brèches=10 le mur est TOUJOURS entièrement rasé quel que soit
`segCount` — l'équilibrage (10 vies) ne change pas, seule la
granularité visuelle s'affine.

Vérifié : `node --check`, rendu zoomé à 0/5/10 brèches (0 = ruban
continu jusqu'aux deux bords, 5 = moitié gauche plate comme attendu,
10 = mur entièrement rasé), capture pleine échelle en jeu, aucune
erreur JS.

## v17.56 — Trouvé : LA cause de "plus personne ne meurt" (bissection commit par commit)

Suite du fil laissé ouvert en v17.51/17.52 ("le jeu est devenu très
généreux, cause pas isolée"). Comparaison A/B au simulateur, budget de
frames ÉGAL (45000) sur plusieurs commits successifs de cette
session :

- **Avant tout correctif de cette session** (commit `8e15856`) :
  5-6 morts sur 8 essais par profil, vagues moyennes 27-31.
- **Juste après le correctif de cumul de difficulté** (`b27e0cb`,
  "types 2/3 décalés pour ne plus cumuler avec la ruée") : encore
  3-5 morts sur 8, vagues moyennes 30,5-32,5 — un vrai effet, mais
  PAS la cause principale.
- **Juste après le funnel vers la porte** (`119c6fe`) : **0 mort sur
  8, pour les trois profils.** C'est LUI.

**Mécanisme** : le funnel (v17.47) tirait tout le monde vers un POINT
unique (`gateX`), créant un couloir de quelques pixels de large —
beaucoup plus facile à défendre qu'un mur où les ennemis passent
n'importe où sur toute la largeur (le joueur/une tour ne peuvent pas
être partout à la fois). Concentrer tout le monde au même endroit,
même sans changer un seul chiffre de dégâts/PV, a suffi à rendre la
défense triviale.

**Premier correctif tenté** : viser la largeur réelle de la porte
(±`CASTLE_SLOT`, un couloir d'environ 46px) plutôt qu'un point.
Revérifié : les positions x s'étalent bien maintenant sur ~54px
(181-235 pour une porte centrée à 210) au lieu de ~10px. **Mais
retesté au simulateur (même budget) : toujours 0 mort sur 8.**
Élargir le couloir ne suffit pas — le problème n'est pas la largeur
du goulot, c'est le fait qu'il y en ait un du tout : même une
concentration modérée laisse un point de défense prévisible et
largement suffisant.

**Pas de rééquilibrage de PV/nombre d'ennemis fait ici** : ça
toucherait au ressenti général de difficulté (le repère de Pierre :
"Bloons TD 5 est parfait"), pas juste un bug technique isolé comme le
funnel — remonté à Pierre avec ce diagnostic précis plutôt que deviné
seul. Le funnel lui-même (élargi à la largeur de la porte) est gardé :
c'est une amélioration réelle (plus fidèle à la porte dessinée) même
si elle ne restaure pas la difficulté à elle seule.

Vérifié : `node --check`, funnel re-testé (positions x confirmées
étalées sur la largeur de la porte), simulateur relancé au même
budget que les runs précédents (45000 frames × 8 essais) pour
confirmer que l'élargissement seul ne suffit pas.

## v17.57 — Carte Forêt : palissade + tours de guet en bois

Pierre, en réponse directe à la question posée : "oui, palissade en
bois etc." pour tour/mur/forge en thème forêt.

**Palissade** (`drawPalisade`) : appelée depuis `drawCastle` avec
exactement la même géométrie déjà calculée (x/y/slot/segCount/
destroyed/gateAfterSeg) — la logique de brèches et la position de la
porte restent identiques entre les deux thèmes, seul l'affichage
change. Pieux pointus en alternance haut/bas (silhouette naturelle,
pas une rangée uniforme), 2 lisses horizontales qui les ceinturent
(interrompues devant la porte), pieux "abattus" (courts, sans pointe)
sur la portion détruite par les brèches au lieu des dents plates du
mur de pierre.

**Tours de guet** : même corps (`drawIsoBox`, donc même taille/
niveau/renfort que le thème côte), mais porte simple (2 planches) et
toit pointu en bois à la place de la porte à 4 points + cube de
renfort en pierre.

**Forge : laissée identique dans les deux thèmes** — déjà une
structure en bois/pierre assez neutre question terrain (cheminée,
toit en pavillon), une vraie refonte n'apportait pas grand-chose par
rapport à tour/mur qui, eux, changent clairement de matériau
(pierre → bois).

Comme le radeau : **dessins originaux**, aucun croquis de référence
fourni pour ces variantes — à ajuster si Pierre en dessine un.

Vérifié : `node --check`, rendu zoomé palissade (brèches 0 et 5),
scène complète en thème forêt (2 tours + palissade + radeau + sapins
+ forge, rien de cassé), thème "coast" par défaut revérifié sans
régression.

## v17.58 — Carré de zone retiré, porte de la tour figée quel que soit le niveau

**"Enlève le carré autour de la gorge"** / **"Forge"** / **"le trait
de zone du château, le mur suffit"** — le `strokeRect(x,y,w,h)` qui
entourait toute la zone (REGEN_ZONE pour le mur, FORGE_ZONE pour la
forge) était redondant avec la palissade/le mur et la structure de la
forge, qui suffisent déjà à montrer la limite. Retiré en mode
phosphore (gardé en mode couleur, seul repère visuel là-bas).

**"Attention à la porte des tours, vérifie-la sur l'original, assure-
toi qu'elle reste pareille même si la tour grandit au-dessus"** —
vrai bug trouvé : les fractions de position de la porte (0.577 à
0.858, mesurées sur le croquis pour une tour de NIVEAU 1) étaient
appliquées à `sh` COURANT, qui grandit avec `visualLevel` à chaque
renfort. Résultat : la porte "montait" le long de la tour à mesure
qu'elle grandissait, au lieu de rester ancrée près du sol comme sur
le croquis. Corrigé en utilisant une hauteur de référence fixe
(`TOWER_MAX_SH`, la valeur de `sh` au niveau 1) au lieu de `sh`
courant — mathématiquement identique à l'original au niveau 1
(aucune régression), et figée ensuite. Le facteur de dégâts (hp/
maxHp) reste appliqué : la porte s'enfonce avec le corps si la tour
est endommagée (cohérent avec le reste de la structure), seul le
NIVEAU ne la fait plus bouger. Même correctif appliqué à la porte en
bois de la variante forêt (v17.57), pour la cohérence.

Vérifié : `node --check`, rendu comparant une tour niveau 1 et une
tour niveau 10 côte à côte — la porte est maintenant à la même
hauteur absolue sur les deux, capture pleine échelle confirmant les
deux carrés de zone disparus.

## v17.59 — Suggestions de conception (Pierre : "je valide tout")

Deux des quatre suggestions faites plus tôt dans la session, celles à
faible risque/impact rapide :

**Bannière de fin de vague** : "Vague X terminée !" affichée en haut
de l'écran à chaque transition de vague (déclenchée aux deux endroits
où `wave++` se produit — fin naturelle ET bouton "passer la vague"),
fondu entrée/maintien/sortie sur 1,6s. Purement visuel, aucun effet
de jeu.

**Secousse d'écran** : décalage aléatoire décroissant sur
`SHAKE_DURATION_MS=260ms`, appliqué à tout le contenu du terrain de
jeu (pas à la bannière ni au HUD, `ctx.restore()` avant leur propre
dessin). Déclenchée sur la mort d'un boss (magnitude 6) et sur une
brèche subie (magnitude 3 à 8 selon le `breachDamage` de l'ennemi —
un boss qui passe secoue plus qu'un ennemi de base). `triggerShake()`
ne fait qu'intensifier/rallonger une secousse en cours, jamais deux
qui s'additionnent en find.

Vérifié : `node --check`, bannière rendue et visible (texte + fondu
confirmés à mi-durée), décalage de secousse confirmé par diff de
deux captures consécutives pendant une secousse déclenchée (zone
large de l'image différente entre les deux frames), scène complète
sans régression.

**Restent à faire (suggestions plus grosses, en cours)** : 2e type de
tour (catapulte, dégâts de zone) et ennemi "bouclier" (immunisé au
premier tir).

## v17.60 — Nouvelle tour "Neige" (croquis fournis par Pierre via Drive)

Pierre a déposé deux fichiers SVG dans un dossier Drive "Forge Line"
("isometric snow tower short.svg" / "...long.svg") avec la consigne
"teste le rendu et montre-moi" — première fois qu'une référence
arrive comme export vectoriel plutôt qu'une photo/JPG d'un croquis
papier. Format découvert en l'ouvrant : exactement la méthode de
grille magnétique isométrique déjà recommandée à Pierre plus tôt dans
la session (des `<circle>` formant la grille de points + des `<line>`
accrochées dessus) — donc AUCUNE extraction Hough nécessaire cette
fois, les coordonnées de chaque sommet sont exactes dans le fichier
lui-même, juste à décoder.

Méthode (voir `tools/gen_snow_tower.py`, réutilisable pour toute
future référence dans ce format) :
1. Parser les `<circle>`/`<line>` du SVG, retrouver le pas de grille
   (confirmé : vraie grille isométrique 30°, `dy/(dx/2) = tan(30°)`
   exactement — DIFFÉRENT du style 2:1 utilisé partout ailleurs dans
   le jeu, `GRID_TH/GRID_TW = 0.5`). Convertir chaque point en indices
   entiers (u,v) de la grille (pas en pixels bruts) — ce sont ces
   indices qui portent l'information, pas les pixels d'origine.
2. Reprojeter (u,v) → écran avec le ratio 2:1 du jeu au lieu du 30°
   d'origine (juste un changement d'unité, la topologie ne bouge pas)
   — rendu comparé visuellement à l'original pour confirmer que
   changer les unités des axes ne déforme rien (fidèle, juste plus
   trapu).
3. Remplissage plein (silhouette noire, style "v17.50" du reste du
   jeu) calculé avec `shapely.polygonize()` sur l'ensemble des arêtes
   projetées — trouve automatiquement les 19 faces fermées de la
   grille planaire, sans la moindre interprétation manuelle (donc zéro
   risque de refaire l'erreur de rayon de silhouette du cheval de la
   caravane, où le rayon avait été estimé au lieu d'être repris
   exactement de l'outil).

Comparaison des deux fichiers (short = tour niveau 1, long = tour
plus renforcée) : le module haut (plateforme évasée + toit à glaçons)
est BIT-EXACTEMENT identique entre les deux, seule la hampe change de
longueur (4 unités de grille dans short, 7 dans long) — Pierre a donc
fourni deux points de calibration du même bâtiment à deux hauteurs,
pas deux tours différentes. Utilisé pour bâtir un modèle paramétrique
fidèle : chaque sommet du SVG "short" porte un indicateur `up`
(1 = fait partie du module haut fixe, translaté vers le haut de
`growPx` quand la tour est renforcée ; 0 = fait partie de la
hampe/porte, ancré au sol, jamais affecté par le niveau — même
principe que le correctif de porte v17.58, appliqué ici dès le
départ plutôt qu'en correctif après coup). `growPx` dérive de la même
formule `sh` que la tour de pierre (`TOWER_MAX_SH * visualLevel *
hpFactor`), moins la valeur de référence au niveau 1, pour rester
cohérent avec la progression déjà en place.

Intégré comme 3e thème de carte, "Neige" (`mapTheme`, menu cyclique
Côte → Forêt → Neige → Côte, persisté comme les deux autres). Pour
l'instant seule la tour change dans ce thème (mur/forge restent ceux
de la pierre) — le mur avec escalier (autre référence déposée par
Pierre juste après, "isometric wall with stairs.svg") reste à faire.

Vérifié : `node --check`, rendu autonome (SVG) comparé pixel à pixel
au croquis original aux deux hauteurs de référence, rendu en jeu réel
(4 tours neige construites côte à côte, une renforcée 8 fois pour
confirmer que seule la hampe s'étire et que le toit/plateforme ne
bougent pas de taille), aucune régression sur les thèmes Côte/Forêt
existants (capture de contrôle : mur, forge, tours de pierre
identiques à avant).

## v17.61 — Escalier d'accès au chemin de ronde (3e référence Drive)

Juste après la tour neige, Pierre a signalé un 3e fichier dans le même
dossier Drive : "isometric wall with stairs.svg" ("Regarde aussi le
nouveau mur avec escalier"). Même format (grille magnétique) et même
outil de décodage que la tour (`tools/gen_snow_tower.py`, appliqué tel
quel — juste une histoire de re-fournir le bon fichier en entrée).

Le SVG contenait en fait DEUX morceaux dessinés côte à côte : un
tronçon de mur (3 créneaux) avec un escalier intégré contre sa face
intérieure, suivi d'un second tronçon de mur nu plus long. Repéré par
inspection visuelle du rendu brut, puis confirmé par une analyse en
composantes connexes du graphe d'arêtes (`union-find`, même technique
que celle qui avait servi à trier crate/roues/cheval sur le croquis de
la caravane) : le tronçon nu est juste redondant avec le mur déjà en
place dans le jeu (mêmes créneaux), donc pas repris. Un filtrage par
composante connexe a aussi retiré 3 arêtes orphelines (un petit trait
isolé sans rapport, probablement une esquisse abandonnée sur le même
canevas) — gardé uniquement la composante principale (68 arêtes, 20
faces de remplissage).

Échelle : cette référence utilise son propre espacement de créneaux
(mesuré ~3,5x plus large que `CASTLE_SLOT=23` du mur réel du jeu). Vu
que c'est un ajout ponctuel/décoratif (pas un remplacement du système
de créneaux existant), choix pragmatique : réduire l'échelle du rendu
extrait (facteur ~0,36) pour que le tronçon avec escalier reste de
taille comparable aux vrais créneaux voisins, plutôt que de re-bâtir
tout le système de mur autour de cette nouvelle graduation.

Intégré comme décoration fixe dans `drawCastle()` (`drawWallStairs`),
posée une fois à 2 créneaux de la porte (jamais dans la brèche),
uniquement sur les thèmes Côte et Neige (la palissade en bois de la
carte Forêt retourne avant ce point du code, donc intacte — vérifié).
Purement visuel : ne dépend pas de `segCount`/`breaches` au-delà de
rester dans les bornes du mur, aucune interaction, aucun effet sur les
10 brèches de défaite.

Vérifié : `node --check`, rendu en jeu réel sur Côte, Neige et Forêt
(escalier visible et bien positionné sur les deux premiers, palissade
en bois inchangée et sans escalier sur le troisième — aucune
régression).

## v17.62 — Catapulte (2e type de tour, "je valide tout")

Dernière des quatre suggestions de conception validées en bloc plus
tôt dans la session ("un 2e type de tour avec un rôle distinct :
dégâts de zone").

Choix de conception (aucun n'a été redemandé à Pierre, tous
tranchés en gardant la cohérence avec ce qui existe déjà) :
- **Économie** : même coût de renfort et même PV max par niveau que
  la tour à flèches (`towerMaxHpAtLevel`/`towerUpgradeCost` réutilisés
  tels quels) — un objet tour porte maintenant un champ `kind`
  (`'tower'` par défaut ou `'catapult'`), c'est tout ce qui les
  distingue côté économie.
- **Rôle distinct, pas juste "tour plus forte"** : cadence FIXE
  (`CATAPULT_SHOT_INTERVAL_MS=1800ms`, n'accélère jamais avec le
  niveau, contrairement à `towerShotInterval`), dégâts par tir à
  0,65x une tour classique, mais tout ennemi dans un rayon de 34px
  autour de l'impact encaisse 0,6x ces dégâts en plus (jamais la
  cible principale, déjà comptée en plein) — vraiment utile contre un
  paquet d'ennemis groupés, moins bon contre une cible isolée que la
  tour à flèches : un vrai choix tactique, pas un simple palier de
  puissance.
- **Construction/renfort** : nouveau bouton dédié ("Catapulte", touche
  C), qui construit ou renforce selon qu'on est déjà collé à UNE
  CATAPULTE (pas n'importe quelle tour — nouveau helper
  `pickNearestTowerOfKind`, sinon appuyer sur "Tour" à côté d'une
  catapulte l'aurait renforcée par erreur). `tryBuild()` généralisé
  avec un paramètre `kind` au lieu d'être dupliqué.
- **Silhouette** : originale (aucun croquis fourni pour celle-ci,
  comme le radeau/toit forêt) — délibérément BASSE et large plutôt
  qu'une tour de plus qui grandit en hauteur, pour que le rôle
  "zone/siège" se voie au premier coup d'œil à côté d'une tour à
  flèches. Socle en pavé (même style plein que le reste), bras de tir
  sur pivot en A avec un petit contrepoids, animé par le temps écoulé
  depuis le dernier tir (`recoilFrac`, dérivé directement de
  `now - lastShotAt`, aucun état d'animation à gérer en plus) : bras
  bas juste après un tir, qui remonte doucement pendant la charge.
  Grandit légèrement avec le niveau (plafonné à 1,5x, même logique que
  le cube de renfort de la tour de pierre) et rétrécit avec les
  dégâts comme les autres tours.

Vérifié : `node --check`, rendu en jeu réel (catapultes et tours
construites côte à côte, silhouettes bien distinctes), une catapulte
renforcée 5 fois (seule elle grandit, pas les tours voisines — confirme
que `pickNearestTowerOfKind` cible bien le bon type), 12 secondes de
jeu réel (vagues, tirs, or gagné) sans erreur console.

## v17.63 — Ennemi "bouclier" (dernière suggestion validée)

Dernier item du backlog des quatre suggestions ("je valide tout") : un
ennemi qui force un VRAI contre tactique plutôt qu'une simple case
"plus de PV" de plus — absorbe tout son premier coup reçu, sans aucun
dégât, puis redevient un ennemi normal pour le reste de sa vie.

Un seul point d'entrée pour toute la logique : `applyDirectHit(target,
dmg)`, appelé aux deux endroits où un projectile touche directement un
ennemi (tir suivi normal ET tir raté du joueur qui touche quelqu'un
par hasard — tour, catapulte, joueur, soldat confondus, un seul code
partagé). Renvoie les dégâts réellement infligés (0 si le bouclier
vient d'encaisser) pour que l'appelant sache s'il doit compter l'aggro
du joueur (pas d'aggro pour un coup qui n'a en fait rien fait). Le
dégât de zone de la catapulte (v17.62) NE PASSE PAS par cette
fonction — décision délibérée : un bouclier tenu face à l'attaquant
n'arrête pas une explosion qui vient d'à côté, et ça rend la catapulte
mécaniquement forte contre un paquet de boucliers groupés (peut faire
sauter plusieurs boucliers "gratuitement" via le splash d'un seul tir
sur la cible visée en direct).

Introduit progressivement à partir de la vague 20 (même rythme de
montée que les deux types précédents, `WAVE_TYPE4_START/RAMP_WAVES/
TYPE4_MAX_RATE`, décalé de 6 vagues après le type 3 comme l'écart déjà
en place entre les types 2 et 3), vitesse et PV normaux (comme le type
de base) — la difficulté vient du fait qu'il faut le viser deux fois,
pas d'un boost de stats caché.

Retour visuel explicite (Pierre avait insisté sur la lisibilité pour
les autres suggestions) : un anneau vert autour de l'ennemi tant que
`shieldUp` est vrai, qui disparaît net dès le premier coup absorbé —
se voit d'un coup d'œil sans avoir à deviner au comptage de PV.

Vérifié : `node --check`, rendu en jeu avec le taux d'apparition forcé
à 100% dès la vague 1 (dans une copie de test seulement, jamais dans
le fichier livré) — anneaux visibles sur plusieurs ennemis à l'écran,
vagues complétées normalement avec 4 tours construites (confirme
qu'ils meurent bien après le 2e coup, pas immortels), aucune erreur
console sur une session de jeu réelle prolongée.

## v17.64-65 — Amélioration d'expérience de jeu (Pierre : "réfléchis, ordonne, fais en suivant direct")

Backlog des 4 suggestions "je valide tout" terminé (v17.60-63). Pierre
a ensuite demandé une réflexion ouverte sur l'amélioration de
l'expérience de jeu, à exécuter directement sans repasser par lui.

**Piste écartée d'entrée** : un compteur numérique de brèches dans le
HUD (repéré comme un manque en lisant le code — `breaches` n'a aucun
affichage texte). Vérifié dans NOTES.md avant d'y toucher : c'était en
fait un choix DÉLIBÉRÉ (v17.12, "château = compteur de brèches
visuel", décidé explicitement par Pierre pour remplacer un ancien
texte). Pas réintroduit — la destruction visuelle du mur reste le seul
retour, comme voulu.

**v17.64 — Annonce du prochain type d'ennemi** : une brève ligne
d'avertissement ("Attention : ennemis à bouclier en approche !", en
ambre) accrochée à la bannière de fin de vague, MAIS seulement aux 3
vagues où un nouveau type d'ennemi apparaît pour la première fois
(`NEW_ENEMY_WAVE`, dérivé directement de `WAVE_TYPE2/3/4_START` — pas
de nombre dupliqué à la main). Pas à chaque vague : noierait le signal
un vrai avertissement doit être rare pour rester repéré. Bannière
prolongée à 2,8s (au lieu de 1,6s) le temps de lire les deux lignes.

**v17.65 — Correctif de difficulté (le vrai morceau)** : en relisant
le code pour préparer l'annonce ci-dessus, remarqué que le simulateur
(déjà construit plus tôt dans la session pour un autre diagnostic)
n'avait jamais été rejoué depuis — décidé de le refaire tourner avant
d'aller plus loin sur des idées de "juice". Résultat sans appel :
**aucune des 30 parties simulées (3 profils de joueur × 10, dont un
qui ne construit AUCUNE tour) ne perdait avant la vague 30** — toutes
via `maxFrames` (le temps simulé s'épuise), jamais `breach` ni
`health`. Le naïf (0 tour, tape au hasard) fait aussi bien que le bon
joueur : la difficulté n'existait tout simplement plus, pour personne,
au-delà d'un certain point.

Cause précise retrouvée par lecture directe (pas de nouvelle
bisection nécessaire, le code parle de lui-même une fois qu'on sait où
regarder) : `pickNextSpawnDelay()` a un plancher dur
(`Math.max(18, 65 - wave*3)`) atteint dès la vague ~16 — la cadence
d'arrivée des ennemis PLAFONNE à cette vague et ne redescend JAMAIS
plus bas ensuite. Pendant ce temps, `effectivePlayerDmg()` (le palier
Dégâts) grandit en `1.05^niveau` — EXPONENTIEL, sans aucun plafond,
pour toujours. Deux courbes : l'une plate à partir de la vague 16,
l'autre qui explose indéfiniment. Le résultat n'était qu'une question
de temps, pas de chance.

Fidèle à une contrainte déjà posée explicitement par Pierre ailleurs
dans le code ("le type de base... reste 1 coup = 1 mort POUR
TOUJOURS... la difficulté ne doit pas venir de PV qui grimpent... mais
du NOMBRE d'ennemis") : n'a touché NI les PV des ennemis de base, NI
la formule de dégâts du joueur, NI l'économie de renfort des tours —
seulement la CADENCE et la TAILLE DES PAQUETS de spawn (deux leviers
déjà "nombre d'ennemis", juste répartis différemment dans le temps) :
- `pickNextSpawnDelay()` : plancher abaissé de 18 à 6, atteint vers la
  vague ~30 au lieu de ~16 (pente identique avant ce point — vagues
  1-15 bit-exactes à avant, tutoriel/ruée déjà calés par Pierre).
- Paquets groupés (déjà existants, probabilités 35%/12%) : un bonus
  qui grandit avec la vague (jusqu'à +35 points), donc plus d'ennemis
  au contact EN MÊME TEMPS aux vagues avancées, pas plus coriaces.

Revérifié au simulateur après coup (8 parties × 3 profils,
maxFrames=90000) : net changement — 2/8 (naïf), 7/8 (correct), 8/8
(bon) terminent maintenant par une vraie brèche, vagues ~33 à ~64,
1-15 inchangées (aucune régression sur le tutoriel), % de survie à
chaque repère nettement plus révélateur (100% à la vague 25, ~50% à
la vague 50, 0% à la vague 100 — un vrai plafond existe enfin).

**Anomalie repérée, PAS corrigée maintenant** : le profil "bon" (qui
étale ses tours sur 3 points au lieu de camper un seul endroit) meurt
en moyenne PLUS TÔT (vague ~43) que le "naïf" qui ne construit jamais
rien (vague ~57) — inversion inattendue. Hypothèse la plus probable :
le funnel de la porte (déjà documenté comme concentrant tous les
ennemis vers un point unique, v17.56) récompense fortement le fait de
camper CE point précis, et punit le fait de se disperser sur 3
positions — un défenseur unique planté pile à la porte intercepte
100% du flux, trois défenseurs dispersés n'en interceptent chacun
qu'une fraction. Ce serait un problème de CONCEPTION plus profond (le
funnel lui-même), pas un simple réglage de chiffres, et mérite sa
propre réflexion à part — pas traité dans cette passe pour rester
concentré sur le correctif principal (qui, lui, est sans ambiguïté :
plus personne ne pouvait perdre, maintenant tout le monde peut).

**FAQ mise à jour au passage** (retard pris ce soir même) : la
catapulte (v17.62) et l'ennemi bouclier (v17.63) n'étaient mentionnés
nulle part dans le panneau "Astuces" — corrigé (`p_catapult` ajouté,
`p_waves1` étendu à 5 types avec les vraies vagues de déblocage 9/14/
20, qui ne correspondaient déjà plus aux anciens chiffres écrits en
dur "5 et 10").

Vérifié : `node --check`, capture de contrôle vague 1 (pas de
régression sur le tutoriel/la ruée), annonce testée en jeu réel (texte
ambre bien affiché sous la bannière verte), deux runs complets du
simulateur (avant/après) comparés ci-dessus.

## v17.66 — "Corrige tout" : 4 demandes directes (Pierre, avec capture d'écran)

Pierre a enchaîné (dicté, quelques coquilles de reconnaissance vocale
à décoder — "très" pour "trait", etc.) quatre demandes concrètes en un
seul message, plus une capture d'écran de son téléphone. Exécutées
dans l'ordre le plus simple/sûr d'abord, la plus grosse (le mur) en
dernier — voir v17.67.

**Chemin des marchands en double trait** : "ça doit être un trait
double, pas juste un trait simple". `drawPath()` traçait une seule
polyligne ; ajouté `offsetPolyline(points, dist)` — décale chaque
sommet perpendiculairement à la moyenne des deux segments adjacents
(propre aux coins, pas juste un décalage de segment isolé) — et trace
deux fois la même polyligne, décalée de ±3px, comme deux rails
parallèles.

**Curseur de construction en temps réel** : "un petit curseur très
discret... qui affiche l'endroit où on peut construire une tour...
des fois si je bouge juste de quelques pixels l'endroit où je peux
construire, c'est le même". La logique de placement de `tryBuild()`
(recherche de case libre) sortie dans `findBuildSpot()` — une seule
source de vérité, réutilisée par le nouveau `buildPreviewCell()` (même
recherche, sans construire). Dessiné chaque frame comme un simple
contour de losange (même géométrie que `drawDebugGrid`), semi-
transparent, sur la case exacte que `tryBuild()` choisirait.

**Ligne de démarcation sable/terre ferme retirée** : redondante avec
le curseur ci-dessus, qui disparaît déjà tout seul hors zone
constructible (`buildPreviewCell()` renvoie `null`).

Vérifié : `node --check`, rendu en jeu (chemin en double trait visible,
curseur qui suit le joueur et disparaît bien hors zone constructible),
aucune erreur console.

## v17.67 — "Corrige tout" (suite) : le nouveau mur du château

La plus grosse des quatre demandes, et la plus importante à bien
comprendre avant d'agir : "l'ancien mur du château doit disparaître,
c'est le nouveau qu'on doit mettre en place... il y en a deux
[segments] et ils sont écartés par un vide qui est justement l'espace
pour la porte". Erreur corrigée : en v17.61, le croquis Drive
"isometric wall with stairs.svg" avait été mal lu — j'avais pris le
2e tronçon (nu, sans escalier) pour une simple redondance du premier
et je l'avais laissé de côté, n'utilisant le tronçon avec escalier que
comme un AJOUT décoratif posé PAR-DESSUS l'ancien mur procédural
(CASTLE_SLOT). Pierre a corrigé : les deux tronçons sont les deux
moitiés du MÊME mur, et le vide entre eux dans le croquis EST la
porte — pas une coïncidence.

Revérifié en mesurant précisément (même méthode que d'habitude,
tools/gen_snow_tower.py réutilisé) : le vide entre les deux tronçons
dans le croquis fait 45px, quasiment identique à `CASTLE_SLOT*2` (46)
déjà utilisé par le funnel des ennemis — bonne confirmation que
c'était bien lu.

**Remplacement complet** de l'ancien mur procédural (créneaux
générés par formule, v17.36/37/55) par la géométrie exacte du
croquis :
- Les deux tronçons (`WTILE_STAIRS_*`, `WTILE_PLAIN_*`) font
  chacun EXACTEMENT 142,5px et se recollent bout à bout sans le
  moindre décalage vertical — vérifié en pavant 4 copies du tronçon
  nu : le zigzag des créneaux continue sans la moindre marche,
  jonction invisible. Un vrai motif répétable, pas un dessin figé à
  une seule largeur d'écran (le croquis n'en montrait qu'un
  exemplaire de chaque, mais rien n'empêchait de le paver — vérifié).
- `WALL_GATE_HALF_W = 22.5` (la moitié du vide mesuré) remplace
  `CASTLE_SLOT` pour le funnel des ennemis (update()) — à moins d'un
  pixel l'un de l'autre, mais celui-ci est la vraie mesure de CE mur.
  La palissade en bois (thème Forêt) garde `CASTLE_SLOT`, inchangée.
- Nombre de tronçons nécessaires calculé pour couvrir toute la
  largeur de `REGEN_ZONE` (`Math.ceil`, jamais moins loin que le
  bord, même principe que l'ancien système) — testé et vérifié sur
  mobile portrait (420px, 2 tronçons visibles) ET desktop large
  (1000px, 5 tronçons) : jonctions invisibles aux deux échelles.
- Destruction (10 brèches = défaite) réimplémentée au niveau du
  TRONÇON entier (pas du créneau individuel, pas praticable à extraire
  proprement du dessin vectoriel) : les tronçons NUS les plus proches
  de la porte cèdent en premier (le flux d'ennemis funnelé y tape en
  continu), triés par distance réelle à la porte plutôt qu'un ordre
  arbitraire. Le tronçon avec ESCALIER reste volontairement toujours
  intact, même à 10/10 brèches — décision assumée (pas dans le
  message de Pierre, mais raisonnable : une structure d'accès au
  chemin de ronde a toute raison d'être plus renforcée que le
  parapet ordinaire) plutôt que de fabriquer une version "détruite"
  de l'escalier, hors de portée sans nouveau croquis. Vérifié aux 3
  paliers (0, 6, 10 brèches) : érosion symétrique depuis la porte,
  escalier intact même à 10/10, un rendu de "mur presque entièrement
  rasé sauf la structure renforcée" qui reste lisible et cohérent.
- L'ancien `drawWallStairs` décoratif (v17.61, posé par-dessus
  l'ancien mur) est supprimé — plus nécessaire, le nouveau mur EST
  déjà l'escalier à l'endroit voulu.

Vérifié : `node --check`, rendu en jeu sur mobile (420px) et desktop
(1000px) — jonctions de tronçons invisibles aux deux tailles, porte
bien centrée sur le chemin des marchands et la cible du funnel —,
rendu aux 3 paliers de brèches (0/6/10, ce dernier via l'écran de
défaite qui laisse voir le mur derrière), palissade Forêt revérifiée
intacte (branche séparée, retour anticipé avant tout le nouveau code),
20 secondes de jeu réel (vagues, tours construites, funnel actif)
sans erreur console.

## v17.68 — simulate.mjs : anomalie du profil "good" (tâche #18 résolue)

Signalée en v17.65 (validation du correctif de difficulté) et laissée
ouverte à l'époque : dans une passe de 30 parties simulées, le profil
"good" (censé être le meilleur des 3 bots du simulateur) mourait
systématiquement PLUS TÔT que "naive" — un signal fort que soit le
funnel de la porte avait un vrai défaut de conception, soit
l'heuristique du bot "good" lui-même était mauvaise.

Racine trouvée en lisant le code du bot, pas en creusant le jeu :
"good" étalait JUSQU'À 3 tours sur des positions à ±90px du point fixe
(`STAGE_W/2`), au lieu de rester au même endroit que "correct". Deux
problèmes cumulés :
- Le funnel des ennemis (voir `WALL_GATE_HALF_W`/désormais
  `WALL_NATIVE_GATE_HALF_W` dans `index.html`) concentre tout le flux
  sur une largeur d'environ 45px autour du centre de la porte — les
  2e/3e tours à ±90px tombaient hors de ce couloir réel, donc
  quasiment inutiles la plupart du temps.
- Même en ignorant ça, diluer le même total d'or sur 3 tours à niveau
  bas grimpe moins haut qu'une seule tour poussée à fond : le coût de
  renfort ne grandit que 2,7%/palier (`UPGRADE_COST_GROWTH`) alors que
  la puissance grandit 5%/palier (`UPGRADE_POWER_GROWTH`) — une
  propriété délibérée de cette économie (concentrer l'investissement
  bat toujours le disperser), que "good" allait justement à l'encontre
  de.

Donc pas un défaut du jeu — une mauvaise heuristique de bot. Corrigé :
"good" reste maintenant au MÊME point que "correct" (la porte), mais
diversifie le TYPE de défense au lieu de la position — construit une
tour à flèches, PUIS une catapulte au même endroit (dégâts de zone
contre un flux funnelé, un choix qui a un vrai sens dans ce jeu), puis
alterne renfort (tour ou catapulte, au moindre coût) / dégâts / revenu
auto / précision, comme avant.

Revalidé sur un nouveau run (10 essais, 90000 frames) : "good"
meanWave=62, medianWave=63, écart-type=2,72 (le plus régulier des 3),
100% de survie au repère vague 50 — désormais meilleur ET plus
régulier que "naive" (moyenne 61,1, 90% à la vague 50) et "correct"
(moyenne 56, 80% à la vague 50), confirmant que l'anomalie venait bien
du bot et pas du funnel.

## v17.69 — correctif de Pierre sur le mur (v17.67 mal interprété)

Pierre, en revoyant v17.67 : "c'est le bon mur que t'as pris [...]
dans le dessin que je t'avais donné y avait déjà les deux bouts de
mur [...] et le vide au milieu qui sert de porte, ça c'est le mur
ENTIER, sûr, c'est lui qu'il faut que tu colles à droite et à gauche
de l'écran [...] tu le mets à l'échelle [...] en gardant les mêmes
proportions, il faut qu'il touche parfaitement à gauche, parfait à
droite [...] sur ordinateur c'est un autre problème".

Point important : les coordonnées extraites du croquis n'ont JAMAIS
été en cause ("c'est le bon mur que t'as pris") — seule l'hypothèse
de v17.67 sur la façon de les UTILISER était fausse. v17.67 avait vu
juste sur un point (les deux tronçons ne sont pas redondants, voir
l'entrée v17.67 ci-dessus) mais avait ensuite supposé, à tort, que
chacun était un motif RÉPÉTABLE à paver côte à côte jusqu'à couvrir
l'écran (comme l'ancien système de créneaux à taille fixe, v17.55).
Ce n'est pas ça : le croquis montrait déjà la composition ENTIÈRE du
mur — tronçon escalier + vide de la porte + tronçon nu, dans cet
ordre, dessinée UNE seule fois — à mettre à l'échelle en un seul bloc
comme une image qu'on redimensionne, pas à répéter.

**Remplacement du système de pavage par un rendu à l'échelle unique** :
- Les deux tronçons (`WTILE_STAIRS_*`/`WTILE_PLAIN_*`, 2 repères
  locaux séparés, bord gauche à x=0 chacun) sont fusionnés en un seul
  repère commun : `WALL_WHOLE_EDGES`/`WALL_WHOLE_FACES` (110 arêtes,
  31 faces), largeur native 330px, hauteur native 63,75px — la porte
  tombe naturellement au centre exact (165 = 330/2), sans le moindre
  ajustement à la main : c'est directement la géométrie du croquis,
  juste reprojetée entièrement dans le même repère au lieu de deux
  repères locaux distincts. `tools/gen_wall_tiles.py` réécrit en
  conséquence (mêmes étapes qu'avant, mais un seul `gen()` sur les
  deux composantes ensemble) ; sortie revérifiée par diff exact
  (aucune différence) contre les données livrées dans `index.html`
  avant de faire confiance au script.
- Nouvelle fonction `drawWallWhole(leftX, groundY, scaleX, scaleY)` :
  `ctx.translate` + `ctx.scale(scaleX, scaleY)` puis dessin des faces
  (remplissage noir) et des arêtes (trait phosphore) dans deux blocs
  `save`/`restore` séparés — nécessaire pour pouvoir corriger
  l'épaisseur du trait après le `scale` (`lineWidth = 1 /
  ((scaleX+scaleY)/2)`), sinon le trait devient plus épais ou plus
  fin selon l'échelle appliquée. Remplace entièrement `drawWallTile`/
  `drawWallTileRubble` et les constantes `WALL_TILE_W`/
  `WALL_GATE_HALF_W` (code mort supprimé).
- `drawCastle()` : `scaleX = REGEN_ZONE.w / WALL_NATIVE_W` — touche
  TOUJOURS exactement les deux bords de l'écran, quelle que soit sa
  largeur (vérifié pixel par pixel sur mobile 420px ET desktop
  1200px : le merlon le plus à gauche/droite touche exactement x=0
  et x=largeur d'écran, capture à l'appui).
- Hauteur (`scaleY`) : suit le même facteur que `scaleX` jusqu'à un
  plafond (`WALL_MAX_SCALE_Y = 2.35`), au-delà duquel elle
  n'augmente plus — c'est ma décision pour répondre au "sur
  ordinateur c'est un autre problème" de Pierre, qui n'a pas précisé
  la solution exacte : suivre le même facteur sans plafond aurait
  rendu le mur démesurément haut sur un écran large (330px de large
  natif contre ~1200px d'écran desktop, soit ×3,6 en hauteur aussi
  si non plafonné). Sur téléphone, ce plafond n'est jamais atteint
  (proportions du croquis gardées à l'identique, comme demandé) ;
  sur desktop, le mur reste proportionnellement plus large que haut
  au lieu de grandir sans limite — vérifié visuellement à 1200px,
  rendu jugé raisonnable, mais pas explicitement confirmé par
  Pierre : à ajuster s'il retoque cette valeur précise.
- Dégâts (brèches) : `hpFactor = 1 - brèches/10` multiplie `scaleY`
  seul (jamais `scaleX`, qui doit toujours toucher les deux bords) —
  le mur "s'enfonce" à mesure qu'il encaisse des brèches, jusqu'à
  disparaître à raz le sol à 10/10 (même principe que les barres de
  vie des tours), sans jamais changer sa largeur ni se déformer.
- Le funnel des ennemis (`update()`) utilisait `WALL_GATE_HALF_W`,
  une constante fixe en pixels — plus valide maintenant que la porte
  grandit avec le reste du mur. Remplacé par
  `WALL_NATIVE_GATE_HALF_W * (REGEN_ZONE.w / WALL_NATIVE_W)`, qui
  suit le même facteur d'échelle horizontal que le mur lui-même.

Vérifié : `node --check` sur le script extrait ; rendu Playwright sur
mobile (420px) et desktop (1200px), aux 3 paliers de brèches (0, 5,
10) — mur qui touche exactement les deux bords aux deux tailles
d'écran (confirmé par recadrage pixel des coins gauche/droite),
porte centrée à l'endroit attendu par calcul, hauteur qui suit
proportionnellement sur mobile et se plafonne sur desktop sans
paraître écrasée ni démesurée, mur qui s'enfonce jusqu'à disparaître
à 10/10 brèches (déclenche bien l'écran de défaite, comportement du
jeu inchangé). `tools/gen_wall_tiles.py` revérifié par diff exact
(sortie identique aux données livrées) avant d'être committé.

## v17.70 — curseur de construction : décalé sur le côté (Pierre)

Pierre, après un test réel : "je crois que l'endroit où on crée la
tour, c'est au-dessus de nous en haut pas sur les côtés, le petit
curseur là". Le curseur (`findBuildSpot`, v17.66) avait pourtant déjà
un commentaire affirmant placer la case "pile au-dessus du joueur" —
vrai seulement quand le joueur est exactement au centre d'une case de
grille, ce qui n'arrive presque jamais en déplacement continu.

Root cause trouvée en mesurant plutôt qu'en devinant : `findBuildSpot`
prenait `screenToGridCell(player.x, player.y)` — la case de grille
dont le CENTRE est le plus proche du joueur par un arrondi 2D unique
sur (x,y) combinés — puis reculait d'une case en diagonale (gx-1,
gy-1) pour revenir "au-dessus" de CETTE case. Problème : cet arrondi
2D mélange x et y, donc rien qu'en marchant tout droit vers le haut
(x fixe, y qui diminue), il peut basculer vers la case de grille
voisine sans que le joueur n'ait bougé d'un pixel horizontalement —
le curseur saute alors d'un cran de grille sur le côté (jusqu'à 24px,
mesuré par un balayage programmatique : à x=200 fixe, le curseur
alternait entre dx=+16 et dx=-8 selon la hauteur du joueur, sans
jamais se stabiliser).

Corrigé en calculant la COLONNE de grille (`gx-gy`, qui fixe le x
affiché à l'écran) uniquement à partir de `player.x`, indépendamment
de `player.y` : `col0 = round(player.x / (GRID_TW/2))`. Cette colonne
ne change donc plus jamais tant que le joueur ne bouge pas en x — se
déplacer verticalement (s'approcher du mur en ligne droite, le cas le
plus courant en jeu) ne peut plus jamais faire sauter le curseur sur
le côté. La case "au-dessus" est ensuite dérivée de cette colonne
fixe et de `player.y` (`cellAt(col, steps)`), avec un ajustement de
parité (`gx+gy` doit avoir la même parité que `gx-gy` pour que gx/gy
restent entiers) qui ne peut décaler que la HAUTEUR d'une demi-case,
jamais la colonne. Les 6 cases de repli (cases déjà occupées) suivent
le même principe, décalées en colonne plutôt qu'en position brute.

Revalidé par balayage programmatique (le même test qui avait révélé
le bug) : à x fixe, le décalage horizontal du curseur (dx) reste
maintenant parfaitement constant quelle que soit la hauteur du
joueur — plus aucune bascule, sur toutes les valeurs de x testées
(200 à 230px, dx borné à ±12px maximum, la moitié d'une case, ce qui
est la précision inévitable puisque le joueur se déplace en pixels
continus et la grille est discrète). `node --check` sur le script
extrait, rendu en jeu revérifié.

## v17.71 — boutons du bas qui débordent sous l'écran (Pierre)

Pierre : "je crois qu'il y a un problème d'affichage des boutons qui
sont trop bas, il y a un overflow sur le téléphone".

Root cause mesurée directement dans le DOM plutôt que devinée à l'œil
sur une capture : `--bonusbar-h` (la hauteur du bandeau de 8 boutons,
2 rangées de 4) était une valeur FIXE calculée en CSS
(`--bonusbar-row-h:58px` × 2 + 4px de marge = 120px), choisie à vue à
l'origine (v17.46) sans jamais être revérifiée contre le rendu réel
d'un bouton (icône 16px + libellé + coût, sur 3 lignes empilées avec
padding). Mesuré sur un vrai viewport iPhone (390×844, devicePixelRatio
3) : chaque bouton a en réalité besoin de ~59-60px de hauteur, pas les
52px que la CSS leur laissait une fois la marge/le padding du bandeau
retirés de la hauteur totale fixe — 7-8px de manque par rangée. Sur 2
rangées empilées, ce déficit cumulé poussait le bas de la 2e rangée à
~853px alors que la fenêtre ne fait que 844px de haut : environ 9px de
boutons (le texte "30 gold"/"Go to the Forge") invisibles sous le bord
de l'écran — exactement ce que Pierre a vu.

Corrigé à la racine plutôt qu'en retouchant la valeur fixe (qui ne
serait restée juste que par coïncidence, sur cet appareil et cette
langue précis — un futur changement de police, de texte ou de device
aurait pu recréer le même bug) : `#bonusbar` n'a plus de `height`
forcée en CSS, sa hauteur suit maintenant son contenu réel. Une
nouvelle fonction `syncBonusbarHeight()` mesure cette hauteur dans le
DOM (`getBoundingClientRect()`) et met à jour `--bonusbar-h` en
conséquence — variable dont dépendent aussi `#stage` et `#joyzone`
(leur `bottom`), qui se resynchronisent donc automatiquement avec la
vraie taille du bandeau. Appelée au début de `resizeCanvas()` (avant
toute lecture de la géométrie de `#stage`, pour que la zone de jeu
tienne compte de la bonne hauteur dès le premier calcul) et à la fin
de `applyLanguage()` (un changement de langue peut changer la longueur
du texte des boutons, donc leur hauteur avec retour à la ligne) —
jamais à chaque frame (mesurer la géométrie du DOM force un reflow
synchrone, un coût qu'on ne veut pas payer 60 fois par seconde).

Revalidé par une mesure directe (pas juste visuelle) sur 3
configurations : iPhone 390×844 (FR et EN) et iPhone SE 375×667 (FR) —
dans les 3 cas, le bas du bandeau tombe exactement sur le bas de
l'écran (aucun px de débordement, contre ~9px avant le correctif) ;
capture d'écran des 2 rangées entièrement visibles avec une marge
propre en dessous, aux 3 configurations. `node --check` sur le script
extrait.

## v17.72 — fuite mémoire dans simulate.mjs : les runs longs n'aboutissaient jamais

Pierre : "on va relancer tous les tests sur la gestion de la
difficulté". Un run complet (30 essais, 90000 frames, comme les
validations précédentes) ne s'est JAMAIS terminé — le processus
Chrome du simulateur grimpait en mémoire jusqu'à être tué par le
limiteur du conteneur (~13,8 Go de RSS, confirmé dans les logs
noyau : `Memory cgroup out of memory: Killed process ... (chrome)
... anon-rss:13789820kB`), silencieusement, sans le moindre message
d'erreur — le run relancé une 2e fois a fait exactement la même
chose. Deux tentatives perdues avant de comprendre qu'il ne s'agissait
pas d'un aléa d'infrastructure (un redémarrage du conteneur avait
d'abord brouillé les pistes) mais d'un vrai bug reproductible.

**Démarche de diagnostic** (rigoureuse plutôt que devinée, vu l'enjeu
— sans ça, plus aucun run long du simulateur n'aboutit jamais) :
1. Un essai isolé (1 essai, 500 frames) tourne et se termine
   instantanément → pas un problème de code cassé/boucle infinie.
2. Une seule partie longue (30000 frames, avec de courtes pauses
   entre des blocs de 2000 frames pour laisser respirer le GC) :
   mémoire parfaitement stable (5-18 Mo tout du long) → le JEU
   lui-même, frame après frame, ne fuit pas.
3. 200 parties courtes (1000 frames chacune, `resetGame()` entre
   chaque, AUCUNE pause) dans un seul appel synchrone : la mémoire
   grimpe de façon parfaitement linéaire, environ 1 Mo par partie →
   la fuite existe bien, et elle a besoin à la fois d'un reset ET de
   frames simulées après (`resetGame()` appelé 3000 fois SANS aucune
   frame ensuite : aucune fuite mesurée, testé séparément).
4. Le même test avec un `gc()` forcé entre chaque groupe de parties
   (Chrome lancé avec `--js-flags=--expose-gc`) donne EXACTEMENT la
   même courbe de croissance → pas un simple retard de ramassage,
   de vraies références retenues quelque part (un GC forcé ne change
   rien).
5. Rejoué le même test contre une version d'`index.html` d'AVANT
   tous les changements de cette session (commit `7c990f0`, la
   catapulte) : fuite identique, au même rythme → pas un bug que
   j'ai introduit cette session, un bug déjà présent, jamais
   remarqué faute d'avoir jamais poussé un run aussi long jusqu'au
   bout auparavant.
6. Toutes les listes d'objets connues (enemies, projectiles, towers,
   towerGraves, merchants, soldiers, floatingTexts, deathEffects,
   boats, particles, columnStats, recentSuccesses,
   pathScreenPoints) mesurées après 150 parties qui avaient fait
   grimper le tas JS à 159 Mo : toutes petites et normales (0 à 40
   éléments). La fuite n'est dans AUCUNE structure de jeu suivie.
7. Repéré `playTone()`/`playNoiseBurst()` (bruitages synthétisés,
   `index.html`) : chaque son (tir, impact, etc.) crée un NOUVEAU
   `OscillatorNode`/`AudioBufferSourceNode`/`GainNode`/`BiquadFilterNode`.
   Sur un vrai appareil, un nœud audio devient automatiquement
   éligible au ramassage une fois qu'il a fini de jouer (~25-50ms) —
   mais dans ce contexte headless (`--mute-audio`, page jamais
   visible, horloge audio qui ne semble jamais avancer), aucun nœud
   n'atteint jamais l'état "terminé", donc aucun n'est JAMAIS
   éligible au ramassage : une vraie fuite Web Audio, qui grandit
   avec le nombre de sons joués (donc avec le nombre de frames
   simulées — cohérent avec l'observation n°3).
8. Confirmé de façon définitive : rejoué le test n°3 (200 parties)
   avec `sfxVolume = 0; musicVolume = 0;` avant de lancer les
   essais → mémoire parfaitement stable (2,7-3,8 Mo, AUCUNE
   croissance) sur les 150 000 frames testées. Fuite éliminée à
   100%.

**Correctif** : `simulate.mjs` coupe maintenant `sfxVolume`/
`musicVolume` juste avant de lancer les essais (dans le
`page.evaluate()`, avant `runOne()`). Aucun changement dans
`index.html` — le jeu livré aux joueurs garde le son allumé par
défaut comme prévu, ce correctif ne concerne QUE le simulateur (les
bots n'ont de toute façon aucun intérêt à "entendre" le jeu, ça ne
change rien à la mesure de difficulté). Pas de piste solide pour
savoir si ce comportement Web Audio (nœuds jamais "terminés") peut
aussi arriver en conditions réelles de jeu — a priori non, un vrai
appareil avec une vraie sortie audio et un contexte débloqué par un
geste utilisateur voit son horloge audio avancer normalement, donc
les nœuds finissent et sont ramassés comme prévu ; ça reste un
signal aussi faible que pratique à vérifier plus tard si jamais un
usage anormalement long est rapporté (aucun signe actuel que ce soit
le cas).

Revalidé : un run à pleine échelle (3 essais × 90000 frames, le
plafond réel, jamais atteint sans crash avant ce correctif) se
termine proprement, sans erreur, avec des résultats cohérents (`good`
atteint la vague 68 dans les 3 essais avant d'épuiser les 90000
frames — aucune défaite, contre les vagues 33-64 mesurées en v17.65
avec des runs plus courts, cohérent avec plus de frames disponibles
pour progresser). `node --check` sur le script.

### Run complet demandé par Pierre ("relance tous les tests") : plus personne ne meurt à 90000 frames

Une fois la fuite corrigée, run complet (30 essais × 90000 frames × 3
profils, comme demandé) : **les 90 parties tombent TOUTES sur
`reason: "maxFrames"`, aucune vraie défaite** — naïf/correct/bon
convergent tous vers la vague ~68-69 (moyennes 68,33 à 68,83, écarts-
types 0,37-0,47, quasiment identiques entre profils). 100% de survie
aux repères vague 10/25/50.

Avant de conclure à une régression, comparé contre une version
BEAUCOUP plus ancienne du jeu (commit `7c990f0`, la catapulte —
avant même le correctif de difficulté v17.65) avec les mêmes
paramètres (10 essais × 90000 frames) : **même verdict** — les 30
parties (10×3 profils) tombent aussi toutes sur `maxFrames`, aucune
défaite, convergence des 3 profils vers la vague ~58,8. Donc CE
N'EST PAS un effet des changements de cette session (mur, curseur,
bandeau du bas) — ce plateau existait déjà avant.

Explication la plus probable, pas encore confirmée avec Pierre :
conséquence architecturale attendue du fonctionnement même du jeu,
pas un nouveau bug. La puissance du joueur grandit de façon
EXPONENTIELLE et illimitée (`UPGRADE_POWER_GROWTH=1.05`, sans
plafond), alors que la cadence d'ennemis (corrigée en v17.65) a un
plancher fixe même une fois atteint. Sur une session assez longue,
la croissance exponentielle finit TOUJOURS par dépasser un plancher
fixe, quel que soit à quel point ce plancher a été abaissé — v17.65
avait repoussé ce point de bascule beaucoup plus loin (vague ~16 →
quelque part au-delà de la vague 68), pas éliminé le phénomène en
soi, ce qui n'est probablement pas possible sans plafonner la
croissance de puissance du joueur ou faire grandir la difficulté
sans limite elle aussi. Pas encore de piste vérifiée sur SI vague 68+
(25 minutes de jeu simulées) est un point que de vrais joueurs
atteignent en pratique, ni sur ce que Pierre veut faire de cette
information (repousser encore plus loin, plafonner la puissance du
joueur, accepter un "palier de fin de partie" comme objectif de
progression légitime, etc.) — remonté tel quel, décision à prendre
avec lui plutôt que d'agir unilatéralement dessus.

### v17.73 (essai, abandonné) — repousser le plancher de cadence ne marche pas

Question posée à Pierre en quiz cliquable (3 options : repousser
encore le plancher / plafonner la puissance du joueur / accepter le
palier tel quel) — il a choisi "repousser encore plus loin".

**1er essai** : plancher dur abaissé de 6 à 3 au-delà de la vague 30,
avec une décroissance douce (`×0,985/vague`) entre les deux plutôt
qu'un saut brutal. Revalidé (15 essais × 90000 frames) : effet quasi
nul, vague moyenne 68→69, dans le bruit. Cause : le sursaut aléatoire
du délai (`+Math.random()*55`, valeur moyenne 27,5) était resté fixe
— une fois le plancher déjà bas, c'est LUI qui domine le délai total,
pas le plancher ; le baisser encore ne change quasiment rien tant que
ce terme-là reste constant.

**2e essai** : le sursaut aléatoire rétrécit maintenant avec la même
décroissance que le plancher (jusqu'à un nouveau minimum de 8 au lieu
de 55). Revalidé : la vague moyenne monte cette fois nettement (69→
74-75) — la cadence est bien plus rapide, mesurablement. Mais
**toujours aucune défaite** : `reasonCounts: {maxFrames: 15}` pour
les 3 profils, 100% de survie aux repères 10/25/50/100.

**Conclusion, importante à comprendre avant de retenter quoi que ce
soit sur ce levier** : la cadence de spawn ne peut PAS, à elle seule,
restituer un vrai risque de défaite contre une puissance joueur
exponentielle et illimitée — et ce n'est pas une histoire de "pas
assez baissé", c'est structurel. Plus d'ennemis arrivent vite, plus
le joueur les tue vite, plus il gagne d'or vite, plus il monte de
palier vite : cadence de spawn et puissance du joueur se renforcent
l'un l'autre dans cette économie (l'or vient des kills), ils ne sont
pas des forces opposées. Dès qu'un palier de dégâts suffisant est
atteint (mesuré : dmgLevel ~80-90 en fin de run, dégâts par tir très
au-dessus des PV d'un ennemi à ce stade), chaque ennemi meurt en un
tir — le seul vrai plafond qui reste est la CADENCE DE TIR (cooldown
du joueur/des tours), pas les dégâts ; accélérer l'arrivée sans
jamais dépasser ce plafond de tir ne fait qu'avancer plus vite dans
les vagues, pas perdre. Repoussé deux fois, dans le bon sens à chaque
fois, sans le moindre signe de perte qui approche — pas une question
de patience ou de paramètre encore mal calé, une impasse mathéma-
tique de ce levier précis.

**Changement annulé** (`git checkout -- index.html`) plutôt que
livré : n'accomplit pas ce qui était demandé, ajoute de la complexité
pour rien. Retour exact à la formule v17.65. Les deux VRAIES options
restantes (plafonner la puissance du joueur — la seule qui touche
directement la cause, la croissance illimitée — ou accepter le
palier de fin de partie comme légitime) redemandées à Pierre avec
cette explication, avant d'agir.

## v17.74 — "les deux" : PV exponentiels + cheval de Troie automatique

Reposée en quiz cliquable ("vu que repousser le plancher de cadence
ne marche pas, on fait quoi ?"). Pierre ne s'est retrouvé dans aucune
des 3 options proposées, a choisi "Autre piste" puis, reposé plus
précisément, "Les deux" parmi : PV des ennemis qui grandissent avec
le temps (exponentiel), et un mécanisme de fin de partie séparé.

### Partie 1 — PV exponentiels des ennemis (au-delà de la vague 30)

Rappel important, PROTÉGÉ depuis v17.24 et non touché ici : l'ennemi
de BASE reste 1 coup = 1 mort pour toujours, quelle que soit la
vague — "la difficulté ne doit pas venir de PV qui grimpent sur les
ennemis de base, mais du NOMBRE d'ennemis". Seuls les types qui
montaient DÉJÀ en PV avec la vague (fast_frail/fast_tough/boss) sont
concernés.

Jusqu'ici : `BASE_ENEMY_HP + WAVE_HP_STEP*(vague-1)`, une droite pour
toujours (choix explicite v17.23 : "toujours une croissance
LINÉAIRE, pas exponentielle"). Contre des dégâts joueur qui, eux,
grandissent en exponentielle illimitée (`UPGRADE_POWER_GROWTH`,
palier "dégâts"), le rapport dégâts/PV finit TOUJOURS par diverger
vers l'infini — c'est très exactement ce qui rend chaque ennemi
"mort en un tir" dès la vague ~40-50 (confirmé au simulateur).

Corrigé : jusqu'à la vague 30 (formule v17.23 inchangée, déjà bien
calée), puis un multiplicateur exponentiel prend le relais, au MÊME
taux que les dégâts du joueur — pas un autre taux choisi au hasard,
c'est le seul qui empêche le rapport de diverger indéfiniment dans un
sens ou dans l'autre. `enemyHpForWave(wave, type)` remplace les deux
calculs dupliqués qui existaient (spawn normal + soldats du cheval de
Troie) par une seule source de vérité.

### Partie 2 — cheval de Troie automatique (mécanisme de fin de partie)

Le cheval de Troie existait déjà (v17.24) : easter egg déclenché en
restant dans l'eau, laisser passer = défaite IMMÉDIATE
(`breachDamage:10`, un seul coup remplit les 10 brèches). Choix
DÉLIBÉRÉ pour cette tâche : c'est le seul mécanisme du jeu qui
échappe par construction au problème de la Partie 1 — ce n'est pas
une course aux PV (où le joueur gagne toujours dès que ses dégâts
sont assez hauts), c'est une course contre le temps (le détruire
avant qu'il n'atteigne le mur), quels que soient les dégâts du
joueur. Mais tel quel : (a) jamais déclenché par les bots du
simulateur (ils ne vont jamais dans l'eau), probablement rarement par
un vrai joueur une fois le risque connu ; (b) ses PV
(`PLAYER_DMG * 6 * (1+vague*0.02)`) étaient ancrés sur la constante
de BASE, pas les dégâts réels du joueur — donc, comme les ennemis
normaux, trivial en un coup dès quelques paliers de dégâts.

Deux correctifs, en réutilisant 100% du mécanisme/sprite existant :
- Ancré sur `effectivePlayerDmg()` (dégâts réels) au lieu de
  `PLAYER_DMG` (constante figée) — reste un vrai danger à x'importe
  quel niveau de dégâts.
- Déclenchement AUTOMATIQUE ajouté à partir de `TROJAN_AUTO_START_WAVE
  = 40`, en plus (pas à la place) du déclenchement par l'eau — même
  temps de recharge (`trojanCooldownUntilWave`, 15 vagues) que
  l'original, une seule logique de recharge à entretenir. Le
  déclenchement par l'eau, sur des vagues plus tôt, n'est pas touché.

**Calibrage des PV** (nécessaire pour rendre 40+ une vraie menace, pas
un détail à deviner à l'œil) : mesuré directement plutôt que
supposé. Sonde dédiée (joueur seul en défense minimale vs joueur +
tour + catapulte, vague 45, dmgLevel réaliste ~85) :
- Temps de trajet du cheval NON gêné jusqu'au mur : 1399 frames
  (mesuré en désactivant toute défense).
- Avec le multiplicateur d'origine (×6, celui de l'easter egg de
  base) : tué en 291 frames (tour+catapulte) — 4,8x plus vite que
  son trajet, aucun risque réel.
- ×4 : tué en 707-755 frames (tour+catapulte / joueur seul) — encore
  ~1,9x de marge, toujours aucun risque.
- ×7 : tué en 822-831 frames — la relation n'est PAS linéaire avec
  les PV (un ×1,75 sur le multiplicateur n'a donné qu'un ×1,1 sur le
  temps de mise à mort, pas ×1,75 comme attendu — signe d'un DPS qui
  n'est pas parfaitement constant pendant l'engagement, plausiblement
  lié à `playerAggroScore`). Extrapolation linéaire écartée, mesure
  directe à chaque palier à la place.
- ×20 : tué en 1369 frames côté joueur seul (sans tour) — juste sous
  le temps de trajet (1399), marge de ~2% seulement pour la défense
  la plus faible. Retenu comme valeur finale
  (`TROJAN_LATE_HP_MULT = 20`).

**Revalidé au simulateur complet** (15 essais × 90000 frames × 3
profils) — résultat net, avec une vraie différenciation par niveau de
jeu (objectif retrouvé) :
- `naive` (aucune tour construite) : **100% de défaites** (15/15,
  toutes par brèche), vague moyenne 41 — meurt systématiquement au
  premier passage du cheval automatique (vague 40).
- `correct` (une tour, joueur au point fixe) : 14/15 survivent (vague
  moyenne 67), **1/15 meurt** par brèche.
- `good` (tour + catapulte) : 13/15 survivent (vague moyenne 66,5),
  **2/15 meurent** par brèche.

Un vrai risque est de retour, à un niveau qui distingue nettement
"ne construit rien" (perd toujours) de "construit une vraie défense"
(survit la plupart du temps, mais pas garanti) — sans avoir touché
la difficulté des vagues normales (1-29 inchangées dans les deux
parties, le reste de la partie continue de se jouer comme avant
jusqu'à la vague 40).

## v17.75 — cheval de Troie redessiné depuis la référence

Pierre, juste après la v17.74 : "remontre-moi le dessin du cheval de
Troie, parce que j'ai un doute là". Rendu isolé et agrandi : il avait
raison, ça ne ressemblait pas à un cheval — quelques traits épars sur
une tache noire. Sa réponse : "c'est bien ce que j'imaginais... avec
les nouveaux outils qu'on a mis en place, il faut que tu le
redessines par rapport à la référence que je t'avais donnée".

**Pourquoi c'était faux** : `drawTrojanHorseShape` (v17.42) avait des
coordonnées tapées à la main — 14 points aux valeurs rondes (0, 15,
3, -5, 9,5, 20, 30, 40…), 7 polylignes — visiblement estimées à
l'œil. Ça passait à peu près à ~20px de large, mais le dessin réel de
`references/cheval-de-troie.png` a bien plus de structure. Or ce
croquis est sur GRILLE AIMANTÉE, comme le mur et la tour neige : il
n'y avait aucune raison d'approximer (cf. tools/README.md, "zéro
approximation"). C'est exactement le cas de figure que l'outillage
existant est fait pour traiter — il n'avait juste jamais été
repassé sur ce dessin-là.

**Méthode** (nouveau script versionné `tools/gen_trojan_horse.py`) :
1. Recadrage de l'image pour enlever l'interface de l'appli de dessin
   (barre d'état, icônes, boutons PNG/SVG) — sinon Hough prend les
   icônes pour des traits.
2. `extract_hough.py` tel quel : grille isométrique 30° retrouvée par
   moindres carrés sur tous les points, segments par transformée de
   Hough, extrémités recalées sur les nœuds, auto-contrôle contre
   l'image d'origine. Résultat : **43 arêtes gardées, 7 rejetées**
   (couverture 0,10-0,22 : des inventions entre sommets, correctement
   écartées) et surtout **complétude 100%** — aucun trait du croquis
   manqué.
3. **Dédoublonnage (43 -> 29)** : Hough renvoie souvent une ligne
   entière ET ses moitiés. Sur une image opaque ça ne se verrait pas,
   mais le trait du jeu est semi-transparent (PHOSPHOR_GREEN, alpha
   0,92) — deux traits superposés rendent donc plus lumineux que les
   autres. Ne garde que les segments maximaux.
4. Reprojection (i,j) -> 2:1 dimétrique du jeu (A=7,5 / B=A/2), même
   convention que `gen_snow_tower.py` et `gen_wall_tiles.py`.
5. Normalisation : centré en x, pieds à y=0 — le cheval se pose donc
   SUR le point passé, comme `drawEnemyShape` pour les autres ennemis
   (l'ancienne version ancrait sur la pointe de l'oreille, ce qui le
   décalait).
6. Silhouette pleine par la méthode "corde tendue" validée (buffer +
   union shapely, 2 morceaux). Indispensable ici : `polygonize` seul
   ne trouve que 2 faces fermées, les pattes étant des traits ouverts.

**Taille** : le paramètre de `drawTrojanHorseShape` devient une
DEMI-largeur (comme le `hw` de `drawEnemyShape`) au lieu d'une
envergure totale, et l'appel passe `rr*1.3`. Purement visuel — la
collision garde `rr` (`enemyRadius`, 18, inchangé). Justification
mesurée : rendu comparé à `rr` tout juste (36px de large) et à
`rr*1.3`, le premier retasse le dessin au point de redevenir
difficile à lire, c'est-à-dire le défaut même qu'on corrige. Et
depuis la v17.74 le cheval arrive tout seul en fin de partie : c'est
la menace la plus grave du jeu (défaite immédiate), elle doit se
repérer au premier coup d'œil.

Vérifié : `node --check` ; rendu en jeu à 3 tailles au-dessus d'une
grille de points (la silhouette masque bien le fond, aucune erreur
console) ; comparaison côte à côte croquis / rendu envoyée à Pierre —
tête, oreille, museau, encolure, patte avant, dos en zigzag, pattes
arrière et queue correspondent un pour un (le rendu est simplement
plus trapu, effet attendu de la reprojection 2:1 partagée par tous
les éléments du jeu).

## v17.76 — audit des dessins + formes d'ennemis réextraites

Suite directe du cheval de Troie (v17.75) : si CE dessin-là était encore
approximé alors qu'on avait la référence ET l'outil, d'autres pouvaient
l'être. Audit de toutes les fonctions de dessin adossées à une
référence :

- `drawBoatHullPhosphor`, `drawForge`, `drawCaravanCart` : données
  extraites (74/88, 67/108 et 132/177 lignes de coordonnées à 2
  décimales). Conformes, rien à faire.
- `drawWallWhole` (v17.69), tour neige (v17.60) : déjà extraits.
- Tour classique (`drawIsoBox`) : procédurale, mais `references/tour.jpg`
  EST une boîte isométrique paramétrique (prisme + petit cube dessus +
  porte). Procédural est ici le bon choix, pas une approximation.
- Catapulte, palissade forêt : aucun croquis fourni, dessins d'origine
  assumés.
- **`drawEnemyShape` : le dernier à être encore entièrement procédural**
  alors qu'une référence existe. Corrigé ici.

### Ce que contient vraiment `ennemis-complexite.png`

Extraction (133 arêtes gardées / 5 rejetées, complétude 100%) puis
séparation en composantes connexes : **5 cubes**, soit **4 motifs
distincts** — cube nu (dessiné 3 fois, à 3 tailles), cube + UNE
diagonale sur la face du dessus, cube + les DEUX (croix), et le
treillis dense (50 arêtes maximales).

La lecture faite en v17.42 (4 paliers = nu / une diagonale / croix /
treillis) était donc **juste**. Seul le TREILLIS était faux : le code le
fabriquait en subdivisant chaque face en grille régulière 3x3, alors que
le croquis montre un motif précis en éventails de diagonales, qu'aucune
formule ne retrouve.

### Erreur commise en chemin (à retenir)

J'ai d'abord annoncé à Pierre que le cube à croix était **inventé** et
que sa référence ne contenait que 3 motifs. C'était faux. Cause : le
cube à croix a 10 arêtes, exactement comme celui à une seule diagonale
— pas 11 comme on l'attendrait. Sa diagonale N-S est alignée au pixel
près avec l'arête verticale interne du cube (centre -> sommet bas) :
Hough fusionne les deux en un seul long trait sommet HAUT -> sommet BAS,
qui ABSORBE l'arête interne au lieu de s'y ajouter. Compter les arêtes
ne distingue donc pas les deux cubes, et diffé­rencier "par rapport au
cube nu" échoue aussi (2 différences au lieu d'1). Il faut tester la
présence de ce long trait vertical — c'est ce que fait le générateur,
avec le piège documenté dedans. **Leçon : sur ces croquis, deux traits
colinéaires se fondent en un seul ; ne jamais conclure d'un simple
comptage d'arêtes sans rendu visuel de contrôle.**

### Épaisseur du trait

Le treillis est bien plus dense que les autres motifs : à 1.1 comme eux,
il se bouche à la taille réelle du boss (~19px) et devient une tache.
Premier test trompeur de ma part (rendu à 1 pixel par point) : j'en ai
conclu que le motif était irrécupérable à cette taille. Pierre : "doit
juste affiner les traits non ?" — il avait raison. Rendu à 3x, les
vraies conditions d'un téléphone, le motif se lit très bien dès qu'on
affine. Comparatif 1.1 / 0.8 / 0.6 / 0.45 soumis à Pierre, qui a choisi
**0.45** (`ENEMY_LATTICE_LINE_W`). Les 3 autres paliers gardent 1.1.

Normalisation des motifs : largeur 2 (x de -1 à 1), sommet bas à y=0 —
multiplier par `hw` redonne exactement la géométrie d'avant (même
largeur, même point d'appui), le cube reprenant au passage la proportion
isométrique exacte du croquis (sommet haut à -2*hw au lieu de -1.95).

Vérifié : `node --check` ; données livrées identiques à la sortie du
script ; rendu à 3x des 4 paliers, à la taille réelle du jeu et en x4,
aucune erreur console — l'escalade se lit clairement et le treillis du
boss reste lisible à taille réelle.

## v17.77 — recalage sur des parties de 2-5 min (et ce que ça révèle)

Pierre, interrogé en quiz sur le but et l'ambiance du jeu : **vitrine
technique ET vrai jeu à publier**, ambiance **froide et technique**
(oscilloscope / terminal), partie de **2-5 minutes**, plaisir dans la
**maîtrise d'une partie** (chaque partie repart de zéro).

### Le décalage que ça met au jour

Mesuré au simulateur : 2 min ≈ vague 11, 5 min ≈ vague 19. Or les
seuils de contenu étaient : rapide/costaud vague 14, bouclier vague 20,
PV exponentiels vague 30, cheval automatique vague 40, plateau
"personne ne perd" vague 68.

Autrement dit **la majorité du contenu était hors d'atteinte**, et tout
l'équilibrage de difficulté fait en v17.73/74 visait un horizon que le
joueur n'atteint jamais. Erreur de méthode de ma part : j'ai passé une
session entière à simuler 90000 frames sans jamais demander combien de
temps une partie était censée durer. **À retenir : demander la durée de
session AVANT d'équilibrer quoi que ce soit.**

### Compression (option choisie : tout faire tenir dans ~20 vagues)

Vagues 1 à 9 **non touchées** : tutoriel dicté par Pierre + ruée du
nombre, déjà calés, et la règle Bloons TD 5 validée ("une seule variable
qui monte à la fois") reste respectée — les introductions restent
espacées de 3 vagues et ne se superposent jamais à la ruée.

    9  rapide/fragile      12  rapide/costaud     15  bouclier
    17 PV exponentiels     19  cheval de Troie automatique (climax)

Fenêtres de montée des types : 15-20 vagues -> 4 (sur une partie de 20
vagues, un type qui met 20 vagues à monter n'existe pas). Recharge du
cheval : 15 -> 6 vagues.

### Recalibrage du cheval de Troie

Ses PV (`TROJAN_LATE_HP_MULT`) avaient été fixés à 20 en v17.74, mais
sur deux hypothèses devenues fausses : une arrivée vague 45, et un bot
tirant à 20 coups/seconde (le plancher anti-spam du jeu), soit ~5x le
rythme d'un vrai joueur. Rebalayé à cadence humaine réaliste
(`--manualIntervalMs=250`), 10 parties par valeur :

| mult | naïf | correct | bon |
|---|---|---|---|
| 3 | 26,8 (survit 1 fois sur 2) | 25,9 | 30,9 |
| **5** | **19,6** | **19,0** | **31,0** |
| 8 | 19,0 | 19,0 | 27,4 |

Retenu : **5**. Dégradé net — qui n'a pas bâti de vraie défense tombe au
cheval vague 19 (~5 min, la cible), qui a tour + catapulte passe le mur
et continue. À 3 le cheval ne fait plus peur, à 8 il tue aussi le joueur
correct sans lui laisser sa chance.

Réserve honnête : le profil "bon" atteint encore la vague 31 (~11 min)
sans mourir. Pour un jeu de maîtrise c'est défendable (le bon joueur est
récompensé), mais ça dépasse la fenêtre 2-5 min — à trancher avec Pierre
s'il veut aussi plafonner les bons joueurs.

### Emojis retirés

Ambiance "froide et technique" tranchée : les 8 pastilles emoji des
boutons, l'emoji or du bandeau et ceux des menus/dialogues
(musique, bruitages, pub, code bonus, alerte) sont remplacés par du
texte. Gardés volontairement : ☰ ▶ ✓ ⚒, qui sont des symboles
typographiques et non des emojis colorés. Le libellé or du bandeau est
passé par le système de traduction (GOLD / OR) — il avait d'abord été
écrit en dur en français, visible en anglais.

## v17.78 — le jeu borné à une largeur de tablette portrait

Pierre : *"pour les ordinateurs on va les générer juste avec le plus grand, en
supposant que c'est le plus grand écran qui existe quand téléphone ou bien une
tablette en format portrait... on abandonne le fait que ça prenne tout l'écran,
on va réduire sur les deux bords, il y aura du noir."*

Décision de conception, pas un correctif : plutôt que de repenser toute la mise
en page (pensée pour du portrait) pour les écrans larges, on borne le jeu à
`--max-w: 820px` (iPad Air en portrait, la plus grande tablette portrait
courante) et on centre. Au-delà, bandes noires.

Points à ne pas oublier si on y retouche :

- `--gutter: max(0px, (100vw - var(--max-w)) / 2)` existe pour les éléments
  ancrés à un bord (`#menu-panel`, `#faq-panel` à gauche, `#version-panel` à
  droite). Sans ça ils flottaient contre le bord de l'écran, détachés de la
  colonne de jeu. Mesuré : colonne 310..1130 sur 1440px, panneaux à 320 et
  1120. Correct.
- `#scanlines` est confiné à la colonne (`left/right: var(--gutter)`) : sinon
  la trame CRT recouvrait aussi les bandes noires, ce qui n'a aucun sens.
- `html,body` passe en `#020a04` : c'est ça, la couleur des bandes.
- Conséquence sur le mur : la largeur de jeu ne peut plus dépasser
  820/330 ≈ 2.49, donc `WALL_MAX_SCALE_Y` passe de 2.35 à 2.6 — un plafond
  qui n'est désormais JAMAIS atteint. Le mur garde ses proportions exactes
  partout, ce que Pierre demandait à l'origine.

Vérifié : 1440x900 → colonne centrée 820px ; 420x900 dsf 3 → inchangé, le mur
touche encore les deux bords. Seule erreur console : `fonts.googleapis.com`
bloqué par le proxy du bac à sable, sans rapport.
