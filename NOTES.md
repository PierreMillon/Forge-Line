# Forge Line — notes de conception

Journal des décisions et des idées, dans l'ordre où elles arrivent.
**Règle : on met à jour, on ne supprime jamais.** Une idée faite reste
tracée (marquée faite) ; une idée mise de côté reste tracée (marquée
« plus tard ») ; rien ne doit se perdre au fil de la discussion.

Format condensé — l'idée, pas la formulation exacte.

## 🚧 En cours

- **Progression des types d'ennemis par vague, à revoir.** Aujourd'hui
  (v17.9) : type 2/3 tirés au hasard dès le début (~15%/15%/70%), boss
  toutes les 5 vagues. Demandé à la place : une introduction progressive
  et lisible — commencer très simple, puis introduire un type à la fois
  (exemple donné en réfléchissant à voix haute, pas une règle figée :
  peut-être le type 2 dès la vague 5, le type 3 vers la vague 10 avec
  "deux modèles 2 et un modèle 3"), et le boss ("le gros") repoussé
  beaucoup plus loin — vers la vague 200 plutôt que toutes les 5 vagues,
  très rare en début de partie. Pas encore clarifié en détail (quiz
  envoyé), pas codé.

## 📋 À faire (demandé, pas encore fait)

- **Le bateau prend en compte la mémoire des ennemis pour choisir où
  accoster** (aujourd'hui : position aléatoire, indépendante des colonnes
  qui réussissent le mieux). Et surtout : les ennemis de la vague doivent
  être visibles SUR le bateau pendant qu'il glisse/accoste, physiquement
  groupés dessus, plutôt que d'apparaître seulement une fois qu'il a
  touché la plage — pour qu'on les voie vraiment "arriver en groupe".
  Demandé, pas encore fait (nécessite de repenser le lien entre
  spawnBoat/spawnEnemy et l'affichage du bateau).

- **Collision souple entre ennemis (une fois débarqués du bateau)** : ils
  ne doivent plus se chevaucher — cercles adjacents, bords qui se touchent
  sans se traverser — mais avec une petite élasticité/souplesse (ils
  peuvent un peu s'enfoncer les uns dans les autres, pas une paroi rigide).
  Pendant qu'ils sont encore sur le bateau, le chevauchement reste permis
  (lié à l'idée ci-dessus). Demandé, pas encore fait.

## 💭 Idées à explorer plus tard (pas encore décidées)

- ~~**Bateau en vraie perspective isométrique**~~ → fait en v17.12
  (drawIsoBox, comme les tours, au lieu du sprite PNG à plat).

- **Plusieurs cartes** pour la suite (variété au-delà de la plage
  actuelle). Pas encore décidé à quoi elles ressemblent.

- ~~**Décor sur la grille isométrique** : une route qui part du bas du
  château~~ → fait en v17.12 (chemin décoratif qui part du bord du
  château et sort de l'écran, suit les diagonales de la grille iso —
  purement visuel, sans virages vers une "ville" précise pour l'instant).

- **Easter egg : le cheval de Troie.** Un "cheval de Troie" (à préciser
  visuellement) sort du bateau et attaque — si on le laisse passer,
  défaite immédiate ; si on le détruit, des soldats en descendent (détail
  à définir). Déclencheur pas encore choisi — piste évoquée : si le
  joueur reste trop longtemps dans l'eau, un message d'avertissement
  apparaît ("attention à ne pas rester trop dans l'eau, vous risquez de
  fâcher les dieux") avant que ça se déclenche. Idée brute, à retravailler.

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
