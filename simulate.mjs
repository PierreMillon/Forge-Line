#!/usr/bin/env node
// Simulateur rapide de parties Forge Line, pour ajuster la difficulté
// sans dépenser des dizaines de milliers de tokens à tester à la main
// vague par vague. Un seul navigateur headless, une seule page chargée —
// TOUS les essais tournent en boucle synchrone À L'INTÉRIEUR de la page
// (aucune attente réelle, aucune capture d'écran, aucun rendu observé) :
// des centaines de parties simulées en quelques secondes, un seul petit
// résumé JSON renvoyé au bout.
//
// Usage :
//   node simulate.mjs [--trials=30] [--maxFrames=60000] [--url=http://localhost:PORT/index.html]
//
// Nécessite un serveur local sur le fichier (ex: python3 -m http.server)
// et Playwright installé globalement (voir NOTES.md pour le NODE_PATH).
//
// Trois profils de joueur (plans détaillés à côté du code, bloc v18.12) :
//   - 'naive'   : bâtit dès qu'il peut, sinon renforce une tour au hasard
//                 une fois sur deux, ignore la Forge
//   - 'correct' : 3 tours, puis toujours le renfort le moins cher, ignore
//                 la Forge
//   - 'good'    : 2 tours au niveau 3, puis la Forge, puis l'achat le
//                 moins cher (tour jusqu'à 4, catapulte, renfort, bandeau)
// Aucun bot ne bouge (il se téléporte pour bâtir : on simule la décision,
// pas la marche), aucun ne relève après une mort — la partie s'arrête au
// premier échec, ce qui donne directement "à quel niveau ça casse".
//
import { argVal, openGamePage } from './harness.mjs';

const TRIALS = parseInt(argVal('trials', '30'), 10);
const MAX_FRAMES = parseInt(argVal('maxFrames', '60000'), 10); // ~1000s de jeu simulé, garde-fou
const URL = argVal('url', 'http://localhost:8930/index.html');
const MAX_WAVE_TRACK = parseInt(argVal('maxWaveTrack', '100'), 10); // "vagues infinies : mesure sur les 100 premières" (consigne)

const { browser, page, pageErrors } = await openGamePage(URL); // v18.14 : harnais commun (voir harness.mjs)

