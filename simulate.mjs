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
// Stratégies simulées (un bot très simple, pas un joueur optimal) :
//   - 'solo'   : ne dépense jamais d'or, tire en continu depuis un point
//                fixe près du château. Vérifie que le tir seul suffit
//                en tout début de partie, et cesse de suffire ensuite.
//   - 'towers' : construit une tour dès que possible à son point fixe,
//                puis alterne renfort de tour / dégâts avec le surplus
//                d'or. Vérifie qu'investir permet d'aller nettement plus
//                loin, et que la difficulté progresse de façon lisible
//                malgré le hasard des vagues (1-3 bateaux, salves).
//
// Le bot ne bouge jamais et ne relève jamais après une mort (pas de
// pub/revivre simulée) — la partie s'arrête au premier échec (10 brèches
// ou santé à 0), ce qui donne directement "à quelle vague ça casse".

import { chromium } from 'playwright';

function argVal(name, def){
  const m = process.argv.find(a => a.startsWith(`--${name}=`));
  return m ? m.split('=').slice(1).join('=') : def;
}

const TRIALS = parseInt(argVal('trials', '30'), 10);
const MAX_FRAMES = parseInt(argVal('maxFrames', '60000'), 10); // ~1000s de jeu simulé, garde-fou
const URL = argVal('url', 'http://localhost:8930/index.html');

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

const result = await page.evaluate(({ trials, maxFrames }) => {
  function runOne(strategy){
    resetGame(0);
    // point fixe : juste au-dessus du château, dans la zone de
    // régénération — portée illimitée depuis v17.7, pas besoin de bouger
    player.x = STAGE_W/2;
    player.y = REGEN_ZONE.y - 30;
    let builtTower = false;
    const start = performance.now();
    let frame = 0, endWave = 1, reason = 'maxFrames';
    for (; frame < maxFrames; frame++){
      const now = start + frame*16.67;
      update(now);
      // tir continu, façon joueur qui tape vite en boucle
      playerShoot(now, MANUAL_TAP_COOLDOWN_MS);

      if (strategy === 'towers' && frame % 30 === 0){
        // décision toutes les ~0,5s : construit sa tour dès que possible,
        // puis alterne renfort / dégâts avec le surplus d'or
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
      }

      if (gameOver){ endWave = wave; reason = 'breach'; break; }
      if (playerHealth <= 0){ endWave = wave; reason = 'health'; break; } // pas de pub/revivre simulée : la partie s'arrête là
    }
    if (reason === 'maxFrames') endWave = wave; // pas mort avant la limite : on rapporte quand même où elle en était
    return { strategy, endWave, reason, frames: frame, towersBuilt: towers.length, dmgLevel, goldLeft: gold };
  }

  const runs = { solo: [], towers: [] };
  for (let i = 0; i < trials; i++) runs.solo.push(runOne('solo'));
  for (let i = 0; i < trials; i++) runs.towers.push(runOne('towers'));

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
    };
  }

  return {
    solo: summarize(runs.solo),
    towers: summarize(runs.towers),
    soloSample: runs.solo.slice(0, 5),
    towersSample: runs.towers.slice(0, 5),
  };
}, { trials: TRIALS, maxFrames: MAX_FRAMES });

console.log(JSON.stringify(result, null, 2));
if (pageErrors.length) console.log('Erreurs JS pendant la simulation:', pageErrors);
await browser.close();
