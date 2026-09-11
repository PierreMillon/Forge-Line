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
//   node simulate.mjs [--trials=30] [--maxFrames=60000] [--manualIntervalMs=50] [--url=http://localhost:PORT/index.html]
//
// Nécessite un serveur local sur le fichier (ex: python3 -m http.server)
// et Playwright installé globalement (voir NOTES.md pour le NODE_PATH).
//
// v17.40 (Partie 3, point b — consigne : "complète le simulateur avec
// 2-3 politiques de joueur") : remplace les anciennes politiques
// 'solo'/'towers' par 3 profils demandés explicitement :
//   - 'naive'   : joueur qui "fait n'importe quoi" — tire par à-coups
//                 (1 frame sur 4, façon joueur distrait/inconstant), ne
//                 construit JAMAIS de tour, dépense son or sans
//                 stratégie sur un palier au hasard parmi
//                 dégâts/cadence/précision/revenu auto dès que l'un
//                 d'eux devient abordable (pas de plan, juste ce qui
//                 tombe sous la main).
//   - 'correct' : joueur raisonnable — construit sa tour dès que
//                 possible à son point fixe, puis alterne renfort de
//                 tour / dégâts avec le surplus d'or (reprend
//                 l'ancienne politique 'towers').
//   - 'good'    : joueur qui joue bien — reste au MÊME point que
//                 'correct' (la porte, où le funnel concentre tout le
//                 flux — voir WALL_GATE_HALF_W dans index.html), mais
//                 diversifie le TYPE de défense (tour à flèches PUIS
//                 catapulte, toutes deux au même endroit) au lieu de
//                 disperser sur plusieurs positions (v17.68 : une
//                 v17.40 dispersait sur 3 points à ±90px, dont deux
//                 hors du couloir réel des ennemis — quasi inutiles —
//                 ET diluait le même or sur 3 tours basses au lieu
//                 d'une poussée à fond, moins bon dans cette économie
//                 où le coût de renfort grandit plus lentement — 2,7%/
//                 palier — que la puissance — 5%/palier ; résultat
//                 mesuré : 'good' perdait PLUS TÔT que 'naive', signal
//                 que le bot testait une mauvaise heuristique, pas que
//                 le jeu récompensait mal la défense répartie), puis
//                 investit dans l'option la moins chère parmi renfort
//                 (tour ou catapulte) / dégâts / revenu auto /
//                 précision à chaque décision.
//
// --manualIntervalMs : intervalle entre deux tirs manuels du bot. Par
// défaut MANUAL_TAP_COOLDOWN_MS (50ms = 20 tirs/s) : c'est le plancher
// anti-spam du jeu, PAS un rythme humain réaliste — aucun joueur ne tape
// 20x/s en continu. Pour une mesure représentative d'un vrai joueur,
// passer quelque chose comme 220-300ms (≈3-4,5 tirs/s), plus proche d'un
// tap répété soutenu à la main sur mobile.
//
// Simplification assumée : aucun des 3 bots ne bouge du point fixe near
// du château (v17.68 : 'good' aussi, depuis qu'il ne disperse plus sur
// plusieurs positions — voir plus haut), jamais pour esquiver ou réagir
// à une menace précise — aucun des 3 bots ne relève après une mort (pas
// de pub/revivre simulée), la partie s'arrête au premier échec (10
// brèches ou santé à 0), ce qui donne directement "à quelle vague ça
// casse".

import { chromium } from 'playwright';

function argVal(name, def){
  const m = process.argv.find(a => a.startsWith(`--${name}=`));
  return m ? m.split('=').slice(1).join('=') : def;
}

const TRIALS = parseInt(argVal('trials', '30'), 10);
const MAX_FRAMES = parseInt(argVal('maxFrames', '60000'), 10); // ~1000s de jeu simulé, garde-fou
const MANUAL_INTERVAL_MS = argVal('manualIntervalMs', null); // null = utilise le cooldown du jeu (MANUAL_TAP_COOLDOWN_MS)
const URL = argVal('url', 'http://localhost:8930/index.html');
const MAX_WAVE_TRACK = parseInt(argVal('maxWaveTrack', '100'), 10); // "vagues infinies : mesure sur les 100 premières" (consigne)

