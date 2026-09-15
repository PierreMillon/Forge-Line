#!/usr/bin/env node
// Tests automatiques de Forge Line — rejoue les scénarios clés du jeu
// dans un navigateur headless, sans rendu ni attente réelle (même
// principe que simulate.mjs : requestAnimationFrame neutralisé, la
// boucle update() est avancée frame par frame avec une horloge
// synthétique). À lancer AVANT CHAQUE COMMIT :
//
//   node tests.mjs                 (démarre lui-même un serveur local)
//   node tests.mjs --url=http://127.0.0.1:9020/index.html   (serveur déjà lancé)
//
// Sortie : une ligne OK / ÉCHEC par scénario, code de sortie 1 si un
// seul échoue. Chaque scénario repart d'une partie neuve (resetGame).
//
// v18.10 (Pierre, en quiz : "Fiabiliser : tests automatiques") — les
// régressions signalées à la main ces dernières versions (Recommencer
// qui ne repartait pas de zéro, bouton Vague qui vidait la vague au
// lieu d'empiler, escalier impossible, Forge/tours/or de départ,
// marchands qui ne devenaient pas soldats) sont exactement les
// scénarios rejoués ici.

import { spawn } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import { argVal, openGamePage } from './harness.mjs'; // v18.14 : harnais commun avec simulate.mjs

const here = path.dirname(fileURLToPath(import.meta.url));
const PORT = 9031;
let URL = argVal('url', null);
let server = null;
if (!URL){
  // v18.14 (revue de code) : un serveur orphelin sur 9031 (lancement
  // précédent planté avant le kill) répondrait au HEAD et masquerait un
  // spawn mort "address in use" — on surveille l'erreur du processus et on
  // ne sonde qu'après un petit délai
  server = spawn('python3', ['-m', 'http.server', String(PORT), '--bind', '127.0.0.1'], { cwd: here, stdio: 'ignore' });
  let serverError = null;
  server.on('error', e => { serverError = e; });
  server.on('exit', code => { if (code !== null && code !== 0) serverError = new Error(`serveur local terminé (code ${code})`); });
  URL = `http://127.0.0.1:${PORT}/index.html`;
  let up = false;
  for (let i = 0; i < 50 && !up && !serverError; i++){
    await new Promise(r => setTimeout(r, 200));
    try { const r = await fetch(URL, { method: 'HEAD' }); up = r.ok; } catch (e) { /* pas encore prêt */ }
  }
  if (!up){ console.error('ÉCHEC  serveur local injoignable' + (serverError ? ' : ' + serverError.message : '')); server.kill(); process.exit(1); }
}

