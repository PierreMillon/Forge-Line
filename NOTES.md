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