const result = await page.evaluate(({ trials, maxFrames, maxWaveTrack }) => {
  // (son coupé et rAF neutralisé par harness.mjs — voir v17.72 dans NOTES.md pour la fuite mémoire audio)

  function runOne(policy){
    resetGame(STARTING_GOLD); // v18.01 : même or de départ que le vrai jeu (sans tir, c'est la seule ressource avant la première tour)
    player.x = STAGE_W/2;
    player.y = REGEN_ZONE.y - 30;
    let builtTower = false;
    // v17.68 (anomalie repérée en v17.65 : "good" perdait plus tôt que
    // "naive" — retrouvé en creusant : les 2e/3e tours de "good"
    // étaient plantées à ±90px du point de passage réel des ennemis
    // [le funnel les concentre sur une largeur de ~45px autour de
    // gateX, voir WALL_GATE_HALF_W dans index.html], donc quasi
    // inutiles, ET le même total d'or dilué sur 3 tours niveau bas
    // grimpe moins haut qu'une seule tour poussée à fond (le coût de
    // renfort ne grandit que 2,7%/palier quand la puissance grandit
    // 5%/palier — mieux vaut TOUJOURS finir de pousser une tour que
    // d'en commencer une autre, dans cette économie). Corrigé : "good"
    // reste concentré AU MÊME ENDROIT (la porte, comme "correct") mais
    // diversifie le TYPE d'arme plutôt que la position — tour à
    // flèches PUIS catapulte, toutes deux au même point — un choix qui
    // a un vrai sens dans ce jeu (dégât de zone contre le flux funnelé
    // par la porte), pas une dispersion qui affaiblit chaque position.
    let goodBuiltCatapult = false;
    const start = performance.now();
    let frame = 0, endWave = 1, reason = 'maxFrames';
    let waveAtFrame0 = wave;
    let maxWaveReached = wave;
    let forgeFrame = -1, firstTowerFrame = -1, maxTowers = 0, maxTowerLevel = 0; // v17.93 : instrumentation (prérequis Forge) ; v18.09 : niveau de renfort max

    for (; frame < maxFrames; frame++){
      const now = start + frame*16.67;
      update(now);
      if (wave > maxWaveReached) maxWaveReached = wave;
      if (forgeBuilt && forgeFrame < 0) forgeFrame = frame;
      if (towers.length > maxTowers) maxTowers = towers.length;
      for (const t of towers) if ((t.level||1) > maxTowerLevel) maxTowerLevel = t.level||1;
      if (towers.length && firstTowerFrame < 0) firstTowerFrame = frame;

      // v17.86 : prérequis Forge (index.html) — sans elle, aucune tour ni
      // amélioration. Tous les bots vont donc la bâtir dès FORGE_BUILD_COST (en se
      // téléportant dans sa zone : on simule la décision, pas la marche),
      // puis reviennent devant la porte.
      // v18.14 (revue de code) : ce bloc tournait à chaque frame, avant le
      // tick de décision, et bâtissait la Forge dès 50 or même avec 2
      // tours — court-circuitant le plan "3 tours au niveau 3 PUIS la
      // Forge" (et à l'entrée de la carte 2, avant la moindre tour).
      // v18.14 bis : 2 tours (pas 3) — mesuré : la 3e tour (34 or) affamait le bot, deux tours au niveau 1 à la vague 8, jamais de Forge
      const goodReadyForForge = towers.filter(t => t.kind !== 'catapult').length >= 2 && towers.every(t => (t.level||1) >= 3);
      if (!forgeBuilt && policy === 'good' && goodReadyForForge){ // v18.12 : seul le bot bon connaît la Forge
        if (gold >= FORGE_BUILD_COST){
          __H.teleport(FORGE_ZONE.x + FORGE_ZONE.w/2, FORGE_ZONE.y + FORGE_ZONE.h/2, () => tryBuildForge());
        }
      }
      // (v17.93 : `if` autonome, plus de `else` — un `else if` ici coupait
      // le TIR de tous les profils tant que la Forge n'était pas bâtie :
      // 0 kill, 0 or, jamais 100 or, brèche à la vague 4 pour tout le
      // monde. Mesuré avant correction, faux résultat de simulateur.)
      // (plans des bots : bloc v18.12 ci-dessous ; les bots se téléportent
      // sur une case libre devant la porte pour BÂTIR, à côté d'une tour
      // pour la RENFORCER — on simule les décisions, pas la marche)
      if (frame % 30 === 0){ // v18.06 : bâtir ne demande plus la Forge ; seuls les achats d'amélioration (ci-dessous) la demandent
        const W = wallScreen();
        const spots = [0, -48, 48, -96, 96, -144, 144].map(dx => ({ x: W.gateX + dx, y: playerSpawnY() - 30 }));
        const teleport = (x, y, fn) => __H.teleport(x, y, fn); // v18.14 : harness.mjs
        const freeSpot = () => spots.find(sp => !towers.some(t => Math.hypot(t.x - sp.x, t.y - (sp.y - 24)) < 30));
        const build = (kind) => { const sp = freeSpot(); if (!sp) return false; const n = towers.length; teleport(sp.x, sp.y, () => kind === 'catapult' ? tryCatapultAction() : tryTowerAction()); return towers.length > n; };
        const upgrade = (t) => teleport(t.x, t.y + 22, () => t.kind === 'catapult' ? tryCatapultAction() : tryTowerAction());
        const cheapestUpgrade = () => towers.slice().sort((a, b) => towerUpgradeCost(a) - towerUpgradeCost(b))[0];
        const nTowers = towers.filter(t => t.kind !== 'catapult').length, nCat = towers.filter(t => t.kind === 'catapult').length;
        // v18.12 (Pierre, en quiz : "Bots qui renforcent vraiment") — mesuré
        // en v18.11 : maxTowerLevel = 1 pour les trois bots, aucun ne
        // renforçait jamais (naive par design, correct et good parce qu'ils
        // économisaient pour la Forge et n'y arrivaient pas). Le levier
        // "renfort +12 %" (v18.09) n'était donc mesuré par personne.
        //  - naive   : bâtit dès qu'il peut (jusqu'à 7 tours) ; sinon, une
        //              fois sur deux, renforce une tour AU HASARD ; jamais
        //              de Forge (il ne sait pas qu'elle existe)
        //  - correct : 3 tours, puis renforce toujours la tour la moins
        //              chère à renforcer ; jamais de Forge
        //  - good    : 2 tours, chacune renforcée au niveau 3, PUIS
        //              économise la Forge, puis l'achat le moins cher parmi
        //              tour (jusqu'à 4) / catapulte / renfort / dégâts / cadence / revenu
        const randomTower = () => towers[Math.floor(Math.random() * towers.length)];
        if (policy === 'naive'){
          if (gold >= buildCost('tower') && nTowers < 7) build('tower');
          else if (frame % 60 === 0 && towers.length && Math.random() < 0.5){
            const t = randomTower();
            if (gold >= towerUpgradeCost(t)) upgrade(t);
          }
        } else if (policy === 'correct'){
          if (nTowers < 3){ if (gold >= buildCost('tower')) build('tower'); }
          else {
            const t = cheapestUpgrade();
            if (gold >= towerUpgradeCost(t)) upgrade(t);
          }
        } else if (policy === 'good'){
          const weakest = towers.length ? towers.slice().sort((a, b) => (a.level||1) - (b.level||1))[0] : null;
          if (nTowers < 2){ if (gold >= buildCost('tower')) build('tower'); } // v18.14 : 2 tours (voir goodReadyForForge)
          else if (weakest && (weakest.level||1) < 3){ if (gold >= towerUpgradeCost(weakest)) upgrade(weakest); }
          else if (!forgeBuilt){ /* économise la Forge (bâtie par le bloc au-dessus dès FORGE_BUILD_COST) */ }
          else {
            const t = cheapestUpgrade();
            const options = [{ cost: towerUpgradeCost(t), key: 'upgrade' }, { cost: dmgUpgradeCost(), key: 'damage' }, { cost: autoFireCost(), key: 'autofire' }, { cost: autoGoldCost(), key: 'autogold' }]
              .concat(nTowers < 4 ? [{ cost: buildCost('tower'), key: 'tower' }] : [], nCat < 1 ? [{ cost: buildCost('catapult'), key: 'catapult' }] : [])
              .sort((a, b) => a.cost - b.cost);
            const pick = options.find(o => gold >= o.cost);
            if (pick){
              if (pick.key === 'upgrade') upgrade(t);
              else if (pick.key === 'tower' || pick.key === 'catapult') build(pick.key);
              else if (pick.key === 'damage'){ gold -= dmgUpgradeCost(); dmgLevel++; }
              else if (pick.key === 'autofire'){ gold -= autoFireCost(); autoFireLevel++; }
              else { if (autoGoldLevel===0) lastAutoGoldAt = now; gold -= autoGoldCost(); autoGoldLevel++; }
            }
          }
        }
      }

      if (victory){ endWave = wave; reason = 'victory'; break; } // v18.02 : dernière carte terminée
      if (gameOver){ endWave = wave; reason = 'breach'; break; }
      if (playerHealth <= 0){ endWave = wave; reason = 'health'; break; }
    }
    if (reason === 'maxFrames') endWave = wave;
    return {
      policy, endWave, reason, frames: frame, towersBuilt: towers.length, dmgLevel, goldLeft: gold,
      forgeFrame, firstTowerFrame, maxTowers, maxTowerLevel, trojanDefeat: !!trojanCauseOfDefeat, // v17.93
      // "vagues infinies : mesure sur les 100 premières" — a atteint (ou dépassé) le repère demandé ?
      reachedWaveTrack: maxWaveReached >= maxWaveTrack,
    };
  }

  const runs = { naive: [], correct: [], good: [] };
  for (let i = 0; i < trials; i++) runs.naive.push(runOne('naive'));
  for (let i = 0; i < trials; i++) runs.correct.push(runOne('correct'));
  for (let i = 0; i < trials; i++) runs.good.push(runOne('good'));

  // v17.41 (Partie 3 — "pas de paliers de difficulté sélectionnables,
  // un seul mode" tranché par Pierre) : au lieu de viser des % de
  // victoire sur des paliers qui n'existent pas, on lit la même chose
  // sur la courbe de survie du mode continu — quelle fraction des
  // parties est encore vivante à un numéro de vague donné. Sert de
  // repère pour caler "facile" (tôt), "normal" (milieu), "difficile"/
  // "très difficile" (tard) SANS ajouter de menu de difficulté.
  const CHECKPOINTS = [10, 25, 50, 100];
  function summarize(list){
    const waves = list.map(r => r.endWave).sort((a,b) => a-b);
    const sum = waves.reduce((a,b) => a+b, 0);
    const survival = {};
    for (const cp of CHECKPOINTS) survival[cp] = +(100 * list.filter(r => r.endWave >= cp).length / list.length).toFixed(1);
    return {
      n: list.length,
      meanWave: +(sum/list.length).toFixed(2),
      medianWave: waves[Math.floor(waves.length/2)],
      minWave: waves[0],
      maxWave: waves[waves.length-1],
      stdDev: +Math.sqrt(waves.reduce((a,w) => a + (w - sum/list.length)**2, 0) / list.length).toFixed(2),
      reasonCounts: list.reduce((acc,r) => { acc[r.reason] = (acc[r.reason]||0)+1; return acc; }, {}),
      pctReachedWaveTrack: +(100 * list.filter(r => r.reachedWaveTrack).length / list.length).toFixed(1),
      survivalPctAtWave: survival, // "% encore en vie" à chaque repère (10/25/50/100)
    };
  }

  return {
    naive: summarize(runs.naive),
    correct: summarize(runs.correct),
    good: summarize(runs.good),
    naiveSample: runs.naive.slice(0, 5),
    correctSample: runs.correct.slice(0, 5),
    goodSample: runs.good.slice(0, 5),
  };
}, { trials: TRIALS, maxFrames: MAX_FRAMES, maxWaveTrack: MAX_WAVE_TRACK });

console.log(JSON.stringify(result, null, 2));
if (pageErrors.length) console.log('Erreurs JS pendant la simulation:', pageErrors);
await browser.close();
