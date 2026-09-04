# Forge Line — notes de conception

Journal des décisions et des idées, dans l'ordre où elles arrivent.
**Règle : on met à jour, on ne supprime jamais.** Une idée faite reste
tracée (marquée faite) ; une idée mise de côté reste tracée (marquée
« plus tard ») ; rien ne doit se perdre au fil de la discussion.

Format condensé — l'idée, pas la formulation exacte.

## 🚧 En cours

- (rien en cours — voir "à faire" ci-dessous)

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

- **Bateau en vraie perspective isométrique**, aligné sur la grille, pour
  renforcer l'illusion 3D — soit redessiné à partir du sprite fourni
  (boat-icon.png de Knight Wars), soit dessiné en isométrique nativement
  (façon drawIsoBox). Demandé comme un rappel, pas encore fait.

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