const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome' });
// v17.41 — trouvé en creusant pourquoi TOUTES les stratégies mouraient
// pareil (naive quasi = correct = good) : sans viewport précisé,
// Playwright ouvre une page de bureau (~1280px de large). Une tour
// (portée 160px) n'en couvre alors qu'un quart — la plupart des
// ennemis marchent hors de portée quoi qu'on achète, ce qui écrasait
// toute différence entre les stratégies. Un vrai joueur est sur mobile
// (Pierre : iPhone 16) — viewport resserré pour que le simulateur
// mesure la même largeur de carte qu'en vrai.
const page = await browser.newPage({ viewport: { width: 420, height: 800 } });
// La page a sa propre boucle requestAnimationFrame (temps réel, horloge
// système) qui tournerait EN PLUS de nos appels manuels à update() avec des
// timestamps synthétiques -- les deux horloges se marchent dessus et
// corrompent l'état (vagues bloquées, NaN, crash de rendu). On la neutralise
// avant que le moindre script de la page ne s'exécute.
await page.addInitScript(() => { window.requestAnimationFrame = () => 0; });
const pageErrors = [];
page.on('pageerror', e => pageErrors.push(String(e)));
await page.goto(URL);
await page.waitForTimeout(300);

const result = await page.evaluate(({ trials, maxFrames, manualIntervalMs, maxWaveTrack }) => {
  // v17.72 — fuite mémoire trouvée en relançant les tests de difficulté
  // ("relance tous les tests") : sfxShoot/sfxHit (et tous les autres
  // bruitages, playTone/playNoiseBurst dans index.html) créent un
  // nouveau OscillatorNode/AudioBufferSourceNode/GainNode par son. Sur
  // un vrai appareil, une fois joué (~25-50ms), le nœud atteint l'état
  // "finished" et devient éligible au ramassage automatique du Web
  // Audio API — mais dans CE contexte headless (--mute-audio, page
  // jamais visible, requestAnimationFrame neutralisé), l'horloge audio
  // ne semble jamais avancer : aucun nœud n'atteint jamais "finished",
  // donc AUCUN n'est jamais collecté — une vraie fuite qui grandit avec
  // le nombre de sons joués (donc avec le nombre de frames simulées).
  // Diagnostiqué par comparaison : identique sur un ancien commit (pas
  // introduit par les changements récents), confirmé par une fuite
  // linéaire mesurée même avec gc() forcé entre les essais (donc de
  // vraies références retenues, pas juste un GC qui traîne), et
  // ÉLIMINÉE À 100% en coupant sfxVolume/musicVolume avant de lancer
  // les essais (voir NOTES.md v17.72 pour le détail complet de la
  // démarche). Sans ce correctif, une session de 90000 frames tourne
  // la mémoire du renderer Chrome jusqu'à plusieurs Go et se fait tuer
  // par le limiteur mémoire du conteneur avant la fin — voilà pourquoi
  // les runs longs du simulateur ne terminaient jamais. Les bots n'ont
  // de toute façon aucun intérêt à entendre le jeu : ça ne change rien
  // à la mesure de difficulté, seulement au simulateur, jamais au jeu
  // livré aux joueurs (le son y est allumé par défaut, comme prévu).
  sfxVolume = 0; musicVolume = 0;
  const manualInterval = manualIntervalMs != null ? manualIntervalMs : MANUAL_TAP_COOLDOWN_MS;
  const RNG_SPEND_OPTIONS = ['damage', 'autofire', 'precision', 'autogold'];

  function runOne(policy){
    resetGame(0);
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

    for (; frame < maxFrames; frame++){
      const now = start + frame*16.67;
      update(now);
      if (wave > maxWaveReached) maxWaveReached = wave;

      if (policy === 'naive'){
        // "fait n'importe quoi" : tir par à-coups, jamais de tour, dépense
        // au hasard sur un palier abordable dès qu'il se présente
        if (frame % 4 === 0) playerShoot(now, manualInterval);
        if (frame % 60 === 0){
          const choice = RNG_SPEND_OPTIONS[Math.floor(Math.random()*RNG_SPEND_OPTIONS.length)];
          if (choice === 'damage' && gold >= dmgUpgradeCost()){ gold -= dmgUpgradeCost(); dmgLevel++; }
          else if (choice === 'autofire' && gold >= autoFireCost()){ gold -= autoFireCost(); autoFireLevel++; }
          else if (choice === 'precision' && gold >= precisionCost()){ gold -= precisionCost(); precisionLevel++; }
          else if (choice === 'autogold' && gold >= autoGoldCost()){ if (autoGoldLevel===0) lastAutoGoldAt = now; gold -= autoGoldCost(); autoGoldLevel++; }
        }
      } else {
        playerShoot(now, manualInterval);
        if (frame % 30 === 0){
          if (policy === 'correct'){
            // v17.42 : ancienne logique corrigée — "renforcer la tour dès
            // que ~abordable (uCost <= dCost*3)" perdait systématiquement
            // contre 'naive' au simulateur (qui distribue au hasard sur
            // dégâts/cadence/précision) : le joueur a une portée illimitée
            // (voir tryUnlockAudio/effectivePlayerDmg dans index.html),
            // une tour à portée fixe (160px) coûte cher pour ne couvrir
            // qu'une fraction de la carte. "Correct" applique maintenant
            // la même règle que "good" (l'option la moins chère d'abord
            // parmi renfort/dégâts/revenu auto/précision) mais SANS se
            // déplacer : une seule tour possible, jamais 2-3 comme "good".
            if (!builtTower){
              if (gold >= TOWER_BUILD_COST){ tryTowerAction(); builtTower = towers.length > 0; }
            } else {
              const near = pickNearestTower(player.x, player.y);
              const canUpgrade = near && Math.hypot(near.x-player.x, near.y-player.y) < CONTACT_RANGE_PX;
              const options = [];
              if (canUpgrade) options.push({ cost: towerUpgradeCost(near), key: 'upgrade' });
              options.push({ cost: dmgUpgradeCost(), key: 'damage' });
              options.push({ cost: autoGoldCost(), key: 'autogold' });
              options.push({ cost: precisionCost(), key: 'precision' });
              options.sort((a,b) => a.cost-b.cost);
              const pick = options.find(o => gold >= o.cost);
              if (pick){
                if (pick.key === 'upgrade') tryTowerAction();
                else if (pick.key === 'damage'){ gold -= dmgUpgradeCost(); dmgLevel++; }
                else if (pick.key === 'autogold'){ if (autoGoldLevel===0) lastAutoGoldAt = now; gold -= autoGoldCost(); autoGoldLevel++; }
                else if (pick.key === 'precision'){ gold -= precisionCost(); precisionLevel++; }
              }
            }
          } else if (policy === 'good'){
            if (!builtTower){
              if (gold >= TOWER_BUILD_COST){ tryTowerAction(); builtTower = towers.length > 0; }
            } else if (!goodBuiltCatapult){
              // 2e défense au MÊME point (la porte), pas ailleurs sur
              // la carte — voir la note plus haut. Sinon (pas encore
              // assez d'or), continue de pousser la tour existante avec
              // le surplus, jamais de l'or qui dort à attendre.
              if (gold >= CATAPULT_BUILD_COST) { tryCatapultAction(); goodBuiltCatapult = towers.some(t => t.kind === 'catapult'); }
              else {
                const near = pickNearestTower(player.x, player.y);
                const canUpgrade = near && Math.hypot(near.x-player.x, near.y-player.y) < CONTACT_RANGE_PX;
                if (canUpgrade && gold >= towerUpgradeCost(near)) tryTowerAction();
              }
            } else {
              const nearTower = pickNearestTowerOfKind(player.x, player.y, 'tower');
              const nearCatapult = pickNearestTowerOfKind(player.x, player.y, 'catapult');
              const canUpgradeTower = nearTower && Math.hypot(nearTower.x-player.x, nearTower.y-player.y) < CONTACT_RANGE_PX;
              const canUpgradeCatapult = nearCatapult && Math.hypot(nearCatapult.x-player.x, nearCatapult.y-player.y) < CONTACT_RANGE_PX;
              const options = [];
              if (canUpgradeTower) options.push({ cost: towerUpgradeCost(nearTower), key: 'upgradeTower' });
              if (canUpgradeCatapult) options.push({ cost: towerUpgradeCost(nearCatapult), key: 'upgradeCatapult' });
              options.push({ cost: dmgUpgradeCost(), key: 'damage' });
              options.push({ cost: autoGoldCost(), key: 'autogold' });
              options.push({ cost: precisionCost(), key: 'precision' });
              options.sort((a,b) => a.cost-b.cost);
              const pick = options.find(o => gold >= o.cost);
              if (pick){
                if (pick.key === 'upgradeTower') tryTowerAction();
                else if (pick.key === 'upgradeCatapult') tryCatapultAction();
                else if (pick.key === 'damage'){ gold -= dmgUpgradeCost(); dmgLevel++; }
                else if (pick.key === 'autogold'){ if (autoGoldLevel===0) lastAutoGoldAt = now; gold -= autoGoldCost(); autoGoldLevel++; }
                else if (pick.key === 'precision'){ gold -= precisionCost(); precisionLevel++; }
              }
            }
          }
        }
      }

      if (gameOver){ endWave = wave; reason = 'breach'; break; }
      if (playerHealth <= 0){ endWave = wave; reason = 'health'; break; }
    }
    if (reason === 'maxFrames') endWave = wave;
    return {
      policy, endWave, reason, frames: frame, towersBuilt: towers.length, dmgLevel, goldLeft: gold,
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
}, { trials: TRIALS, maxFrames: MAX_FRAMES, manualIntervalMs: MANUAL_INTERVAL_MS != null ? parseInt(MANUAL_INTERVAL_MS, 10) : null, maxWaveTrack: MAX_WAVE_TRACK });

console.log(JSON.stringify(result, null, 2));
if (pageErrors.length) console.log('Erreurs JS pendant la simulation:', pageErrors);
await browser.close();
