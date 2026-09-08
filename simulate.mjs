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
//   - 'good'    : joueur qui joue bien — étale JUSQU'À 3 tours (se
//                 déplace entre 3 points de défense au lieu de rester
//                 figé), et investit dans l'option la moins chère parmi
//                 renfort de la tour la plus proche / dégâts / revenu
//                 auto / précision à chaque décision (capital
//                 quasiment toujours en train de travailler, pas
//                 d'or qui dort).
//
// --manualIntervalMs : intervalle entre deux tirs manuels du bot. Par
// défaut MANUAL_TAP_COOLDOWN_MS (50ms = 20 tirs/s) : c'est le plancher
// anti-spam du jeu, PAS un rythme humain réaliste — aucun joueur ne tape
// 20x/s en continu. Pour une mesure représentative d'un vrai joueur,
// passer quelque chose comme 220-300ms (≈3-4,5 tirs/s), plus proche d'un
// tap répété soutenu à la main sur mobile.
//
// Simplification assumée (déjà présente avant v17.40, conservée) : les
// bots 'naive'/'correct' ne bougent jamais du point fixe near du
// château ; 'good' se déplace, mais seulement entre 3 points fixes en
// ligne, jamais pour esquiver ou réagir à une menace précise — aucun
// des 3 bots ne relève après une mort (pas de pub/revivre simulée), la
// partie s'arrête au premier échec (10 brèches ou santé à 0), ce qui
// donne directement "à quelle vague ça casse".

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
const page = await browser.newPage();
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
  const manualInterval = manualIntervalMs != null ? manualIntervalMs : MANUAL_TAP_COOLDOWN_MS;
  const RNG_SPEND_OPTIONS = ['damage', 'autofire', 'precision', 'autogold'];

  function runOne(policy){
    resetGame(0);
    player.x = STAGE_W/2;
    player.y = REGEN_ZONE.y - 30;
    const goodSpots = [STAGE_W/2, STAGE_W/2 - 90, STAGE_W/2 + 90];
    let goodIdx = 0;
    const goodBuilt = [false, false, false];
    let builtTower = false;
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
            if (!builtTower){
              if (gold >= TOWER_BUILD_COST){ tryTowerAction(); builtTower = towers.length > 0; }
            } else {
              const near = pickNearestTower(player.x, player.y);
              const canUpgrade = near && Math.hypot(near.x-player.x, near.y-player.y) < CONTACT_RANGE_PX;
              const uCost = canUpgrade ? towerUpgradeCost(near) : Infinity;
              const dCost = dmgUpgradeCost();
              if (canUpgrade && gold >= uCost && uCost <= dCost * 3){ tryTowerAction(); }
              else if (gold >= dCost){ gold -= dCost; dmgLevel++; }
            }
          } else if (policy === 'good'){
            if (!goodBuilt[goodIdx]){
              const tx = goodSpots[goodIdx];
              if (Math.abs(player.x - tx) > 4) player.x += Math.sign(tx-player.x) * 3;
              else if (gold >= TOWER_BUILD_COST){ tryTowerAction(); goodBuilt[goodIdx] = true; }
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
              if (goodIdx < goodSpots.length-1 && gold >= TOWER_BUILD_COST*1.5) goodIdx++;
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

  function summarize(list){
    const waves = list.map(r => r.endWave).sort((a,b) => a-b);
    const sum = waves.reduce((a,b) => a+b, 0);
    return {
      n: list.length,
      meanWave: +(sum/list.length).toFixed(2),
      medianWave: waves[Math.floor(waves.length/2)],
      minWave: waves[0],
      maxWave: waves[waves.length-1],
      stdDev: +Math.sqrt(waves.reduce((a,w) => a + (w - sum/list.length)**2, 0) / list.length).toFixed(2),
      reasonCounts: list.reduce((acc,r) => { acc[r.reason] = (acc[r.reason]||0)+1; return acc; }, {}),
      pctReachedWaveTrack: +(100 * list.filter(r => r.reachedWaveTrack).length / list.length).toFixed(1),
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