let browser = null, page = null, pageErrors = [];
let failures = 0;
try {
({ browser, page, pageErrors } = await openGamePage(URL));

// horloge synthétique partagée par tous les scénarios (__H.buildAt vient de harness.mjs)
await page.evaluate(() => {
  window.__T = {
    t: performance.now() + 1000,
    advance(n){ for (let i = 0; i < n; i++){ this.t += 16.67; update(this.t); } return this.t; },
    fresh(){ resetGame(STARTING_GOLD); this.t = performance.now() + 1000; player.x = STAGE_W/2; player.y = playerSpawnY(); },
    buildAt(dx, kind){ return __H.buildAt(dx, kind); },
  };
});

const scenarios = [
  ['chargement sans erreur, or de départ = une tour', () => {
    __T.fresh(); __T.advance(60);
    const ok = gold === STARTING_GOLD && STARTING_GOLD === TOWER_BUILD_COST && towers.length === 0 && wave === 1 && boats.length >= 1 && !gameOver && !forgeBuilt; // (pickBoatCount : parfois 2 bateaux pour une vague)
    return { ok, detail: `or ${gold}/${STARTING_GOLD}, tours ${towers.length}, vague ${wave}, bateaux ${boats.length}, forge ${forgeBuilt}` };
  }],
  ['première tour sans Forge, puis renfort sur place', () => {
    __T.fresh();
    const built = __T.buildAt(0, 'tower');
    const r1 = { built, gold, level: towers[0] && towers[0].level };
    gold = 100;
    const t = towers[0]; player.x = t.x; player.y = t.y + 22; tryTowerAction();
    const ok = r1.built && r1.gold === 0 && !forgeBuilt && towers.length === 1 && t.level === 2 && gold === 100 - TOWER_UPGRADE_COST;
    return { ok, detail: `bâtie ${r1.built}, or après ${r1.gold}, niveau après renfort ${t.level}, or ${gold}` };
  }],
  ['coût de tour croissant : 20, 26, 34 puis 44', () => {
    __T.fresh(); gold = 1000;
    const costs = [];
    for (const dx of [0, -96, 96]){ costs.push(buildCost('tower')); __T.buildAt(dx, 'tower'); }
    const next = buildCost('tower');
    const ok = towers.length === 3 && costs.join(',') === '20,26,34' && next === 44 && gold === 920;
    return { ok, detail: `coûts ${costs.join(',')} puis ${next}, tours ${towers.length}, or ${gold}` };
  }],
  ['Forge : 50 or sur place, débloque les améliorations du bandeau', () => {
    __T.fresh(); gold = 1000; refreshBonusbar();
    const dmgBtn = document.getElementById('damage-btn');
    const lockedBefore = dmgBtn.disabled; dmgBtn.click(); const dmgBefore = dmgLevel;
    player.x = FORGE_ZONE.x + FORGE_ZONE.w/2; player.y = FORGE_ZONE.y + FORGE_ZONE.h/2;
    gold = FORGE_BUILD_COST - 1; const refused = !tryBuildForge();
    gold = FORGE_BUILD_COST; const built = tryBuildForge(); const goldAfter = gold;
    gold = 1000; refreshBonusbar();
    const unlocked = !dmgBtn.disabled; dmgBtn.click();
    const ok = FORGE_BUILD_COST === 50 && lockedBefore && dmgBefore === 0 && refused && built && forgeBuilt && goldAfter === 0 && unlocked && dmgLevel === 1;
    return { ok, detail: `coût ${FORGE_BUILD_COST}, verrouillé avant ${lockedBefore}, refus à 49 ${refused}, bâtie ${built}, or après ${goldAfter}, déverrouillé ${unlocked}, dégâts ${dmgLevel}` };
  }],
  ['bouton Vague : 3 appuis = 3 bateaux de plus, vagues empilées', () => {
    __T.fresh(); __T.advance(5);
    const btn = document.getElementById('skip-wave-btn');
    const added = [];
    for (let i = 0; i < 3; i++){ const n = boats.length; btn.click(); added.push(boats.length - n); } // chaque appui ajoute au moins un bateau (pickBoatCount peut en donner 2), sans retirer les autres
    const expected = [1, 2, 3, 4].reduce((s, w) => s + enemiesForWave(w), 0);
    const ok = wave === 4 && added.every(a => a >= 1) && enemiesThisWave === expected && gold > STARTING_GOLD && enemies.length === 0;
    return { ok, detail: `vague ${wave}, bateaux ajoutés par appui ${added.join('/')}, ennemis attendus ${enemiesThisWave}/${expected}, or ${gold}` };
  }],
  ['niveau 10 : boss garanti ; puis carte 2 neuve sans cheval ; niveau 20 : boss puis victoire', () => {
    __T.fresh(); __T.buildAt(0, 'tower'); breaches = 5;
    // un cheval appelé par l'eau plus tôt (recharge posée) ne doit pas faire sauter le boss (v18.14)
    trojanCooldownUntilWave = 13;
    const bossAt = (w) => { wave = w; enemiesThisWave = 5; spawned = 0; boats = []; enemies = []; __T.advance(1); return enemies.filter(e => e.isTrojan).length; };
    const boss10 = bossAt(10);
    enemies = []; spawned = enemiesThisWave; __T.advance(1); // fin du niveau 10 → carte 2
    const map2 = { wave, map: mapOfWave(wave), level: levelOfWave(wave), towers: towers.length, gold, breaches, gameOver, horses: enemies.filter(e => e.isTrojan).length };
    const boss20 = bossAt(20);
    enemies = []; spawned = enemiesThisWave; __T.advance(1); // fin du niveau 20 → victoire
    const over = document.getElementById('over').style.display;
    const ok = boss10 === 1 && map2.wave === 11 && map2.map === 2 && map2.level === 1 && map2.towers === 0 && map2.gold >= STARTING_GOLD && map2.breaches === 0 && !map2.gameOver && map2.horses === 0 && boss20 === 1 && victory && gameOver && over === 'flex';
    return { ok, detail: `boss niv.10 ${boss10} ; après : vague ${map2.wave} (carte ${map2.map}, niveau ${map2.level}), tours ${map2.towers}, brèches ${map2.breaches}, chevaux ${map2.horses} ; boss niv.20 ${boss20} ; victoire ${victory}, écran ${over}` };
  }],
  ['escalier : pousser vers le mur monte, pousser vers le sol descend', () => {
    __T.fresh();
    const W = wallScreen();
    const bandTop = W.groundY - WALL_NATIVE_FOOTPRINT_DEPTH * W.sY - WALL_PLAYER_PAD;
    player.x = W.leftX + 40 * W.sX; player.y = bandTop - 20;
    keys['s'] = true; __T.advance(40); keys['s'] = false;
    const up = playerOnWall;
    __T.advance(45); // cooldown après la montée
    keys['z'] = true; __T.advance(40); keys['z'] = false;
    const down = !playerOnWall && !playerClimb;
    const ok = up && down;
    return { ok, detail: `monté ${up}, redescendu ${down}` };
  }],
  ['caravane : le chariot arrive, les marchands entrent et deviennent soldats', () => {
    __T.fresh(); boats = []; enemies = []; enemiesThisWave = 5; spawned = 0; // sans bateau posé, personne ne débarque et la vague ne se termine pas
    spawnCaravan();
    const n0 = merchants.length, aboard0 = merchants.every(m => m.aboard);
    let frames = 0;
    while (activeCaravan && frames < 6000){ __T.advance(10); frames += 10; }
    const ok = n0 >= MERCHANT_MIN && n0 <= MERCHANT_MAX && aboard0 && !activeCaravan && merchants.length === 0 && soldiers.length === SOLDIER_COUNT_REWARD && gold > STARTING_GOLD;
    return { ok, detail: `marchands ${n0} (à bord ${aboard0}), frames ${frames}, soldats ${soldiers.length}/${SOLDIER_COUNT_REWARD}, or ${gold}` };
  }],
  ['soldats : le bouton bascule Suivent / Autonomes', () => {
    __T.fresh();
    const btn = document.getElementById('soldier-mode-btn');
    const a = soldiersFollow; btn.click(); const b = soldiersFollow; btn.click(); const c = soldiersFollow;
    const ok = a === false && b === true && c === false;
    return { ok, detail: `${a} → ${b} → ${c}` };
  }],
  ['Recommencer (menu et écran de fin) repart vraiment de zéro', () => {
    const dirty = () => { gold = 500; wave = 7; __T.buildAt(0, 'tower'); forgeBuilt = true; dmgLevel = 3; soldiersFollow = true; };
    const clean = () => {
      let save = null; try { save = JSON.parse(localStorage.getItem('forgeLineSave')); } catch (e) { /* ignore */ }
      return wave === 1 && gold === STARTING_GOLD && towers.length === 0 && !forgeBuilt && dmgLevel === 0 && soldiersFollow === false && save && save.wave === 1 && save.gold === STARTING_GOLD;
    };
    unlockAutoSave(); // la sauvegarde locale n'existe qu'une fois débloquée (après une pub) : c'est là que le bug v17.46 se cachait
    __T.fresh(); dirty(); document.getElementById('menu-restart').click(); const viaMenu = clean();
    __T.fresh(); dirty(); document.getElementById('restart-btn').click(); const viaOver = clean();
    try { localStorage.removeItem('forgeLineUnlocked'); localStorage.removeItem('forgeLineSave'); } catch (e) { /* ignore */ }
    return { ok: viaMenu && viaOver, detail: `menu ${viaMenu}, écran de fin ${viaOver} (vague ${wave}, or ${gold}, tours ${towers.length})` };
  }],
  ['renfort : +12 %/palier, jamais moins rentable qu\'une tour neuve', () => {
    __T.fresh();
    const d1 = towerDamage({ level: 1 }), d2 = towerDamage({ level: 2 }), d3 = towerDamage({ level: 3 });
    const h1 = towerMaxHpAtLevel(1), h2 = towerMaxHpAtLevel(2);
    const ok = TOWER_REINFORCE_GROWTH === 1.12 && d2 > d1 && d3 - d2 >= d2 - d1 && h2 > h1 && towerUpgradeCost({ level: 1 }) === TOWER_BUILD_COST;
    return { ok, detail: `dégâts ${d1}/${d2}/${d3}, PV ${h1}/${h2}, renfort niv.1 = ${towerUpgradeCost({ level: 1 })} or` };
  }],
  ['fumée : 3000 frames de jeu avec une tour, aucun NaN', () => {
    __T.fresh(); __T.buildAt(0, 'tower');
    __T.advance(3000);
    const finite = [player.x, player.y, gold, playerHealth].every(Number.isFinite) && enemies.every(e => Number.isFinite(e.x) && Number.isFinite(e.y)) && towers.every(t => Number.isFinite(t.hp));
    const ok = finite && wave >= 1 && spawned > 0;
    return { ok, detail: `vague ${wave}, débarqués ${spawned}, ennemis vivants ${enemies.length}, or ${gold}, brèches ${breaches}` };
  }],
];

for (const [name, fn] of scenarios){
  pageErrors.length = 0;
  let r;
  try { r = await page.evaluate(fn); }
  catch (e) { r = { ok: false, detail: 'exception : ' + String(e).split('\n')[0] }; }
  if (pageErrors.length){ r.ok = false; r.detail += ' | erreur de page : ' + pageErrors.join(' ; '); }
  if (!r.ok) failures++;
  console.log(`${r.ok ? 'OK    ' : 'ÉCHEC '} ${name} — ${r.detail}`);
}
console.log(failures ? `\n${failures} scénario(s) en échec sur ${scenarios.length}` : `\n${scenarios.length} scénarios OK`);
} catch (e) {
  failures++;
  console.error('ÉCHEC  harnais : ' + String(e).split('\n')[0]);
} finally {
  if (browser) await browser.close();
  if (server) server.kill(); // v18.14 : toujours, même si le navigateur n'a pas démarré
}
process.exit(failures ? 1 : 0);
