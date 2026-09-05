# Forge Line — notes de conception

Journal des décisions et des idées, dans l'ordre où elles arrivent.
**Règle : on met à jour, on ne supprime jamais.** Une idée faite reste
tracée (marquée faite) ; une idée mise de côté reste tracée (marquée
« plus tard ») ; rien ne doit se perdre au fil de la discussion.

Format condensé — l'idée, pas la formulation exacte.

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
- **Dégâts au château selon la taille/le type d'ennemi** : toujours pas
  fait — reste en discussion (voir plus bas, propositions à faire).

### Indicateur "quelle tour va être renforcée" → fait en v17.16

Halo doré pulsé autour de la tour actuellement à portée d'upgrade
(même logique que `pickNearestTower` + `CONTACT_RANGE_PX` déjà utilisée
pour le bouton du bandeau).

### Bug signalé (vague 51, en spectateur) → diagnostiqué et corrigé en v17.16

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

**Diagnostic confirmé par simulation Playwright** : ce n'était PAS un
vrai gel du mouvement, mais un siège réel devenu bien trop lent pour se
voir à l'œil nu. Cause : v17.13 a rendu la progression des tours
infinie et TOUJOURS plus rentable en renfort — ce qui encourage
justement à tout miser sur une seule "super-tour". Si le joueur a fait
ça sur ~50 vagues, cette tour peut atteindre des dizaines de milliers de
PV. Trois attackers ne lui infligent que ~0,6 PV/frame à eux trois
(36 PV/s) : simulation confirmée, une tour à 13 462 PV encaisse
réellement des dégâts (11 627 PV après 50s simulées) mais mettrait
plus de 6 minutes à tomber — invisible à l'observation normale, d'où
l'impression de blocage total. Le siège était réel, juste trop lent.

**Correctif** : `SIEGE_GIVEUP_MS` (8 secondes) — un attacker qui reste
immobile au contact de la même tour sans être parvenu à la détruire
abandonne définitivement cette cible après ce délai et repart en ligne
droite vers le château (comme un rusher, via `driftTowardPreferred`),
quel que soit le niveau de la tour visée. Garantit que la vague peut
toujours se terminer, peu importe à quel point une tour a été
renforcée. Vérifié par simulation : après ~8s de siège sans succès, les
ennemis marqués `siegeGaveUp` recommencent à avancer normalement vers
le bas de l'écran.

### Combat : 3 boutons séparés au lieu de 2

Actuellement 2 boutons liés au combat (Dégâts = puissance, Tir auto =
cadence). Demandé : les séparer clairement en 3 dimensions, chacune son
bouton, en progression infinie comme les autres :
- **Puissance** (dégâts par tir) — déjà là (bouton Dégâts).
- **Cadence** (vitesse de tir) — déjà là en pratique (bouton Tir auto,
  qui fait aussi office de déblocage du tir auto) — à re-décrire comme
  "Cadence" plutôt que "Tir auto" ?
- **Précision** (nouveau) : chaque palier augmente la précision de ~10%
  par rapport au fait qu'on "tire un peu n'importe comment", sans
  jamais atteindre 100% (asymptote). Vient s'ajouter au système de
  précision par distance déjà existant (hitChanceForDistance), pas le
  remplacer.
Implique de revoir le bandeau de bonus (actuellement 4 boutons pile) —
comment caser un 5e ? à voir (bandeau scrollable ? bouton repensé ?).

### Indicateur visuel "quelle tour va être renforcée"

Quand on s'approche d'une tour à portée d'upgrade, elle doit afficher un
petit halo/anneau doré tout autour — pour qu'on puisse se positionner
précisément sur celle qu'on veut renforcer quand plusieurs sont proches.

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

- **Effet de particules d'ambiance** : petites particules de 3 tailles
  (1px, 4px, 9px) qui dérivent en diagonale suivant les lignes
  isométriques (haut-gauche vers bas-droite), juste décoratif.

- **Mort d'un ennemi → croix qui monte au ciel** : à la mort, remplacer
  l'ennemi par une petite croix qui s'élève rapidement puis disparaît
  (au lieu de disparaître instantanément).

- **Nuage de fumée noire à la mort** : juste avant la disparition, un
  petit nuage/fumée apparaît, se dissipe rapidement, et la croix en sort.

- **Effet de morale/contagion à la mort** : les ennemis proches d'un
  camarade qui meurt perdent un peu de vie ("touchés par la fumée de la
  mort"). Doit nourrir l'IA à mémoire existante : les ennemis
  pourraient apprendre qu'attaquer en groupe compact est risqué, qu'il
  vaut mieux un éclaireur isolé pendant que le groupe reste à distance,
  ou qu'un ennemi affaibli devrait s'éloigner du groupe par "empathie"
  pour ne pas les blesser en mourant près d'eux.

- **Ennemis affaiblis qui fuient vers le bateau** : un ennemi très
  affaibli peut fuir hors-écran (gauche/droite) ou tenter de retourner
  au bateau. Au bateau, il peut se soigner UNE SEULE FOIS dans sa vie
  (pas plus), récupérant la moitié de sa vie manquante (pas tout) —
  ex : à 25% de vie (75% manquant), il regagne la moitié de 75% = 37,5%,
  se retrouve à 62,5%. Une deuxième visite au bateau plus tard dans sa
  vie ne fait plus rien.

- **Cimetière quand une tour est détruite** : l'emplacement affiche une
  croix/pierre tombale et devient inconstructible tant qu'elle est là.
  Se retire automatiquement à la fin de la vague OU si le joueur se
  place dessus et reste 1-2 secondes (une bulle avec une petite croix
  s'affiche au-dessus de sa tête, façon prière) — thème : il y avait des
  gens dans la tour, ils sont morts, il faut prier pour qu'ils partent
  avant de reconstruire dessus (sinon manque de respect).

- **Easter egg des marchands** (idée développée en détail, LA plus
  grosse — demande explicitement des questions de ma part avant de
  concevoir) :
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
    rendre "vraiment beaux" (forts). Toujours moins forts que le joueur
    en principe, mais l'utilisateur n'est pas fermé à l'idée qu'ils
    puissent un jour devenir plus forts que lui — pas tranché.
  - Effet recherché : sentiment de compagnie, des alliés qui se
    battent avec nous, qui "expérimentent" et développent mémoire et
    apprentissage comme les ennemis. Explicitement demandé : lui poser
    des questions en quiz là-dessus avant de concevoir — pas encore
    fait à l'heure de cette note.

- **Mécanique de la Forge** (nom du jeu = Forge Line, le mot "forge" pas
  encore exploité littéralement) : une zone délimitée en bas à droite du
  château. Si on y reste et qu'on y dépense de l'or (ex. 100 or), ça crée
  "une forge" ; en y retournant, on peut acheter de nouveaux boutons de
  compétence (ex : tours plus fortes), chaque bouton ayant sa propre
  "vie"/progression. Question ouverte posée par l'utilisateur lui-même,
  pas encore tranchée : est-ce que TOUT le système de progression
  (dégâts, or passif, tours...) devrait finalement passer par cette
  forge plutôt que par le bandeau de bonus actuel ? Ou est-ce un système
  parallèle/additionnel ? À clarifier en quiz avant de concevoir.

Pas encore trié ni implémenté au moment de cette note, sauf les points
listés "petites, claires" qui seront attaqués dans la foulée.

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
